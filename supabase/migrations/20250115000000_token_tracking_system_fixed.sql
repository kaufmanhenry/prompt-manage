-- Token Tracking & Cost Management System (FIXED VERSION)
-- Migration: 20250115000000_token_tracking_system_fixed.sql
-- Description: Adds complete token tracking, usage budgets, and cost management

-- ============================================================================
-- 1. EXTEND EXISTING TABLES
-- ============================================================================

-- Add subscription tier and budget fields to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'team', 'enterprise')),
ADD COLUMN IF NOT EXISTS team_id UUID,
ADD COLUMN IF NOT EXISTS monthly_token_quota INTEGER,
ADD COLUMN IF NOT EXISTS monthly_budget_usd NUMERIC(10, 2);

COMMENT ON COLUMN public.user_profiles.subscription_tier IS 'User subscription level: free, team, or enterprise';
COMMENT ON COLUMN public.user_profiles.team_id IS 'Team the user belongs to (for team/enterprise tiers)';

-- Add token tracking fields to prompt_run_history
ALTER TABLE public.prompt_run_history
ADD COLUMN IF NOT EXISTS input_tokens INTEGER,
ADD COLUMN IF NOT EXISTS output_tokens INTEGER,
ADD COLUMN IF NOT EXISTS cost_usd NUMERIC(10, 6),
ADD COLUMN IF NOT EXISTS token_log_id UUID;

COMMENT ON COLUMN public.prompt_run_history.input_tokens IS 'Number of input tokens used';
COMMENT ON COLUMN public.prompt_run_history.output_tokens IS 'Number of output tokens generated';
COMMENT ON COLUMN public.prompt_run_history.cost_usd IS 'Total cost in USD for this execution';

-- ============================================================================
-- 2. TEAMS TABLE (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'team', 'enterprise')),
  owner_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  
  -- Settings
  monthly_budget_usd NUMERIC(10, 2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  
  joined_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(team_id, user_id)
);

-- Indexes for teams
CREATE INDEX IF NOT EXISTS idx_teams_owner ON public.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);

-- RLS for teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Team owners and admins can manage teams
CREATE POLICY "Team owners and admins can manage teams"
  ON public.teams FOR ALL
  USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = teams.id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Team members can view their team
CREATE POLICY "Team members can view teams"
  ON public.teams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = teams.id AND user_id = auth.uid()
    )
  );

-- Team members can view membership
CREATE POLICY "Team members can view membership"
  ON public.team_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.team_members tm
      WHERE tm.team_id = team_members.team_id AND tm.user_id = auth.uid()
    )
  );

-- Now add the foreign key constraint to user_profiles
ALTER TABLE public.user_profiles
ADD CONSTRAINT fk_user_profiles_team_id 
FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE SET NULL;

-- ============================================================================
-- 3. TOKEN USAGE LOGS
-- ============================================================================

CREATE TABLE public.token_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams ON DELETE CASCADE,
  prompt_id UUID REFERENCES public.prompts ON DELETE SET NULL,
  run_id UUID REFERENCES public.prompt_run_history ON DELETE CASCADE,
  
  -- Token metrics
  input_tokens INTEGER NOT NULL CHECK (input_tokens >= 0),
  output_tokens INTEGER NOT NULL CHECK (output_tokens >= 0),
  total_tokens INTEGER GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,
  
  -- Cost metrics (USD)
  input_cost_usd NUMERIC(10, 6) NOT NULL CHECK (input_cost_usd >= 0),
  output_cost_usd NUMERIC(10, 6) NOT NULL CHECK (output_cost_usd >= 0),
  total_cost_usd NUMERIC(10, 6) GENERATED ALWAYS AS (input_cost_usd + output_cost_usd) STORED,
  
  -- Model and context
  model TEXT NOT NULL,
  model_version TEXT,
  execution_type TEXT NOT NULL DEFAULT 'prompt_run' CHECK (
    execution_type IN ('prompt_run', 'preview', 'improvement', 'agent_generation', 'workflow_node')
  ),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX idx_token_usage_user_date ON public.token_usage_logs(user_id, created_at DESC);
CREATE INDEX idx_token_usage_team_date ON public.token_usage_logs(team_id, created_at DESC) WHERE team_id IS NOT NULL;
CREATE INDEX idx_token_usage_prompt ON public.token_usage_logs(prompt_id) WHERE prompt_id IS NOT NULL;
CREATE INDEX idx_token_usage_model ON public.token_usage_logs(model, created_at DESC);
CREATE INDEX idx_token_usage_type ON public.token_usage_logs(execution_type, created_at DESC);

