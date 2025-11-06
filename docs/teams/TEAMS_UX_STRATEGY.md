# Teams UX Strategy - Revenue-Focused Implementation
## Prompt Manage - Turning Collaboration Into Revenue

---

## Executive Summary

**The Opportunity:** We have 60% of team infrastructure already built (database, billing, invitations, RLS security). The missing 40% is **UI/UX that drives upgrades** from $20 (5 seats) to $99 (25 seats) and makes team collaboration habitual.

**Core Strategy:** Build frictionless invite flows with value-first upgrade triggers. When admins hit seat #6, show them exactly what they gain by upgrading (not just "more seats"). Make prompt sharing within teams delightful enough that members invite colleagues organically.

**Revenue Mechanics:**
- **$20/mo Team plan**: 5 seats, basic collaboration, 100 prompt runs/month
- **$99/mo Pro plan**: 25 seats, advanced analytics, 1,000 runs/month, audit logs, priority support
- **Upgrade trigger**: When adding 6th member, show modal with 14-day Pro trial offer

**Success Metrics:**
- 30% of Team ($20) customers upgrade to Pro ($99) within 90 days
- Average team invite rate: 3.2 members within first 7 days
- Team retention: 85%+ vs 65% for individual users

---

## What We Have (Existing Infrastructure)

### Database Schema ✅
- `teams` table with tier, max_members, Stripe integration
- `team_members` with roles (owner, admin, editor, viewer)
- `team_invitations` with token-based 7-day expiry
- `prompts` with team_id for team sharing
- `prompt_collections` for organizing prompts
- Full RLS policies for security

### Billing Integration ✅
- Stripe checkout and webhooks fully implemented
- Subscription status tracking
- Usage limits enforcement (prompts, runs, exports)
- Customer portal access

### Core Features ✅
- Personal workspaces (auto-created on signup)
- Email-based invitations with tokens
- Team switching UI component
- Collections system
- Prompt forking and version control
- Public sharing with immutability

### API Layer ✅
- `/api/billing/create-checkout` - Stripe checkout
- `/api/teams/invite/send-email` - Send invitations
- `/api/collections/*` - Collection management
- `/api/prompts/*` - Prompt CRUD with team filtering
- RPC functions for team operations

---

## What We Need to Build (40% Remaining)

### Phase 1: Upgrade Mechanics (Week 1-2) 🎯

**Priority 1A: Seat Limit Modal**

When admin tries to invite member #6:

```typescript
// Component: /components/SeatLimitModal.tsx

Modal appears with:
- Header: "Unlock More Seats"
- Current plan: "Team - 5 seats ($20/mo)"
- You've invited: "5/5 members"
- Comparison table:

  | Feature | Team ($20) | Pro ($99) |
  |---------|------------|-----------|
  | Team members | 5 | 25 |
  | Prompt runs/month | 100 | 1,000 |
  | Analytics dashboard | ❌ | ✅ |
  | Audit logs | ❌ | ✅ |
  | Priority support | ❌ | ✅ |

- CTA: "Start 14-Day Pro Trial" (primary)
- Secondary: "Contact Sales" (for custom pricing)
- Dismiss: "Maybe Later"

Behavior:
- Invitation is saved as "pending upgrade"
- After upgrade/trial start: invitation sent automatically
- LocalStorage: track "seat_limit_shown" count (max 3 times)
```

**Acceptance Criteria:**
- Modal appears only when adding 6th+ member
- Trial CTA redirects to Stripe checkout with `trial_period_days=14`
- After upgrade, pending invitation is sent via email
- User can dismiss max 3 times, then forced decision
- Track conversion rate: target 25%+ click-through on trial CTA

**Microcopy:**

```
# Modal Title
"Your team is growing! 🚀"

# Body
"You've reached your 5-member limit on the Team plan. Upgrade to Pro to add 20 more teammates and unlock advanced collaboration features."

# Benefits List
✅ 25 team members (up from 5)
✅ 10x more prompt runs (1,000/month)
✅ Usage analytics dashboard
✅ Team audit logs
✅ Priority support

# Primary CTA
"Start 14-Day Free Trial" (button)

# Secondary CTA
"Contact Sales for Enterprise" (link)

# Dismiss
"Remind Me Later" (text link, small)

# After Dismiss (3rd time):
"To continue inviting members, please upgrade your plan or remove inactive members."
```

**Implementation:**
```tsx
// /components/SeatLimitModal.tsx
import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

interface SeatLimitModalProps {
  open: boolean
  onClose: () => void
  currentPlan: 'team' | 'pro'
  currentSeats: number
  maxSeats: number
  pendingEmail: string
  teamId: string
}

export function SeatLimitModal({ open, onClose, currentPlan, currentSeats, maxSeats, pendingEmail, teamId }: SeatLimitModalProps) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)

    // Save pending invitation
    localStorage.setItem('pendingInvitation', JSON.stringify({
      teamId,
      email: pendingEmail,
      timestamp: Date.now()
    }))

    // Redirect to Stripe checkout with trial
    const res = await fetch('/api/billing/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tier: 'pro',
        teamId,
        trialDays: 14
      })
    })

    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Your team is growing! 🚀</h2>
            <p className="text-muted-foreground mt-2">
              You've reached your {maxSeats}-member limit on the Team plan.
              Upgrade to Pro to add 20 more teammates and unlock advanced features.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="text-sm font-medium">You're trying to invite:</div>
            <div className="font-mono text-sm">{pendingEmail}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Team Plan */}
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <div className="font-semibold">Team</div>
                <div className="text-2xl font-bold">$20<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  5 team members
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  100 prompt runs/month
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Basic collaboration
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <X className="h-4 w-4" />
                  Analytics dashboard
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <X className="h-4 w-4" />
                  Audit logs
                </li>
              </ul>
              <div className="text-xs text-muted-foreground pt-2 border-t">
                Your current plan
              </div>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-primary rounded-lg p-4 space-y-3 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Recommended
              </div>
              <div>
                <div className="font-semibold">Pro</div>
                <div className="text-2xl font-bold">$99<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <strong>25 team members</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <strong>1,000 prompt runs/month</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Advanced collaboration
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <strong>Analytics dashboard</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <strong>Audit logs & compliance</strong>
                </li>
              </ul>
              <div className="text-xs text-green-600 font-medium pt-2 border-t">
                14-day free trial
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleUpgrade}
              disabled={loading}
              className="flex-1"
              size="lg"
            >
              Start 14-Day Free Trial
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Need more than 25 seats? <a href="/contact" className="text-primary underline">Contact Sales</a> for Enterprise pricing
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

**Priority 1B: Upgrade Success Flow**

After Stripe checkout success:
```typescript
// /app/billing/success/page.tsx

