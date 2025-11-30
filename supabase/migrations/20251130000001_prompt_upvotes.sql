-- Prompts Upvotes Migration
-- Extends social features to prompts directory

-- 1. Add upvote_count column to prompts table
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS upvote_count INTEGER DEFAULT 0;

-- 2. Prompt Upvotes Table
-- Tracks unique upvotes per user per prompt to prevent duplicates
CREATE TABLE IF NOT EXISTS public.prompt_upvotes (
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (prompt_id, user_id)
);

-- Enable RLS
ALTER TABLE public.prompt_upvotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Prompt Upvotes
CREATE POLICY "Users can upvote prompts"
  ON public.prompt_upvotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their prompt upvotes"
  ON public.prompt_upvotes FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view prompt upvotes"
  ON public.prompt_upvotes FOR SELECT
  USING (true);

-- 3. Trigger to update upvote_count on prompts
-- Automatically keeps the count in sync
CREATE OR REPLACE FUNCTION update_prompt_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.prompts
    SET upvote_count = upvote_count + 1
    WHERE id = NEW.prompt_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.prompts
    SET upvote_count = GREATEST(0, upvote_count - 1)
    WHERE id = OLD.prompt_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_prompt_upvote_count ON public.prompt_upvotes;
CREATE TRIGGER trg_update_prompt_upvote_count
  AFTER INSERT OR DELETE ON public.prompt_upvotes
  FOR EACH ROW
  EXECUTE FUNCTION update_prompt_upvote_count();

-- 4. Indexes for prompt upvotes performance
CREATE INDEX IF NOT EXISTS idx_prompt_upvotes_user_id ON public.prompt_upvotes(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_upvotes_prompt_id ON public.prompt_upvotes(prompt_id);

-- Comments
COMMENT ON TABLE public.prompt_upvotes IS 'Tracks unique upvotes for prompts by users';