-- Link back to prompt_run_history
CREATE INDEX IF NOT EXISTS idx_token_usage_run ON public.token_usage_logs(run_id) WHERE run_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_prompt_run_history_token_log ON public.prompt_run_history(token_log_id) WHERE token_log_id IS NOT NULL;

-- RLS for token usage logs
ALTER TABLE public.token_usage_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own logs
CREATE POLICY "Users can view their own token usage"
  ON public.token_usage_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Team admins can view team logs
CREATE POLICY "Team admins can view team token usage"
  ON public.token_usage_logs FOR SELECT
  USING (
    team_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = token_usage_logs.team_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- System can insert logs
CREATE POLICY "System can insert token usage logs"
  ON public.token_usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE public.token_usage_logs IS 'Tracks token usage and costs for every LLM API call';

-- ============================================================================
-- 4. USAGE BUDGETS
-- ============================================================================

CREATE TABLE public.usage_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('user', 'team')),
  entity_id UUID NOT NULL,
  
  -- Budget settings
  monthly_budget_usd NUMERIC(10, 2) CHECK (monthly_budget_usd > 0),
  max_tokens_per_prompt INTEGER CHECK (max_tokens_per_prompt > 0),
  daily_budget_usd NUMERIC(10, 2) CHECK (daily_budget_usd > 0),
  
  -- Alert thresholds (percentage)
  alert_threshold_1 INTEGER DEFAULT 75 CHECK (alert_threshold_1 BETWEEN 0 AND 100),
  alert_threshold_2 INTEGER DEFAULT 90 CHECK (alert_threshold_2 BETWEEN 0 AND 100),
  alert_threshold_3 INTEGER DEFAULT 100 CHECK (alert_threshold_3 BETWEEN 0 AND 100),
  
  -- Current period tracking
  period_start DATE NOT NULL DEFAULT date_trunc('month', now()),
  period_tokens_used INTEGER DEFAULT 0,
  period_cost_usd NUMERIC(10, 2) DEFAULT 0,
  
  -- Last alert sent
  last_alert_sent_at TIMESTAMPTZ,
  last_alert_level INTEGER,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(entity_type, entity_id, period_start)
);

-- Indexes
CREATE INDEX idx_usage_budgets_entity ON public.usage_budgets(entity_type, entity_id, period_start DESC);
CREATE INDEX idx_usage_budgets_period ON public.usage_budgets(period_start);

-- RLS for usage budgets
ALTER TABLE public.usage_budgets ENABLE ROW LEVEL SECURITY;

-- Users can manage their own budgets
CREATE POLICY "Users can manage their own budgets"
  ON public.usage_budgets FOR ALL
  USING (
    entity_type = 'user' AND entity_id = auth.uid()
  );

