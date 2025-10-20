'use client'

import { useState } from 'react'
import { Check, X, Zap, Users, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { STRIPE_CONFIG, PlanType } from '@/lib/stripe'

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
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro')
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
      console.error('Error creating checkout session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case 'free': return <Zap className="h-5 w-5" />
      case 'pro': return <Crown className="h-5 w-5" />
      case 'team': return <Users className="h-5 w-5" />
    }
  }

  const getPlanColor = (plan: PlanType) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800'
      case 'pro': return 'bg-blue-100 text-blue-800'
      case 'team': return 'bg-purple-100 text-purple-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {feature ? `Unlock ${feature}` : 'Upgrade Your Plan'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {feature 
              ? `This feature requires a Pro or Team subscription.`
              : 'Choose the plan that works best for your team.'
            }
          </DialogDescription>
        </DialogHeader>

        {usage && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Usage</p>
                <p className="text-sm text-gray-600">
                  {usage.promptsThisMonth} prompts this month
                </p>
              </div>
              <Badge variant="outline" className={getPlanColor(currentPlan)}>
                {getPlanIcon(currentPlan)}
                <span className="ml-1">{STRIPE_CONFIG.plans[currentPlan].name}</span>
              </Badge>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(STRIPE_CONFIG.plans).map(([planKey, plan]) => {
            const planType = planKey as PlanType
            const isCurrentPlan = planType === currentPlan
            const isSelected = planType === selectedPlan
            
            return (
              <div
                key={planKey}
                className={`relative rounded-lg border-2 p-6 ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } ${isCurrentPlan ? 'opacity-75' : ''}`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500">Current Plan</Badge>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${getPlanColor(planType)}`}>
                    {getPlanIcon(planType)}
                  </div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={isCurrentPlan ? 'outline' : isSelected ? 'default' : 'outline'}
                  disabled={isCurrentPlan || isLoading}
                  onClick={() => {
                    if (!isCurrentPlan) {
                      setSelectedPlan(planType)
                      handleSubscribe(planType)
                    }
                  }}
                >
                  {isCurrentPlan ? 'Current Plan' : isLoading ? 'Processing...' : 'Choose Plan'}
                </Button>
              </div>
            )
          })}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>All plans include a 14-day free trial. Cancel anytime.</p>
          <p className="mt-1">
            Need help? <a href="mailto:support@promptmanage.com" className="text-blue-600 hover:underline">Contact support</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Paywall
