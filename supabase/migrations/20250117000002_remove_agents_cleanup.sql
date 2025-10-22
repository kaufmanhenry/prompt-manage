-- ========================================
-- REMOVE AGENT-RELATED DATABASE OBJECTS
-- Migration: 20250117000002_remove_agents_cleanup.sql
-- Description: Removes all agent-related tables, functions, and policies
-- ========================================

-- ========================================
-- 1. DROP AGENT-RELATED TABLES
-- ========================================

-- Drop agent-related tables if they exist
DROP TABLE IF EXISTS public.agent_generations CASCADE;
DROP TABLE IF EXISTS public.agent_metrics CASCADE;
DROP TABLE IF EXISTS public.agents CASCADE;

-- ========================================
-- 2. DROP AGENT-RELATED FUNCTIONS
-- ========================================

-- Drop agent-related functions if they exist
DROP FUNCTION IF EXISTS public.generate_agent_prompt(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.log_agent_generation(UUID, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.update_agent_metrics(UUID, INTEGER, INTEGER, NUMERIC);

-- ========================================
-- 3. CLEAN UP ANY AGENT REFERENCES
-- ========================================

-- Remove any agent-related columns from other tables
ALTER TABLE public.prompts DROP COLUMN IF EXISTS agent_id;
ALTER TABLE public.prompts DROP COLUMN IF EXISTS generated_by_agent;

-- ========================================
-- 4. COMMENTS
-- ========================================

COMMENT ON SCHEMA public IS 'Agent-related functionality removed for rebuild';