1. Check localStorage for pendingInvitation
2. If exists: Send invitation via API
3. Show success message: "Upgrade complete! Invitation sent to {email}"
4. Redirect to team members page
5. Show confetti or celebration animation
```

---

### Phase 2: Team Management UI (Week 2-3)

**Priority 2A: Team Settings Page**

Route: `/app/settings/team/page.tsx` (exists but empty)

**Sections:**

1. **Team Profile**
   - Team name (editable, 3-100 chars)
   - Team avatar upload
   - Description (optional)
   - Team slug (auto-generated, shown read-only)

2. **Plan & Billing**
   - Current plan badge (Team $20 or Pro $99)
   - Seats used: "3/5 members" with progress bar
   - Billing status: "Active" / "Past Due" / "Cancelled"
   - CTA: "Manage Billing" → Stripe portal
   - CTA: "Upgrade to Pro" (if on Team plan)

3. **Usage This Month**
   - Prompts created: "12 / unlimited"
   - Prompt runs: "45 / 100" with progress bar
   - Storage used: "0.3 GB / 1 GB"
   - When >80%: Warning banner with upgrade CTA

4. **Team Settings**
   - Default prompt visibility: [Private | Team | Public]
   - Require approval for public sharing: [Yes | No]
   - Allow prompt forking: [Yes | No]

**Wireframe Spec:**

```
┌─────────────────────────────────────────────────┐
│ Settings > Team                                  │
├─────────────────────────────────────────────────┤
│                                                  │
│  [Avatar]  Team Name                     [Edit] │
│            Description text...                   │
│            promptmanage.com/teams/my-team-slug  │
│                                                  │
├─────────────────────────────────────────────────┤
│  Plan & Billing                                  │
│                                                  │
│  [Pro Badge] Pro Plan                   $99/mo  │
│  Active since Jan 15, 2025                      │
│                                                  │
│  Team Members          [====    ] 5/25          │
│  Prompt Runs/Month     [======  ] 234/1,000     │
│  Storage Used          [=       ] 0.8/10 GB     │
│                                                  │
│  [Manage Billing]                               │
│                                                  │
├─────────────────────────────────────────────────┤
│  Team Settings                                   │
│                                                  │
│  Default prompt visibility                      │
│  ○ Private  ●Team  ○ Public                     │
│                                                  │
│  ☑ Require approval for public sharing          │
│  ☑ Allow members to fork prompts                │
│                                                  │
│  [Save Changes]                                 │
└─────────────────────────────────────────────────┘
```

**Acceptance Criteria:**
- Load team data from `teams` table via API
- Update team name/description via PATCH `/api/teams/{id}`
- Show real-time usage from `getUserUsage()` function
- Progress bars turn red when >80% limit
- "Upgrade" CTA appears when usage high or seats near limit
- Only owners/admins can edit settings

**Priority 2B: Member Management Page**

Route: `/app/settings/team/members/page.tsx`

**Features:**

1. **Member List**
   - Avatar, name, email, role, joined date, last active
   - Sortable by any column
   - Filter by role
   - Search by name/email

2. **Invite New Member**
   - Email input with validation
   - Role dropdown (viewer, editor, admin)
   - Button: "Send Invitation"
   - Shows pending invitations below

3. **Member Actions**
   - Change role (dropdown, admins only)
   - Remove member (admins only, confirm modal)
   - Resend invitation (for pending invites)
   - Cancel invitation

4. **Pending Invitations Section**
   - Shows all pending invites
   - Status: "Sent 2 days ago"
   - Expires in: "5 days"
   - Actions: Resend, Cancel

**Wireframe Spec:**

```
┌──────────────────────────────────────────────────────────────┐
│ Settings > Team > Members                  [Invite Member +] │
├──────────────────────────────────────────────────────────────┤
│  Search...                     Filter: [All Roles ▼]         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Name               Email            Role      Joined    •••  │
│  ────               ─────            ────      ──────    ─── │
│  [👤] John Smith    john@co.com      Owner     Jan 1     [⋮]│
│  [👤] Jane Doe      jane@co.com      Admin     Jan 5     [⋮]│
│  [👤] Bob Lee       bob@co.com       Editor    Jan 12    [⋮]│
│  [👤] Alice Chen    alice@co.com     Viewer    Jan 20    [⋮]│
│                                                               │
│  5/5 members on Team plan              [Upgrade for More]    │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│  Pending Invitations                                          │
│                                                               │
│  Email             Role      Sent        Expires      Actions │
│  ────             ────      ────        ───────      ─────── │
│  new@co.com        Editor    2d ago      5 days       Resend  Cancel
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Microcopy for Member Actions:**

Remove member confirmation:
```
Title: "Remove Jane Doe from team?"
Body: "This will revoke their access to all team prompts and collections. They will keep their personal workspace."
CTA: "Remove Member" (destructive)
Cancel: "Cancel"
```

Change role confirmation (owner → admin):
```
Title: "Change John Smith's role to Admin?"
Body: "Admins can manage team members and settings, but cannot transfer ownership or delete the team."
CTA: "Change Role"
Cancel: "Cancel"
```

**Acceptance Criteria:**
- Load members from `team_members` table with `user_profiles` join
- Load pending invitations from `team_invitations` where status='pending'
- Invite member: POST to `/api/teams/{id}/members/invite`
  - Checks seat limit
  - Shows SeatLimitModal if exceeded
  - Sends email via existing `/api/teams/invite/send-email`
- Change role: PATCH to `/api/teams/{id}/members/{userId}`
- Remove member: DELETE to `/api/teams/{id}/members/{userId}`
- Resend invitation: POST to `/api/teams/{id}/invitations/{id}/resend`
- Track "member_invited" event in analytics

---

### Phase 3: Usage Dashboard (Week 3-4)

**Priority 3A: Team Dashboard Page**

Route: `/app/dashboard/team/page.tsx`

**Sections:**

1. **Usage Overview (This Month)**
   - Cards for: Prompts Created, Runs Executed, Active Members
   - Mini charts showing trend (last 7 days)

2. **Top Prompts**
   - Table: Prompt name, runs, last used, created by
   - Sort by usage or recency
   - Click to view prompt

3. **Team Activity Feed**
   - Recent actions: "Jane created prompt X"
   - "Bob forked prompt Y"
   - "Alice added prompt Z to collection"
   - Timestamps and actor avatars

4. **Quick Actions**
   - Create Prompt
   - Create Collection
   - Invite Member
   - View All Prompts

**Wireframe Spec:**

```
┌────────────────────────────────────────────────────────────────┐
│ Team Dashboard                                     [Settings ⚙] │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐     │
│  │ Prompts  │  │ Runs     │  │ Members  │  │ Storage   │     │
│  │ 45       │  │ 234      │  │ 5/25     │  │ 0.8/10 GB │     │
│  │ +12 this │  │ +89 this │  │ +2 this  │  │ +0.2 this │     │
│  │ month    │  │ month    │  │ week     │  │ month     │     │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘     │
│                                                                 │
├────────────────────────────────────────────────────────────────┤
│  Top Prompts This Month                              [View All]│
│                                                                 │
│  Name                    Runs    Created By    Last Used       │
│  ────                    ────    ──────────    ─────────       │
│  Customer Support Flow   89      Jane Doe      2 hours ago     │
│  Blog Post Generator     67      Bob Lee       5 hours ago     │
│  Code Review Assistant   34      Alice Chen    1 day ago       │
│                                                                 │
├────────────────────────────────────────────────────────────────┤
│  Recent Activity                                     [View All]│
│                                                                 │
│  [👤] Jane Doe created "Customer Support Flow"  2h ago        │
│  [👤] Bob Lee forked "Blog Post Generator"       5h ago        │
│  [👤] Alice Chen added prompt to "Q1 Marketing"  1d ago        │
│  [👤] John Smith invited new@co.com               2d ago        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Data Sources:**
- Usage stats: Query `prompts` grouped by `team_id`
- Run count: New `prompt_runs` table (create if doesn't exist)
- Activity: New `team_audit_logs` table or parse from version control
- Member count: Count from `team_members` where `is_active=true`

**Acceptance Criteria:**
- Dashboard loads in <2 seconds
- Stats update in real-time (or cache for 5 minutes)
- Charts show 7-day trend lines
- Activity feed shows last 20 actions
- All cards link to detailed views
- Mobile-responsive layout

---

### Phase 4: Onboarding & Activation (Week 4-5)

**Priority 4A: Team Creation Wizard**

When user clicks "Create New Team":

**Step 1: Team Info**
```
Title: "Create Your Team Workspace"

