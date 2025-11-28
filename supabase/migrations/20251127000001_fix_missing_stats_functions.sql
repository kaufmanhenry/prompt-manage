-- Fix missing stats tracking functions and tables
-- This migration adds critical missing infrastructure for stats tracking

-- 1. Fix parent_id inconsistency: The DB has parent_id but code expects parent_prompt_id
-- We'll add parent_prompt_id as an alias/view or rename the column
ALTER TABLE public.prompts
  RENAME COLUMN parent_id TO parent_prompt_id;

-- Update the foreign key constraint name if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'prompts_parent_id_fkey'
    AND table_name = 'prompts'
  ) THEN
    ALTER TABLE public.prompts
      RENAME CONSTRAINT prompts_parent_id_fkey TO prompts_parent_prompt_id_fkey;
  END IF;
END $$;

-- 2. Create missing tool_favorites table
CREATE TABLE IF NOT EXISTS public.tool_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tool_id, user_id) -- One favorite per user per tool
);

-- Create indexes for tool_favorites
CREATE INDEX IF NOT EXISTS idx_tool_favorites_tool_id ON public.tool_favorites(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_favorites_user_id ON public.tool_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_favorites_created_at ON public.tool_favorites(created_at);

-- Enable RLS on tool_favorites
ALTER TABLE public.tool_favorites ENABLE ROW LEVEL SECURITY;

-- RLS: Users can favorite tools
CREATE POLICY "Users can favorite tools"
  ON public.tool_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS: Users can unfavorite tools
CREATE POLICY "Users can unfavorite tools"
  ON public.tool_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- RLS: Anyone can read favorites
CREATE POLICY "Anyone can read favorites"
  ON public.tool_favorites FOR SELECT
  USING (true);

-- 3. Create copy_public_prompt function (aliasing fork_public_prompt)
-- The code calls copy_public_prompt but the DB has fork_public_prompt
-- We'll create copy_public_prompt that calls fork_public_prompt
CREATE OR REPLACE FUNCTION copy_public_prompt(
  source_prompt_id UUID,
  target_user_id UUID,
  new_name TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_prompt_id UUID;
  source_prompt RECORD;
  final_name TEXT;
  base_slug TEXT;
  final_slug TEXT;
  slug_suffix INTEGER := 0;
BEGIN
  -- Get the source prompt
  SELECT * INTO source_prompt
  FROM public.prompts
  WHERE id = source_prompt_id AND is_public = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Public prompt not found';
  END IF;

  -- Check if user already has a copy
  IF EXISTS (
    SELECT 1 FROM public.prompts
    WHERE parent_prompt_id = source_prompt_id
    AND user_id = target_user_id
  ) THEN
    RAISE EXCEPTION 'User already has a copy of this prompt';
  END IF;

  -- Determine the name
  final_name := COALESCE(new_name, source_prompt.name || ' (Copy)');

  -- Generate a unique slug
  base_slug := LOWER(REGEXP_REPLACE(final_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);
  final_slug := base_slug;

  -- Ensure slug is unique
  WHILE EXISTS (SELECT 1 FROM public.prompts WHERE slug = final_slug) LOOP
    slug_suffix := slug_suffix + 1;
    final_slug := base_slug || '-' || slug_suffix;
  END LOOP;

  -- Create the copy
  INSERT INTO public.prompts (
    user_id,
    name,
    slug,
    description,
    prompt_text,
    model,
    tags,
    is_public,
    parent_prompt_id,
    version,
    is_forked
  ) VALUES (
    target_user_id,
    final_name,
    final_slug,
    source_prompt.description,
    source_prompt.prompt_text,
    source_prompt.model,
    source_prompt.tags,
    false, -- Copies are private by default
    source_prompt_id,
    1,
    true
  )
  RETURNING id INTO new_prompt_id;

  -- Increment fork count on original
  UPDATE public.prompts
  SET fork_count = COALESCE(fork_count, 0) + 1
  WHERE id = source_prompt_id;

  RETURN new_prompt_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION copy_public_prompt(UUID, UUID, TEXT) TO authenticated;

-- 4. Create get_derivative_prompts function
-- Returns prompts that are copies of a given prompt
CREATE OR REPLACE FUNCTION get_derivative_prompts(prompt_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  description TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ,
  is_public BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.slug,
    p.description,
    p.user_id,
    p.inserted_at as created_at,
    p.is_public
  FROM public.prompts p
  WHERE p.parent_prompt_id = prompt_id
  ORDER BY p.inserted_at DESC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_derivative_prompts(UUID) TO authenticated, anon;

-- 5. Create log_prompt_run function
-- Logs when a prompt is used/run
CREATE OR REPLACE FUNCTION log_prompt_run(
  p_prompt_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_model TEXT DEFAULT NULL,
  p_success BOOLEAN DEFAULT true,
  p_error_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  run_id UUID;
BEGIN
  -- Insert the run record
  INSERT INTO public.prompt_run_history (
    prompt_id,
    user_id,
    model,
    success,
    error_message
  ) VALUES (
    p_prompt_id,
    p_user_id,
    p_model,
    p_success,
    p_error_message
  )
  RETURNING id INTO run_id;

  RETURN run_id;
END;
$$;

-- Grant execute permissions (allow anonymous for public prompt tracking)
GRANT EXECUTE ON FUNCTION log_prompt_run(UUID, UUID, TEXT, BOOLEAN, TEXT) TO authenticated, anon;

-- 6. Add helpful comment
COMMENT ON FUNCTION copy_public_prompt IS 'Creates a copy of a public prompt for a user';
COMMENT ON FUNCTION get_derivative_prompts IS 'Returns all prompts that are derivatives of a given prompt';
COMMENT ON FUNCTION log_prompt_run IS 'Logs when a prompt is executed/used';
