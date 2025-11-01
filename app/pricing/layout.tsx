import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Team & Pro Plans | Prompt Manage',
  description:
    'Choose the right plan for your team. Team plan $20/mo for small teams, Pro plan $99/mo for high-volume users. Unlimited prompts, collections, team collaboration, and priority support.',
  keywords: [
    'prompt manage pricing',
    'AI prompt management pricing',
    'team collaboration pricing',
    'prompt management plans',
    'ChatGPT prompt management cost',
    'Claude prompt management pricing',
  ],
  authors: [{ name: 'Prompt Manage' }],
  creator: 'Prompt Manage',
  publisher: 'Prompt Manage',
  metadataBase: new URL('https://promptmanage.com'),
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Pricing — Team & Pro Plans | Prompt Manage',
    description:
      'Choose the right plan for your team. Team plan $20/mo for small teams, Pro plan $99/mo for high-volume users. Unlimited prompts and collections.',
    url: 'https://promptmanage.com/pricing',
    siteName: 'Prompt Manage',
    images: [
      {
        url: 'https://promptmanage.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Prompt Manage Pricing - Team & Pro Plans',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing — Team & Pro Plans | Prompt Manage',
    description:
      'Choose the right plan for your team. Team plan $20/mo, Pro plan $99/mo. Unlimited prompts and collections.',
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

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

