-- Prompt Collections: private/public with SEO-friendly slugs and analytics

-- 1) Collections table
create table if not exists public.prompt_collections (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  cover_image_url text,
  visibility text not null default 'private' check (visibility in ('private','public')),
  tags text[] default '{}',
  slug text unique,
  views bigint default 0,
  likes bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on column public.prompt_collections.slug is 'SEO slug at /collections/{slug}';

alter table public.prompt_collections enable row level security;

-- RLS: public can view public collections; owners can manage their own
drop policy if exists collections_select_public on public.prompt_collections;
create policy collections_select_public on public.prompt_collections
  for select using (visibility = 'public' or auth.uid() = creator_id);

drop policy if exists collections_insert_owner on public.prompt_collections;
create policy collections_insert_owner on public.prompt_collections
  for insert with check (auth.uid() = creator_id);

drop policy if exists collections_update_owner on public.prompt_collections;
create policy collections_update_owner on public.prompt_collections
  for update using (auth.uid() = creator_id);

drop policy if exists collections_delete_owner on public.prompt_collections;
create policy collections_delete_owner on public.prompt_collections
  for delete using (auth.uid() = creator_id);

create index if not exists collections_creator_idx on public.prompt_collections (creator_id);
create index if not exists collections_visibility_idx on public.prompt_collections (visibility);
create index if not exists collections_slug_idx on public.prompt_collections (slug);

-- 2) Mapping table: prompts inside collections with ordering
create table if not exists public.collection_prompts (
  collection_id uuid references public.prompt_collections(id) on delete cascade,
  prompt_id uuid references public.prompts(id) on delete cascade,
  sort_order integer default 0,
  primary key (collection_id, prompt_id)
);

alter table public.collection_prompts enable row level security;

drop policy if exists collection_prompts_select_public on public.collection_prompts;
create policy collection_prompts_select_public on public.collection_prompts
  for select using (
    exists (
      select 1 from public.prompt_collections c
      where c.id = collection_id and (c.visibility = 'public' or auth.uid() = c.creator_id)
    )
  );

drop policy if exists collection_prompts_modify_owner on public.collection_prompts;
create policy collection_prompts_modify_owner on public.collection_prompts
  for all using (
    exists (
      select 1 from public.prompt_collections c where c.id = collection_id and auth.uid() = c.creator_id
    )
  ) with check (
    exists (
      select 1 from public.prompt_collections c where c.id = collection_id and auth.uid() = c.creator_id
    )
  );

-- 3) Helper: generate slug from title
create or replace function public.generate_collection_slug()
returns trigger as $$
declare
  base text;
  candidate text;
  i int := 1;
begin
  if new.slug is null or new.slug = '' then
    base := lower(regexp_replace(new.title, '[^a-z0-9]+', '-', 'g'));
    candidate := base;
    while exists (select 1 from public.prompt_collections where slug = candidate and id <> new.id) loop
      i := i + 1;
      candidate := base || '-' || i::text;
    end loop;
    new.slug := candidate;
  end if;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_generate_collection_slug on public.prompt_collections;
create trigger trg_generate_collection_slug
  before insert or update on public.prompt_collections
  for each row execute function public.generate_collection_slug();


