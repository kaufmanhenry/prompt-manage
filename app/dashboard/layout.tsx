import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

  return (
    <div className="h-full bg-background">
      <main className="h-full w-full">{children}</main>
    </div>
  )
}
