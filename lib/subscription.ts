import type { PlanType } from '@/lib/stripe'
import { STRIPE_CONFIG } from '@/lib/stripe'
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

  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
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

  // Get prompts this month
  const { count: promptsThisMonth } = await supabase
    .from('prompts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth.toISOString())

  // Get total prompts
  const { count: promptsTotal } = await supabase
    .from('prompts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get last prompt date
  const { data: lastPrompt } = await supabase
    .from('prompts')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return {
    promptsThisMonth: promptsThisMonth ?? 0,
    promptsTotal: promptsTotal ?? 0,
    lastPromptDate: lastPrompt?.created_at ?? null,
  }
}

export function canUserCreatePrompt(
  subscription: UserSubscription | null,
  usage: UsageStats,
): boolean {
  if (!subscription) {
    // Free tier
    const plan = STRIPE_CONFIG.plans.free
    return usage.promptsThisMonth < plan.limits.promptsPerMonth
  }

  const plan = STRIPE_CONFIG.plans[subscription.plan]

  // Unlimited plans
  if (plan.limits.promptsPerMonth === -1) return true

  // Limited plans
  return usage.promptsThisMonth < plan.limits.promptsPerMonth
}

export function getPlanLimits(plan: PlanType) {
  return STRIPE_CONFIG.plans[plan].limits
}

export function getPlanFeatures(plan: PlanType) {
  return STRIPE_CONFIG.plans[plan].features
}
