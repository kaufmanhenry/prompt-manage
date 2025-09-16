import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Privacy Policy - Prompt Manage | Data Protection and Privacy',
  description:
    "Read Prompt Manage's privacy policy to understand how we collect, use, and protect your personal information and data when using our AI prompt management platform.",
  keywords:
    'privacy policy, data protection, Prompt Manage privacy, user data, GDPR, CCPA, personal information',
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
    description:
      "Read Prompt Manage's privacy policy to understand how we collect, use, and protect your personal information and data.",
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
    description:
      "Read Prompt Manage's privacy policy to understand how we collect, use, and protect your personal information and data.",
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
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            <strong>Last Updated: June 24, 2025</strong>
          </p>
        </div>

        {/* Content */}
        <div className="rounded-lg bg-white p-8 shadow-sm dark:bg-gray-800">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              This Privacy Policy describes how Prompt Manage
              (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
              &ldquo;our&rdquo;) collects, uses, discloses, and protects your
              information when you use our website and services. By accessing or
              using our services, you agree to the terms of this Privacy Policy.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
              1. Information We Collect
            </h2>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              We collect information you provide directly to us, such as when
              you create an account, including:
            </p>
            <ul className="mb-4 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
              <li>Name and email address</li>
              <li>Account credentials and profile information</li>
              <li>Content you create, such as prompts and descriptions</li>
              <li>Communications you send to us</li>
            </ul>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Usage Information
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              We automatically collect certain information about your use of our
              services:
            </p>
            <ul className="mb-4 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Features used and interactions</li>
            </ul>

            <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
              2. How We Use Your Information
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              We use the information we collect to provide, maintain, and
              improve our services:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
              <li>Provide and personalize our services</li>
              <li>Process transactions and manage your account</li>
              <li>Communicate with you about updates and support</li>
              <li>Analyze usage patterns to improve our platform</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
              3. Use of AI Services (Free vs. Paid Accounts)
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Prompt Manage integrates with third-party artificial intelligence
              services provided by OpenAI, L.L.C. (&ldquo;OpenAI&rdquo;). For{' '}
              <strong>free account users</strong>, some content you submit
              (referred to as &ldquo;Input&rdquo;) may be shared with OpenAI as
              &ldquo;Designated Content&rdquo; and used for research,
              evaluation, model training, and improvement of OpenAI&rsquo;s
              services. OpenAI processes this content as an{' '}
              <strong>independent data controller</strong>, and it is{' '}
              <strong>
                not subject to the same protections as paid account content
              </strong>
              .
            </p>
            <ul className="mb-4 list-disc pl-6 text-sm text-gray-700 dark:text-gray-300">
              <li>
                Do not submit confidential, proprietary, or sensitive content
                through a free account. This includes:
              </li>
              <li>Protected Health Information (as defined by HIPAA)</li>
              <li>Information related to children under 13 years old</li>
              <li>Any content you do not have the legal right to submit</li>
            </ul>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              For <strong>paid accounts</strong>, Input is not shared with
              OpenAI for model training or development. Enhanced privacy
              protections and data control apply under our commercial agreements
              with OpenAI.
            </p>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              By using Prompt Manage, you confirm that you are at least 18 years
              of age. If you have questions, contact{' '}
              <a
                href="mailto:support@promptmanage.com"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                support@promptmanage.com
              </a>
              .
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
              4. Information Sharing and Disclosure
            </h2>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Public Content
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              When you choose to share prompts publicly, they become visible to
              anyone with the link. You control what content is shared and can
              make it private again at any time.
            </p>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Service Providers
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              We may share information with trusted service providers who help
              us operate our platform, such as hosting providers and analytics
              services.
            </p>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Legal Requirements
            </h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              We may disclose information if required by law or to protect our
              rights, property, or safety, or that of our users.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
              5. Data Security
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              We implement reasonable security measures to protect your
              information from unauthorized access, disclosure, alteration, or
              destruction. However, no method of transmission over the Internet
              or electronic storage is 100% secure, and we cannot guarantee
              absolute security.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
              6. Your Rights and Choices
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              You may access, update, or delete your personal information by
              logging into your account or contacting us at{' '}
              <a
                href="mailto:support@promptmanage.com"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                support@promptmanage.com
              </a>
              . We will respond to your request within a reasonable timeframe.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
              7. Children&apos;s Privacy
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Our services are not intended for children under 13. We do not
              knowingly collect personal information from children under 13. If
              you believe we have collected such information, please contact us
              so we can take appropriate action.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
              8. Changes to This Privacy Policy
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              We may update this Privacy Policy from time to time. If we make
              material changes, we will notify you by email or through our
              services. Your continued use of Prompt Manage after changes are
              posted constitutes your acceptance of the revised policy.
            </p>

            <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
              9. Contact Us
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              By email:{' '}
              <a
                href="mailto:privacy@promptmanage.com"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                privacy@promptmanage.com
              </a>
            </p>
            <hr className="my-8" />
            <div className="mt-8">
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Related Policies
              </h3>
              <ul className="list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
                <li>
                  <a
                    href="/terms"
                    className="text-blue-600 underline dark:text-blue-400"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="/dmca"
                    className="text-blue-600 underline dark:text-blue-400"
                  >
                    DMCA Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link href="/terms">
            <Button variant="outline">View Terms of Service</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
