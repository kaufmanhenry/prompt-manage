-- Create user_profiles table with all necessary columns
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          uuid primary key references auth.users on delete cascade,
  display_name text,
  bio         text,
  avatar_url  text,
  website     text,
  location    text,
  email_notifications boolean DEFAULT true,
  dark_mode boolean DEFAULT false,
  theme_preference text DEFAULT 'system',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS: Users can read all profiles (for public display)
CREATE POLICY "Anyone can read user profiles"
  ON public.user_profiles FOR SELECT
  USING (true);

-- RLS: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Add comments for documentation
COMMENT ON TABLE public.user_profiles IS 'User profile information and preferences';
COMMENT ON COLUMN public.user_profiles.email_notifications IS 'Whether the user wants to receive email notifications';
COMMENT ON COLUMN public.user_profiles.dark_mode IS 'User''s dark mode preference';
COMMENT ON COLUMN public.user_profiles.theme_preference IS 'User''s theme preference: light, dark, or system';

-- Verify the table was created
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position; 