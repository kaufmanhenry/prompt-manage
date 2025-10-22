-- ========================================
-- ADMIN DASHBOARD ACCURACY & PROMPT MANAGEMENT
-- Migration: 20250117000001_admin_dashboard_accuracy.sql
-- Description: Ensures 100% accurate admin dashboard data and adds prompt management
-- Note: Removed all agent-related functionality for rebuild
-- ========================================

-- ========================================
-- 1. CREATE ADMIN FUNCTION FIRST
-- ========================================

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get current user's email
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  -- Check if email is in admin list
  RETURN user_email IN (
    'mikemoloney.business@gmail.com',
    'hkaufman19@gmail.com',
    'mike@filtergrade.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 2. FIX USER_PROFILES DATA ACCURACY
-- ========================================

-- First, ensure the subscription_tier column exists
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'team', 'enterprise'));

-- Ensure all users have proper subscription_tier data
UPDATE public.user_profiles 
SET subscription_tier = 'free'
WHERE subscription_tier IS NULL;

-- Add missing columns for better admin tracking
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS prompt_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS public_prompt_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT,
ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS team_id UUID,
ADD COLUMN IF NOT EXISTS monthly_token_quota INTEGER,
ADD COLUMN IF NOT EXISTS monthly_budget_usd NUMERIC(10, 2);

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS user_profiles_subscription_tier_idx ON public.user_profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS user_profiles_team_id_idx ON public.user_profiles(team_id);
CREATE INDEX IF NOT EXISTS user_profiles_stripe_customer_idx ON public.user_profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS user_profiles_last_active_idx ON public.user_profiles(last_active_at DESC);

-- Create function to update user prompt counts
CREATE OR REPLACE FUNCTION update_user_prompt_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update prompt counts for the user
  UPDATE public.user_profiles 
  SET 
    prompt_count = (
      SELECT COUNT(*) FROM public.prompts 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    ),
    public_prompt_count = (
      SELECT COUNT(*) FROM public.prompts 
      WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) 
      AND is_public = true
    ),
    last_active_at = now()
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to automatically update counts
DROP TRIGGER IF EXISTS update_user_counts_on_prompt_change ON public.prompts;
CREATE TRIGGER update_user_counts_on_prompt_change
  AFTER INSERT OR UPDATE OR DELETE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION update_user_prompt_counts();

-- ========================================
-- 3. ADD PROMPT MANAGEMENT FEATURES
-- ========================================

-- Add admin-specific columns to prompts table
ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_moderated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
ADD COLUMN IF NOT EXISTS moderation_notes TEXT,
ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users,
ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ;

-- Add indexes for admin queries
CREATE INDEX IF NOT EXISTS prompts_moderation_status_idx ON public.prompts (moderation_status);
CREATE INDEX IF NOT EXISTS prompts_is_featured_idx ON public.prompts (is_featured);
CREATE INDEX IF NOT EXISTS prompts_created_at_idx ON public.prompts (inserted_at DESC);
CREATE INDEX IF NOT EXISTS prompts_public_created_idx ON public.prompts (is_public, inserted_at DESC);

-- ========================================
-- 4. CREATE ADMIN AUDIT LOG TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL, -- 'prompt', 'user', 'team', etc.
  target_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_admin_user_idx ON public.admin_audit_log (admin_user_id);
CREATE INDEX IF NOT EXISTS admin_audit_log_target_idx ON public.admin_audit_log (target_type, target_id);
CREATE INDEX IF NOT EXISTS admin_audit_log_created_at_idx ON public.admin_audit_log (created_at DESC);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can see audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_log FOR SELECT
  USING (public.is_admin_user());

CREATE POLICY "Admins can insert audit logs"
  ON public.admin_audit_log FOR INSERT
  WITH CHECK (public.is_admin_user());

-- ========================================
-- 5. CREATE DAILY METRICS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS public.daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  
  -- User metrics
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  free_users INTEGER DEFAULT 0,
  team_users INTEGER DEFAULT 0,
  enterprise_users INTEGER DEFAULT 0,
  
  -- Prompt metrics
  total_prompts INTEGER DEFAULT 0,
  new_prompts INTEGER DEFAULT 0,
  public_prompts INTEGER DEFAULT 0,
  private_prompts INTEGER DEFAULT 0,
  featured_prompts INTEGER DEFAULT 0,
  
  -- Activity metrics
  prompt_runs INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  
  -- Free tool metrics
  free_tool_uses INTEGER DEFAULT 0,
  claude_creator_uses INTEGER DEFAULT 0,
  cursor_creator_uses INTEGER DEFAULT 0,
  optimizer_uses INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS daily_metrics_date_idx ON public.daily_metrics (date DESC);