[Team Name Input]
Placeholder: "Marketing Team"

[Description Textarea] (optional)
Placeholder: "Collaborate on marketing prompts"

[Next] [Cancel]
```

**Step 2: Invite Members (Optional)**
```
Title: "Invite Your Team"

You can invite teammates now or do this later.

[Email Input 1] [Role Dropdown: Editor ▼]
[Email Input 2] [Role Dropdown: Editor ▼]
[+ Add Another]

Tip: You have 5 seats on the free Team plan. Need more? Upgrade to Pro for 25 seats.

[Send Invitations & Continue] [Skip for Now]
```

**Step 3: Import Prompts (Optional)**
```
Title: "Add Some Prompts"

Start with prompts from:
○ Import from file (.json, .csv)
○ Copy from my personal workspace
○ Start from scratch

[Continue] [Skip]
```

**Step 4: Success**
```
Title: "Your team is ready! 🎉"

What's next:
✅ Create your first team prompt
✅ Invite more members
✅ Organize prompts into collections

[Go to Team Dashboard]
```

**Acceptance Criteria:**
- Wizard can be dismissed and resumed later
- Progress saved after each step
- Invitations sent via existing email API
- Import uses existing bulk import endpoint
- Track completion rate: target 70%+ complete wizard

**Priority 4B: First 7 Days Activation Plan**

**Day 0: Signup**
- Auto-create personal workspace (already exists)
- Show welcome tooltip: "Create your first prompt or start a team"

**Day 1: Email**
```
Subject: "Welcome to Prompt Manage! 👋"

Hi {name},

Thanks for joining Prompt Manage! Here's how to get started:

1. Create your first prompt
2. Organize prompts into collections
3. Invite teammates to collaborate

[Create Your First Prompt]

Need help? Reply to this email.
```

**Day 2: In-App Prompt**
If no team created yet:
```
Banner: "Working with a team? Create a shared workspace to collaborate on prompts."
[Create Team Workspace]
```

**Day 3: Email (if no invites sent)**
```
Subject: "Collaboration makes prompts better"

Prompt Manage is better with teammates. Here's why:

✓ Share prompt libraries across your team
✓ Get feedback and iterate together
✓ Track usage and optimize performance

[Invite Your Team]
```

**Day 7: In-App Milestone**
If user created 3+ prompts:
```
Modal: "You're on a roll! 🚀"

You've created {count} prompts. Ready to take it further?

→ Organize prompts into collections
→ Invite teammates to collaborate
→ Upgrade for unlimited prompts

[Create Collection] [Invite Team]
```

**Metrics to Track:**
- Day 1: % who create first prompt (target: 60%)
- Day 3: % who create team (target: 30%)
- Day 7: % who invite member (target: 20%)
- Day 7: % still active (target: 40%)

---

## Personas & Use Cases

### Persona 1: Team Owner (Primary Decision Maker)

**Profile:**
- Name: Sarah, Marketing Director
- Company: 50-person startup
- Pain: Team using scattered docs, Notion pages, ChatGPT history for prompts
- Goal: Centralize prompts, enable reuse, track what works

**Jobs to Be Done:**
1. Set up team workspace quickly
2. Invite marketing team (5-8 people)
3. Import existing prompts from docs
4. See who's using which prompts
5. Control access and prevent accidental public sharing

**Success Metrics:**
- Team workspace created in <5 minutes
- 4+ members invited in first week
- 10+ prompts added in first month
- Upgrades to Pro when hitting seat limit

### Persona 2: Prompt Engineer (Power User)

**Profile:**
- Name: Alex, ML Engineer
- Company: Mid-size SaaS
- Pain: Hard to version control prompts, no way to A/B test
- Goal: Build reusable prompt library, track performance

**Jobs to Be Done:**
1. Create complex multi-step prompts
2. Version control and revert changes
3. Fork prompts to experiment
4. Share best performers with team
5. Track usage and cost

**Success Metrics:**
- Creates 20+ prompts in first month
- Uses versioning and forking regularly
- Shares 5+ prompts with team
- Upgrades for analytics and more runs

### Persona 3: Customer Support Manager

**Profile:**
- Name: Mike, CS Manager
- Company: E-commerce platform
- Pain: Support reps write same prompts repeatedly
- Goal: Standard response templates, consistent quality

**Jobs to Be Done:**
1. Create prompt templates for common issues
2. Share with 15-person support team
3. Lock templates so they can't be accidentally edited
4. Track which templates are most used

**Success Metrics:**
- Hits 5-seat limit quickly, upgrades to Pro
- Creates 5+ collections (by issue type)
- Team uses prompts 100+ times/month
- Reduces response time by 30%

### Persona 4: Freelancer/Agency Owner

**Profile:**
- Name: Rachel, Content Agency Owner
- Company: 3-person agency + contractors
- Pain: Client work scattered, hard to reuse
- Goal: Prompt library per client, easy sharing

**Jobs to Be Done:**
1. Create team per client project
2. Invite client for collaboration
3. Set permissions (client = viewer, team = editor)
4. Archive completed projects

**Success Metrics:**
- Creates 3-5 teams (one per client)
- Invites clients as viewers
- Stays on Team plan ($20) initially
- Upgrades when agency grows to 6+ people

---

## Security & Compliance (Pro Plan Differentiator)

### What Team Plan Gets (Basic Security)

✅ Row-Level Security (RLS) on all tables
✅ Email-based invitations with expiry
✅ Role-based permissions (4 roles)
✅ HTTPS encryption in transit
✅ Password-based auth or Google OAuth

### What Pro Plan Adds (Enterprise Security)

#### 1. SSO Integration
**Status:** Not yet implemented

**Implementation Plan:**
- Use Supabase Auth SSO (supports SAML, OIDC)
- Add `sso_provider` field to teams table
- Settings UI: "Configure SSO" section
- Supported providers: Google Workspace, Okta, Azure AD

**UX Flow:**
```
Settings > Security > Single Sign-On

[Configure SSO]

Provider: [Select: Google Workspace / Okta / Azure AD]

SAML Entity ID: [________]
SAML SSO URL: [________]
X.509 Certificate: [Upload]

[Test Connection] [Save]

Once enabled, team members must sign in via SSO.
```

#### 2. Audit Logs
**Status:** Partially implemented (version control logs changes)

**Implementation Plan:**
- Create `team_audit_logs` table
- Log all team actions: invites, role changes, prompt edits, etc.
- Settings page: "Audit Logs" tab

**UX: Audit Logs Page**
```
Settings > Audit Logs

Filter: [All Actions ▼] [All Users ▼] [Last 30 Days ▼]

Timestamp         User          Action                    Details
─────────────     ────         ──────                    ───────
Jan 20, 3:45pm    Jane Doe     Invited member            new@co.com
Jan 20, 2:30pm    Bob Lee      Created prompt            "Customer Support Flow"
Jan 19, 5:15pm    Alice Chen   Changed member role       John Smith: Editor → Admin
Jan 19, 11:00am   Jane Doe     Updated team settings     Default visibility: Private → Team

