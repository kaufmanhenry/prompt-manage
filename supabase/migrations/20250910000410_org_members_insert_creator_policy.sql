-- Allow org creator to be added as OWNER by trigger despite RLS on organization_members
drop policy if exists org_members_insert_creator on public.organization_members;
create policy org_members_insert_creator on public.organization_members
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.organizations o where o.id = org_id and o.created_by = auth.uid()
    )
  );


