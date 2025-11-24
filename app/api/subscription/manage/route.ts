import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getStripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { action, plan } = await request.json()

    if (!action || !['upgrade', 'downgrade', 'cancel'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current subscription
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('stripe_subscription_id, stripe_customer_id, plan')
      .eq('user_id', session.user.id)
      .maybeSingle()

    const stripe = getStripe()

    switch (action) {
      case 'upgrade': {
        if (!plan || !['team', 'pro'].includes(plan)) {
          return NextResponse.json({ error: 'Invalid plan for upgrade' }, { status: 400 })
        }

        // If user already has a subscription, update it
        if (subscription?.stripe_subscription_id) {
          // Get Price ID from server-side config
          const { getStripePriceId } = await import('@/lib/pricing-server')
          const newPriceId = getStripePriceId(plan as 'team' | 'pro')

          // Update subscription in Stripe
          await stripe.subscriptions.update(subscription.stripe_subscription_id, {
            items: [
              {
                id: (await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)).items
                  .data[0].id,
                price: newPriceId,
              },
            ],
            metadata: {
              userId: session.user.id,
              plan,
            },
            proration_behavior: 'always_invoice', // Charge immediately for upgrade
          })

          return NextResponse.json({
            success: true,
            message: 'Subscription upgraded successfully',
          })
        }

        // If no subscription, redirect to checkout
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL ||
          process.env.NEXT_PUBLIC_APP_URL ||
          'http://localhost:3000'

        const { getStripePriceId } = await import('@/lib/pricing-server')
        const priceId = getStripePriceId(plan as 'team' | 'pro')

        // Get or create customer
        let customerId = subscription?.stripe_customer_id
        if (!customerId) {
          const normalizedEmail = session.user.email?.trim().toLowerCase() || undefined
          const customer = await stripe.customers.create({
            email: normalizedEmail,
            metadata: {
              userId: session.user.id,
            },
          })
          customerId = customer.id

          // Store customer ID
          await supabase.from('user_subscriptions').upsert(
            {
              user_id: session.user.id,
              plan: 'free',
              status: 'active',
              current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              stripe_customer_id: customerId,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' },
          )
        }

        // Create checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: `${baseUrl}/settings/team?checkout=success`,
          cancel_url: `${baseUrl}/settings/team?checkout=canceled`,
          metadata: {
            userId: session.user.id,
            plan,
          },
          subscription_data: {
            metadata: {
              userId: session.user.id,
              plan,
            },
          },
        })

        return NextResponse.json({ url: checkoutSession.url })
      }

      case 'downgrade': {
        if (!plan || plan !== 'free') {
          return NextResponse.json({ error: 'Can only downgrade to free plan' }, { status: 400 })
        }

        if (!subscription?.stripe_subscription_id) {
          return NextResponse.json(
            { error: 'No active subscription to downgrade' },
            { status: 400 },
          )
        }

        // Cancel subscription immediately (user keeps access until period end)
        await stripe.subscriptions.cancel(subscription.stripe_subscription_id)

        // Update database
        await supabase
          .from('user_subscriptions')
          .update({
            plan: 'free',
            status: 'canceled',
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', session.user.id)

        return NextResponse.json({
          success: true,
          message: 'Subscription downgraded to free plan',
        })
      }

      case 'cancel': {
        if (!subscription?.stripe_subscription_id) {
          return NextResponse.json({ error: 'No active subscription to cancel' }, { status: 400 })
        }

        // Cancel at period end (user keeps access until then)
        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: true,
        })

        return NextResponse.json({
          success: true,
          message: 'Subscription will be canceled at the end of the billing period',
        })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Subscription management error:', error)
    }
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message
            : 'Internal server error',
      },
      { status: 500 },
    )
  }
}
