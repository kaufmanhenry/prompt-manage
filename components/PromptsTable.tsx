'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Prompt } from '@/lib/schemas/prompt'
import type { PromptRunHistory } from '@/lib/schemas/prompt-run-history'
import CopyButton from './CopyButton'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  Eye,
  Share2,
  ExternalLink,
  Edit,
  Trash2,
  Lock,
  Globe,
  TrendingUp,
  X,
  FileText,
  SearchIcon,
  Plus,
  MoreVertical,
  Play,
  Link as LinkIcon,
  MessageSquare,
  Copy,
  PackageOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Spinner } from '@/components/ui/loading'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip } from '@/components/ui/tooltip'
import { ArrowUpRight } from 'lucide-react'
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Filters {
  search: string
  selectedTags: string[]
  selectedModels: string[]
}

interface PromptsTableProps {
  prompts: Prompt[]
  filters: Filters
  onEditPrompt?: (prompt: Prompt) => void
  onNewPrompt?: () => void
  onClearFilters?: () => void
  isLoading?: boolean
}

interface PromptDetailsProps {
  prompt: Prompt | null
  onEdit?: (prompt: Prompt) => void
  onDelete?: (prompt: Prompt) => void
  runningPrompts: Record<string, boolean>
  setRunningPrompts: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >
  originalPromptSlug: string | null
  onClose: () => void
}

