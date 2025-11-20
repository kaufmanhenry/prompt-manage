'use client'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { usePathname } from '@/i18n/routing'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()
  // Handle localized paths (e.g. /en/dashboard, /zh/dashboard)
  const isDashboard = pathname?.includes('/dashboard')
  const isSettings = pathname?.includes('/settings')
  const hideHeaderFooter = isDashboard || isSettings

  return (
    <div className="flex min-h-screen flex-col">
      {!hideHeaderFooter && <Header />}
      <main className="flex-1">{children}</main>
      {!hideHeaderFooter && <Footer />}
    </div>
  )
}
