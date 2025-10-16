-- Add Stripe subscription fields to user_profiles table
-- Migration: 20250116000000_add_stripe_to_user_profiles.sql

-- Add Stripe customer ID and subscription fields
alter table public.user_profiles
add column if not exists stripe_customer_id text unique,
add column if not exists subscription_tier text default 'free' check (subscription_tier in ('free', 'team', 'enterprise')),
add column if not exists subscription_status text,
add column if not exists subscription_period_end timestamptz;

-- Create index for faster lookups
create index if not exists user_profiles_stripe_customer_idx 
  on public.user_profiles (stripe_customer_id) 
  where stripe_customer_id is not null;

-- Create index for subscription queries
create index if not exists user_profiles_subscription_tier_idx 
  on public.user_profiles (subscription_tier);

-- Comment on columns
comment on column public.user_profiles.stripe_customer_id is 'Stripe customer ID for billing';
comment on column public.user_profiles.subscription_tier is 'Current subscription tier: free, team, or enterprise';
comment on column public.user_profiles.subscription_status is 'Stripe subscription status: active, past_due, canceled, etc.';
comment on column public.user_profiles.subscription_period_end is 'End date of current subscription period';

