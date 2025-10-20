-- ========================================
-- PROMPT VERSION CONTROL SYSTEM
-- ========================================
-- This migration adds comprehensive version control to prompts
-- Key features:
-- 1. Public prompts are immutable (can't be edited)
-- 2. Every edit creates a new version
-- 3. Clear duplication/forking system
-- 4. Version history tracking
-- ========================================

-- Add version tracking to existing prompts table
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.prompts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_forked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fork_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMPTZ DEFAULT now();

-- Create prompt_versions table for detailed version history
CREATE TABLE IF NOT EXISTS public.prompt_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE NOT NULL,
  version INTEGER NOT NULL,
  
  -- Snapshot of prompt data at this version
  name TEXT NOT NULL,
  description TEXT,
  prompt_text TEXT NOT NULL,
  model TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  
  -- Version metadata
  change_summary TEXT, -- User-provided summary of changes
  change_type TEXT DEFAULT 'edit' CHECK (change_type IN ('create', 'edit', 'fork', 'revert')),
  
  -- User and timing
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure unique version per prompt
  UNIQUE(prompt_id, version)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS prompt_versions_prompt_id_idx ON public.prompt_versions(prompt_id);
CREATE INDEX IF NOT EXISTS prompt_versions_version_idx ON public.prompt_versions(prompt_id, version DESC);
CREATE INDEX IF NOT EXISTS prompt_versions_created_at_idx ON public.prompt_versions(created_at DESC);

-- Enable RLS on prompt_versions
ALTER TABLE public.prompt_versions ENABLE ROW LEVEL SECURITY;

-- RLS policies for prompt_versions
CREATE POLICY "Users can view versions of their own prompts"
  ON public.prompt_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.prompts 
      WHERE prompts.id = prompt_versions.prompt_id 
      AND prompts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view versions of public prompts"
  ON public.prompt_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.prompts 
      WHERE prompts.id = prompt_versions.prompt_id 
      AND prompts.is_public = true
    )
  );

CREATE POLICY "Users can create versions for their own prompts"
  ON public.prompt_versions FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.prompts 
      WHERE prompts.id = prompt_versions.prompt_id 
      AND prompts.user_id = auth.uid()
    )
  );

-- Function to create a new version when prompt is updated
CREATE OR REPLACE FUNCTION create_prompt_version()
RETURNS TRIGGER AS $$
DECLARE
  next_version INTEGER;
  old_prompt RECORD;
BEGIN
  -- Get the current version number
  SELECT COALESCE(MAX(version), 0) + 1 INTO next_version
  FROM public.prompt_versions 
  WHERE prompt_id = NEW.id;
  
  -- Only create version if this is an update (not insert)
  IF TG_OP = 'UPDATE' THEN
    -- Check if any significant fields changed
    IF OLD.name != NEW.name OR 
       OLD.description != NEW.description OR 
       OLD.prompt_text != NEW.prompt_text OR 
       OLD.model != NEW.model OR 
       OLD.tags != NEW.tags THEN
      
      -- Insert the old version into prompt_versions
      INSERT INTO public.prompt_versions (
        prompt_id, version, name, description, prompt_text, model, tags,
        change_type, created_by, created_at
      ) VALUES (
        OLD.id, OLD.version, OLD.name, OLD.description, OLD.prompt_text, OLD.model, OLD.tags,
        'edit', OLD.user_id, OLD.last_edited_at
      );
      
      -- Update the prompt with new version number
      NEW.version := next_version;
      NEW.last_edited_at := now();
    END IF;
  ELSIF TG_OP = 'INSERT' THEN
    -- For new prompts, create initial version
    INSERT INTO public.prompt_versions (
      prompt_id, version, name, description, prompt_text, model, tags,
      change_type, created_by, created_at
    ) VALUES (
      NEW.id, 1, NEW.name, NEW.description, NEW.prompt_text, NEW.model, NEW.tags,
      'create', NEW.user_id, now()
    );
    
    NEW.version := 1;
    NEW.last_edited_at := now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for version control
DROP TRIGGER IF EXISTS trigger_prompt_version_control ON public.prompts;
CREATE TRIGGER trigger_prompt_version_control
  BEFORE INSERT OR UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION create_prompt_version();

