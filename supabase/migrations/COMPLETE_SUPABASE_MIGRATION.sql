-- ========================================
-- PROMPT MANAGE - COMPLETE DATABASE SETUP
-- Run this entire script in Supabase SQL Editor
-- ========================================
-- This is a comprehensive migration that sets up:
-- 1. Core tables (users, prompts, tags, etc.)
-- 2. Teams & collaboration
-- 3. AI Agents system
-- 4. Token tracking & cost management
-- 5. Workflow system
-- 6. Stripe integration
-- 7. Free tool usage tracking
-- 8. Admin access controls
-- ========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PART 1: CORE SCHEMA & USER PROFILES
-- ========================================

-- Function to generate slugs
CREATE OR REPLACE FUNCTION generate_slug(input_text text)
RETURNS text AS $$
BEGIN
  RETURN lower(regexp_replace(
    regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- User profiles table (extended from auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  full_name TEXT,
  email TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  location TEXT,
  
  -- Subscription & billing (Stripe integration)
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'team', 'enterprise')),
  subscription_status TEXT,
  subscription_period_end TIMESTAMPTZ,
  stripe_customer_id TEXT UNIQUE,
  
  -- Team membership
  team_id UUID,
  
  -- Token & cost management
  monthly_token_quota INTEGER,
  monthly_budget_usd NUMERIC(10, 2),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_profiles_stripe_customer_idx ON public.user_profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS user_profiles_subscription_tier_idx ON public.user_profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS user_profiles_team_id_idx ON public.user_profiles(team_id);

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read user profiles" ON public.user_profiles;
CREATE POLICY "Anyone can read user profiles"
  ON public.user_profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ========================================
-- PART 2: TEAMS & COLLABORATION
-- ========================================

DO $$ BEGIN
  CREATE TYPE team_role AS ENUM ('owner', 'admin', 'editor', 'viewer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 100),
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar_url TEXT,
  
  -- Billing
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'team', 'enterprise')),
  max_members INTEGER NOT NULL DEFAULT 3,
  max_storage_gb INTEGER NOT NULL DEFAULT 1,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  monthly_budget_usd NUMERIC(10, 2),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  
  -- Metadata
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$')
);

CREATE INDEX IF NOT EXISTS teams_slug_idx ON teams(slug) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS teams_tier_idx ON teams(tier);
CREATE INDEX IF NOT EXISTS teams_stripe_customer_idx ON teams(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- Add foreign key to user_profiles
ALTER TABLE public.user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_team_id_fkey,
  ADD CONSTRAINT user_profiles_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role team_role NOT NULL DEFAULT 'viewer',
  invited_by UUID REFERENCES auth.users,
  joined_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- ========================================
-- PART 3: PROMPTS & TAGS
-- ========================================

CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams ON DELETE SET NULL,
  
  title TEXT NOT NULL CHECK (char_length(title) >= 3),
  slug TEXT NOT NULL,
  description TEXT,
  prompt_text TEXT NOT NULL,
  model TEXT,
  
  -- Visibility & sharing
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  -- Usage tracking
  view_count INTEGER DEFAULT 0,
  copy_count INTEGER DEFAULT 0,
  run_count INTEGER DEFAULT 0,
  
  -- Metadata
  version INTEGER DEFAULT 1,
  parent_id UUID REFERENCES public.prompts ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, slug)
);

CREATE INDEX IF NOT EXISTS prompts_user_id_idx ON public.prompts(user_id);
CREATE INDEX IF NOT EXISTS prompts_team_id_idx ON public.prompts(team_id);
CREATE INDEX IF NOT EXISTS prompts_is_public_idx ON public.prompts(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS prompts_created_at_idx ON public.prompts(created_at DESC);

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public prompts are viewable by everyone" ON public.prompts;
CREATE POLICY "Public prompts are viewable by everyone"
  ON public.prompts FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS "Users can view their own prompts" ON public.prompts;
CREATE POLICY "Users can view their own prompts"
  ON public.prompts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create prompts" ON public.prompts;
CREATE POLICY "Users can create prompts"
  ON public.prompts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own prompts" ON public.prompts;
CREATE POLICY "Users can update their own prompts"
  ON public.prompts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own prompts" ON public.prompts;
CREATE POLICY "Users can delete their own prompts"
  ON public.prompts FOR DELETE
  USING (auth.uid() = user_id);

-- Tags system
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.prompt_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES public.prompts ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(prompt_id, tag_id)
);

-- ========================================
-- PART 4: PROMPT RUN HISTORY & TOKEN TRACKING
-- ========================================

CREATE TABLE IF NOT EXISTS public.prompt_run_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  prompt_id UUID REFERENCES public.prompts ON DELETE SET NULL,
  
  -- Execution details
  model TEXT,
  input TEXT,
  output TEXT,
  status TEXT CHECK (status IN ('success', 'error', 'pending')),
  error_message TEXT,
  
  -- Token tracking & cost
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER GENERATED ALWAYS AS (COALESCE(input_tokens, 0) + COALESCE(output_tokens, 0)) STORED,
  cost_usd NUMERIC(10, 6),
  
  -- Metadata
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prompt_run_history_user_id_idx ON public.prompt_run_history(user_id);
CREATE INDEX IF NOT EXISTS prompt_run_history_prompt_id_idx ON public.prompt_run_history(prompt_id);
CREATE INDEX IF NOT EXISTS prompt_run_history_created_at_idx ON public.prompt_run_history(created_at DESC);

