'use client'
import { Check, Clock } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function PricingPage() {

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
            {/* Coming Soon Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white shadow">
                <Clock className="h-3 w-3" /> Coming Soon
              </span>
            </div>
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
              <Button size="lg" className="w-full" disabled variant="outline">
                Coming Soon
              </Button>
              <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                Will be available soon
              </p>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 p-1">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white shadow">
                <Clock className="h-3 w-3" /> Coming Soon
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
                  <Check className="mr-2 mt-0.5 h-4 w-4 text-green-500" /> Full Prompt Lab access
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
                <Button size="lg" className="w-full bg-blue-600 text-white hover:bg-blue-700" disabled>
                  Coming Soon
                </Button>
                <p className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400">
                  Will be available soon
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary reassurance */}
        <div className="mt-10 text-center text-xs text-gray-500 dark:text-gray-400">
          Premium plans coming soon. Stay tuned for updates!
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