-- Function to calculate daily metrics
CREATE OR REPLACE FUNCTION calculate_daily_metrics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
DECLARE
  start_of_day TIMESTAMPTZ;
  end_of_day TIMESTAMPTZ;
BEGIN
  start_of_day := target_date::TIMESTAMPTZ;
  end_of_day := (target_date + INTERVAL '1 day')::TIMESTAMPTZ;
  
  INSERT INTO public.daily_metrics (
    date,
    total_users,
    new_users,
    active_users,
    free_users,
    team_users,
    enterprise_users,
    total_prompts,
    new_prompts,
    public_prompts,
    private_prompts,
    featured_prompts,
    prompt_runs,
    total_views,
    free_tool_uses,
    claude_creator_uses,
    cursor_creator_uses,
    optimizer_uses
  )
  SELECT 
    target_date,
    -- User metrics
    (SELECT COUNT(*) FROM public.user_profiles),
    (SELECT COUNT(*) FROM public.user_profiles WHERE created_at >= start_of_day AND created_at < end_of_day),
    (SELECT COUNT(DISTINCT user_id) FROM public.prompts WHERE inserted_at >= start_of_day AND inserted_at < end_of_day),
    (SELECT COUNT(*) FROM public.user_profiles WHERE subscription_tier = 'free'),
    (SELECT COUNT(*) FROM public.user_profiles WHERE subscription_tier = 'team'),
    (SELECT COUNT(*) FROM public.user_profiles WHERE subscription_tier = 'enterprise'),
    
    -- Prompt metrics
    (SELECT COUNT(*) FROM public.prompts),
    (SELECT COUNT(*) FROM public.prompts WHERE inserted_at >= start_of_day AND inserted_at < end_of_day),
    (SELECT COUNT(*) FROM public.prompts WHERE is_public = true),
    (SELECT COUNT(*) FROM public.prompts WHERE is_public = false),
    (SELECT COUNT(*) FROM public.prompts WHERE is_featured = true),
    
    -- Activity metrics
    COALESCE((SELECT COUNT(*) FROM public.prompt_run_history WHERE created_at >= start_of_day AND created_at < end_of_day), 0),
    COALESCE((SELECT SUM(view_count) FROM public.prompts WHERE is_public = true), 0),
    
    -- Free tool metrics
    COALESCE((SELECT COUNT(*) FROM public.free_tool_usage WHERE created_at >= start_of_day AND created_at < end_of_day), 0),
    COALESCE((SELECT COUNT(*) FROM public.free_tool_usage WHERE tool_name = 'claude-creator' AND created_at >= start_of_day AND created_at < end_of_day), 0),
    COALESCE((SELECT COUNT(*) FROM public.free_tool_usage WHERE tool_name = 'cursor-creator' AND created_at >= start_of_day AND created_at < end_of_day), 0),
    COALESCE((SELECT COUNT(*) FROM public.free_tool_usage WHERE tool_name = 'optimizer' AND created_at >= start_of_day AND created_at < end_of_day), 0)
  ON CONFLICT (date) DO UPDATE SET
    total_users = EXCLUDED.total_users,
    new_users = EXCLUDED.new_users,
    active_users = EXCLUDED.active_users,
    free_users = EXCLUDED.free_users,
    team_users = EXCLUDED.team_users,
    enterprise_users = EXCLUDED.enterprise_users,
    total_prompts = EXCLUDED.total_prompts,
    new_prompts = EXCLUDED.new_prompts,
    public_prompts = EXCLUDED.public_prompts,
    private_prompts = EXCLUDED.private_prompts,
    featured_prompts = EXCLUDED.featured_prompts,
    prompt_runs = EXCLUDED.prompt_runs,
    total_views = EXCLUDED.total_views,
    free_tool_uses = EXCLUDED.free_tool_uses,
    claude_creator_uses = EXCLUDED.claude_creator_uses,
    cursor_creator_uses = EXCLUDED.cursor_creator_uses,
    optimizer_uses = EXCLUDED.optimizer_uses,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 6. CREATE ADMIN FUNCTIONS
-- ========================================

