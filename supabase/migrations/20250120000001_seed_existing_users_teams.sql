-- Seed Teams for Existing Users
-- Version: 1.0.0
-- Date: 2025-01-20
-- This migration creates personal teams for all existing users and migrates their prompts

-- ==============================================
-- CREATE PERSONAL TEAMS FOR EXISTING USERS
-- ==============================================

do $$
declare
  v_user record;
  v_team_id uuid;
  v_display_name text;
begin
  -- Loop through all users who don't have a team yet
  for v_user in
    select u.id, u.email, u.raw_user_meta_data, up.display_name
    from auth.users u
    left join user_profiles up on up.id = u.id
    left join team_members tm on tm.user_id = u.id and tm.is_active = true
    where tm.id is null  -- User has no team membership
    and u.deleted_at is null
  loop
    -- Determine display name
    v_display_name := coalesce(
      v_user.display_name,
      v_user.raw_user_meta_data->>'display_name',
      split_part(v_user.email, '@', 1),
      'User'
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
      v_user.id,
      'owner',
      true
    );

    -- Migrate all user's prompts to their new personal team
    update public.prompts
    set team_id = v_team_id
    where user_id = v_user.id
      and team_id is null;

    raise notice 'Created team % for user %', v_team_id, v_user.email;
  end loop;
end $$;

-- ==============================================
-- VERIFY MIGRATION
-- ==============================================

-- Count users without teams (should be 0)
do $$
declare
  v_orphaned_users integer;
  v_orphaned_prompts integer;
begin
  select count(*) into v_orphaned_users
  from auth.users u
  left join team_members tm on tm.user_id = u.id and tm.is_active = true
  where tm.id is null
    and u.deleted_at is null;

  select count(*) into v_orphaned_prompts
  from prompts
  where team_id is null;

  if v_orphaned_users > 0 then
    raise warning 'Found % users without teams', v_orphaned_users;
  else
    raise notice 'All users have been assigned to teams';
  end if;

  if v_orphaned_prompts > 0 then
    raise warning 'Found % prompts without teams', v_orphaned_prompts;
  else
    raise notice 'All prompts have been assigned to teams';
  end if;
end $$;

-- ==============================================
-- MAKE TEAM_ID REQUIRED (after migration)
-- ==============================================

-- Now that all prompts have team_id, we can make it NOT NULL
-- Uncomment this after verifying the migration was successful
-- alter table public.prompts alter column team_id set not null;
