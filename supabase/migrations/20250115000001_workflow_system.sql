-- Autonomous Workflow System
-- Migration: 20250115000001_workflow_system.sql
-- Description: Adds complete workflow automation, data sources, and execution engine
-- Dependencies: 20250115000000_token_tracking_system.sql

-- ============================================================================
-- 1. DATA SOURCES
-- ============================================================================

CREATE TABLE public.data_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams ON DELETE CASCADE,
  
  name TEXT NOT NULL CHECK (char_length(name) <= 200),
  description TEXT,
  type TEXT NOT NULL CHECK (
    type IN ('google_sheets', 'airtable', 'notion', 'api', 'csv', 'json', 'database', 'crm', 'webhook')
  ),
  
  -- Configuration (connector-specific settings)
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'error', 'paused', 'disconnected')),
  
  -- Sync settings
  sync_frequency TEXT CHECK (sync_frequency IN ('real-time', 'hourly', 'daily', 'weekly', 'manual')),
  last_sync_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  
  -- Error tracking
  error_log JSONB,
  error_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_data_sources_user ON public.data_sources(user_id);
CREATE INDEX idx_data_sources_team ON public.data_sources(team_id) WHERE team_id IS NOT NULL;
CREATE INDEX idx_data_sources_type ON public.data_sources(type);
CREATE INDEX idx_data_sources_status ON public.data_sources(status);
CREATE INDEX idx_data_sources_next_sync ON public.data_sources(next_sync_at) WHERE status = 'active';

-- RLS
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own data sources"
  ON public.data_sources FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Team members can view team data sources"
  ON public.data_sources FOR SELECT
  USING (
    team_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = data_sources.team_id AND user_id = auth.uid()
    )
  );

COMMENT ON TABLE public.data_sources IS 'External data source connections for workflows';

-- ============================================================================
-- 2. CONNECTOR CREDENTIALS (Encrypted)
-- ============================================================================

CREATE TABLE public.connector_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams ON DELETE CASCADE,
  
  connector_type TEXT NOT NULL,
  
  -- Encrypted credentials (use pgcrypto)
  encrypted_credentials BYTEA NOT NULL,
  encryption_key_id TEXT NOT NULL,
  
  -- OAuth specific
  oauth_token_expires_at TIMESTAMPTZ,
  oauth_refresh_token_encrypted BYTEA,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'error')),
  last_used_at TIMESTAMPTZ,
  last_refreshed_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_connector_credentials_user ON public.connector_credentials(user_id);
CREATE INDEX idx_connector_credentials_type ON public.connector_credentials(connector_type);
CREATE INDEX idx_connector_credentials_expires ON public.connector_credentials(oauth_token_expires_at) 
  WHERE oauth_token_expires_at IS NOT NULL;

-- RLS
ALTER TABLE public.connector_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own credentials"
  ON public.connector_credentials FOR ALL
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.connector_credentials IS 'Encrypted credentials for data source connectors';

-- ============================================================================
-- 3. DATA SOURCE SYNCS
-- ============================================================================

CREATE TABLE public.data_source_syncs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_source_id UUID REFERENCES public.data_sources ON DELETE CASCADE NOT NULL,
  
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  
  -- Metrics
  records_fetched INTEGER DEFAULT 0,
  records_processed INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  bytes_transferred BIGINT DEFAULT 0,
  
  -- Error handling
  error_message TEXT,
  error_details JSONB,
  
  -- Sync metadata
  sync_mode TEXT CHECK (sync_mode IN ('full', 'incremental')),
  sync_metadata JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_data_source_syncs_source ON public.data_source_syncs(data_source_id, created_at DESC);
CREATE INDEX idx_data_source_syncs_status ON public.data_source_syncs(status, started_at DESC);

-- RLS
ALTER TABLE public.data_source_syncs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view syncs for their data sources"
  ON public.data_source_syncs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.data_sources
      WHERE id = data_source_syncs.data_source_id
        AND user_id = auth.uid()
    )
  );

COMMENT ON TABLE public.data_source_syncs IS 'History of data source synchronization runs';

-- ============================================================================
-- 4. WORKFLOWS
-- ============================================================================

