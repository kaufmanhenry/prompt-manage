import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy — Prompt Manage',
  description:
    'Comprehensive Cookie Policy for Prompt Manage. Learn how we use cookies and similar technologies.',
}

export default function CookiesPage() {
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
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">Cookie Policy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            How we use cookies and similar technologies on Prompt Manage.
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
              What Are Cookies?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Cookies are small text files that are placed on your device when you visit a website.
              They are widely used to make websites work more efficiently and provide information to
              the website owners.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              How We Use Cookies
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Prompt Manage uses cookies and similar technologies for the following purposes:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400">
              <li>
                <strong className="text-gray-900 dark:text-white">Authentication:</strong> To keep
                you signed in and maintain your session
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Preferences:</strong> To remember
                your settings, such as dark mode preference
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Security:</strong> To protect
                against unauthorized access and ensure secure transactions
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Analytics:</strong> To understand
                how visitors use our platform and improve our services
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Functionality:</strong> To enable
                features and personalize your experience
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Types of Cookies We Use
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Essential Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  These cookies are necessary for the website to function and cannot be disabled.
                  They are usually set in response to actions made by you, such as setting privacy
                  preferences or filling in forms.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Functional Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  These cookies enable enhanced functionality and personalization, such as
                  remembering your preferences and settings.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Analytics Cookies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  These cookies help us understand how visitors interact with our website by
                  collecting and reporting information anonymously.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Third-Party Cookies
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              We may use third-party services that set cookies on your device:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400">
              <li>
                <strong className="text-gray-900 dark:text-white">Supabase:</strong> For
                authentication and database services
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Stripe:</strong> For payment
                processing and subscription management
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Vercel:</strong> For hosting and
                analytics (if applicable)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Managing Cookies
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              You can control and manage cookies in various ways:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400">
              <li>
                <strong className="text-gray-900 dark:text-white">Browser Settings:</strong> Most
                browsers allow you to refuse or accept cookies. You can also delete cookies that
                have been set.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Platform Settings:</strong> Some
                preferences can be managed through your account settings on Prompt Manage.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Opt-Out:</strong> You can opt out
                of certain analytics cookies through your browser settings.
              </li>
            </ul>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Please note that disabling cookies may affect the functionality of our website and
              your ability to access certain features.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Updates to This Policy
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              We may update this Cookie Policy from time to time. We will notify you of any material
              changes by posting the new policy on this page and updating the &quot;Last
              updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              If you have questions about our use of cookies, please contact us at:{' '}
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
