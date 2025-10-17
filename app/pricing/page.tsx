'use client'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubscribe = async (tier: 'team' | 'enterprise') => {
    setLoading(tier)
    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
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
            Start free. Choose Team ($5/user/month) or Enterprise ($27/user/month).
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
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> 25 prompts max storage
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Cannot run prompts
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Public sharing only (no
                team sharing)
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Prompt Lab access (limited
                beta only)
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
                $5
                <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                  /mo per user
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Best for teams who need collaboration and shared libraries.
              </p>
            </div>
            {/* Features */}
            <ul className="mt-4 flex-1 space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Unlimited prompts and runs
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Full Prompt Lab access
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Shared libraries and
                collaboration
              </li>
              <li className="flex items-start">
                <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Role-based access and
                permissions
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

          {/* Enterprise Plan */}
          <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 p-1">
            <div className="flex h-full flex-col rounded-[14px] bg-white p-6 dark:bg-gray-800 md:p-8">
              {/* Title and Price */}
              <div className="mb-2">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Enterprise</h3>
                <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  $27
                  <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                    /mo per user
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Advanced features for teams requiring enterprise-grade security and collaboration.
                </p>
              </div>
              {/* Features */}
              <ul className="mt-4 flex-1 space-y-3 text-sm text-gray-800 dark:text-gray-200">
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Run prompts on the latest
                  AI models (more coming soon)
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Private collections,
                  sharing, and team features with advanced security, safety, and sharing
                  functionality/integrations
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Unlimited prompts and
                  runs
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Full Prompt Lab access
                </li>
              </ul>
              {/* CTA */}
              <div className="mt-6">
                <Button
                  size="lg"
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => handleSubscribe('enterprise')}
                  disabled={loading === 'enterprise'}
                >
                  {loading === 'enterprise' ? 'Loading...' : 'Subscribe to Enterprise'}
                </Button>
                <p className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400">
                  14-day free trial • Priority support
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
