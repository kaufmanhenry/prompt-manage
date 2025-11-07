-- Demo Requests Table
-- Tracks demo booking requests from teams wanting to upgrade
-- COPY THIS ENTIRE FILE AND PASTE INTO SUPABASE SQL EDITOR

CREATE TABLE IF NOT EXISTS demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Contact info
  user_email TEXT NOT NULL,
  user_name TEXT,
  team_name TEXT,

  -- Context
  current_plan TEXT NOT NULL DEFAULT 'team',
  pending_invite_email TEXT,
  source TEXT NOT NULL DEFAULT 'unknown',

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending',
  contacted_at TIMESTAMPTZ,
  demo_scheduled_at TIMESTAMPTZ,
  demo_completed_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,

  -- Notes for sales team
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX idx_demo_requests_team_id ON demo_requests(team_id);
CREATE INDEX idx_demo_requests_user_id ON demo_requests(user_id);
CREATE INDEX idx_demo_requests_status ON demo_requests(status);
CREATE INDEX idx_demo_requests_created_at ON demo_requests(created_at DESC);
CREATE INDEX idx_demo_requests_source ON demo_requests(source);

-- Add updated_at trigger
CREATE TRIGGER update_demo_requests_updated_at
  BEFORE UPDATE ON demo_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own demo requests
CREATE POLICY "Users can view their own demo requests"
  ON demo_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create demo requests for their teams
CREATE POLICY "Team members can create demo requests"
  ON demo_requests
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = demo_requests.team_id
        AND team_members.user_id = auth.uid()
        AND team_members.is_active = true
    )
  );

-- Admins can view and update all demo requests (for CRM)
CREATE POLICY "Admins can manage demo requests"
  ON demo_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
        AND user_profiles.is_admin = true
    )
  );

-- Create view for sales dashboard
CREATE OR REPLACE VIEW demo_requests_dashboard AS
SELECT
  dr.id,
  dr.team_id,
  dr.user_id,
  dr.user_email,
  dr.user_name,
  dr.team_name,
  dr.current_plan,
  dr.pending_invite_email,
  dr.source,
  dr.status,
  dr.created_at,
  dr.contacted_at,
  dr.demo_scheduled_at,
  dr.notes,
  t.tier as team_current_tier,
  t.max_members as team_max_members,
  (SELECT COUNT(*) FROM team_members WHERE team_members.team_id = dr.team_id AND team_members.is_active = true) as team_member_count,
  CASE
    WHEN dr.contacted_at IS NULL THEN EXTRACT(EPOCH FROM (NOW() - dr.created_at)) / 3600
    ELSE NULL
  END as hours_waiting
FROM demo_requests dr
JOIN teams t ON t.id = dr.team_id
ORDER BY dr.created_at DESC;

COMMENT ON TABLE demo_requests IS 'Tracks demo booking requests from teams wanting to upgrade to Pro/Enterprise plans';
COMMENT ON VIEW demo_requests_dashboard IS 'Sales dashboard view with enriched data and metrics';