[Export CSV]
```

**Logged Events:**
- member_invited, member_removed, member_role_changed
- prompt_created, prompt_updated, prompt_deleted, prompt_shared
- collection_created, collection_updated, collection_deleted
- team_settings_updated, team_billing_updated
- sso_configured, sso_login

#### 3. Advanced Permissions
**Status:** Basic 4-role system exists

**Pro Enhancement:**
- Per-collection permissions (separate from global role)
- Read-only external collaborators
- Approval workflows for public sharing

**UX: Collection Permissions**
```
Collection Settings > Permissions

Default: Inherit from team role
Override permissions:

User/Role         Access Level
─────────────     ────────────
Marketing Team    Editor
Legal Team        Viewer
external@co.com   Read-only    [Invite]

[Save]
```

#### 4. Data Loss Prevention (DLP)
**Status:** Not implemented

**Pro Feature:**
- Scan prompts for sensitive data (API keys, PII, etc.)
- Block or warn on public sharing if detected
- Admin can configure detection rules

**UX: DLP Settings**
```
Settings > Security > Data Loss Prevention

☑ Scan prompts for sensitive data
☑ Block public sharing of prompts with:
  ☑ API keys or tokens
  ☑ Email addresses
  ☑ Credit card numbers
  ☑ Custom regex: [________]

