import { CreditCard, DollarSign, Lock, RefreshCw, Shield } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Payments & Subscriptions — Prompt Manage',
  description:
    'Learn about Prompt Manage pricing, subscriptions, billing, cancellations, and refunds. Understand what features are included in each plan.',
  keywords: [
    'prompt manage pricing',
    'subscription billing',
    'paywall features',
    'stripe payments',
    'cancel subscription',
    'refund policy',
  ],
  openGraph: {
    title: 'Payments & Subscriptions — Prompt Manage',
    description: 'Complete guide to pricing, subscriptions, and billing for Prompt Manage.',
    type: 'website',
  },
}

export default function PaymentsSubscriptionsGuide() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Link
            href="/docs"
            className="mb-8 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back to Documentation
          </Link>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
              <CreditCard className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Payments & Subscriptions
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Complete guide to pricing, subscriptions, billing, and managing your Prompt Manage
            account.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Last updated: January 30, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          {/* Overview */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <DollarSign className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Overview</h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Prompt Manage offers flexible subscription plans to fit your needs. We use{' '}
                <a
                  href="https://stripe.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Stripe
                </a>{' '}
                for secure payment processing, ensuring your payment information is handled safely and
                securely.
              </p>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                <p className="text-sm text-emerald-900 dark:text-emerald-200">
                  <strong>Security:</strong> All payments are processed securely through Stripe. We never
                  store your payment card information on our servers. Your payment details are encrypted
                  and handled by Stripe's PCI-compliant infrastructure.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing Plans */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <DollarSign className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Pricing Plans</h2>
            </div>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-xl font-semibold">Free</h3>
                  <div className="mb-4 text-3xl font-bold">$0</div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>5 prompts per month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>Secure cloud storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>Tag & organize prompts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>Public sharing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>Export prompts</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border-2 border-emerald-200 bg-white p-6 dark:border-emerald-700 dark:bg-gray-800">
                  <div className="mb-2">
                    <span className="rounded-full bg-emerald-500 px-2 py-1 text-xs font-medium text-white">
                      Popular
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">Team</h3>
                  <div className="mb-4 text-3xl font-bold">
                    $20<span className="text-lg font-normal">/mo</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>Unlimited prompts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>All AI models</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>Team sharing (5 members)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>Export & API access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>Priority support</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 text-xl font-semibold">Pro</h3>
                  <div className="mb-4 text-3xl font-bold">
                    $99<span className="text-lg font-normal">/mo</span>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>Everything in Team</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>Up to 25 team members</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>Advanced analytics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>Dedicated support</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <Link
                    href="/pricing"
                    className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    View full pricing details →
                  </Link>
                </p>
              </div>
            </div>
          </section>

          {/* Features Behind Paywall */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Lock className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Features Behind the Paywall</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Some features require a paid subscription (Team or Pro plan). Here's what's included
                and what requires an upgrade:
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <h3 className="mb-4 font-semibold text-emerald-900 dark:text-emerald-100">
                    ✅ Free Plan Features
                  </h3>
                  <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
                    <li>• Create up to 5 prompts per month</li>
                    <li>• Store up to 10 prompts total</li>
                    <li>• Tag and organize prompts</li>
                    <li>• Share prompts publicly</li>
                    <li>• Export prompts (CSV/JSON)</li>
                    <li>• Browse public prompt directory</li>
                    <li>• View public collections</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                  <h3 className="mb-4 font-semibold text-blue-900 dark:text-blue-100">
                    🔒 Premium Features (Team/Pro)
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li>• Unlimited prompt creation</li>
                    <li>• Unlimited prompt storage</li>
                    <li>• Team collaboration (5-25 members)</li>
                    <li>• Advanced analytics</li>
                    <li>• API access</li>
                    <li>• Priority support</li>
                    <li>• Custom integrations</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <p className="text-sm text-amber-900 dark:text-amber-200">
                  <strong>Note:</strong> If you try to create a prompt and you've reached your free
                  limit, you'll see an "Upgrade to Unlock" modal with options to subscribe. The same
                  applies to other premium features.
                </p>
              </div>
            </div>
          </section>

          {/* How to Upgrade */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <CreditCard className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">How to Upgrade</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      1
                    </div>
                    <h3 className="text-lg font-semibold">Visit the Pricing Page</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Go to{' '}
                    <Link
                      href="/pricing"
                      className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      /pricing
                    </Link>{' '}
                    or click "Upgrade" when you see the paywall modal.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      2
                    </div>
                    <h3 className="text-lg font-semibold">Choose Your Plan</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select either <strong>Team ($20/month)</strong> or <strong>Pro ($99/month)</strong>{' '}
                    based on your needs. Team is perfect for small teams, while Pro includes more
                    members and advanced features.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      3
                    </div>
                    <h3 className="text-lg font-semibold">Complete Checkout</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click "Subscribe" and you'll be redirected to Stripe's secure checkout page. Enter
                    your payment information and complete the purchase.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      4
                    </div>
                    <h3 className="text-lg font-semibold">Start Using Premium Features</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Once payment is confirmed, you'll be redirected back to Prompt Manage. Your
                    subscription is immediately active, and you can start using all premium features!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Billing & Cancellations */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <RefreshCw className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Billing & Cancellations</h2>
            </div>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 font-semibold">How Billing Works</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Subscriptions are billed monthly</li>
                    <li>• Your payment method is charged automatically each month</li>
                    <li>• You receive email receipts for all charges</li>
                    <li>• Billing occurs on the same date each month</li>
                    <li>• Your subscription renews automatically</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-3 font-semibold">Managing Your Subscription</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Go to Settings → Billing</li>
                    <li>• Click "Manage Billing" to access Stripe Customer Portal</li>
                    <li>• Update payment methods</li>
                    <li>• View invoices and receipts</li>
                    <li>• Cancel or modify your subscription</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-3 font-semibold">Canceling Your Subscription</h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    You can cancel your subscription at any time:
                  </p>
                  <ol className="ml-4 list-decimal space-y-2">
                    <li>Go to Settings → Billing in your dashboard</li>
                    <li>Click "Manage Billing" to open the Stripe Customer Portal</li>
                    <li>Click "Cancel Subscription"</li>
                    <li>Confirm the cancellation</li>
                  </ol>
                  <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                    <strong>Important:</strong> Canceling your subscription means you'll lose access
                    to premium features immediately. Your subscription remains active until the end of
                    your current billing period. After that, you'll be downgraded to the Free plan.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Shield className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-2 font-semibold">How do I get a receipt?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receipts are automatically sent to your email after each payment. You can also view
                  and download invoices from the Stripe Customer Portal (Settings → Billing → Manage
                  Billing).
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-2 font-semibold">What happens if my payment fails?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  If a payment fails, Stripe will automatically retry the payment. You'll receive email
                  notifications about the failed payment. If the payment continues to fail, your
                  subscription may be suspended. Update your payment method in the Stripe Customer
                  Portal to resolve the issue.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-2 font-semibold">Can I get a refund?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Refunds are handled on a case-by-case basis. Please contact{' '}
                  <a
                    href="mailto:support@promptmanage.com"
                    className="text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    support@promptmanage.com
                  </a>{' '}
                  to request a refund. Refund requests are typically processed within 7-10 business
                  days.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-2 font-semibold">Can I change my plan later?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Yes! You can upgrade or downgrade your plan at any time from Settings → Billing →
                  Manage Billing. Changes take effect immediately, and you'll be charged or credited
                  on a prorated basis.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-2 font-semibold">Is my payment information secure?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Yes. All payments are processed securely through Stripe, which is PCI DSS Level 1
                  certified (the highest level of security certification). We never store your payment
                  card information on our servers. Your payment details are encrypted and handled by
                  Stripe's secure infrastructure.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-2 font-semibold">Do you offer annual plans?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Currently, we only offer monthly subscriptions. Annual plans may be available in the
                  future. Contact{' '}
                  <a
                    href="mailto:support@promptmanage.com"
                    className="text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    support@promptmanage.com
                  </a>{' '}
                  if you're interested in annual billing.
                </p>
              </div>
            </div>
          </section>

          {/* Stripe Customer Portal */}
          <section>
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Shield className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold">Stripe Customer Portal</h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                The Stripe Customer Portal is your self-service billing management center. From here,
                you can:
              </p>
              <ul className="ml-4 list-disc space-y-2">
                <li>Update your payment method</li>
                <li>View all invoices and receipts</li>
                <li>Download receipts for tax purposes</li>
                <li>Cancel or modify your subscription</li>
                <li>View your billing history</li>
              </ul>
              <p className="mt-4">
                <strong>Access the portal:</strong> Go to{' '}
                <Link
                  href="/settings/billing"
                  className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  Settings → Billing
                </Link>{' '}
                and click "Manage Billing".
              </p>
            </div>
          </section>

          {/* Quick Links */}
          <section>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-900/50">
              <h2 className="mb-6 text-xl font-semibold">Related Resources</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Link
                  href="/pricing"
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="mb-2 font-semibold">View Pricing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    See detailed pricing and plan features
                  </p>
                </Link>
                <Link
                  href="/settings/billing"
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="mb-2 font-semibold">Manage Billing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Access your billing settings and Stripe portal
                  </p>
                </Link>
                <Link
                  href="/terms"
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="mb-2 font-semibold">Terms of Service</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Read our terms and conditions
                  </p>
                </Link>
                <Link
                  href="/privacy"
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="mb-2 font-semibold">Privacy Policy</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learn how we protect your data
                  </p>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

