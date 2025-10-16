import { headers } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

import { stripe } from '@/lib/stripe/client'
import { createServerSideClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

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

  console.log(`✅ Received webhook: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const supabase = createServerSideClient()
  const userId = session.metadata?.userId

  if (!userId) {
    console.error('No userId in checkout session metadata')
    return
  }

  const tier = session.metadata?.tier || 'team'

  // Update user profile with subscription info
  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id

  await supabase
    .from('user_profiles')
    .update({
      stripe_customer_id: customerId,
      subscription_tier: tier,
      subscription_status: 'active',
    })
    .eq('id', userId)

  console.log(`✅ Checkout completed for user ${userId}, tier: ${tier}`)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const supabase = createServerSideClient()
  const userId = subscription.metadata.userId

  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  const periodEnd = new Date(subscription.current_period_end * 1000)

  await supabase
    .from('user_profiles')
    .update({
      subscription_status: subscription.status,
      subscription_period_end: periodEnd.toISOString(),
      subscription_tier: subscription.metadata.tier || 'team',
    })
    .eq('id', userId)

  console.log(`✅ Subscription updated for user ${userId}, status: ${subscription.status}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const supabase = createServerSideClient()
  const userId = subscription.metadata.userId

  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  // Downgrade to free tier
  await supabase
    .from('user_profiles')
    .update({
      subscription_tier: 'free',
      subscription_status: 'canceled',
    })
    .eq('id', userId)

  console.log(`✅ Subscription canceled for user ${userId}`)
}

async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  console.log(`✅ Invoice paid: ${invoice.id}, amount: $${(invoice.amount_paid / 100).toFixed(2)}`)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const supabase = createServerSideClient()

  if (!invoice.subscription) return

  const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const userId = subscription.metadata.userId

  if (!userId) return

  await supabase
    .from('user_profiles')
    .update({
      subscription_status: 'past_due',
    })
    .eq('id', userId)

  console.log(`❌ Payment failed for user ${userId}`)
}

// Required for webhooks to work with raw body
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

