import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const STRIPE_CONFIG = {
  plans: {
    free: {
      name: 'Free',
      price: 0,
      features: [
        '5 prompts per month',
        'Basic templates',
        'Community support',
      ],
      limits: {
        promptsPerMonth: 5,
        maxPrompts: 10,
        canShare: false,
        canExport: false,
      },
    },
    pro: {
      name: 'Pro',
      price: 29,
      priceId: 'price_pro_monthly', // You'll get this from Stripe Dashboard
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
      },
    },
    team: {
      name: 'Team',
      price: 99,
      priceId: 'price_team_monthly', // You'll get this from Stripe Dashboard
      features: [
        'Everything in Pro',
        'Up to 10 team members',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
      ],
      limits: {
        promptsPerMonth: -1,
        maxPrompts: -1,
        canShare: true,
        canExport: true,
        teamMembers: 10,
      },
    },
  },
} as const

export type PlanType = keyof typeof STRIPE_CONFIG.plans
