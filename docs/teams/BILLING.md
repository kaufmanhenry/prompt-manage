# Teams Billing & Monetization - Stripe Integration

**Enterprise Subscription Management for Teams Feature**

---

## Table of Contents

1. [Pricing Strategy](#pricing-strategy)
2. [Stripe Setup](#stripe-setup)
3. [Subscription Management](#subscription-management)
4. [Webhook Handling](#webhook-handling)
5. [Usage-Based Billing](#usage-based-billing)
6. [Invoice & Payment Management](#invoice--payment-management)
7. [Customer Portal](#customer-portal)

---

## Pricing Strategy

### Tier Structure

```typescript
// lib/billing/tiers.ts
export const PRICING_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    interval: null,
    features: {
      maxMembers: 3,
      maxStorageGB: 1,
      prompts: 10,
      datasets: 0,
      apiAccess: false,
      priority Support: false,
      sso: false,
      customRoles: false,
      auditLogs: false
    },
    limits: {
      tokensPerMonth: 10000,
      promptsPerMonth: 100
    }
  },
  pro: {
    name: 'Pro',
    price: 29,
    interval: 'month',
    stripeProductId: process.env.STRIPE_PRODUCT_PRO_ID!,
    stripePriceId: process.env.STRIPE_PRICE_PRO_MONTHLY_ID!,
    features: {
      maxMembers: 10,
      maxStorageGB: 10,
      prompts: 'unlimited',
      datasets: 'unlimited',
      apiAccess: true,
      prioritySupport: true,
      sso: false,
      customRoles: false,
      auditLogs: true
    },
    limits: {
      tokensPerMonth: 1000000, // 1M tokens
      promptsPerMonth: 'unlimited'
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: null, // Custom pricing
    interval: 'month',
    stripeProductId: process.env.STRIPE_PRODUCT_ENTERPRISE_ID!,
    features: {
      maxMembers: 'unlimited',
      maxStorageGB: 'unlimited',
      prompts: 'unlimited',
      datasets: 'unlimited',
      apiAccess: true,
      prioritySupport: true,
      sso: true,
      customRoles: true,
      auditLogs: true,
      dedicatedSupport: true,
      sla: '99.9%'
    },
    limits: {
      tokensPerMonth: 'unlimited',
      promptsPerMonth: 'unlimited'
    }
  }
} as const

export type TeamTier = keyof typeof PRICING_TIERS

// Per-seat pricing for Pro and Enterprise
export const SEAT_PRICING = {
  pro: {
    basePricePerMonth: 29,
    additionalSeatPrice: 10, // $10 per additional seat beyond base
    baseSeats: 10
  },
  enterprise: {
    basePricePerMonth: null, // Custom
    additionalSeatPrice: null, // Negotiated
    baseSeats: 'unlimited'
  }
}
```

---

## Stripe Setup

### 1. Environment Configuration

```bash
# .env.local
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Product IDs (create in Stripe Dashboard)
STRIPE_PRODUCT_PRO_ID=prod_...
STRIPE_PRICE_PRO_MONTHLY_ID=price_...
STRIPE_PRICE_PRO_YEARLY_ID=price_... # 20% discount
STRIPE_PRODUCT_ENTERPRISE_ID=prod_...
```

### 2. Stripe Client Initialization

```typescript
// lib/stripe/client.ts
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
  appInfo: {
    name: 'Prompt Manage',
    version: '1.0.0',
  },
})

// Helper to get publishable key for client-side
export function getStripePublishableKey(): string {
  return process.env.STRIPE_PUBLISHABLE_KEY!
}
```

### 3. Create Products in Stripe

```typescript
// scripts/setup-stripe-products.ts
import { stripe } from '../lib/stripe/client'

async function setupStripeProducts() {
  // Create Pro product
  const proProduct = await stripe.products.create({
    name: 'Prompt Manage Pro',
    description: 'Professional team collaboration for AI workflows',
    metadata: {
      tier: 'pro',
    },
  })

  // Create Pro monthly price
  const proMonthlyPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 2900, // $29.00
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
    metadata: {
      tier: 'pro',
      interval: 'month',
    },
  })

  // Create Pro yearly price (20% discount)
  const proYearlyPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 27840, // $278.40 (20% off $348)
    currency: 'usd',
    recurring: {
      interval: 'year',
    },
    metadata: {
      tier: 'pro',
      interval: 'year',
    },
  })

  // Create additional seat price
  const seatPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 1000, // $10.00 per seat
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
    metadata: {
      type: 'seat',
      tier: 'pro',
    },
  })

  console.log('Stripe products created:', {
    proProduct: proProduct.id,
    proMonthlyPrice: proMonthlyPrice.id,
    proYearlyPrice: proYearlyPrice.id,
    seatPrice: seatPrice.id,
  })
}

setupStripeProducts()
```

---

## Subscription Management

### 1. Create Checkout Session

```typescript
// lib/stripe/checkout.ts
import { stripe } from './client'
import { PRICING_TIERS } from '../billing/tiers'

export interface CheckoutSessionParams {
  teamId: string
  customerId?: string
  tier: 'pro' | 'enterprise'
  interval: 'month' | 'year'
  seats?: number
  successUrl: string
  cancelUrl: string
}

export async function createCheckoutSession(
  params: CheckoutSessionParams,
): Promise<Stripe.Checkout.Session> {
  const { teamId, customerId, tier, interval, seats = 10, successUrl, cancelUrl } = params

  const tierConfig = PRICING_TIERS[tier]
  const priceId =
    interval === 'month'
      ? process.env.STRIPE_PRICE_PRO_MONTHLY_ID
      : process.env.STRIPE_PRICE_PRO_YEARLY_ID

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price: priceId,
      quantity: 1,
    },
  ]

  // Add additional seats if needed
  if (seats > 10) {
    lineItems.push({
      price: process.env.STRIPE_PRICE_SEAT_ID,
      quantity: seats - 10, // Only charge for seats beyond base 10
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      teamId,
      tier,
      seats: seats.toString(),
    },
    subscription_data: {
      metadata: {
        teamId,
        tier,
      },
      trial_period_days: 14, // 14-day free trial
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    tax_id_collection: {
      enabled: true,
    },
  })

  return session
}
```

### 2. API Endpoint: Create Checkout

```typescript
// app/api/v1/teams/[id]/billing/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/middleware/auth'
import { checkPermission } from '@/lib/middleware/permissions'
import { createCheckoutSession } from '@/lib/stripe/checkout'
import { z } from 'zod'

const checkoutSchema = z.object({
  tier: z.enum(['pro', 'enterprise']),
  interval: z.enum(['month', 'year']),
  seats: z.number().min(1).optional(),
})

export const POST = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id

  // Check if user is owner
  const isOwner = await checkPermission(teamId, user.id, {
    resourceType: 'team_settings',
    action: 'manage_billing',
  })

  if (!isOwner) {
    return NextResponse.json({ error: 'Only owners can manage billing' }, { status: 403 })
  }

  const body = await req.json()
  const validated = checkoutSchema.parse(body)

  // Get or create Stripe customer
  const { data: billing } = await supabase
    .from('team_billing')
    .select('stripe_customer_id')
    .eq('team_id', teamId)
    .single()

  let customerId = billing?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        teamId,
        userId: user.id,
      },
    })
    customerId = customer.id

    // Update billing record
    await supabase
      .from('team_billing')
      .update({ stripe_customer_id: customerId })
      .eq('team_id', teamId)
  }

  // Create checkout session
  const session = await createCheckoutSession({
    teamId,
    customerId,
    tier: validated.tier,
    interval: validated.interval,
    seats: validated.seats,
    successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/teams/${teamId}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/teams/${teamId}/billing`,
  })

  return NextResponse.json({ checkoutUrl: session.url })
})
```

### 3. Handle Subscription Changes

```typescript
// lib/stripe/subscription.ts
import { stripe } from './client'
import { createClient } from '@/utils/supabase/server'

export async function updateSubscription(
  subscriptionId: string,
  updates: {
    seats?: number
    tier?: 'pro' | 'enterprise'
  },
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Update seat count
  if (updates.seats !== undefined) {
    const seatItem = subscription.items.data.find((item) => item.price.metadata.type === 'seat')

    if (seatItem) {
      await stripe.subscriptionItems.update(seatItem.id, {
        quantity: Math.max(0, updates.seats - 10), // Only charge for seats beyond base
      })
    } else if (updates.seats > 10) {
      // Add seat item if not exists
      await stripe.subscriptionItems.create({
        subscription: subscriptionId,
        price: process.env.STRIPE_PRICE_SEAT_ID!,
        quantity: updates.seats - 10,
      })
    }
  }

  // Prorate by default
  return await stripe.subscriptions.update(subscriptionId, {
    proration_behavior: 'create_prorations',
    metadata: updates,
  })
}

export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false,
): Promise<Stripe.Subscription> {
  if (immediately) {
    return await stripe.subscriptions.cancel(subscriptionId)
  } else {
    // Cancel at period end
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })
  }
}

