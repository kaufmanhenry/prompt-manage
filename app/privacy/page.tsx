import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Prompt Manage',
  description:
    "Learn how Prompt Manage collects, uses, and protects your personal information and data.",
  keywords:
    'privacy policy, data protection, Prompt Manage privacy, user data, GDPR, CCPA, personal information',
  openGraph: {
    title: 'Privacy Policy — Prompt Manage',
    description: "Learn how we collect, use, and protect your personal information.",
    type: 'website',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Link href="/legal-center" className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            ← Legal Trust Center
          </Link>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            How we collect, use, and protect your information.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Last updated: June 24, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-12">
          <section>
            <p className="text-gray-900 dark:text-gray-100">
              This Privacy Policy describes how Prompt Manage collects, uses, discloses, and protects your information when you use our website and services. By accessing or using our services, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">1. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-base font-medium">Personal Information</h3>
                <p className="mb-2 text-gray-900 dark:text-gray-100">We collect information you provide directly to us:</p>
                <ul className="space-y-1 text-gray-900 dark:text-gray-100">
                  <li>• Name and email address</li>
                  <li>• Account credentials and profile information</li>
                  <li>• Content you create (prompts and descriptions)</li>
                  <li>• Communications you send to us</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Usage Information</h3>
                <p className="mb-2 text-gray-900 dark:text-gray-100">We automatically collect certain information:</p>
                <ul className="space-y-1 text-gray-900 dark:text-gray-100">
                  <li>• IP address and device information</li>
                  <li>• Browser type and version</li>
                  <li>• Pages visited and time spent</li>
                  <li>• Referring website addresses</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">2. How We Use Your Information</h2>
            <ul className="space-y-2 text-gray-900 dark:text-gray-100">
              <li>• Provide, maintain, and improve our services</li>
              <li>• Process transactions and send related information</li>
              <li>• Send technical notices and support messages</li>
              <li>• Respond to your comments and questions</li>
              <li>• Monitor and analyze trends, usage, and activities</li>
              <li>• Detect, prevent, and address technical issues and fraud</li>
            </ul>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">3. Information Sharing</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>We do not sell, trade, or rent your personal information to third parties.</p>
              <p>We may share your information only in the following circumstances:</p>
              <ul className="space-y-1">
                <li>• With service providers who assist in operating our platform</li>
                <li>• To comply with legal obligations</li>
                <li>• To protect and defend our rights and property</li>
                <li>• With your consent</li>
              </ul>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">4. Data Security</h2>
            <p className="text-gray-900 dark:text-gray-100">
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">5. Your Rights</h2>
            <p className="mb-4 text-gray-900 dark:text-gray-100">You have the right to:</p>
            <ul className="space-y-1 text-gray-900 dark:text-gray-100">
              <li>• Access your personal information</li>
              <li>• Correct inaccurate data</li>
              <li>• Request deletion of your data</li>
              <li>• Object to processing</li>
              <li>• Data portability</li>
              <li>• Withdraw consent at any time</li>
            </ul>
            <p className="mt-4 text-gray-900 dark:text-gray-100">
              To exercise these rights, contact us at{' '}
              <a href="mailto:legal@promptmanage.com" className="underline hover:text-gray-600 dark:hover:text-gray-300">
                legal@promptmanage.com
              </a>
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">6. Cookies</h2>
            <p className="text-gray-900 dark:text-gray-100">
              We use cookies and similar tracking technologies to track activity on our service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">7. Children's Privacy</h2>
            <p className="text-gray-900 dark:text-gray-100">
              Our service is not directed to individuals under 18. We do not knowingly collect personal information from children under 18.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">8. Changes to This Policy</h2>
            <p className="text-gray-900 dark:text-gray-100">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">9. Contact</h2>
            <div>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Privacy Questions</p>
              <a
                href="mailto:legal@promptmanage.com"
                className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                legal@promptmanage.com
              </a>
            </div>
            <div className="mt-8 flex gap-4 text-sm">
              <Link href="/legal-center" className="underline hover:text-gray-600 dark:hover:text-gray-300">
                Legal Trust Center
              </Link>
              <Link href="/terms" className="underline hover:text-gray-600 dark:hover:text-gray-300">
                Terms of Service
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
