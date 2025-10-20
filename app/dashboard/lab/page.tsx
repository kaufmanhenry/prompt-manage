'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
const Sidebar = dynamic(() => import('@/components/Sidebar').then((m) => m.Sidebar), {
  ssr: false,
  loading: () => null,
})
import SimplePromptLab from '@/components/SimplePromptLab'
import { useToast } from '@/components/ui/use-toast'
import type { Prompt } from '@/lib/schemas/prompt'
import { createClient } from '@/utils/supabase/client'

export default function LabPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

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

  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)

  // Handle URL parameter for selected prompt
  useEffect(() => {
    const promptIdFromUrl = searchParams.get('prompt')
    if (promptIdFromUrl && promptIdFromUrl !== 'new') {
      setSelectedPromptId(promptIdFromUrl)
    }
  }, [searchParams])

  // Fetch selected prompt data
  const { data: _selectedPrompt, isLoading: _isLoadingPrompt } = useQuery({
    queryKey: ['prompt', selectedPromptId],
    queryFn: async () => {
      if (!selectedPromptId || !session?.user?.id) return null

      const { data, error } = await createClient()
        .from('prompts')
        .select('*')
        .eq('id', selectedPromptId)
        .eq('user_id', session.user.id)
        .single()

      if (error) throw error
      return data as Prompt
    },
    enabled: !!selectedPromptId && !!session?.user?.id,
  })

  const _handleSavePrompt = async (promptData: {
    name: string
    prompt_text: string
    model: string
    tags: string[]
    is_public: boolean
  }) => {
    if (!session?.user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in to save prompts.',
        variant: 'destructive',
      })
      return
    }

    try {
      const { error } = await createClient()
        .from('prompts')
        .insert({
          ...promptData,
          user_id: session.user.id,
        })

      if (error) throw error

      // Invalidate queries to refresh data
      void queryClient.invalidateQueries({ queryKey: ['prompts'] })

      // Navigate to the dashboard to see the new prompt
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving prompt:', error)
      throw error // Re-throw to let PromptLab handle the toast
    }
  }

  const handleSelectPrompt = (promptId: string) => {
    setSelectedPromptId(promptId)
    router.push(`/dashboard/lab?prompt=${promptId}`)
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        prompts={prompts}
        selectedPromptId={selectedPromptId}
        onSelectPrompt={handleSelectPrompt}
        isLoading={isLoading}
        session={session}
        currentPage="lab"
      />
      <main className="flex-1 overflow-y-auto bg-accent/50 p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SimplePromptLab />
        </div>
      </main>
    </div>
  )
}
