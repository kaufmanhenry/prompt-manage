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

    const { tier, teamId } = await req.json()

    if (!['pro', 'enterprise'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
    }

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 })
    }

    // Verify user has permission (owner or admin)
    const { data: membership } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json(
        { error: 'Only team owners and admins can manage billing' },
        { status: 403 },
      )
    }

    // Get or create Stripe customer for the team
    let customerId: string | undefined

    const { data: team } = await supabase
      .from('teams')
      .select('stripe_customer_id, name')
      .eq('id', teamId)
      .single()

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    if (team.stripe_customer_id) {
      customerId = team.stripe_customer_id
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
        name: team.name,
        metadata: {
          teamId: teamId,
        },
      })
      customerId = customer.id

      // Save customer ID to team
      await supabase.from('teams').update({ stripe_customer_id: customerId }).eq('id', teamId)
    }

    // Get price ID
    const priceId = stripeConfig.products[tier as keyof typeof stripeConfig.products].priceId

    // Create checkout session (no trial, straight to paid)
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/settings/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing`,
      metadata: {
        teamId: teamId,
        tier,
      },
      subscription_data: {
        metadata: {
          teamId: teamId,
          tier,
        },
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
