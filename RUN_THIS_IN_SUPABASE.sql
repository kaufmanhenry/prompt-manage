-- ========================================
-- PROMPT MANAGE - REQUIRED MIGRATIONS
-- Run this entire script in Supabase SQL Editor
-- ========================================
-- This combines 4 migrations needed for:
-- 1. Stripe integration
-- 2. Admin access for agents
-- 3. Free tool usage tracking
-- 4. Admin access for free tool data
-- ========================================

-- MIGRATION 1: Add Stripe to User Profiles
-- ========================================
alter table public.user_profiles
add column if not exists stripe_customer_id text unique,
add column if not exists subscription_tier text default 'free' check (subscription_tier in ('free', 'team', 'enterprise')),
add column if not exists subscription_status text,
add column if not exists subscription_period_end timestamptz;

create index if not exists user_profiles_stripe_customer_idx 
  on public.user_profiles (stripe_customer_id) 
  where stripe_customer_id is not null;

create index if not exists user_profiles_subscription_tier_idx 
  on public.user_profiles (subscription_tier);

comment on column public.user_profiles.stripe_customer_id is 'Stripe customer ID for billing';
comment on column public.user_profiles.subscription_tier is 'Current subscription tier: free, team, or enterprise';
comment on column public.user_profiles.subscription_status is 'Stripe subscription status: active, past_due, canceled, etc.';
comment on column public.user_profiles.subscription_period_end is 'End date of current subscription period';

-- MIGRATION 2: Fix Agent RLS Policies
-- ========================================
drop policy if exists "Service role can manage agents" on public.agents;
drop policy if exists "Service role can manage agent generations" on public.agent_generations;
drop policy if exists "Service role can manage agent metrics" on public.agent_metrics;

create or replace function public.is_admin_user()
returns boolean as $$
declare
  user_email text;
begin
  select email into user_email from auth.users where id = auth.uid();
  return user_email in (
    'mikemoloney.business@gmail.com',
    'hkaufman19@gmail.com',
    'mike@filtergrade.com'
  );
end;
$$ language plpgsql security definer;

create policy "Admins can view all agents"
  on public.agents for select
  using (auth.role() = 'authenticated' and public.is_admin_user());

create policy "Admins can insert agents"
  on public.agents for insert
  with check (auth.role() = 'authenticated' and public.is_admin_user());

create policy "Admins can update agents"
  on public.agents for update
  using (auth.role() = 'authenticated' and public.is_admin_user());

create policy "Admins can delete agents"
  on public.agents for delete
  using (auth.role() = 'authenticated' and public.is_admin_user());

create policy "Admins can view all agent generations"
  on public.agent_generations for select
  using (auth.role() = 'authenticated' and public.is_admin_user());

create policy "Admins can insert agent generations"
  on public.agent_generations for insert
  with check (auth.role() = 'authenticated' and public.is_admin_user());

create policy "Admins can update agent generations"
  on public.agent_generations for update
  using (auth.role() = 'authenticated' and public.is_admin_user());

create policy "Admins can delete agent generations"
  on public.agent_generations for delete
  using (auth.role() = 'authenticated' and public.is_admin_user());

create policy "Admins can view all agent metrics"
  on public.agent_metrics for select
  using (auth.role() = 'authenticated' and public.is_admin_user());

create policy "Admins can insert agent metrics"
  on public.agent_metrics for insert
  with check (auth.role() = 'authenticated' and public.is_admin_user());

create policy "Admins can update agent metrics"
  on public.agent_metrics for update
  using (auth.role() = 'authenticated' and public.is_admin_user());

create policy "Admins can delete agent metrics"
  on public.agent_metrics for delete
  using (auth.role() = 'authenticated' and public.is_admin_user());

grant usage on schema public to authenticated;
grant all on public.agents to authenticated;
grant all on public.agent_generations to authenticated;
grant all on public.agent_metrics to authenticated;

-- MIGRATION 3: Free Tool Usage Tracking
-- ========================================
create table if not exists public.free_tool_usage (
  id uuid primary key default gen_random_uuid(),
  tool_name text not null,
  user_id uuid references auth.users(id) on delete set null,
  ip_address text,
  fingerprint text,
  prompt_generated text,
  saved_to_library boolean default false,
  created_at timestamptz default now()
);

create index if not exists free_tool_usage_user_id_idx on public.free_tool_usage(user_id);
create index if not exists free_tool_usage_ip_address_idx on public.free_tool_usage(ip_address);
create index if not exists free_tool_usage_fingerprint_idx on public.free_tool_usage(fingerprint);
create index if not exists free_tool_usage_created_at_idx on public.free_tool_usage(created_at);

alter table public.free_tool_usage enable row level security;

create or replace function public.check_free_tool_rate_limit(
  p_tool_name text,
  p_ip_address text,
  p_fingerprint text
)
returns jsonb as $$
declare
  usage_count integer;
  is_allowed boolean;
  remaining_uses integer;
begin
  select count(*) into usage_count
  from public.free_tool_usage
  where tool_name = p_tool_name
    and (ip_address = p_ip_address or fingerprint = p_fingerprint)
    and created_at > now() - interval '24 hours'
    and user_id is null;
  
  is_allowed := usage_count < 3;
  remaining_uses := greatest(0, 3 - usage_count);
  
  return jsonb_build_object(
    'allowed', is_allowed,
    'count', usage_count,
    'limit', 3,
    'remaining', remaining_uses,
    'reset_at', (now() + interval '24 hours')::text
  );
end;
$$ language plpgsql security definer;

grant usage on schema public to anon;
grant all on public.free_tool_usage to anon, authenticated;
grant execute on function public.check_free_tool_rate_limit to anon, authenticated;

-- MIGRATION 4: Admin Access for Free Tool Usage
-- ========================================
drop policy if exists "Anyone can insert usage" on public.free_tool_usage;
drop policy if exists "Users can view their own usage" on public.free_tool_usage;

create policy "Admins can view all free tool usage"
  on public.free_tool_usage for select
  using (auth.role() = 'authenticated' and public.is_admin_user());

create policy "Users can view their own free tool usage"
  on public.free_tool_usage for select
  using (auth.uid() = user_id);

create policy "Anyone can insert free tool usage"
  on public.free_tool_usage for insert
  with check (true);

-- Comments
comment on table public.free_tool_usage is 'Tracks usage of free AI tools for rate limiting and analytics';
comment on function public.check_free_tool_rate_limit is 'Checks if a non-logged-in user has exceeded the rate limit (3 uses per 24 hours)';
comment on function public.is_admin_user is 'Returns true if the current user is an admin based on their email address';

-- ========================================
-- MIGRATION COMPLETE! 
-- ========================================
-- You should now see:
-- 1. User subscription tiers in admin dashboard
-- 2. Agent data visible to admins
-- 3. Free tool usage tracking
-- 4. All data visible in /dashboard/admin
-- ========================================

