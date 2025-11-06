# Sales-Led Upgrade Strategy
## Demo-Driven Lead Generation for Pro Plan Upgrades

---

## 🎯 Core Strategy: Demo > Trial

**Why Sales-Led:**
- Higher quality leads vs free trial signups
- Direct customer conversations reveal pain points
- Custom pricing for larger teams
- Builds relationships early
- Prevents trial abuse
- Better conversion rates for B2B

**Key Principle:** When teams hit limits, offer a demo call instead of self-service trial

---

## 💰 Revenue Model

### Pricing Tiers:
- **Team Plan**: $20/mo, 5 seats, 100 runs/month
- **Pro Plan**: $99/mo, 25 seats, 1,000 runs/month
- **Enterprise**: Custom pricing (25+ seats)

### Upgrade Trigger:
When Team plan admin tries to invite 6th member → **Book Demo** modal appears

### Expected Metrics:
- **35-40% demo booking rate** from seat limit trigger
- **50-60% demo show rate** (booked → attended)
- **40-50% demo → sale conversion** within 30 days
- **Net: ~15-20% Team → Pro conversion** from seat limit trigger

**Math:**
- 100 teams hit seat limit
- 37 book demos (37%)
- 20 attend demos (54% show rate)
- 9 convert to Pro (45% close rate)
- **= 9% immediate conversion + 11% pipeline**

---

## 🎨 User Flow

### 1. Seat Limit Trigger

```
User Action: Invites 6th member on Team plan
      ↓
API Response: SEAT_LIMIT_REACHED
      ↓
SeatLimitModal Appears:
┌──────────────────────────────┐
│ Your team is growing! 🚀     │
│                               │
│ You're trying to invite:      │
│ [  new@company.com  ]         │
│                               │
│ Team vs Pro Comparison        │
│ - 5 seats → 25 seats          │
│ - 100 runs → 1,000 runs       │
│ - Analytics, audit logs, etc. │
│                               │
│ [Book a Demo] (primary)       │
│ [Upgrade Now] (secondary)     │
│ [Maybe Later] (tertiary)      │
└──────────────────────────────┘
```

### 2. Demo Booking Flow

**Option A: Click "Book a Demo"**
```
1. Creates demo_request record in database
2. Sends notification to sales team email
3. Saves pending invitation to localStorage
4. Redirects to /demo confirmation page
5. Shows "We'll reach out within 24 hours"
```

**Option B: Click "Upgrade Now"**
```
1. Saves pending invitation to localStorage
2. Redirects to /pricing page
3. User completes self-service checkout
4. After payment, sends pending invitation
```

**Option C: Click "Maybe Later"**
```
1. Dismisses modal (max 3 times)
2. After 3rd dismissal: Shows firmer CTA
3. Tracks dismissal count in localStorage
```

---

## 📧 Sales Notification Email

When a demo is requested, sales team receives:

```
Subject: 🚀 New Demo Request - [Team Name] wants to upgrade

Hi Sales Team,

A team has requested a demo to upgrade from Team to Pro!

Details:
- Team: Marketing Team
- Contact: Sarah Johnson (sarah@company.com)
- Current Plan: Team ($20/mo)
- Team ID: abc-123
- Trying to invite: john@company.com
- Source: seat_limit_modal

Action Required: Reach out within 24 hours to schedule!

[Reply to Demo Request] (button with pre-filled email template)
```

**Pre-filled Email Template:**
```
To: sarah@company.com
Subject: Demo Request for Marketing Team

Hi Sarah,

Thanks for your interest in upgrading to Pro! I'd love to show you how Pro
can help your team with:

- 25 team members (vs 5 on Team)
- 1,000 prompt runs/month (vs 100)
- Advanced analytics dashboard
- Audit logs for compliance
- Priority support

When would be a good time for a quick 15-minute demo?

Here are my available times:
- [Option 1]
- [Option 2]
- [Option 3]

Or pick a time that works for you: [Calendly link]

Best,
[Your Name]
Prompt Manage Sales
```

---

## 📊 Lead Tracking Dashboard

### Demo Requests Table
Location: `supabase/migrations/20250206000000_demo_requests.sql`

