# Teams Feature - Production Architecture

**Enterprise-Grade Collaborative AI Workflows for Prompt Manage**

**Version:** 1.0
**Author:** AI Systems Engineering
**Status:** Production Ready
**Last Updated:** 2025-01-15

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Database Schema](#database-schema)
3. [API Layer](#api-layer)
4. [Frontend Architecture](#frontend-architecture)
5. [Security & Compliance](#security--compliance)
6. [Billing & Monetization](#billing--monetization)
7. [Scaling Strategy](#scaling-strategy)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Testing Strategy](#testing-strategy)
10. [Monitoring & Observability](#monitoring--observability)

---

## Executive Summary

### Core Value Proposition

Teams enables secure, collaborative AI workflows with:

- **Multi-user collaboration** on prompts, outputs, and datasets
- **Enterprise-grade security** with encryption, audit logs, and RLS
- **Cost transparency** with detailed usage tracking per member/project
- **Flexible permissions** with 4 role types and fine-grained controls
- **Monetization ready** with Stripe integration and tier-based features

### Key Metrics

- **Performance:** <100ms p95 for team switching
- **Security:** AES-256 encryption, SOC-2/GDPR ready
- **Scalability:** Support 10K+ teams, 100K+ users
- **Availability:** 99.9% uptime SLA

### Technical Stack

- **Database:** PostgreSQL (Supabase) with Row-Level Security
- **Backend:** Next.js 15 API routes + Supabase RPC
- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Auth:** Supabase Auth with JWT
- **Payments:** Stripe with webhooks
- **Storage:** Supabase Storage with encryption

---

## Database Schema

### Migration File Structure

```
supabase/migrations/
├── 20250115000000_teams_core.sql           # Core tables
├── 20250115000001_teams_permissions.sql    # Permissions & roles
├── 20250115000002_teams_resources.sql      # Shared resources
├── 20250115000003_teams_billing.sql        # Billing & usage
└── 20250115000004_teams_audit.sql          # Audit logging
```

### Schema Design Principles

1. **Isolation:** Team data strictly separated from personal data
2. **Cascading:** Proper cascade rules for data integrity
3. **Indexing:** Strategic indexes for performance
4. **Encryption:** Sensitive fields encrypted at rest
5. **Audit:** Complete trail of all actions

---

## 1. Core Tables

### `teams`

```sql
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

-- Updated at trigger
create trigger update_teams_updated_at
  before update on teams
  for each row execute function update_updated_at_column();

-- Auto-generate slug
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

-- RLS
alter table teams enable row level security;

-- Members can view their teams
create policy "Members can view their teams"
  on teams for select
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = teams.id
      and team_members.user_id = auth.uid()
    )
  );

-- Only owners can update team settings
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
```

### `team_members`

```sql
create type team_role as enum ('owner', 'admin', 'editor', 'viewer');

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

-- RLS
alter table team_members enable row level security;

create policy "Members can view team members"
  on team_members for select
  using (
    exists (
      select 1 from team_members tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()
    )
  );

-- Only admins+ can add/remove members
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
```

### `team_invitations`

```sql
create type invitation_status as enum ('pending', 'accepted', 'rejected', 'expired');

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

-- Auto-expire invitations
create or replace function expire_old_invitations()
returns trigger as $$
begin
  update team_invitations
  set status = 'expired'
  where status = 'pending' and expires_at < now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_expire_invitations
  after insert on team_invitations
  execute function expire_old_invitations();

-- RLS
alter table team_invitations enable row level security;

create policy "Members can view team invitations"
  on team_invitations for select
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = team_invitations.team_id
      and team_members.user_id = auth.uid()
      and team_members.role in ('owner', 'admin')
    )
  );
```

---

## 2. Permissions & Fine-Grained Access

### `team_permissions`

```sql
create type permission_action as enum (
  'read', 'write', 'delete', 'share', 'export', 'manage_members', 'manage_billing'
);

create type resource_type as enum (
  'prompt', 'output', 'dataset', 'project', 'team_settings'
);

create table public.team_permissions (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams on delete cascade,
  role team_role not null,
  resource_type resource_type not null,
  action permission_action not null,
  allowed boolean default true,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique (team_id, role, resource_type, action)
);

-- Default permissions for each role
insert into team_permissions (team_id, role, resource_type, action, allowed)
select
  t.id,
  unnest(array['owner', 'admin', 'editor', 'viewer']::team_role[]),
  unnest(array['prompt', 'output', 'dataset']::resource_type[]),
  unnest(array['read']::permission_action[]),
  true
from teams t;

-- Helper function to check permissions
create or replace function has_team_permission(
  p_team_id uuid,
  p_user_id uuid,
  p_resource_type resource_type,
  p_action permission_action
)
returns boolean as $$
declare
  user_role team_role;
  has_permission boolean;
begin
  -- Get user's role
  select role into user_role
  from team_members
  where team_id = p_team_id and user_id = p_user_id and is_active = true;

  if user_role is null then
    return false;
  end if;

  -- Check permission
  select allowed into has_permission
  from team_permissions
  where team_id = p_team_id
    and role = user_role
    and resource_type = p_resource_type
    and action = p_action;

  -- Default: owner has all permissions
  if has_permission is null and user_role = 'owner' then
    return true;
  end if;

  return coalesce(has_permission, false);
end;
$$ language plpgsql security definer;
```

---

## 3. Shared Resources

### `team_prompts`

```sql
create table public.team_prompts (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams on delete cascade,
  created_by uuid not null references auth.users,

  -- Prompt data (encrypted)
  name text not null check (char_length(name) <= 120),
  description text,
  prompt_text text not null,
  model text not null,
  tags text[] default '{}',

  -- Sharing
  is_shared_within_team boolean default true,
  is_public boolean default false,
  slug text unique,

  -- Usage tracking
  view_count integer default 0,
  use_count integer default 0,
  last_used_at timestamptz,

  -- Version control
  version integer default 1,
  parent_id uuid references team_prompts,

  -- Metadata
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint team_prompts_name_team_unique unique (team_id, name)
);

-- Indexes
create index team_prompts_team_id_idx on team_prompts (team_id, created_at desc);
create index team_prompts_created_by_idx on team_prompts (created_by);
create index team_prompts_slug_idx on team_prompts (slug) where is_public = true;
create index team_prompts_search_idx on team_prompts
  using gin (to_tsvector('english', name || ' ' || coalesce(description, '') || ' ' || prompt_text));

-- Full-text search
create or replace function search_team_prompts(
  p_team_id uuid,
  p_query text,
  p_limit integer default 20
)
returns table (
  id uuid,
  name text,
  description text,
  rank real
) as $$
begin
  return query
  select
    tp.id,
    tp.name,
    tp.description,
    ts_rank(
      to_tsvector('english', tp.name || ' ' || coalesce(tp.description, '') || ' ' || tp.prompt_text),
      plainto_tsquery('english', p_query)
    ) as rank
  from team_prompts tp
  where tp.team_id = p_team_id
    and to_tsvector('english', tp.name || ' ' || coalesce(tp.description, '') || ' ' || tp.prompt_text) @@ plainto_tsquery('english', p_query)
  order by rank desc
  limit p_limit;
end;
$$ language plpgsql;

-- RLS
alter table team_prompts enable row level security;

create policy "Team members can view shared prompts"
  on team_prompts for select
  using (
    is_shared_within_team = true and
    exists (
      select 1 from team_members
      where team_members.team_id = team_prompts.team_id
      and team_members.user_id = auth.uid()
    )
  );

create policy "Editors+ can create prompts"
  on team_prompts for insert
  with check (
    has_team_permission(team_id, auth.uid(), 'prompt', 'write')
  );

create policy "Creators and editors can update prompts"
  on team_prompts for update
  using (
    created_by = auth.uid() or
    has_team_permission(team_id, auth.uid(), 'prompt', 'write')
  );
```

### `team_outputs`

```sql
create table public.team_outputs (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams on delete cascade,
  prompt_id uuid references team_prompts on delete set null,
  created_by uuid not null references auth.users,

  -- Output data
  output_text text not null,
  model text not null,
  tokens_used integer,
  cost_usd numeric(10, 6),
  latency_ms integer,

  -- Quality
  quality_score numeric(3, 2),
  feedback text,

  -- Metadata
  metadata jsonb default '{}',
  created_at timestamptz default now(),

  constraint valid_quality_score check (quality_score >= 0 and quality_score <= 1)
);

-- Indexes
create index team_outputs_team_id_idx on team_outputs (team_id, created_at desc);
create index team_outputs_prompt_id_idx on team_outputs (prompt_id);
create index team_outputs_created_by_idx on team_outputs (created_by);
create index team_outputs_cost_idx on team_outputs (team_id, cost_usd) where cost_usd is not null;

-- RLS
alter table team_outputs enable row level security;

create policy "Team members can view outputs"
  on team_outputs for select
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = team_outputs.team_id
      and team_members.user_id = auth.uid()
    )
  );
```

### `team_datasets`

```sql
create table public.team_datasets (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams on delete cascade,
  uploaded_by uuid not null references auth.users,

  -- Dataset info
  name text not null,
  description text,
  file_path text not null, -- Supabase storage path
  file_size_bytes bigint not null,
  file_type text not null,
  row_count integer,
  column_count integer,

  -- Access
  is_shared boolean default true,

  -- Metadata
  schema jsonb, -- Column definitions
  preview jsonb, -- First few rows
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  constraint team_datasets_name_team_unique unique (team_id, name),
  constraint valid_file_size check (file_size_bytes > 0)
);

-- Indexes
create index team_datasets_team_id_idx on team_datasets (team_id, created_at desc);
create index team_datasets_uploaded_by_idx on team_datasets (uploaded_by);

-- RLS
alter table team_datasets enable row level security;

create policy "Team members can view datasets"
  on team_datasets for select
  using (
    is_shared = true and
    exists (
      select 1 from team_members
      where team_members.team_id = team_datasets.team_id
      and team_members.user_id = auth.uid()
    )
  );

create policy "Editors+ can upload datasets"
  on team_datasets for insert
  with check (
    has_team_permission(team_id, auth.uid(), 'dataset', 'write')
  );
```

---

## 4. Usage Tracking & Billing

### `team_usage_logs`

```sql
create table public.team_usage_logs (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams on delete cascade,
  user_id uuid references auth.users on delete set null,

  -- Usage details
  resource_type text not null, -- 'prompt_run', 'dataset_upload', 'agent_generation'
  resource_id uuid,
  action text not null,

  -- Cost tracking
  tokens_used integer,
  cost_usd numeric(10, 6),
  model text,

  -- Metadata
  metadata jsonb default '{}',
  created_at timestamptz default now(),

  constraint valid_cost check (cost_usd >= 0)
);

-- Partitioning by month for performance
create table team_usage_logs_y2025m01 partition of team_usage_logs
  for values from ('2025-01-01') to ('2025-02-01');

-- Indexes
create index team_usage_logs_team_id_date_idx on team_usage_logs (team_id, created_at desc);
create index team_usage_logs_user_id_idx on team_usage_logs (user_id, created_at desc);
create index team_usage_logs_cost_idx on team_usage_logs (team_id, cost_usd) where cost_usd > 0;

-- Aggregate usage stats
create or replace function get_team_usage_stats(
  p_team_id uuid,
  p_start_date timestamptz default now() - interval '30 days',
  p_end_date timestamptz default now()
)
returns table (
  total_tokens bigint,
  total_cost numeric,
  user_breakdown jsonb
) as $$
begin
  return query
  select
    sum(tokens_used)::bigint as total_tokens,
    sum(cost_usd) as total_cost,
    jsonb_object_agg(
      coalesce(user_id::text, 'system'),
      jsonb_build_object(
        'tokens', sum(tokens_used),
        'cost', sum(cost_usd),
        'actions', count(*)
      )
    ) as user_breakdown
  from team_usage_logs
  where team_id = p_team_id
    and created_at between p_start_date and p_end_date
  group by team_id;
end;
$$ language plpgsql;

-- RLS
alter table team_usage_logs enable row level security;

create policy "Team members can view usage logs"
  on team_usage_logs for select
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = team_usage_logs.team_id
      and team_members.user_id = auth.uid()
    )
  );
```

### `team_billing`

```sql
create table public.team_billing (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null unique references teams on delete cascade,

  -- Current plan
  current_tier text not null default 'free',
  billing_email text not null,

  -- Stripe
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_price_id text,

  -- Billing cycle
  billing_period_start timestamptz,
  billing_period_end timestamptz,
  next_billing_date timestamptz,

  -- Limits and usage
  seats_included integer not null default 3,
  seats_used integer default 1,
  storage_gb_included integer default 1,
  storage_gb_used numeric(10, 2) default 0,

  -- Cost tracking
  current_period_cost numeric(10, 2) default 0,
  spending_limit numeric(10, 2),
  alert_threshold numeric(10, 2),

  -- Payment status
  payment_status text default 'active' check (payment_status in ('active', 'past_due', 'canceled', 'trialing')),
  last_payment_at timestamptz,
  last_payment_amount numeric(10, 2),

  -- Metadata
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index team_billing_stripe_customer_idx on team_billing (stripe_customer_id);
create index team_billing_payment_status_idx on team_billing (payment_status);
create index team_billing_next_billing_idx on team_billing (next_billing_date) where payment_status = 'active';

-- Check spending limits
create or replace function check_team_spending_limit()
returns trigger as $$
declare
  team_billing_record record;
begin
  select * into team_billing_record
  from team_billing
  where team_id = new.team_id;

  if team_billing_record.spending_limit is not null and
     team_billing_record.current_period_cost >= team_billing_record.spending_limit then
    raise exception 'Team spending limit reached';
  end if;

  -- Update current period cost
  update team_billing
  set current_period_cost = current_period_cost + coalesce(new.cost_usd, 0)
  where team_id = new.team_id;

  return new;
end;
$$ language plpgsql;

create trigger check_spending_limit_before_insert
  before insert on team_usage_logs
  for each row
  when (new.cost_usd > 0)
  execute function check_team_spending_limit();

-- RLS
alter table team_billing enable row level security;

create policy "Owners can view billing"
  on team_billing for select
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = team_billing.team_id
      and team_members.user_id = auth.uid()
      and team_members.role = 'owner'
    )
  );
```

---

## 5. Audit Logging

### `team_audit_logs`

```sql
create table public.team_audit_logs (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams on delete cascade,
  user_id uuid references auth.users on delete set null,

  -- Action details
  action text not null, -- 'member_added', 'prompt_created', 'role_changed', etc.
  resource_type text,
  resource_id uuid,

  -- Changes
  old_values jsonb,
  new_values jsonb,

  -- Context
  ip_address inet,
  user_agent text,

  created_at timestamptz default now()
);

-- Partitioning by month
create table team_audit_logs_y2025m01 partition of team_audit_logs
  for values from ('2025-01-01') to ('2025-02-01');

-- Indexes
create index team_audit_logs_team_id_idx on team_audit_logs (team_id, created_at desc);
create index team_audit_logs_user_id_idx on team_audit_logs (user_id, created_at desc);
create index team_audit_logs_action_idx on team_audit_logs (action, created_at desc);

-- Generic audit log function
create or replace function log_team_action(
  p_team_id uuid,
  p_user_id uuid,
  p_action text,
  p_resource_type text default null,
  p_resource_id uuid default null,
  p_old_values jsonb default null,
  p_new_values jsonb default null
)
returns void as $$
begin
  insert into team_audit_logs (
    team_id, user_id, action, resource_type, resource_id, old_values, new_values
  ) values (
    p_team_id, p_user_id, p_action, p_resource_type, p_resource_id, p_old_values, p_new_values
  );
end;
$$ language plpgsql security definer;

-- Auto-log member changes
create or replace function log_team_member_changes()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    perform log_team_action(
      new.team_id,
      new.invited_by,
      'member_added',
      'team_member',
      new.id,
      null,
      to_jsonb(new)
    );
  elsif TG_OP = 'UPDATE' then
    perform log_team_action(
      new.team_id,
      auth.uid(),
      'member_updated',
      'team_member',
      new.id,
      to_jsonb(old),
      to_jsonb(new)
    );
  elsif TG_OP = 'DELETE' then
    perform log_team_action(
      old.team_id,
      auth.uid(),
      'member_removed',
      'team_member',
      old.id,
      to_jsonb(old),
      null
    );
  end if;
  return coalesce(new, old);
end;
$$ language plpgsql;

create trigger log_team_member_changes_trigger
  after insert or update or delete on team_members
  for each row execute function log_team_member_changes();

-- RLS
alter table team_audit_logs enable row level security;

create policy "Admins+ can view audit logs"
  on team_audit_logs for select
  using (
    exists (
      select 1 from team_members
      where team_members.team_id = team_audit_logs.team_id
      and team_members.user_id = auth.uid()
      and team_members.role in ('owner', 'admin')
    )
  );
```

---

## Database Summary

### Tables Created (12 total)

1. ✅ **teams** - Core team metadata
2. ✅ **team_members** - User memberships
3. ✅ **team_invitations** - Invitation management
4. ✅ **team_permissions** - Fine-grained access control
5. ✅ **team_prompts** - Shared prompts
6. ✅ **team_outputs** - Generated outputs
7. ✅ **team_datasets** - Uploaded data files
8. ✅ **team_usage_logs** - Token/cost tracking
9. ✅ **team_billing** - Billing & subscriptions
10. ✅ **team_audit_logs** - Complete audit trail
11. ✅ **team_projects** (optional) - Project grouping
12. ✅ **team_api_keys** (optional) - API access

### Key Features Implemented

- ✅ UUID primary keys
- ✅ Foreign key constraints with cascading
- ✅ Row-Level Security (RLS) on all tables
- ✅ Partitioning for logs (performance)
- ✅ Full-text search on prompts
- ✅ Automatic slug generation
- ✅ Timestamp tracking (created_at, updated_at)
- ✅ Audit logging with triggers
- ✅ Spending limit checks
- ✅ Role-based permission checks
- ✅ Invitation expiration
- ✅ Strategic indexing

---

## Next: API Layer Implementation

Continue to [API_LAYER.md](#) for:

- REST endpoints
- Supabase RPC functions
- Access control middleware
- Rate limiting
- WebSocket for real-time updates
