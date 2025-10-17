import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Security & Privacy — Prompt Manage',
  description:
    'Learn how Prompt Manage protects your data, prompts, and intellectual property with enterprise-grade security, encryption, and compliance.',
  keywords: ['security', 'privacy', 'data protection', 'encryption', 'GDPR', 'CCPA', 'compliance'],
  openGraph: {
    title: 'Security & Privacy — Prompt Manage',
    description: 'Enterprise-grade security and privacy protection for your AI prompts and data.',
    type: 'website',
  },
}

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Security & Privacy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Enterprise-grade security and compliance for your AI prompts and data.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          {/* Data Encryption */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Data Encryption</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-base font-medium">Encryption in Transit</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All data transmitted between your browser and our servers is encrypted using TLS
                  1.3 with HTTPS-only enforcement.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-base font-medium">Encryption at Rest</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All stored data (prompts, user information, metadata) is encrypted using AES-256
                  encryption with secure key management.
                </p>
              </div>
            </div>
          </section>

          {/* Infrastructure */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Infrastructure & Reliability</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-base font-medium">Hosting</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Hosted on enterprise-grade infrastructure (Vercel and Supabase) with
                  industry-leading security certifications. Multi-region deployment in US and EU for
                  compliance and performance.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-base font-medium">Backups</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Automatic hourly backups with 30-day retention. Geo-redundant storage with backups
                  replicated across multiple regions.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-base font-medium">Uptime</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  99.9% uptime SLA for Enterprise plans with DDoS protection and enterprise-grade
                  infrastructure.
                </p>
              </div>
            </div>
          </section>

          {/* Access Controls */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Access Controls</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-base font-medium">Authentication</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  OAuth 2.0 via Google or email. SAML 2.0 SSO available for Enterprise customers.
                  Two-factor authentication coming soon.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-base font-medium">Permissions</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Granular role-based access control (Owner, Admin, Editor, Viewer) with
                  prompt-level sharing permissions and audit logs for Enterprise.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-base font-medium">Version History</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Automatic versioning on every edit with the ability to restore previous versions.
                  Soft deletes with 30-day recovery window.
                </p>
              </div>
            </div>
          </section>

          {/* Compliance */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Compliance & Certifications</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-base font-medium">GDPR</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Fully compliant with GDPR requirements for EU users, including data processing
                  agreements, right to access/export/delete, and breach notification within 72
                  hours.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-base font-medium">CCPA</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  California residents have the right to know what data we collect, delete personal
                  information, and opt-out of data sales (we never sell data).
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-base font-medium">Infrastructure Security</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Built on certified infrastructure providers (Vercel, Supabase, Stripe) that
                  maintain SOC 2 Type II, ISO 27001, and other industry certifications. See our{' '}
                  <Link
                    href="/legal-center/subprocessors"
                    className="underline hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    subprocessors page
                  </Link>{' '}
                  for details.
                </p>
              </div>
            </div>
          </section>

          {/* Data Transparency */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Data Transparency</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                We never sell your data. Your prompts, usage patterns, and personal information are
                never shared with third parties for marketing or advertising.
              </p>
              <p>
                We never train AI models on your prompts. Your intellectual property remains yours.
              </p>
              <p>
                You own your data. Export or delete all your data at any time with no lock-in or
                hidden fees.
              </p>
              <p>
                We only work with vetted, security-certified service providers. Full list available
                in our{' '}
                <Link
                  href="/legal-center/subprocessors"
                  className="underline hover:text-gray-900 dark:hover:text-gray-100"
                >
                  subprocessors page
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Related Pages */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Related Pages</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/legal-center" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Legal Trust Center</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All legal documentation and compliance certifications
                </p>
              </Link>
              <Link href="/privacy" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Privacy Policy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  How we collect, use, and protect your information
                </p>
              </Link>
              <Link href="/legal-center/dpa" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Data Protection Addendum</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  GDPR compliance and data processing agreements
                </p>
              </Link>
              <Link href="/legal-center/data-erasure" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Data Erasure Policy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  How to request deletion of your account and data
                </p>
              </Link>
              <Link href="/legal-center/subprocessors" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Subprocessors</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Third-party service providers we work with
                </p>
              </Link>
              <Link href="/accessibility" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Accessibility</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our commitment to WCAG 2.1 compliance
                </p>
              </Link>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Contact</h2>
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  Security & Legal Inquiries
                </p>
                <a
                  href="mailto:legal@promptmanage.com"
                  className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
                >
                  legal@promptmanage.com
                </a>
              </div>
              <div>
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  Vulnerability Disclosure
                </p>
                <a
                  href="mailto:security@promptmanage.com"
                  className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
                >
                  security@promptmanage.com
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
