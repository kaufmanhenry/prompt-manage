# Teams Feature Deployment Guide

## Overview

This guide covers deploying the complete Teams feature to production, including invitation system, seat limits, and demo booking.

**PR**: https://github.com/kaufmanhenry/prompt-manage/pull/5
**Status**: Ready for deployment

---

## Prerequisites

Before deploying, ensure you have:
- [x] Resend API account (for sending emails)
- [x] Access to Supabase production dashboard
- [x] Access to production environment variables
- [x] Production deployment access

---

## Database Migrations to Run in Supabase

Run these migrations **in order** in your Supabase SQL Editor:

### 1. Core Teams Tables (if not already run)

**File**: `supabase/migrations/20250115000000_teams_core.sql`

**Creates**:
- `teams` table with billing tiers and seat limits
- `team_members` table with role-based permissions
- `team_invitations` table with token-based invites
- Enums: `team_role`, `invitation_status`
- Functions: `accept_team_invitation()`, `get_team_with_stats()`
- RLS policies for security

**To run**:
```sql
-- Copy the entire contents of:
-- supabase/migrations/20250115000000_teams_core.sql
-- And execute in Supabase SQL Editor
```

**Verification**:
```sql
-- Check tables were created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('teams', 'team_members', 'team_invitations');

-- Should return 3 rows
```

---

### 2. Teams Integration (if not already run)

**File**: `supabase/migrations/20250120000000_integrate_teams.sql`

**Creates**:
- Adds `team_id` column to `prompts` table
- Auto-creates personal team on user signup (trigger)
- Updates RLS policies for team-based prompt access
- Functions: `get_user_default_team()`, `get_user_teams()`

**To run**:
```sql
-- Copy the entire contents of:
-- supabase/migrations/20250120000000_integrate_teams.sql
-- And execute in Supabase SQL Editor
```

**Verification**:
```sql
-- Check team_id column was added to prompts
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'prompts' AND column_name = 'team_id';

-- Should return 1 row

-- Check trigger exists
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Should return 1 row
```

---

### 3. Demo Requests Table (NEW - Required)

**File**: `supabase/migrations/20250206000000_demo_requests.sql`

**Creates**:
- `demo_requests` table for tracking demo bookings
- `demo_requests_dashboard` view for sales team
- Indexes for performance
- RLS policies for access control

**To run**:
```sql
-- Copy the entire contents of:
-- supabase/migrations/20250206000000_demo_requests.sql
-- And execute in Supabase SQL Editor
```

**Verification**:
```sql
-- Check demo_requests table was created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'demo_requests';

-- Should return 1 row

-- Check view was created
SELECT table_name FROM information_schema.views
WHERE table_schema = 'public' AND table_name = 'demo_requests_dashboard';

-- Should return 1 row
```

---

## Environment Variables Configuration

Add these to your production environment (Vercel, Railway, etc.):

### Required Variables

```bash
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Email Addresses
CONTACT_FROM=invites@promptmanage.com
SALES_EMAIL=sales@promptmanage.com

# Site URL (for invitation links)
NEXT_PUBLIC_SITE_URL=https://promptmanage.com
```

### Verification Steps

After setting environment variables:

1. **Test Resend API Key**:
   ```bash
   curl https://api.resend.com/emails \
     -H "Authorization: Bearer YOUR_RESEND_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "from": "invites@promptmanage.com",
       "to": ["youremail@example.com"],
       "subject": "Test Email",
       "html": "<p>Testing Resend integration</p>"
     }'
   ```

2. **Verify Domain in Resend**:
   - Go to https://resend.com/domains
   - Add `promptmanage.com` domain
   - Configure DNS records (SPF, DKIM, DMARC)
   - Wait for verification

---

## Deployment Steps

### Step 1: Merge PR to Main

```bash
# PR #5 is ready for merge
# Merge via GitHub UI or CLI:
gh pr merge 5 --squash
```

### Step 2: Run Database Migrations

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your production project
3. Navigate to **SQL Editor**
4. Run migrations in order (see sections above)
5. Verify each migration completed successfully

### Step 3: Configure Environment Variables

**For Vercel**:
1. Go to project settings → Environment Variables
2. Add all required variables (see above)
3. Apply to Production environment
4. Redeploy if needed

**For Railway/Other**:
- Add variables via platform-specific interface

### Step 4: Deploy Application

```bash
# If using Vercel
vercel --prod

# Or trigger deployment via git push
git push origin main
```

### Step 5: Post-Deployment Verification

Run these tests immediately after deployment:

#### Test 1: Team Creation
1. Create a new user account
2. Verify personal team was auto-created
3. Check Supabase `teams` and `team_members` tables

#### Test 2: Invitation Flow
1. Go to `/settings/team/members`
2. Click "Invite Member"
3. Enter email and select role
4. Submit invitation
5. **Check**: Email received at invited address
6. **Check**: Invitation appears in pending list
7. Click invitation link in email
8. **Check**: Member added to team

#### Test 3: Seat Limit Enforcement
1. Create Team plan subscription ($20/mo)
2. Try to invite 6th member (limit is 5)
3. **Check**: `SeatLimitModal` appears
4. **Check**: Shows Team vs Pro comparison

#### Test 4: Demo Booking
1. When seat limit modal appears, click "Book a Demo"
2. **Check**: Redirected to `/demo` page
3. **Check**: Confirmation message shown
4. **Check**: Sales email received at `SALES_EMAIL` address
5. **Check**: Demo request in `demo_requests` table

---

