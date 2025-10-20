'use client'

import { useQuery } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

import { AgentDashboard } from '@/components/AgentDashboard'
import { Sidebar } from '@/components/Sidebar'
import { isAdminEmail } from '@/lib/admin'
import type { Prompt } from '@/lib/schemas/prompt'
import { createClient } from '@/utils/supabase/client'

export default function AgentAdminPage() {
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  // Fetch user's prompts for the sidebar (must be called before any conditional returns)
  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('prompts')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data as Prompt[]
    },
    enabled: !!session?.user?.id,
  })

  // Check admin access
  useEffect(() => {
    if (session?.user?.email && !isAdminEmail(session.user.email)) {
      redirect('/dashboard')
    }
  }, [session])

  // Show loading while checking admin access
  if (!session) {
    return (
      <div className="flex h-screen">
        <Sidebar
          isLoading={true}
          prompts={[]}
          selectedPromptId={null}
          onSelectPrompt={() => {}}
          session={null}
          currentPage="agents"
        />
        <main className="flex flex-1 items-center justify-center bg-accent/50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  // Redirect non-admin users
  if (!isAdminEmail(session.user.email)) {
    return (
      <div className="flex h-screen">
        <Sidebar
          isLoading={isLoading}
          prompts={prompts}
          selectedPromptId={null}
          onSelectPrompt={() => {}}
          session={session}
          currentPage="agents"
        />
        <main className="flex flex-1 items-center justify-center bg-accent/50">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </main>
      </div>
    )
  }

  const handleSelectPrompt = (promptId: string) => {
    // Navigate to prompt details if needed
    console.log('Selected prompt:', promptId)
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        prompts={prompts}
        selectedPromptId={null}
        onSelectPrompt={handleSelectPrompt}
        isLoading={isLoading}
        session={session}
        currentPage="agents"
      />
      <main className="flex-1 overflow-y-auto bg-accent/50 p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <AgentDashboard />
        </div>
      </main>
    </div>
  )
}
