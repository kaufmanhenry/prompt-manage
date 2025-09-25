'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import PromptLab from '@/components/PromptLab'
import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
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
  const { data: selectedPrompt, isLoading: isLoadingPrompt } = useQuery({
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

  const handleSavePrompt = async (promptData: {
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
      queryClient.invalidateQueries({ queryKey: ['prompts'] })
      
      // Navigate to the dashboard to see the new prompt
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving prompt:', error)
      throw error // Re-throw to let PromptLab handle the toast
    }
  }

  const handleNewPrompt = () => {
    setSelectedPromptId(null)
    router.push('/dashboard/lab')
  }

  const handleSelectPrompt = (promptId: string) => {
    setSelectedPromptId(promptId)
    router.push(`/dashboard/lab?prompt=${promptId}`)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        prompts={prompts}
        selectedPromptId={selectedPromptId}
        onSelectPrompt={handleSelectPrompt}
        onNewPrompt={handleNewPrompt}
        isLoading={isLoading}
        currentPage="lab"
      />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Prompt Lab</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Create, test, and iterate on prompts with our interactive lab environment.
            </p>
          </div>

          {isLoadingPrompt ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading prompt...</p>
              </div>
            </div>
          ) : (
            <PromptLab
              initialPrompt={selectedPrompt ? {
                id: selectedPrompt.id,
                name: selectedPrompt.name,
                prompt_text: selectedPrompt.prompt_text,
                model: selectedPrompt.model,
              } : undefined}
              onSavePrompt={handleSavePrompt}
            />
          )}
        </div>
      </main>
    </div>
  )
}