## Database Queries for Monitoring

### View All Teams
```sql
SELECT
  id,
  name,
  tier,
  max_members,
  (SELECT COUNT(*) FROM team_members WHERE team_id = teams.id AND is_active = true) as member_count,
  created_at
FROM teams
ORDER BY created_at DESC
LIMIT 20;
```

### View Pending Invitations
```sql
SELECT
  ti.id,
  ti.email,
  ti.role,
  ti.status,
  ti.created_at,
  ti.expires_at,
  t.name as team_name,
  up.display_name as invited_by_name
FROM team_invitations ti
JOIN teams t ON t.id = ti.team_id
LEFT JOIN user_profiles up ON up.id = ti.invited_by
WHERE ti.status = 'pending'
ORDER BY ti.created_at DESC;
```

### View Demo Requests
```sql
SELECT * FROM demo_requests_dashboard
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Check Seat Limits
```sql
SELECT
  t.id,
  t.name,
  t.tier,
  t.max_members,
  COUNT(tm.id) as current_members,
  (t.max_members - COUNT(tm.id)) as seats_available
FROM teams t
LEFT JOIN team_members tm ON tm.team_id = t.id AND tm.is_active = true
GROUP BY t.id, t.name, t.tier, t.max_members
HAVING COUNT(tm.id) >= t.max_members
ORDER BY t.created_at DESC;
```

---

## Troubleshooting

### Issue: Emails Not Sending

**Symptoms**: Invitations created but emails not received

**Solutions**:
1. Check `RESEND_API_KEY` is set correctly
2. Verify domain in Resend dashboard
3. Check Resend API logs: https://resend.com/logs
4. Ensure `CONTACT_FROM` email matches verified domain
5. Check spam folder

**Debug Query**:
```sql
-- Check recent invitations
SELECT * FROM team_invitations
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

---

### Issue: Seat Limit Not Enforced

**Symptoms**: Users can invite beyond seat limits

**Solutions**:
1. Verify `max_members` set correctly on teams table
2. Check API route: `/api/teams/[teamId]/invitations/route.ts` line 68
3. Review RLS policies on `team_invitations` table

**Debug Query**:
```sql
-- Check team seat configuration
SELECT id, name, tier, max_members FROM teams;
```

---

### Issue: Demo Requests Not Captured

**Symptoms**: Demo booking completes but no record in database

**Solutions**:
1. Check migration `20250206000000_demo_requests.sql` ran successfully
2. Verify RLS policies allow inserts
3. Check `SALES_EMAIL` environment variable set

**Debug Query**:
```sql
-- Check demo_requests table exists
SELECT * FROM demo_requests ORDER BY created_at DESC LIMIT 5;
```

---

### Issue: Personal Team Not Auto-Created

**Symptoms**: New users don't have default team

**Solutions**:
1. Verify trigger `on_auth_user_created` exists
2. Check function `create_personal_team()` exists
3. Review function logs in Supabase

**Debug Query**:
```sql
-- Check trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Manually create team for existing user (replace USER_ID)
SELECT create_personal_team()
FROM auth.users
WHERE id = 'USER_ID_HERE';
```

---

## Rollback Plan

If issues occur after deployment:

### Quick Rollback (Code Only)
```bash
# Revert deployment to previous version
vercel rollback
```

### Database Rollback (if needed)

**IMPORTANT**: Only rollback database if absolutely necessary. Teams data will be lost.

```sql
-- Rollback in reverse order

-- 1. Drop demo_requests
DROP VIEW IF EXISTS demo_requests_dashboard;
DROP TABLE IF EXISTS demo_requests;

-- 2. Remove teams integration (CAUTION: loses prompt assignments)
ALTER TABLE prompts DROP COLUMN IF EXISTS team_id;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_personal_team();
DROP FUNCTION IF EXISTS get_user_default_team();
DROP FUNCTION IF EXISTS get_user_teams();

-- 3. Drop core teams tables (CAUTION: loses all teams data)
DROP TABLE IF EXISTS team_invitations;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS teams;
DROP TYPE IF EXISTS invitation_status;
DROP TYPE IF EXISTS team_role;
```

---

## Success Criteria

Teams feature is successfully deployed when:

- [ ] All 3 database migrations run without errors
- [ ] Environment variables configured in production
- [ ] Application deploys successfully
- [ ] New user signup auto-creates personal team
- [ ] Team invitation email received and accepted
- [ ] Seat limit modal appears when limit reached
- [ ] Demo booking captures request and sends sales email
- [ ] No console errors in production
- [ ] Email delivery rate > 95%

---

## Support

**Issues or Questions?**
- Check GitHub PR: https://github.com/kaufmanhenry/prompt-manage/pull/5
- Review `/docs/teams/FINAL_SUMMARY.md` for feature details
- Contact: sales@promptmanage.com

---

## Next Steps After Deployment

1. **Monitor Demo Requests**
   - Check `demo_requests_dashboard` view daily
   - Respond to demo requests within 24 hours
   - Track conversion metrics

2. **Email Deliverability**
   - Monitor Resend dashboard for bounce rates
   - Set up DMARC reporting
   - Watch for spam complaints

3. **Performance Monitoring**
   - Check database query performance
   - Monitor invitation API response times
   - Review error logs

4. **Future Enhancements**
   - Add email templates for different invitation types
   - Implement invitation reminder emails
   - Create admin dashboard for demo request management
   - Add analytics for team growth metrics

---

Generated by the [Prompt Manage Team](https://promptmanage.com/about)
