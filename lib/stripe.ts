import type Stripe from 'stripe'

import type { PlanType } from '@/lib/pricing'
import { PRICING_CONFIG } from '@/lib/pricing'

let _stripe: Stripe | null = null

export const getStripe = (): Stripe => {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const StripeLib = require('stripe')
    _stripe = new StripeLib(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
    }) as Stripe
  }
  return _stripe
}

// For backward compatibility
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

/**
 * @deprecated Use PRICING_CONFIG from '@/lib/pricing' instead
 * Kept for backward compatibility
 */
export const STRIPE_CONFIG = {
  plans: {
    free: {
      name: PRICING_CONFIG.free.name,
      price: PRICING_CONFIG.free.price,
      features: PRICING_CONFIG.free.features,
      limits: PRICING_CONFIG.free.limits,
    },
    team: {
      name: PRICING_CONFIG.team.name,
      price: PRICING_CONFIG.team.price,
      features: PRICING_CONFIG.team.features,
      limits: PRICING_CONFIG.team.limits,
    },
    pro: {
      name: PRICING_CONFIG.pro.name,
      price: PRICING_CONFIG.pro.price,
      features: PRICING_CONFIG.pro.features,
      limits: PRICING_CONFIG.pro.limits,
    },
  },
}

// Re-export PlanType for backward compatibility
export type { PlanType }
