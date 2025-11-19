import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy — Prompt Manage',
  description:
    'Comprehensive Refund Policy for Prompt Manage. Learn about our refund terms, cancellation policy, and billing procedures.',
}

export default function RefundsPage() {
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
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">Refund Policy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Terms and conditions for refunds and cancellations.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Last updated: October 30, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-12">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Refund Eligibility
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Prompt Manage offers refunds under the following circumstances:
            </p>
            <ul className="list-disc space-y-3 pl-6 text-gray-600 dark:text-gray-400">
              <li>
                <strong className="text-gray-900 dark:text-white">
                  Subscription Cancellation:
                </strong>{' '}
                If you cancel your subscription, you will retain access until the end of your
                current billing period. No charges will occur after cancellation.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Subscription Errors:</strong> If
                you are charged incorrectly due to a technical error on our part, we will issue a
                full refund.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Duplicate Charges:</strong> If you
                are charged multiple times for the same subscription, we will refund duplicate
                charges.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Cancellation Policy
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              You may cancel your subscription at any time:
            </p>
            <ul className="list-disc space-y-3 pl-6 text-gray-600 dark:text-gray-400">
              <li>
                <strong className="text-gray-900 dark:text-white">Active Subscriptions:</strong> You
                will continue to have access to premium features until the end of your current
                billing period.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">No Partial Refunds:</strong> We do
                not offer partial refunds for unused portions of your subscription period.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Automatic Cancellation:</strong>{' '}
                If your subscription is canceled, it will not automatically renew. You will be
                downgraded to the Free plan at the end of your billing period.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              How to Cancel
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              You can cancel your subscription through:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400">
              <li>
                <strong className="text-gray-900 dark:text-white">Account Settings:</strong>{' '}
                Navigate to Settings → Subscription → Cancel Subscription
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Stripe Customer Portal:</strong>{' '}
                We use Stripe for billing. You can manage your subscription directly through the{' '}
                <a
                  href="https://billing.stripe.com/p/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Stripe Customer Portal
                </a>
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Contact Support:</strong> Email us
                at{' '}
                <a
                  href="mailto:support@promptmanage.com"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  support@promptmanage.com
                </a>{' '}
                to request cancellation assistance
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Refund Processing
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              If you are eligible for a refund:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400">
              <li>Refunds are processed within 5-10 business days</li>
              <li>Refunds will be issued to the original payment method</li>
              <li>You will receive email confirmation once the refund has been processed</li>
              <li>If the original payment method is no longer available, please contact support</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Non-Refundable Items
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              The following are not eligible for refunds:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400">
              <li>Subscriptions that have been active and used</li>
              <li>Usage-based charges (e.g., token usage, API calls)</li>
              <li>Custom enterprise plans or add-ons</li>
              <li>Services that have been fully consumed during the billing period</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Disputes and Chargebacks
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              If you have concerns about a charge, please contact us directly at{' '}
              <a
                href="mailto:support@promptmanage.com"
                className="text-emerald-600 hover:underline dark:text-emerald-400"
              >
                support@promptmanage.com
              </a>{' '}
              before initiating a chargeback. We are committed to resolving billing issues quickly
              and fairly.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Chargebacks initiated without first contacting us may result in immediate account
              suspension.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Updates to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We may update this Refund Policy from time to time. We will notify you of any material
              changes by posting the new policy on this page and updating the &quot;Last
              updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              For refund requests or questions about our refund policy, please contact us at:{' '}
              <a
                href="mailto:support@promptmanage.com"
                className="text-emerald-600 hover:underline dark:text-emerald-400"
              >
                support@promptmanage.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
