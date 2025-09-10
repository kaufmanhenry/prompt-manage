-- Minimal audit logs
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor uuid references auth.users(id) on delete set null,
  action text not null,
  object_type text not null,
  object_id uuid,
  org_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_org_id_idx on public.audit_logs(org_id);
create index if not exists audit_logs_action_idx on public.audit_logs(action);

alter table public.audit_logs enable row level security;

-- Allow users to insert their own audit records; reads limited to org members
drop policy if exists audit_insert on public.audit_logs;
create policy audit_insert on public.audit_logs for insert with check (auth.uid() = actor);

drop policy if exists audit_select on public.audit_logs;
create policy audit_select on public.audit_logs for select using (
  org_id is null or public.is_org_member(auth.uid(), org_id)
);


