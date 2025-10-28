# Paywall Implementation Review & Live Checklist

**Status:** 🔴 **NOT READY FOR PRODUCTION**  
**Date:** January 28, 2025  
**Reviewer:** AI Assistant

---

## 🚨 Critical Issues

### 1. **Misaligned Database Schema**

The paywall system references `user_subscriptions` table, but the Stripe webhook updates `teams` table. This is a structural mismatch.

**Current State:**

- `subscription.ts` queries `user_subscriptions` table ✅
- Webhook handler updates `teams` table ❌
- `user_profiles` has subscription fields but aren't used by paywall ❌

**Impact:** Subscriptions won't be saved to the database after checkout.

---

### 2. **Price ID Mismatch**

The `STRIPE_CONFIG.plans` has placeholder `priceId` fields that don't exist.

```typescript
// lib/stripe.ts lines 41, 59
pro: {
  price: 29,
  priceId: 'price_pro_monthly', // ❌ This doesn't exist in Stripe
}
team: {
  price: 99,
  priceId: 'price_team_monthly', // ❌ This doesn't exist in Stripe
}
```

**Actual Stripe Products:**

- Team: `prod_TFRWM6qsofeVR0`, Price: `price_1SIwdLRjrCP9fItak4u38pXS` ($5/mo)
- Enterprise: `prod_TFRWUfz3TVPJ1N`, Price: `price_1SIwdMRjrCP9fIta958u7rTW` ($27/mo)

**Price Discrepancy:**

- Config says: Pro $29, Team $99
- Stripe has: Team $5, Enterprise $27
- **They don't match!**

---

### 3. **Webhook Handler Mismatch**

The webhook handler at `/api/webhooks/stripe/route.ts` is designed for team subscriptions, not individual user subscriptions.

**Lines 63-89:** Expects `teamId` in metadata, updates `teams` table  
**Lines 92-115:** Updates `teams.subscription_status`  
**Lines 118-136:** Downgrades `teams.tier`

**But the checkout API** (`/api/stripe/create-checkout-session/route.ts`) sends `userId` and `plan` in metadata.

This means webhooks will fail silently or throw errors.

---

### 4. **Missing Individual User Webhook Handler**

There's a separate handler at `/api/stripe/webhook/route.ts` but it's not being used. The routes are:

- `/api/webhooks/stripe` (team-based, active)
- `/api/stripe/webhook` (user-based, exists but not wired up)

---

### 5. **Paywall Hook Not Integrated**

The `usePaywall` hook exists but isn't being used anywhere in the codebase!

```bash
# Only referenced in its own file
grep -r "usePaywall" --exclude-dir=node_modules
# Result: Only in hooks/usePaywall.tsx
```

**This means:**

- Paywall UI is built ✅
- Checkout API is built ✅
- But the paywall dialog never appears ❌

---

### 6. **Environment Variable Mismatch**

The checkout API uses `NEXT_PUBLIC_APP_URL`, but it's not set:

```typescript
// app/api/stripe/create-checkout-session/route.ts line 67
success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
```

Should be `NEXT_PUBLIC_BASE_URL` based on other files.

---

## 📋 What Needs to Be Fixed

### Step 1: Align Price Configuration

Update `lib/stripe.ts`:

```typescript
export const STRIPE_CONFIG = {
  plans: {
    free: {
      name: 'Free',
      price: 0,
      features: ['5 prompts per month', 'Basic templates', 'Community support'],
      limits: {
        promptsPerMonth: 5,
        maxPrompts: 10,
        canShare: false,
        canExport: false,
      },
    },
    pro: {
      name: 'Pro',
      price: 29, // Keep original price for UI
      priceId: process.env.STRIPE_PRICE_PRO_MONTHLY_ID!, // Add to .env
      features: [
        'Unlimited prompts',
        'All AI models',
        'Team sharing',
        'Export & API access',
        'Priority support',
      ],
      limits: {
        promptsPerMonth: -1,
        maxPrompts: -1,
        canShare: true,
        canExport: true,
      },
    },
    team: {
      name: 'Team',
      price: 99, // Keep original price for UI
      priceId: process.env.STRIPE_PRICE_TEAM_MONTHLY_ID!, // Add to .env
      features: [
        'Everything in Pro',
        'Up to 10 team members',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
      ],
      limits: {
        promptsPerMonth: -1,
        maxPrompts: -1,
        canShare: true,
        canExport: true,
        teamMembers: 10,
      },
    },
  },
}
```

**OR** align prices to match Stripe ($5 team, $27 enterprise).

---

### Step 2: Create User Subscriptions Webhook Handler

Create or update `/app/api/stripe/webhook/route.ts`:

```typescript
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const stripe = getStripe()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`✅ Received webhook: ${event.type}`)

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleUserCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleUserSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase)
        break

      case 'customer.subscription.deleted':
        await handleUserSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }
}

async function handleUserCheckoutCompleted(session: Stripe.Checkout.Session, supabase: any) {
  const userId = session.metadata?.userId
  const plan = session.metadata?.plan

  if (!userId || !plan) {
    console.error('Missing userId or plan in checkout session metadata')
    return
  }

  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
  const subscriptionId =
    typeof session.subscription === 'string' ? session.subscription : session.subscription?.id

  // Create or update user subscription
  const { error } = await supabase.from('user_subscriptions').upsert({
    user_id: userId,
    plan: plan,
    status: 'active',
    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    updated_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Error updating subscription:', error)
    throw error
  }

  console.log(`✅ Checkout completed for user ${userId}, plan: ${plan}`)
}

async function handleUserSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  const customerId = subscription.customer as string
  const { data: sub } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!sub) return

  const periodEnd = new Date(subscription.current_period_end * 1000).toISOString()

  await supabase
    .from('user_subscriptions')
    .update({
      status: subscription.status,
      current_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  console.log(`✅ Subscription updated for user ${sub.user_id}, status: ${subscription.status}`)
  contingency
}

async function handleUserSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  const customerId = subscription.customer as string

  await supabase
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  console.log(`✅ Subscription canceled for customer ${customerId}`)
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
```

