import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Check for session if Supabase is configured
  let session = null
  try {
    const supabase = await createClient()
    const result = await supabase.auth.getSession()
    session = result.data.session
  } catch (_) {
    // Supabase not configured (e.g., in CI/test environment)
    // Redirect to home
    console.warn('Supabase not configured, redirecting to home')
    redirect('/')
  }

  if (!session) {
    redirect('/')
  }

  return (
    <div className="h-full bg-background">
      <main className="h-full w-full">{children}</main>
    </div>
  )
}
