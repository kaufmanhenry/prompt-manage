-- Bootstrap org creator membership and secure invitation acceptance

create extension if not exists "pgcrypto";

-- Trigger: add creator as OWNER member upon organization creation
create or replace function public.add_creator_as_owner()
returns trigger language plpgsql as $$
begin
  insert into public.organization_members (org_id, user_id, role)
  values (new.id, new.created_by, 'OWNER')
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists add_creator_as_owner_trigger on public.organizations;
create trigger add_creator_as_owner_trigger
  after insert on public.organizations
  for each row execute function public.add_creator_as_owner();

-- SECURITY DEFINER function to accept invitations by token
-- Bypasses RLS to allow non-members to accept their invite
create or replace function public.accept_org_invitation(p_token text)
returns table (id uuid, org_id uuid, email citext, role org_role, status text) 
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inv record;
  v_user uuid;
begin
  v_user := auth.uid();
  if v_user is null then
    raise exception 'Unauthorized';
  end if;

  select * into v_inv
  from public.organization_invitations
  where token = p_token;

  if not found then
    raise exception 'Invalid invitation token';
  end if;

  if v_inv.status <> 'pending' then
    raise exception 'Invitation is not pending';
  end if;

  if v_inv.expires_at < now() then
    update public.organization_invitations
      set status = 'expired'
      where id = v_inv.id;
    raise exception 'Invitation has expired';
  end if;

  insert into public.organization_members (org_id, user_id, role)
  values (v_inv.org_id, v_user, v_inv.role)
  on conflict (org_id, user_id) do nothing;

  update public.organization_invitations
    set status = 'accepted', accepted_by = v_user
    where id = v_inv.id;

  return query
    select v_inv.id, v_inv.org_id, v_inv.email, v_inv.role, 'accepted'::text;
end;
$$;

revoke all on function public.accept_org_invitation(text) from public;
grant execute on function public.accept_org_invitation(text) to authenticated;

-- Tighten invite visibility to admins only to avoid leaking emails
drop policy if exists org_invites_select on public.organization_invitations;
create policy org_invites_select on public.organization_invitations
  for select using (public.is_org_admin(auth.uid(), org_id));