-- Function to update prompt tags (admin only)
CREATE OR REPLACE FUNCTION admin_update_prompt_tags(
  prompt_id UUID,
  new_tags TEXT[],
  admin_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  old_tags TEXT[];
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Get old tags
  SELECT tags INTO old_tags FROM public.prompts WHERE id = prompt_id;
  
  -- Update tags
  UPDATE public.prompts 
  SET 
    tags = new_tags,
    admin_notes = COALESCE(admin_notes, admin_notes),
    updated_at = now()
  WHERE id = prompt_id;
  
  -- Log the change
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action,
    target_type,
    target_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    'update_tags',
    'prompt',
    prompt_id,
    jsonb_build_object('tags', old_tags),
    jsonb_build_object('tags', new_tags, 'admin_notes', admin_notes)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update prompt model (admin only)
CREATE OR REPLACE FUNCTION admin_update_prompt_model(
  prompt_id UUID,
  new_model TEXT,
  admin_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  old_model TEXT;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Get old model
  SELECT model INTO old_model FROM public.prompts WHERE id = prompt_id;
  
  -- Update model
  UPDATE public.prompts 
  SET 
    model = new_model,
    admin_notes = COALESCE(admin_notes, admin_notes),
    updated_at = now()
  WHERE id = prompt_id;
  
  -- Log the change
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action,
    target_type,
    target_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    'update_model',
    'prompt',
    prompt_id,
    jsonb_build_object('model', old_model),
    jsonb_build_object('model', new_model, 'admin_notes', admin_notes)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to moderate prompt (admin only)
CREATE OR REPLACE FUNCTION admin_moderate_prompt(
  prompt_id UUID,
  moderation_status TEXT,
  moderation_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Update moderation status
  UPDATE public.prompts 
  SET 
    moderation_status = moderation_status,
    moderation_notes = moderation_notes,
    moderated_by = auth.uid(),
    moderated_at = now(),
    updated_at = now()
  WHERE id = prompt_id;
  
  -- Log the change
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action,
    target_type,
    target_id,
    new_values
  ) VALUES (
    auth.uid(),
    'moderate_prompt',
    'prompt',
    prompt_id,
    jsonb_build_object('moderation_status', moderation_status, 'moderation_notes', moderation_notes)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to feature/unfeature prompt (admin only)
CREATE OR REPLACE FUNCTION admin_feature_prompt(
  prompt_id UUID,
  is_featured BOOLEAN,
  admin_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  old_featured BOOLEAN;
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Get old featured status
  SELECT is_featured INTO old_featured FROM public.prompts WHERE id = prompt_id;
  
  -- Update featured status
  UPDATE public.prompts 
  SET 
    is_featured = is_featured,
    admin_notes = COALESCE(admin_notes, admin_notes),
    updated_at = now()
  WHERE id = prompt_id;
  
  -- Log the change
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action,
    target_type,
    target_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    'feature_prompt',
    'prompt',
    prompt_id,
    jsonb_build_object('is_featured', old_featured),
    jsonb_build_object('is_featured', is_featured, 'admin_notes', admin_notes)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 7. UPDATE EXISTING DATA
-- ========================================

-- Calculate metrics for the last 30 days
DO $$
DECLARE
  i INTEGER;
  target_date DATE;
BEGIN
  FOR i IN 0..29 LOOP
    target_date := CURRENT_DATE - i;
    PERFORM calculate_daily_metrics(target_date);
  END LOOP;
END $$;

-- Update all user prompt counts
UPDATE public.user_profiles 
SET 
  prompt_count = (
    SELECT COUNT(*) FROM public.prompts 
    WHERE user_id = user_profiles.id
  ),
  public_prompt_count = (
    SELECT COUNT(*) FROM public.prompts 
    WHERE user_id = user_profiles.id AND is_public = true
  );

-- ========================================
-- 8. CREATE ADMIN RLS POLICIES
-- ========================================

-- Allow admins to see all prompts with admin fields
DROP POLICY IF EXISTS "Admins can view all prompts with admin data" ON public.prompts;
CREATE POLICY "Admins can view all prompts with admin data"
  ON public.prompts FOR SELECT
  USING (public.is_admin_user());

-- Allow admins to update prompts
DROP POLICY IF EXISTS "Admins can update prompts" ON public.prompts;
CREATE POLICY "Admins can update prompts"
  ON public.prompts FOR UPDATE
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- Allow admins to see all user profiles with admin data
DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all user profiles"
  ON public.user_profiles FOR SELECT
  USING (public.is_admin_user());

-- ========================================
-- 9. COMMENTS
-- ========================================

COMMENT ON TABLE public.daily_metrics IS 'Daily aggregated metrics for admin dashboard';
COMMENT ON TABLE public.admin_audit_log IS 'Audit log for all admin actions';
COMMENT ON FUNCTION calculate_daily_metrics IS 'Calculates and stores daily metrics for admin dashboard';
COMMENT ON FUNCTION admin_update_prompt_tags IS 'Admin function to update prompt tags with audit logging';
COMMENT ON FUNCTION admin_update_prompt_model IS 'Admin function to update prompt model with audit logging';
COMMENT ON FUNCTION admin_moderate_prompt IS 'Admin function to moderate prompts with audit logging';
COMMENT ON FUNCTION admin_feature_prompt IS 'Admin function to feature/unfeature prompts with audit logging';