**Schema:**
```sql
demo_requests
  - id
  - team_id
  - user_id
  - user_email, user_name, team_name
  - current_plan
  - pending_invite_email (who they were trying to invite)
  - source (seat_limit_modal, pricing_page, etc.)
  - status (pending, contacted, demo_scheduled, converted, lost)
  - contacted_at, demo_scheduled_at, converted_at
  - notes
```

### Sales Dashboard View
```
Demo Requests Queue

Status Filter: [All] [Pending] [Contacted] [Scheduled] [Converted] [Lost]

| Team Name       | Contact        | Plan | Source          | Requested | Status    | Actions |
|-----------------|----------------|------|-----------------|-----------|-----------|---------|
| Marketing Team  | sarah@co.com   | Team | Seat Limit      | 2h ago    | Pending   | Contact |
| Engineering     | john@startup   | Team | Dashboard CTA   | 1d ago    | Contacted | Schedule|
| Sales Ops       | mike@corp.com  | Team | Pricing Page    | 3d ago    | Scheduled | View    |

Metrics:
- Pending: 3 requests (avg wait: 4.2 hours)
- This Week: 12 demos booked, 7 attended, 3 converted
- Conversion Rate: 42.9%
```

---

## 🎯 Demo Script (For Sales Team)

### Opening (2 min)
```
"Hi [Name], thanks for joining! I see you're currently on our Team plan
and were looking to add more members. Let me show you what Pro unlocks
and we can discuss if it's a good fit for [Team Name]."
```

### Discovery Questions (3 min)
1. "How many people will be using Prompt Manage?"
2. "What's your main use case? (Marketing, support, engineering, etc.)"
3. "Are you tracking prompt performance or costs today?"
4. "Any compliance or security requirements?"

### Demo (7 min)
**Show:**
1. **Team management** - "Add up to 25 members vs 5"
2. **Analytics dashboard** - "See which prompts drive results"
3. **Audit logs** - "Full compliance tracking"
4. **Increased limits** - "1,000 runs vs 100/month"

**Highlight:**
- "This team is already using 80 runs/month, you'd hit the limit soon"
- "With 6 people wanting to join, you need Pro"
- "Analytics show ROI - see which prompts save time/money"

### Closing (3 min)
```
"Does Pro sound like a good fit for [Team Name]?"

If Yes:
"Great! I can get you upgraded today and we'll send that invitation to
[pending email] right away. You'll also get priority support from our team."

If Hesitation:
"What concerns do you have? [Address objections]"
- Price: "It's $4/seat vs $4/seat on Team, but you get 10x the features"
- Need time: "I can send you a summary. When should I follow up?"
- Not decision maker: "Who else needs to be involved?"
```

---

## 📈 Success Metrics

### Weekly Metrics:
- Demo requests: Target 15-20/week
- Demo show rate: Target 55%+
- Demo → conversion rate: Target 45%+

### Monthly Metrics:
- Team → Pro conversion: Target 20%/month
- Average deal size: $99/mo × 12 = $1,188 ACV
- MRR growth: Target $7-10k/month

### Quarterly Metrics:
- Total Pro customers: Target 50
- Churn rate: Target <5%/month
- Customer LTV: ~$4,752 (assuming 48-month retention)

---

## 🔧 Implementation Checklist

### ✅ Completed:
- [x] SeatLimitModal with "Book a Demo" CTA
- [x] Demo request API endpoint
- [x] Demo confirmation page (/demo)
- [x] Database table for demo_requests
- [x] Sales notification email
- [x] Lead capture with context (pending email, source, etc.)

### 🚧 Next Steps:
- [ ] Set up sales@ email address
- [ ] Configure SALES_EMAIL env variable
- [ ] Create internal sales dashboard (view demo_requests)
- [ ] Add Calendly integration (optional)
- [ ] Create demo script training doc
- [ ] Set up CRM integration (optional: Salesforce, HubSpot)
- [ ] Add Slack notifications for demo requests
- [ ] Build follow-up email automation

---

## 💡 Pro Tips

### For Fast Response Times:
1. **Slack Integration**: Post demo requests to #sales channel
2. **Email Rules**: Auto-star sales notification emails
3. **Response SLA**: Reply within 4 hours during business hours
4. **Auto-responder**: Send immediate "Got it! We'll reach out soon" email

