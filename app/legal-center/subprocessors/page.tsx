import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Subprocessors — Prompt Manage',
  description:
    'Complete list of third-party service providers and subprocessors used by Prompt Manage to deliver our services.',
  keywords: ['subprocessors', 'third-party services', 'data processors', 'partners', 'vendors'],
  openGraph: {
    title: 'Subprocessors — Prompt Manage',
    description: 'Transparent disclosure of all third-party service providers.',
    type: 'website',
  },
}

export default function SubprocessorsPage() {
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
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">Subprocessors</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Third-party service providers that process customer data.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Last updated: October 16, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          {/* Introduction */}
          <section>
            <p className="text-gray-600 dark:text-gray-400">
              Prompt Manage uses the following third-party service providers (subprocessors) to
              deliver our services. All subprocessors are bound by data protection agreements that
              meet or exceed GDPR requirements.
            </p>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              We will notify customers at least 30 days in advance of adding or replacing any
              subprocessor.
            </p>
          </section>

          {/* Subprocessors List */}
          <section>
            <h2 className="mb-8 text-2xl font-semibold">Current Subprocessors</h2>
            <div className="space-y-8">
              {/* Vercel */}
              <div className="border-b pb-8">
                <h3 className="mb-2 text-base font-medium">Vercel Inc.</h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Application hosting, content delivery, and edge functions
                </p>
                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="mb-1 font-medium">Location</p>
                    <p className="text-gray-600 dark:text-gray-400">United States (US-East)</p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium">Certifications</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      SOC 2 Type II, ISO 27001, GDPR Compliant
                    </p>
                  </div>
                </div>
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm underline hover:text-gray-600 dark:hover:text-gray-300"
                >
                  vercel.com
                </a>
              </div>

              {/* Supabase */}
              <div className="border-b pb-8">
                <h3 className="mb-2 text-base font-medium">Supabase Inc.</h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Database hosting, authentication, and real-time data sync
                </p>
                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="mb-1 font-medium">Location</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      United States (Multi-region available)
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium">Certifications</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      SOC 2 Type II, ISO 27001, GDPR Compliant, HIPAA Ready
                    </p>
                  </div>
                </div>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm underline hover:text-gray-600 dark:hover:text-gray-300"
                >
                  supabase.com
                </a>
              </div>

              {/* OpenAI */}
              <div className="border-b pb-8">
                <h3 className="mb-2 text-base font-medium">OpenAI LLC</h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  AI model API services for prompt execution
                </p>
                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="mb-1 font-medium">Location</p>
                    <p className="text-gray-600 dark:text-gray-400">United States</p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium">Certifications</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      SOC 2 Type II, GDPR Compliant
                    </p>
                  </div>
                </div>
                <a
                  href="https://openai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm underline hover:text-gray-600 dark:hover:text-gray-300"
                >
                  openai.com
                </a>
              </div>

              {/* Google */}
              <div className="pb-8">
                <h3 className="mb-2 text-base font-medium">Google LLC</h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  OAuth authentication and user identity verification
                </p>
                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <p className="mb-1 font-medium">Location</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      United States (Global infrastructure)
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-medium">Certifications</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      SOC 2 Type II, ISO 27001, GDPR Compliant
                    </p>
                  </div>
                </div>
                <a
                  href="https://cloud.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm underline hover:text-gray-600 dark:hover:text-gray-300"
                >
                  cloud.google.com
                </a>
              </div>
            </div>
          </section>

          {/* Change Policy */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Change Notification Policy</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                We will notify all customers via email at least 30 days before engaging a new
                subprocessor that will process customer data.
              </p>
              <p>
                Customers may object to the use of a new subprocessor on reasonable data protection
                grounds by contacting legal@promptmanage.com within 30 days of receiving
                notification.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Questions</h2>
            <div>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Legal & Compliance</p>
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
                href="/security"
                className="underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                Security
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
