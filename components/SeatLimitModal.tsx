'use client'

import { Check, X } from 'lucide-react'
import { useState } from 'react'

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
  currentSeats: _currentSeats,
  maxSeats,
  pendingEmail,
  teamId,
}: SeatLimitModalProps) {
  const [loading, setLoading] = useState(false)

  const handleBookDemo = async () => {
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

      // Capture lead for demo
      await fetch('/api/leads/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId,
          pendingEmail,
          currentPlan,
          source: 'seat_limit_modal',
        }),
      })

      // Redirect to demo booking page or calendar
      // Option 1: Internal demo form
      window.location.href = `/demo?team=${teamId}&email=${encodeURIComponent(pendingEmail)}`

      // Option 2: Calendly (if you use it)
      // window.open('https://calendly.com/promptmanage/demo', '_blank')
    } catch (error) {
      console.error('Demo booking error:', error)
      setLoading(false)
      // Fallback: Open contact page
      window.open('/contact', '_blank')
    }
  }

  const handleUpgradeNow = () => {
    // For immediate self-service upgrade (no trial)
    localStorage.setItem(
      'pendingInvitation',
      JSON.stringify({
        teamId,
        email: pendingEmail,
        timestamp: Date.now(),
      }),
    )
    window.location.href = `/pricing?team=${teamId}&upgrade=pro`
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
          <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
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
              <div className="border-t pt-2 text-xs font-medium text-primary">Talk to our team</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button onClick={handleBookDemo} disabled={loading} size="lg" className="w-full">
              {loading ? 'Opening demo booking...' : 'Book a Demo'}
            </Button>
            <Button variant="outline" onClick={handleUpgradeNow} size="lg" className="w-full">
              Upgrade Now
            </Button>
            <Button variant="ghost" onClick={onClose} size="sm" className="w-full">
              Maybe Later
            </Button>
          </div>

          {/* Enterprise Contact */}
          <div className="text-center text-sm text-muted-foreground">
            Questions? Email us at{' '}
            <a href="mailto:sales@promptmanage.com" className="text-primary underline">
              sales@promptmanage.com
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