-- Function to fork a public prompt
CREATE OR REPLACE FUNCTION fork_public_prompt(
  source_prompt_id UUID,
  new_name TEXT,
  new_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_prompt_id UUID;
  source_prompt RECORD;
BEGIN
  -- Get the source prompt (must be public)
  SELECT * INTO source_prompt
  FROM public.prompts
  WHERE id = source_prompt_id AND is_public = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Public prompt not found or not public';
  END IF;
  
  -- Create new prompt
  INSERT INTO public.prompts (
    user_id, name, description, prompt_text, model, tags, is_public,
    version, parent_id, is_forked, fork_count
  ) VALUES (
    auth.uid(), 
    new_name, 
    COALESCE(new_description, source_prompt.description),
    source_prompt.prompt_text, 
    source_prompt.model, 
    source_prompt.tags, 
    false, -- Forked prompts start as private
    1, -- Start at version 1
    source_prompt_id, -- Reference to original
    true, -- Mark as forked
    0 -- No forks yet
  ) RETURNING id INTO new_prompt_id;
  
  -- Increment fork count on source prompt
  UPDATE public.prompts 
  SET fork_count = fork_count + 1
  WHERE id = source_prompt_id;
  
  -- Create initial version for the fork
  INSERT INTO public.prompt_versions (
    prompt_id, version, name, description, prompt_text, model, tags,
    change_type, created_by, created_at
  ) VALUES (
    new_prompt_id, 1, new_name, COALESCE(new_description, source_prompt.description),
    source_prompt.prompt_text, source_prompt.model, source_prompt.tags,
    'fork', auth.uid(), now()
  );
  
  RETURN new_prompt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to revert to a previous version
CREATE OR REPLACE FUNCTION revert_prompt_to_version(
  prompt_id UUID,
  target_version INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  version_data RECORD;
  current_user_id UUID;
BEGIN
  -- Get current user
  current_user_id := auth.uid();
  
  -- Verify user owns the prompt
  IF NOT EXISTS (
    SELECT 1 FROM public.prompts 
    WHERE id = prompt_id AND user_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'You can only revert your own prompts';
  END IF;
  
  -- Get the target version data
  SELECT * INTO version_data
  FROM public.prompt_versions
  WHERE prompt_id = prompt_id AND version = target_version;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Version % not found for this prompt', target_version;
  END IF;
  
  -- Update the prompt with the version data
  UPDATE public.prompts SET
    name = version_data.name,
    description = version_data.description,
    prompt_text = version_data.prompt_text,
    model = version_data.model,
    tags = version_data.tags,
    last_edited_at = now()
  WHERE id = prompt_id;
  
  -- Create a new version record for the revert
  INSERT INTO public.prompt_versions (
    prompt_id, version, name, description, prompt_text, model, tags,
    change_type, change_summary, created_by, created_at
  ) VALUES (
    prompt_id, 
    (SELECT COALESCE(MAX(version), 0) + 1 FROM public.prompt_versions WHERE prompt_id = prompt_id),
    version_data.name, version_data.description, version_data.prompt_text, 
    version_data.model, version_data.tags,
    'revert', 'Reverted to version ' || target_version, current_user_id, now()
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get version history for a prompt
CREATE OR REPLACE FUNCTION get_prompt_version_history(prompt_id UUID)
RETURNS TABLE (
  version INTEGER,
  name TEXT,
  description TEXT,
  prompt_text TEXT,
  model TEXT,
  tags TEXT[],
  change_type TEXT,
  change_summary TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pv.version,
    pv.name,
    pv.description,
    pv.prompt_text,
    pv.model,
    pv.tags,
    pv.change_type,
    pv.change_summary,
    pv.created_by,
    pv.created_at
  FROM public.prompt_versions pv
  WHERE pv.prompt_id = prompt_id
  ORDER BY pv.version DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing prompts to have version 1
UPDATE public.prompts 
SET version = 1, last_edited_at = COALESCE(updated_at, inserted_at)
WHERE version IS NULL;

-- Create initial versions for existing prompts
INSERT INTO public.prompt_versions (
  prompt_id, version, name, description, prompt_text, model, tags,
  change_type, created_by, created_at
)
SELECT 
  id, 1, name, description, prompt_text, model, tags,
  'create', user_id, COALESCE(inserted_at, now())
FROM public.prompts
WHERE NOT EXISTS (
  SELECT 1 FROM public.prompt_versions WHERE prompt_versions.prompt_id = prompts.id
);

-- Add constraint to prevent editing public prompts
CREATE OR REPLACE FUNCTION prevent_public_prompt_edit()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent updates to public prompts (except for view_count, fork_count)
  IF TG_OP = 'UPDATE' AND OLD.is_public = true THEN
    -- Allow only specific fields to be updated
    IF OLD.name != NEW.name OR 
       OLD.description != NEW.description OR 
       OLD.prompt_text != NEW.prompt_text OR 
       OLD.model != NEW.model OR 
       OLD.tags != NEW.tags OR
       OLD.is_public != NEW.is_public THEN
      RAISE EXCEPTION 'Public prompts cannot be edited. Use "Duplicate & Edit" to create a copy.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent editing public prompts
DROP TRIGGER IF EXISTS trigger_prevent_public_edit ON public.prompts;
CREATE TRIGGER trigger_prevent_public_edit
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION prevent_public_prompt_edit();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION fork_public_prompt(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION revert_prompt_to_version(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_prompt_version_history(UUID) TO authenticated;
