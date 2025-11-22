# Stripe Integration Implementation Guide

## Current Status: NOT IMPLEMENTED

**Last Updated:** January 16, 2025

---

## 📊 Audit Summary

### ✅ Ready

- Database schema (teams table has Stripe fields)
- Pricing structure defined ($20 Team, $99 Pro)
- Documentation exists (docs/teams/BILLING.md)

### ❌ Not Implemented

- Stripe npm package not installed
- No environment variables configured
- No Stripe client code
- No API routes for billing
- No webhook handlers
- No frontend checkout flow

---

## 🚀 Implementation Steps

### Step 1: Install Stripe SDK

```bash
npm install stripe @stripe/stripe-js
```

**Files to create after install:**

- `lib/stripe/client.ts` - Server-side Stripe client
- `lib/stripe/config.ts` - Stripe configuration

---

### Step 2: Environment Variables

Create `.env.local` in project root:

```bash
# Stripe Keys (from your Stripe Dashboard)
STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_...
STRIPE_SECRET_KEY=sk_test_...      # or sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...    # Get from Stripe webhook settings

# Product & Price IDs (create these in Stripe Dashboard first)
STRIPE_PRODUCT_TEAM_ID=prod_...
STRIPE_PRICE_TEAM_MONTHLY_ID=price_...
STRIPE_PRICE_TEAM_YEARLY_ID=price_...

STRIPE_PRODUCT_PRO_ID=prod_...
STRIPE_PRICE_PRO_MONTHLY_ID=price_...
STRIPE_PRICE_PRO_YEARLY_ID=price_...

# Base URL for redirects
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**⚠️ Important:**

- Never commit `.env.local` to git
- Add to `.gitignore` if not already there
- Use test keys for development

---

### Step 3: Create Stripe Products in Dashboard

**Option A: Via Stripe Dashboard (Recommended for first time)**

1. Go to https://dashboard.stripe.com/test/products
2. Click "Create product"
3. Create two products:
   - **Product 1:** "Prompt Manage Team"
     - Price: $20/month
     - Recurring: Monthly
     - Copy Product ID → `STRIPE_PRODUCT_TEAM_ID`
     - Copy Price ID → `STRIPE_PRICE_TEAM_MONTHLY_ID`
   - **Product 2:** "Prompt Manage Pro"
     - Price: $99/month
     - Recurring: Monthly
     - Copy Product ID → `STRIPE_PRODUCT_PRO_ID`
     - Copy Price ID → `STRIPE_PRICE_PRO_MONTHLY_ID`

**Option B: Via API (for automation)**

```bash
npm run stripe:setup-products
```

(Script to be created in Step 4)

---

### Step 4: Required Files to Create

#### A. Stripe Client (`lib/stripe/client.ts`)

```typescript
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
  appInfo: {
    name: 'Prompt Manage',
    version: '1.0.0',
  },
})

export const config = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
  products: {
    team: {
      productId: process.env.STRIPE_PRODUCT_TEAM_ID!,
      monthlyPriceId: process.env.STRIPE_PRICE_TEAM_MONTHLY_ID!,
      yearlyPriceId: process.env.STRIPE_PRICE_TEAM_YEARLY_ID,
    },
    enterprise: {
      productId: process.env.STRIPE_PRODUCT_ENTERPRISE_ID!,
      monthlyPriceId: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY_ID!,
      yearlyPriceId: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY_ID,
    },
  },
}
```

#### B. Webhook Handler (`app/api/webhooks/stripe/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Received webhook:', event.type)

  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful checkout
      break
    case 'customer.subscription.created':
      // Handle new subscription
      break
    case 'customer.subscription.updated':
      // Handle subscription changes
      break
    case 'customer.subscription.deleted':
      // Handle cancellation
      break
    case 'invoice.paid':
      // Handle successful payment
      break
    case 'invoice.payment_failed':
      // Handle failed payment
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

