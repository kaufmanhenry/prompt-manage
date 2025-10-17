-- Rate Limiting System Migration
-- Database-backed rate limiting for production environments

-- Rate limiting requests table
CREATE TABLE IF NOT EXISTS public.rate_limit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or user ID
  request_type TEXT NOT NULL, -- 'api_call', 'free_tool', etc.
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Composite unique constraint for time window
  UNIQUE(identifier, request_type, created_at)
);

-- Index for efficient cleanup and queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_requests_identifier_type_created ON public.rate_limit_requests(identifier, request_type, created_at DESC);

-- Enable RLS for rate limiting table
ALTER TABLE public.rate_limit_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to check their own rate limits
CREATE POLICY "Users can check their own rate limits"
  ON public.rate_limit_requests FOR SELECT
  USING (auth.uid()::text = identifier);

-- Allow system to insert rate limit records
CREATE POLICY "System can insert rate limit records"
  ON public.rate_limit_requests FOR INSERT
  WITH CHECK (true);

-- Function to check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_request_type TEXT DEFAULT 'api_call',
  p_limit INTEGER DEFAULT 10,
  p_window_seconds INTEGER DEFAULT 60
)
RETURNS TABLE (
  allowed BOOLEAN,
  remaining INTEGER,
  reset_time TIMESTAMPTZ,
  current_count INTEGER
) AS $$
DECLARE
  v_window_start TIMESTAMPTZ;
  v_current_count INTEGER;
  v_reset_time TIMESTAMPTZ;
BEGIN
  -- Calculate window start time
  v_window_start := now() - (p_window_seconds || ' seconds')::INTERVAL;
  v_reset_time := now() + (p_window_seconds || ' seconds')::INTERVAL;

  -- Count requests in current window
  SELECT COUNT(*) INTO v_current_count
  FROM public.rate_limit_requests
  WHERE identifier = p_identifier
    AND request_type = p_request_type
    AND created_at >= v_window_start;

  -- Check if under limit
  IF v_current_count < p_limit THEN
    -- Insert this request
    INSERT INTO public.rate_limit_requests (identifier, request_type)
    VALUES (p_identifier, p_request_type);

    RETURN QUERY SELECT
      true,
      (p_limit - v_current_count - 1)::INTEGER,
      v_reset_time,
      (v_current_count + 1)::INTEGER;
  ELSE
    -- Rate limit exceeded
    RETURN QUERY SELECT
      false,
      0::INTEGER,
      v_reset_time,
      v_current_count::INTEGER;
  END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_rate_limit IS 'Database-backed rate limiting function';

-- Function to clean up old rate limit records (call periodically)
CREATE OR REPLACE FUNCTION cleanup_rate_limit_records()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- Delete records older than 1 hour
  DELETE FROM public.rate_limit_requests
  WHERE created_at < now() - INTERVAL '1 hour';

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_rate_limit_records IS 'Cleanup old rate limit records';

-- Grant permissions
GRANT EXECUTE ON FUNCTION check_rate_limit TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_rate_limit_records TO authenticated;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify migration
DO $$
BEGIN
  RAISE NOTICE 'Rate limiting system migration completed successfully!';
  RAISE NOTICE 'Tables created: rate_limit_requests';
  RAISE NOTICE 'Functions created: check_rate_limit, cleanup_rate_limit_records';
END $$;
