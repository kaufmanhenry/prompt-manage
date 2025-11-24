-- Migration to add analytics tracking tables for shares and likes
-- Created: 2025-01-25

-- Create prompt_shares table to track when users share prompts
CREATE TABLE IF NOT EXISTS public.prompt_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  platform TEXT NOT NULL, -- 'twitter', 'linkedin', 'facebook', 'reddit', 'copy_link'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_prompt_shares_prompt_id ON public.prompt_shares(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_shares_created_at ON public.prompt_shares(created_at);
CREATE INDEX IF NOT EXISTS idx_prompt_shares_platform ON public.prompt_shares(platform);

-- Enable RLS
ALTER TABLE public.prompt_shares ENABLE ROW LEVEL SECURITY;

-- RLS: Anyone can insert shares (tracking is public)
CREATE POLICY "Anyone can insert shares"
  ON public.prompt_shares FOR INSERT
  WITH CHECK (true);

-- RLS: Anyone can read share stats
CREATE POLICY "Anyone can read shares"
  ON public.prompt_shares FOR SELECT
  USING (true);

-- Create prompt_likes table to track when users like prompts
CREATE TABLE IF NOT EXISTS public.prompt_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(prompt_id, user_id) -- One like per user per prompt
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_prompt_likes_prompt_id ON public.prompt_likes(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_likes_user_id ON public.prompt_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_likes_created_at ON public.prompt_likes(created_at);

-- Enable RLS
ALTER TABLE public.prompt_likes ENABLE ROW LEVEL SECURITY;

-- RLS: Users can like prompts
CREATE POLICY "Users can like prompts"
  ON public.prompt_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS: Users can unlike prompts
CREATE POLICY "Users can unlike prompts"
  ON public.prompt_likes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS: Anyone can read likes
CREATE POLICY "Anyone can read likes"
  ON public.prompt_likes FOR SELECT
  USING (true);

-- Add click_count column to ai_tools for tracking website clicks
ALTER TABLE public.ai_tools
ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;

-- Create tool_clicks table for detailed click tracking
CREATE TABLE IF NOT EXISTS public.tool_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.ai_tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tool_clicks_tool_id ON public.tool_clicks(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_clicks_created_at ON public.tool_clicks(created_at);

-- Enable RLS
ALTER TABLE public.tool_clicks ENABLE ROW LEVEL SECURITY;

-- RLS: Anyone can track clicks
CREATE POLICY "Anyone can track clicks"
  ON public.tool_clicks FOR INSERT
  WITH CHECK (true);

-- RLS: Anyone can read clicks
CREATE POLICY "Anyone can read clicks"
  ON public.tool_clicks FOR SELECT
  USING (true);