export async function reactivateSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })
}
```

---

## Webhook Handling

### 1. Webhook Endpoint

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { headers } from 'next/headers'
import { handleStripeWebhook } from '@/lib/stripe/webhooks'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

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

  try {
    await handleStripeWebhook(event)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }
}
```

### 2. Webhook Event Handlers

```typescript
// lib/stripe/webhooks.ts
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'
import { auditLog } from '@/lib/audit'

export async function handleStripeWebhook(event: Stripe.Event): Promise<void> {
  console.log(`Received webhook: ${event.type}`)

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
      break

    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
      break

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
      break

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
      break

    case 'invoice.paid':
      await handleInvoicePaid(event.data.object as Stripe.Invoice)
      break

    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const supabase = await createClient()
  const teamId = session.metadata?.teamId

  if (!teamId) {
    console.error('No teamId in checkout session metadata')
    return
  }

  // Update team billing record
  await supabase
    .from('team_billing')
    .update({
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      payment_status: 'active',
      last_payment_at: new Date().toISOString(),
    })
    .eq('team_id', teamId)

  // Update team tier
  const tier = session.metadata?.tier || 'pro'
  await supabase
    .from('teams')
    .update({
      tier,
      max_members: tier === 'pro' ? 10 : 999999,
    })
    .eq('id', teamId)

  // Log activity
  await auditLog({
    teamId,
    action: 'subscription_activated',
    metadata: {
      tier,
      subscriptionId: session.subscription,
    },
  })
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  const supabase = await createClient()
  const teamId = subscription.metadata.teamId

  if (!teamId) return

  const periodStart = new Date(subscription.current_period_start * 1000)
  const periodEnd = new Date(subscription.current_period_end * 1000)

  await supabase
    .from('team_billing')
    .update({
      stripe_subscription_id: subscription.id,
      billing_period_start: periodStart.toISOString(),
      billing_period_end: periodEnd.toISOString(),
      payment_status: subscription.status,
      current_tier: subscription.metadata.tier || 'pro',
    })
    .eq('team_id', teamId)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const supabase = await createClient()
  const teamId = subscription.metadata.teamId

  if (!teamId) return

  const periodEnd = new Date(subscription.current_period_end * 1000)

  await supabase
    .from('team_billing')
    .update({
      payment_status: subscription.status,
      billing_period_end: periodEnd.toISOString(),
      next_billing_date: periodEnd.toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  // Handle cancellation scheduled for period end
  if (subscription.cancel_at_period_end) {
    await auditLog({
      teamId,
      action: 'subscription_cancellation_scheduled',
      metadata: {
        cancelAt: periodEnd.toISOString(),
      },
    })
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const supabase = await createClient()
  const teamId = subscription.metadata.teamId

  if (!teamId) return

  // Downgrade to free tier
  await supabase
    .from('teams')
    .update({
      tier: 'free',
      max_members: 3,
    })
    .eq('id', teamId)

  await supabase
    .from('team_billing')
    .update({
      payment_status: 'canceled',
      stripe_subscription_id: null,
    })
    .eq('team_id', teamId)

  await auditLog({
    teamId,
    action: 'subscription_canceled',
    metadata: {
      reason: 'stripe_subscription_deleted',
    },
  })
}

async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const supabase = await createClient()

  if (!invoice.subscription) return

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
  const teamId = subscription.metadata.teamId

  if (!teamId) return

  await supabase
    .from('team_billing')
    .update({
      last_payment_at: new Date().toISOString(),
      last_payment_amount: (invoice.amount_paid / 100).toFixed(2),
      payment_status: 'active',
      current_period_cost: 0, // Reset for new period
    })
    .eq('team_id', teamId)

  await auditLog({
    teamId,
    action: 'invoice_paid',
    metadata: {
      invoiceId: invoice.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
    },
  })
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const supabase = await createClient()

  if (!invoice.subscription) return

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
  const teamId = subscription.metadata.teamId

  if (!teamId) return

  await supabase
    .from('team_billing')
    .update({
      payment_status: 'past_due',
    })
    .eq('team_id', teamId)

  // Send alert to team owner
  await sendPaymentFailedAlert(teamId, invoice)

  await auditLog({
    teamId,
    action: 'payment_failed',
    metadata: {
      invoiceId: invoice.id,
      amount: invoice.amount_due / 100,
      attemptCount: invoice.attempt_count,
    },
  })
}
```

