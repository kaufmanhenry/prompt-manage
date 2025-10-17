import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Legal Trust Center — Prompt Manage',
  description:
    'Access all legal and compliance documentation for Prompt Manage. Transparent policies for data protection, privacy, security, and terms of service.',
  keywords: [
    'legal',
    'compliance',
    'GDPR',
    'privacy policy',
    'terms of service',
    'data protection',
  ],
  openGraph: {
    title: 'Legal Trust Center — Prompt Manage',
    description: 'Transparent legal and compliance documentation.',
    type: 'website',
  },
}

export default function LegalCenterPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Legal Trust Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            All legal documentation, compliance certifications, and data protection policies.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Last updated: October 16, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          {/* Policies */}
          <section>
            <h2 className="mb-8 text-2xl font-semibold">Policies</h2>
            <div className="space-y-6">
              <div className="border-b pb-6">
                <Link href="/terms" className="group block">
                  <h3 className="mb-2 text-base font-medium group-hover:underline">
                    Terms of Service
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your rights and responsibilities when using Prompt Manage, including account
                    responsibilities, acceptable use, and IP rights.
                  </p>
                  <p className="mt-2 text-xs text-gray-500">Updated January 2025</p>
                </Link>
              </div>

              <div className="border-b pb-6">
                <Link href="/privacy" className="group block">
                  <h3 className="mb-2 text-base font-medium group-hover:underline">
                    Privacy Policy
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    How we collect, use, and protect your personal information, and your rights to
                    access, modify, or delete your data.
                  </p>
                  <p className="mt-2 text-xs text-gray-500">Updated January 2025</p>
                </Link>
              </div>

              <div className="border-b pb-6">
                <Link href="/legal-center/dpa" className="group block">
                  <h3 className="mb-2 text-base font-medium group-hover:underline">
                    Data Protection Addendum
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    GDPR compliance, data processing agreements, lawful bases for processing, and
                    your rights under EU data protection law.
                  </p>
                  <p className="mt-2 text-xs text-gray-500">GDPR Compliant</p>
                </Link>
              </div>

              <div className="border-b pb-6">
                <Link href="/legal-center/data-erasure" className="group block">
                  <h3 className="mb-2 text-base font-medium group-hover:underline">
                    Data Erasure Policy
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Process for requesting complete deletion of your account and data, including
                    timelines and retention requirements.
                  </p>
                  <p className="mt-2 text-xs text-gray-500">Right to Delete</p>
                </Link>
              </div>

              <div className="border-b pb-6">
                <Link href="/security" className="group block">
                  <h3 className="mb-2 text-base font-medium group-hover:underline">
                    Security Overview
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enterprise-grade encryption, infrastructure security, access controls, and
                    compliance certifications.
                  </p>
                  <p className="mt-2 text-xs text-gray-500">Enterprise Infrastructure</p>
                </Link>
              </div>

              <div className="pb-6">
                <Link href="/legal-center/subprocessors" className="group block">
                  <h3 className="mb-2 text-base font-medium group-hover:underline">
                    Subprocessors
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Third-party service providers with access to customer data, including their
                    roles, locations, and security certifications.
                  </p>
                </Link>
              </div>
            </div>
          </section>

          {/* Compliance */}
          <section>
            <h2 className="mb-8 text-2xl font-semibold">Compliance</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-1 text-base font-medium">GDPR</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  EU Data Protection Compliant
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-base font-medium">CCPA</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  California Privacy Rights
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Contact</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              For legal inquiries, data processing agreements, or compliance questions, contact our
              legal team.
            </p>
            <div>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Legal & Compliance</p>
              <a
                href="mailto:legal@promptmanage.com"
                className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                legal@promptmanage.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
