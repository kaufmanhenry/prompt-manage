/**
 * Server-Side Pricing Configuration
 *
 * This module handles server-only pricing configuration, particularly Stripe Price IDs.
 * These values are NOT available in client-side code and must only be accessed from server components/API routes.
 */

import type { PlanType } from './pricing'

/**
 * Get Stripe Price ID for a given plan
 * @throws Error if Price ID is not configured
 */
export function getStripePriceId(plan: PlanType): string {
  const envVarMap: Record<Exclude<PlanType, 'free'>, string> = {
    team: 'STRIPE_PRICE_TEAM_MONTHLY_ID',
    pro: 'STRIPE_PRICE_PRO_MONTHLY_ID',
  }

  if (plan === 'free') {
    throw new Error('Free plan does not have a Stripe Price ID')
  }

  const envVar = envVarMap[plan]
  const priceId = process.env[envVar]

  if (!priceId || priceId === '') {
    throw new Error(
      `Missing Stripe Price ID for ${plan} plan. Please set environment variable: ${envVar}`,
    )
  }

  return priceId
}

/**
 * Check if Stripe Price IDs are configured
 */
export function hasStripePriceIds(): boolean {
  try {
    getStripePriceId('team')
    getStripePriceId('pro')
    return true
  } catch {
    return false
  }
}

/**
 * Get all configured Stripe Price IDs
 */
export function getAllStripePriceIds(): Record<Exclude<PlanType, 'free'>, string> {
  return {
    team: getStripePriceId('team'),
    pro: getStripePriceId('pro'),
  }
}
