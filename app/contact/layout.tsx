import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Prompt Manage | Get in Touch',
  description: 'Get in touch with the Prompt Manage team. We\'re here to help with support, feedback, partnerships, or any questions about our AI prompt management platform.',
  keywords: 'contact Prompt Manage, support, feedback, AI prompt management help, customer service',
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
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us - Prompt Manage | Get in Touch',
    description: 'Get in touch with the Prompt Manage team. We\'re here to help with support, feedback, partnerships, or any questions.',
    url: 'https://promptmanage.com/contact',
    siteName: 'Prompt Manage',
    images: [
      {
        url: 'https://promptmanage.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Contact Prompt Manage',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Prompt Manage | Get in Touch',
    description: 'Get in touch with the Prompt Manage team. We\'re here to help with support, feedback, partnerships, or any questions.',
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

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 