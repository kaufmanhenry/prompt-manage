# Stripe Configuration - Production Deployment

**Date:** 2025-11-07
**Status:** Ready for Production

---

## Environment Variables

Add these to your production environment (Vercel/Railway/etc.):

```bash
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# Product & Price IDs - Team Plan ($20/month)
STRIPE_PRODUCT_TEAM_ID=prod_TNi2HttxcKsWOH
STRIPE_PRICE_TEAM_MONTHLY_ID=price_1SQwcXRjrCP9fItaZHycCcQj

# Product & Price IDs - Pro Plan ($99/month)
STRIPE_PRODUCT_PRO_ID=prod_TNi3jruvGGK1IY
STRIPE_PRICE_PRO_MONTHLY_ID=price_1SQwdBRjrCP9fItaeEVFniy8
```

---

## Current Pricing Structure

### Free Plan
- **Price:** $0/month
- **Features:**
  - Store up to 25 prompts privately
  - Run prompts up to 10 times per month
  - Tag & organize prompts
  - Public sharing

### Team Plan
- **Price:** $20/month
- **Stripe Product:** `prod_TNi2HttxcKsWOH`
- **Stripe Price:** `price_1SQwcXRjrCP9fItaZHycCcQj`
- **Features:**
  - Unlimited prompts
  - Run prompts up to 100 times per month
  - Up to 5 team members
  - Private team collections
  - Advanced sharing & permissions
  - Bulk Import/Export
  - Priority support

### Pro Plan
- **Price:** $99/month
- **Stripe Product:** `prod_TNi3jruvGGK1IY`
- **Stripe Price:** `price_1SQwdBRjrCP9fItaeEVFniy8`
- **Features:**
  - Everything in Team
  - Run prompts up to 1,000 times per month
  - Up to 25 team members
  - Advanced analytics & insights
  - Enterprise-grade security
  - Custom integrations
  - Dedicated support

---

## Deployment Checklist

### Before Deploying

- [ ] **Update Production Environment Variables** (see above)
- [ ] **Replace test keys with live keys** in production:
  - `pk_test_...` → `pk_live_...`
  - `sk_test_...` → `sk_live_...`
  - Update webhook secret after creating production webhook
- [ ] **Create Production Webhook** in Stripe Dashboard:
  - URL: `https://yourdomain.com/api/stripe/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`

### Database Setup

Run these migrations in Supabase (in order):

1. `supabase/migrations/20250115000000_teams_core.sql` - Core teams tables
2. `supabase/migrations/20250120000000_integrate_teams.sql` - Teams integration
3. `supabase/migrations/20241220000000_add_subscriptions.sql` - Subscriptions table

### After Deploying

- [ ] **Test Free → Team Upgrade**
  1. Create new account
  2. Visit `/pricing`
  3. Click "Start with Team"
  4. Complete Stripe Checkout
  5. Verify subscription in `/settings/billing`

- [ ] **Test Free → Pro Upgrade**
  1. Create new account
  2. Visit `/pricing`
  3. Click "Start with Pro"
  4. Complete Stripe Checkout
  5. Verify subscription in `/settings/billing`

- [ ] **Test Paywall Enforcement**
  1. As free user, try to create 26th prompt
  2. Verify paywall modal appears
  3. Try to access import/export (`/dashboard/import-export`)
  4. Verify paywall blocks access

- [ ] **Test Team Features** (if using Teams)
  1. Create team subscription
  2. Invite team member at `/settings/team/members`
  3. Verify invitation email sent
  4. Accept invitation
  5. Verify billing shows under team settings

---

## Stripe Dashboard Configuration

### Products Created

✅ **Team** - `prod_TNi2HttxcKsWOH`
- Monthly price: $20 USD
- Recurring billing

✅ **Pro** - `prod_TNi3jruvGGK1IY`
- Monthly price: $99 USD
- Recurring billing

### Required Webhook Events

Configure webhook endpoint: `https://yourdomain.com/api/stripe/webhook`

**Events to subscribe to:**
- `checkout.session.completed` - New subscriptions
- `customer.subscription.updated` - Subscription changes
- `customer.subscription.deleted` - Cancellations
- `invoice.payment_succeeded` - Successful payments
- `invoice.payment_failed` - Failed payments

---

## Teams & Billing Organization

Your settings sidebar now shows:

```
Settings
├── Personal
│   ├── Account
│   ├── Billing (personal subscription)
│   └── Legal
└── Team: [Team Name]
    ├── Team Settings
    ├── Members
    └── Billing (team subscription)
```

**Key Points:**
- Personal billing: Manages individual user subscription
- Team billing: Manages team-level subscription (seats, plan, etc.)
- Billing page context-aware based on current team selection
- All unified under one clean interface

---

## Testing Locally

The dev server is running at: `http://localhost:3000`

**Test the flow:**
1. Visit `http://localhost:3000/pricing`
2. Click on Team or Pro plan
3. Verify Stripe Checkout loads correctly
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Verify redirect to dashboard with success message

---

## Support & Troubleshooting

**Common Issues:**

1. **Checkout not loading**
   - Verify `STRIPE_PRICE_TEAM_MONTHLY_ID` and `STRIPE_PRICE_PRO_MONTHLY_ID` are set
   - Check browser console for errors
   - Verify Stripe keys are correct

2. **Webhook failing**
   - Check webhook secret matches
   - Verify endpoint is publicly accessible
   - Check Stripe dashboard webhook logs

3. **Subscription not updating**
   - Verify webhook events are being received
   - Check database for subscription record
   - Review application logs

---

**Generated:** 2025-11-07
**Status:** Production Ready ✅
