'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { PromptDetails } from '@/components/PromptsTable'
import { PromptForm } from '@/components/PromptForm'
import { Prompt } from '@/lib/schemas/prompt'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default function DashboardPage() {
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

  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null)
  const [deleting, setDeleting] = useState(false)
  
  // State for PromptDetails component
  const [runningPrompts, setRunningPrompts] = useState<Record<string, boolean>>({})
  const [promptResponses, setPromptResponses] = useState<Record<string, string>>({})
  const [showResponses, setShowResponses] = useState<Record<string, boolean>>({})
  const [showRunHistory, setShowRunHistory] = useState(false)
  const [originalPromptSlug, setOriginalPromptSlug] = useState<string | null>(null)
  
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
  })

  // Handle URL parameter for selected prompt
  useEffect(() => {
    const promptIdFromUrl = searchParams.get('prompt')
    if (promptIdFromUrl && promptIdFromUrl !== 'new') {
      setSelectedPromptId(promptIdFromUrl)
    }
  }, [searchParams])

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId) || null

  // Fetch original prompt slug when viewing a derivative prompt
  useEffect(() => {
    const fetchOriginalPromptSlug = async () => {
      if (selectedPrompt?.parent_prompt_id) {
        try {
          const { data, error } = await createClient()
            .from('prompts')
            .select('slug')
            .eq('id', selectedPrompt.parent_prompt_id)
            .single()

          if (!error && data?.slug) {
            setOriginalPromptSlug(data.slug)
          }
        } catch (err) {
          console.error('Error fetching original prompt slug:', err)
        }
      } else {
        setOriginalPromptSlug(null)
      }
    }

    fetchOriginalPromptSlug()
  }, [selectedPrompt?.parent_prompt_id])

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
    setPromptToDelete(prompt)
    setShowDeleteDialog(true)
  }

  const handleClosePromptDetails = () => {
    setSelectedPromptId(null)
    router.replace('/dashboard')
  }

  const confirmDelete = async () => {
    if (!promptToDelete) return

    setDeleting(true)
    try {
      const { error } = await createClient()
        .from('prompts')
        .delete()
        .eq('id', promptToDelete.id)
        .eq('user_id', promptToDelete.user_id)

      if (error) throw error

      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['prompts'] })

      toast({
        title: 'Prompt Deleted',
        description: `"${promptToDelete.name}" has been permanently deleted.`,
      })

      setShowDeleteDialog(false)
      setPromptToDelete(null)

      // Close the detailed view if it's open
      if (selectedPrompt?.id === promptToDelete.id) {
        setSelectedPromptId(null)
        router.replace('/dashboard')
      }
    } catch (error) {
      console.error('Delete prompt error:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete prompt. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <Sidebar
        isLoading={isLoading}
        prompts={prompts}
        selectedPromptId={selectedPromptId}
        onSelectPrompt={handleSelectPrompt}
      />
      <main className="flex-1 overflow-y-auto bg-accent/50">
        <PromptDetails 
          prompt={selectedPrompt}
          onEdit={handleEditPrompt}
          onDelete={handleDeletePrompt}
          runningPrompts={runningPrompts}
          setRunningPrompts={setRunningPrompts}
          promptResponses={promptResponses}
          setPromptResponses={setPromptResponses}
          showResponses={showResponses}
          setShowResponses={setShowResponses}
          showRunHistory={showRunHistory}
          setShowRunHistory={setShowRunHistory}
          originalPromptSlug={originalPromptSlug}
          onClose={handleClosePromptDetails}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{promptToDelete?.name}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border p-4 bg-red-50 dark:bg-red-950">
              <h4 className="font-medium mb-2 flex items-center gap-2 text-red-800 dark:text-red-200">
                <Trash2 className="h-4 w-4" />
                Permanent Deletion
              </h4>
              <p className="text-sm text-red-600 dark:text-red-300">
                This prompt will be permanently deleted and cannot be recovered.
                If this prompt is public, it will also be removed from the
                public directory.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false)
                  setPromptToDelete(null)
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Prompt'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
