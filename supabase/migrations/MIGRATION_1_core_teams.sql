-- Teams Feature: Core Tables Migration
-- Version: 1.0.0
-- Date: 2025-01-15
-- COPY THIS ENTIRE FILE AND PASTE INTO SUPABASE SQL EDITOR

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