-- Team admins can manage team budgets
CREATE POLICY "Team admins can manage team budgets"
  ON public.usage_budgets FOR ALL
  USING (
    entity_type = 'team' AND
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = entity_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

COMMENT ON TABLE public.usage_budgets IS 'Budget limits and tracking for users and teams';

-- ============================================================================
-- 5. USAGE ALERTS
-- ============================================================================

CREATE TABLE public.usage_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES public.usage_budgets ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  
  alert_type TEXT NOT NULL CHECK (
    alert_type IN ('threshold_75', 'threshold_90', 'budget_exceeded', 'daily_limit', 'token_limit')
  ),
  alert_level TEXT NOT NULL CHECK (alert_level IN ('info', 'warning', 'critical')),
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  current_usage_usd NUMERIC(10, 2),
  budget_limit_usd NUMERIC(10, 2),
  usage_percentage INTEGER,
  
  -- Notification tracking
  notified_via TEXT[], -- e.g., ['email', 'slack', 'webhook']
  
  -- Acknowledgment
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_by_user_id UUID REFERENCES auth.users,
  acknowledged_at TIMESTAMPTZ,
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_usage_alerts_user ON public.usage_alerts(user_id, acknowledged, created_at DESC);
CREATE INDEX idx_usage_alerts_budget ON public.usage_alerts(budget_id, created_at DESC);
CREATE INDEX idx_usage_alerts_type ON public.usage_alerts(alert_type, alert_level, created_at DESC);

-- RLS for usage alerts
ALTER TABLE public.usage_alerts ENABLE ROW LEVEL SECURITY;

-- Users can view and acknowledge their own alerts
CREATE POLICY "Users can manage their own alerts"
  ON public.usage_alerts FOR ALL
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.usage_alerts IS 'Alert history for budget thresholds and limits';

-- ============================================================================
-- 6. HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate token cost
CREATE OR REPLACE FUNCTION calculate_token_cost(
  p_input_tokens INTEGER,
  p_output_tokens INTEGER,
  p_model TEXT
)
RETURNS TABLE (
  input_cost NUMERIC(10, 6),
  output_cost NUMERIC(10, 6),
  total_cost NUMERIC(10, 6)
) AS $$
DECLARE
  v_input_rate NUMERIC(10, 6);
  v_output_rate NUMERIC(10, 6);
BEGIN
  -- Pricing per 1M tokens (update these as needed)
  CASE p_model
    WHEN 'gpt-4o-mini' THEN
      v_input_rate := 0.150;
      v_output_rate := 0.600;
    WHEN 'gpt-4o' THEN
      v_input_rate := 2.50;
      v_output_rate := 10.00;
    WHEN 'gpt-4-turbo' THEN
      v_input_rate := 10.00;
      v_output_rate := 30.00;
    WHEN 'gpt-4' THEN
      v_input_rate := 30.00;
      v_output_rate := 60.00;
    WHEN 'gpt-3.5-turbo' THEN
      v_input_rate := 0.50;
      v_output_rate := 1.50;
    WHEN 'claude-3-5-sonnet' THEN
      v_input_rate := 3.00;
      v_output_rate := 15.00;
    WHEN 'gemini-1-5-pro' THEN
      v_input_rate := 1.25;
      v_output_rate := 5.00;
    ELSE
      -- Default to gpt-4o-mini pricing
      v_input_rate := 0.150;
      v_output_rate := 0.600;
  END CASE;
  
  RETURN QUERY SELECT
    (p_input_tokens::NUMERIC / 1000000) * v_input_rate,
    (p_output_tokens::NUMERIC / 1000000) * v_output_rate,
    ((p_input_tokens::NUMERIC / 1000000) * v_input_rate) + 
    ((p_output_tokens::NUMERIC / 1000000) * v_output_rate);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_token_cost IS 'Calculates cost in USD for given token counts and model';

-- Function to log token usage (called from app)
CREATE OR REPLACE FUNCTION log_token_usage(
  p_user_id UUID,
  p_team_id UUID,
  p_prompt_id UUID,
  p_run_id UUID,
  p_input_tokens INTEGER,
  p_output_tokens INTEGER,
  p_model TEXT,
  p_execution_type TEXT DEFAULT 'prompt_run'
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
  v_costs RECORD;
BEGIN
  -- Calculate costs
  SELECT * INTO v_costs FROM calculate_token_cost(p_input_tokens, p_output_tokens, p_model);
  
  -- Insert log
  INSERT INTO public.token_usage_logs (
    user_id,
    team_id,
    prompt_id,
    run_id,
    input_tokens,
    output_tokens,
    input_cost_usd,
    output_cost_usd,
    model,
    execution_type
  ) VALUES (
    p_user_id,
    p_team_id,
    p_prompt_id,
    p_run_id,
    p_input_tokens,
    p_output_tokens,
    v_costs.input_cost,
    v_costs.output_cost,
    p_model,
    p_execution_type
  )
  RETURNING id INTO v_log_id;
  
  -- Update budget tracking
  PERFORM update_budget_tracking(
    COALESCE(p_team_id, p_user_id),
    CASE WHEN p_team_id IS NOT NULL THEN 'team' ELSE 'user' END,
    p_input_tokens + p_output_tokens,
    v_costs.total_cost
  );
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION log_token_usage IS 'Logs token usage and updates budget tracking';

-- Function to update budget tracking
CREATE OR REPLACE FUNCTION update_budget_tracking(
  p_entity_id UUID,
  p_entity_type TEXT,
  p_tokens_used INTEGER,
  p_cost_usd NUMERIC(10, 6)
)
RETURNS VOID AS $$
DECLARE
  v_current_month DATE;
  v_budget RECORD;
BEGIN
  v_current_month := date_trunc('month', now());
  
  -- Get or create budget for current period
  INSERT INTO public.usage_budgets (
    entity_type,
    entity_id,
    period_start,
    period_tokens_used,
    period_cost_usd
  ) VALUES (
    p_entity_type,
    p_entity_id,
    v_current_month,
    p_tokens_used,
    p_cost_usd
  )
  ON CONFLICT (entity_type, entity_id, period_start)
  DO UPDATE SET
    period_tokens_used = usage_budgets.period_tokens_used + p_tokens_used,
    period_cost_usd = usage_budgets.period_cost_usd + p_cost_usd,
    updated_at = now()
  RETURNING * INTO v_budget;
  
  -- Check if we need to create alerts
  PERFORM check_budget_alerts(v_budget.id);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_budget_tracking IS 'Updates budget tracking and checks for alerts';

-- Function to check and create budget alerts
CREATE OR REPLACE FUNCTION check_budget_alerts(p_budget_id UUID)
RETURNS VOID AS $$
DECLARE
  v_budget RECORD;
  v_percentage INTEGER;
  v_alert_type TEXT;
  v_alert_level TEXT;
  v_should_alert BOOLEAN;
BEGIN
  -- Get budget details
  SELECT * INTO v_budget FROM public.usage_budgets WHERE id = p_budget_id;
  
  -- Skip if no budget limit set
  IF v_budget.monthly_budget_usd IS NULL THEN
    RETURN;
  END IF;
  
  -- Calculate percentage
  v_percentage := ROUND((v_budget.period_cost_usd / v_budget.monthly_budget_usd) * 100);
  
  -- Determine alert type and level
  v_should_alert := false;
  
  IF v_percentage >= v_budget.alert_threshold_3 THEN
    v_alert_type := 'budget_exceeded';
    v_alert_level := 'critical';
    v_should_alert := (v_budget.last_alert_level IS NULL OR v_budget.last_alert_level < v_budget.alert_threshold_3);
  ELSIF v_percentage >= v_budget.alert_threshold_2 THEN
    v_alert_type := 'threshold_90';
    v_alert_level := 'warning';
    v_should_alert := (v_budget.last_alert_level IS NULL OR v_budget.last_alert_level < v_budget.alert_threshold_2);
  ELSIF v_percentage >= v_budget.alert_threshold_1 THEN
    v_alert_type := 'threshold_75';
    v_alert_level := 'info';
    v_should_alert := (v_budget.last_alert_level IS NULL OR v_budget.last_alert_level < v_budget.alert_threshold_1);
  END IF;
  
  -- Create alert if needed
  IF v_should_alert THEN
    -- Get user_id based on entity type
    INSERT INTO public.usage_alerts (
      budget_id,
      user_id,
      alert_type,
      alert_level,
      title,
      message,
      current_usage_usd,
      budget_limit_usd,
      usage_percentage
    )
    SELECT
      p_budget_id,
      CASE 
        WHEN v_budget.entity_type = 'user' THEN v_budget.entity_id
        WHEN v_budget.entity_type = 'team' THEN t.owner_id
      END,
      v_alert_type,
      v_alert_level,
      CASE v_alert_level
        WHEN 'info' THEN 'Budget Alert'
        WHEN 'warning' THEN 'Budget Warning'
        WHEN 'critical' THEN 'Budget Exceeded'
      END,
      format('You have used %s%% of your monthly budget ($%s / $%s)',
        v_percentage,
        ROUND(v_budget.period_cost_usd, 2),
        ROUND(v_budget.monthly_budget_usd, 2)
      ),
      v_budget.period_cost_usd,
      v_budget.monthly_budget_usd,
      v_percentage
    FROM public.teams t
    WHERE t.id = v_budget.entity_id AND v_budget.entity_type = 'team'
    UNION ALL
    SELECT
      p_budget_id,
      v_budget.entity_id,
      v_alert_type,
      v_alert_level,
      CASE v_alert_level
        WHEN 'info' THEN 'Budget Alert'
        WHEN 'warning' THEN 'Budget Warning'
        WHEN 'critical' THEN 'Budget Exceeded'
      END,
      format('You have used %s%% of your monthly budget ($%s / $%s)',
        v_percentage,
        ROUND(v_budget.period_cost_usd, 2),
        ROUND(v_budget.monthly_budget_usd, 2)
      ),
      v_budget.period_cost_usd,
      v_budget.monthly_budget_usd,
      v_percentage
    WHERE v_budget.entity_type = 'user'
    LIMIT 1;
    
    -- Update last alert info
    UPDATE public.usage_budgets
    SET
      last_alert_sent_at = now(),
      last_alert_level = v_percentage
    WHERE id = p_budget_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_budget_alerts IS 'Checks budget thresholds and creates alerts';

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

-- Trigger to update usage_budgets updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_usage_budgets_updated_at
  BEFORE UPDATE ON public.usage_budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. GRANTS
-- ============================================================================

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION calculate_token_cost TO authenticated;
GRANT EXECUTE ON FUNCTION log_token_usage TO authenticated;
GRANT EXECUTE ON FUNCTION update_budget_tracking TO authenticated;
GRANT EXECUTE ON FUNCTION check_budget_alerts TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify migration
DO $$
BEGIN
  RAISE NOTICE 'Token Tracking System migration completed successfully!';
  RAISE NOTICE 'Tables created: token_usage_logs, usage_budgets, usage_alerts, teams, team_members';
  RAISE NOTICE 'Functions created: calculate_token_cost, log_token_usage, update_budget_tracking, check_budget_alerts';
END $$;
