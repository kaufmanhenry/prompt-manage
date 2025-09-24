import './globals.css'

import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'

import { Layout } from '@/components/Layout'
import { PromptProvider } from '@/components/PromptContext'
import { Providers } from '@/components/providers'
import { ThemeHtmlScript } from '@/components/ThemeHtmlScript'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prompt Manage',
  description: 'Manage and organize your AI prompts',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'antialiased')}>
        <ThemeHtmlScript />
        <Providers>
          <PromptProvider>
            <Suspense fallback={null}>
              <Layout>{children}</Layout>
            </Suspense>
            <Toaster />
          </PromptProvider>
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-J61N380PQS" />
    </html>
  )
}
