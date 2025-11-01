import type { PlanType } from '@/lib/pricing'
import { PRICING_CONFIG } from '@/lib/pricing'
import { createClient } from '@/utils/supabase/server'

export interface UserSubscription {
  id: string
  userId: string
  plan: PlanType
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  currentPeriodEnd: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  createdAt: string
  updatedAt: string
}

export interface UsageStats {
  promptsThisMonth: number
  promptsTotal: number
  lastPromptDate: string | null
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const supabase = await createClient()

  // Get most recent subscription regardless of status
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null

  // Map database fields to UserSubscription interface
  return {
    id: data.id,
    userId: data.user_id,
    plan: data.plan as PlanType,
    status: data.status as 'active' | 'canceled' | 'past_due' | 'unpaid',
    currentPeriodEnd: data.current_period_end,
    stripeCustomerId: data.stripe_customer_id ?? '',
    stripeSubscriptionId: data.stripe_subscription_id ?? '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function getUserUsage(userId: string): Promise<UsageStats> {
  const supabase = await createClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Get prompts this month (use inserted_at for prompts table)
  const { count: promptsThisMonth } = await supabase
    .from('prompts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('inserted_at', startOfMonth.toISOString())

  // Get total prompts
  const { count: promptsTotal } = await supabase
    .from('prompts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get last prompt date (use inserted_at for prompts table)
  const { data: lastPrompt } = await supabase
    .from('prompts')
    .select('inserted_at')
    .eq('user_id', userId)
    .order('inserted_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return {
    promptsThisMonth: promptsThisMonth ?? 0,
    promptsTotal: promptsTotal ?? 0,
    lastPromptDate: lastPrompt?.inserted_at ?? null,
  }
}

export function canUserCreatePrompt(
  subscription: UserSubscription | null,
  usage: UsageStats,
): boolean {
  // Block access if subscription is past_due or unpaid
  if (subscription && (subscription.status === 'past_due' || subscription.status === 'unpaid')) {
    return false
  }

  if (!subscription || subscription.status !== 'active') {
    // Free tier - check total prompts stored (maxPrompts), not monthly
    const plan = PRICING_CONFIG.free
    return usage.promptsTotal < plan.limits.maxPrompts
  }

  const plan = PRICING_CONFIG[subscription.plan]

  // Unlimited plans
  if (plan.limits.promptsPerMonth === -1) return true

  // Limited plans - check monthly limit
  return usage.promptsThisMonth < plan.limits.promptsPerMonth
}

export function canUserExport(subscription: UserSubscription | null): boolean {
  // Only active subscriptions can export
  if (!subscription || subscription.status !== 'active') {
    return false
  }
  const plan = PRICING_CONFIG[subscription.plan]
  return plan.limits.canExport === true
}

export function canUserImport(subscription: UserSubscription | null): boolean {
  // Only active subscriptions can import (same as export)
  if (!subscription || subscription.status !== 'active') {
    return false
  }
  const plan = PRICING_CONFIG[subscription.plan]
  return plan.limits.canExport === true // Import uses same permission as export
}

export function canUserShare(subscription: UserSubscription | null): boolean {
  // Active subscriptions can share, free users can share publicly
  if (!subscription || subscription.status !== 'active') {
    // Free users can share publicly (is_public: true)
    return true
  }
  const plan = PRICING_CONFIG[subscription.plan]
  return plan.limits.canShare === true
}

export function getSubscriptionStatusMessage(subscription: UserSubscription | null): string | null {
  if (!subscription) return null

  switch (subscription.status) {
    case 'past_due':
      return 'Your payment failed. Please update your payment method to continue using premium features.'
    case 'unpaid':
      return 'Payment required. Please update your billing information to restore access.'
    case 'canceled':
      return 'Your subscription was canceled. Resubscribe to continue using premium features.'
    case 'active':
      return null // No message for active subscriptions
    default:
      return null
  }
}

export function getPlanLimits(plan: PlanType) {
  return PRICING_CONFIG[plan].limits
}

export function getPlanFeatures(plan: PlanType) {
  return PRICING_CONFIG[plan].features
}
