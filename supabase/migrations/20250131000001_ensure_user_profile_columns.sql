-- Ensure user_profiles table has all necessary columns
-- This migration is idempotent and safe to run multiple times

-- Add missing columns if they don't exist
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add username column for public profiles (if not exists)
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS user_profiles_username_idx ON public.user_profiles(username) WHERE username IS NOT NULL;

-- Add updated_at column if it doesn't exist
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Create or replace trigger to update updated_at
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_profiles_updated_at_trigger ON public.user_profiles;

CREATE TRIGGER user_profiles_updated_at_trigger
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profiles_updated_at();

COMMENT ON COLUMN public.user_profiles.full_name IS 'User''s full name';
COMMENT ON COLUMN public.user_profiles.display_name IS 'Display name shown in the UI';
COMMENT ON COLUMN public.user_profiles.username IS 'Unique username for public profile URLs';
