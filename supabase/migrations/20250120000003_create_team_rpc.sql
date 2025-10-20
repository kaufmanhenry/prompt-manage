-- Create Team RPC Function
-- Allows users to create teams with proper RLS bypass using security definer
-- Version: 1.0.0
-- Date: 2025-01-20

-- ==============================================
-- CREATE TEAM FUNCTION
-- ==============================================

-- Drop existing function if it exists
drop function if exists create_team_with_owner(text, text);

-- Create function to create a team and add the user as owner
create or replace function create_team_with_owner(
  p_name text,
  p_description text default null
)
returns json as $$
declare
  v_team_id uuid;
  v_user_id uuid;
  v_team_slug text;
  result json;
begin
  -- Get current user
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Generate slug
  v_team_slug := generate_slug(p_name) || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8);

  -- Create team
  insert into public.teams (
    name,
    slug,
    description,
    tier,
    is_active,
    is_verified
  ) values (
    p_name,
    v_team_slug,
    p_description,
    'free',
    true,
    false
  )
  returning id into v_team_id;

  -- Add user as owner
  insert into public.team_members (
    team_id,
    user_id,
    role,
    is_active
  ) values (
    v_team_id,
    v_user_id,
    'owner',
    true
  );

  -- Return team data
  select json_build_object(
    'id', t.id,
    'name', t.name,
    'slug', t.slug,
    'description', t.description,
    'tier', t.tier,
    'is_active', t.is_active
  ) into result
  from teams t
  where t.id = v_team_id;

  return result;
end;
$$ language plpgsql security definer;

-- ==============================================
-- COMMENTS
-- ==============================================

comment on function create_team_with_owner is 'Create a new team and add the current user as owner. Uses security definer to bypass RLS.';
