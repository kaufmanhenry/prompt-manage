'use client'
import { Check } from 'lucide-react'
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
      console.error('Checkout error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start checkout',
        variant: 'destructive',
      })
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            Choose your plan
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 md:text-lg">
            Start free. Choose the plan that works best for you and your team.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {/* Free Plan */}
          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 md:p-8">
            {/* Title and Price */}
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Free</h3>
              <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">$0</div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                The perfect way to start your journey with Prompt Manage.
              </p>
            </div>
            {/* Features */}
            <ul className="mt-4 flex-1 space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Store up to 5 prompts per
                month
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Secure cloud storage
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Tag & organize your prompts
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Share to public directory
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Export prompts
              </li>
            </ul>
            {/* CTA */}
            <div className="mt-6">
              <Link href="/?redirect=/dashboard">
                <Button size="lg" className="w-full">
                  Get Started Free
                </Button>
              </Link>
              <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                No credit card required
              </p>
            </div>
          </div>

          {/* Team Plan */}
          <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 md:p-8">
            {/* Title and Price */}
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Team</h3>
              <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                $20
                <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                  /month
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Perfect for small teams who need secure storage and collaboration.
              </p>
            </div>
            {/* Features */}
            <ul className="mt-4 flex-1 space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Unlimited secure storage
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Up to 5 team members
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Private team collections
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Advanced sharing &
                permissions
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Export & backup options
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Priority support
              </li>
            </ul>
            {/* CTA */}
            <div className="mt-6">
              <Button
                size="lg"
                className="w-full"
                onClick={() => handleSubscribe('team')}
                disabled={loading === 'team'}
              >
                {loading === 'team' ? 'Loading...' : 'Subscribe to Team'}
              </Button>
              <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                14-day free trial • Cancel anytime
              </p>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-1">
            <div className="flex h-full flex-col rounded-[14px] bg-white p-6 dark:bg-gray-800 md:p-8">
              {/* Title and Price */}
              <div className="mb-2">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Pro</h3>
                <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  $99
                  <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                    /month
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Advanced features for growing teams and enterprises.
                </p>
              </div>
              {/* Features */}
              <ul className="mt-4 flex-1 space-y-3 text-sm text-gray-800 dark:text-gray-200">
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Everything in Team
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Up to 25 team members
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Advanced analytics &
                  insights
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Enterprise-grade security
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Custom integrations
                  (coming soon)
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Dedicated support
                </li>
              </ul>
              {/* CTA */}
              <div className="mt-6">
                <Button
                  size="lg"
                  className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => handleSubscribe('pro')}
                  disabled={loading === 'pro'}
                >
                  {loading === 'pro' ? 'Loading...' : 'Subscribe to Pro'}
                </Button>
                <p className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400">
                  14-day free trial • Dedicated support
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary reassurance */}
        <div className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400">
          All plans include 14-day free trial. No credit card required to start.
        </div>

        {/* Minimal distraction-free footer link */}
        <div className="mt-10 text-center">
          <Link href="/docs">
            <Button variant="outline" size="sm">
              See documentation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
