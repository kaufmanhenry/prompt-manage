import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import type { PlanType } from '@/lib/pricing'
import { PRICING_CONFIG } from '@/lib/pricing'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()

    if (!plan || !PRICING_CONFIG[plan as PlanType]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Free plan doesn't need checkout
    if (plan === 'free') {
      return NextResponse.json({ error: 'Free plan does not require checkout' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log('Checkout session unauthorized: No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Creating checkout session for user:', user.id)

    // Get or create Stripe customer
    let customer
    let customerId
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    const stripe = getStripe()

    if (existingSubscription?.stripe_customer_id) {
      customer = await stripe.customers.retrieve(existingSubscription.stripe_customer_id)
      customerId = customer.id
    } else {
      // Normalize email to prevent injection
      const normalizedEmail = user.email?.trim().toLowerCase() || undefined

      customer = await stripe.customers.create({
        email: normalizedEmail,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Store customer ID in database with conflict resolution
      const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000
      const { error: upsertError } = await supabase.from('user_subscriptions').upsert(
        {
          user_id: user.id,
          plan: 'free',
          status: 'active',
          current_period_end: new Date(Date.now() + ONE_YEAR_MS).toISOString(),
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        },
      )

      if (upsertError) {
        console.error('Error storing customer ID:', upsertError)
        // Continue anyway - customer created in Stripe
      }
    }

    // Create checkout session
    const planConfig = PRICING_CONFIG[plan as PlanType]
    const priceId = planConfig.stripePriceId || null

    if (!priceId || priceId === '') {
      return NextResponse.json(
        {
          error:
            'Plan does not have a price ID configured. Please add Stripe price IDs to environment variables.',
        },
        { status: 400 },
      )
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

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
      success_url: `${baseUrl}/dashboard?checkout=success`,
      cancel_url: `${baseUrl}/pricing?checkout=canceled`,
      metadata: {
        userId: user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          plan,
        },
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
