-- ========================================
-- FINALIZE MODEL CATEGORIZATION
-- ========================================
-- This migration ensures all prompts have proper model_category and model_id
-- and adds additional model support for image generation tools
-- ========================================

-- Ensure columns exist (idempotent)
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS model_category TEXT,
ADD COLUMN IF NOT EXISTS model_id TEXT;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS prompts_model_category_idx ON public.prompts(model_category);
CREATE INDEX IF NOT EXISTS prompts_model_id_idx ON public.prompts(model_id);
CREATE INDEX IF NOT EXISTS prompts_category_model_idx ON public.prompts(model_category, model_id);

-- Add composite index for filtering public prompts by category and model
CREATE INDEX IF NOT EXISTS prompts_public_category_model_idx 
ON public.prompts(model_category, model_id) 
WHERE is_public = true;

-- Function to map model names to proper IDs
CREATE OR REPLACE FUNCTION normalize_model_id(raw_model TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Normalize input
  IF raw_model IS NULL THEN RETURN NULL; END IF;
  
  CASE LOWER(raw_model)
    -- Music models
    WHEN 'suno', 'suno v4', 'suno-v4' THEN RETURN 'suno-v4';
    WHEN 'udio', 'udio-ai' THEN RETURN 'udio';
    
    -- Video models  
    WHEN 'runway', 'runway gen-3', 'runway-gen-3' THEN RETURN 'runway-gen-3';
    WHEN 'pika', 'pika 2', 'pika-2' THEN RETURN 'pika-2';
    WHEN 'google veo', 'google-veo', 'veo' THEN RETURN 'google-veo';
    
    -- Image models
    WHEN 'midjourney', 'mj', 'mid-journey' THEN RETURN 'midjourney';
    WHEN 'dall-e', 'dall-e 3', 'dall-e3', 'dalle3', 'dalle-3' THEN RETURN 'dall-e-3';
    WHEN 'stable diffusion', 'stable-diffusion', 'sd' THEN RETURN 'stable-diffusion';
    
    -- LLM models
    WHEN 'gpt-5', 'gpt5' THEN RETURN 'gpt-5';
    WHEN 'gpt-4o', 'gpt4o', 'gpt-4 o' THEN RETURN 'gpt-4o';
    WHEN 'gpt-4', 'gpt4' THEN RETURN 'gpt-4';
    WHEN 'gpt-3.5-turbo', 'gpt3.5', 'gpt-3.5' THEN RETURN 'gpt-3.5-turbo';
    WHEN 'claude', 'claude-4', 'claude 4' THEN RETURN 'claude-4-opus';
    WHEN 'claude-4-sonnet' THEN RETURN 'claude-4-sonnet';
    WHEN 'gemini', 'gemini-1.5-pro', 'gemini-pro' THEN RETURN 'gemini-1.5-pro';
    
    -- Keep as-is for already normalized IDs
    ELSE RETURN raw_model;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to infer category from model name
CREATE OR REPLACE FUNCTION infer_model_category(model_name TEXT)
RETURNS TEXT AS $$
BEGIN
  IF model_name IS NULL THEN RETURN 'LLM'; END IF;
  
  CASE LOWER(model_name)
    WHEN 'suno-v4', 'udio' THEN RETURN 'Music';
    WHEN 'runway-gen-3', 'pika-2', 'google-veo' THEN RETURN 'Video';
    WHEN 'midjourney', 'dall-e-3', 'stable-diffusion' THEN RETURN 'Image';
    ELSE RETURN 'LLM'; -- Default for GPT, Claude, Gemini, etc.
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Backfill all existing prompts with normalized model_id and model_category
UPDATE public.prompts
SET 
  model_id = normalize_model_id(model),
  model_category = infer_model_category(normalize_model_id(model))
WHERE model_id IS NULL OR model_category IS NULL;

-- Clean up functions
DROP FUNCTION IF EXISTS normalize_model_id(TEXT);
DROP FUNCTION IF EXISTS infer_model_category(TEXT);

-- Add helpful comments
COMMENT ON COLUMN public.prompts.model_category IS 'Category of the AI model: LLM, Music, Video, Image, Voice, Code';
COMMENT ON COLUMN public.prompts.model_id IS 'Specific model identifier (e.g., gpt-5, suno-v4, midjourney)';

-- Verify migration completed
DO $$
BEGIN
  RAISE NOTICE 'Migration completed. Verified % prompts have model_category set.',
    (SELECT COUNT(*) FROM public.prompts WHERE model_category IS NOT NULL);
END $$;

