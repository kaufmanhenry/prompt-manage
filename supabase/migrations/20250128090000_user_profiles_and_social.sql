-- User profiles enhancements: username slug, verified, socials, bio, avatar, analytics
-- Follows social graph

-- 1) Extend user_profiles
alter table public.user_profiles
  add column if not exists username text unique,
  add column if not exists is_verified boolean default false,
  add column if not exists avatar_url text,
  add column if not exists website_url text,
  add column if not exists twitter_url text,
  add column if not exists linkedin_url text,
  add column if not exists instagram_url text,
  add column if not exists youtube_url text,
  add column if not exists bio_markdown text,
  add column if not exists profile_views bigint default 0,
  add column if not exists featured_prompt_ids uuid[] default '{}',
  add column if not exists featured_collection_ids uuid[] default '{}';

comment on column public.user_profiles.username is 'Public username slug used at /u/{username}';
comment on column public.user_profiles.is_verified is 'Verified badge for staff or top creators';
comment on column public.user_profiles.bio_markdown is 'Profile bio content in markdown';

create index if not exists user_profiles_username_idx on public.user_profiles (username);

-- 2) Follows table (basic social graph)
create table if not exists public.user_follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

alter table public.user_follows enable row level security;

-- Policies: a user can view all, insert own follow, delete own follow
drop policy if exists user_follows_select_all on public.user_follows;
create policy user_follows_select_all on public.user_follows
  for select using (true);

drop policy if exists user_follows_insert_self on public.user_follows;
create policy user_follows_insert_self on public.user_follows
  for insert with check (auth.uid() = follower_id);

drop policy if exists user_follows_delete_self on public.user_follows;
create policy user_follows_delete_self on public.user_follows
  for delete using (auth.uid() = follower_id);

-- 3) Helper to auto-generate username if missing (based on email prefix)
create or replace function public.ensure_username_for_profile()
returns trigger as $$
declare
  name_source text;
begin
  if new.username is null or new.username = '' then
    -- Try full_name first, then display_name, then email
    name_source := coalesce(new.full_name, new.display_name);
    if name_source is not null and name_source <> '' then
      new.username := lower(regexp_replace(name_source, '[^a-z0-9]+', '-', 'g'));
    elsif new.email is not null and new.email <> '' then
      new.username := split_part(new.email, '@', 1);
    else
      new.username := 'user-' || substr(gen_random_uuid()::text, 1, 8);
    end if;
    -- Ensure uniqueness by checking existing usernames
    while exists (select 1 from public.user_profiles where username = new.username and id <> new.id) loop
      new.username := new.username || '-' || substr(gen_random_uuid()::text, 1, 4);
    end loop;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_ensure_username on public.user_profiles;
create trigger trg_ensure_username
  before insert or update on public.user_profiles
  for each row execute function public.ensure_username_for_profile();


