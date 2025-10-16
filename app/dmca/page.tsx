import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'DMCA Policy — Prompt Manage',
  description: 'Digital Millennium Copyright Act (DMCA) policy and procedures for Prompt Manage.',
}

export default function DmcaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Link href="/legal-center" className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            ← Legal Trust Center
          </Link>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            DMCA Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Copyright infringement notification and takedown procedures.
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
              Prompt Manage respects the intellectual property of others and asks all users to do the same. We comply with the Digital Millennium Copyright Act (DMCA) and have adopted the following Copyright Infringement Notice and Takedown Policy.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">Copyright Infringement Notification</h2>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              If you believe that content on Prompt Manage infringes your copyright, please notify our Designated Copyright Agent by mail or email.
            </p>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              Please be advised that you may be held liable for damages if you make material misrepresentations in a DMCA notice.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">Required Information</h2>
            <p className="mb-4 text-gray-900 dark:text-gray-100">All DMCA notifications must include:</p>
            <ol className="space-y-2 text-gray-900 dark:text-gray-100">
              <li>1. A physical or electronic signature of the copyright owner or authorized agent</li>
              <li>2. Identification of the copyrighted work claimed to have been infringed</li>
              <li>3. Identification of the infringing material and information to locate it</li>
              <li>4. Your contact information (address, telephone, email)</li>
              <li>5. A statement of good faith belief that the use is not authorized</li>
              <li>6. A statement that the information is accurate, under penalty of perjury</li>
            </ol>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">Send Notifications To</h2>
            <div>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Prompt Manage LLC</p>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">DMCA Agent</p>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">125 Stoughton Street, Unit 2</p>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Boston, MA 02125</p>
              <a
                href="mailto:dmca@promptmanage.com"
                className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                dmca@promptmanage.com
              </a>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">Counter-Notification</h2>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              If you believe your content was removed by mistake or misidentification, you may file a counter-notification containing:
            </p>
            <ol className="space-y-2 text-gray-900 dark:text-gray-100">
              <li>1. Your physical or electronic signature</li>
              <li>2. Identification of the material that was removed</li>
              <li>3. A statement under penalty of perjury that the material was removed by mistake</li>
              <li>4. Your name, address, and telephone number</li>
              <li>5. Consent to jurisdiction of the federal court</li>
            </ol>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">Repeat Infringers</h2>
            <p className="text-gray-900 dark:text-gray-100">
              We will terminate the accounts of users who are repeat copyright infringers.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">Related Pages</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/terms" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Terms of Service</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Acceptable use and intellectual property policies
                </p>
              </Link>
              <Link href="/privacy" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Privacy Policy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  How we collect, use, and protect your information
                </p>
              </Link>
              <Link href="/security" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Security Overview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data security and compliance measures
                </p>
              </Link>
              <Link href="/support" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Support Center</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Help articles and general support
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">Contact</h2>
            <div>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">DMCA Notifications Only</p>
              <a
                href="mailto:dmca@promptmanage.com"
                className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                dmca@promptmanage.com
              </a>
            </div>
            <div className="mt-8 text-sm">
              <Link href="/legal-center" className="underline hover:text-gray-600 dark:hover:text-gray-300">
                ← Back to Legal Trust Center
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