CREATE TABLE public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams ON DELETE CASCADE,
  
  name TEXT NOT NULL CHECK (char_length(name) <= 200),
  description TEXT,
  
  -- Workflow definition (DAG as JSON)
  definition JSONB NOT NULL DEFAULT '{
    "version": "1.0",
    "nodes": [],
    "edges": [],
    "settings": {}
  }'::jsonb,
  
  -- Execution settings
  execution_mode TEXT DEFAULT 'manual' CHECK (
    execution_mode IN ('manual', 'scheduled', 'triggered', 'continuous', 'webhook')
  ),
  schedule_config JSONB, -- cron expression, frequency
  trigger_config JSONB, -- webhook, event triggers
  
  -- Execution limits
  max_concurrent_runs INTEGER DEFAULT 1,
  timeout_seconds INTEGER DEFAULT 3600,
  retry_config JSONB DEFAULT '{
    "max_attempts": 3,
    "backoff": "exponential",
    "initial_delay_ms": 1000,
    "max_delay_ms": 30000
  }'::jsonb,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (
    status IN ('draft', 'active', 'paused', 'archived', 'error')
  ),
  version INTEGER DEFAULT 1,
  is_template BOOLEAN DEFAULT false,
  
  -- Metrics
  total_executions INTEGER DEFAULT 0,
  successful_executions INTEGER DEFAULT 0,
  failed_executions INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  
  -- Metadata
  tags TEXT[],
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_workflows_user ON public.workflows(user_id);
CREATE INDEX idx_workflows_team ON public.workflows(team_id) WHERE team_id IS NOT NULL;
CREATE INDEX idx_workflows_status ON public.workflows(status);
CREATE INDEX idx_workflows_mode ON public.workflows(execution_mode) WHERE status = 'active';
CREATE INDEX idx_workflows_template ON public.workflows(is_template) WHERE is_template = true;
CREATE INDEX idx_workflows_tags ON public.workflows USING gin(tags);

-- RLS
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own workflows"
  ON public.workflows FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Team members can view team workflows"
  ON public.workflows FOR SELECT
  USING (
    team_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = workflows.team_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view public templates"
  ON public.workflows FOR SELECT
  USING (is_template = true AND status = 'active');

COMMENT ON TABLE public.workflows IS 'Workflow definitions and configurations';

-- ============================================================================
-- 5. WORKFLOW NODES
-- ============================================================================

CREATE TABLE public.workflow_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES public.workflows ON DELETE CASCADE NOT NULL,
  node_id TEXT NOT NULL, -- unique within workflow
  
  node_type TEXT NOT NULL CHECK (
    node_type IN ('data_source', 'prompt', 'condition', 'transform', 'loop', 'output', 'webhook', 'delay')
  ),
  
  label TEXT NOT NULL,
  
  -- Node configuration
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- UI position
  position JSONB DEFAULT '{"x": 0, "y": 0}'::jsonb,
  
  -- Dependencies
  depends_on TEXT[], -- array of node_ids
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(workflow_id, node_id)
);

-- Indexes
CREATE INDEX idx_workflow_nodes_workflow ON public.workflow_nodes(workflow_id);
CREATE INDEX idx_workflow_nodes_type ON public.workflow_nodes(node_type);

COMMENT ON TABLE public.workflow_nodes IS 'Individual nodes within workflow DAG';

-- ============================================================================
-- 6. WORKFLOW EXECUTIONS
-- ============================================================================

CREATE TABLE public.workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES public.workflows ON DELETE CASCADE NOT NULL,
  workflow_version INTEGER NOT NULL,
  
  -- Execution context
  triggered_by TEXT NOT NULL CHECK (
    triggered_by IN ('manual', 'schedule', 'api', 'webhook', 'event', 'system')
  ),
  triggered_by_user_id UUID REFERENCES auth.users,
  trigger_data JSONB,
  
  -- Status tracking
  status TEXT NOT NULL CHECK (
    status IN ('queued', 'running', 'completed', 'failed', 'cancelled', 'timeout')
  ),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Results
  total_nodes INTEGER DEFAULT 0,
  completed_nodes INTEGER DEFAULT 0,
  failed_nodes INTEGER DEFAULT 0,
  skipped_nodes INTEGER DEFAULT 0,
  
  -- Metrics
  total_tokens_used INTEGER DEFAULT 0,
  total_cost_usd NUMERIC(10, 6) DEFAULT 0,
  execution_time_ms INTEGER,
  
  -- Error handling
  error_message TEXT,
  error_node_id TEXT,
  error_details JSONB,
  
  -- Output data
  output_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_workflow_executions_workflow ON public.workflow_executions(workflow_id, created_at DESC);
