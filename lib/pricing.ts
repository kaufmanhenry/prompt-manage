/**
 * Centralized Pricing Configuration
 * 
 * This is the single source of truth for all pricing and plan information across the platform.
 * Update this file to automatically sync pricing details across:
 * - Pricing page
 * - Payment/subscription docs
 * - Paywall modals
 * - Any other feature displays
 * 
 * Last updated: 2025-01-30
 */

export type PlanType = 'free' | 'team' | 'pro'

export interface PlanFeatures {
  name: string
  price: number
  description: string
  tagline?: string
  features: string[]
  limits: {
    promptsPerMonth: number // -1 for unlimited
    maxPrompts: number // -1 for unlimited
    canShare: boolean
    canExport: boolean
    teamMembers?: number
  }
  stripePriceId?: string
}

export const PRICING_CONFIG: Record<PlanType, PlanFeatures> = {
  free: {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      'Store up to 25 prompts in your account privately',
      'Tag & organize prompts',
      'Create private and public collections',
      'Public sharing',
    ],
    limits: {
      promptsPerMonth: 25,
      maxPrompts: 25,
      canShare: true,
      canExport: false,
    },
  },
  team: {
    name: 'Team',
    price: 20,
    description: 'For small teams and collaboration',
    tagline: 'Popular',
    features: [
      'Unlimited prompts',
      'Up to 5 team members',
      'Private team collections',
      'Advanced sharing & permissions',
      'Bulk Import/Export & backup options',
      'Priority support',
    ],
    limits: {
      promptsPerMonth: -1, // unlimited
      maxPrompts: -1,
      canShare: true,
      canExport: true,
      teamMembers: 5,
    },
    stripePriceId: process.env.STRIPE_PRICE_TEAM_MONTHLY_ID || '',
  },
  pro: {
    name: 'Pro',
    price: 99,
    description: 'For growing teams and large enterprises',
    features: [
      'Everything in Team',
      'Up to 25 team members',
      'Advanced analytics & insights',
      'Enterprise-grade security',
      'Custom integrations and apps',
      'Dedicated support',
    ],
    limits: {
      promptsPerMonth: -1, // unlimited
      maxPrompts: -1,
      canShare: true,
      canExport: true,
      teamMembers: 25,
    },
    stripePriceId: process.env.STRIPE_PRICE_PRO_MONTHLY_ID || '',
  },
}

/**
 * Get plan configuration by type
 */
export function getPlanConfig(plan: PlanType): PlanFeatures {
  return PRICING_CONFIG[plan]
}

/**
 * Get all plan types
 */
export function getAllPlans(): PlanType[] {
  return ['free', 'team', 'pro']
}

/**
 * Get paid plans only
 */
export function getPaidPlans(): PlanType[] {
  return ['team', 'pro']
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  if (price === 0) return '$0'
  return `$${price}`
}

/**
 * Check if a plan is unlimited for prompts
 */
export function isUnlimitedPrompts(plan: PlanType): boolean {
  return PRICING_CONFIG[plan].limits.promptsPerMonth === -1
}

/**
 * Check if a plan has export/import features
 */
export function hasExportFeatures(plan: PlanType): boolean {
  return PRICING_CONFIG[plan].limits.canExport === true
}

/**
 * Check if a plan supports team members
 */
export function supportsTeamMembers(plan: PlanType): boolean {
  return PRICING_CONFIG[plan].limits.teamMembers !== undefined
}

/**
 * Get maximum team members for a plan
 */
export function getMaxTeamMembers(plan: PlanType): number | null {
  return PRICING_CONFIG[plan].limits.teamMembers ?? null
}