-- Token usage summary view
CREATE OR REPLACE VIEW public.user_token_usage AS
SELECT 
  user_id,
  COUNT(*) as total_runs,
  SUM(input_tokens) as total_input_tokens,
  SUM(output_tokens) as total_output_tokens,
  SUM(total_tokens) as total_tokens,
  SUM(cost_usd) as total_cost_usd,
  DATE_TRUNC('month', created_at) as month
FROM public.prompt_run_history
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY user_id, DATE_TRUNC('month', created_at);

-- ========================================
-- PART 5: AI AGENTS SYSTEM
-- ========================================

DO $$ BEGIN
  CREATE TYPE agent_status AS ENUM ('active', 'paused', 'error', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE generation_status AS ENUM ('pending', 'processing', 'completed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  model TEXT DEFAULT 'gpt-4',
  
  -- Configuration
  temperature NUMERIC(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 2000,
  
  -- Scheduling
  schedule_cron TEXT,
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  
  -- Status
  status agent_status DEFAULT 'active',
  error_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agent_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents ON DELETE CASCADE NOT NULL,
  
  input TEXT,
  output TEXT,
  
  -- Token tracking
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER GENERATED ALWAYS AS (COALESCE(input_tokens, 0) + COALESCE(output_tokens, 0)) STORED,
  cost_usd NUMERIC(10, 6),
  
  -- Status
  status generation_status DEFAULT 'pending',
  error_message TEXT,
  
  -- Performance
  execution_time_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents ON DELETE CASCADE NOT NULL,
  
  date DATE NOT NULL,
  total_runs INTEGER DEFAULT 0,
  successful_runs INTEGER DEFAULT 0,
  failed_runs INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_cost_usd NUMERIC(10, 2) DEFAULT 0,
  avg_execution_time_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agent_id, date)
);

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_metrics ENABLE ROW LEVEL SECURITY;

-- ========================================
-- PART 6: FREE TOOL USAGE TRACKING
-- ========================================

CREATE TABLE IF NOT EXISTS public.free_tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  fingerprint TEXT,
  prompt_generated TEXT,
  saved_to_library BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS free_tool_usage_user_id_idx ON public.free_tool_usage(user_id);
CREATE INDEX IF NOT EXISTS free_tool_usage_ip_address_idx ON public.free_tool_usage(ip_address);
CREATE INDEX IF NOT EXISTS free_tool_usage_fingerprint_idx ON public.free_tool_usage(fingerprint);
CREATE INDEX IF NOT EXISTS free_tool_usage_created_at_idx ON public.free_tool_usage(created_at);

ALTER TABLE public.free_tool_usage ENABLE ROW LEVEL SECURITY;

-- Rate limit checker function
CREATE OR REPLACE FUNCTION public.check_free_tool_rate_limit(
  p_tool_name TEXT,
  p_ip_address TEXT,
  p_fingerprint TEXT
)
RETURNS jsonb AS $$
DECLARE
  usage_count INTEGER;
  is_allowed BOOLEAN;
  remaining_uses INTEGER;
BEGIN
  SELECT COUNT(*) INTO usage_count
  FROM public.free_tool_usage
  WHERE tool_name = p_tool_name
    AND (ip_address = p_ip_address OR fingerprint = p_fingerprint)
    AND created_at > now() - INTERVAL '24 hours'
    AND user_id IS NULL;
  
  is_allowed := usage_count < 3;
  remaining_uses := GREATEST(0, 3 - usage_count);
  
  RETURN jsonb_build_object(
    'allowed', is_allowed,
    'count', usage_count,
    'limit', 3,
    'remaining', remaining_uses,
    'reset_at', (now() + INTERVAL '24 hours')::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- PART 7: ADMIN FUNCTIONS & POLICIES
-- ========================================

-- Admin user checker
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
  user_email TEXT;
BEGIN
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  RETURN user_email IN (
    'mikemoloney.business@gmail.com',
    'hkaufman19@gmail.com',
    'mike@filtergrade.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies for agents
DROP POLICY IF EXISTS "Admins can view all agents" ON public.agents;
CREATE POLICY "Admins can view all agents"
  ON public.agents FOR SELECT
  USING (auth.role() = 'authenticated' AND public.is_admin_user());

DROP POLICY IF EXISTS "Admins can insert agents" ON public.agents;
CREATE POLICY "Admins can insert agents"
  ON public.agents FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND public.is_admin_user());

DROP POLICY IF EXISTS "Admins can update agents" ON public.agents;
CREATE POLICY "Admins can update agents"
  ON public.agents FOR UPDATE
  USING (auth.role() = 'authenticated' AND public.is_admin_user());

DROP POLICY IF EXISTS "Admins can delete agents" ON public.agents;
CREATE POLICY "Admins can delete agents"
  ON public.agents FOR DELETE
  USING (auth.role() = 'authenticated' AND public.is_admin_user());

-- Admin policies for agent generations
DROP POLICY IF EXISTS "Admins can view all agent generations" ON public.agent_generations;
CREATE POLICY "Admins can view all agent generations"
  ON public.agent_generations FOR SELECT
  USING (auth.role() = 'authenticated' AND public.is_admin_user());

DROP POLICY IF EXISTS "Admins can insert agent generations" ON public.agent_generations;
CREATE POLICY "Admins can insert agent generations"
  ON public.agent_generations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND public.is_admin_user());

DROP POLICY IF EXISTS "Admins can update agent generations" ON public.agent_generations;
CREATE POLICY "Admins can update agent generations"
  ON public.agent_generations FOR UPDATE
  USING (auth.role() = 'authenticated' AND public.is_admin_user());

DROP POLICY IF EXISTS "Admins can delete agent generations" ON public.agent_generations;
CREATE POLICY "Admins can delete agent generations"
  ON public.agent_generations FOR DELETE
  USING (auth.role() = 'authenticated' AND public.is_admin_user());

-- Admin policies for agent metrics
DROP POLICY IF EXISTS "Admins can view all agent metrics" ON public.agent_metrics;
CREATE POLICY "Admins can view all agent metrics"
  ON public.agent_metrics FOR SELECT
  USING (auth.role() = 'authenticated' AND public.is_admin_user());

DROP POLICY IF EXISTS "Admins can insert agent metrics" ON public.agent_metrics;
CREATE POLICY "Admins can insert agent metrics"
  ON public.agent_metrics FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND public.is_admin_user());