CREATE INDEX idx_workflow_executions_status ON public.workflow_executions(status, started_at DESC);
CREATE INDEX idx_workflow_executions_user ON public.workflow_executions(triggered_by_user_id, created_at DESC) 
  WHERE triggered_by_user_id IS NOT NULL;

-- RLS
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view executions for their workflows"
  ON public.workflow_executions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workflows
      WHERE id = workflow_executions.workflow_id
        AND user_id = auth.uid()
    )
  );

COMMENT ON TABLE public.workflow_executions IS 'History of workflow execution runs';

-- ============================================================================
-- 7. NODE EXECUTIONS
-- ============================================================================

CREATE TABLE public.node_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_execution_id UUID REFERENCES public.workflow_executions ON DELETE CASCADE NOT NULL,
  node_id TEXT NOT NULL,
  
  -- Execution details
  status TEXT NOT NULL CHECK (
    status IN ('queued', 'running', 'completed', 'failed', 'skipped', 'retrying')
  ),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Input/Output
  input_data JSONB,
  output_data JSONB,
  
  -- Metrics (for prompt nodes)
  tokens_used INTEGER,
  cost_usd NUMERIC(10, 6),
  model TEXT,
  execution_time_ms INTEGER,
  
  -- Error handling
  attempt_number INTEGER DEFAULT 1,
  max_attempts INTEGER DEFAULT 3,
  error_message TEXT,
  error_details JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_node_executions_workflow_exec ON public.node_executions(workflow_execution_id, started_at);
CREATE INDEX idx_node_executions_node ON public.node_executions(node_id, status);
CREATE INDEX idx_node_executions_status ON public.node_executions(status);

COMMENT ON TABLE public.node_executions IS 'Individual node execution results within workflow runs';

-- ============================================================================
-- 8. WORKFLOW PERMISSIONS
-- ============================================================================

CREATE TABLE public.workflow_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES public.workflows ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  
  permission_level TEXT NOT NULL CHECK (
    permission_level IN ('viewer', 'runner', 'editor', 'admin')
  ),
  
  granted_by_user_id UUID REFERENCES auth.users NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(workflow_id, user_id)
);

-- Indexes
CREATE INDEX idx_workflow_permissions_workflow ON public.workflow_permissions(workflow_id);
CREATE INDEX idx_workflow_permissions_user ON public.workflow_permissions(user_id);

-- RLS
ALTER TABLE public.workflow_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workflow owners can manage permissions"
  ON public.workflow_permissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workflows
      WHERE id = workflow_permissions.workflow_id
        AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own permissions"
  ON public.workflow_permissions FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.workflow_permissions IS 'Granular permissions for workflow sharing';

-- ============================================================================
-- 9. WORKFLOW TEMPLATES
-- ============================================================================

CREATE TABLE public.workflow_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (
    category IN ('content_generation', 'data_processing', 'analysis', 'automation', 'integration', 'reporting', 'other')
  ),
  
  -- Template definition
  definition JSONB NOT NULL,
  
  -- Publishing
  is_public BOOLEAN DEFAULT false,
  created_by_user_id UUID REFERENCES auth.users,
  
  -- Metadata
  tags TEXT[],
  use_count INTEGER DEFAULT 0,
  rating NUMERIC(2, 1) CHECK (rating BETWEEN 0 AND 5),
  rating_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_workflow_templates_category ON public.workflow_templates(category) WHERE is_public = true;
CREATE INDEX idx_workflow_templates_public ON public.workflow_templates(is_public, rating DESC);
CREATE INDEX idx_workflow_templates_tags ON public.workflow_templates USING gin(tags);

-- RLS
ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public templates"
  ON public.workflow_templates FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can manage their own templates"
  ON public.workflow_templates FOR ALL
  USING (auth.uid() = created_by_user_id);

COMMENT ON TABLE public.workflow_templates IS 'Pre-built workflow templates for quick start';

-- ============================================================================
-- 10. WORKFLOW ALERTS
-- ============================================================================

CREATE TABLE public.workflow_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES public.workflows ON DELETE CASCADE,
  workflow_execution_id UUID REFERENCES public.workflow_executions,
  
  alert_type TEXT NOT NULL CHECK (
    alert_type IN ('failure', 'empty_output', 'cost_threshold', 'performance_degradation', 'timeout', 'retry_exhausted')
  ),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  
  -- Notification tracking
  notified_users UUID[],
  notified_via TEXT[], -- ['email', 'slack', 'webhook']
  notification_sent_at TIMESTAMPTZ,
  
  -- Acknowledgment
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_by_user_id UUID REFERENCES auth.users,
  acknowledged_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_workflow_alerts_workflow ON public.workflow_alerts(workflow_id, created_at DESC);
