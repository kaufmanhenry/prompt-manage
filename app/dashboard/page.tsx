'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { PromptDetails } from '@/components/PromptsTable'
import { PromptForm } from '@/components/PromptForm'
import { Prompt } from '@/lib/schemas/prompt'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  const { data: prompts = [] } = useQuery({
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
  })

  // Handle URL parameter for selected prompt
  useEffect(() => {
    const promptIdFromUrl = searchParams.get('prompt')
    if (promptIdFromUrl && promptIdFromUrl !== 'new') {
      setSelectedPromptId(promptIdFromUrl)
    }
  }, [searchParams])

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId) || null

  const handleSelectPrompt = (promptId: string) => {
    if (promptId === 'new') {
      setShowCreateForm(true)
      setSelectedPromptId(null)
      // Update URL to remove prompt parameter
      router.replace('/dashboard')
    } else {
      setSelectedPromptId(promptId)
      // Update URL to include the selected prompt
      router.replace(`/dashboard?prompt=${promptId}`)
    }
  }

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setShowEditForm(true)
  }

  const handleCloseEditForm = () => {
    setShowEditForm(false)
    setEditingPrompt(null)
  }

  const handleCloseCreateForm = () => {
    setShowCreateForm(false)
  }

  const handleDeletePrompt = (prompt: Prompt) => {
    // Handle delete functionality if needed
    console.log('Delete prompt:', prompt)
  }

  const handleRunPrompt = (prompt: Prompt) => {
    // Handle run functionality if needed
    console.log('Run prompt:', prompt)
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <Sidebar
        prompts={prompts}
        selectedPromptId={selectedPromptId}
        onSelectPrompt={handleSelectPrompt}
      />
      <main className="flex-1 overflow-y-auto bg-accent/50">
        <PromptDetails 
          prompt={selectedPrompt}
          onEdit={handleEditPrompt}
          onDelete={handleDeletePrompt}
          onRun={handleRunPrompt}
        />
      </main>
      
      {/* Create Prompt Form */}
      <PromptForm
        prompt={null}
        open={showCreateForm}
        onOpenChange={handleCloseCreateForm}
      />
      
      {/* Edit Prompt Form */}
      <PromptForm
        prompt={editingPrompt}
        open={showEditForm}
        onOpenChange={handleCloseEditForm}
      />
    </div>
  )
}
