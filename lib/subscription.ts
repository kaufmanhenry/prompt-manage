import { createClient } from '@/utils/supabase/client'

export type SubscriptionTier = 'free' | 'team' | 'enterprise'
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | null

export interface SubscriptionData {
  tier: SubscriptionTier
  status: SubscriptionStatus
  periodEnd: string | null
  stripeCustomerId: string | null
}

/**
 * Get the current user's subscription data
 */
export async function getUserSubscription(): Promise<SubscriptionData | null> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('user_profiles')
    .select('subscription_tier, subscription_status, subscription_period_end, stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching subscription:', error)
    return null
  }

  return {
    tier: (data?.subscription_tier as SubscriptionTier) || 'free',
    status: (data?.subscription_status as SubscriptionStatus) || null,
    periodEnd: data?.subscription_period_end || null,
    stripeCustomerId: data?.stripe_customer_id || null,
  }
}

/**
 * Check if user has an active paid subscription
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const subscription = await getUserSubscription()
  if (!subscription) return false

  return (
    subscription.tier !== 'free' &&
    (subscription.status === 'active' || subscription.status === 'trialing')
  )
}

/**
 * Check if user has access to a specific feature based on their tier
 */
export async function hasFeatureAccess(feature: string): Promise<boolean> {
  const subscription = await getUserSubscription()
  if (!subscription) return false

  const { tier } = subscription

  // Define feature access by tier
  const featureAccess: Record<string, SubscriptionTier[]> = {
    // Free tier features
    basic_prompts: ['free', 'team', 'enterprise'],
    public_sharing: ['free', 'team', 'enterprise'],

    // Team tier features
    run_prompts: ['team', 'enterprise'],
    unlimited_prompts: ['team', 'enterprise'],
    shared_libraries: ['team', 'enterprise'],
    collaboration: ['team', 'enterprise'],
    full_prompt_lab: ['team', 'enterprise'],

    // Enterprise tier features
    priority_support: ['enterprise'],
    advanced_security: ['enterprise'],
    private_collections: ['enterprise'],
    sso: ['enterprise'],
    custom_roles: ['enterprise'],
    audit_logs: ['enterprise'],
  }

  const allowedTiers = featureAccess[feature]
  if (!allowedTiers) return false

  return allowedTiers.includes(tier)
}

/**
 * Get pricing for each tier
 */
export const PRICING = {
  free: {
    name: 'Free',
    price: 0,
    interval: null,
    features: {
      maxPrompts: 25,
      canRunPrompts: false,
      sharing: 'public',
      promptLab: 'limited',
    },
  },
  team: {
    name: 'Team',
    price: 5,
    interval: 'month',
    features: {
      maxPrompts: Infinity,
      canRunPrompts: true,
      sharing: 'public_and_team',
      promptLab: 'full',
      collaboration: true,
      roleBasedAccess: true,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 27,
    interval: 'month',
    features: {
      maxPrompts: Infinity,
      canRunPrompts: true,
      sharing: 'public_team_and_private',
      promptLab: 'full',
      collaboration: true,
      roleBasedAccess: true,
      prioritySupport: true,
      advancedSecurity: true,
      customRoles: true,
      auditLogs: true,
    },
  },
} as const

/**
 * Get user's subscription limits
 */
export async function getSubscriptionLimits() {
  const subscription = await getUserSubscription()
  if (!subscription) {
    return PRICING.free.features
  }

  return PRICING[subscription.tier].features
}

/**
 * Check if user is within their prompt limit
 */
export async function isWithinPromptLimit(currentPromptCount: number): Promise<boolean> {
  const limits = await getSubscriptionLimits()
  return currentPromptCount < limits.maxPrompts
}

/**
 * Format subscription tier for display
 */
export function formatTier(tier: SubscriptionTier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1)
}

/**
 * Get badge color for tier
 */
export function getTierColor(tier: SubscriptionTier): string {
  switch (tier) {
    case 'enterprise':
      return 'purple'
    case 'team':
      return 'blue'
    default:
      return 'gray'
  }
}
