'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface SeatLimitModalProps {
  open: boolean
  onClose: () => void
  currentPlan: 'team' | 'pro'
  currentSeats: number
  maxSeats: number
  pendingEmail: string
  teamId: string
}

export function SeatLimitModal({
  open,
  onClose,
  currentPlan,
  currentSeats,
  maxSeats,
  pendingEmail,
  teamId,
}: SeatLimitModalProps) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)

    try {
      // Save pending invitation to localStorage
      localStorage.setItem(
        'pendingInvitation',
        JSON.stringify({
          teamId,
          email: pendingEmail,
          timestamp: Date.now(),
        }),
      )

      // Redirect to Stripe checkout with 14-day trial
      const res = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: 'pro',
          teamId,
          trialDays: 14,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await res.json()

      // Redirect to Stripe
      window.location.href = url
    } catch (error) {
      console.error('Upgrade error:', error)
      setLoading(false)
      // TODO: Show error toast
    }
  }

  const handleContactSales = () => {
    window.open('/contact', '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Your team is growing! 🚀</DialogTitle>
          <DialogDescription>
            You've reached your {maxSeats}-member limit on the Team plan. Upgrade to Pro to add 20
            more teammates and unlock advanced features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pending Email Display */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <div className="text-sm font-medium">You're trying to invite:</div>
            <div className="font-mono text-sm">{pendingEmail}</div>
          </div>

          {/* Plan Comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* Team Plan (Current) */}
            <div className="space-y-3 rounded-lg border p-4">
              <div>
                <div className="font-semibold">Team</div>
                <div className="text-2xl font-bold">
                  $20
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />5 team members
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  100 prompt runs/month
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Basic collaboration
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <X className="h-4 w-4" />
                  Analytics dashboard
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <X className="h-4 w-4" />
                  Audit logs
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <X className="h-4 w-4" />
                  Priority support
                </li>
              </ul>
              <div className="border-t pt-2 text-xs text-muted-foreground">Your current plan</div>
            </div>

            {/* Pro Plan (Upgrade Target) */}
            <div className="relative space-y-3 rounded-lg border-2 border-primary p-4">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Recommended
              </div>
              <div>
                <div className="font-semibold">Pro</div>
                <div className="text-2xl font-bold">
                  $99
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <strong>25 team members</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <strong>1,000 prompt runs/month</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Advanced collaboration
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <strong>Analytics dashboard</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <strong>Audit logs & compliance</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <strong>Priority support</strong>
                </li>
              </ul>
              <div className="border-t pt-2 text-xs font-medium text-green-600">
                14-day free trial
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button onClick={handleUpgrade} disabled={loading} size="lg" className="w-full">
              {loading ? 'Redirecting to checkout...' : 'Start 14-Day Free Trial'}
            </Button>
            <Button variant="outline" onClick={onClose} size="lg" className="w-full">
              Maybe Later
            </Button>
          </div>

          {/* Enterprise Contact */}
          <div className="text-center text-sm text-muted-foreground">
            Need more than 25 seats?{' '}
            <button onClick={handleContactSales} className="text-primary underline">
              Contact Sales
            </button>{' '}
            for Enterprise pricing
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
