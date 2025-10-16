-- Fix Admin Access for Free Tool Usage
-- Migration: 20250116000003_fix_admin_access.sql

-- Drop existing restrictive policy
drop policy if exists "Users can view their own usage" on public.free_tool_usage;

-- Create function to check if user is admin (reuse from agents)
-- This should already exist, but just in case
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

-- New RLS policies for free_tool_usage
create policy "Admins can view all free tool usage"
  on public.free_tool_usage for select
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Users can view their own free tool usage"
  on public.free_tool_usage for select
  using (
    auth.uid() = user_id
  );

-- Comment
comment on function public.is_admin_user is 'Returns true if the current user is an admin based on their email address';