CREATE INDEX idx_workflow_alerts_execution ON public.workflow_alerts(workflow_execution_id);
CREATE INDEX idx_workflow_alerts_severity ON public.workflow_alerts(severity, acknowledged, created_at DESC);

-- RLS
ALTER TABLE public.workflow_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view alerts for their workflows"
  ON public.workflow_alerts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workflows
      WHERE id = workflow_alerts.workflow_id
        AND user_id = auth.uid()
    )
  );

COMMENT ON TABLE public.workflow_alerts IS 'Alerts for workflow failures and issues';

-- ============================================================================
-- 11. HELPER FUNCTIONS
-- ============================================================================

-- Function to queue a workflow execution
CREATE OR REPLACE FUNCTION queue_workflow_execution(
  p_workflow_id UUID,
  p_triggered_by TEXT,
  p_triggered_by_user_id UUID DEFAULT NULL,
  p_trigger_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_execution_id UUID;
  v_workflow RECORD;
BEGIN
  -- Get workflow details
  SELECT * INTO v_workflow FROM public.workflows WHERE id = p_workflow_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Workflow not found: %', p_workflow_id;
  END IF;
  
  IF v_workflow.status != 'active' THEN
    RAISE EXCEPTION 'Workflow is not active: %', v_workflow.status;
  END IF;
  
  -- Create execution record
  INSERT INTO public.workflow_executions (
    workflow_id,
    workflow_version,
    triggered_by,
    triggered_by_user_id,
    trigger_data,
    status
  ) VALUES (
    p_workflow_id,
    v_workflow.version,
    p_triggered_by,
    p_triggered_by_user_id,
    p_trigger_data,
    'queued'
  )
  RETURNING id INTO v_execution_id;
  
  -- Update workflow metrics
  UPDATE public.workflows
  SET
    total_executions = total_executions + 1,
    last_executed_at = now(),
    updated_at = now()
  WHERE id = p_workflow_id;
  
  RETURN v_execution_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION queue_workflow_execution IS 'Creates a new workflow execution and queues it for processing';

-- Function to update workflow execution status
CREATE OR REPLACE FUNCTION update_workflow_execution_status(
  p_execution_id UUID,
  p_status TEXT,
  p_error_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.workflow_executions
  SET
    status = p_status,
    error_message = p_error_message,
    completed_at = CASE WHEN p_status IN ('completed', 'failed', 'cancelled', 'timeout') THEN now() ELSE completed_at END,
    execution_time_ms = CASE 
      WHEN p_status IN ('completed', 'failed', 'cancelled', 'timeout') AND started_at IS NOT NULL 
      THEN EXTRACT(EPOCH FROM (now() - started_at)) * 1000
      ELSE execution_time_ms
    END
  WHERE id = p_execution_id;
  
  -- Update workflow success/failure counts
  IF p_status = 'completed' THEN
    UPDATE public.workflows
    SET successful_executions = successful_executions + 1
    WHERE id = (SELECT workflow_id FROM public.workflow_executions WHERE id = p_execution_id);
  ELSIF p_status = 'failed' THEN
    UPDATE public.workflows
    SET failed_executions = failed_executions + 1
    WHERE id = (SELECT workflow_id FROM public.workflow_executions WHERE id = p_execution_id);
  END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_workflow_execution_status IS 'Updates workflow execution status and metrics';

-- ============================================================================
-- 12. TRIGGERS
-- ============================================================================

CREATE TRIGGER update_data_sources_updated_at
  BEFORE UPDATE ON public.data_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON public.workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connector_credentials_updated_at
  BEFORE UPDATE ON public.connector_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_templates_updated_at
  BEFORE UPDATE ON public.workflow_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 13. GRANTS
-- ============================================================================

GRANT EXECUTE ON FUNCTION queue_workflow_execution TO authenticated;
GRANT EXECUTE ON FUNCTION update_workflow_execution_status TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Workflow System migration completed successfully!';
  RAISE NOTICE 'Tables created: data_sources, connector_credentials, data_source_syncs, workflows, workflow_nodes, workflow_executions, node_executions, workflow_permissions, workflow_templates, workflow_alerts';
  RAISE NOTICE 'Functions created: queue_workflow_execution, update_workflow_execution_status';
  RAISE NOTICE 'Ready to build autonomous AI workflows!';
END $$;

