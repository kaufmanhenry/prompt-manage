# Supabase Migrations to Run for Teams Feature

## Quick Reference

Run these 3 migrations in your Supabase SQL Editor in this exact order:

1. ✅ Core Teams Tables (if not already run)
2. ✅ Teams Integration (if not already run)
3. 🆕 Demo Requests (NEW - must run)

---

## Migration 1: Core Teams Tables

**File**: `supabase/migrations/20250115000000_teams_core.sql`

**Status**: Check if already run with:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('teams', 'team_members', 'team_invitations');
```

If returns 0-2 rows, run this migration:

<details>
<summary>Click to expand migration SQL (334 lines)</summary>

```sql
-- Teams Feature: Core Tables Migration
-- Version: 1.0.0
-- Date: 2025-01-15

-- Enable required extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Create team role enum
create type team_role as enum ('owner', 'admin', 'editor', 'viewer');

-- Create invitation status enum
create type invitation_status as enum ('pending', 'accepted', 'rejected', 'expired');

-- ==============================================
-- TEAMS TABLE
-- ==============================================

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) >= 3 and char_length(name) <= 100),
  slug text unique not null,
  description text,
  avatar_url text,

  -- Billing
  tier text not null default 'free' check (tier in ('free', 'pro', 'enterprise')),
  max_members integer not null default 3,
  max_storage_gb integer not null default 1,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,

  -- Status
  is_active boolean default true,
  is_verified boolean default false,

  -- Metadata
  settings jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Constraints
  constraint valid_slug check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$')
);

-- Indexes
create index teams_slug_idx on teams (slug) where is_active = true;
create index teams_tier_idx on teams (tier);
create index teams_stripe_customer_idx on teams (stripe_customer_id) where stripe_customer_id is not null;
create index teams_created_at_idx on teams (created_at desc);

-- Auto-generate slug function
create or replace function generate_team_slug()
returns trigger as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := generate_slug(new.name) || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trigger_generate_team_slug
  before insert on teams
  for each row execute function generate_team_slug();

-- Updated at trigger
create trigger update_teams_updated_at
  before update on teams
  for each row execute function update_updated_at_column();

-- ==============================================
-- TEAM MEMBERS TABLE
-- ==============================================

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role team_role not null default 'viewer',

  -- Invitation
  invited_by uuid references auth.users,
  invited_at timestamptz,
  joined_at timestamptz default now(),

  -- Status
  is_active boolean default true,
  last_active_at timestamptz default now(),

  -- Metadata
  settings jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Constraints
  unique (team_id, user_id)
);

-- Indexes
create index team_members_team_id_idx on team_members (team_id) where is_active = true;
create index team_members_user_id_idx on team_members (user_id) where is_active = true;
create index team_members_role_idx on team_members (team_id, role);
create index team_members_last_active_idx on team_members (team_id, last_active_at desc);
create index team_members_composite_idx on team_members (team_id, user_id, is_active);

-- Updated at trigger
create trigger update_team_members_updated_at
  before update on team_members
  for each row execute function update_updated_at_column();

-- ==============================================
-- TEAM INVITATIONS TABLE
-- ==============================================

create table public.team_invitations (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams on delete cascade,
  email text not null,
  role team_role not null default 'viewer',

  -- Invitation details
  invited_by uuid not null references auth.users,
  token text unique not null default encode(gen_random_bytes(32), 'base64'),
  expires_at timestamptz not null default (now() + interval '7 days'),

  -- Status
  status invitation_status default 'pending',
  accepted_by uuid references auth.users,
  accepted_at timestamptz,

  created_at timestamptz default now(),

  -- Constraints
  unique (team_id, email, status),
  check (expires_at > created_at)
);

-- Indexes
create index team_invitations_token_idx on team_invitations (token) where status = 'pending';
create index team_invitations_email_idx on team_invitations (email, status);
create index team_invitations_expires_idx on team_invitations (expires_at) where status = 'pending';
create index team_invitations_team_idx on team_invitations (team_id, status);

-- Auto-expire invitations function
create or replace function expire_old_invitations()
returns void as $$
begin
  update team_invitations
  set status = 'expired'
  where status = 'pending' and expires_at < now();
