-- Fix foreign key relationship between team_members and user_profiles
-- This allows Supabase to properly join the tables

-- First, create user_profiles entries for any team_members without them
insert into public.user_profiles (id, display_name)
select distinct tm.user_id, coalesce(au.email, 'Unknown User')
from public.team_members tm
left join auth.users au on au.id = tm.user_id
where tm.user_id not in (select id from public.user_profiles)
on conflict (id) do nothing;

-- Drop the existing foreign key to auth.users
alter table public.team_members
  drop constraint if exists team_members_user_id_fkey;

-- Add foreign key to user_profiles instead
alter table public.team_members
  add constraint team_members_user_id_fkey
  foreign key (user_id)
  references public.user_profiles(id)
  on delete cascade;

-- Add comment
comment on constraint team_members_user_id_fkey on team_members is 'Links team members to user profiles';
