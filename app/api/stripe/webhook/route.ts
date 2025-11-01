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
      if (process.env.NODE_ENV === 'development') {
        console.error('Webhook signature verification failed:', err)
      }
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
          if (process.env.NODE_ENV === 'development') {
            console.error('Missing metadata in checkout session', { metadata: session.metadata })
          }
          break
        }

        // Get subscription details from session
        const subscriptionId = session.subscription
        if (!subscriptionId || typeof subscriptionId !== 'string') {
          if (process.env.NODE_ENV === 'development') {
            console.error('No subscription ID in checkout session')
          }
          break
        }

        const subscriptionObj = await stripe.subscriptions.retrieve(subscriptionId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = subscriptionObj as any
        const currentPeriodEnd = subscription.current_period_end
        const customerId: string | null = typeof subscription.customer === 'string' 
          ? subscription.customer 
          : (subscription.customer as { id: string } | null)?.id || null

        if (!customerId || typeof customerId !== 'string') {
          if (process.env.NODE_ENV === 'development') {
            console.error('No customer ID in subscription')
          }
          break
        }

        // Update or create subscription in database
        const { error: upsertError } = await supabase.from('user_subscriptions').upsert(
          {
            user_id: userId,
            plan: plan as 'team' | 'pro',
            status: subscription.status as 'active' | 'canceled' | 'past_due' | 'unpaid',
            current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id',
          },
        )

        if (upsertError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error upserting subscription:', upsertError)
          }
          // Log error but don't throw - Stripe already processed payment
          // TODO: Send to error tracking service (e.g., Sentry)
          // Consider: Dead letter queue for retry
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Subscription created/updated for user ${userId}, plan: ${plan}`)
          }
        }

        break
      }

      case 'customer.subscription.updated': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id

        if (!customerId) {
          if (process.env.NODE_ENV === 'development') {
            console.error('No customer ID in subscription update')
          }
          break
        }

        const currentPeriodEnd = subscription.current_period_end

        // Get user from customer ID
        const { data: userSub, error: selectError } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (selectError || !userSub) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error finding subscription for customer:', selectError)
          }
          break
        }

        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update({
            status: subscription.status as 'active' | 'canceled' | 'past_due' | 'unpaid',
            current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
            stripe_subscription_id: subscription.id,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userSub.user_id)

        if (updateError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error updating subscription:', updateError)
          }
          // TODO: Send to error tracking service
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Subscription updated for user ${userSub.user_id}, status: ${subscription.status}`)
          }
        }

        break
      }

      case 'customer.subscription.deleted': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id

        if (!customerId) {
          if (process.env.NODE_ENV === 'development') {
            console.error('No customer ID in subscription deletion')
          }
          break
        }

        // Get user from customer ID
        const { data: userSub, error: selectError } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (selectError || !userSub) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error finding subscription for customer:', selectError)
          }
          break
        }

        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update({
            status: 'canceled',
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userSub.user_id)

        if (updateError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error canceling subscription:', updateError)
          }
          // TODO: Send to error tracking service
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Subscription canceled for user ${userSub.user_id}`)
          }
        }

        break
      }

      case 'invoice.payment_succeeded': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
        const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id

        if (!customerId || !subscriptionId) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Invoice payment succeeded but no customer/subscription ID')
          }
          break
        }

        // Get subscription from Stripe to verify it's active
        const subscriptionObj = await stripe.subscriptions.retrieve(subscriptionId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = subscriptionObj as any

        // Get user from customer ID
        const { data: userSub } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (userSub) {
          const currentPeriodEnd = subscription.current_period_end

          const { error: updateError } = await supabase
            .from('user_subscriptions')
            .update({
              status: 'active',
              current_period_end: new Date(currentPeriodEnd * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userSub.user_id)

          if (updateError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error updating subscription after payment:', updateError)
            }
            // TODO: Send to error tracking service
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.log(`✅ Invoice payment succeeded for user ${userSub.user_id}`)
            }
          }
        }

        break
      }

      case 'invoice.payment_failed': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id

        if (!customerId) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Invoice payment failed but no customer ID')
          }
          break
        }

        // Get user from customer ID
        const { data: userSub } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (userSub) {
          const { error: updateError } = await supabase
            .from('user_subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userSub.user_id)

          if (updateError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error updating subscription after payment failure:', updateError)
            }
            // TODO: Send to error tracking service
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.error(`⚠️ Invoice payment failed for user ${userSub.user_id}`)
            }
          }
        }

        break
      }

      default:
        if (process.env.NODE_ENV === 'development') {
          console.log(`Unhandled event type: ${event.type}`)
        }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Webhook error:', error)
    }
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}

// Required for webhooks to work with raw body
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
