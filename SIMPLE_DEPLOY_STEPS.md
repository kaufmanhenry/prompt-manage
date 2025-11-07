# Simple Deployment Steps

## Step 1: Run Database Migrations in Supabase

Go to: **Supabase Dashboard → SQL Editor**

### Migration 1 (check if needed)
Run this query first to check:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('teams', 'team_members', 'team_invitations');
```

If it returns **less than 3 rows**, copy/paste entire file:
📄 **MIGRATION_1_core_teams.sql**

---

### Migration 2 (check if needed)
Run this query first to check:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'prompts' AND column_name = 'team_id';
```

If it returns **0 rows**, copy/paste entire file:
📄 **MIGRATION_2_teams_integration.sql**

---

### Migration 3 (REQUIRED - always run)
Copy/paste entire file:
📄 **MIGRATION_3_demo_requests.sql**

---

## Step 2: Add Environment Variables

Add these to your hosting platform (Vercel/Railway/etc):

```bash
RESEND_API_KEY=re_xxxxx
CONTACT_FROM=invites@promptmanage.com
SALES_EMAIL=sales@promptmanage.com
NEXT_PUBLIC_SITE_URL=https://promptmanage.com
```

Get `RESEND_API_KEY` from: https://resend.com/api-keys

---

## Step 3: Merge PR

```bash
gh pr merge 5 --squash
```

Or merge via GitHub UI: https://github.com/kaufmanhenry/prompt-manage/pull/5

---

## Step 4: Deploy

Push to main or trigger deployment in your hosting platform.

---

## Step 5: Test

1. Create new user account → Should auto-create personal team
2. Go to `/settings/team/members`
3. Click "Invite Member" → Enter email
4. Check email inbox → Click invitation link
5. Try inviting 6th member on Team plan → Should show upgrade modal

---

## That's it!

Teams feature will be live.
