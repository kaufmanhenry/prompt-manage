-- Add RPC function for incrementing AI tool views
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

-- Grant execute permission to authenticated and anon users
grant execute on function increment_tool_views(uuid) to authenticated, anon;
