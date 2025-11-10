import { CheckCircle, Database, Download, Infinity, Lock, Users, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Product — Prompt Manage',
  description:
    'The complete CMS for AI prompts. Store unlimited prompts, share with your team, organize with collections, and scale your AI workflows. Built for teams and enterprises.',
  keywords: [
    'prompt management',
    'AI prompts',
    'team collaboration',
    'unlimited prompts',
    'prompt collections',
    'bulk import export',
    'prompt CMS',
  ],
  openGraph: {
    title: 'Product — Prompt Manage',
    description: 'The complete CMS for AI prompts. Built for teams and enterprises.',
    type: 'website',
  },
}

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Your Complete CMS for AI Prompts
            </h1>
            <p className="mb-4 text-xl text-muted-foreground md:text-2xl">
              Store unlimited prompts, share with your team, and organize everything with
              collections. Built for teams and enterprises who need real prompt management.
            </p>
            <p className="mb-10 text-lg text-muted-foreground">
              Stop managing prompts in spreadsheets and Notion. Get a dedicated platform designed
              for scale, collaboration, and security.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg bg-black px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Start Free — No Credit Card
              </Link>
              <Link
                href="/p"
                className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3 text-base font-medium transition-colors hover:bg-accent"
              >
                Browse Public Prompts
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Core Benefits - Team & Pro */}
      <div className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Why Teams Choose Prompt Manage
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Real features that solve real problems. No fluff, just value.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Unlimited Prompts */}
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Infinity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Unlimited Prompts</h3>
              <p className="mb-4 text-muted-foreground">
                <strong>Team & Pro plans:</strong> Store as many prompts as you need. No limits, no
                restrictions. Scale from 100 to 10,000 prompts without hitting a ceiling.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Free plan:</span>
                <span>25 prompts included</span>
              </div>
            </div>

            {/* Team Sharing */}
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Share with Your Team</h3>
              <p className="mb-4 text-muted-foreground">
                <strong>Team plan:</strong> Up to 5 team members. <strong>Pro plan:</strong> Up to
                25 members. Share prompts, collections, and collaborate in real-time with role-based
                permissions.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Included in:</span>
                <span>Team & Pro plans</span>
              </div>
            </div>

            {/* Collections */}
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Organize with Collections</h3>
              <p className="mb-4 text-muted-foreground">
                Group prompts by project, use case, or AI model. Create private collections for your
                team or public collections to showcase your work. All plans include collections.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Available on:</span>
                <span>All plans</span>
              </div>
            </div>

            {/* Bulk Import/Export */}
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Download className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Bulk Import & Export</h3>
              <p className="mb-4 text-muted-foreground">
                <strong>Team & Pro plans:</strong> Import hundreds of prompts from CSV or JSON.
                Export your entire library anytime for backup or migration. No manual copying.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Included in:</span>
                <span>Team & Pro plans</span>
              </div>
            </div>

            {/* Secure Storage */}
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Secure Cloud Storage</h3>
              <p className="mb-4 text-muted-foreground">
                All your prompts encrypted at rest with AES-256. Private prompts stay private.
                Public prompts can be shared with SEO-optimized pages. Enterprise-grade security on
                all plans.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Available on:</span>
                <span>All plans</span>
              </div>
            </div>

            {/* All AI Models */}
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">All AI Models Supported</h3>
              <p className="mb-4 text-muted-foreground">
                Support for ChatGPT, Claude, Gemini, Llama, and more. Tag prompts by model, track
                usage, and organize everything in one place. No model lock-in.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Available on:</span>
                <span>All plans</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Choose Your Plan</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Start free, upgrade when you need more. Cancel anytime.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Free Plan */}
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-semibold">Free</h3>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground">Perfect for getting started</p>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">25 prompts stored</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">Secure cloud storage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">Tag & organize prompts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">Public sharing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">Collections</span>
                </li>
              </ul>
              <Link
                href="/?redirect=/dashboard"
                className="block w-full rounded-lg border border-border bg-card px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-accent"
              >
                Get Started Free
              </Link>
            </div>

            {/* Team Plan */}
            <div className="relative rounded-xl border-2 border-emerald-500 bg-card p-8 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                  Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-semibold">Team</h3>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$20</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground">For small teams</p>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">
                    <strong>Unlimited prompts</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">Up to 5 team members</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">Bulk import & export</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">Team collections</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Start Team Plan
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-semibold">Pro</h3>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground">For growing teams</p>
              </div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">
                    <strong>Everything in Team</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">Up to 25 team members</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">Custom integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                  <span className="text-sm">Dedicated support</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="block w-full rounded-lg bg-black px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Start Pro Plan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="border-b border-border bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Built for Real Teams
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              See how teams use Prompt Manage to scale their AI workflows.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="mb-3 text-xl font-semibold">Marketing Teams</h3>
              <p className="mb-4 text-muted-foreground">
                Store hundreds of campaign prompts, organize by campaign type, and share winning
                prompts across your team. No more lost prompts in Slack or Google Docs.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Best for:</span>
                <span className="font-medium">Team plan</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="mb-3 text-xl font-semibold">Development Teams</h3>
              <p className="mb-4 text-muted-foreground">
                Keep code generation prompts organized, version-controlled, and shared. Import from
                legacy systems and export for backups. Built for scale.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Best for:</span>
                <span className="font-medium">Team or Pro plan</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="mb-3 text-xl font-semibold">Product Teams</h3>
              <p className="mb-4 text-muted-foreground">
                A/B test prompt variations, track performance, and share winning prompts in
                collections. Scale from experiments to production.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Best for:</span>
                <span className="font-medium">Team plan</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-8">
              <h3 className="mb-3 text-xl font-semibold">Enterprise</h3>
              <p className="mb-4 text-muted-foreground">
                Thousands of prompts, multiple teams, advanced permissions, and enterprise security.
                Built for organizations that need governance at scale.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Best for:</span>
                <span className="font-medium">Pro plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Ready to Manage Your Prompts at Scale?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join teams who've moved from spreadsheets to a dedicated prompt CMS. Start free, upgrade
            when you're ready.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg bg-black px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              View Pricing Plans
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3 text-base font-medium transition-colors hover:bg-accent"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
