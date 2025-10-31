import { headers } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const stripe = getStripe()
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Use service role for webhook writes (bypass RLS safely on server)
    const supabase = createAdminClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan

        if (!userId || !plan) {
          console.error('Missing metadata in checkout session')
          break
        }

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentPeriodEnd = (subscription as any).current_period_end as number

        // Update or create subscription in database
        await supabase.from('user_subscriptions').upsert({
          user_id: userId,
          plan,
          status: subscription.status,
          current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          updated_at: new Date().toISOString(),
        })

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const customerId = subscription.customer as string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentPeriodEnd = (subscription as any).current_period_end as number

        // Get user from customer ID
        const { data: userSub } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (userSub) {
          await supabase
            .from('user_subscriptions')
            .update({
              status: subscription.status,
              current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userSub.user_id)
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const customerId = subscription.customer as string

        // Get user from customer ID
        const { data: userSub } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (userSub) {
          await supabase
            .from('user_subscriptions')
            .update({
              status: 'canceled',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userSub.user_id)
        }

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}

// Required for webhooks to work with raw body
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
