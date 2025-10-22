import { BarChart3, CheckCircle, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Product — Prompt Manage',
  description:
    'Organize, secure, and share your AI prompts with confidence. Built for teams, professionals, and enterprises who need reliable prompt management.',
  keywords: [
    'prompt management',
    'AI prompts',
    'team collaboration',
    'version control',
    'prompt sharing',
    'cost tracking',
    'AI cost analysis',
  ],
  openGraph: {
    title: 'Product — Prompt Manage',
    description: 'Organize, secure, and share your AI prompts with confidence.',
    type: 'website',
  },
}

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Organize, secure, and share your AI prompts
          </h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
            Store, version, and collaborate on AI prompts in one secure platform.
          </p>
          <div className="flex gap-4">
            <Link
              href="/pricing"
              className="inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Get Started
            </Link>
            <Link
              href="/p"
              className="inline-block rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              Browse Prompts
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          <section>
            <h2 className="mb-8 text-2xl font-semibold">Features</h2>
            <div className="space-y-12">
              <div>
                <h3 className="mb-2 text-base font-medium">Secure Storage</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Store all your AI prompts in one encrypted workspace. AES-256 encryption at rest,
                  TLS 1.3 in transit. Private and public prompt options with full-text search.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Team Collaboration</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Work together with granular permissions. Role-based access (Owner, Admin, Editor,
                  Viewer) with shared workspaces and real-time sync.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Version Control</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track every change and restore previous versions. Automatic versioning on every
                  edit with change tracking and side-by-side comparison.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Sharing & Permissions</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Share prompts publicly or privately with fine-grained control. SEO-optimized
                  public pages, private sharing via secure links, and embeddable prompts.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Cost Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Reliable prompt cost forecasting showing how much a prompt will cost to run on each model,
                  including input/output costs and usage patterns.
                </p>
              </div>
            </div>
          </section>

          {/* Token Tracking & Cost Management */}
          <section className="border-t pt-16">
            <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 p-8 dark:from-emerald-900/20 dark:to-blue-900/20">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <div className="mb-4 inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Token Tracking & Cost Management
                  </div>
                  <h3 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                    Complete Visibility & Control Over AI Spending
                  </h3>
                  <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                    Real-time cost preview, detailed token tracking, budget management, and optimization 
                    recommendations. Never be surprised by AI costs again.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="mr-3 mt-1 h-5 w-5 text-emerald-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Real-time Cost Preview</h4>
                        <p className="text-gray-600 dark:text-gray-300">See exact costs before executing any prompt</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="mr-3 mt-1 h-5 w-5 text-emerald-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Detailed Token Analytics</h4>
                        <p className="text-gray-600 dark:text-gray-300">Input/output breakdown with usage patterns</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="mr-3 mt-1 h-5 w-5 text-emerald-600" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">Budget Management</h4>
                        <p className="text-gray-600 dark:text-gray-300">Monthly limits with proactive alerts and reports</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                    <div className="text-center">
                      <TrendingUp className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
                      <h4 className="mb-2 text-lg font-semibold">Cost Optimization</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Automatic recommendations for reducing AI costs while maintaining quality
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="border-t pt-16">
            <h2 className="mb-8 text-2xl font-semibold">Use Cases</h2>
            <div className="space-y-8">
              <div>
                <h3 className="mb-2 text-base font-medium">Marketing Teams</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Centralize campaign prompts, maintain brand voice consistency, and collaborate on
                  content generation with cost tracking.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Development Teams</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Store code generation prompts, version control your AI workflows, and track costs
                  across different models.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Product Teams</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Test variations, track performance, and share winning prompts across departments
                  with detailed cost analysis.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Enterprise</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Secure, compliant, scalable prompt management with advanced permissions, audit
                  logs, and budget controls.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t pt-16">
            <h2 className="mb-4 text-2xl font-semibold">Get Started</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              No credit card required. Free plan available.
            </p>
            <div className="flex gap-4">
              <Link
                href="/pricing"
                className="inline-block rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                View Pricing
              </Link>
              <Link
                href="/docs"
                className="inline-block rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Documentation
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
