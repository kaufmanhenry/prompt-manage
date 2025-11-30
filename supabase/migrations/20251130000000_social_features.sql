-- Social Features Migration
-- Adds support for tool upvotes and comments

-- 1. Tool Upvotes Table
-- Tracks unique upvotes per user per tool to prevent duplicates
CREATE TABLE IF NOT EXISTS public.tool_upvotes (
  tool_id UUID NOT NULL REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (tool_id, user_id)
);

-- Enable RLS
ALTER TABLE public.tool_upvotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Upvotes
CREATE POLICY "Users can upvote tools"
  ON public.tool_upvotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their upvotes"
  ON public.tool_upvotes FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view upvotes"
  ON public.tool_upvotes FOR SELECT
  USING (true);

-- 2. Comments Table
-- Allows users to comment on tools
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 1000),
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- For nested replies (optional for now)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Comments
CREATE POLICY "Users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comments"
  ON public.comments FOR SELECT
  USING (true);

-- 3. Trigger to update upvote_count on ai_tools
-- Automatically keeps the count in sync
CREATE OR REPLACE FUNCTION update_tool_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.ai_tools
    SET upvote_count = upvote_count + 1
    WHERE id = NEW.tool_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.ai_tools
    SET upvote_count = GREATEST(0, upvote_count - 1)
    WHERE id = OLD.tool_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_update_tool_upvote_count ON public.tool_upvotes;
CREATE TRIGGER trg_update_tool_upvote_count
  AFTER INSERT OR DELETE ON public.tool_upvotes
  FOR EACH ROW
  EXECUTE FUNCTION update_tool_upvote_count();

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tool_upvotes_user_id ON public.tool_upvotes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_tool_id ON public.comments(tool_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);

-- Comments
COMMENT ON TABLE public.tool_upvotes IS 'Tracks unique upvotes for AI tools by users';
COMMENT ON TABLE public.comments IS 'User comments on AI tools';

-- ============================================================================
-- PROMPTS UPVOTES
-- ============================================================================

-- 5. Add upvote_count column to prompts table
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS upvote_count INTEGER DEFAULT 0;

-- 6. Prompt Upvotes Table
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

-- 7. Trigger to update upvote_count on prompts
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

-- 8. Indexes for prompt upvotes performance
CREATE INDEX IF NOT EXISTS idx_prompt_upvotes_user_id ON public.prompt_upvotes(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_upvotes_prompt_id ON public.prompt_upvotes(prompt_id);

-- Comments
COMMENT ON TABLE public.prompt_upvotes IS 'Tracks unique upvotes for prompts by users';
