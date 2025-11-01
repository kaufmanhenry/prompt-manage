import './globals.css'

import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Layout } from '@/components/Layout'
import { PromptProvider } from '@/components/PromptContext'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { TeamProvider } from '@/contexts/team-context'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  metadataBase: new URL('https://promptmanage.com'),
  title: {
    default: 'Prompt Manage — AI Prompt Management for Teams',
    template: '%s | Prompt Manage',
  },
  description:
    'Professional prompt management platform for marketing teams, agencies, and enterprises. Organize, test, and collaborate on AI prompts for ChatGPT, Claude, Gemini, and more.',
  keywords: [
    'prompt management',
    'AI prompts',
    'ChatGPT prompts',
    'Claude prompts',
    'Gemini prompts',
    'prompt library',
    'prompt organization',
    'team collaboration',
    'prompt engineering',
    'AI tools',
    'marketing AI',
    'prompt database',
    'prompt directory',
  ],
  authors: [{ name: 'Prompt Manage', url: 'https://promptmanage.com' }],
  creator: 'Prompt Manage',
  publisher: 'Prompt Manage',
  applicationName: 'Prompt Manage',
  category: 'Technology',
  classification: 'Business Software',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://promptmanage.com',
    siteName: 'Prompt Manage',
    title: 'Prompt Manage — AI Prompt Management for Teams',
    description:
      'Professional prompt management platform for marketing teams, agencies, and enterprises. Organize, test, and collaborate on AI prompts.',
    images: [
      {
        url: 'https://promptmanage.com/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Prompt Manage - AI Prompt Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@promptmanage',
    creator: '@promptmanage',
    title: 'Prompt Manage — AI Prompt Management for Teams',
    description:
      'Professional prompt management platform. Organize, test, and collaborate on AI prompts for ChatGPT, Claude, Gemini, and more.',
    images: ['https://promptmanage.com/og-image.svg'],
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
  verification: {
    // Add when you have them:
    // google: 'your-google-site-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-sans antialiased')}>
        <Providers>
          <TeamProvider>
            <PromptProvider>
              <Suspense fallback={null}>
                <Layout>{children}</Layout>
              </Suspense>
              <Toaster />
            </PromptProvider>
          </TeamProvider>
        </Providers>
        <GoogleAnalytics gaId="G-J61N380PQS" />
      </body>
    </html>
  )
}
