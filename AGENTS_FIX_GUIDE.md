# Fix AI Agents Feature - Quick Guide

## 🐛 **The Problem**

The AI Agents feature is failing with 500 errors because:

1. The database tables may not exist yet (migration not run)
2. Row Level Security (RLS) policies were too restrictive (service_role only)
3. API was missing the `department` field in agent creation

## ✅ **The Solution**

Run two SQL migrations in your Supabase Dashboard.

---

## 📝 **Step-by-Step Fix**

### 1. Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
2. Or: Supabase Dashboard → SQL Editor

### 2. Run Migration 1 (Create Tables)

**If the `agents` table doesn't exist yet**, run this first:

```sql
-- Copy and paste from: supabase/migrations/20241220000000_autonomous_agent.sql
-- Or run the full migration file
```

To check if tables exist, run:

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'agents'
);
```

If it returns `false`, you need to run the full migration from `20241220000000_autonomous_agent.sql`.

### 3. Run Migration 2 (Fix RLS Policies) **← REQUIRED**

**Copy and paste this into SQL Editor:**

```sql
-- Fix RLS policies for agents to allow admin users
-- Migration: 20250116000001_fix_agents_rls.sql

-- Drop old restrictive policies
drop policy if exists "Service role can manage agents" on public.agents;
drop policy if exists "Service role can manage agent generations" on public.agent_generations;
drop policy if exists "Service role can manage agent metrics" on public.agent_metrics;

-- Create function to check if user is admin
create or replace function public.is_admin_user()
returns boolean as $$
declare
  user_email text;
begin
  -- Get current user's email
  select email into user_email from auth.users where id = auth.uid();

  -- Check if email is in admin list
  return user_email in (
    'mikemoloney.business@gmail.com',
    'hkaufman19@gmail.com',
    'mike@filtergrade.com'
  );
end;
$$ language plpgsql security definer;

-- New RLS policies for agents (allow authenticated admin users)
create policy "Admins can view all agents"
  on public.agents for select
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can insert agents"
  on public.agents for insert
  with check (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can update agents"
  on public.agents for update
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can delete agents"
  on public.agents for delete
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

-- New RLS policies for agent_generations
create policy "Admins can view all agent generations"
  on public.agent_generations for select
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can insert agent generations"
  on public.agent_generations for insert
  with check (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can update agent generations"
  on public.agent_generations for update
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can delete agent generations"
  on public.agent_generations for delete
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

-- New RLS policies for agent_metrics
create policy "Admins can view all agent metrics"
  on public.agent_metrics for select
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can insert agent metrics"
  on public.agent_metrics for insert
  with check (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can update agent metrics"
  on public.agent_metrics for update
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

create policy "Admins can delete agent metrics"
  on public.agent_metrics for delete
  using (
    auth.role() = 'authenticated' and public.is_admin_user()
  );

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all on public.agents to authenticated;
grant all on public.agent_generations to authenticated;
grant all on public.agent_metrics to authenticated;

-- Comment
comment on function public.is_admin_user is 'Returns true if the current user is an admin based on their email address';
```

Click **"Run"** or press `Cmd/Ctrl + Enter`.

### 4. Verify the Fix

Run this to check if policies are correct:

```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('agents', 'agent_generations', 'agent_metrics');
```

You should see policies like:

- `Admins can view all agents`
- `Admins can insert agents`
- etc.

---

## 🧪 **Test It**

1. **Refresh your app**: `http://localhost:3000/dashboard/agents`
2. **Click "Create Agent"**
3. **Fill in the form:**
   - Agent Name: `Test Agent`
   - Description: `Testing agent creation`
   - Strategy: `Niche Industry`
   - Department: `General`
   - Output Type: `AI Prompt`
4. **Click "Create Agent"**
5. ✅ **Should succeed** (no "Failed to create agent" error)

---

## 🔍 **Troubleshooting**

### Still getting 500 error?

**Check if you're logged in with an admin email:**

Run this in SQL Editor:

```sql
SELECT email FROM auth.users WHERE id = auth.uid();
```

Your email must be one of:

- `mikemoloney.business@gmail.com`
- `hkaufman19@gmail.com`
- `mike@filtergrade.com`

If you're logged in with a different email, log out and log in with an admin email.

### "relation public.agents does not exist" error?

Run the full migration from `supabase/migrations/20241220000000_autonomous_agent.sql`.

### "permission denied for table agents" error?

Re-run the RLS fix migration (step 3 above).

---

## 🎯 **What Changed**

### Before (Broken)

- RLS policies only allowed `service_role` access
- Regular authenticated users (even admins) couldn't access tables
- API calls failed with database permission errors

### After (Fixed)

- Created `is_admin_user()` function to check email
- Updated RLS policies to allow authenticated admins
- Admins can now create, read, update, and delete agents

---

## 📋 **Migration Summary**

| Migration | File                                  | Purpose                                  |
| --------- | ------------------------------------- | ---------------------------------------- |
| 1         | `20241220000000_autonomous_agent.sql` | Creates tables, indexes, and functions   |
| 2         | `20250116000001_fix_agents_rls.sql`   | Fixes RLS policies to allow admin access |

## 🔧 **Code Fixes Applied**

I've also fixed the API route (`/app/api/agents/route.ts`) to:

- ✅ Include the `department` field when creating agents
- ✅ Save all advanced configuration options (tone, audience, etc.)
- ✅ Provide better error messages with details

**These code changes are already in your local files** - you just need to run the database migrations!

---

## 🚀 **Final Steps**

1. **Run the SQL migrations** (steps above)
2. **Refresh your browser** (no server restart needed)
3. **Try creating an agent again**
4. ✅ **Should work perfectly!**

---

**After running these migrations, the AI Agents feature should work perfectly!** 🎉

Need help? Check the browser console for errors or contact support.
