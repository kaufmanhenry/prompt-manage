'use client'

import { AgentDashboard } from '@/components/AgentDashboard'
import { Sidebar } from '@/components/Sidebar'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { isAdminEmail } from '@/lib/admin'
import type { Prompt } from '@/lib/schemas/prompt'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

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

  // Check admin access
  useEffect(() => {
    if (session?.user?.email && !isAdminEmail(session.user.email)) {
      redirect('/dashboard')
    }
  }, [session])

  // Show loading while checking admin access
  if (!session) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Redirect non-admin users
  if (!isAdminEmail(session.user.email)) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    )
  }

  // Fetch user's prompts for the sidebar
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

  const handleSelectPrompt = (promptId: string) => {
    // Navigate to prompt details if needed
    console.log('Selected prompt:', promptId)
  }

  const handleNewPrompt = () => {
    // Navigate to new prompt creation
    console.log('New prompt')
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        prompts={prompts}
        selectedPromptId={null}
        onSelectPrompt={handleSelectPrompt}
        onNewPrompt={handleNewPrompt}
        isLoading={isLoading}
        currentPage="agents"
      />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6">
          <AgentDashboard />
        </div>
      </main>
    </div>
  )
}
