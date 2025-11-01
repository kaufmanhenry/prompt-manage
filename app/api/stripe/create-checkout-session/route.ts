import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getStripe } from '@/lib/stripe'
import { STRIPE_CONFIG } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()

    if (!plan || !STRIPE_CONFIG.plans[plan as keyof typeof STRIPE_CONFIG.plans]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Free plan doesn't need checkout
    if (plan === 'free') {
      return NextResponse.json({ error: 'Free plan does not require checkout' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create Stripe customer
    let customer
    let customerId
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', session.user.id)
      .single()

    const stripe = getStripe()

    if (existingSubscription?.stripe_customer_id) {
      customer = await stripe.customers.retrieve(existingSubscription.stripe_customer_id)
      customerId = customer.id
    } else {
      // Normalize email to prevent injection
      const normalizedEmail = session.user.email?.trim().toLowerCase() || undefined
      
      customer = await stripe.customers.create({
        email: normalizedEmail,
        metadata: {
          userId: session.user.id,
        },
      })
      customerId = customer.id

      // Store customer ID in database with conflict resolution
      const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000
      const { error: upsertError } = await supabase
        .from('user_subscriptions')
        .upsert(
          {
            user_id: session.user.id,
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
    const planConfig = STRIPE_CONFIG.plans[plan as keyof typeof STRIPE_CONFIG.plans]
    const priceId = 'priceId' in planConfig ? planConfig.priceId : null

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
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
