-- AI Agent System: Autonomous Prompt Generation
-- Migration: 20250130000000_agent_system.sql

-- 1) Agents table
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'PromptManage Agent',
  owner_id uuid not null references auth.users(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  mode text not null default 'review' check (mode in ('autonomous', 'review')),
  is_active boolean default true,
  temperature numeric(3, 2) default 0.7,
  quality_threshold integer default 85 check (quality_threshold >= 0 and quality_threshold <= 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on column public.agents.mode is 'Agent mode: autonomous (auto-publish) or review (manual approval)';
comment on column public.agents.temperature is 'LLM temperature for creativity (0.0 to 2.0)';
comment on column public.agents.quality_threshold is 'Minimum quality score (0-100) to auto-publish';

create index if not exists agents_owner_idx on public.agents(owner_id);
create index if not exists agents_team_idx on public.agents(team_id);
create index if not exists agents_active_idx on public.agents(is_active) where is_active = true;

-- 2) Agent prompts tracking table
create table if not exists public.agent_prompts (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  prompt_id uuid references public.prompts(id) on delete cascade,
  topic text not null,
  keyword text,
  raw_input text,
  raw_output text,
  quality_score integer check (quality_score >= 0 and quality_score <= 100),
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'published', 'rejected', 'failed')),
  error_message text,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on column public.agent_prompts.topic is 'Main topic/category for this prompt';
comment on column public.agent_prompts.keyword is 'Primary keyword/tag';
comment on column public.agent_prompts.raw_input is 'LLM input prompt used to generate this';
comment on column public.agent_prompts.raw_output is 'Raw LLM output before processing';
comment on column public.agent_prompts.quality_score is 'Quality score from review (0-100)';
comment on column public.agent_prompts.status is 'Current status in pipeline';
comment on column public.agent_prompts.metadata is 'Additional metadata (tags, description, etc.)';

create index if not exists agent_prompts_agent_idx on public.agent_prompts(agent_id);
create index if not exists agent_prompts_prompt_idx on public.agent_prompts(prompt_id);
create index if not exists agent_prompts_status_idx on public.agent_prompts(status);
create index if not exists agent_prompts_topic_idx on public.agent_prompts(topic);
create index if not exists agent_prompts_keyword_idx on public.agent_prompts(keyword);

-- 3) Agent keywords/categories table (for seed data and tracking)
create table if not exists public.agent_keywords (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents(id) on delete cascade,
  keyword text not null,
  category text,
  priority integer default 50,
  is_active boolean default true,
  generated_count integer default 0,
  last_generated_at timestamptz,
  created_at timestamptz default now(),
  unique(agent_id, keyword)
);

create index if not exists agent_keywords_agent_idx on public.agent_keywords(agent_id);
create index if not exists agent_keywords_active_idx on public.agent_keywords(is_active) where is_active = true;

-- 4) Add agent_id to prompts table
alter table public.prompts
  add column if not exists agent_id uuid references public.agents(id) on delete set null;

create index if not exists prompts_agent_idx on public.prompts(agent_id) where agent_id is not null;

comment on column public.prompts.agent_id is 'Reference to agent that generated this prompt';

-- 5) Enable RLS
alter table public.agents enable row level security;
alter table public.agent_prompts enable row level security;
alter table public.agent_keywords enable row level security;

-- 6) RLS Policies for agents
drop policy if exists agents_select_owner on public.agents;
create policy agents_select_owner on public.agents
  for select using (auth.uid() = owner_id or public.is_admin_user());

drop policy if exists agents_insert_owner on public.agents;
create policy agents_insert_owner on public.agents
  for insert with check (auth.uid() = owner_id);

drop policy if exists agents_update_owner on public.agents;
create policy agents_update_owner on public.agents
  for update using (auth.uid() = owner_id or public.is_admin_user());

-- 7) RLS Policies for agent_prompts
drop policy if exists agent_prompts_select_owner on public.agent_prompts;
create policy agent_prompts_select_owner on public.agent_prompts
  for select using (
    exists (select 1 from public.agents where id = agent_id and owner_id = auth.uid())
    or public.is_admin_user()
  );

drop policy if exists agent_prompts_insert_owner on public.agent_prompts;
create policy agent_prompts_insert_owner on public.agent_prompts
  for insert with check (
    exists (select 1 from public.agents where id = agent_id and owner_id = auth.uid())
  );

drop policy if exists agent_prompts_update_owner on public.agent_prompts;
create policy agent_prompts_update_owner on public.agent_prompts
  for update using (
    exists (select 1 from public.agents where id = agent_id and owner_id = auth.uid())
    or public.is_admin_user()
  );

-- 8) RLS Policies for agent_keywords
drop policy if exists agent_keywords_select_owner on public.agent_keywords;
create policy agent_keywords_select_owner on public.agent_keywords
  for select using (
    exists (select 1 from public.agents where id = agent_id and owner_id = auth.uid())
    or public.is_admin_user()
  );

drop policy if exists agent_keywords_modify_owner on public.agent_keywords;
create policy agent_keywords_modify_owner on public.agent_keywords
  for all using (
    exists (select 1 from public.agents where id = agent_id and owner_id = auth.uid())
    or public.is_admin_user()
  );

-- 9) Function to update updated_at
create or replace function update_agent_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_agents_updated_at
  before update on public.agents
  for each row execute function update_agent_updated_at();

create trigger update_agent_prompts_updated_at
  before update on public.agent_prompts
  for each row execute function update_agent_updated_at();

-- 10) Initial seed keywords for default agent (inserted after agent creation)
-- This will be populated via the admin dashboard

