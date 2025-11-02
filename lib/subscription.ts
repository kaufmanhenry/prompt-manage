import { isAdminEmail } from '@/lib/admin'
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
  promptRunsThisMonth: number
  promptRunsTotal: number
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const supabase = await createClient()

  // Check if user is admin - grant PRO access automatically
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user && isAdminEmail(user.email)) {
    // Return PRO subscription for admin accounts
    return {
      id: 'admin-pro-access',
      userId: user.id,
      plan: 'pro' as PlanType,
      status: 'active' as const,
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
      stripeCustomerId: '',
      stripeSubscriptionId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

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

  // Get prompt runs this month
  const { count: promptRunsThisMonth } = await supabase
    .from('prompt_run_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString())

  // Get total prompt runs
  const { count: promptRunsTotal } = await supabase
    .from('prompt_run_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  return {
    promptsThisMonth: promptsThisMonth ?? 0,
    promptsTotal: promptsTotal ?? 0,
    lastPromptDate: lastPrompt?.inserted_at ?? null,
    promptRunsThisMonth: promptRunsThisMonth ?? 0,
    promptRunsTotal: promptRunsTotal ?? 0,
  }
}

export function canUserCreatePrompt(
  subscription: UserSubscription | null,
  usage: UsageStats,
  userEmail?: string | null,
): boolean {
  // Admins always have PRO access (unlimited)
  if (userEmail && isAdminEmail(userEmail)) {
    return true
  }

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

export function canUserExport(
  subscription: UserSubscription | null,
  userEmail?: string | null,
): boolean {
  // Admins always have PRO access (can export)
  if (userEmail && isAdminEmail(userEmail)) {
    return true
  }

  // Only active subscriptions can export
  if (!subscription || subscription.status !== 'active') {
    return false
  }
  const plan = PRICING_CONFIG[subscription.plan]
  return plan.limits.canExport === true
}

export function canUserImport(
  subscription: UserSubscription | null,
  userEmail?: string | null,
): boolean {
  // Admins always have PRO access (can import)
  if (userEmail && isAdminEmail(userEmail)) {
    return true
  }

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

export function canUserRunPrompt(
  subscription: UserSubscription | null,
  usage: UsageStats,
  userEmail?: string | null,
): { allowed: boolean; remaining: number; limit: number } {
  // Admins always have PRO access (unlimited runs)
  if (userEmail && isAdminEmail(userEmail)) {
    return { allowed: true, remaining: 999, limit: 1000 }
  }

  // Block access if subscription is past_due or unpaid
  if (subscription && (subscription.status === 'past_due' || subscription.status === 'unpaid')) {
    return { allowed: false, remaining: 0, limit: 0 }
  }

  // Determine plan
  const plan = subscription?.status === 'active' ? subscription.plan : 'free'
  const planConfig = PRICING_CONFIG[plan]
  const monthlyLimit = planConfig.limits.promptRunsPerMonth

  // Unlimited plans
  if (monthlyLimit === -1) {
    return { allowed: true, remaining: 999, limit: -1 }
  }

  // Check monthly limit
  const remaining = monthlyLimit - usage.promptRunsThisMonth
  const allowed = remaining > 0

  return { allowed, remaining, limit: monthlyLimit }
}
