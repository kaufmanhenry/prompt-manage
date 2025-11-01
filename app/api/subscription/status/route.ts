import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { PRICING_CONFIG } from '@/lib/pricing'
import { getUserSubscription, getUserUsage } from '@/lib/subscription'
import { createClient } from '@/utils/supabase/server'

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [subscription, usage] = await Promise.all([
      getUserSubscription(user.id),
      getUserUsage(user.id),
    ])

    // Map database fields to API response
    return NextResponse.json({
      subscription: subscription
        ? {
            plan: subscription.plan,
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
          }
        : {
            plan: 'free' as const,
            status: 'active' as const,
            currentPeriodEnd: null,
          },
      usage: {
        promptsThisMonth: usage.promptsThisMonth,
        promptsTotal: usage.promptsTotal,
        lastPromptDate: usage.lastPromptDate,
      },
      features: {
        canExport: subscription
          ? subscription.status === 'active' &&
            PRICING_CONFIG[subscription.plan].limits.canExport === true
          : false,
        canImport: subscription
          ? subscription.status === 'active' &&
            PRICING_CONFIG[subscription.plan].limits.canExport === true
          : false,
        canShare: subscription
          ? subscription.status === 'active' &&
            PRICING_CONFIG[subscription.plan].limits.canShare === true
          : true, // Free users can share publicly
      },
      statusMessage: subscription
        ? subscription.status === 'past_due'
          ? 'Your payment failed. Please update your payment method to continue using premium features.'
          : subscription.status === 'unpaid'
            ? 'Payment required. Please update your billing information to restore access.'
            : subscription.status === 'canceled'
              ? 'Your subscription was canceled. Resubscribe to continue using premium features.'
              : null
        : null,
    })
  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