---

## Usage-Based Billing

### 1. Track Token Usage

```typescript
// lib/billing/usage-tracking.ts
import { createClient } from '@/utils/supabase/server'

export interface UsageEvent {
  teamId: string
  userId: string
  resourceType: 'prompt_run' | 'dataset_upload' | 'agent_generation'
  tokensUsed?: number
  costUsd?: number
  model?: string
  metadata?: Record<string, any>
}

export async function trackUsage(event: UsageEvent): Promise<void> {
  const supabase = await createClient()

  // Insert usage log
  const { error } = await supabase.from('team_usage_logs').insert({
    team_id: event.teamId,
    user_id: event.userId,
    resource_type: event.resourceType,
    tokens_used: event.tokensUsed,
    cost_usd: event.costUsd,
    model: event.model,
    metadata: event.metadata,
  })

  if (error) {
    console.error('Failed to track usage:', error)
  }

  // Update current period cost
  if (event.costUsd) {
    await supabase.rpc('increment_team_cost', {
      p_team_id: event.teamId,
      p_cost: event.costUsd,
    })
  }
}

// Calculate cost based on model and tokens
export function calculateCost(model: string, tokensUsed: number): number {
  const pricing = {
    'gpt-4o': { input: 2.5 / 1000000, output: 10 / 1000000 },
    'gpt-4o-mini': { input: 0.15 / 1000000, output: 0.6 / 1000000 },
    'gpt-4-turbo': { input: 10 / 1000000, output: 30 / 1000000 },
    'claude-3-5-sonnet': { input: 3 / 1000000, output: 15 / 1000000 },
  }

  const modelPricing = pricing[model as keyof typeof pricing] || pricing['gpt-4o-mini']
  // Assume 50/50 split for input/output
  const cost = (tokensUsed * (modelPricing.input + modelPricing.output)) / 2

  return parseFloat(cost.toFixed(6))
}
```

