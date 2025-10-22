-- Add subscription fields to teams table
-- This migrates billing from user_profiles to teams

-- Add subscription status and period end to teams
alter table public.teams
  add column if not exists subscription_status text,
  add column if not exists subscription_period_end timestamptz;

-- Add index for active subscriptions
create index if not exists teams_subscription_status_idx
  on teams (subscription_status)
  where subscription_status is not null;

-- Add comments
comment on column teams.subscription_status is 'Stripe subscription status (active, past_due, canceled, etc.)';
comment on column teams.subscription_period_end is 'Subscription period end date from Stripe';
