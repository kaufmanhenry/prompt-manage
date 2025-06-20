create extension if not exists "pgcrypto";

-- Create a function to generate slugs
create or replace function generate_slug(input_text text)
returns text as $$
begin
  return lower(regexp_replace(
    regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
end;
$$ language plpgsql;

-- Create user_profiles table
create table public.user_profiles (
  id          uuid primary key references auth.users on delete cascade,
  display_name text,
  bio         text,
  avatar_url  text,
  website     text,
  location    text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Create a trigger to update the updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute function update_updated_at_column();

-- Enable RLS on user_profiles
alter table public.user_profiles enable row level security;

-- RLS: Users can read all profiles (for public display)
create policy "Anyone can read user profiles"
  on public.user_profiles for select
  using (true);

-- RLS: Users can update their own profile
create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- RLS: Users can insert their own profile
create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create table public.prompts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade,
  name        text not null check (char_length(name) <= 120),
  description text,                              -- Optional description
  prompt_text text not null,
  model       text not null,                     -- e.g. 'gpt‑4'
  tags        text[] default '{}',
  is_public   boolean default false,             -- Private by default
  slug        text unique,                       -- For public URLs
  view_count  integer default 0,                 -- Track public views
  inserted_at timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Create a trigger to generate slugs when prompts are made public
create or replace function generate_prompt_slug()
returns trigger as $$
begin
  if new.is_public = true and (new.slug is null or new.slug = '') then
    new.slug := generate_slug(new.name) || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trigger_generate_prompt_slug
  before insert or update on public.prompts
  for each row
  execute function generate_prompt_slug();

-- basic text search index
create index prompts_search_idx on public.prompts
  using gin (to_tsvector('english', name || ' ' || coalesce(description, '') || ' ' || prompt_text));

-- Index for public prompts
create index prompts_public_idx on public.prompts (is_public) where is_public = true;
create index prompts_slug_idx on public.prompts (slug) where slug is not null;

alter table public.prompts enable row level security;

-- RLS: Users can CRUD their own prompts
create policy "Users can manage their own prompts"
  on public.prompts for all
  using   (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- RLS: Anyone can read public prompts
create policy "Anyone can read public prompts"
  on public.prompts for select
  using (is_public = true);

-- Function to increment view count
create or replace function increment_prompt_views(prompt_id uuid)
returns void as $$
begin
  update public.prompts 
  set view_count = view_count + 1 
  where id = prompt_id and is_public = true;
end;
$$ language plpgsql; 