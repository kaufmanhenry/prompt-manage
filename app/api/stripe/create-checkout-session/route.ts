import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { validateEnvironmentVariables } from '@/lib/env-validation'
import type { PlanType } from '@/lib/pricing'
import { PRICING_CONFIG } from '@/lib/pricing'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables before proceeding
    const envValidation = validateEnvironmentVariables()
    if (!envValidation.isValid) {
      console.error('[Checkout] Missing required environment variables:', envValidation.missing)
      return NextResponse.json(
        {
          error: 'Server configuration error',
          details: 'Missing required payment configuration. Please contact support.',
        },
        { status: 500 },
      )
    }

    const { plan } = await request.json()

    if (!plan || !PRICING_CONFIG[plan as PlanType]) {
      console.error('[Checkout] Invalid plan received:', plan)
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Free plan doesn't need checkout
    if (plan === 'free') {
      console.error('[Checkout] Attempted to checkout free plan')
      return NextResponse.json({ error: 'Free plan does not require checkout' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (!user || authError) {
      console.error('[Checkout] Authentication failed:', authError?.message || 'No user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Checkout] Processing checkout for user:', user.id, 'plan:', plan)

    // Get or create Stripe customer
    let customer
    let customerId
    const { data: existingSubscription, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      // PGRST116 is "not found" which is expected for new users
      console.error('[Checkout] Database error fetching subscription:', subscriptionError)
    }

    const stripe = getStripe()

    if (existingSubscription?.stripe_customer_id) {
      console.log(
        '[Checkout] Found existing Stripe customer:',
        existingSubscription.stripe_customer_id,
      )
      try {
        customer = await stripe.customers.retrieve(existingSubscription.stripe_customer_id)
        customerId = customer.id
      } catch (stripeError) {
        console.error('[Checkout] Error retrieving Stripe customer:', stripeError)
        throw new Error('Failed to retrieve Stripe customer. Please try again.')
      }
    } else {
      console.log('[Checkout] Creating new Stripe customer for user:', user.id)
      // Normalize email to prevent injection
      const normalizedEmail = user.email?.trim().toLowerCase() || undefined

      try {
        customer = await stripe.customers.create({
          email: normalizedEmail,
          metadata: {
            userId: user.id,
          },
        })
        customerId = customer.id
        console.log('[Checkout] Created new Stripe customer:', customerId)
      } catch (stripeError) {
        console.error('[Checkout] Error creating Stripe customer:', stripeError)
        throw new Error('Failed to create Stripe customer. Please try again.')
      }

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
        console.error('[Checkout] Error storing customer ID in database:', upsertError)
        // Continue anyway - customer created in Stripe
      }
    }

    // Get Stripe Price ID from server-side config
    let priceId: string
    try {
      // Import server-side pricing config
      const { getStripePriceId } = await import('@/lib/pricing-server')
      priceId = getStripePriceId(plan as PlanType)
      console.log('[Checkout] Using Stripe Price ID:', priceId, 'for plan:', plan)
    } catch (error) {
      console.error(`[Checkout] CRITICAL: Error getting Stripe Price ID for plan "${plan}":`, error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Plan does not have a price ID configured. Please contact support.'
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    console.log('[Checkout] Creating Stripe checkout session with base URL:', baseUrl)

    try {
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

      console.log('[Checkout] Successfully created checkout session:', checkoutSession.id)
      return NextResponse.json({ url: checkoutSession.url })
    } catch (stripeError) {
      console.error('[Checkout] CRITICAL: Stripe checkout session creation failed:', stripeError)
      throw stripeError
    }
  } catch (error) {
    console.error('[Checkout] FATAL ERROR - Unhandled exception:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred during checkout'
    return NextResponse.json(
      { error: errorMessage, details: 'Check server logs for more information' },
      { status: 500 },
    )
  }
}
