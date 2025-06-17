import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("User") and Prompt Manage ("Company", "we", "us", or "our"). By accessing or using our website and services, you agree to be bound by these Terms. If you do not agree, do not use our services.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                By accessing or using Prompt Manage, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our service.
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>You must be at least 18 years old to use our services</li>
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Use of Services
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Prompt Manage provides a platform for organizing, storing, and sharing AI prompts. You agree to use our services only for lawful purposes and in accordance with these Terms.
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>You may not use our services to store or share illegal, harmful, or inappropriate content</li>
                <li>You may not attempt to gain unauthorized access to our systems</li>
                <li>You may not interfere with or disrupt the service</li>
                <li>We reserve the right to suspend or terminate your access at our sole discretion</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Content and Intellectual Property
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Your Content
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You retain ownership of the prompts you create and share. By sharing content publicly, you grant us a license to display and distribute that content through our platform.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Our Content
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    All content, trademarks, and intellectual property on this site are owned by Prompt Manage or its licensors. You may not copy, modify, distribute, or create derivative works without our express written consent.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Privacy and Data
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>We collect and process data as described in our Privacy Policy</li>
                <li>You are responsible for the content you upload and share</li>
                <li>We may use aggregated, anonymized data for service improvement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Disclaimers and Limitations
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Service Availability
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind. We do not guarantee uninterrupted access or that the service will be error-free.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Limitation of Liability
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    To the fullest extent permitted by law, Prompt Manage shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Indemnification
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                You agree to indemnify, defend, and hold harmless Prompt Manage and its affiliates from any claims, damages, liabilities, and expenses arising from your use of the services or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Termination
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We may terminate or suspend your account and access to our services at any time, with or without cause, with or without notice.
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Upon termination, your right to use the service ceases immediately</li>
                <li>We may delete your account and data at our discretion</li>
                <li>Provisions of these Terms that should survive termination will remain in effect</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Changes to Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We reserve the right to update these Terms at any time. We will notify users of material changes via email or through our service. Continued use of our services constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Governing Law
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                These Terms are governed by the laws of the Commonwealth of Massachusetts, United States. Any disputes shall be resolved exclusively in the state or federal courts located in Suffolk County, Boston, MA.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                For questions about these Terms, please contact us at{' '}
                <a href="mailto:legal@promptmanage.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  legal@promptmanage.com
                </a>
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link href="/privacy">
            <Button variant="outline">
              View Privacy Policy
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 