end;
$$ language plpgsql;

-- ==============================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================

-- Enable RLS
alter table teams enable row level security;
alter table team_members enable row level security;
alter table team_invitations enable row level security;

-- Teams RLS Policies
create policy "Members can view their teams"
  on teams for select
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = teams.id
      and team_members.user_id = auth.uid()
      and team_members.is_active = true
    )
  );

create policy "Owners can update team settings"
  on teams for update
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = teams.id
      and team_members.user_id = auth.uid()
      and team_members.role = 'owner'
    )
  );

create policy "Authenticated users can create teams"
  on teams for insert
  with check (auth.uid() is not null);

-- Team Members RLS Policies
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

create policy "Admins can manage members"
  on team_members for all
  using (
    exists (
      select 1 from team_members tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()
      and tm.role in ('owner', 'admin')
    )
  );

-- Team Invitations RLS Policies
create policy "Admins can view team invitations"
  on team_invitations for select
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = team_invitations.team_id
      and team_members.user_id = auth.uid()
      and team_members.role in ('owner', 'admin')
    )
  );

create policy "Admins can create invitations"
  on team_invitations for insert
  with check (
    exists (
      select 1 from team_members
      where team_members.team_id = team_invitations.team_id
      and team_members.user_id = auth.uid()
      and team_members.role in ('owner', 'admin')
    )
  );

-- ==============================================
-- HELPER FUNCTIONS
-- ==============================================

-- Get team with aggregated stats
create or replace function get_team_with_stats(p_team_id uuid)
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'id', t.id,
    'name', t.name,
    'slug', t.slug,
    'description', t.description,
    'avatar_url', t.avatar_url,
    'tier', t.tier,
    'max_members', t.max_members,
    'created_at', t.created_at,
    'member_count', (
      select count(*) from team_members
      where team_id = t.id and is_active = true
    ),
    'is_active', t.is_active
  ) into result
  from teams t
  where t.id = p_team_id;

  return result;
end;
$$ language plpgsql security definer;

-- Accept invitation function
create or replace function accept_team_invitation(p_token text)
returns json as $$
declare
  v_invitation record;
  v_member_id uuid;
  result json;
begin
  -- Get invitation
  select * into v_invitation
  from team_invitations
  where token = p_token
    and status = 'pending'
    and expires_at > now()
  for update;

  if not found then
    raise exception 'Invalid or expired invitation';
  end if;

  -- Add as team member
  insert into team_members (
    team_id,
    user_id,
    role,
    invited_by,
    invited_at
  ) values (
    v_invitation.team_id,
    auth.uid(),
    v_invitation.role,
    v_invitation.invited_by,
    v_invitation.created_at
  )
  returning id into v_member_id;

  -- Update invitation status
  update team_invitations
  set status = 'accepted',
      accepted_by = auth.uid(),
      accepted_at = now()
  where id = v_invitation.id;

  -- Return result
  select json_build_object(
    'member_id', v_member_id,
    'team_id', v_invitation.team_id,
    'role', v_invitation.role
  ) into result;

  return result;
end;
$$ language plpgsql security definer;

-- ==============================================
-- COMMENTS
-- ==============================================

comment on table teams is 'Core teams table with billing and tier information';
comment on table team_members is 'Team membership and roles';
comment on table team_invitations is 'Team invitation management with expiration';

comment on function get_team_with_stats is 'Get team details with aggregated statistics';
comment on function accept_team_invitation is 'Accept a team invitation by token';
comment on function expire_old_invitations is 'Mark expired invitations as expired status';
```

</details>

---

## Migration 2: Teams Integration

**File**: `supabase/migrations/20250120000000_integrate_teams.sql`

**Status**: Check if already run with:

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'prompts' AND column_name = 'team_id';
```

If returns 0 rows, run this migration:

<details>
<summary>Click to expand migration SQL (202 lines)</summary>

```sql
-- Teams Integration: Connect prompts to teams and create personal teams
-- Version: 1.0.0
-- Date: 2025-01-20

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
```

</details>

---

## Migration 3: Demo Requests (REQUIRED - NEW)

**File**: `supabase/migrations/20250206000000_demo_requests.sql`

