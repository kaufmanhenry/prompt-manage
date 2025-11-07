-- Teams Integration: Connect prompts to teams and create personal teams
-- Version: 1.0.0
-- Date: 2025-01-20
-- COPY THIS ENTIRE FILE AND PASTE INTO SUPABASE SQL EDITOR

-- ==============================================
-- ADD TEAM_ID TO PROMPTS TABLE
-- ==============================================

-- Add team_id column to prompts
alter table public.prompts
  add column if not exists team_id uuid references teams on delete cascade;

-- Create index for team_id
create index if not exists prompts_team_id_idx on public.prompts (team_id);
create index if not exists prompts_team_public_idx on public.prompts (team_id, is_public);

-- ==============================================
-- AUTO-CREATE PERSONAL TEAM ON USER SIGNUP
-- ==============================================

-- Function to create a personal team for a new user
create or replace function create_personal_team()
returns trigger as $$
declare
  v_team_id uuid;
  v_display_name text;
begin
  -- Get display name from metadata or email
  v_display_name := coalesce(
    new.raw_user_meta_data->>'display_name',
    split_part(new.email, '@', 1)
  );

  -- Create personal team
  insert into public.teams (
    name,
    description,
    tier,
    is_active,
    is_verified
  ) values (
    v_display_name || '''s Team',
    'Personal workspace',
    'free',
    true,
    false
  ) returning id into v_team_id;

  -- Add user as owner
  insert into public.team_members (
    team_id,
    user_id,
    role,
    is_active
  ) values (
    v_team_id,
    new.id,
    'owner',
    true
  );

  -- Create user profile if it doesn't exist
  insert into public.user_profiles (id, display_name)
  values (new.id, v_display_name)
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signups
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function create_personal_team();

-- ==============================================
-- UPDATE PROMPTS RLS POLICIES
-- ==============================================

-- Drop existing policies
drop policy if exists "Users can manage their own prompts" on public.prompts;
drop policy if exists "Anyone can read public prompts" on public.prompts;

-- New team-based policies
create policy "Team members can view team prompts"
  on public.prompts for select
  using (
    -- Can view if member of the team
    exists (
      select 1 from team_members
      where team_members.team_id = prompts.team_id
      and team_members.user_id = auth.uid()
      and team_members.is_active = true
    )
    -- Or if prompt is public
    or prompts.is_public = true
  );

create policy "Team editors can create prompts"
  on public.prompts for insert
  with check (
    exists (
      select 1 from team_members
      where team_members.team_id = prompts.team_id
      and team_members.user_id = auth.uid()
      and team_members.role in ('owner', 'admin', 'editor')
      and team_members.is_active = true
    )
  );

create policy "Team editors can update prompts"
  on public.prompts for update
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = prompts.team_id
      and team_members.user_id = auth.uid()
      and team_members.role in ('owner', 'admin', 'editor')
      and team_members.is_active = true
    )
  );

create policy "Team owners/admins can delete prompts"
  on public.prompts for delete
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = prompts.team_id
      and team_members.user_id = auth.uid()
      and team_members.role in ('owner', 'admin')
      and team_members.is_active = true
    )
  );

-- ==============================================
-- HELPER FUNCTION TO GET USER'S DEFAULT TEAM
-- ==============================================

create or replace function get_user_default_team(p_user_id uuid default auth.uid())
returns uuid as $$
declare
  v_team_id uuid;
begin
  -- Get the first team where user is owner (personal team)
  select team_id into v_team_id
  from team_members
  where user_id = p_user_id
    and role = 'owner'
    and is_active = true
  order by created_at asc
  limit 1;

  return v_team_id;
end;
$$ language plpgsql security definer;

-- ==============================================
-- FUNCTION TO GET USER'S TEAMS
-- ==============================================

create or replace function get_user_teams(p_user_id uuid default auth.uid())
returns table (
  team_id uuid,
  teams jsonb,
  role team_role,
  is_personal boolean
) as $$
begin
  return query
  select
    tm.team_id,
    jsonb_build_object(
      'id', t.id,
      'name', t.name,
      'slug', t.slug,
      'description', t.description,
      'avatar_url', t.avatar_url,
      'tier', t.tier,
      'is_active', t.is_active
    ) as teams,
    tm.role,
    (tm.role = 'owner' and t.name like '%''s Team') as is_personal
  from team_members tm
  join teams t on t.id = tm.team_id
  where tm.user_id = p_user_id
    and tm.is_active = true
    and t.is_active = true
  order by
    (tm.role = 'owner' and t.name like '%''s Team') desc,  -- Personal teams first
    tm.created_at asc;
end;
$$ language plpgsql security definer;

-- ==============================================
-- COMMENTS
-- ==============================================

comment on function create_personal_team is 'Auto-create a personal team when a user signs up';
comment on function get_user_default_team is 'Get the user''s default (personal) team ID';
comment on function get_user_teams is 'Get all teams a user is a member of with details';
