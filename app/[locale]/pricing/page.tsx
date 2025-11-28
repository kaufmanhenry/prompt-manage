'use client'
import { Check, ShieldCheck, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { formatPrice, getAllPlans, PRICING_CONFIG } from '@/lib/pricing'
import { createClient } from '@/utils/supabase/client'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)

      // If user just logged in and there's a pending checkout, trigger it
      if (session && typeof window !== 'undefined') {
        const pendingPlan = sessionStorage.getItem('pendingCheckoutPlan')
        if (pendingPlan && (pendingPlan === 'team' || pendingPlan === 'pro')) {
          sessionStorage.removeItem('pendingCheckoutPlan')
          // Small delay to ensure the component is fully mounted
          setTimeout(() => {
            void handleSubscribe(pendingPlan as 'team' | 'pro')
          }, 500)
        }
      }
    }
    void checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubscribe = async (tier: 'team' | 'pro') => {
    setLoading(tier)

    // Check if user is authenticated
    if (isAuthenticated === false) {
      // Store the intended plan in session storage to complete checkout after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pendingCheckoutPlan', tier)
      }

      // Redirect to sign in with return URL
      toast({
        title: 'Sign in required',
        description: 'Please sign in to subscribe to a plan',
      })
      router.push(`/?redirect=/pricing&checkout=${tier}`)
      return
    }

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: tier }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle unauthorized specifically
        if (response.status === 401) {
          toast({
            title: 'Sign in required',
            description: 'Please sign in to subscribe to a plan',
          })
          router.push(`/?redirect=/pricing&checkout=${tier}`)
          return
        }
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
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Choose your plan
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Start free, upgrade when you need more. Cancel anytime.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {getAllPlans().map((planType) => {
            const plan = PRICING_CONFIG[planType]
            const isPopular = plan.tagline === 'Popular'
            const isPaid = plan.price > 0

            return (
              <div
                key={planType}
                className={`group relative flex flex-col rounded-2xl border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-md ${
                  isPopular
                    ? 'border-2 border-emerald-500/50 shadow-lg hover:border-emerald-500 hover:shadow-xl'
                    : 'border-border'
                } ${planType === 'pro' ? 'bg-gradient-to-br from-card via-card to-muted/30' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white">
                      {plan.tagline}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-semibold tracking-tight">{plan.name}</h3>
                  <div className="mb-1 flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight">
                      {formatPrice(plan.price)}
                    </span>
                    {isPaid && (
                      <span className="text-lg font-medium text-muted-foreground">/mo</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="mb-8 flex-1 space-y-3.5">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {planType === 'free' ? (
                  <Link href="/?redirect=/dashboard">
                    <Button size="lg" variant="outline" className="w-full font-medium">
                      Get started
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    className={`w-full font-medium ${
                      isPopular ? 'bg-emerald-600 text-white hover:bg-emerald-700' : ''
                    }`}
                    onClick={() => {
                      if (planType === 'team' || planType === 'pro') {
                        void handleSubscribe(planType)
                      }
                    }}
                    disabled={loading === planType}
                  >
                    {loading === planType ? 'Processing...' : `Start with ${plan.name}`}
                  </Button>
                )}
              </div>
            )
          })}
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
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  Enterprise Security
                </h3>
                <p className="text-sm leading-relaxed text-foreground/60">
                  AES-256 encryption at rest, TLS 1.3 in transit, role-based access control, and
                  comprehensive audit logging.
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  Scalable Architecture
                </h3>
                <p className="text-sm leading-relaxed text-foreground/60">
                  Built to handle millions of prompts, thousands of teams, and unlimited growth.
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-card p-6">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">High Availability</h3>
                <p className="text-sm leading-relaxed text-foreground/60">
                  Built for reliability with edge caching, automated failover, and scalable
                  infrastructure for growing teams.
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
              <span>Enterprise security</span>
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
