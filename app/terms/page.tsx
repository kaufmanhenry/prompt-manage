import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — Prompt Manage',
  description:
    'Terms of Service for Prompt Manage, LLC. Users must be 18 or older.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Link href="/legal-center" className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            ← Legal Trust Center
          </Link>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Terms governing your use of Prompt Manage.
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
              Welcome to Prompt Manage, LLC, a company registered in Boston, Massachusetts, USA. These Terms of Service govern your access to and use of the Prompt Manage website, applications, and services.
            </p>
            <p className="mt-4 text-gray-900 dark:text-gray-100">
              By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-gray-900 dark:text-gray-100">
              By creating an account, accessing, or using the Prompt Manage Platform, you represent and warrant that you have read, understood, and agree to be bound by these Terms. These Terms constitute a legally binding agreement between you and Prompt Manage.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">2. Eligibility and User Accounts</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                <strong>Age Restriction:</strong> You must be at least 18 years old to register for an account and use the Platform.
              </p>
              <p>
                <strong>Account Information:</strong> You must provide accurate, complete, and current information. Failure to do so may result in immediate termination of your account.
              </p>
              <p>
                <strong>Account Security:</strong> You are responsible for safeguarding your password and for any activities under your account. Notify us immediately of any unauthorized use.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">3. Acceptable Use</h2>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              You agree to use the Platform only for lawful purposes. Prohibited activities include:
            </p>
            <ul className="space-y-2 text-gray-900 dark:text-gray-100">
              <li>• Fraudulent or illegal activity</li>
              <li>• Spamming or unsolicited advertising</li>
              <li>• Harmful, threatening, or abusive conduct</li>
              <li>• Intellectual property infringement</li>
              <li>• Introducing malicious software</li>
              <li>• Unauthorized access or system interference</li>
            </ul>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">4. Intellectual Property</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                <strong>Your Content:</strong> You retain all rights to the prompts and content you create. By making content public, you grant us a license to display and distribute it.
              </p>
              <p>
                <strong>Our Platform:</strong> The Platform and its original content, features, and functionality are owned by Prompt Manage and are protected by copyright, trademark, and other laws.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">5. Termination</h2>
            <p className="text-gray-900 dark:text-gray-100">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Platform will immediately cease.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">6. Limitation of Liability</h2>
            <p className="text-gray-900 dark:text-gray-100">
              To the maximum extent permitted by law, Prompt Manage shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Platform.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">7. Changes to Terms</h2>
            <p className="text-gray-900 dark:text-gray-100">
              We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">8. Contact</h2>
            <div>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Prompt Manage LLC</p>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">125 Stoughton Street, Unit 2</p>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Boston, MA 02125</p>
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
              <Link href="/privacy" className="underline hover:text-gray-600 dark:hover:text-gray-300">
                Privacy Policy
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
