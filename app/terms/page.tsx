import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use - Prompt Manage | Legal Terms and Conditions',
  description: 'Read Prompt Manage\'s terms of use and conditions. Learn about your rights and responsibilities when using our AI prompt management platform.',
  keywords: 'terms of use, terms and conditions, Prompt Manage legal, user agreement, AI prompt platform terms',
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
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Use - Prompt Manage | Legal Terms and Conditions',
    description: 'Read Prompt Manage\'s terms of use and conditions. Learn about your rights and responsibilities when using our AI prompt management platform.',
    url: 'https://promptmanage.com/terms',
    siteName: 'Prompt Manage',
    images: [
      {
        url: 'https://promptmanage.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Prompt Manage Terms of Use',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Use - Prompt Manage | Legal Terms and Conditions',
    description: 'Read Prompt Manage\'s terms of use and conditions.',
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
            Terms of Use
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Prompt Manage ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Prompt Manage is an AI prompt management platform that allows users to organize, store, and share AI prompts. The Service includes features for creating, editing, organizing, and sharing prompts with other users.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To use certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>

          <h2>4. User Content</h2>
          <p>
            You retain ownership of any content you submit to the Service. By submitting content, you grant us a worldwide, non-exclusive license to use, store, and display that content in connection with the Service.
          </p>

          <h2>5. Acceptable Use</h2>
          <p>
            You agree not to use the Service to:
          </p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the rights of others</li>
            <li>Upload malicious content or code</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Interfere with the proper functioning of the Service</li>
          </ul>

          <h2>6. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Prompt Manage and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>

          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            In no event shall Prompt Manage, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
          </p>

          <h2>11. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Use, please contact us at{' '}
            <a href="mailto:legal@promptmanage.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              legal@promptmanage.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 