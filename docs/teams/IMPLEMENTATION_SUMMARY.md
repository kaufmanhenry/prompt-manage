# Teams Implementation Summary

## What We Built & Next Steps

---

## ✅ Completed (This Session)

### 1. Revenue-Driving Upgrade Flow

**Goal**: Convert Team ($20) customers to Pro ($99) when they hit seat limits

**What's Built:**

- `SeatLimitModal.tsx` - Beautiful upgrade modal with plan comparison
- `InviteMemberButton.tsx` - Invitation component with automatic upgrade detection
- `/api/teams/[teamId]/invitations` - REST API with structured error handling
- Enhanced billing API with 14-day trial support
- Trial abuse prevention (one per team)

**How It Works:**

1. User tries to invite 6th member on Team plan (5-seat limit)
2. API returns `SEAT_LIMIT_REACHED` error code
3. SeatLimitModal appears showing Team vs Pro comparison
4. User clicks "Start 14-Day Free Trial"
5. Redirects to Stripe checkout
6. After upgrade, pending invitation automatically sent

**Revenue Impact:**

- Target: 30% of Team plans upgrade to Pro within 90 days
- MRR increase: $79 per upgrade
- Non-coercive, value-first approach

### 2. Authentication Consistency

**Goal**: Ensure users are authenticated before using team features

**What's Built:**

- Updated `AddToCollectionDialog` to require sign-in
- Matches "Copy to My Prompts" behavior
- Persists user intent in localStorage

### 3. Strategy & Documentation

**Goal**: Complete roadmap for building out team features

**What's Built:**

- 60-page UX strategy document (`TEAMS_UX_STRATEGY.md`)
- Detailed wireframes for 8 essential screens
- Microcopy bank with email templates
- Success metrics and KPIs
- A/B test ideas
- Rollout plan

### 4. GitHub Configuration

- Custom PR template with Prompt Manage Team attribution
- Commit convention documentation
- Consistent branding across all commits/PRs

---

## 🏗️ What Exists (Already Built)

You have **60% of team infrastructure** already in place:

### Database Schema ✅

- `teams` table with tier, max_members, Stripe integration
- `team_members` with 4 roles (owner, admin, editor, viewer)
- `team_invitations` with token-based 7-day expiry
- `prompts` with team_id for sharing
- `prompt_collections` for organization
- Full RLS policies for security

### Billing Integration ✅

- Stripe checkout and webhooks
- Subscription status tracking
- Usage limits enforcement
- Customer portal access

### Core Features ✅

- Personal workspaces (auto-created on signup)
- Email-based invitations
- Team switching UI
- Collections system
- Prompt forking and version control
- Public sharing with immutability

### API Layer ✅

- `/api/billing/create-checkout` - Stripe checkout (enhanced with trials)
- `/api/teams/invite/send-email` - Send invitation emails
- `/api/collections/*` - Collection management
- `/api/prompts/*` - Prompt CRUD with team filtering
- `/api/teams/[teamId]/invitations` - NEW: Team invitations API

---

## 📋 Next Steps (Priority Order)

### Phase 1: Complete Core UI (Week 1-2)

#### 1. Team Settings Page

**Route**: `/app/settings/team/page.tsx` (exists but empty)

**What to Build:**

- Display team name, avatar, description (editable by owners/admins)
- Show current plan (Team/Pro) with upgrade CTA
- Display usage metrics:
  - Members: "5/5" with progress bar
  - Prompt runs: "89/100" with progress bar (turns red at 80%)
  - Storage: "0.8/1 GB"
- Team settings:
  - Default prompt visibility (Private/Team/Public)
  - Require approval for public sharing (checkbox)
  - Allow prompt forking (checkbox)

**Files to Reference:**

- Wireframe in `TEAMS_UX_STRATEGY.md` (Screen 1)
- Existing team data: Query `teams` table
- Usage data: Use existing `getUserUsage()` function

**API Calls Needed:**

- `GET /api/teams/{id}` - Fetch team details
- `PATCH /api/teams/{id}` - Update team settings
- `GET /api/teams/{id}/usage` - Get usage stats (create this)

**Time Estimate**: 2-3 days

#### 2. Member Management Page

**Route**: `/app/settings/team/members/page.tsx`

**What to Build:**

- Table showing all team members:
  - Avatar, name, email, role, joined date, last active
  - Actions menu: Change role, Remove member
- "Invite Member" button (use `InviteMemberButton` component!)
- Pending invitations section:
  - Show email, role, sent date, expires date
  - Actions: Resend, Cancel

**Files to Reference:**

