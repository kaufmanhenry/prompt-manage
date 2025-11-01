'use client'

import { Check, Crown, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { logger } from '@/lib/logger'
import type { PlanType } from '@/lib/stripe'
import { STRIPE_CONFIG } from '@/lib/stripe'

interface PaywallProps {
  isOpen: boolean
  onClose: () => void
  currentPlan?: PlanType
  usage?: {
    promptsThisMonth: number
    promptsTotal: number
  }
  feature?: string
}

export function Paywall({ isOpen, onClose, currentPlan = 'free', usage, feature }: PaywallProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (plan: PlanType) => {
    if (plan === 'free') return

    setIsLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      logger.error('Error creating checkout session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case 'free':
        return <Zap className="h-5 w-5" />
      case 'pro':
        return <Crown className="h-5 w-5" />
      case 'team':
        return <Users className="h-5 w-5" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-border/50 bg-card">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-center text-2xl font-semibold tracking-tight text-foreground">
            {feature ? `Upgrade to Pro` : 'Upgrade Your Plan'}
          </DialogTitle>
          <DialogDescription className="mt-2 text-center text-sm leading-relaxed text-foreground/60">
            {feature
              ? `${feature} requires a Team or Pro subscription.`
              : 'Choose the plan that works best for your team.'}
          </DialogDescription>
        </DialogHeader>

        {usage && (
          <div className="mb-6 rounded-lg border border-border/30 bg-background p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Current Usage</p>
                <p className="mt-0.5 text-xs text-foreground/60">
                  {currentPlan === 'free'
                    ? `${usage.promptsTotal} of 25 prompts stored`
                    : `${usage.promptsThisMonth} prompts this month`}
                  {currentPlan === 'free' && usage.promptsTotal >= 20 && (
                    <span className="ml-2 text-amber-600 dark:text-amber-400">
                      (80% limit reached)
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getPlanIcon(currentPlan)}
                <span className="text-sm font-medium text-foreground/80">
                  {STRIPE_CONFIG.plans[currentPlan].name}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Object.entries(STRIPE_CONFIG.plans).map(([planKey, plan]) => {
            const planType = planKey as PlanType
            const isCurrentPlan = planType === currentPlan
            const isRecommended = planType === 'team'

            return (
              <div
                key={planKey}
                className={`group relative flex flex-col rounded-lg border border-border/50 bg-card p-6 transition-all duration-200 ${
                  isCurrentPlan
                    ? 'border-border/80 bg-foreground/5'
                    : isRecommended
                      ? 'border-emerald-500/30 hover:border-emerald-500/50'
                      : 'hover:border-border/80'
                }`}
              >
                {isRecommended && !isCurrentPlan && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-medium text-white">
                      Popular
                    </span>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs font-medium text-foreground/70">
                      Current
                    </span>
                  </div>
                )}

                <div className="mb-6 text-center">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 text-foreground/60">
                    {getPlanIcon(planType)}
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-foreground">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold tracking-tight text-foreground">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && <span className="ml-1 text-sm text-foreground/50">/mo</span>}
                  </div>
                </div>

                <ul className="mb-6 flex-1 space-y-2.5">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm leading-relaxed text-foreground/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={isCurrentPlan ? 'outline' : 'default'}
                  disabled={isCurrentPlan || isLoading}
                  onClick={() => {
                    if (!isCurrentPlan) {
                      void handleSubscribe(planType)
                    }
                  }}
                  size="lg"
                >
                  {isCurrentPlan
                    ? 'Current Plan'
                    : isLoading
                      ? 'Processing...'
                      : plan.price === 0
                        ? 'Current'
                        : 'Upgrade'}
                </Button>
              </div>
            )
          })}
        </div>

        <div className="mt-6 border-t border-border/30 pt-6 text-center">
          <p className="text-xs text-foreground/50">
            Subscriptions auto-renew monthly. Cancel anytime. No credit card required for free plan.
          </p>
          <p className="mt-2 text-xs text-foreground/50">
            Questions?{' '}
            <Link
              href="/support"
              className="font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Contact support
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Paywall