☐ Warn only (don't block)
☑ Notify admins when violations occur

[Save]
```

#### 5. Prompt Secrets Management
**Status:** Partially designed, not implemented

**How It Works:**
- Prompts can reference variables like `{{API_KEY}}`
- Secrets stored encrypted in `prompt_secrets` table
- Secrets never exposed in UI or API (masked)
- Team-level or prompt-level scope

**UX: Add Secret**
```
Prompt Editor > Variables

Variables in this prompt:
- {{API_KEY}}
- {{USER_EMAIL}}

[Configure Secrets]

Secret Name      Value            Scope
───────────      ─────            ─────
API_KEY          ••••••••••••     Team-wide
USER_EMAIL       ••••••••••••     This prompt only

[Add Secret]
```

---

## Billing & Upgrade Mechanics

### Trigger Points (When to Show Upgrade Prompts)

#### 1. Seat Limit (Most Important)
**Trigger:** Admin tries to invite 6th member on Team plan
**Response:** SeatLimitModal (described above)
**Frequency:** Every time, max 3 dismissals

#### 2. Prompt Runs Limit
**Trigger:** Team uses 80% of monthly runs (80/100 on Team plan)
**Response:** Banner at top of dashboard
```
⚠️ You've used 80/100 prompt runs this month. Upgrade to Pro for 10x more runs (1,000/month).
[Upgrade Now] [Dismiss]
```
**Frequency:** Show once per month

#### 3. Storage Limit
**Trigger:** Team uses 80% of storage (0.8/1 GB on Team plan)
**Response:** Banner on team settings page
```
⚠️ Storage almost full (0.8/1 GB). Upgrade to Pro for 10 GB storage.
[Upgrade Now] [Dismiss]
```

#### 4. Analytics Request
**Trigger:** User clicks "Usage Analytics" (Pro-only feature)
**Response:** Feature gate modal
```
Title: "Analytics Available on Pro Plan"

Unlock detailed usage analytics:
✓ Per-member usage breakdown
✓ Cost tracking and projections
✓ Top prompts by performance
✓ Export reports

[Start 14-Day Pro Trial] [Learn More]
```

#### 5. Audit Logs Request
**Trigger:** User clicks "Audit Logs" tab (Pro-only)
**Response:** Similar feature gate modal

### Upgrade Flow Details

**Step 1: User clicks "Upgrade" CTA**
- Redirects to plan comparison page at `/pricing?team={teamId}`

**Step 2: Plan Comparison Page**
```
Choose Your Plan

┌──────────────┐  ┌──────────────────┐
│ Team         │  │ Pro (Recommended)│
│ $20/mo       │  │ $99/mo           │
│              │  │                  │
│ 5 members    │  │ 25 members       │
│ 100 runs/mo  │  │ 1,000 runs/mo    │
│ 1 GB storage │  │ 10 GB storage    │
│ Basic support│  │ Priority support │
│              │  │ Analytics ✓      │
│              │  │ Audit logs ✓     │
│              │  │ SSO ✓            │
│              │  │                  │
│ [Current]    │  │ [Upgrade]        │
└──────────────┘  └──────────────────┘

First-time upgrade: 14-day free trial
```

**Step 3: Stripe Checkout**
- POST to `/api/billing/create-checkout` with `tier: 'pro', teamId, trialDays: 14`
- Stripe session includes:
  - Line item: Pro plan ($99/mo)
  - Trial period: 14 days
  - Success URL: `/billing/success?session_id={CHECKOUT_SESSION_ID}`
  - Cancel URL: `/pricing`

**Step 4: Success Page**
- Show confirmation message
- Send pending invitations (if any)
- Update team tier in database (via webhook)
- Show next steps: "Your Pro trial is active! Enjoy 14 days free."

**Step 5: Trial Ending Reminder**
- Email 3 days before trial ends
```
Subject: "Your Pro trial ends in 3 days"

Hi {name},

Your 14-day Pro trial ends on {date}. Here's what you've unlocked:

✓ Added {count} more members (beyond 5-seat limit)
✓ Used {count} prompt runs (would have hit limit on Team plan)
✓ Accessed analytics dashboard

Your card will be charged $99 on {date}. To cancel or change plans, visit your billing settings.

[Manage Billing]
```

### Downgrade Handling

**If User Downgrades Pro → Team:**

1. Check member count
2. If >5 members: Show warning modal
```
Title: "Cannot downgrade: too many members"

You have 8 team members, but the Team plan allows only 5.

To downgrade:
1. Remove 3 members
2. Try downgrading again

[Go to Member Management] [Cancel]
```

3. If ≤5 members: Allow downgrade immediately
4. Pro features become read-only:
   - Analytics: "Upgrade to Pro to access analytics"
   - Audit logs: Show last 7 days only (vs. 90 days on Pro)

---

## A/B Test Ideas

### Test 1: Seat Limit Modal Urgency
**Hypothesis:** Adding urgency increases upgrade rate

**Variant A (Control):**
"You've reached your 5-member limit. Upgrade to Pro for 25 seats."

**Variant B (Urgency):**
"You've reached your 5-member limit. Upgrade now to unlock 25 seats and continue inviting teammates."

**Variant C (Social Proof):**
"You've reached your 5-member limit. Join 500+ teams on Pro with up to 25 seats."

**Metrics:**
- Click-through rate on "Upgrade" CTA
- Trial start rate
- Conversion to paid after trial

**Target:** 25%+ click-through rate, 15%+ trial starts

### Test 2: Trial Length
**Hypothesis:** 7-day trial converts better than 14-day (more urgency)

**Variant A:** 14-day free trial
**Variant B:** 7-day free trial
**Variant C:** 30-day free trial

**Metrics:**
- Trial start rate
- Trial-to-paid conversion rate
- Engagement during trial (logins, invites, usage)

### Test 3: Upgrade Placement
**Hypothesis:** Contextual upgrade prompts convert better than generic banners

**Variant A (Control):** Generic banner at top of dashboard
**Variant B (Contextual):** Show upgrade prompt at moment of need (when adding 6th member)
**Variant C (Both):** Combine banner + contextual

**Metrics:**
- Upgrade rate per variant
- User annoyance (track dismissal rate)

### Test 4: Plan Positioning
**Hypothesis:** Emphasizing "value per seat" increases Pro adoption

**Variant A (Control):**
"Pro: $99/mo for 25 seats"

**Variant B (Per-Seat):**
"Pro: $4 per seat/mo (vs. $4 on Team)"

**Variant C (ROI):**
"Pro: Save 20% per seat with 25 members"

**Metrics:**
- Click-through on Pro plan
- Trial start rate

### Test 5: Onboarding Wizard
**Hypothesis:** Multi-step wizard increases team creation + invite rate

**Variant A (Control):** Simple "Create Team" button → form
**Variant B (Wizard):** 4-step wizard with invites + import
**Variant C (Hybrid):** Wizard with "Skip" option on each step

**Metrics:**
- Team creation completion rate
- Invites sent in first 7 days
- Time to first invite

---

## Success Metrics & KPIs

### Primary Revenue Metrics

1. **Team-to-Pro Upgrade Rate**
   - Target: 30% within 90 days
   - Current: 0% (no teams yet)
   - Track: Monthly cohort analysis

2. **Average Revenue Per Team**
   - Target: $60/mo (mix of Team and Pro)
   - Formula: (Team plans * $20 + Pro plans * $99) / Total teams

3. **Trial-to-Paid Conversion**
   - Target: 40% of trials convert to paid Pro
   - Track: 14-day trial cohorts

4. **Seat Expansion Rate**
   - Target: Teams add 1.5 members/month on average
   - Track: Monthly member count growth

### User Engagement Metrics

5. **Team Invite Rate**
   - Target: 60% of teams invite ≥1 member in first week
   - Track: Time from team creation to first invite

6. **Prompt Sharing Rate**
   - Target: 40% of prompts are team-shared (vs. personal)
   - Track: `prompts.team_id IS NOT NULL`

7. **Collection Usage**
   - Target: 50% of teams create ≥1 collection in first month
   - Track: Collections per team, prompts per collection

8. **Team Retention**
   - Target: 85% month-over-month retention for teams
   - vs. 65% for individual users
   - Track: Active teams by cohort

### Product Health Metrics

9. **Seat Utilization**
   - Target: 80% of paid seats have active users
   - Formula: Active members / Max members
   - Low utilization = churn risk

10. **Runs Per Member**
    - Target: 20 runs/member/month
    - High usage = strong engagement

11. **Support Ticket Rate**
    - Target: <5% of teams open tickets/month
    - Track: Tickets by team plan

12. **Feature Adoption**
    - SSO: 10% of Pro teams within 6 months
    - Audit logs: 40% of Pro teams view logs
    - Analytics: 60% of Pro teams use dashboard

---

## Instrumentation Requirements

### Events to Track

#### Team Management
```json
{
  "event": "team_created",
  "team_id": "uuid",
  "user_id": "uuid",
  "tier": "team",
  "source": "dashboard" // or "onboarding_wizard"
}

{
  "event": "member_invited",
  "team_id": "uuid",
  "inviter_id": "uuid",
  "invitee_email": "email",
  "role": "editor",
  "seats_used": 3,
  "seats_max": 5
}

{
  "event": "member_joined",
  "team_id": "uuid",
  "user_id": "uuid",
  "role": "editor",
  "days_since_invite": 2
}
```

#### Upgrade Flow
```json
{
  "event": "upgrade_modal_shown",
  "team_id": "uuid",
  "trigger": "seat_limit", // or "runs_limit", "storage_limit", "feature_gate"
  "current_tier": "team",
  "seats_used": 5,
  "seats_max": 5
}

{
  "event": "upgrade_cta_clicked",
  "team_id": "uuid",
  "trigger": "seat_limit",
  "cta_type": "trial", // or "upgrade", "contact_sales"
}

{
  "event": "trial_started",
  "team_id": "uuid",
  "tier": "pro",
  "trial_days": 14,
  "previous_tier": "team"
}

{
  "event": "upgrade_completed",
  "team_id": "uuid",
  "tier": "pro",
  "previous_tier": "team",
  "mrr_change": 79 // $99 - $20
}
```

#### Usage Tracking
```json
{
  "event": "prompt_created",
  "team_id": "uuid",
  "user_id": "uuid",
  "is_team_shared": true,
  "collection_id": "uuid" // if added to collection
}

{
  "event": "prompt_run",
  "team_id": "uuid",
  "user_id": "uuid",
  "prompt_id": "uuid",
  "model": "gpt-4",
  "estimated_cost": 0.05
}

{
  "event": "collection_created",
  "team_id": "uuid",
  "user_id": "uuid",
  "visibility": "team"
}
```

### Analytics Tools

**Recommended Stack:**
- PostHog (open-source, self-hostable)
- Mixpanel (if budget allows)
- Custom Postgres queries for revenue metrics

**Implementation:**
```typescript
// /lib/analytics.ts

import { PostHog } from 'posthog-node'

const posthog = new PostHog(process.env.POSTHOG_KEY!)

export function trackEvent(
  event: string,
  userId: string,
  properties: Record<string, any>
) {
  posthog.capture({
    distinctId: userId,
    event,
    properties
  })
}

export function trackUpgradeModalShown(
  teamId: string,
  trigger: string,
  seatsUsed: number,
  seatsMax: number
) {
  trackEvent('upgrade_modal_shown', teamId, {
    trigger,
    seats_used: seatsUsed,
    seats_max: seatsMax,
    current_tier: 'team'
  })
}
```

---

## Rollout Plan

### Phase 1: Alpha (Week 1-2) - Internal + Power Users

**Scope:**
- Seat limit modal
- Team settings page
- Member management page
- Basic upgrade flow

**Audience:**
- Internal team (5 people)
- 10 power users (beta list)

**Success Criteria:**
- 0 critical bugs
- 50%+ complete onboarding wizard
- ≥1 upgrade attempt

**Rollout Mechanism:**
- Feature flag: `enable_teams_v2`
- Enable for specific user IDs

### Phase 2: Beta (Week 3-4) - Paying Customers

**Scope:**
- Usage dashboard
- Onboarding wizard
- Email notifications
- Analytics dashboard (Pro)

**Audience:**
- All paying customers (~50 teams)
- New signups (50% rollout)

**Success Criteria:**
- <5% support tickets
- 20%+ team creation rate
- 5%+ upgrade rate

**Rollout Mechanism:**
- Gradual rollout: 25% → 50% → 100%
- Monitor error rates, revert if >2% error rate

### Phase 3: General Availability (Week 5+)

**Scope:**
- Full feature set
- SSO for Pro (if ready)
- Audit logs

**Audience:**
- All users

**Success Criteria:**
- 30%+ team creation rate
- 10%+ upgrade rate within 30 days
- 85%+ team retention

**Marketing Push:**
- Blog post: "Introducing Teams"
- Email to all users
- Social media campaign
- Update homepage with team features

---

## Edge Cases & Anti-Abuse

### Edge Case 1: Orphaned Prompts
**Scenario:** User creates team prompts, then leaves team
**Solution:**
- Prompts stay with team (team_id is still set)
- Prompt creator attribution remains
- New owner can reassign or delete

### Edge Case 2: Team Owner Leaves
**Scenario:** Team owner deletes account or wants to leave
**Solution:**
- Require transferring ownership before leaving
- Show modal: "Transfer ownership to another admin before leaving"
- If force delete: Auto-promote oldest admin to owner
- If no other admins: Team becomes inactive, billing paused

### Edge Case 3: Spam Invitations
**Scenario:** User sends 100 invitations to random emails
**Solution:**
- Rate limit: Max 20 invitations per day per team
- Require email confirmation for sender (first time)
- Flag teams with >50% rejected/expired invitations
- Show warning: "Many of your invitations haven't been accepted. Only invite people you know."

### Edge Case 4: Shared Secrets Leak
**Scenario:** Team member copies prompt with secrets, shares publicly
**Solution:**
- Secrets are NOT included in exported prompts
- Show warning when exporting: "Secrets will not be included"
- Secrets are NOT visible in public shared prompts
- Audit log records: "secret_accessed" events

### Edge Case 5: Billing Failure Mid-Month
**Scenario:** Credit card fails, team has 10 members on Pro plan
**Solution:**
- Grace period: 7 days to update payment
- Email: "Payment failed, please update card"
- After 7 days: Downgrade to Team plan
- If >5 members: Make team read-only until payment or members removed
- Show banner: "Billing issue. Update payment to restore access."

### Edge Case 6: Trial Abuse
**Scenario:** User creates multiple teams to get multiple trials
**Solution:**
- One trial per user (not per team)
- Track in `user_profiles.has_used_trial` boolean
- Show modal: "You've already used your Pro trial"
- Offer "Contact Sales" for exception

### Edge Case 7: Downgrade with >5 Members
**Scenario:** Pro team with 10 members tries to downgrade to Team
**Solution:**
- Block downgrade with modal (shown earlier)
- Allow user to select which 5 members to keep
- Send email to removed members: "You've been removed from {team}"

### Edge Case 8: Invite Expiry Race Condition
**Scenario:** User clicks invite link just as it expires
**Solution:**
- Check expiry in `accept_team_invitation` function
- Show friendly message: "This invitation has expired. Contact {inviter} for a new link."
- Log: "invitation_expired_clicked" event
- Auto-send new invitation? (decision: NO, inviter must resend)

---

## Microcopy Bank

### Invite Emails

**Subject Lines:**
- "You're invited to join {team_name} on Prompt Manage"
- "{inviter_name} invited you to {team_name}"
- "Collaborate on prompts with {team_name}"

**Email Body (Plain Text):**
```
Hi,

{inviter_name} invited you to join {team_name} on Prompt Manage.

Prompt Manage is a team workspace for creating, sharing, and managing LLM prompts.

Your role: {role}

Accept invitation:
{invite_link}

This invitation expires in 7 days.

Questions? Reply to this email.

Thanks,
The Prompt Manage Team
```

**Email Body (HTML):**
```html
<h2>You're invited to {team_name}</h2>

<p>{inviter_name} invited you to join their team on Prompt Manage.</p>

<div style="background: #f5f5f5; padding: 16px; border-radius: 8px;">
  <strong>Team:</strong> {team_name}<br/>
  <strong>Your role:</strong> {role}<br/>
  <strong>Invited by:</strong> {inviter_name}
</div>

<a href="{invite_link}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
  Accept Invitation
</a>

<p style="color: #666; font-size: 14px; margin-top: 24px;">
  This invitation expires in 7 days.
</p>
```

### Empty States

**No Prompts Yet:**
```
Title: "No team prompts yet"
Body: "Create your first prompt or import existing ones to get started."
CTA: [Create Prompt] [Import]
```

**No Collections Yet:**
```
Title: "Organize prompts into collections"
Body: "Collections help you group related prompts for easy access."
CTA: [Create Collection]
```

**No Members Yet:**
```
Title: "You're the only member"
Body: "Invite teammates to collaborate on prompts together."
CTA: [Invite Members]
```

### Upgrade CTAs

**Contextual (Seat Limit):**
"Add more teammates with Pro (25 seats) →"

**Contextual (Runs Limit):**
"Need more runs? Upgrade to Pro for 1,000/month →"

**Generic Dashboard:**
"Unlock analytics, audit logs, and 25 seats with Pro →"

**Feature Gate:**
"This feature is available on the Pro plan. Start your 14-day trial →"

### Success Messages

**Team Created:**
"Team created! Invite members to start collaborating."

**Member Invited:**
"Invitation sent to {email}. They'll receive an email with a link to join."

**Upgrade Completed:**
"Welcome to Pro! Your team now has access to 25 seats, analytics, and more."

**Trial Started:**
"Your 14-day Pro trial is active. Enjoy all Pro features free until {date}."

### Error Messages

**Seat Limit Reached:**
"You've reached your {max_seats}-seat limit. Upgrade to add more members."

**Invitation Failed:**
"Failed to send invitation to {email}. Please check the email address and try again."

**Cannot Downgrade:**
"Cannot downgrade to Team plan with {current_members} members. Team plan allows 5 members max."

**Billing Failed:**
"Your payment failed. Please update your payment method to continue using Pro features."

---

## Wireframe/Spec Sheet

### Screen 1: Workspace Dashboard
**Route:** `/app/dashboard/team/page.tsx`
**Purpose:** Central hub for team activity and quick actions

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  [Logo] Prompt Manage           [Team: Marketing ▼]  [Avatar] │
├────────────────────────────────────────────────────────────────┤
│  ← Dashboard                                                    │
│                                                                 │
│  Welcome back, Sarah 👋                                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ ⚠️ You're using 89/100 prompt runs this month.          │ │
│  │ Upgrade to Pro for 1,000 runs/month [Upgrade] [Dismiss] │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐     │
│  │ Prompts  │  │ Runs     │  │ Members  │  │ Storage   │     │
│  │ 45       │  │ 234      │  │ 5/5      │  │ 0.8/1 GB  │     │
│  │ +12 ↑    │  │ +89 ↑    │  │ Full     │  │ 80% full  │     │
│  └──────────┘  └──────────┘  └──────────┘  └───────────┘     │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Top Prompts                                  [View All]│   │
│  │                                                         │   │
│  │ Customer Support Flow       89 runs   Jane Doe  2h ago │   │
│  │ Blog Post Generator         67 runs   Bob Lee   5h ago │   │
│  │ Code Review Assistant       34 runs   Alice     1d ago │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Recent Activity                              [View All]│   │
│  │                                                         │   │
│  │ [👤] Jane created "Customer Support Flow"      2h ago  │   │
│  │ [👤] Bob forked "Blog Post Generator"          5h ago  │   │
│  │ [👤] Alice added prompt to collection          1d ago  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Create Prompt] [Create Collection] [Invite Member]           │
└────────────────────────────────────────────────────────────────┘
```

**Components:**
- Alert banner (conditional, when usage >80%)
- Stat cards (4 across, responsive to 2x2 on mobile)
- Top prompts table (clickable rows)
- Activity feed (avatar + text + timestamp)
- Action buttons (primary CTAs)

**Interactions:**
- Team dropdown: Switch between teams
- Stat cards: Click to view details
- Alert banner: Dismiss (stores in localStorage)
- Upgrade CTA: Opens pricing page

### Screen 2: Invite Flow
**Route:** `/app/settings/team/members/page.tsx` + modal
**Purpose:** Add new team members

**Modal Layout:**
```
┌─────────────────────────────────────────┐
│  Invite Team Member               [×]   │
├─────────────────────────────────────────┤
│                                          │
│  Email address                           │
│  [________________________________]      │
│                                          │
│  Role                                    │
│  [Editor ▼]                              │
│    - Owner (full control)                │
│    - Admin (manage members)              │
│    - Editor (create & edit)  ✓          │
│    - Viewer (read-only)                  │
│                                          │
│  ℹ️ They'll receive an email invite     │
│  that expires in 7 days.                 │
│                                          │
│  [Cancel]           [Send Invitation]   │
│                                          │
│  ─────────── or ───────────              │
│                                          │
│  [Copy Invite Link]                      │
│  (Share this link directly)              │
└─────────────────────────────────────────┘
```

**Validation:**
- Email: Valid format, not already a member
- Role: Required, default to "Editor"
- Button disabled until valid

**Success State:**
```
┌─────────────────────────────────────────┐
│  Invitation Sent! ✓              [×]    │
├─────────────────────────────────────────┤
│                                          │
│  [✓] Invitation sent to:                │
│  jane@company.com                        │
│                                          │
│  What's next:                            │
│  • They'll receive an email shortly     │
│  • Remind them to check spam folder     │
│  • Invitation expires in 7 days         │
│                                          │
│  [Invite Another]  [Done]                │
└─────────────────────────────────────────┘
```

**Seat Limit Reached:**
If current members >= max_members, show SeatLimitModal instead

### Screen 3: Team Library (Prompt List)
**Route:** `/app/prompts?team={teamId}`
**Purpose:** Browse and search team prompts

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Team Prompts                                     [New Prompt +]│
├────────────────────────────────────────────────────────────────┤
│  [Search...]            [All] [Collections ▼] [Sort: Recent ▼] │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Customer Support Flow                           [⋮]   │   │
│  │  Respond to customer inquiries with empathy...          │   │
│  │  [💬 24 runs] [👤 Jane Doe] [📅 2 hours ago]           │   │
│  │  Tags: support, customer-service                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Blog Post Generator                             [⋮]   │   │
│  │  Generate SEO-optimized blog posts from topics...      │   │
│  │  [💬 18 runs] [👤 Bob Lee] [📅 5 hours ago]            │   │
│  │  Tags: content, marketing, seo                          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Code Review Assistant                           [⋮]   │   │
│  │  Review code for bugs, style, and best practices...    │   │
│  │  [💬 12 runs] [👤 Alice Chen] [📅 1 day ago]           │   │
│  │  Tags: engineering, code-review                         │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Load More...]                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Filters:**
- Search: Full-text across name, description, tags
- Collections: Filter by collection membership
- Sort: Recent, Most Used, Alphabetical