- Wireframe in `TEAMS_UX_STRATEGY.md` (Screen 2)
- Component: `InviteMemberButton.tsx` (already built!)
- Data: `team_members` and `team_invitations` tables

**API Calls:**

- `GET /api/teams/{id}/members` - List members (create this)
- `PATCH /api/teams/{id}/members/{userId}` - Change role
- `DELETE /api/teams/{id}/members/{userId}` - Remove member
- `GET /api/teams/{id}/invitations` - Already exists!
- `POST /api/teams/{id}/invitations/{id}/resend` - Resend invite

**Time Estimate**: 3-4 days

#### 3. Usage Dashboard

**Route**: `/app/dashboard/team/page.tsx`

**What to Build:**

- 4 stat cards:
  - Prompts created (this month)
  - Prompt runs (this month)
  - Active members
  - Storage used
- Top prompts table (by usage)
- Recent activity feed:
  - "Jane created prompt X"
  - "Bob forked prompt Y"
  - etc.
- Quick actions: Create Prompt, Create Collection, Invite Member

**Files to Reference:**

- Wireframe in `TEAMS_UX_STRATEGY.md` (Screen 3)
- Query prompts by `team_id`
- Track runs in `prompt_runs` table (may need to create)

**Time Estimate**: 3-4 days

---

### Phase 2: Onboarding & Activation (Week 3-4)

#### 4. Team Creation Wizard

**Goal**: Guide new users through creating their first team

**Flow:**

1. Team name and description
2. Invite members (optional, use `InviteMemberButton`)
3. Import prompts (optional)
4. Success screen with next steps

**Time Estimate**: 2-3 days

#### 5. Onboarding Checklist

**Component**: Floating checklist or modal

**Tasks:**

- ✓ Create account (auto-complete)
- Create first prompt
- Create collection
- Create team workspace
- Invite teammate
- Run first prompt

**Time Estimate**: 1-2 days

#### 6. Email Sequences

**Day 0**: Welcome email
**Day 2**: Prompt to create team (if not done)
**Day 3**: Collaboration tips
**Day 7**: Milestone celebration

**Time Estimate**: 2 days (copywriting + email setup)

---

### Phase 3: Pro Features (Month 2)

#### 7. Analytics Dashboard (Pro Only)

**Route**: `/app/dashboard/team/analytics/page.tsx`

**What to Build:**

- Usage breakdown by member
- Cost tracking per prompt
- Top prompts by performance
- Export reports

**Time Estimate**: 1 week

#### 8. Audit Logs (Pro Only)

**Route**: `/app/settings/team/audit/page.tsx`

**What to Build:**

- Filterable log of all team actions
- Export to CSV
- Retention: 90 days for Pro, 7 days for Team

**Database:**

- Create `team_audit_logs` table
- Add triggers to log all actions

**Time Estimate**: 4-5 days

#### 9. SSO Configuration (Pro Only)

**Route**: `/app/settings/team/security/page.tsx`

**What to Build:**

- SSO setup form (SAML/OIDC)
- Test connection button
- Enable/disable toggle

**Time Estimate**: 1 week (complex)

---

## 🎯 Quick Wins (Do First)

If you want to ship something fast, focus on:

1. **Team Settings Page** (2-3 days)
   - Most visible to users
   - Shows value of what they're paying for
   - Includes upgrade CTAs

2. **Member Management** (3-4 days)
   - Critical for teams to function
   - Already have `InviteMemberButton` built!
   - High user demand

3. **Usage Dashboard** (3-4 days)
   - Shows ROI
   - Drives upgrades when limits approached
   - Great for marketing screenshots

**Total**: ~10 days to ship core team experience

---

## 📊 Success Metrics to Track

### Week 1 (After Shipping Core UI):

- % of teams that view settings page
- % of teams that invite ≥1 member
- Average invites per team

### Week 2-4:

- Seat limit modal shown count
- Trial CTA click-through rate
- Trial start rate

### Month 1-3:

- Team plan → Pro upgrade rate (target: 30%)
- Average MRR per team
- Team retention vs individual retention

### Key Questions:

1. Do teams with 3+ members churn less than solo users?
2. At what member count do teams typically upgrade?
3. Which features drive Pro upgrades most?

---

## 🛠️ Integration Guide

### How to Use InviteMemberButton

```tsx
import { InviteMemberButton } from '@/components/InviteMemberButton'

// In your component:
;<InviteMemberButton
  teamId={currentTeam.id}
  teamName={currentTeam.name}
  currentTier={currentTeam.tier} // 'team' | 'pro' | 'enterprise'
  onInviteSent={() => {
    // Callback after successful invite
    refetchMembers()
  }}
/>
```

**What it does:**

