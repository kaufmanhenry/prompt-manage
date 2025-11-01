-- Fix user_profiles table to include all required columns for email sign-in
-- This ensures the table has email_notifications, dark_mode, theme_preference, and full_name columns

-- Add missing columns if they don't exist
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS dark_mode BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'system';

-- Ensure RLS policy allows users to insert their own profile
-- Drop and recreate the policy to ensure it works correctly
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Also ensure update policy exists
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Ensure select policy exists
DROP POLICY IF EXISTS "Anyone can read user profiles" ON public.user_profiles;
CREATE POLICY "Anyone can read user profiles"
  ON public.user_profiles
  FOR SELECT
  USING (true);

-- Add comments
COMMENT ON COLUMN public.user_profiles.email_notifications IS 'Whether the user wants to receive email notifications';
COMMENT ON COLUMN public.user_profiles.dark_mode IS 'User''s dark mode preference';
COMMENT ON COLUMN public.user_profiles.theme_preference IS 'User''s theme preference: light, dark, or system';
COMMENT ON COLUMN public.user_profiles.full_name IS 'User''s full name';

