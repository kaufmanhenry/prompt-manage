-- Database Migration Script for Prompt Manage
-- Run this in your Supabase SQL Editor

-- Add new columns to existing prompts table
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- Create a function to generate slugs
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text AS $$
BEGIN
  RETURN lower(regexp_replace(
    regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to generate slugs when prompts are made public
CREATE OR REPLACE FUNCTION generate_prompt_slug()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_public = true AND (NEW.slug IS NULL OR NEW.slug = '') THEN
    NEW.slug := generate_slug(NEW.name) || '-' || substr(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS trigger_generate_prompt_slug ON public.prompts;

-- Create the trigger
CREATE TRIGGER trigger_generate_prompt_slug
  BEFORE INSERT OR UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION generate_prompt_slug();

-- Update the search index to include description
DROP INDEX IF EXISTS prompts_search_idx;
CREATE INDEX prompts_search_idx ON public.prompts
  USING gin (to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || prompt_text));

-- Create indexes for public prompts
CREATE INDEX IF NOT EXISTS prompts_public_idx ON public.prompts (is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS prompts_slug_idx ON public.prompts (slug) WHERE slug IS NOT NULL;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Self‑service prompts" ON public.prompts;

-- Create new RLS policies
CREATE POLICY "Users can manage their own prompts"
  ON public.prompts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can read public prompts"
  ON public.prompts FOR SELECT
  USING (is_public = true);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_prompt_views(prompt_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.prompts 
  SET view_count = view_count + 1 
  WHERE id = prompt_id AND is_public = true;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION increment_prompt_views(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_prompt_views(uuid) TO anon;

-- Prompt Manage Database Migration
-- Run this in your Supabase SQL Editor to enable sharing functionality

-- 1. Add the new columns if they don't exist
DO $$ 
BEGIN
    -- Add is_public column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prompts' AND column_name = 'is_public') THEN
        ALTER TABLE public.prompts ADD COLUMN is_public boolean DEFAULT false;
        RAISE NOTICE 'Added is_public column';
    END IF;
    
    -- Add slug column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prompts' AND column_name = 'slug') THEN
        ALTER TABLE public.prompts ADD COLUMN slug text UNIQUE;
        RAISE NOTICE 'Added slug column';
    END IF;
    
    -- Add view_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'prompts' AND column_name = 'view_count') THEN
        ALTER TABLE public.prompts ADD COLUMN view_count integer DEFAULT 0;
        RAISE NOTICE 'Added view_count column';
    END IF;
END $$;

-- 2. Create the slug generation function
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text AS $$
BEGIN
  RETURN lower(regexp_replace(
    regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
END;
$$ LANGUAGE plpgsql;

-- 3. Create the trigger function for automatic slug generation
CREATE OR REPLACE FUNCTION generate_prompt_slug()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_public = true AND (NEW.slug IS NULL OR NEW.slug = '') THEN
    NEW.slug := generate_slug(NEW.name) || '-' || substr(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create the trigger
DROP TRIGGER IF EXISTS trigger_generate_prompt_slug ON public.prompts;
CREATE TRIGGER trigger_generate_prompt_slug
  BEFORE INSERT OR UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION generate_prompt_slug();

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS prompts_public_idx ON public.prompts (is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS prompts_slug_idx ON public.prompts (slug) WHERE slug IS NOT NULL;

-- 6. Create the view count increment function
CREATE OR REPLACE FUNCTION increment_prompt_views(prompt_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.prompts 
  SET view_count = view_count + 1 
  WHERE id = prompt_id AND is_public = true;
END;
$$ LANGUAGE plpgsql;

-- 7. Update RLS policies to allow public access
DROP POLICY IF EXISTS "Anyone can read public prompts" ON public.prompts;
CREATE POLICY "Anyone can read public prompts"
  ON public.prompts FOR SELECT
  USING (is_public = true);

-- 8. Grant necessary permissions
GRANT EXECUTE ON FUNCTION increment_prompt_views(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_prompt_views(uuid) TO anon;

-- 9. Verify the migration
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'prompts' 
  AND column_name IN ('is_public', 'slug', 'view_count')
ORDER BY column_name;

-- 10. Show current prompts and their sharing status
SELECT 
  id, 
  name, 
  is_public, 
  slug, 
  view_count,
  created_at
FROM public.prompts 
ORDER BY created_at DESC 
LIMIT 10; 