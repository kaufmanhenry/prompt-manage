import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Support — Prompt Manage',
  description:
    'Get help with Prompt Manage. FAQs, guides, and support resources for managing your AI prompts.',
  keywords: ['support', 'help', 'FAQ', 'documentation', 'customer service'],
  openGraph: {
    title: 'Support — Prompt Manage',
    description: 'Get help with Prompt Manage.',
    type: 'website',
  },
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">Support</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Get help with Prompt Manage.</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          {/* Getting Started */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Getting Started</h2>
            <ul className="space-y-4">
              <li>
                <Link href="/docs" className="group block">
                  <h3 className="mb-1 font-medium group-hover:underline">Quick Start Guide</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learn the basics of creating, storing, and managing prompts
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/docs" className="group block">
                  <h3 className="mb-1 font-medium group-hover:underline">
                    Creating Your First Prompt
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Step-by-step guide to creating and saving your first prompt
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/docs" className="group block">
                  <h3 className="mb-1 font-medium group-hover:underline">Account Setup</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Configure your account and preferences
                  </p>
                </Link>
              </li>
            </ul>
          </section>

          {/* Using Prompt Manage */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Using Prompt Manage</h2>
            <ul className="space-y-4">
              <li>
                <Link href="/docs" className="group block">
                  <h3 className="mb-1 font-medium group-hover:underline">Team Collaboration</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Invite team members and manage permissions
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/docs" className="group block">
                  <h3 className="mb-1 font-medium group-hover:underline">Sharing Prompts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Make prompts public or share privately
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/docs" className="group block">
                  <h3 className="mb-1 font-medium group-hover:underline">Version History</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track changes and restore previous versions
                  </p>
                </Link>
              </li>
            </ul>
          </section>

          {/* Security & Account */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Security & Account</h2>
            <ul className="space-y-4">
              <li>
                <Link href="/security" className="group block">
                  <h3 className="mb-1 font-medium group-hover:underline">Security Overview</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learn how we protect your data
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/docs" className="group block">
                  <h3 className="mb-1 font-medium group-hover:underline">Change Password</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update your account password
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/legal-center/data-erasure" className="group block">
                  <h3 className="mb-1 font-medium group-hover:underline">Delete Account</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permanently delete your account and data
                  </p>
                </Link>
              </li>
            </ul>
          </section>

          {/* Billing */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Billing & Plans</h2>
            <ul className="space-y-4">
              <li>
                <Link href="/pricing" className="group block">
                  <h3 className="mb-1 font-medium group-hover:underline">View Plans & Pricing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Compare Free, Team, and Enterprise plans
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/docs" className="group block">
                  <h3 className="mb-1 font-medium group-hover:underline">Upgrade or Downgrade</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Change your subscription plan
                  </p>
                </Link>
              </li>
              <li>
                <Link href="/docs" className="group block">
                  <h3 className="mb-1 font-medium group-hover:underline">Billing Questions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Invoices, payment methods, and refunds
                  </p>
                </Link>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Contact Support</h2>
            <div className="space-y-6">
              <div>
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">General Support</p>
                <a
                  href="mailto:support@promptmanage.com"
                  className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
                >
                  support@promptmanage.com
                </a>
              </div>
              <div>
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Enterprise & Sales</p>
                <a
                  href="mailto:enterprise@promptmanage.com"
                  className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
                >
                  enterprise@promptmanage.com
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