1. Opens invite dialog
2. Validates email and role
3. Sends invitation via API
4. If seat limit hit: Shows `SeatLimitModal` automatically
5. After upgrade: Sends pending invitation

### How to Trigger Seat Limit Modal Manually

```tsx
import { SeatLimitModal } from '@/components/SeatLimitModal'

const [showModal, setShowModal] = useState(false)

<SeatLimitModal
  open={showModal}
  onClose={() => setShowModal(false)}
  currentPlan="team" // or 'pro'
  currentSeats={5}
  maxSeats={5}
  pendingEmail="new@company.com"
  teamId={teamId}
/>
```

### How to Add Upgrade CTAs

Throughout your app, add contextual upgrade prompts:

```tsx
// When usage is high
{
  usagePercent > 80 && (
    <Alert>
      <AlertTitle>Running low on prompt runs</AlertTitle>
      <AlertDescription>
        You've used {runsUsed}/{runsMax} this month.
        <Link href="/pricing">Upgrade to Pro</Link> for 10x more runs.
      </AlertDescription>
    </Alert>
  )
}
```

---

## 🔗 Important Files Reference

### Components:

- `components/SeatLimitModal.tsx` - Upgrade modal
- `components/InviteMemberButton.tsx` - Invitation flow
- `components/AddToCollectionDialog.tsx` - Collection management
- `components/TeamSwitcher.tsx` - Switch between teams

### API Routes:

- `app/api/teams/[teamId]/invitations/route.ts` - NEW!
- `app/api/billing/create-checkout/route.ts` - Enhanced with trials
- `app/api/teams/invite/send-email/route.ts` - Send emails
- `app/api/collections/*` - Collections CRUD

### Libraries:

- `lib/api/teams.ts` - Team API functions
- `lib/types/teams.ts` - TypeScript types
- `lib/pricing.ts` - Pricing config (source of truth!)
- `lib/subscription.ts` - Subscription logic

### Database:

- `supabase/migrations/20250115000000_teams_core.sql` - Core tables
- `supabase/migrations/20250122000000_add_team_billing_fields.sql` - Billing
- `supabase/migrations/20250128093000_prompt_collections.sql` - Collections

### Documentation:

- `docs/teams/TEAMS_UX_STRATEGY.md` - Full UX strategy (this is GOLD!)
- `docs/teams/IMPLEMENTATION_SUMMARY.md` - This file
- `docs/teams/README.md` - Overview
- `TEAMS_ARCHITECTURE.md` - Technical architecture

---

## 💡 Pro Tips

### Testing Locally:

```bash
# Test seat limit flow:
# 1. Create team with max_members = 1
UPDATE teams SET max_members = 1 WHERE id = 'your-team-id';

# 2. Try inviting member
# Should trigger SeatLimitModal immediately

# 3. Reset after testing
UPDATE teams SET max_members = 5 WHERE id = 'your-team-id';
```

### Stripe Test Mode:

- Use Stripe test mode for development
- Test card: `4242 4242 4242 4242`
- Any future expiry date
- Any CVC

### Debugging:

```typescript
// Check if user has used trial
const { data: team } = await supabase
  .from('teams')
  .select('stripe_subscription_id')
  .eq('id', teamId)
  .single()

console.log('Has subscription:', !!team.stripe_subscription_id)
```

---

## 🎨 Design System

All components use your existing design system:

- `components/ui/*` - Shadcn UI components
- Tailwind CSS for styling
- Consistent with existing app UI

**Colors:**

- Primary: Your brand gradient (purple/blue)
- Success: Green for completed actions
- Warning: Orange/yellow for limits approaching
- Destructive: Red for errors/removals

**Typography:**

- Headings: Existing font stack
- Body: System fonts
- Mono: For code/emails

---

## 📞 Questions?

If you need help implementing any of this:

1. **Check the strategy doc**: `docs/teams/TEAMS_UX_STRATEGY.md` has detailed wireframes and specs
2. **Review existing code**: 60% is already built, copy patterns from there
3. **Test the flow**: Try the seat limit modal locally to see how it works
4. **Reference this file**: Step-by-step implementation guide

---

## 🚀 Let's Ship This!

**Recommended Approach:**

**Week 1:** Team settings + member management (10 days)
**Week 2:** Usage dashboard + upgrade CTAs (5 days)
**Week 3:** Testing and polish (5 days)
**Week 4:** Beta launch with 10-20 teams

**Then measure:**

- Trial start rate
- Trial conversion rate
- Team retention
- MRR growth

**Target:** 30% of Team plans upgrade to Pro within 90 days = $79 MRR increase per team

---

Generated by the [Prompt Manage Team](https://promptmanage.com/about)
