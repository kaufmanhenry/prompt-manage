-- Fix RLS policies for agents to allow admin users
-- Migration: 20250116000001_fix_agents_rls.sql

-- Drop old restrictive policies
drop policy if exists "Service role can manage agents" on public.agents;
drop policy if exists "Service role can manage agent generations" on public.agent_generations;
drop policy if exists "Service role can manage agent metrics" on public.agent_metrics;

-- Create function to check if user is admin
create or replace function public.is_admin_user()
returns boolean as $$
declare
  user_email text;
begin
  -- Get current user's email
  select email into user_email from auth.users where id = auth.uid();
  
  -- Check if email is in admin list
  return user_email in (
    'mikemoloney.business@gmail.com',
    'hkaufman19@gmail.com',
    'mike@filtergrade.com'
  );
end;
$$ language plpgsql security definer;

-- New RLS policies for agents (allow authenticated admin users)
create policy "Admins can view all agents"
  on public.agents for select
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can insert agents"
  on public.agents for insert
  with check (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can update agents"
  on public.agents for update
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can delete agents"
  on public.agents for delete
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

-- New RLS policies for agent_generations
create policy "Admins can view all agent generations"
  on public.agent_generations for select
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can insert agent generations"
  on public.agent_generations for insert
  with check (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can update agent generations"
  on public.agent_generations for update
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can delete agent generations"
  on public.agent_generations for delete
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

-- New RLS policies for agent_metrics
create policy "Admins can view all agent metrics"
  on public.agent_metrics for select
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can insert agent metrics"
  on public.agent_metrics for insert
  with check (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can update agent metrics"
  on public.agent_metrics for update
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can delete agent metrics"
  on public.agent_metrics for delete
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all on public.agents to authenticated;
grant all on public.agent_generations to authenticated;
grant all on public.agent_metrics to authenticated;

-- Comment
comment on function public.is_admin_user is 'Returns true if the current user is an admin based on their email address';

