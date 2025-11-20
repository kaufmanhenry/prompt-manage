-- Fix RLS policies for ai_tools to allow authenticated users to submit tools
-- This migration adds INSERT and UPDATE policies for user-submitted tools

-- Drop existing policies if they exist
DROP POLICY IF EXISTS public_tools ON public.ai_tools;
DROP POLICY IF EXISTS allow_authenticated_insert ON public.ai_tools;
DROP POLICY IF EXISTS allow_own_update ON public.ai_tools;

-- Recreate SELECT policy (view approved tools)
CREATE POLICY public_tools ON public.ai_tools
  FOR SELECT
  USING (status = 'approved');

-- Allow authenticated users to INSERT their own tools
CREATE POLICY allow_authenticated_insert ON public.ai_tools
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to UPDATE their own submitted tools
CREATE POLICY allow_own_update ON public.ai_tools
  FOR UPDATE
  TO authenticated
  USING (submitted_by = auth.uid())
  WITH CHECK (submitted_by = auth.uid());

-- Grant necessary permissions
GRANT SELECT ON public.ai_tools TO anon;
GRANT SELECT, INSERT ON public.ai_tools TO authenticated;
GRANT UPDATE (
  name,
  website_url,
  description,
  full_description,
  company_name,
  company_website,
  contact_email,
  primary_category_id,
  logo_url,
  pricing_model,
  pricing_tier,
  monthly_price,
  annual_price,
  has_free_trial,
  trial_duration_days,
  key_features,
  use_cases,
  platforms,
  ai_models_used,
  api_available,
  founded_year,
  is_open_source
) ON public.ai_tools TO authenticated;
