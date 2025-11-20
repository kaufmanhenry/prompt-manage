import '../globals.css'

import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
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
      'Organize, test, and collaborate on AI prompts for ChatGPT, Claude & Gemini. The professional prompt management platform trusted by marketing teams and enterprises.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Prompt Manage - AI Prompt Management Platform',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@promptmanage',
    creator: '@promptmanage',
    title: 'Prompt Manage — AI Prompt Management for Teams',
    description:
      'Organize, test, and collaborate on AI prompts for ChatGPT, Claude & Gemini. Professional prompt management for teams.',
    images: ['/opengraph-image'],
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
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'zh': '/zh',
      'es': '/es',
      'ar': '/ar',
      'pt': '/pt',
      'id': '/id',
      'fr': '/fr',
      'ja': '/ja',
      'ru': '/ru',
      'de': '/de',
      'ko': '/ko',
      'tr': '/tr',
      'it': '/it',
      'vi': '/vi',
      'th': '/th',
      'pl': '/pl',
      'nl': '/nl',
      'hi': '/hi',
      'bn': '/bn',
      'fa': '/fa',
    },
  },
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
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
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
