-- ========================================
-- ADD MODEL CATEGORIES TO PROMPTS
-- ========================================
-- This migration adds model_category support to allow prompts
-- to be tagged with different model types (LLM, Music, Video, Image, etc.)
-- ========================================

-- Add new columns for model categorization
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS model_category TEXT, -- 'LLM', 'Music', 'Video', 'Image', 'Voice', 'Code'
ADD COLUMN IF NOT EXISTS model_id TEXT;        -- Specific model identifier

-- Add indexes for filtering and searching
CREATE INDEX IF NOT EXISTS prompts_model_category_idx ON public.prompts(model_category);
CREATE INDEX IF NOT EXISTS prompts_model_id_idx ON public.prompts(model_id);

-- Add composite index for filtering prompts by category and model
CREATE INDEX IF NOT EXISTS prompts_category_model_idx ON public.prompts(model_category, model_id);

-- Create a function to infer category from existing model values
CREATE OR REPLACE FUNCTION infer_model_category(model_name TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Music models
  IF model_name IN ('suno', 'udio', 'mubert', 'aiva') THEN
    RETURN 'Music';
  -- Video models
  ELSIF model_name IN ('runway', 'pika', 'sora', 'veo', 'google-veo') THEN
    RETURN 'Video';
  -- Image models
  ELSIF model_name IN ('dall-e', 'midjourney', 'stable-diffusion', 'leonardo', 'leonardo-ai') THEN
    RETURN 'Image';
  -- Voice models
  ELSIF model_name IN ('elevenlabs', 'playht', 'eleven-labs') THEN
    RETURN 'Voice';
  -- Code models
  ELSIF model_name IN ('github-copilot', 'cursor', 'codeium') THEN
    RETURN 'Code';
  -- Default to LLM for existing GPT, Claude, Gemini, etc.
  ELSE
    RETURN 'LLM';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Backfill existing prompts with inferred categories
UPDATE public.prompts
SET model_category = infer_model_category(LOWER(model)),
    model_id = LOWER(model)
WHERE model_category IS NULL;

-- Drop the helper function after migration
DROP FUNCTION IF EXISTS infer_model_category(TEXT);

-- Add comment to schema
COMMENT ON COLUMN public.prompts.model_category IS 'Category of the model: LLM, Music, Video, Image, Voice, Code';
COMMENT ON COLUMN public.prompts.model_id IS 'Specific model identifier within the category';

-- Update RLS policies if needed (no change required, existing policies work)

