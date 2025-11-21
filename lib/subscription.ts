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

  // Grace period for past_due subscriptions (7 days)
  if (subscription && subscription.status === 'past_due') {
    const currentPeriodEnd = new Date(subscription.currentPeriodEnd)
    const gracePeriodEnd = new Date(currentPeriodEnd.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days
    const now = new Date()

    // Allow access during grace period
    if (now <= gracePeriodEnd) {
      // Still check limits as if active
      const plan = PRICING_CONFIG[subscription.plan]
      if (plan.limits.promptsPerMonth === -1) return true
      return usage.promptsThisMonth < plan.limits.promptsPerMonth
    }
    // After grace period, block access
    return false
  }

  // Block access immediately if unpaid (no grace period)
  if (subscription && subscription.status === 'unpaid') {
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
    case 'past_due': {
      const currentPeriodEnd = new Date(subscription.currentPeriodEnd)
      const gracePeriodEnd = new Date(currentPeriodEnd.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days
      const now = new Date()
      const daysRemaining = Math.ceil(
        (gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      )

      if (now <= gracePeriodEnd && daysRemaining > 0) {
        return `Your payment failed. You have ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} of grace period remaining. Please update your payment method.`
      }
      return 'Your payment failed and grace period has expired. Please update your payment method to restore access.'
    }
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

  // Grace period for past_due subscriptions (7 days)
  if (subscription && subscription.status === 'past_due') {
    const currentPeriodEnd = new Date(subscription.currentPeriodEnd)
    const gracePeriodEnd = new Date(currentPeriodEnd.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days
    const now = new Date()

    // Allow access during grace period
    if (now <= gracePeriodEnd) {
      const plan = PRICING_CONFIG[subscription.plan]
      const monthlyLimit = plan.limits.promptRunsPerMonth

      if (monthlyLimit === -1) {
        return { allowed: true, remaining: 999, limit: -1 }
      }

      const remaining = monthlyLimit - usage.promptRunsThisMonth
      const allowed = remaining > 0
      return { allowed, remaining, limit: monthlyLimit }
    }
    // After grace period, block access
    return { allowed: false, remaining: 0, limit: 0 }
  }

  // Block access immediately if unpaid (no grace period)
  if (subscription && subscription.status === 'unpaid') {
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

/**
 * Get the team owner's user ID
 */
export async function getTeamOwnerId(teamId: string): Promise<string | null> {
  const supabase = await createClient()

  const { data: owner } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', teamId)
    .eq('role', 'owner')
    .eq('is_active', true)
    .single()

  return owner?.user_id ?? null
}

/**
 * Check if a team can add more members based on the owner's subscription plan
 */
export async function canAddTeamMember(
  teamId: string,
): Promise<{ allowed: boolean; reason?: string; currentCount: number; maxAllowed: number }> {
  const supabase = await createClient()

  // Count current active team members
  const { count: currentCount } = await supabase
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId)
    .eq('is_active', true)

  const memberCount = currentCount ?? 0

  // Get team owner's subscription
  const ownerId = await getTeamOwnerId(teamId)
  if (!ownerId) {
    return {
      allowed: false,
      reason: 'Team owner not found',
      currentCount: memberCount,
      maxAllowed: 0,
    }
  }

  const subscription = await getUserSubscription(ownerId)

  // Free plan doesn't support teams
  if (!subscription || subscription.status !== 'active' || subscription.plan === 'free') {
    return {
      allowed: false,
      reason: 'Team features require a Team or Pro subscription',
      currentCount: memberCount,
      maxAllowed: 0,
    }
  }

  const plan = PRICING_CONFIG[subscription.plan]
  const maxMembers = plan.limits.teamMembers ?? 0

  if (memberCount >= maxMembers) {
    return {
      allowed: false,
      reason: `Your ${plan.name} plan supports up to ${maxMembers} team members. Upgrade to add more.`,
      currentCount: memberCount,
      maxAllowed: maxMembers,
    }
  }

  return {
    allowed: true,
    currentCount: memberCount,
    maxAllowed: maxMembers,
  }
}
