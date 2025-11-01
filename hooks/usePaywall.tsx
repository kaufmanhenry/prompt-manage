'use client'

import { useEffect, useState } from 'react'

import Paywall from '@/components/Paywall'
import type { PlanType } from '@/lib/stripe'
import { STRIPE_CONFIG } from '@/lib/stripe'
import { createClient } from '@/utils/supabase/client'

interface UsePaywallReturn {
  canCreatePrompt: boolean
  showPaywall: () => void
  hidePaywall: () => void
  PaywallComponent: React.ReactNode
  isLoading: boolean
  usage: {
    promptsThisMonth: number
    promptsTotal: number
  } | null
  subscription: {
    plan: PlanType
    status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  } | null
}

function canUserCreatePrompt(
  subscription: { plan: PlanType } | null,
  usage: { promptsThisMonth: number } | null,
): boolean {
  if (!usage) return true // Allow if usage data not loaded yet

  const plan = subscription?.plan || 'free'
  const planConfig = STRIPE_CONFIG.plans[plan]

  // Unlimited plans
  if (planConfig.limits.promptsPerMonth === -1) return true

  // Limited plans - check monthly limit
  return usage.promptsThisMonth < planConfig.limits.promptsPerMonth
}

export function usePaywall(feature?: string): UsePaywallReturn {
  const [isPaywallOpen, setIsPaywallOpen] = useState(false)
  const [canCreatePrompt, setCanCreatePrompt] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [usage, setUsage] = useState<{ promptsThisMonth: number; promptsTotal: number } | null>(
    null,
  )
  const [subscription, setSubscription] = useState<{
    plan: PlanType
    status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  } | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    async function checkUsage() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        setIsLoading(false)
        return
      }

      try {
        // Fetch subscription and usage from API
        const response = await fetch('/api/subscription/status', {
          signal: abortController.signal,
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to fetch subscription status')
        }

        const data = await response.json()
        
        // Validate response structure
        if (!data.subscription || !data.usage) {
          throw new Error('Invalid response structure')
        }

        setUsage(data.usage)
        setSubscription(data.subscription)

        // Calculate if user can create prompt
        const canCreate = canUserCreatePrompt(data.subscription, data.usage)
        setCanCreatePrompt(canCreate)
      } catch (error) {
        // Ignore abort errors
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
        
        console.error('Error checking usage:', error)
        // On error, allow creation (graceful degradation)
        setCanCreatePrompt(true)
      } finally {
        setIsLoading(false)
      }
    }

    void checkUsage()

    // Cleanup: abort fetch on unmount
    return () => {
      abortController.abort()
    }
  }, [])

  const showPaywall = () => setIsPaywallOpen(true)
  const hidePaywall = () => setIsPaywallOpen(false)

  const PaywallComponent = (
    <Paywall
      isOpen={isPaywallOpen}
      onClose={hidePaywall}
      currentPlan={subscription?.plan || 'free'}
      usage={usage || undefined}
      feature={feature}
    />
  )

  return {
    canCreatePrompt,
    showPaywall,
    hidePaywall,
    PaywallComponent,
    isLoading,
    usage,
    subscription,
  }
}

export default usePaywall