**Status**: Must run this migration

**Run this SQL:**

```sql
-- Demo Requests Table
-- Tracks demo booking requests from teams wanting to upgrade

CREATE TABLE IF NOT EXISTS demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Contact info
  user_email TEXT NOT NULL,
  user_name TEXT,
  team_name TEXT,

  -- Context
  current_plan TEXT NOT NULL DEFAULT 'team', -- 'team', 'pro', 'enterprise'
  pending_invite_email TEXT, -- Email they were trying to invite
  source TEXT NOT NULL DEFAULT 'unknown', -- 'seat_limit_modal', 'dashboard_cta', 'pricing_page', etc.

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'contacted', 'demo_scheduled', 'demo_completed', 'converted', 'lost'
  contacted_at TIMESTAMPTZ,
  demo_scheduled_at TIMESTAMPTZ,
  demo_completed_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,

  -- Notes for sales team
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX idx_demo_requests_team_id ON demo_requests(team_id);
CREATE INDEX idx_demo_requests_user_id ON demo_requests(user_id);
CREATE INDEX idx_demo_requests_status ON demo_requests(status);
CREATE INDEX idx_demo_requests_created_at ON demo_requests(created_at DESC);
CREATE INDEX idx_demo_requests_source ON demo_requests(source);

-- Add updated_at trigger
CREATE TRIGGER update_demo_requests_updated_at
  BEFORE UPDATE ON demo_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own demo requests
CREATE POLICY "Users can view their own demo requests"
  ON demo_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create demo requests for their teams
CREATE POLICY "Team members can create demo requests"
  ON demo_requests
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = demo_requests.team_id
        AND team_members.user_id = auth.uid()
        AND team_members.is_active = true
    )
  );

-- Admins can view and update all demo requests (for CRM)
CREATE POLICY "Admins can manage demo requests"
  ON demo_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
        AND user_profiles.is_admin = true
    )
  );

-- Create view for sales dashboard
CREATE OR REPLACE VIEW demo_requests_dashboard AS
SELECT
  dr.id,
  dr.team_id,
  dr.user_id,
  dr.user_email,
  dr.user_name,
  dr.team_name,
  dr.current_plan,
  dr.pending_invite_email,
  dr.source,
  dr.status,
  dr.created_at,
  dr.contacted_at,
  dr.demo_scheduled_at,
  dr.notes,
  t.tier as team_current_tier,
  t.max_members as team_max_members,
  (SELECT COUNT(*) FROM team_members WHERE team_members.team_id = dr.team_id AND team_members.is_active = true) as team_member_count,
  CASE
    WHEN dr.contacted_at IS NULL THEN EXTRACT(EPOCH FROM (NOW() - dr.created_at)) / 3600 -- Hours since request
    ELSE NULL
  END as hours_waiting
FROM demo_requests dr
JOIN teams t ON t.id = dr.team_id
ORDER BY dr.created_at DESC;

COMMENT ON TABLE demo_requests IS 'Tracks demo booking requests from teams wanting to upgrade to Pro/Enterprise plans';
COMMENT ON VIEW demo_requests_dashboard IS 'Sales dashboard view with enriched data and metrics';
```

---

## Verification Queries

After running all migrations, verify everything is set up correctly:

```sql
-- 1. Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('teams', 'team_members', 'team_invitations', 'demo_requests')
ORDER BY table_name;
-- Should return 4 rows

-- 2. Check team_id column on prompts
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'prompts' AND column_name = 'team_id';
-- Should return 1 row

-- 3. Check trigger exists
SELECT trigger_name
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
-- Should return 1 row

-- 4. Check view exists
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public' AND table_name = 'demo_requests_dashboard';
-- Should return 1 row

-- 5. Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('teams', 'team_members', 'team_invitations', 'demo_requests');
-- All should show rowsecurity = true
```

---

## Success Criteria

✅ All verification queries return expected results
✅ No errors when running migrations
✅ New user signup creates personal team automatically
✅ Can create team invitations via API

---

**Next Step**: Configure environment variables and deploy application.

See `TEAMS_DEPLOYMENT_GUIDE.md` for complete deployment instructions.
