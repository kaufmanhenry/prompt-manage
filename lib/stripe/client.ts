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
      appInfo: {
        name: 'Prompt Manage',
        version: '1.0.0',
      },
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

export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  products: {
    team: {
      productId: process.env.STRIPE_PRODUCT_TEAM_ID!,
      priceId: process.env.STRIPE_PRICE_TEAM_MONTHLY_ID!,
    },
    enterprise: {
      productId: process.env.STRIPE_PRODUCT_ENTERPRISE_ID!,
      priceId: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY_ID!,
    },
  },
}
