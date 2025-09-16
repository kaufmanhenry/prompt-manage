-- Allow org creators to read their organization even before membership bootstrap
alter table public.organizations enable row level security;

-- Additional select policy for creators (alongside member-based policy)
drop policy if exists org_select_creator on public.organizations;
create policy org_select_creator on public.organizations
  for select using (created_by = auth.uid());


