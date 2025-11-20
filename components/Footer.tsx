'use client'

import { ArrowRight, Rocket, Sparkles, Github, Twitter } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

// Organization schema for SEO
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Prompt Manage',
  url: 'https://promptmanage.com',
  logo: '/logo.svg',
  sameAs: ['https://x.com/promptmanage', 'https://www.linkedin.com/company/prompt-manage/'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    url: '/support',
  },
}

export function Footer() {
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([])

  const createHearts = () => {
    const newHearts: Array<{ id: number; x: number; y: number }> = []
    const heartCount = 30 // Number of hearts to create

    for (let i = 0; i < heartCount; i++) {
      newHearts.push({
        id: Date.now() + i,
        x: Math.random() * 100, // Random x position (0-100%)
        y: Math.random() * 100, // Random y position (0-100%)
      })
    }

    setHearts(newHearts)

    // Remove hearts after 3 seconds
    setTimeout(() => {
      setHearts([])
    }, 3000)
  }

  return (
    <>
      {/* Organization Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <footer className="border-t bg-white py-10 dark:bg-gray-950">
        {/* Unique CTA Section */}
        <div className="mx-auto mb-12 max-w-6xl px-6">
          <div className="group relative overflow-hidden rounded-2xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 p-8 transition-all duration-500 hover:border-emerald-300 hover:shadow-lg dark:border-emerald-800/30 dark:from-emerald-950/20 dark:via-gray-950 dark:to-emerald-950/10">
            <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex flex-1 flex-col gap-3 text-center md:text-left">
                <div className="inline-flex items-center gap-2 self-center md:self-start">
                  <Sparkles className="h-4 w-4 animate-pulse text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Join the Community
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
                  Ready to level up your AI prompts?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join 100s of creators sharing AI prompts in the public directory. Free to start
                  safely storing your prompts! Create your prompt CMS with Prompt Manage.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/?redirect=/dashboard">
                  <Button
                    size="lg"
                    className="group/btn relative overflow-hidden bg-emerald-600 font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl"
                  >
                    <Rocket className="mr-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
            {/* Decorative background elements */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-200/20 blur-3xl transition-all group-hover:scale-150 dark:bg-emerald-500/10" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl transition-all group-hover:scale-150 dark:bg-emerald-600/10" />
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="mx-auto flex flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-center md:gap-0">
          <div className="flex w-full flex-col gap-4 md:flex-row md:gap-8">
            <div className="flex flex-col gap-2">
              <div className="group flex items-center gap-2">
                <h3 className="text-sm font-semibold tracking-tight transition-transform group-hover:scale-105">
                  Prompt Manage
                </h3>
                <Sparkles className="h-3 w-3 text-emerald-600 opacity-0 transition-all group-hover:opacity-100 dark:text-emerald-400" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Create, store, and safely share AI prompts
                <br />
                with your team.
              </p>
            </div>
            <nav aria-label="Company navigation">
              <ul className="items-center space-y-2 text-sm">
                <li className="text-xs font-medium text-muted-foreground">Company</li>
                <li>
                  <Link href="/" className="text-gray-600 hover:underline dark:text-gray-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Learn more about Prompt Manage"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/product"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="View Prompt Manage product features"
                  >
                    Product
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="View Prompt Manage pricing plans"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Resources navigation">
              <ul className="items-center space-y-2 text-sm">
                <li className="text-xs font-medium text-muted-foreground">Resources</li>
                <li>
                  <Link
                    href="/p"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Browse public AI prompt directory"
                  >
                    Prompt Directory
                  </Link>
                </li>
                <li>
                  <Link
                    href="/use-cases"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="AI prompt use cases and examples"
                  >
                    Use Cases
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Browse AI tools and resources"
                  >
                    AI Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="/models"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Supported AI models and prompts"
                  >
                    Models
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Prompt Manage documentation"
                  >
                    Docs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Get help and support"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bfcm-2025-ai-deals"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Black Friday and Cyber Monday AI deals"
                  >
                    Black Friday Deals
                  </Link>
                </li>
              </ul>
            </nav>
            <nav aria-label="Legal navigation">
              <ul className="items-center space-y-2 text-sm">
                <li className="text-xs font-medium text-muted-foreground">Legal</li>
                <li>
                  <Link
                    href="/legal-center"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Legal center and compliance information"
                  >
                    Legal Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Terms and conditions"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Privacy policy"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/accessibility"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Accessibility statement"
                  >
                    Accessibility
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dmca"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="DMCA policy"
                  >
                    DMCA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Cookie policy"
                  >
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/refunds"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Refund policy"
                  >
                    Refunds
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="text-gray-600 hover:underline dark:text-gray-300"
                    aria-label="Security and data protection"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex flex-col justify-between space-y-4 md:ml-auto">
              <div className="flex items-center justify-start gap-2 md:justify-end">
                <Link
                  href="https://x.com/promptmanage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  aria-label="Follow us on X"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
                <Link
                  href="https://www.linkedin.com/company/prompt-manage/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  aria-label="Follow us on LinkedIn"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </Link>
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <span>Building the CMS for your prompts with</span>
                  <button
                    type="button"
                    onClick={createHearts}
                    className="cursor-pointer text-red-500 transition-transform hover:scale-125 active:scale-110"
                    aria-label="Show love"
                  >
                    ❤️
                  </button>
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  &copy; 2025 Prompt Manage LLC.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Hearts Animation */}
        {hearts.length > 0 && (
          <div className="pointer-events-none fixed inset-0 z-50">
            {hearts.map((heart) => (
              <div
                key={heart.id}
                className="animate-heart-float absolute"
                style={{
                  left: `${heart.x}%`,
                  top: `${heart.y}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              >
                <span className="text-2xl">❤️</span>
              </div>
            ))}
          </div>
        )}
      </footer>
    </>
  )
}
