import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Data Erasure Policy — Prompt Manage',
  description:
    'How to request deletion of your account and data from Prompt Manage. Complete erasure process, timelines, and your data protection rights.',
  keywords: ['data erasure', 'account deletion', 'GDPR', 'right to be forgotten', 'delete account'],
  openGraph: {
    title: 'Data Erasure Policy — Prompt Manage',
    description: 'Your right to delete your data and account.',
    type: 'website',
  },
}

export default function DataErasurePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Link
            href="/legal-center"
            className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Legal Trust Center
          </Link>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Data Erasure Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your right to delete your data and account.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Effective: January 1, 2025 | Updated: October 16, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          {/* Overview */}
          <section>
            <p className="text-gray-600 dark:text-gray-400">
              Under GDPR, CCPA, and other data protection laws, you have the right to request
              deletion of your personal data and account. This page explains the deletion process,
              timelines, and what data is retained.
            </p>
          </section>

          {/* How to Delete */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">How to Delete Your Account</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-base font-medium">1. Export Your Data (Optional)</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Go to Settings → Account → Data Export to download all your prompts and data. This
                  is optional but recommended as deleted data cannot be recovered.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">2. Request Deletion</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Go to Settings → Account → Delete Account, or email{' '}
                  <a href="mailto:legal@promptmanage.com" className="underline">
                    legal@promptmanage.com
                  </a>{' '}
                  with "Account Deletion Request" in the subject line.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">3. Confirmation</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We'll verify your identity and confirm the deletion request via email.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">4. Complete Erasure</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All your data will be permanently deleted within 30 days of confirmation.
                </p>
              </div>
            </div>
          </section>

          {/* What Gets Deleted */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">What Gets Deleted</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• All prompts (public and private)</li>
              <li>• Prompt run history and results</li>
              <li>• Account information and preferences</li>
              <li>• Authentication tokens and sessions</li>
              <li>• Team memberships (if applicable)</li>
              <li>• Usage analytics and logs</li>
            </ul>
          </section>

          {/* What's Retained */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">What's Retained</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              We may retain certain information as required by law:
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Anonymized usage statistics (not personally identifiable)</li>
              <li>• Financial records for tax and accounting purposes (7 years)</li>
              <li>• Legal compliance records (as required by applicable law)</li>
            </ul>
          </section>

          {/* Timeline */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Timeline</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Request verification: Within 3 business days</li>
              <li>• Data export (if requested): Immediate</li>
              <li>• Complete erasure: Within 30 days of confirmation</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Contact</h2>
            <div>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                Data Deletion Requests
              </p>
              <a
                href="mailto:legal@promptmanage.com"
                className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                legal@promptmanage.com
              </a>
            </div>
            <div className="mt-8 flex gap-4 text-sm">
              <Link
                href="/legal-center"
                className="underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                Legal Trust Center
              </Link>
              <Link
                href="/privacy"
                className="underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                Privacy Policy
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
