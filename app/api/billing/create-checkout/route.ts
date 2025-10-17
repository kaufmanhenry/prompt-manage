import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getValidatedUserId } from '@/lib/auth-utils'
import { stripe, stripeConfig } from '@/lib/stripe/client'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError) throw authError

    const userId = getValidatedUserId(user)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { tier } = await req.json()

    if (!['team', 'enterprise'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    // Get or create Stripe customer
    let customerId: string | undefined

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id
    } else {
      // Get user email from Supabase auth
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser?.email) {
        return NextResponse.json({ error: 'User email not found' }, { status: 400 })
      }

      const customer = await stripe.customers.create({
        email: authUser.email,
        metadata: {
          userId: userId,
        },
      })
      customerId = customer.id

      // Save customer ID
      await supabase.from('user_profiles').upsert({
        id: userId,
        stripe_customer_id: customerId,
      })
    }

    // Get price ID
    const priceId = stripeConfig.products[tier as keyof typeof stripeConfig.products].priceId

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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing`,
      metadata: {
        userId: userId,
        tier,
      },
      subscription_data: {
        metadata: {
          userId: userId,
          tier,
        },
        trial_period_days: 14, // 14-day free trial
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