**Actions Menu [⋮]:**
- Run prompt
- Edit
- Add to collection
- Share
- Duplicate
- Delete (if owner/admin)

### Screen 4: Prompt Detail + Version History
**Route:** `/app/prompts/{id}`
**Purpose:** View and edit prompt, see version history

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  ← Back to Prompts                                              │
├────────────────────────────────────────────────────────────────┤
│  Customer Support Flow                [Edit] [Run] [Share] [⋮] │
│  Created by Jane Doe • Last edited 2 hours ago                 │
│                                                                 │
│  Tabs: [Prompt] [Version History] [Usage] [Settings]           │
├────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Prompt Text                                            │   │
│  │  ────────────────────────────────────────────────────  │   │
│  │  You are a helpful customer support agent. Your goal   │   │
│  │  is to respond to customer inquiries with empathy and  │   │
│  │  professionalism. Address their concerns and provide   │   │
│  │  clear solutions.                                       │   │
│  │                                                         │   │
│  │  Customer message: {{customer_message}}                │   │
│  │                                                         │   │
│  │  Respond with:                                          │   │
│  │  1. Acknowledge their concern                           │   │
│  │  2. Provide a solution or next steps                    │   │
│  │  3. Offer additional help                               │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Model: GPT-4                                                   │
│  Tags: support, customer-service                                │
│  Visibility: Team                                               │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Variables                                              │   │
│  │  • customer_message (required)                          │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

