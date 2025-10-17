import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
  appInfo: {
    name: 'Prompt Manage',
    version: '1.0.0',
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
