import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Layout } from '@/components/Layout'
import { PromptProvider } from '@/components/PromptContext'
import { Toaster } from '@/components/ui/toaster'
import { ThemeHtmlScript } from '@/components/ThemeHtmlScript'
import { GoogleAnalytics } from '@next/third-parties/google'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prompt Manage',
  description: 'Manage and organize your AI prompts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'antialiased')}>
        <ThemeHtmlScript />
        <Providers>
          <PromptProvider>
            <Layout>{children}</Layout>
            <Toaster />
          </PromptProvider>
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-J61N380PQS" />
    </html>
  )
}
