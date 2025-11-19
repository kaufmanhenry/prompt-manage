-- Fix submitted_by column to be nullable
-- This addresses the NOT NULL constraint issue preventing seed data insertion

-- Drop NOT NULL constraint if it exists
ALTER TABLE IF EXISTS public.ai_tools
  ALTER COLUMN submitted_by DROP NOT NULL;

-- Add comment to clarify this column is optional
COMMENT ON COLUMN public.ai_tools.submitted_by IS
  'User ID of person who submitted the tool. NULL for system-seeded tools.';
