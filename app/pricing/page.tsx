'use client'
import { Check, ShieldCheck, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubscribe = async (tier: 'team' | 'pro') => {
    setLoading(tier)
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: tier }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Checkout error:', error)
      }
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start checkout',
        variant: 'destructive',
      })
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            Simple, transparent pricing
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Choose your plan
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Start free, upgrade when you need more. Cancel anytime.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {/* Free Plan */}
          <div className="group relative flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-semibold tracking-tight">Free</h3>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">$0</span>
              </div>
              <p className="text-sm text-muted-foreground">Perfect for getting started</p>
            </div>

            <ul className="mb-8 flex-1 space-y-3.5">
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">5 prompts per month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Secure cloud storage</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Tag & organize prompts</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Public sharing</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Export prompts</span>
              </li>
            </ul>

            <Link href="/?redirect=/dashboard">
              <Button size="lg" variant="outline" className="w-full font-medium">
                Get started
              </Button>
            </Link>
          </div>

          {/* Team Plan */}
          <div className="group relative flex flex-col rounded-2xl border-2 border-emerald-500/50 bg-card p-8 shadow-lg transition-all duration-300 hover:border-emerald-500 hover:shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white">
                Popular
              </span>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-semibold tracking-tight">Team</h3>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">$20</span>
                <span className="text-lg font-medium text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground">For small teams and collaboration</p>
            </div>

            <ul className="mb-8 flex-1 space-y-3.5">
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Unlimited prompts</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Up to 5 team members</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Private team collections</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Advanced sharing & permissions</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Export & backup options</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Priority support</span>
              </li>
            </ul>

            <Button
              size="lg"
              className="w-full bg-emerald-600 font-medium text-white hover:bg-emerald-700"
              onClick={() => handleSubscribe('team')}
              disabled={loading === 'team'}
            >
              {loading === 'team' ? 'Processing...' : 'Start with Team'}
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="group relative flex flex-col rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/30 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-semibold tracking-tight">Pro</h3>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">$99</span>
                <span className="text-lg font-medium text-muted-foreground">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground">For growing teams and enterprises</p>
            </div>

            <ul className="mb-8 flex-1 space-y-3.5">
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Everything in Team</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Up to 25 team members</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Advanced analytics & insights</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Enterprise-grade security</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Custom integrations</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="text-sm leading-relaxed">Dedicated support</span>
              </li>
            </ul>

            <Button
              size="lg"
              className="w-full font-medium"
              onClick={() => handleSubscribe('pro')}
              disabled={loading === 'pro'}
            >
              {loading === 'pro' ? 'Processing...' : 'Start with Pro'}
            </Button>
          </div>
        </div>

        {/* Enterprise Features Section */}
        <div className="mt-20 border-t border-border/50 pt-16">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
              Enterprise-Ready Infrastructure
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-sm leading-relaxed text-foreground/60">
              Built for scale, security, and reliability. Trusted by teams of all sizes.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">Enterprise Security</h3>
                <p className="text-sm leading-relaxed text-foreground/60">
                  SOC 2 compliant, end-to-end encryption, role-based access control, and audit logs.
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">Scalable Architecture</h3>
                <p className="text-sm leading-relaxed text-foreground/60">
                  Built to handle millions of prompts, thousands of teams, and unlimited growth.
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">99.9% Uptime SLA</h3>
                <p className="text-sm leading-relaxed text-foreground/60">
                  Enterprise-grade reliability with global edge caching and automated failover.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Secure payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>SLA guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Dedicated support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
