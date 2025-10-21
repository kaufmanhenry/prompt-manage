'use client'

import { useEffect, useState } from 'react'

import Paywall from '@/components/Paywall'
import type { PlanType } from '@/lib/stripe'
import { canUserCreatePrompt, getUserSubscription, getUserUsage } from '@/lib/subscription'
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
    status: string
  } | null
}

export function usePaywall(feature?: string): UsePaywallReturn {
  const [isPaywallOpen, setIsPaywallOpen] = useState(false)
  const [canCreatePrompt, setCanCreatePrompt] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [usage, setUsage] = useState<{ promptsThisMonth: number; promptsTotal: number } | null>(
    null,
  )
  const [subscription, setSubscription] = useState<{ plan: PlanType; status: string } | null>(null)

  useEffect(() => {
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
        const [userSubscription, userUsage] = await Promise.all([
          getUserSubscription(session.user.id),
          getUserUsage(session.user.id),
        ])

        setUsage(userUsage)
        setSubscription(
          userSubscription
            ? {
                plan: userSubscription.plan,
                status: userSubscription.status,
              }
            : {
                plan: 'free',
                status: 'active',
              },
        )

        const canCreate = canUserCreatePrompt(userSubscription, userUsage)
        setCanCreatePrompt(canCreate)
      } catch (error) {
        console.error('Error checking usage:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void checkUsage()
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