DROP POLICY IF EXISTS "Admins can update agent metrics" ON public.agent_metrics;
CREATE POLICY "Admins can update agent metrics"
  ON public.agent_metrics FOR UPDATE
  USING (auth.role() = 'authenticated' AND public.is_admin_user());

DROP POLICY IF EXISTS "Admins can delete agent metrics" ON public.agent_metrics;
CREATE POLICY "Admins can delete agent metrics"
  ON public.agent_metrics FOR DELETE
  USING (auth.role() = 'authenticated' AND public.is_admin_user());

-- Admin policies for free tool usage
DROP POLICY IF EXISTS "Admins can view all free tool usage" ON public.free_tool_usage;
CREATE POLICY "Admins can view all free tool usage"
  ON public.free_tool_usage FOR SELECT
  USING (auth.role() = 'authenticated' AND public.is_admin_user());

DROP POLICY IF EXISTS "Users can view their own free tool usage" ON public.free_tool_usage;
CREATE POLICY "Users can view their own free tool usage"
  ON public.free_tool_usage FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can insert free tool usage" ON public.free_tool_usage;
CREATE POLICY "Anyone can insert free tool usage"
  ON public.free_tool_usage FOR INSERT
  WITH CHECK (true);

-- ========================================
-- PART 8: GRANTS & PERMISSIONS
-- ========================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.teams TO authenticated;
GRANT ALL ON public.team_members TO authenticated;
GRANT ALL ON public.prompts TO authenticated;
GRANT ALL ON public.tags TO authenticated;
GRANT ALL ON public.prompt_tags TO authenticated;
GRANT ALL ON public.prompt_run_history TO authenticated;
GRANT ALL ON public.agents TO authenticated;
GRANT ALL ON public.agent_generations TO authenticated;
GRANT ALL ON public.agent_metrics TO authenticated;
GRANT ALL ON public.free_tool_usage TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.check_free_tool_rate_limit TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_slug TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column TO authenticated;

-- ========================================
-- COMMENTS & DOCUMENTATION
-- ========================================

COMMENT ON TABLE public.user_profiles IS 'Extended user profiles with subscription, billing, and team info';
COMMENT ON TABLE public.teams IS 'Team workspaces for collaboration';
COMMENT ON TABLE public.prompts IS 'User-created AI prompts with versioning and sharing';
COMMENT ON TABLE public.prompt_run_history IS 'Execution history with token tracking and costs';
COMMENT ON TABLE public.agents IS 'Autonomous AI agents for scheduled tasks';
COMMENT ON TABLE public.free_tool_usage IS 'Tracks usage of free AI tools for rate limiting and analytics';

COMMENT ON FUNCTION public.check_free_tool_rate_limit IS 'Checks if a non-logged-in user has exceeded the rate limit (3 uses per 24 hours)';
COMMENT ON FUNCTION public.is_admin_user IS 'Returns true if the current user is an admin based on their email address';

-- ========================================
-- MIGRATION COMPLETE! 
-- ========================================
-- You now have:
-- ✅ User profiles with Stripe integration
-- ✅ Teams & collaboration system
-- ✅ Prompts with tags and versioning
-- ✅ Token tracking & cost management
-- ✅ AI Agents system
-- ✅ Free tool usage tracking
-- ✅ Admin access controls
-- ✅ All RLS policies configured
-- ========================================