### For Higher Show Rates:
1. **Calendar Invite**: Send Google Cal invite immediately
2. **Reminder Email**: 24 hours before demo
3. **SMS Reminder**: 2 hours before (optional)
4. **Confirmation Call**: Quick call to confirm time

### For Better Conversions:
1. **Do Discovery**: Ask questions before showing features
2. **Show Their Data**: Reference their actual usage in demo
3. **Address Blockers**: Ask about budget/decision-makers early
4. **Create Urgency**: "Let's get [pending person] invited today"
5. **Easy Checkout**: Offer to process upgrade on the call

---

## 🎨 Alternative CTAs Throughout App

### Dashboard Banner (When Usage >80%)
```
⚠️ You've used 85/100 prompt runs this month.

[Book a Demo] to see how Pro gives you 10x more capacity.
```

### Pricing Page
```
Not sure which plan? [Book a Demo] to discuss your needs.
```

### Settings Page
```
Ready to upgrade? [Book a Demo] or [Upgrade Now]
```

### Feature Gates (Pro-only features)
```
Analytics Dashboard
─────────────────
📊 Available on Pro plan

See detailed usage metrics, cost tracking, and performance data.

[Book a Demo] [Upgrade to Pro]
```

---

## 📞 Contact Options

### Primary: sales@promptmanage.com
- Monitored by sales team
- Response SLA: 4 hours
- Creates ticket in system

### Secondary: Calendly (Optional)
- Direct booking link: calendly.com/promptmanage/demo
- Embeds in demo booking page
- Syncs with team calendars

### Tertiary: Live Chat (Future)
- Intercom or similar
- Instant response during business hours
- Qualifies leads, books demos

---

## 🚀 Launch Plan

### Week 1: Internal Testing
- Test demo request flow
- Verify sales notifications work
- Practice demo script
- Set up email templates

### Week 2: Soft Launch
- Enable for 10 teams
- Monitor demo request rate
- Gather feedback
- Iterate on messaging

### Week 3: Full Launch
- Enable for all users
- Announce in changelog
- Email existing Team plan users
- Monitor metrics daily

### Week 4: Optimize
- Analyze conversion funnel
- A/B test messaging
- Refine demo script
- Add Slack/CRM integrations

---

## 📊 Sample Metrics (After 30 Days)

```
Demo Requests
─────────────
Total: 47 requests
Sources:
  - Seat limit: 32 (68%)
  - Pricing page: 8 (17%)
  - Dashboard CTA: 5 (11%)
  - Feature gate: 2 (4%)

Conversion Funnel
─────────────────
47 requests
→ 42 contacted (89% - within 6h avg)
→ 28 demos scheduled (60% booking rate)
→ 17 demos attended (61% show rate)
→ 8 converted to Pro (47% close rate)
→ 9 still in pipeline

Results
───────
- 8 new Pro customers
- $792/mo MRR added
- $9,504 ACV added
- 17% request → conversion rate
- 47% demo → conversion rate
```

---

## ✅ Success Criteria

### Must Have:
- [x] Demo request captures lead info
- [x] Sales team gets notified immediately
- [x] User sees confirmation page
- [x] Pending invitation saved for post-sale
- [x] No free trials given

### Should Have:
- [ ] Sales dashboard shows queue
- [ ] Automated follow-up emails
- [ ] Calendly integration
- [ ] Slack notifications

### Nice to Have:
- [ ] CRM integration (Salesforce/HubSpot)
- [ ] SMS reminders
- [ ] Live chat escalation to demo
- [ ] Video demos (Loom for async)

---

## 🎉 Why This Works

1. **Qualified Leads**: Only serious buyers request demos
2. **Personal Touch**: Builds relationships vs faceless trial
3. **Custom Pricing**: Can offer discounts for annual or large teams
4. **Higher LTV**: Customers who demo have better retention
5. **Product Feedback**: Learn what features matter most
6. **Competitive Intel**: Understand what they're comparing against
7. **Upsell Path**: Seed future Enterprise upgrades

---

**Bottom Line:** Sales-led approach trades conversion speed for conversion quality. You'll get fewer conversions initially, but they'll be stickier, higher-value customers who stay longer and potentially grow to Enterprise.

**Target: 15-20% conversion rate** from demo request → Pro customer within 30 days.

Generated by the [Prompt Manage Team](https://promptmanage.com/about)
