-- Free Tool Usage Tracking
-- Migration: 20250116000002_free_tool_usage.sql

-- Create free_tool_usage table to track API usage for free tools
create table if not exists public.free_tool_usage (
  id uuid primary key default gen_random_uuid(),
  tool_name text not null, -- 'claude-creator', 'cursor-creator', 'optimizer'
  user_id uuid references auth.users(id) on delete set null, -- null if not logged in
  ip_address text, -- for rate limiting non-logged-in users
  fingerprint text, -- browser fingerprint for additional tracking
  prompt_generated text, -- the generated prompt (for logging)
  saved_to_library boolean default false, -- whether user saved it
  created_at timestamptz default now()
);

-- Create indexes
create index if not exists free_tool_usage_user_id_idx on public.free_tool_usage(user_id);
create index if not exists free_tool_usage_ip_address_idx on public.free_tool_usage(ip_address);
create index if not exists free_tool_usage_fingerprint_idx on public.free_tool_usage(fingerprint);
create index if not exists free_tool_usage_created_at_idx on public.free_tool_usage(created_at);

-- Enable RLS
alter table public.free_tool_usage enable row level security;

-- RLS policies
create policy "Users can view their own usage"
  on public.free_tool_usage for select
  using (auth.uid() = user_id or auth.role() = 'authenticated');

create policy "Anyone can insert usage"
  on public.free_tool_usage for insert
  with check (true);

-- Function to check rate limit for free tools
create or replace function public.check_free_tool_rate_limit(
  p_tool_name text,
  p_ip_address text,
  p_fingerprint text
)
returns jsonb as $$
declare
  usage_count integer;
  is_allowed boolean;
  remaining_uses integer;
begin
  -- Count usage in last 24 hours
  select count(*) into usage_count
  from public.free_tool_usage
  where tool_name = p_tool_name
    and (ip_address = p_ip_address or fingerprint = p_fingerprint)
    and created_at > now() - interval '24 hours'
    and user_id is null; -- only count non-logged-in usage
  
  -- Check if under limit (3 uses per 24 hours)
  is_allowed := usage_count < 3;
  remaining_uses := greatest(0, 3 - usage_count);
  
  return jsonb_build_object(
    'allowed', is_allowed,
    'count', usage_count,
    'limit', 3,
    'remaining', remaining_uses,
    'reset_at', (now() + interval '24 hours')::text
  );
end;
$$ language plpgsql security definer;

-- Grant permissions
grant usage on schema public to anon;
grant all on public.free_tool_usage to anon, authenticated;
grant execute on function public.check_free_tool_rate_limit to anon, authenticated;

-- Comment
comment on table public.free_tool_usage is 'Tracks usage of free AI tools (Claude Creator, Cursor Creator, Optimizer) for rate limiting and analytics';
comment on function public.check_free_tool_rate_limit is 'Checks if a non-logged-in user has exceeded the rate limit (3 uses per 24 hours)';

