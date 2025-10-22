-- Update get_user_teams function to include subscription fields

create or replace function get_user_teams(p_user_id uuid default auth.uid())
returns table (
  team_id uuid,
  teams jsonb,
  role team_role,
  is_personal boolean
) as $$
begin
  return query
  select
    tm.team_id,
    jsonb_build_object(
      'id', t.id,
      'name', t.name,
      'slug', t.slug,
      'description', t.description,
      'avatar_url', t.avatar_url,
      'tier', t.tier,
      'stripe_customer_id', t.stripe_customer_id,
      'stripe_subscription_id', t.stripe_subscription_id,
      'subscription_status', t.subscription_status,
      'subscription_period_end', t.subscription_period_end,
      'is_active', t.is_active
    ) as teams,
    tm.role,
    (tm.role = 'owner' and t.name like '%''s Team') as is_personal
  from team_members tm
  join teams t on t.id = tm.team_id
  where tm.user_id = p_user_id
    and tm.is_active = true
    and t.is_active = true
  order by
    (tm.role = 'owner' and t.name like '%''s Team') desc,  -- Personal teams first
    tm.created_at asc;
end;
$$ language plpgsql security definer;

comment on function get_user_teams is 'Get all teams a user is a member of with details including subscription info';
