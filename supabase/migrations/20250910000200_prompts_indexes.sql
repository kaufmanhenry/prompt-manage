-- Indexes for prompts workspace scoping and visibility
create index if not exists prompts_org_id_idx on public.prompts(org_id);
create index if not exists prompts_user_id_idx on public.prompts(user_id);
create index if not exists prompts_visibility_idx on public.prompts(visibility);