**Version History Tab:**
```
┌────────────────────────────────────────────────────────────────┐
│  Version History                                                │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  v3 (Current)                                           │   │
│  │  Jan 20, 2025 3:45 PM • Jane Doe                        │   │
│  │  Added step 3 to response structure                     │   │
│  │  [View Diff] [Compare]                                  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  v2                                                     │   │
│  │  Jan 19, 2025 11:00 AM • Jane Doe                       │   │
│  │  Clarified tone and empathy requirements                │   │
│  │  [View Diff] [Revert to This] [Compare]                │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  v1                                                     │   │
│  │  Jan 18, 2025 9:15 AM • Jane Doe                        │   │
│  │  Initial version                                        │   │
│  │  [View Diff] [Revert to This] [Compare]                │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- View Diff: Show side-by-side comparison
- Revert: Restore old version (creates new version)
- Compare: Select 2 versions to compare

### Screen 5: Approval Queue (Pro Only)
**Route:** `/app/dashboard/team/approvals/page.tsx`
**Purpose:** Admins review prompts before public sharing

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Approval Queue                                                 │
├────────────────────────────────────────────────────────────────┤
│  📋 3 prompts awaiting approval                                │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Blog Post Generator                                    │   │
│  │  Requested by Bob Lee • 2 hours ago                     │   │
│  │                                                         │   │
│  │  Wants to make this prompt public.                      │   │
│  │                                                         │   │
│  │  [View Prompt] [Approve] [Reject]                       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Email Template - Newsletter                            │   │
│  │  Requested by Alice Chen • 5 hours ago                  │   │
│  │                                                         │   │
│  │  Wants to share with external contractor.               │   │
│  │                                                         │   │
│  │  ⚠️ Warning: Contains variable {{api_key}}             │   │
│  │                                                         │   │
│  │  [View Prompt] [Approve] [Reject]                       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Customer Data Report                                   │   │
│  │  Requested by Mike Johnson • 1 day ago                  │   │
│  │                                                         │   │
│  │  ⚠️ Warning: May contain PII (email addresses)         │   │
│  │                                                         │   │
│  │  [View Prompt] [Approve] [Reject]                       │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

**Approve Modal:**
```
┌─────────────────────────────────────────┐
│  Approve Public Sharing?          [×]   │
├─────────────────────────────────────────┤
│                                          │
│  Prompt: Blog Post Generator             │
│  Requested by: Bob Lee                   │
│                                          │
│  This prompt will be:                    │
│  ✓ Visible to anyone with the link      │
│  ✓ Listed in public directory            │
│  ✓ Immutable (cannot be edited)          │
│                                          │
│  Comments (optional)                     │
│  [_________________________________]     │
│                                          │
│  [Cancel]              [Approve]         │
└─────────────────────────────────────────┘
```

**Reject Modal:**
```
┌─────────────────────────────────────────┐
│  Reject Public Sharing?           [×]   │
├─────────────────────────────────────────┤
│                                          │
│  Reason for rejection (required)         │
│  [_________________________________]     │
│  [_________________________________]     │
│  [_________________________________]     │
│                                          │
│  Bob Lee will be notified.               │
│                                          │
│  [Cancel]              [Reject]          │
└─────────────────────────────────────────┘
```

### Screen 6: Admin Security Panel (Pro Only)
**Route:** `/app/settings/team/security/page.tsx`
**Purpose:** Configure SSO, DLP, audit logs

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Security Settings                                              │
│  Configure authentication, permissions, and compliance          │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Single Sign-On (SSO)                                   │   │
│  │  ────────────────────────────────────────────────────  │   │
│  │  ☐ Enable SSO for this team                            │   │
│  │                                                         │   │
│  │  Provider: [Google Workspace ▼]                         │   │
│  │                                                         │   │
│  │  SAML Configuration                                     │   │
│  │  Entity ID: [________________________]                  │   │
│  │  SSO URL: [________________________]                    │   │
│  │  Certificate: [Upload .pem file]                        │   │
│  │                                                         │   │
│  │  [Test Connection] [Save]                               │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Data Loss Prevention                                   │   │
│  │  ────────────────────────────────────────────────────  │   │
│  │  ☑ Scan prompts for sensitive data                     │   │
│  │                                                         │   │
│  │  Block public sharing when detected:                    │   │
│  │  ☑ API keys or tokens                                  │   │
│  │  ☑ Email addresses                                     │   │
│  │  ☐ Credit card numbers                                 │   │
│  │  ☑ Custom patterns (regex)                             │   │
│  │                                                         │   │
│  │  [Add Pattern]                                          │   │
│  │                                                         │   │
│  │  Action: ● Block  ○ Warn only                          │   │
│  │  ☑ Notify admins of violations                         │   │
│  │                                                         │   │
│  │  [Save]                                                 │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Permissions                                            │   │
│  │  ────────────────────────────────────────────────────  │   │
│  │  Default prompt visibility:                             │   │
│  │  ○ Private  ● Team  ○ Public                           │   │
│  │                                                         │   │
│  │  ☑ Require admin approval for public sharing           │   │
│  │  ☑ Allow members to fork team prompts                  │   │
│  │  ☐ Lock prompt editing after 30 days                   │   │
│  │                                                         │   │
│  │  [Save]                                                 │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Audit Logs                                             │   │
│  │  ────────────────────────────────────────────────────  │   │
│  │  Track all team actions for compliance.                 │   │
│  │                                                         │   │
│  │  Retention: [90 days ▼]                                 │   │
│  │  Last export: Jan 15, 2025                              │   │
│  │                                                         │   │
│  │  [View Audit Logs] [Export CSV]                         │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

### Screen 7: Billing & Plan Comparison
**Route:** `/pricing?team={teamId}`
**Purpose:** Compare plans and upgrade

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Choose Your Plan                                               │
│  Unlock more seats, runs, and advanced features                 │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐│
│  │ Free            │  │ Team            │  │ Pro            ││
│  │ $0              │  │ $20/mo          │  │ $99/mo         ││
│  │                 │  │                 │  │ 14-day trial   ││
│  │ Personal use    │  │ Small teams     │  │ Growing teams  ││
│  │                 │  │                 │  │                ││
│  │ ✓ 25 prompts    │  │ ✓ Unlimited     │  │ ✓ Unlimited    ││
│  │ ✓ 10 runs/mo    │  │ ✓ 100 runs/mo   │  │ ✓ 1,000 runs   ││
│  │ ✓ Public share  │  │ ✓ 5 members     │  │ ✓ 25 members   ││
│  │ ✓ Collections   │  │ ✓ Team sharing  │  │ ✓ Advanced     ││
│  │                 │  │ ✓ Export        │  │   collaboration││
│  │ ✗ Team          │  │ ✓ 1 GB storage  │  │ ✓ 10 GB storage││
│  │ ✗ Analytics     │  │ ✗ Analytics     │  │ ✓ Analytics    ││
│  │ ✗ Audit logs    │  │ ✗ Audit logs    │  │ ✓ Audit logs   ││
│  │ ✗ SSO           │  │ ✗ SSO           │  │ ✓ SSO          ││
│  │                 │  │                 │  │ ✓ Priority     ││
│  │                 │  │                 │  │   support      ││
│  │                 │  │                 │  │                ││
│  │ [Current Plan]  │  │ [Upgrade]       │  │ [Start Trial]  ││
│  └─────────────────┘  └─────────────────┘  └────────────────┘│
│                                                                 │
│  Need more than 25 seats? [Contact Sales for Enterprise] →     │
└────────────────────────────────────────────────────────────────┘
```

