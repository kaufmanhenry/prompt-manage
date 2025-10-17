-- Audit Logging System Migration
-- Track sensitive operations for security and compliance

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'prompt_created', 'user_login', 'payment_processed', etc.
  resource_type TEXT NOT NULL, -- 'prompt', 'user', 'payment', etc.
  resource_id UUID, -- ID of the affected resource

  -- Context information
  metadata JSONB DEFAULT '{}', -- Additional context data
  ip_address INET,
  user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Error logs table (separate from audit logs for performance)
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  action TEXT NOT NULL, -- The operation that failed
  error_message TEXT NOT NULL,
  error_code TEXT,

  -- Context information
  context JSONB DEFAULT '{}', -- Additional context data

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id) WHERE resource_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_error_logs_action ON public.error_logs(action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at DESC);

-- Enable RLS for audit and error logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own audit logs
CREATE POLICY "Users can view their own audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own error logs
CREATE POLICY "Users can view their own error logs"
  ON public.error_logs FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert audit and error logs
CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can insert error logs"
  ON public.error_logs FOR INSERT
  WITH CHECK (true);

-- Function to clean up old audit logs (keep 90 days for compliance)
CREATE OR REPLACE FUNCTION cleanup_audit_logs()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- Delete audit logs older than 90 days
  DELETE FROM public.audit_logs
  WHERE created_at < now() - INTERVAL '90 days';

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  -- Delete error logs older than 30 days
  DELETE FROM public.error_logs
  WHERE created_at < now() - INTERVAL '30 days';

  GET DIAGNOSTICS v_deleted_count = v_deleted_count + ROW_COUNT;

  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_audit_logs IS 'Cleanup old audit and error logs';

-- Grant permissions
GRANT EXECUTE ON FUNCTION cleanup_audit_logs TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify migration
DO $$
BEGIN
  RAISE NOTICE 'Audit logging system migration completed successfully!';
  RAISE NOTICE 'Tables created: audit_logs, error_logs';
  RAISE NOTICE 'Function created: cleanup_audit_logs';
END $$;
