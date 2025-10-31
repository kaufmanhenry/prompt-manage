-- Fix username trigger to not reference email column (which doesn't exist)
-- Migration: 20250129000000_fix_username_trigger.sql

-- Update the trigger function to not use email
create or replace function public.ensure_username_for_profile()
returns trigger as $$
declare
  name_source text;
begin
  if new.username is null or new.username = '' then
    -- Try full_name first, then display_name
    name_source := coalesce(new.full_name, new.display_name);
    if name_source is not null and name_source <> '' then
      new.username := lower(regexp_replace(name_source, '[^a-z0-9]+', '-', 'g'));
    else
      -- Final fallback: generate UUID-based username
      new.username := 'user-' || substr(gen_random_uuid()::text, 1, 8);
    end if;
    -- Ensure uniqueness by checking existing usernames
    while exists (select 1 from public.user_profiles where username = new.username and id <> new.id) loop
      new.username := new.username || '-' || substr(gen_random_uuid()::text, 1, 4);
    end loop;
  end if;
  return new;
end;
$$ language plpgsql;

