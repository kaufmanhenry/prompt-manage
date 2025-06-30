import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Eye, Lock, Users, Settings } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Prompt Manage | Data Protection and Privacy',
  description: 'Read Prompt Manage\'s privacy policy to understand how we collect, use, and protect your personal information and data when using our AI prompt management platform.',
  keywords: 'privacy policy, data protection, Prompt Manage privacy, user data, GDPR, CCPA, personal information',
  authors: [{ name: 'Prompt Manage' }],
  creator: 'Prompt Manage',
  publisher: 'Prompt Manage',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://promptmanage.com'),
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy - Prompt Manage | Data Protection and Privacy',
    description: 'Read Prompt Manage\'s privacy policy to understand how we collect, use, and protect your personal information and data.',
    url: 'https://promptmanage.com/privacy',
    siteName: 'Prompt Manage',
    images: [
      {
        url: 'https://promptmanage.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Prompt Manage Privacy Policy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy - Prompt Manage | Data Protection and Privacy',
    description: 'Read Prompt Manage\'s privacy policy to understand how we collect, use, and protect your personal information and data.',
    images: ['https://promptmanage.com/og-image.svg'],
    creator: '@promptmanage',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function PrivacyPage() {
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
            Privacy Policy
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
              This Privacy Policy describes how Prompt Manage (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, discloses, and protects your information when you use our website and services. By accessing or using our services, you agree to the terms of this Privacy Policy.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-blue-600" />
                1. Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Personal Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We collect information you provide directly to us, such as when you create an account, including:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-1 mt-2">
                    <li>Name and email address</li>
                    <li>Account credentials and profile information</li>
                    <li>Content you create, such as prompts and descriptions</li>
                    <li>Communications you send to us</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Usage Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We automatically collect certain information about your use of our services:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-1 mt-2">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent</li>
                    <li>Features used and interactions</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Settings className="h-6 w-6 text-green-600" />
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We use the information we collect to provide, maintain, and improve our services:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Provide and personalize our services</li>
                <li>Process transactions and manage your account</li>
                <li>Communicate with you about updates and support</li>
                <li>Analyze usage patterns to improve our platform</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* AI and Third-Party Services Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Use of AI Services (Free vs. Paid Accounts)
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Prompt Manage integrates with third-party artificial intelligence services provided by OpenAI, L.L.C. (&quot;OpenAI&quot;). For <strong>free account users</strong>, some content you submit (referred to as &quot;Input&quot;) may be shared with OpenAI as &quot;Designated Content&quot; and used for research, evaluation, model training, and improvement of OpenAI&apos;s services. OpenAI processes this content as an <strong>independent data controller</strong>, and it is <strong>not subject to the same protections as paid account content</strong>.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>⚠️ Do not submit confidential, proprietary, or sensitive content</strong> through a free account. This includes:
                </p>
                <ul className="list-disc pl-6 text-yellow-800 dark:text-yellow-200 text-sm mt-2">
                  <li>Protected Health Information (as defined by HIPAA),</li>
                  <li>Information related to children under 13 years old,</li>
                  <li>Any content you do not have the legal right to submit.</li>
                </ul>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                For <strong>paid accounts</strong>, Input is not shared with OpenAI for model training or development. Enhanced privacy protections and data control apply under our commercial agreements with OpenAI.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                By using Prompt Manage, you confirm that you are at least 18 years of age. If you have questions, contact <a href="mailto:support@promptmanage.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@promptmanage.com</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-600" />
                3. Information Sharing and Disclosure
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Public Content
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    When you choose to share prompts publicly, they become visible to anyone with the link. You control what content is shared and can make it private again at any time.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Service Providers
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We may share information with trusted service providers who help us operate our platform, such as hosting providers and analytics services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Legal Requirements
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We may disclose information if required by law or to protect our rights, property, or safety, or that of our users.
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>Important:</strong> We do not sell your personal information to third parties.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-red-600" />
                4. Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure hosting infrastructure</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security but we work hard to protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-orange-600" />
                5. Your Rights and Choices
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Access and Control
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-1 mt-2">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Delete your account and data</li>
                    <li>Export your data</li>
                    <li>Opt out of marketing communications</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Cookies and Tracking
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You can control cookies through your browser settings. However, disabling certain cookies may affect the functionality of our services.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Data Retention
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We retain your information for as long as your account is active or as needed to provide services. If you delete your account, we will delete your personal information within 30 days, except where we need to retain information for legal or legitimate business purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. International Transfers
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Children&apos;s Privacy
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Our services are not intended for children under 18. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child under 18, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. Your continued use of our services after any changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                If you have any questions about this Privacy Policy or our data practices, please contact us at{' '}
                <a href="mailto:privacy@promptmanage.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  privacy@promptmanage.com
                </a>
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link href="/terms">
            <Button variant="outline">
              View Terms of Service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 