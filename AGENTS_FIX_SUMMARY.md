# AI Agents Fix - Quick Summary

## ✅ **What I Fixed**

### 1. Code Fixes (Already Done ✅)

- **File:** `app/api/agents/route.ts`
- **Changes:**
  - Added `department` field to agent creation
  - Now saves all advanced configuration options
  - Better error messages with details

### 2. Database Migration (You Need to Run 🔄)

- **File:** `supabase/migrations/20250116000001_fix_agents_rls.sql`
- **What it does:**
  - Fixes Row Level Security policies
  - Allows authenticated admin users to manage agents
  - Creates `is_admin_user()` function

---

## 🎯 **What You Need to Do**

### Option 1: Quick Fix (Recommended)

**Copy and paste this SQL into Supabase SQL Editor:**

```sql
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
  select email into user_email from auth.users where id = auth.uid();
  return user_email in (
    'mikemoloney.business@gmail.com',
    'hkaufman19@gmail.com',
    'mike@filtergrade.com'
  );
end;
$$ language plpgsql security definer;

-- RLS policies for agents
create policy "Admins can view all agents"
  on public.agents for select using (auth.role() = 'authenticated' and public.is_admin_user());
create policy "Admins can insert agents"
  on public.agents for insert with check (auth.role() = 'authenticated' and public.is_admin_user());
create policy "Admins can update agents"
  on public.agents for update using (auth.role() = 'authenticated' and public.is_admin_user());
create policy "Admins can delete agents"
  on public.agents for delete using (auth.role() = 'authenticated' and public.is_admin_user());

-- RLS policies for agent_generations
create policy "Admins can view all agent generations"
  on public.agent_generations for select using (auth.role() = 'authenticated' and public.is_admin_user());
create policy "Admins can insert agent generations"
  on public.agent_generations for insert with check (auth.role() = 'authenticated' and public.is_admin_user());
create policy "Admins can update agent generations"
  on public.agent_generations for update using (auth.role() = 'authenticated' and public.is_admin_user());
create policy "Admins can delete agent generations"
  on public.agent_generations for delete using (auth.role() = 'authenticated' and public.is_admin_user());

-- RLS policies for agent_metrics
create policy "Admins can view all agent metrics"
  on public.agent_metrics for select using (auth.role() = 'authenticated' and public.is_admin_user());
create policy "Admins can insert agent metrics"
  on public.agent_metrics for insert with check (auth.role() = 'authenticated' and public.is_admin_user());
create policy "Admins can update agent metrics"
  on public.agent_metrics for update using (auth.role() = 'authenticated' and public.is_admin_user());
create policy "Admins can delete agent metrics"
  on public.agent_metrics for delete using (auth.role() = 'authenticated' and public.is_admin_user());

-- Grant permissions
grant usage on schema public to authenticated;
grant all on public.agents to authenticated;
grant all on public.agent_generations to authenticated;
grant all on public.agent_metrics to authenticated;
```

**Steps:**

1. Go to Supabase Dashboard → SQL Editor
2. Paste the SQL above
3. Click "Run"
4. Done! ✅

### Option 2: Check If Tables Exist First

If you're not sure if the `agents` table exists, run this first:

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'agents'
);
```

- If it returns `true` → Run Option 1 SQL
- If it returns `false` → You need to run the full migration from `supabase/migrations/20241220000000_autonomous_agent.sql` first, then run Option 1

---

## 🧪 **Test It**

After running the migration:

1. **Refresh your browser** (or go to): `http://localhost:3000/dashboard/agents`
2. **Click "Create Agent"**
3. **Fill in:**
   - Name: `Test Agent`
   - Description: `Testing`
   - Strategy: `Niche Industry`
   - Department: `General`
4. **Click "Create Agent"**
5. ✅ **Should work!**

---

## 🔍 **Troubleshooting**

### Still getting 500 error?

**Check the browser console** - you should now see more detailed error messages like:

- `{ error: "Database error", details: "..." }`
- This will tell you exactly what went wrong

**Make sure you're logged in with an admin email:**

- `mikemoloney.business@gmail.com`
- `hkaufman19@gmail.com`
- `mike@filtergrade.com`

If you're using a different email, the system will reject you (by design).

### "relation public.agents does not exist"

You need to run the full migration first:

- Open `supabase/migrations/20241220000000_autonomous_agent.sql`
- Copy the entire file
- Paste into Supabase SQL Editor
- Run it
- Then run the RLS fix (Option 1 above)

---

## 📚 **Documentation**

For full details, see: `AGENTS_FIX_GUIDE.md`

---

**That's it! Run the SQL and you're good to go.** 🚀
