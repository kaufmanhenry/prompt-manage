-- Fix Team Creation RLS Policies
-- Allow users to add themselves as owner when creating new teams
-- Version: 1.0.0
-- Date: 2025-01-20

-- ==============================================
-- FIX TEAM_MEMBERS RLS POLICIES
-- ==============================================

-- Drop existing policy
drop policy if exists "Admins can manage members" on team_members;

-- Separate policies for different operations

-- SELECT: Members can view team members (keep existing logic)
create policy "Members can view team members"
  on team_members for select
  using (
    exists (
      select 1 from team_members tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()
      and tm.is_active = true
    )
  );

-- INSERT: Allow users to add themselves as owner to new teams OR admins can add members
create policy "Users can join teams or admins can add members"
  on team_members for insert
  with check (
    -- User is adding themselves as owner to a team with no members (new team)
    (
      auth.uid() = user_id
      and role = 'owner'
      and not exists (
        select 1 from team_members tm
        where tm.team_id = team_members.team_id
      )
    )
    or
    -- OR user is admin/owner of the team
    exists (
      select 1 from team_members tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()
      and tm.role in ('owner', 'admin')
      and tm.is_active = true
    )
  );

-- UPDATE: Admins can update member roles
create policy "Admins can update members"
  on team_members for update
  using (
    exists (
      select 1 from team_members tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()
      and tm.role in ('owner', 'admin')
      and tm.is_active = true
    )
  );

-- DELETE: Admins can remove members (soft delete via is_active)
create policy "Admins can delete members"
  on team_members for delete
  using (
    exists (
      select 1 from team_members tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()
      and tm.role in ('owner', 'admin')
      and tm.is_active = true
    )
  );

-- ==============================================
-- COMMENTS
-- ==============================================

comment on policy "Users can join teams or admins can add members" on team_members is
  'Allow users to add themselves as owner to new teams, or allow admins to invite members to existing teams';
