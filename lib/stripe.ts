import Stripe from 'stripe'

let _stripe: Stripe | null = null

export const getStripe = (): Stripe => {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
    })
  }
  return _stripe
}

// For backward compatibility
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

export const STRIPE_CONFIG = {
  plans: {
    free: {
      name: 'Free',
      price: 0,
      features: [
        'Store up to 25 prompts in your account privately',
        'Secure cloud storage',
        'Tag & organize prompts',
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
      priceId: process.env.STRIPE_PRICE_TEAM_MONTHLY_ID || '',
      features: [
        'Unlimited prompts',
        'All AI models',
        'Team sharing',
        'Export & API access',
        'Priority support',
      ],
      limits: {
        promptsPerMonth: -1, // unlimited
        maxPrompts: -1,
        canShare: true,
        canExport: true,
        teamMembers: 5,
      },
    },
    pro: {
      name: 'Pro',
      price: 99,
      priceId: process.env.STRIPE_PRICE_PRO_MONTHLY_ID || '',
      features: [
        'Everything in Team',
        'Up to 25 team members',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
      ],
      limits: {
        promptsPerMonth: -1,
        maxPrompts: -1,
        canShare: true,
        canExport: true,
        teamMembers: 25,
      },
    },
  },
}

export type PlanType = keyof typeof STRIPE_CONFIG.plans