// Disable body parsing for webhooks
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
```

#### C. Checkout API (`app/api/billing/create-checkout/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe, config } from '@/lib/stripe/client'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tier, interval = 'month' } = await req.json()

    if (!['team', 'enterprise'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    // Get or create Stripe customer
    let customerId: string | undefined

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID
      await supabase.from('user_profiles').upsert({
        id: user.id,
        stripe_customer_id: customerId,
      })
    }

    // Get price ID
    const priceId =
      interval === 'year'
        ? config.products[tier].yearlyPriceId
        : config.products[tier].monthlyPriceId

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: {
        userId: user.id,
        tier,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          tier,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
```

#### D. Billing Portal API (`app/api/billing/portal/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 })
  }
}
```

---

### Step 5: Update Database Schema

**Add to user_profiles table:**

```sql
-- Add Stripe customer ID to user_profiles
alter table public.user_profiles
add column if not exists stripe_customer_id text unique,
add column if not exists subscription_tier text default 'free',
add column if not exists subscription_status text,
add column if not exists subscription_period_end timestamptz;

create index if not exists user_profiles_stripe_customer_idx
  on public.user_profiles (stripe_customer_id)
  where stripe_customer_id is not null;
```

Run migration:

```bash
# Create new migration file
supabase migration new add_stripe_to_user_profiles

# Add the SQL above to the new migration file
# Then run:
npx supabase db push
```

---

### Step 6: Update Pricing Page

Replace "Coming Soon" buttons with actual checkout:

```typescript
// app/pricing/page.tsx (update Team plan button)
const handleSubscribe = async (tier: 'team' | 'enterprise') => {
  try {
    const response = await fetch('/api/billing/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, interval: 'month' }),
    })

    const { url } = await response.json()
    if (url) {
      window.location.href = url
    }
  } catch (error) {
    console.error('Checkout error:', error)
  }
}

// Replace disabled button with:
<Button
  size="lg"
  className="w-full"
  onClick={() => handleSubscribe('team')}
>
  Subscribe Now
</Button>
```

---

### Step 7: Stripe Webhook Configuration

**In Stripe Dashboard:**

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Set URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

**For local testing:**

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 🧪 Testing Checklist

### Development Testing

- [ ] Install Stripe package
- [ ] Set up environment variables
- [ ] Create products in Stripe Dashboard
- [ ] Update database schema
- [ ] Create all API routes
- [ ] Test checkout flow
- [ ] Test webhook locally with Stripe CLI
- [ ] Test billing portal
- [ ] Test subscription cancellation

### Production Testing

- [ ] Use live Stripe keys
- [ ] Configure production webhook endpoint
- [ ] Test real card payments (use test mode first)
- [ ] Monitor webhook delivery
- [ ] Test refunds and disputes
- [ ] Set up billing alerts

---

## 📊 Pricing Configuration

### Current Tiers (from your pricing page):

1. **Free**: $0/month
   - 25 prompts max
   - Cannot run prompts
   - Public sharing only

2. **Team**: $20/month
   - Unlimited prompts and runs
   - Full Prompt Lab access
   - Up to 5 team members
   - Shared libraries
   - Role-based access

3. **Pro**: $99/month
   - Everything in Team
   - Up to 25 team members
   - Advanced security
   - Priority support
   - SSO (future)

---

## 🔐 Security Considerations

1. **Never expose secret keys**
   - Use environment variables
   - Never commit `.env.local`
   - Use different keys for dev/production

2. **Verify webhook signatures**
   - Always verify `stripe-signature` header
   - Protects against fake webhooks

3. **Validate amounts**
   - Check subscription amounts match expected prices
   - Prevent pricing manipulation

4. **Rate limiting**
   - Limit checkout session creation
   - Prevent abuse

---

## 📞 Next Steps

1. **Immediate:** Install Stripe package

   ```bash
   npm install stripe @stripe/stripe-js
   ```

2. **Configuration:** Add environment variables to `.env.local`

3. **Stripe Dashboard:** Create products and prices

4. **Code:** Create the required API files listed above

5. **Database:** Run migration to add Stripe fields

6. **Testing:** Use Stripe CLI to test webhooks locally

7. **Go Live:** Switch to live keys when ready

---

## 🆘 Support Resources

- Stripe Dashboard: https://dashboard.stripe.com
- Stripe Docs: https://stripe.com/docs
- Stripe API Reference: https://stripe.com/docs/api
- Test Cards: https://stripe.com/docs/testing
- Webhook Testing: https://stripe.com/docs/webhooks/test

---

**Status:** Ready to implement
**Estimated Time:** 2-4 hours for full implementation
**Complexity:** Medium
