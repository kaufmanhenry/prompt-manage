create extension if not exists "pgcrypto";

create table public.prompts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade,
  name        text not null check (char_length(name) <= 120),
  prompt_text text not null,
  model       text not null,                     -- e.g. 'gpt‑4'
  tags        text[] default '{}',
  inserted_at timestamptz default now(),
  updated_at  timestamptz default now()
);

-- basic text search index
create index prompts_search_idx on public.prompts
  using gin (to_tsvector('english', name || ' ' || prompt_text));

alter table public.prompts enable row level security;

-- RLS: a user may CRUD only their own rows
create policy "Self‑service prompts"
  on public.prompts for all
  using   (auth.uid() = user_id)
  with check (auth.uid() = user_id); 