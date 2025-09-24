'use client'
import { Check, Clock, Star } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'

export default function PricingPage() {
  // Countdown target: 72 hours from first visit (stored in localStorage to persist urgency)
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const deadline = useMemo(() => {
    if (typeof window === 'undefined') return Date.now() + 72 * 60 * 60 * 1000
    const key = 'pm_pro_ltd_deadline'
    const existing = window.localStorage.getItem(key)
    if (existing) return parseInt(existing, 10)
    const next = Date.now() + 72 * 60 * 60 * 1000
    window.localStorage.setItem(key, String(next))
    return next
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const diff = Math.max(0, deadline - now)
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)
    return () => clearInterval(interval)
  }, [deadline])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            Choose your plan
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 md:text-lg">
            Start free. Choose Pro (lifetime) or Team ($5/user/month).
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
          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 md:p-8">
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
              <Link href="/?redirect=/dashboard">
                <Button size="lg" className="w-full">
                  Start Team
                </Button>
              </Link>
              <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                Billed monthly per active user
              </p>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 p-1">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow">
                <Star className="h-3 w-3" /> Limited Time Offer
              </span>
            </div>
            <div className="flex h-full flex-col rounded-[14px] bg-white p-6 dark:bg-gray-800 md:p-8">
              {/* Title and Price */}
              <div className="mb-2">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Pro</h3>
                <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">$19</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  One-time payment • Lifetime deal
                </p>
                {/* Urgency */}
                <div className="mt-3 inline-flex items-center gap-2 self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  <Clock className="h-4 w-4" /> Offer ends soon — {timeLeft.days}d {timeLeft.hours}h{' '}
                  {timeLeft.minutes}m {timeLeft.seconds}s
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Unlock the full power of Prompt Manage with a one-time purchase.
                </p>
              </div>
              {/* Features */}
              <ul className="mt-4 flex-1 space-y-3 text-sm text-gray-800 dark:text-gray-200">
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Unlimited prompts for all
                  your projects
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Run prompts on the latest
                  OpenAI models (more coming soon)
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Private collections,
                  sharing, and team features
                </li>
              </ul>
              {/* CTA */}
              <div className="mt-6">
                <Link href="/?redirect=/dashboard">
                  <Button size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Grab the Lifetime Deal
                  </Button>
                </Link>
                <p className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400">
                  Unlock all features • Pay once, use forever
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary reassurance */}
        <div className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400">
          One-time purchase. No subscription. You keep access to all Pro features shipped during
          this offer.
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
