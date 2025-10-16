import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Product — Prompt Manage',
  description: 'Organize, secure, and share your AI prompts with confidence. Built for teams, professionals, and enterprises who need reliable prompt management.',
  keywords: [
    'prompt management',
    'AI prompts',
    'team collaboration',
    'version control',
    'prompt sharing',
    'API access',
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
                  Store all your AI prompts in one encrypted workspace. AES-256 encryption at rest, TLS 1.3 in transit. Private and public prompt options with full-text search.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Team Collaboration</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Work together with granular permissions. Role-based access (Owner, Admin, Editor, Viewer) with shared workspaces and real-time sync.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Version Control</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track every change and restore previous versions. Automatic versioning on every edit with change tracking and side-by-side comparison.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Sharing & Permissions</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Share prompts publicly or privately with fine-grained control. SEO-optimized public pages, private sharing via secure links, and embeddable prompts.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">API Access</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Integrate with your existing workflows. RESTful API for all CRUD operations, webhook support, and SDKs coming soon.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Understand prompt performance. Token usage and cost tracking, execution history, team-wide dashboards for Enterprise, and exportable reports.
                </p>
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
                  Centralize campaign prompts, maintain brand voice consistency, and collaborate on content generation.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Development Teams</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Store code generation prompts, integrate via API, and version control your AI workflows.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Product Teams</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Test variations, track performance, and share winning prompts across departments.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Enterprise</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Secure, compliant, scalable prompt management with advanced permissions and audit logs.
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
