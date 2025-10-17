-- Performance Optimization Migration
-- Add database indexes for faster queries

-- Indexes for prompts table
CREATE INDEX IF NOT EXISTS idx_prompts_is_public_updated_at ON public.prompts(is_public, updated_at DESC) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_prompts_is_public_view_count ON public.prompts(is_public, view_count DESC) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_prompts_model ON public.prompts(model) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_prompts_tags_gin ON public.prompts USING GIN(tags) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_prompts_user_id_public ON public.prompts(user_id, updated_at DESC) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_prompts_slug ON public.prompts(slug) WHERE is_public = true;

-- Indexes for user_profiles table
CREATE INDEX IF NOT EXISTS idx_user_profiles_display_name ON public.user_profiles(display_name);

-- Indexes for prompt_run_history table
CREATE INDEX IF NOT EXISTS idx_prompt_run_history_user_id ON public.prompt_run_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_run_history_prompt_id ON public.prompt_run_history(prompt_id, created_at DESC);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_prompts_public_model_tags ON public.prompts(is_public, model, tags) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_prompts_public_updated_view ON public.prompts(is_public, updated_at DESC, view_count DESC) WHERE is_public = true;

-- Full text search index for prompt titles and descriptions
CREATE INDEX IF NOT EXISTS idx_prompts_search ON public.prompts USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, ''))) WHERE is_public = true;

-- Statistics update to help query planner
ANALYZE public.prompts;
ANALYZE public.user_profiles;
ANALYZE public.prompt_run_history;
