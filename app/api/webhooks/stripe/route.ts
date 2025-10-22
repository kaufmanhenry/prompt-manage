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
  const teamId = session.metadata?.teamId

  if (!teamId) {
    console.error('No teamId in checkout session metadata')
    return
  }

  const tier = session.metadata?.tier || 'pro'

  // Update team with subscription info
  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
  const subscriptionId =
    typeof session.subscription === 'string' ? session.subscription : session.subscription?.id

  await supabase
    .from('teams')
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      tier: tier,
      subscription_status: 'active',
    })
    .eq('id', teamId)

  console.log(`✅ Checkout completed for team ${teamId}, tier: ${tier}`)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const supabase = createServerSideClient()
  const teamId = subscription.metadata?.teamId

  if (!teamId) {
    console.error('No teamId in subscription metadata')
    return
  }

  const periodEnd = new Date(
    (subscription as Stripe.Subscription & { current_period_end: number }).current_period_end *
      1000,
  )

  await supabase
    .from('teams')
    .update({
      subscription_status: subscription.status,
      subscription_period_end: periodEnd.toISOString(),
      tier: subscription.metadata?.tier || 'pro',
    })
    .eq('id', teamId)

  console.log(`✅ Subscription updated for team ${teamId}, status: ${subscription.status}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const supabase = createServerSideClient()
  const teamId = subscription.metadata?.teamId

  if (!teamId) {
    console.error('No teamId in subscription metadata')
    return
  }

  // Downgrade to free tier
  await supabase
    .from('teams')
    .update({
      tier: 'free',
      subscription_status: 'canceled',
    })
    .eq('id', teamId)

  console.log(`✅ Subscription canceled for team ${teamId}`)
}

async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  console.log(`✅ Invoice paid: ${invoice.id}, amount: $${(invoice.amount_paid / 100).toFixed(2)}`)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const supabase = createServerSideClient()

  const subscriptionId = (invoice as Stripe.Invoice & { subscription: string }).subscription
  if (!subscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const teamId = subscription.metadata?.teamId

  if (!teamId) return

  await supabase
    .from('teams')
    .update({
      subscription_status: 'past_due',
    })
    .eq('id', teamId)

  console.log(`❌ Payment failed for team ${teamId}`)
}

// Required for webhooks to work with raw body
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