export function PromptsTable({
  prompts = [],
  filters,
  onEditPrompt,
  onNewPrompt,
  onClearFilters,
  isLoading = false,
}: PromptsTableProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)

  const [showShareDialog, setShowShareDialog] = useState(false)
  const [promptToShare, setPromptToShare] = useState<Prompt | null>(null)
  const [sharing, setSharing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [originalPromptSlug, setOriginalPromptSlug] = useState<string | null>(
    null
  )

  // New state for running prompts
  const [runningPrompts, setRunningPrompts] = useState<Record<string, boolean>>(
    {}
  )
  const [promptResponses, setPromptResponses] = useState<
    Record<string, string>
  >({})
  const [showResponses, setShowResponses] = useState<Record<string, boolean>>(
    {}
  )

  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Debug selectedPrompt changes
  useEffect(() => {
    console.log('selectedPrompt changed:', selectedPrompt?.id)
    console.log('runningPrompts state:', runningPrompts)
  }, [selectedPrompt, runningPrompts])

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

  const handleSharePrompt = (prompt: Prompt) => {
    setPromptToShare(prompt)
    setShowShareDialog(true)
  }

  const handleTogglePublic = async (prompt: Prompt) => {
    setSharing(true)
    try {
      // Use the API route for better error handling
      const response = await fetch(`/api/prompts/${prompt.id}/share`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_public: !prompt.is_public }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update prompt')
      }

      // Invalidate and refetch to get the updated data including the generated slug
      await queryClient.invalidateQueries({ queryKey: ['prompts'] })

      toast({
        title: prompt.is_public ? 'Prompt Made Private' : 'Prompt Published!',
        description: prompt.is_public
          ? 'Your prompt is now private and no longer accessible publicly.'
          : 'Your prompt has been published and is now publicly accessible.',
      })

      setShowShareDialog(false)
      setPromptToShare(null)
    } catch (error) {
      // Check if it's a migration issue
      if (
        error instanceof Error &&
        error.message.includes('column "is_public" does not exist')
      ) {
        toast({
          title: 'Database Migration Required',
          description:
            'Please run the database migration to enable sharing functionality.',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Error',
        description: 'Failed to update prompt visibility. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setSharing(false)
    }
  }

  const handleCopyLink = async (prompt: Prompt) => {
    if (!prompt.is_public || !prompt.slug) {
      toast({
        title: 'Not Available',
        description: 'This prompt is not publicly shared.',
        variant: 'destructive',
      })
      return
    }

    try {
      const publicUrl = `${window.location.origin}/p/${prompt.slug}`
      await navigator.clipboard.writeText(publicUrl)

      toast({
        title: 'Link Copied!',
        description: 'Public link copied to clipboard.',
      })
    } catch (error) {
      console.error('Copy link error:', error)
      toast({
        title: 'Error',
        description: 'Failed to copy link. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDeletePrompt = (prompt: Prompt) => {
    setPromptToDelete(prompt)
    setShowDeleteDialog(true)
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
        setSelectedPrompt(null)
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

  // Filter prompts based on search and filters
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      !filters.search ||
      prompt.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      prompt.prompt_text.toLowerCase().includes(filters.search.toLowerCase())

    const matchesTags =
      filters.selectedTags.length === 0 ||
      filters.selectedTags.some((tag) => prompt.tags?.includes(tag))

    const matchesModels =
      filters.selectedModels.length === 0 ||
      filters.selectedModels.includes(prompt.model)

    return matchesSearch && matchesTags && matchesModels
  })

  // Show loading skeleton if data is loading
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  // Show empty state if no prompts
  if (prompts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <FileText className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No prompts yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get started by creating your first prompt. You can create prompts
            for different AI models and organize them with tags.
          </p>
          <Button onClick={onNewPrompt}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Prompt
          </Button>
        </div>
      </Card>
    )
  }

  // Show no results state if filters return no results
  if (
    filteredPrompts.length === 0 &&
    (filters.search ||
      filters.selectedTags.length > 0 ||
      filters.selectedModels.length > 0)
  ) {
    return (
      <Card className="p-12 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <SearchIcon className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No prompts found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search terms or filters to find what you&apos;re
            looking for.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              // Clear all filters
              onClearFilters?.()
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Debug Panel - only show if migration is not complete */}
      {/* Removed migration warning panel - sharing functionality is now enabled by default */}

      {selectedPrompt ? (
        <PromptDetails
          prompt={selectedPrompt}
          onEdit={onEditPrompt}
          onDelete={handleDeletePrompt}
          runningPrompts={runningPrompts}
          setRunningPrompts={setRunningPrompts}
          originalPromptSlug={originalPromptSlug}
          onClose={() => setSelectedPrompt(null)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full"
              onClick={() => setSelectedPrompt(prompt)}
              data-testid="prompt-card"
            >
              <div className="flex-grow">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold line-clamp-1 flex-1">
                      {prompt.name}
                    </h3>
                    {prompt.is_public ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 border-green-200 ml-2"
                      >
                        <Globe className="mr-1 h-3 w-3" />
                        Public
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="ml-2">
                        <Lock className="mr-1 h-3 w-3" />
                        Private
                      </Badge>
                    )}
                  </div>
                  {prompt.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {prompt.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{prompt.model}</Badge>
                    {prompt.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                    {prompt.tags && prompt.tags.length > 2 && (
                      <Badge variant="outline">+{prompt.tags.length - 2}</Badge>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <pre className="text-sm text-muted-foreground line-clamp-3">
                    {prompt.prompt_text}
                  </pre>
                </div>

                {/* Stats for public prompts */}
                {prompt.is_public && (
                  <div className="mb-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{prompt.view_count} views</span>
                    </div>
                    {prompt.slug && (
                      <Link
                        href={`/p/${prompt.slug}`}
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Public Page
                      </Link>
                    )}
                  </div>
                )}

                {/* Derivative prompt indicator */}
                {prompt.parent_prompt_id && (
                  <div className="mb-4 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                    <LinkIcon className="h-3 w-3" />
                    <span>Derivative of public prompt</span>
                  </div>
                )}
              </div>

              <div
                className="flex items-center justify-between mt-auto pt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <CopyButton text={prompt.prompt_text} />
                  <Tooltip content="Run Prompt">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        console.log(
                          'Grid run prompt button clicked for:',
                          prompt.id
                        )
                        console.log(
                          'Current runningPrompts state:',
                          runningPrompts
                        )
                        console.log(
                          'Button disabled state:',
                          runningPrompts[prompt.id as string]
                        )
                        alert(
                          'Grid button clicked! Testing basic functionality.'
                        )
                        // TODO: Implement run prompt functionality for grid view
                      }}
                      disabled={false} // Temporarily disable the disabled state for testing
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleSharePrompt(prompt)}
                      >
                        <Share2 className="mr-2 size-4" />
                        {prompt.is_public ? 'Manage Sharing' : 'Share'}
                      </DropdownMenuItem>
                      {prompt.is_public && (
                        <DropdownMenuItem
                          onClick={() => handleCopyLink(prompt)}
                        >
                          <ExternalLink className="mr-2 size-4" />
                          Copy Link
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEditPrompt?.(prompt)}>
                        <Edit className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeletePrompt(prompt)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Response Display */}
              {showResponses && showResponses[prompt.id as string] && (
                <div className="mt-4 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Tooltip content="AI Response">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </Tooltip>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowResponses((prev) => ({
                          ...prev,
                          [prompt.id as string]: false,
                        }))
                      }
                      className="p-1 h-7 w-7"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="rounded-lg bg-accent p-4">
                    {runningPrompts[prompt.id as string] ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <Spinner size="sm" />
                        Generating response...
                      </div>
                    ) : promptResponses[prompt.id as string] ? (
                      <div className="text-sm whitespace-pre-wrap">
                        {promptResponses[prompt.id as string]}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground font-medium">
                        No response yet. Click &quot;Run Prompt&quot; to
                        generate one.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {promptToShare?.is_public
                ? 'Manage Prompt Sharing'
                : 'Share Prompt'}
            </DialogTitle>
            <DialogDescription>
              {promptToShare?.is_public
                ? `"${promptToShare?.name}" is currently public`
                : `Make "${promptToShare?.name}" publicly accessible`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {promptToShare?.is_public ? (
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    Public Link Available
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Anyone with this link can view your prompt
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        promptToShare && handleCopyLink(promptToShare)
                      }
                      className="flex-1"
                    >
                      <ExternalLink className="mr-2 size-4" />
                      Copy Link
                    </Button>
                    {promptToShare?.slug && (
                      <Link href={`/p/${promptToShare.slug}`}>
                        <Button variant="outline">
                          <Eye className="size-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Make Private</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Remove this prompt from public access
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      promptToShare && handleTogglePublic(promptToShare)
                    }
                    disabled={sharing}
                    className="w-full"
                  >
                    {sharing ? 'Updating...' : 'Make Private'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">
                    Publish to Public Directory
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Make this prompt publicly accessible and discoverable
                  </p>
                  <Button
                    onClick={() =>
                      promptToShare && handleTogglePublic(promptToShare)
                    }
                    disabled={sharing}
                    className="w-full"
                  >
                    {sharing ? 'Publishing...' : 'Publish Prompt'}
                  </Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Direct Copy</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Copy the prompt text directly
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (promptToShare) {
                        navigator.clipboard.writeText(promptToShare.prompt_text)
                        toast({
                          title: 'Copied!',
                          description: 'Prompt text copied to clipboard.',
                        })
                      }
                    }}
                    className="w-full"
                  >
                    Copy Prompt Text
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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

export function PromptDetails({
  prompt,
  onEdit,
  onDelete,
  runningPrompts,
  setRunningPrompts,
  originalPromptSlug,
  onClose,
}: PromptDetailsProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [selectedRun, setSelectedRun] = useState<PromptRunHistory | null>(null)
  const [promptResponses, setPromptResponses] = useState<
    Record<string, string>
  >({})
  const [showResponses, setShowResponses] = useState<Record<string, boolean>>(
    {}
  )
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Query for prompt run history
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['prompt-run-history', prompt?.id],
    queryFn: async () => {
      if (!prompt?.id) return { success: false, history: [] }
      const response = await fetch(`/api/prompts/${prompt.id}/history?limit=50`)
      if (!response.ok) {
        throw new Error('Failed to fetch history')
      }
      return response.json()
    },
    enabled: !!prompt?.id,
  })

  const handleRunPrompt = async (prompt: Prompt) => {
    console.log('handleRunPrompt called with prompt:', prompt.id)
    const promptId = prompt.id as string
    console.log('Setting running state for promptId:', promptId)
    setRunningPrompts((prev) => ({ ...prev, [promptId]: true }))
    setShowResponses((prev) => ({ ...prev, [promptId]: true }))

    try {
      console.log('Making API request to /api/prompt/run')
      const response = await fetch('/api/prompt/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptId }),
      })

      console.log('API response status:', response.status)
      if (!response.ok) {
        const errorData = await response.json()
        console.error('API error:', errorData)
        throw new Error(errorData.error || 'Failed to run prompt')
      }

      const data = await response.json()
      console.log('API response data:', data)
      setPromptResponses((prev) => ({ ...prev, [promptId]: data.response }))

      // Refetch history to show the new run
      refetchHistory()

      toast({
        title: 'Prompt Executed',
        description: 'Your prompt has been successfully executed.',
      })
    } catch (error) {
      console.error('Run prompt error:', error)
      setPromptResponses((prev) => ({
        ...prev,
        [promptId]:
          error instanceof Error ? error.message : 'Failed to run prompt',
      }))

      toast({
        title: 'Error',
        description: 'Failed to run prompt. Please try again.',
        variant: 'destructive',
      })
    } finally {
      console.log('Clearing running state for promptId:', promptId)
      setRunningPrompts((prev) => ({ ...prev, [promptId]: false }))
    }
  }

  const handleSharePrompt = () => {
    setShowShareDialog(true)
  }

  const handleTogglePublic = async () => {
    if (!prompt) return

    setSharing(true)
    try {
      // Use the API route for better error handling
      const response = await fetch(`/api/prompts/${prompt.id}/share`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_public: !prompt.is_public }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update prompt')
      }

      // Invalidate and refetch to get the updated data including the generated slug
      await queryClient.invalidateQueries({ queryKey: ['prompts'] })

      toast({
        title: prompt.is_public ? 'Prompt Made Private' : 'Prompt Published!',
        description: prompt.is_public
          ? 'Your prompt is now private and no longer accessible publicly.'
          : 'Your prompt has been published and is now publicly accessible.',
      })

      setShowShareDialog(false)
    } catch (error) {
      // Check if it's a migration issue
      if (
        error instanceof Error &&
        error.message.includes('column "is_public" does not exist')
      ) {
        toast({
          title: 'Database Migration Required',
          description:
            'Please run the database migration to enable sharing functionality.',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Error',
        description: 'Failed to update prompt visibility. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setSharing(false)
    }
  }

  const handleCopyLink = async () => {
    if (!prompt || !prompt.is_public || !prompt.slug) {
      toast({
        title: 'Not Available',
        description: 'This prompt is not publicly shared.',
        variant: 'destructive',
      })
      return
    }

    try {
      const publicUrl = `${window.location.origin}/p/${prompt.slug}`
      await navigator.clipboard.writeText(publicUrl)

      toast({
        title: 'Link Copied!',
        description: 'Public link copied to clipboard.',
      })
    } catch (error) {
      console.error('Copy link error:', error)
      toast({
        title: 'Error',
        description: 'Failed to copy link. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleCopyResponse = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Copied to clipboard',
        description: 'Response copied to clipboard',
      })
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'timeout':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Success
          </Badge>
        )
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'timeout':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Timeout
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDuration = (ms: number | null) => {
    if (!ms) return 'N/A'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (!prompt) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center h-full text-muted-foreground text-sm font-medium">
        <PackageOpen className="h-6 w-6" />
        <p>Select a prompt to view its details.</p>
      </div>
    )
  }

  const history = historyData?.history || []

  return (
    <Card className="p-6 m-2 rounded-lg gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-semibold">{prompt.name}</h2>
            {!prompt.is_public && (
              <Badge variant="secondary">
                <Lock className="mr-1 h-3 w-3" />
                Private
              </Badge>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{prompt.model}</Badge>
            {prompt.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Run Prompt Icon Button */}
          <Tooltip content="Run Prompt">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleRunPrompt(prompt)}
              disabled={runningPrompts[prompt.id as string]}
            >
              {runningPrompts[prompt.id as string] ? (
                <Spinner size="sm" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
          </Tooltip>

          {/* Manage Sharing Icon Button */}
          <Tooltip content="Manage Sharing">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleSharePrompt()}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </Tooltip>

          {/* Edit Icon Button */}
          <Tooltip content="Edit">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit?.(prompt)}
            >
              <Edit className="h-5 w-5" />
            </Button>
          </Tooltip>

          {/* Delete Icon Button */}
          <Tooltip content="Delete">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDelete?.(prompt)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </Tooltip>

          {/* Close Icon Button */}
          <Tooltip content="Close">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Public Link Display */}
      {prompt.is_public && prompt.slug && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950 px-2 py-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-200 flex items-center gap-1 text-sm">
                <Globe className="h-4 w-4" />
                Public Link Available
              </h4>
            </div>
            <div className="flex gap-2">
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                <a
                  href={`${window.location.origin}/p/${prompt.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 dark:text-green-300 hover:underline flex items-center gap-1"
                >
                  {`${window.location.origin}/p/${prompt.slug}`}{' '}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </p>
              <Button
                variant="ghost"
                className="bg-green-100 text-green-600 dark:bg-green-950 hover:bg-green-200 dark:hover:bg-green-800"
                size="sm"
                onClick={() => handleCopyLink()}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Derivative Prompt Information */}
      {prompt.parent_prompt_id && (
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm">
                  Derivative Prompt
                </h4>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This prompt was copied from a public prompt and can be
                customized for your needs.
              </p>
            </div>
            {originalPromptSlug && (
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-800"
                onClick={() => {
                  // Navigate to the original public prompt
                  window.open(`/p/${originalPromptSlug}`, '_blank')
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Original
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Prompt Text Display */}
      <div className="relative">
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Prompt
          </p>
          <pre className="text-sm font-mono text-card-foreground whitespace-pre-wrap break-words">
            {prompt.prompt_text}
          </pre>
        </div>
        <div className="absolute top-2 right-2">
          <CopyButton text={prompt.prompt_text} />
        </div>
      </div>

      {/* Integrated Run History and Response Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <h3 className="text-lg font-semibold">Run History</h3>
            <Badge variant="outline">{history.length}</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchHistory()}
            disabled={historyLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {historyLoading ? (
          <div className="text-center py-8">
            <Spinner size="lg" />
            <p className="text-sm text-muted-foreground mt-2">
              Loading history...
            </p>
          </div>
        ) : historyError ? (
          <div className="text-center py-8">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Failed to load history</p>
            <Button
              variant="outline"
              onClick={() => refetchHistory()}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground space-y-2">
            <MessageSquare className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium text-foreground">No run history yet</p>
            <p className="text-sm text-muted-foreground">
              Run this prompt to see its history here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* History List */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Previous Runs
              </h4>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {history.map((run: PromptRunHistory) => (
                    <div
                      key={run.id}
                      className={`cursor-pointer transition-colors p-3 rounded-lg border ${
                        selectedRun?.id === run.id
                          ? 'bg-accent border-primary'
                          : 'hover:bg-accent/50'
                      }`}
                      onClick={() =>
                        setSelectedRun(selectedRun?.id === run.id ? null : run)
                      }
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(run.status)}
                          {getStatusBadge(run.status)}
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(run.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {run.execution_time_ms && (
                            <div className="flex items-center gap-1 bg-accent px-2 py-1 rounded-md">
                              <Zap className="h-3 w-3" />
                              {formatDuration(run.execution_time_ms)}
                            </div>
                          )}
                          {run.tokens_used && (
                            <div className="flex items-center gap-1 bg-accent px-2 py-1 rounded-md">
                              <Sparkles className="h-3 w-3" />
                              {run.tokens_used} tokens
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground mb-2">
                        Model: {run.model}
                      </div>

                      {run.error_message && (
                        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          Error: {run.error_message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Selected Run Details */}
            <div className="space-y-0">
              <h4 className="text-sm font-medium text-muted-foreground">
                Run Details
              </h4>
              {selectedRun ? (
                <div className="space-y-4">
                  <div>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="prompt">
                        <AccordionTrigger className="text-sm font-medium">
                          Prompt Used
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-muted p-3 rounded-lg text-sm font-mono whitespace-pre-wrap">
                            {selectedRun.prompt_text}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Response:</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyResponse(selectedRun.response)
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-muted p-3 rounded-lg text-sm whitespace-pre-wrap max-h-72 overflow-y-auto">
                      {selectedRun.response}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground bg-accent p-4 py-8 rounded-md">
                  <MessageSquare className="h-4 w-4 mx-auto mb-2" />
                  <p>Select a run to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {prompt.is_public ? 'Manage Prompt Sharing' : 'Share Prompt'}
            </DialogTitle>
            <DialogDescription>
              {prompt.is_public
                ? `"${prompt.name}" is currently public`
                : `Make "${prompt.name}" publicly accessible`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {prompt.is_public ? (
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    Public Link Available
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Anyone with this link can view your prompt
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={handleCopyLink} className="flex-1">
                      <ExternalLink className="mr-2 size-4" />
                      Copy Link
                    </Button>
                    {prompt.slug && (
                      <Link href={`/p/${prompt.slug}`}>
                        <Button variant="outline">
                          <Eye className="size-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Make Private</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Remove this prompt from public access
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleTogglePublic}
                    disabled={sharing}
                    className="w-full"
                  >
                    {sharing ? 'Updating...' : 'Make Private'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">
                    Publish to Public Directory
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Make this prompt publicly accessible and discoverable
                  </p>
                  <Button
                    onClick={handleTogglePublic}
                    disabled={sharing}
                    className="w-full"
                  >
                    {sharing ? 'Publishing...' : 'Publish Prompt'}
                  </Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Direct Copy</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Copy the prompt text directly
                  </p>
                  <CopyButton
                    text={prompt.prompt_text}
                    label="Copy Prompt Text"
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
