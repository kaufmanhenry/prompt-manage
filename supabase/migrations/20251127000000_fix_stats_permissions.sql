-- Fix stats tracking permissions and functions

-- Update increment_prompt_views to have proper security and permissions
create or replace function increment_prompt_views(prompt_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.prompts
  set view_count = coalesce(view_count, 0) + 1
  where id = prompt_id and is_public = true;
end;
$$;

-- Grant execute permission to authenticated and anonymous users
grant execute on function increment_prompt_views(uuid) to authenticated, anon;

-- Ensure tool view increment has consistent implementation
create or replace function increment_tool_views(tool_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update ai_tools
  set view_count = coalesce(view_count, 0) + 1
  where id = tool_id;
end;
$$;

-- Ensure grant is present (this is idempotent)
grant execute on function increment_tool_views(uuid) to authenticated, anon;