**After Clicking Upgrade:**
- Redirects to Stripe Checkout
- Pre-filled with team info
- Trial period applied (first upgrade only)

### Screen 8: First-Time Onboarding Checklist
**Route:** `/app/onboarding` (shown after signup)
**Purpose:** Guide new users through setup

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Welcome to Prompt Manage! 🎉                              [×] │
├────────────────────────────────────────────────────────────────┤
│  Let's get you set up. Complete these steps to get the most    │
│  out of your workspace.                                         │
│                                                                 │
│  Progress: [====    ] 3/6 complete                             │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ✓ Create your account                                  │   │
│  │    Completed                                            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ✓ Create your first prompt                             │   │
│  │    Completed                                            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ✓ Create a collection                                  │   │
│  │    Completed                                            │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ○ Create a team workspace                              │   │
│  │    Collaborate with teammates on shared prompts         │   │
│  │    [Create Team]                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ○ Invite a teammate                                    │   │
│  │    Share your workspace and prompts                     │   │
│  │    [Invite Member]                                      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ○ Run your first prompt                                │   │
│  │    Execute a prompt and see the results                 │   │
│  │    [Go to Prompts]                                      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Skip for Now]                             [Continue Setup]   │
└────────────────────────────────────────────────────────────────┘
```

**Checklist Items:**
1. ✓ Create account (auto-complete)
2. Create first prompt
3. Create collection
4. Create team workspace
5. Invite teammate
6. Run first prompt

**Progress Tracking:**
- Store in localStorage or database
- Show progress bar
- Celebrate completion with confetti animation

---

## Next Steps & Immediate Action Items

### This Week (Week 1)

1. **Build SeatLimitModal Component**
   - File: `/components/SeatLimitModal.tsx`
   - Hook into member invite flow
   - Add Stripe trial parameter to checkout API

2. **Update Member Invite API**
   - Check seat limits before sending invitation
   - Return error with `upgrade_required` flag
   - Frontend shows SeatLimitModal on error

3. **Build Team Settings Page**
   - Route: `/app/settings/team/page.tsx`
   - Display team info, usage, plan
   - Add edit team name/description

### Next Week (Week 2)

4. **Build Member Management UI**
   - Enhance `/app/settings/team/members/page.tsx`
   - Add role change dropdown
   - Add remove member button
   - Show pending invitations

5. **Add Usage Dashboard**
   - Create `/app/dashboard/team/page.tsx`
   - Query usage stats from existing functions
   - Display charts and activity feed

### Following Weeks (Week 3-4)

6. **Onboarding Wizard**
   - Create team setup wizard
   - Add checklist component
   - Email sequence for activation

7. **Pro Features**
   - Analytics dashboard (usage breakdown)
   - Audit logs viewer
   - SSO configuration UI

### Testing & Launch (Week 5+)

8. **Alpha Testing**
   - Internal team + 10 power users
   - Fix bugs, gather feedback

9. **Beta Launch**
   - Gradual rollout to paying customers
   - Monitor metrics, iterate

10. **General Availability**
    - Full launch to all users
    - Marketing campaign
    - Blog post and announcements

---

## Success Criteria Summary

### Must-Have (MVP)
- ✓ Seat limit modal with upgrade flow
- ✓ Team settings page
- ✓ Member management UI
- ✓ Usage dashboard with limits shown
- ✓ Stripe trial integration
- ✓ Email invite flow (already exists)

### Should-Have (Launch)
- Onboarding wizard
- Activity feed on dashboard
- Upgrade CTAs throughout app
- First 7-days email sequence

### Nice-to-Have (Post-Launch)
- Analytics dashboard (Pro)
- Audit logs (Pro)
- SSO configuration (Pro)
- DLP scanning (Pro)

---

**Let's build this! 🚀**

Generated by the [Prompt Manage Team](https://promptmanage.com/about)