### 2. Usage-Based Alerts

```typescript
// lib/billing/alerts.ts
import { createClient } from '@/utils/supabase/server'
import { sendEmail } from '@/lib/email'

export async function checkSpendingLimits(teamId: string): Promise<void> {
  const supabase = await createClient()

  const { data: billing } = await supabase
    .from('team_billing')
    .select('*')
    .eq('team_id', teamId)
    .single()

  if (!billing) return

  // Check if approaching limit
  if (billing.spending_limit && billing.current_period_cost >= billing.spending_limit * 0.8) {
    await sendSpendingAlert(teamId, {
      current: billing.current_period_cost,
      limit: billing.spending_limit,
      percentage: (billing.current_period_cost / billing.spending_limit) * 100,
    })
  }

  // Check if limit exceeded
  if (billing.spending_limit && billing.current_period_cost >= billing.spending_limit) {
    await disableTeamUsage(teamId)
    await sendLimitExceededAlert(teamId)
  }
}

async function sendSpendingAlert(
  teamId: string,
  data: { current: number; limit: number; percentage: number },
): Promise<void> {
  // Get team owners
  const supabase = await createClient()
  const { data: owners } = await supabase
    .from('team_members')
    .select('users(email)')
    .eq('team_id', teamId)
    .eq('role', 'owner')

  for (const owner of owners || []) {
    await sendEmail({
      to: owner.users.email,
      subject: 'Spending Alert: Approaching Limit',
      template: 'spending-alert',
      data,
    })
  }
}
```

---

## Customer Portal

### 1. Create Portal Session

```typescript
// lib/stripe/portal.ts
import { stripe } from './client'

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string,
): Promise<Stripe.BillingPortal.Session> {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}
```

### 2. API Endpoint

```typescript
// app/api/v1/teams/[id]/billing/portal/route.ts
export const POST = withAuth(async (req: NextRequest, { params, user }) => {
  const teamId = params.id
  const supabase = await createClient()

  // Check if owner
  const isOwner = await checkPermission(teamId, user.id, {
    resourceType: 'team_settings',
    action: 'manage_billing',
  })

  if (!isOwner) {
    return NextResponse.json({ error: 'Only owners can access billing portal' }, { status: 403 })
  }

  const { data: billing } = await supabase
    .from('team_billing')
    .select('stripe_customer_id')
    .eq('team_id', teamId)
    .single()

  if (!billing?.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
  }

  const session = await createBillingPortalSession(
    billing.stripe_customer_id,
    `${process.env.NEXT_PUBLIC_BASE_URL}/teams/${teamId}/billing`,
  )

  return NextResponse.json({ url: session.url })
})
```

---

## Summary

### Billing Features Implemented

✅ **Subscription Management**

- Tiered pricing (Free, Pro, Enterprise)
- Per-seat pricing
- Stripe Checkout integration
- Trial periods (14 days)
- Proration on upgrades/downgrades

✅ **Webhook Processing**

- Subscription lifecycle events
- Payment success/failure handling
- Automatic tier updates
- Audit logging

✅ **Usage Tracking**

- Token-based metering
- Cost calculation per model
- Usage limits enforcement
- Spending alerts

✅ **Customer Portal**

- Self-service billing management
- Invoice history
- Payment method updates
- Subscription cancellation

### Next Steps

Continue to [SCALING.md](#) for performance optimization and scaling strategy.
