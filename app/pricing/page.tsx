'use client';
import { Check, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function PricingPage() {
  // Countdown target: 72 hours from first visit (stored in localStorage to persist urgency)
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const deadline = useMemo(() => {
    if (typeof window === 'undefined') return Date.now() + 72 * 60 * 60 * 1000;
    const key = 'pm_pro_ltd_deadline';
    const existing = window.localStorage.getItem(key);
    if (existing) return parseInt(existing, 10);
    const next = Date.now() + 72 * 60 * 60 * 1000;
    window.localStorage.setItem(key, String(next));
    return next;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, deadline - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose your plan
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
            Start free. Choose Pro (lifetime) or Team ($5/user/month).
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 flex flex-col">
            {/* Title and Price */}
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Free</h3>
              <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">$0</div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                The perfect way to start your journey with Prompt Manage.
              </p>
            </div>
            {/* Features */}
            <ul className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300 flex-1">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> 25 prompts max storage
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Cannot run prompts
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Public sharing only (no
                team sharing)
              </li>
            </ul>
            {/* CTA */}
            <div className="mt-6">
              <GoogleSignInButton label="Get Started Free" className="w-full" size="lg" />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                No credit card required
              </p>
            </div>
          </div>

          {/* Team Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 flex flex-col">
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
            <ul className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300 flex-1">
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Unlimited prompts and runs
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Shared libraries and
                collaboration
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Role-based access and
                permissions
              </li>
            </ul>
            {/* CTA */}
            <div className="mt-6">
              <GoogleSignInButton label="Start Team" className="w-full" size="lg" />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                Billed monthly per active user
              </p>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl p-1 bg-gradient-to-br from-blue-500 to-indigo-500">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow">
                <Star className="w-3 h-3" /> Limited Time Offer
              </span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-[14px] h-full p-6 md:p-8 flex flex-col">
              {/* Title and Price */}
              <div className="mb-2">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Pro</h3>
                <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">$19</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  One-time payment • Lifetime deal
                </p>
                {/* Urgency */}
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-full px-3 py-1 self-start">
                  <Clock className="w-4 h-4" /> Offer ends soon — {timeLeft.days}d {timeLeft.hours}h{' '}
                  {timeLeft.minutes}m {timeLeft.seconds}s
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Unlock the full power of Prompt Manage with a one-time purchase.
                </p>
              </div>
              {/* Features */}
              <ul className="mt-4 space-y-3 text-sm text-gray-800 dark:text-gray-200 flex-1">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Unlimited prompts for all
                  your projects
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Run prompts on the latest
                  OpenAI models (more coming soon)
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Private collections,
                  sharing, and team features
                </li>
              </ul>
              {/* CTA */}
              <div className="mt-6">
                <GoogleSignInButton label="Grab the Lifetime Deal" className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg" />
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
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
  );
}
