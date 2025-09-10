-- Organizations & Org-owned Prompts Migration
-- Purpose: Introduce organizations, memberships, invitations, and extend prompts for org ownership
-- Notes:
--  - Preserves existing user-owned prompts (via prompts.user_id)
--  - Preserves existing public sharing (via prompts.is_public and slug trigger)
--  - Adds optional prompt_visibility enum without removing is_public

-- Required extensions
create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- 1) ENUMS
do $$ begin
  if not exists (select 1 from pg_type where typname = 'org_role') then
    create type org_role as enum ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'prompt_visibility') then
    create type prompt_visibility as enum ('private', 'team', 'public');
  end if;
end $$;

-- 2) TEAMS (organizations)
create table if not exists public.organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  created_by  uuid not null references auth.users(id) on delete restrict,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists organizations_slug_idx on public.organizations(slug);

create table if not exists public.organization_members (
  org_id      uuid not null references public.organizations(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        org_role not null default 'EDITOR',
  invited_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  primary key (org_id, user_id)
);

-- Helpful index for membership lookups by user
create index if not exists organization_members_user_id_idx on public.organization_members(user_id);

-- 3) INVITES
create table if not exists public.organization_invitations (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references public.organizations(id) on delete cascade,
  email        citext not null,
  role         org_role not null default 'EDITOR',
  token        text not null unique,
  status       text not null default 'pending', -- 'pending' | 'accepted' | 'revoked' | 'expired'
  invited_by   uuid not null references auth.users(id) on delete set null,
  accepted_by  uuid references auth.users(id) on delete set null,
  expires_at   timestamptz not null,
  created_at   timestamptz not null default now()
);

create index if not exists organization_invitations_org_id_idx on public.organization_invitations(org_id);
create index if not exists organization_invitations_email_idx on public.organization_invitations(email);

-- 4) PROMPT OWNERSHIP EXTENSION
-- Existing table: public.prompts (user-owned via user_id, public via is_public)
alter table public.prompts
  add column if not exists org_id uuid references public.organizations(id) on delete set null,
  add column if not exists visibility prompt_visibility not null default 'private';

-- Optional ownership consistency constraint (XOR). Disabled to avoid breaking current app flows.
-- alter table public.prompts
--   add constraint prompts_owner_xor_org check (
--     (user_id is not null and org_id is null) or (org_id is not null)
--   );

-- 5) UTILITY FUNCTIONS
create or replace function public.is_org_member(u uuid, o uuid)
returns boolean language sql stable as $$
  select exists (
    select 1
    from public.organization_members m
    where m.org_id = o and m.user_id = u
  );
$$;

create or replace function public.is_org_editor(u uuid, o uuid)
returns boolean language sql stable as $$
  select exists (
    select 1
    from public.organization_members m
    where m.org_id = o and m.user_id = u and m.role in ('OWNER','ADMIN','EDITOR')
  );
$$;

create or replace function public.is_org_admin(u uuid, o uuid)
returns boolean language sql stable as $$
  select exists (
    select 1
    from public.organization_members m
    where m.org_id = o and m.user_id = u and m.role in ('OWNER','ADMIN')
  );
$$;

-- 6) RLS POLICIES
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_invitations enable row level security;
alter table public.prompts enable row level security;

-- organizations
drop policy if exists org_select on public.organizations;
create policy org_select on public.organizations
  for select using (public.is_org_member(auth.uid(), id));

drop policy if exists org_insert on public.organizations;
create policy org_insert on public.organizations
  for insert with check (auth.uid() = created_by);

drop policy if exists org_update on public.organizations;
create policy org_update on public.organizations
  for update using (public.is_org_admin(auth.uid(), id));

drop policy if exists org_delete on public.organizations;
create policy org_delete on public.organizations
  for delete using (public.is_org_admin(auth.uid(), id));

-- organization_members
drop policy if exists org_members_select on public.organization_members;
create policy org_members_select on public.organization_members
  for select using (public.is_org_member(auth.uid(), org_id));

drop policy if exists org_members_insert on public.organization_members;
create policy org_members_insert on public.organization_members
  for insert with check (public.is_org_admin(auth.uid(), org_id));

drop policy if exists org_members_update on public.organization_members;
create policy org_members_update on public.organization_members
  for update using (public.is_org_admin(auth.uid(), org_id));

drop policy if exists org_members_delete on public.organization_members;
create policy org_members_delete on public.organization_members
  for delete using (
    public.is_org_admin(auth.uid(), org_id) or auth.uid() = user_id
  );

-- organization_invitations
drop policy if exists org_invites_select on public.organization_invitations;
create policy org_invites_select on public.organization_invitations
  for select using (public.is_org_member(auth.uid(), org_id));

drop policy if exists org_invites_insert on public.organization_invitations;
create policy org_invites_insert on public.organization_invitations
  for insert with check (public.is_org_admin(auth.uid(), org_id));

drop policy if exists org_invites_update on public.organization_invitations;
create policy org_invites_update on public.organization_invitations
  for update using (public.is_org_admin(auth.uid(), org_id));

drop policy if exists org_invites_delete on public.organization_invitations;
create policy org_invites_delete on public.organization_invitations
  for delete using (public.is_org_admin(auth.uid(), org_id));

-- prompts (mixed ownership). Replace/augment existing owner/public policies
-- Drop old policies if present to avoid duplication
drop policy if exists "Users can manage their own prompts" on public.prompts;
drop policy if exists "Anyone can read public prompts" on public.prompts;
drop policy if exists prompts_read on public.prompts;
drop policy if exists prompts_insert on public.prompts;
drop policy if exists prompts_update on public.prompts;
drop policy if exists prompts_delete on public.prompts;

-- READ: owner, org members for team/public, or fully public
create policy prompts_read on public.prompts
  for select using (
    -- user-owned
    (user_id is not null and user_id = auth.uid())
    or
    -- org-owned visible to members (team/public) and member of org
    (org_id is not null and (visibility in ('team','public') or is_public = true) and public.is_org_member(auth.uid(), org_id))
    or
    -- fully public
    (visibility = 'public' or is_public = true)
  );

-- INSERT: owner (personal) or org editor+
create policy prompts_insert on public.prompts
  for insert with check (
    (org_id is null and user_id is not null and user_id = auth.uid())
    or
    (org_id is not null and public.is_org_editor(auth.uid(), org_id))
  );

-- UPDATE: owner (personal) or org editor+
create policy prompts_update on public.prompts
  for update using (
    (org_id is null and user_id is not null and user_id = auth.uid())
    or
    (org_id is not null and public.is_org_editor(auth.uid(), org_id))
  );

-- DELETE: owner (personal) or org admin+
create policy prompts_delete on public.prompts
  for delete using (
    (org_id is null and user_id is not null and user_id = auth.uid())
    or
    (org_id is not null and public.is_org_admin(auth.uid(), org_id))
  );

-- End of migration

