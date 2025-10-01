'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  Link as LinkIcon,
  Loader2,
  Lock,
  MoreVertical,
  PackageOpen,
  Play,
  Plus,
  SearchIcon,
  Share2,
  Trash2,
  TrendingUp,
  X,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip } from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import type { Prompt } from '@/lib/schemas/prompt'
import type { PromptRunHistory } from '@/lib/schemas/prompt-run-history'
import { createClient } from '@/utils/supabase/client'

import CopyButton from './CopyButton'

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
  onUpdatePrompt?: (prompt: Prompt) => void
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

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [originalPromptSlug, setOriginalPromptSlug] = useState<string | null>(null)

  const { toast } = useToast()
  const queryClient = useQueryClient()

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

    void fetchOriginalPromptSlug()
  }, [selectedPrompt?.parent_prompt_id])

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
      filters.selectedModels.length === 0 || filters.selectedModels.includes(prompt.model)

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
          <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
            <FileText className="h-12 w-12" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            No prompts yet
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Get started by creating your first prompt. You can create prompts for different AI
            models and organize them with tags.
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
    (filters.search || filters.selectedTags.length > 0 || filters.selectedModels.length > 0)
  ) {
    return (
      <Card className="p-12 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-4 h-12 w-12 text-gray-400">
            <SearchIcon className="h-12 w-12" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            No prompts found
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Try adjusting your search terms or filters to find what you&apos;re looking for.
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

  // 4. Implement handleCopyPrompt
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/p/${selectedPrompt?.slug}`)
      toast({
        title: 'Copied!',
        description: 'Prompt text copied to clipboard.',
      })
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      })
    }
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
          onUpdatePrompt={(updatedPrompt) => setSelectedPrompt(updatedPrompt)}
          originalPromptSlug={originalPromptSlug}
          onClose={() => setSelectedPrompt(null)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className="flex h-full cursor-pointer flex-col p-4 transition-shadow hover:shadow-lg"
              onClick={() => setSelectedPrompt(prompt)}
              data-testid="prompt-card"
            >
              <div className="flex-grow">
                <div className="mb-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="line-clamp-1 flex-1 text-lg font-semibold">{prompt.name}</h3>
                    {prompt.is_public ? (
                      <Badge
                        variant="default"
                        className="ml-2 border-green-200 bg-green-100 text-green-800"
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
                    <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
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
                  <pre className="line-clamp-3 text-sm text-muted-foreground">
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
                className="mt-auto flex items-center justify-between pt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <CopyButton text={prompt.prompt_text} />
                  <Tooltip content="Run Prompt">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
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
                        onClick={() => toast({ title: 'Share action not implemented yet.' })}
                      >
                        <Share2 className="mr-2 size-4" />
                        {prompt.is_public ? 'Manage Sharing' : 'Share'}
                      </DropdownMenuItem>
                      {prompt.is_public && (
                        <DropdownMenuItem onClick={() => handleCopyLink()}>
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
            </Card>
          ))}
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={false} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{/* Placeholder for Share Dialog Title */}</DialogTitle>
            <DialogDescription>{/* Placeholder for Share Dialog Description */}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">{/* Placeholder for Share Dialog Content */}</div>
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
            <div className="rounded-lg border bg-red-50 p-4 dark:bg-red-950">
              <h4 className="mb-2 flex items-center gap-2 font-medium text-red-800 dark:text-red-200">
                <Trash2 className="h-4 w-4" />
                Permanent Deletion
              </h4>
              <p className="text-sm text-red-600 dark:text-red-300">
                This prompt will be permanently deleted and cannot be recovered. If this prompt is
                public, it will also be removed from the public directory.
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
              <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete Prompt'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PromptDetailHeader({
  prompt,
  onMore,
}: {
  prompt: Prompt
  onMore: (action: string) => void
}) {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h2 className="mb-1 text-xl font-semibold">{prompt.name}</h2>
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{prompt.model}</Badge>
          {prompt.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onMore('share')}>
              <Share2 className="mr-2 h-4 w-4" /> Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMore('copy')}>
              <Copy className="mr-2 h-4 w-4" /> Copy Prompt
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMore('delete')} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMore('close')}>
              <X className="mr-2 h-4 w-4" /> Close
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export function PromptDetails({
  prompt,
  onDelete,
  onUpdatePrompt,
  originalPromptSlug,
  onClose,
}: PromptDetailsProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [runningPrompts, setRunningPrompts] = useState<Record<string, boolean>>({})
  const [currentPromptText, setCurrentPromptText] = useState(prompt?.prompt_text || '')
  const [selectedHistoryVersion, setSelectedHistoryVersion] = useState<string | null>(null)
  const [selectedRun, setSelectedRun] = useState<PromptRunHistory | null>(null)
  const [isUserEditing, setIsUserEditing] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Query for prompt run history
  const { data: historyData, refetch: refetchHistory } = useQuery({
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

  const handleRunPrompt = async (promptToRun: Prompt) => {
    setRunningPrompts((prev) => ({ ...prev, [promptToRun.id as string]: true }))
    const promptId = promptToRun.id as string

    try {
      const response = await fetch('/api/prompt/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptId,
          promptText: promptToRun.prompt_text, // Send the current prompt text
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to run prompt')
      }

      const result = await response.json()

      // Update the selected prompt with the updated text if it was modified
      if (result.prompt && result.prompt.prompt_text !== promptToRun.prompt_text) {
        onUpdatePrompt?.(result.prompt)
        setIsUserEditing(false) // Reset editing state after successful update
      }

      await refetchHistory()

      // Invalidate prompts query to refresh the prompt data after a short delay
      setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: ['prompts'] })
      }, 100)

      toast({
        title: 'Prompt Executed',
        description: 'Your prompt has been successfully executed.',
      })
    } catch (error) {
      console.error('Run prompt error:', error)
      toast({
        title: 'Error',
        description: 'Failed to run prompt. Please try again.',
        variant: 'destructive',
      })
    }
    setRunningPrompts((prev) => ({ ...prev, [promptToRun.id as string]: false }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="size-3 text-green-800" />
      case 'error':
        return <XCircle className="size-3 text-red-800" />
      case 'timeout':
        return <AlertCircle className="size-3 text-yellow-800" />
      default:
        return <AlertCircle className="size-3 text-gray-800" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge variant="default" className="gap-1.5 bg-green-100 text-green-800">
            {getStatusIcon(status)}
            Success
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="destructive" className="gap-1.5">
            {getStatusIcon(status)}
            Error
          </Badge>
        )
      case 'timeout':
        return (
          <Badge variant="secondary" className="gap-1.5 bg-yellow-100 text-yellow-800">
            {getStatusIcon(status)}
            Timeout
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  // Update current prompt text when prompt changes (only if user is not editing)
  useEffect(() => {
    if (prompt && !isUserEditing) {
      setCurrentPromptText(prompt.prompt_text)
      setSelectedHistoryVersion(null)
      setSelectedRun(null)
    }
  }, [prompt, isUserEditing]) // Update when prompt changes or editing state changes

  if (!prompt) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
        <PackageOpen className="h-6 w-6" />
        <p>Select a prompt to view its details.</p>
      </div>
    )
  }

  const history = historyData?.history || []
  const latestRun = history.length > 0 ? history[0] : null
  const displayRun = selectedRun || latestRun

  // Handler for More dropdown
  const handleMore = (action: string) => {
    if (action === 'share') handleSharePrompt()
    else if (action === 'copy') void handleCopyLink()
    else if (action === 'delete') onDelete?.(prompt)
    else if (action === 'close') onClose()
  }

  // 2. Implement handleSharePrompt and handleTogglePublic
  const handleSharePrompt = () => setShowShareDialog(true)
  const handleTogglePublic = async () => {
    if (!prompt) return
    try {
      const response = await fetch(`/api/prompts/${prompt.id}/share`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_public: !prompt.is_public }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update prompt')
      }
      await refetchHistory()
      toast({
        title: prompt.is_public ? 'Prompt Made Private' : 'Prompt Published!',
        description: prompt.is_public
          ? 'Your prompt is now private and no longer accessible publicly.'
          : 'Your prompt has been published and is now publicly accessible.',
      })
      setShowShareDialog(false)
    } catch (error) {
      console.error('Error toggling public status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update prompt visibility. Please try again.',
        variant: 'destructive',
      })
    }
  }

  // 4. Implement handleCopyPrompt
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/p/${prompt.slug}`)
      toast({
        title: 'Copied!',
        description: 'Prompt text copied to clipboard.',
      })
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="m-2 gap-6 rounded-lg p-4">
      <PromptDetailHeader prompt={prompt} onMore={handleMore} />
      {prompt.parent_prompt_id && (
        <div className="mb-4 rounded-lg bg-blue-50 p-2 dark:bg-blue-950">
          <div className="flex items-center gap-1">
            <LinkIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Derivative Prompt
            </span>
            {originalPromptSlug && (
              <Button
                variant="link"
                size="sm"
                onClick={() => window.open(`/p/${originalPromptSlug}`, '_blank')}
              >
                <ExternalLink className="mr-1 h-4 w-4" /> View Original
              </Button>
            )}
          </div>
          <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
            This prompt was copied from a public prompt and can be customized for your needs.
          </p>
        </div>
      )}

      {/* Prompt Input and Output Section */}
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        {/* Left side - Prompt Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Prompt Text</p>
            <div className="flex items-center gap-2">
              <Select
                value={selectedHistoryVersion || 'current'}
                onValueChange={(value) => {
                  if (value === 'current') {
                    setSelectedHistoryVersion(null)
                    setCurrentPromptText(prompt.prompt_text)
                    setSelectedRun(null)
                  } else {
                    const historyRun = history.find((run: PromptRunHistory) => run.id === value)
                    if (historyRun) {
                      setSelectedHistoryVersion(historyRun.id)
                      setCurrentPromptText(historyRun.prompt_text)
                      setSelectedRun(historyRun)
                    }
                  }
                }}
              >
                <SelectTrigger size="sm" className="w-[320px]">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Version</SelectItem>
                  {history.map((run: PromptRunHistory) => (
                    <SelectItem key={run.id} value={run.id}>
                      {formatTimestamp(run.created_at)} - {run.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <textarea
            value={currentPromptText}
            onChange={(e) => {
              setCurrentPromptText(e.target.value)
              setIsUserEditing(true)
            }}
            className="min-h-[200px] w-full rounded-lg border bg-background p-3 font-mono text-sm"
            placeholder="Enter your prompt here..."
          />
          <div className="flex justify-end gap-2">
            <CopyButton text={currentPromptText} />
            <Button
              onClick={() => handleRunPrompt({ ...prompt, prompt_text: currentPromptText })}
              disabled={runningPrompts[prompt.id as string]}
            >
              {runningPrompts[prompt.id as string] ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Prompt
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right side - Run Output */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              {selectedRun ? 'Selected Run Output' : 'Latest Output'}
            </p>
            {displayRun && (
              <>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-accent px-2 py-1 text-xs text-muted-foreground">
                    {formatTimestamp(displayRun.created_at)}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-end">
                  {getStatusBadge(displayRun.status)}
                  <CopyButton text={displayRun.response} />
                </div>
              </>
            )}
          </div>
          <div className="min-h-[200px] rounded-lg border bg-muted/50 p-3">
            {displayRun ? (
              <div className="space-y-3">
                <pre className="whitespace-pre-wrap break-words font-mono text-sm text-card-foreground">
                  {displayRun.response}
                </pre>
                {displayRun.error_message && (
                  <div className="rounded bg-red-50 p-2 text-xs text-red-600 dark:bg-red-950">
                    Error: {displayRun.error_message}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No runs yet. Click "Run Prompt" to execute.
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{prompt.is_public ? 'Manage Prompt Sharing' : 'Share Prompt'}</DialogTitle>
            <DialogDescription>
              {prompt.is_public
                ? `"${prompt.name}" is currently public`
                : `Make "${prompt.name}" publicly accessible`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {prompt.is_public ? (
              <div className="space-y-4">
                <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950">
                  <h4 className="mb-2 flex items-center gap-2 font-medium">
                    <Globe className="h-4 w-4 text-green-600" />
                    Public
                  </h4>
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    Anyone with this link can view your prompt
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => handleCopyLink()} className="flex-1" variant="outline">
                      <ExternalLink className="mr-2 size-4" />
                      Copy Link
                    </Button>
                    {prompt.slug && (
                      <a href={`/p/${prompt.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">
                          <ExternalLink className="size-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Make Private</h4>
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    Remove this prompt from public access
                  </p>
                  <Button variant="outline" onClick={handleTogglePublic} className="w-full">
                    {prompt.is_public ? 'Updating...' : 'Make Private'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Publish to Public Directory</h4>
                  <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    Make this prompt publicly accessible and discoverable
                  </p>
                  <Button onClick={handleTogglePublic} className="w-full">
                    {prompt.is_public ? 'Publishing...' : 'Publish Prompt'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