---

### Step 3: Update Checkout API

Update `/app/api/stripe/create-checkout-session/route.ts`:

```typescript
// Line 51: Use the priceId from config
const planConfig = STRIPE_CONFIG.plans[plan as keyof typeof STRIPE_CONFIG.plans]

// Add check for priceId
if (!('priceId' in planConfig) || !planConfig.priceId) {
  return NextResponse.json({ error: 'Plan does not have a price ID configured' }, { status: 400 })
}

// Line 67-68: Use correct env variable
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const checkoutSession = await stripe.checkout.sessions.create({
  // ... existing code ...
  success_url: `${baseUrl}/dashboard?success=true`,
  cancel_url: `${baseUrl}/pricing?canceled=true`,
  // ... existing code ...
})
```

---

### Step 4: Add Paywall Integration

Add paywall to critical flows, e.g., prompt creation:

```typescript
// In a component that creates prompts
import { usePaywall } from '@/hooks/usePaywall'

function CreatePromptButton() {
  const { canCreatePrompt, showPaywall, PaywallComponent } = usePaywall()

  const handleCreate = () => {
    if (!canCreatePrompt) {
      showPaywall()
      return
    }
    // Proceed with creation
  }

  return (
    <>
      <button onClick={handleCreate}>Create Prompt</button>
      {PaywallComponent}
    </>
  )
}
```

---

### Step 5: Environment Variables

Add to `.env.local`:

```bash
# Stripe User Subscriptions (Individual Plans)
STRIPE_PRICE_PRO_MONTHLY_ID=price_XXXXXXXXX  # Create in Stripe Dashboard
STRIPE_PRICE_TEAM_MONTHLY_ID=price_XXXXXXXXX  # Create in Stripe Dashboard

# App URL (webhooks and redirects)
NEXT_PUBLIC_APP_URL=https://promptmanage.com  # Production
# NEXT_PUBLIC_APP_URL=http://localhost:3000    # Local
```

---

### Step 6: Create Products in Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/products
2. Create "Pro" product ($29/month)
3. Create "Team" product ($99/month)
4. Copy Price IDs
5. Add to environment variables
6. Update `lib/stripe.ts` with correct IDs

---

## ✅ Pre-Launch Checklist

### Code

- [ ] Fix price IDs in `lib/stripe.ts`
- [ ] Create user webhook handler
- [ ] Update checkout API to use correct env vars
- [ ] Integrate `usePaywall` hook in key flows
- [ ] Test paywall appears when limits exceeded
- [ ] Test checkout flow end-to-end
- [ ] Test webhook receives events
- [ ] Test subscription updates database

### Stripe Dashboard

- [ ] Create Pro and Team products
- [ ] Copy price central IDs
- [ ] Configure webhook endpoint (`/api/stripe/webhook`)
- [ ] Add webhook signing secret to env
- [ ] Test with Stripe CLI locally

### Database

- [ ] Verify `user_subscriptions` table exists
- [ ] Test subscription insertion
- [ ] Test subscription updates
- [ ] Check RLS policies allow webhook updates

### Testing

- [ ] Free user hits limit
- [ ] Paywall appears
- [ ] Click upgrade → redirects to Stripe
- [ ] Complete checkout with test card
- [ ] Verify database updated
- [ ] Verify user can create more prompts
- [ ] Test subscription cancellation
- [ ] Test payment failure handling

---

## 🚀 Go-Live Order

1. **Staging**
   - Deploy to staging environment
   - Test with Stripe test mode
   - Verify webhooks work

2. **Production Setup**
   - Switch Stripe to live mode
   - Update webhook secret
   - Configure production webhook URL
   - Update pricing page with live prices

3. **Monitor**
   - Watch Stripe Dashboard for events
   - Monitor application logs for errors
   - Check database for successful updates
   - Track subscription signups

---

## 📊 Current Architecture

```
┌─────────────┐
│   User      │
│   clicks    │
│   upgrade   │
└──────┬──────┘
       │
       ▼
┌────────────────────────┐
│  /api/stripe/          │
│  create-checkout-session│ ◄─── Checks user_subscriptions
└──────┬─────────────────┘     Gets price from config
       │
       ▼
┌────────────────────────┐
│  Stripe Checkout       │
│  (hosted page)         │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│  User enters card      │
│  Completes payment     │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│  Stripe webhooks       │
│  /api/stripe/webhook   │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│  Updates               │
│  user_subscriptions    │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│  User can use          │
│  premium features      │
└────────────────────────┘
```

---

## 🎯 Summary

The paywall infrastructure is **75% complete** but has critical gaps:

1. ❌ No working webhook handler for individual users
2. ❌ Price IDs don't exist in Stripe
3. ❌ Paywall hook not integrated into UI
4. ❌ Checkout URL mismatch
5. ✅ Paywall UI built
6. ✅ Checkout API built
7. ✅ Subscription logic built
8. ✅ Database schema ready

**Estimated time to go live:** 4-6 hours of focused work

**Blockers:** None - all fixable with code changes
