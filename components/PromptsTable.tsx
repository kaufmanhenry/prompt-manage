'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Prompt } from '@/lib/schemas/prompt'
import CopyButton from './CopyButton'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Eye, Share2, ExternalLink, Edit, Trash2, Lock, Globe, TrendingUp } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { createClient } from '@/utils/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

interface Filters {
  search: string
  selectedTags: string[]
  selectedModels: string[]
}

interface PromptHistory {
  timestamp: string
  prompt_text: string
}

export function PromptsTable({ 
  prompts = [], 
  filters
}: { 
  prompts: Prompt[]
  filters: Filters
}) {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [promptHistories] = useState<Record<string, PromptHistory[]>>({})
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [promptToShare, setPromptToShare] = useState<Prompt | null>(null)
  const [sharing, setSharing] = useState(false)
  const [migrationComplete, setMigrationComplete] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Check if migration is complete by testing if is_public field exists
  useEffect(() => {
    const checkMigration = async () => {
      try {
        // Try to query the is_public field
        const { error } = await createClient()
          .from('prompts')
          .select('is_public, slug, view_count')
          .limit(1)
        
        if (!error) {
          setMigrationComplete(true)
        } else {
          setMigrationComplete(false)
          
          // Show helpful error message
          if (error.message.includes('column "is_public" does not exist')) {
            toast({
              title: "Database Migration Required",
              description: "Please run the migration script in Supabase to enable sharing features.",
              variant: "destructive",
            })
          }
        }
      } catch (error) {
        console.error('Migration check error:', error)
        // Migration not complete yet
        setMigrationComplete(false)
      }
    }
    
    checkMigration()
  }, [toast])

  const handleRestoreHistory = (history: PromptHistory) => {
    if (selectedPrompt) {
      setSelectedPrompt({
        ...selectedPrompt,
        prompt_text: history.prompt_text
      })
    }
  }

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
        title: prompt.is_public ? "Prompt Made Private" : "Prompt Published!",
        description: prompt.is_public 
          ? "Your prompt is now private and no longer accessible publicly."
          : "Your prompt has been published and is now publicly accessible.",
      })

      setShowShareDialog(false)
      setPromptToShare(null)
    } catch (error) {
      // Check if it's a migration issue
      if (error instanceof Error && error.message.includes('column "is_public" does not exist')) {
        toast({
          title: "Database Migration Required",
          description: "Please run the database migration to enable sharing functionality.",
          variant: "destructive",
        })
        return
      }
      
      toast({
        title: "Error",
        description: "Failed to update prompt visibility. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSharing(false)
    }
  }

  const handleCopyLink = async (prompt: Prompt) => {
    if (!prompt.is_public || !prompt.slug) {
      toast({
        title: "Not Available",
        description: "This prompt is not publicly shared.",
        variant: "destructive",
      })
      return
    }

    try {
      const publicUrl = `${window.location.origin}/public/${prompt.slug}`
      await navigator.clipboard.writeText(publicUrl)
      
      toast({
        title: "Link Copied!",
        description: "Public link copied to clipboard.",
      })
    } catch (error) {
      console.error('Copy link error:', error)
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
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

      if (error) throw error

      queryClient.invalidateQueries({ queryKey: ['prompts'] })
      
      toast({
        title: "Prompt Deleted",
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
        title: "Error",
        description: "Failed to delete prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch = prompt.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
      prompt.prompt_text.toLowerCase().includes(filters.search.toLowerCase())
    const matchesTags = filters.selectedTags.length === 0 ||
      filters.selectedTags.some(tag => prompt.tags?.includes(tag))
    const matchesModels = filters.selectedModels.length === 0 ||
      filters.selectedModels.includes(prompt.model)
    return matchesSearch && matchesTags && matchesModels
  })

  return (
    <div className="space-y-6">
      {/* Debug Panel - only show if migration is not complete */}
      {!migrationComplete && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Sharing Features Not Available
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p className="mb-2">
                  To enable prompt sharing, you need to run the database migration in Supabase:
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Go to your Supabase dashboard</li>
                  <li>Navigate to the SQL Editor</li>
                  <li>Copy and paste the contents of <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">database-migration.sql</code></li>
                  <li>Run the script</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPrompt ? (
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-semibold">{selectedPrompt.name}</h2>
                {selectedPrompt.is_public ? (
                  <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                    <Globe className="mr-1 h-3 w-3" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <Lock className="mr-1 h-3 w-3" />
                    Private
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary">{selectedPrompt.model}</Badge>
                {selectedPrompt.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Share/Unshare Button - only show if migration is complete */}
              {migrationComplete && (
                <Button
                  variant={selectedPrompt.is_public ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleTogglePublic(selectedPrompt)}
                  disabled={sharing}
                >
                  {sharing ? (
                    "Updating..."
                  ) : selectedPrompt.is_public ? (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Make Private
                    </>
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      Share
                    </>
                  )}
                </Button>
              )}
              
              {/* Manage Sharing Button - opens full share dialog */}
              {migrationComplete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSharePrompt(selectedPrompt)}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Manage Sharing
                </Button>
              )}
              
              {/* Copy Link Button (only for public prompts) */}
              {migrationComplete && selectedPrompt.is_public && selectedPrompt.slug && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(selectedPrompt)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                <Clock className="mr-2 size-4" />
                {showHistory ? 'Hide History' : 'Show History'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPrompt(null)}
              >
                Close
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeletePrompt(selectedPrompt)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
          
          {/* Public Link Display */}
          {migrationComplete && selectedPrompt.is_public && selectedPrompt.slug && (
            <div className="mb-6 rounded-lg border bg-green-50 dark:bg-green-950 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-200 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Public Link Available
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    {`${window.location.origin}/public/${selectedPrompt.slug}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyLink(selectedPrompt)}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Link href={`/public/${selectedPrompt.slug}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
          {showHistory && (
            <div className="mb-6 rounded-lg border bg-muted/50 p-4">
              <div className="mb-3 text-sm font-medium">Prompt History</div>
              {promptHistories[String(selectedPrompt.id)] && promptHistories[String(selectedPrompt.id)].length > 0 ? (
                <ul className="space-y-3">
                  {promptHistories[String(selectedPrompt.id)].map((hist, idx) => (
                    <li key={idx} className="flex flex-col gap-2 border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {hist.timestamp ? new Date(hist.timestamp).toLocaleString() : ''}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleRestoreHistory(hist)}
                        >
                          Restore
                        </Button>
                      </div>
                      <div className="rounded-md bg-background p-2">
                        <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-words">
                          {hist.prompt_text}
                        </pre>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground">No history available.</div>
              )}
            </div>
          )}
          <div className="relative">
            <div className="rounded-lg border bg-muted/50 p-4">
              <pre className="text-sm font-mono text-card-foreground whitespace-pre-wrap break-words">
                {selectedPrompt.prompt_text}
              </pre>
            </div>
            <div className="absolute top-2 right-2">
              <CopyButton text={selectedPrompt.prompt_text} />
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <Card key={prompt.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold line-clamp-1 flex-1">{prompt.name}</h3>
                  {migrationComplete && (
                    prompt.is_public ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 ml-2">
                        <Globe className="mr-1 h-3 w-3" />
                        Public
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="ml-2">
                        <Lock className="mr-1 h-3 w-3" />
                        Private
                      </Badge>
                    )
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
                    <Badge key={tag} variant="outline">{tag}</Badge>
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
              {migrationComplete && prompt.is_public && (
                <div className="mb-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{prompt.view_count} views</span>
                  </div>
                  {prompt.slug && (
                    <Link href={`/public/${prompt.slug}`} className="text-blue-600 hover:underline">
                      View Public Page
                    </Link>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPrompt(prompt)}
                  >
                    <Eye className="mr-2 size-4" />
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Share2 className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {migrationComplete && (
                        <DropdownMenuItem onClick={() => handleSharePrompt(prompt)}>
                          <Share2 className="mr-2 size-4" />
                          {prompt.is_public ? 'Manage Sharing' : 'Share'}
                        </DropdownMenuItem>
                      )}
                      {migrationComplete && prompt.is_public && (
                        <DropdownMenuItem onClick={() => handleCopyLink(prompt)}>
                          <ExternalLink className="mr-2 size-4" />
                          Copy Link
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
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
                <div className="flex items-center gap-2">
                  <CopyButton text={prompt.prompt_text} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePrompt(prompt)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {promptToShare?.is_public ? 'Manage Prompt Sharing' : 'Share Prompt'}
            </DialogTitle>
            <DialogDescription>
              {promptToShare?.is_public 
                ? `"${promptToShare?.name}" is currently public`
                : `Make "${promptToShare?.name}" publicly accessible`
              }
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
                      onClick={() => promptToShare && handleCopyLink(promptToShare)}
                      className="flex-1"
                    >
                      <ExternalLink className="mr-2 size-4" />
                      Copy Link
                    </Button>
                    {promptToShare?.slug && (
                      <Link href={`/public/${promptToShare.slug}`}>
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
                    onClick={() => promptToShare && handleTogglePublic(promptToShare)}
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
                  <h4 className="font-medium mb-2">Publish to Public Directory</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Make this prompt publicly accessible and discoverable
                  </p>
                  <Button 
                    onClick={() => promptToShare && handleTogglePublic(promptToShare)}
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
                          title: "Copied!",
                          description: "Prompt text copied to clipboard.",
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
              Are you sure you want to delete &quot;{promptToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border p-4 bg-red-50 dark:bg-red-950">
              <h4 className="font-medium mb-2 flex items-center gap-2 text-red-800 dark:text-red-200">
                <Trash2 className="h-4 w-4" />
                Permanent Deletion
              </h4>
              <p className="text-sm text-red-600 dark:text-red-300">
                This prompt will be permanently deleted and cannot be recovered. If this prompt is public, it will also be removed from the public directory.
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