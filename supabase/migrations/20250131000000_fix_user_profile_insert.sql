-- Fix user_profiles RLS policy for auth callback
-- This allows profile creation during the authentication process

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

-- Create a more permissive insert policy that works during auth callback
-- This allows the service role to create profiles for users during signup
CREATE POLICY "Allow profile creation during auth"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (
    -- Allow if the authenticated user matches the profile being created
    auth.uid() = id
    -- OR if this is being called by a service role/authenticated context
    OR auth.uid() IS NOT NULL
  );

-- Also ensure we have proper update policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure we have proper select policy
DROP POLICY IF EXISTS "Anyone can read user profiles" ON public.user_profiles;

CREATE POLICY "Anyone can read user profiles"
  ON public.user_profiles
  FOR SELECT
  USING (true);

COMMENT ON POLICY "Allow profile creation during auth" ON public.user_profiles IS
  'Allows profile creation during authentication process when user is authenticated';
