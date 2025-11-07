'use client'

import { useQuery } from '@tanstack/react-query'
import { Check, Plus, Search } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'

interface AddToCollectionDialogProps {
  promptId: string
  promptName?: string
  onAdded?: () => void
}

type Collection = {
  id: string
  title: string
  description: string | null
  visibility: string
}

type CollectionPromptData = {
  collectionId: string
  prompts: Array<{ id: string }>
}

export function AddToCollectionDialog({
  promptId,
  promptName,
  onAdded,
}: AddToCollectionDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCollectionTitle, setNewCollectionTitle] = useState('')
  const [newCollectionDescription, setNewCollectionDescription] = useState('')
  const [newCollectionVisibility, setNewCollectionVisibility] = useState<'private' | 'public'>(
    'private',
  )
  const [creating, setCreating] = useState(false)

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  const { data: collections = [], refetch } = useQuery<Collection[]>({
    queryKey: ['collections', session?.user?.id],
    queryFn: async () => {
      const res = await fetch('/api/collections')
      const json = await res.json()
      return json.collections || []
    },
    enabled: !!session?.user?.id && open,
  })

  const { data: collectionPrompts = [] } = useQuery<CollectionPromptData[]>({
    queryKey: ['collection-prompts', promptId],
    queryFn: async () => {
      if (!collections.length) return []
      const promises = collections.map((c) =>
        fetch(`/api/collections/${c.id}/prompts`)
          .then((r) => r.json())
          .then((d) => ({ collectionId: c.id, prompts: d.prompts || [] }))
          .catch(() => ({ collectionId: c.id, prompts: [] })),
      )
      return Promise.all(promises)
    },
    enabled: !!collections.length && open,
  })

  const filteredCollections = collections.filter((c) => {
    if (!searchTerm) return true
    return c.title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleAddToCollection = async (collectionId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/collections/${collectionId}/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_id: promptId }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to add prompt')
      }

      toast({
        title: 'Success',
        description: 'Prompt added to collection',
      })

      void refetch()
      onAdded?.()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add prompt',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const isPromptInCollection = (collectionId: string) => {
    const cp = collectionPrompts.find((cp) => cp.collectionId === collectionId)
    return cp?.prompts.some((p) => p.id === promptId) || false
  }

  const handleCreateAndAdd = async () => {
    if (!newCollectionTitle.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a collection title',
        variant: 'destructive',
      })
      return
    }

    setCreating(true)
    try {
      // Create collection
      const createRes = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCollectionTitle.trim(),
          description: newCollectionDescription.trim() || null,
          visibility: newCollectionVisibility,
        }),
      })

      if (!createRes.ok) {
        const json = await createRes.json()
        throw new Error(json.error || 'Failed to create collection')
      }

      const { collection } = await createRes.json()

      // Add prompt to the new collection
      const addRes = await fetch(`/api/collections/${collection.id}/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_id: promptId }),
      })

      if (!addRes.ok) {
        const json = await addRes.json()
        throw new Error(json.error || 'Failed to add prompt')
      }

      toast({
        title: 'Success',
        description: 'Collection created and prompt added!',
      })

      // Reset form and refresh
      setNewCollectionTitle('')
      setNewCollectionDescription('')
      setNewCollectionVisibility('private')
      setShowCreateForm(false)
      await refetch()
      onAdded?.()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create collection',
        variant: 'destructive',
      })
    } finally {
      setCreating(false)
    }
  }

  const handleOpenDialog = async () => {
    // Check if user is authenticated
    if (!session) {
      // Persist intent and initiate Google OAuth
      const redirectAfterLogin = window.location.href
      localStorage.setItem(
        'pendingCollectionAdd',
        JSON.stringify({
          promptId,
          promptName,
          redirectUrl: redirectAfterLogin,
        }),
      )
      await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${
            process.env.NEXT_PUBLIC_SITE_URL ||
            (typeof window !== 'undefined' ? window.location.origin : '')
          }/auth/callback?redirect=${encodeURIComponent(redirectAfterLogin)}`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      })
      return
    }
    setOpen(true)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpenDialog} className="gap-2">
        <Plus className="h-4 w-4" />
        Add to Collection
      </Button>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) {
            setShowCreateForm(false)
            setSearchTerm('')
            setNewCollectionTitle('')
            setNewCollectionDescription('')
            setNewCollectionVisibility('private')
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add to Collection</DialogTitle>
            <DialogDescription className="text-base">
              {promptName ? `Add "${promptName}" to a collection` : 'Add prompt to a collection'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Create New Collection Section */}
            {!showCreateForm ? (
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4" />
                Create New Collection
              </Button>
            ) : (
              <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <Label className="text-base font-semibold">Create New Collection</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCreateForm(false)
                      setNewCollectionTitle('')
                      setNewCollectionDescription('')
                      setNewCollectionVisibility('private')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-title" className="text-sm font-medium">
                      Title *
                    </Label>
                    <Input
                      id="new-title"
                      value={newCollectionTitle}
                      onChange={(e) => setNewCollectionTitle(e.target.value)}
                      placeholder="My collection"
                      className="mt-1.5 h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-desc" className="text-sm font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="new-desc"
                      value={newCollectionDescription}
                      onChange={(e) => setNewCollectionDescription(e.target.value)}
                      placeholder="What is inside this collection?"
                      className="mt-1.5 min-h-20"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Visibility</Label>
                    <div className="mt-2 flex gap-4 text-sm">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="new-vis"
                          checked={newCollectionVisibility === 'private'}
                          onChange={() => setNewCollectionVisibility('private')}
                          className="h-4 w-4 border-border accent-primary"
                        />
                        <span>Private</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name="new-vis"
                          checked={newCollectionVisibility === 'public'}
                          onChange={() => setNewCollectionVisibility('public')}
                          className="h-4 w-4 border-border accent-primary"
                        />
                        <span>Public</span>
                      </label>
                    </div>
                  </div>
                  <Button
                    onClick={handleCreateAndAdd}
                    disabled={!newCollectionTitle.trim() || creating}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {creating ? (
                      <>Creating...</>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create & Add Prompt
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Divider */}
            {collections.length > 0 && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or add to existing collection
                  </span>
                </div>
              </div>
            )}

            {/* Search Existing Collections */}
            {collections.length > 0 && (
              <div>
                <Label htmlFor="search" className="text-sm font-medium">
                  Search Collections
                </Label>
                <div className="relative mt-1.5">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search collections..."
                    className="h-10 pl-9"
                  />
                </div>
              </div>
            )}

            {/* Collections List */}
            {filteredCollections.length === 0 && collections.length > 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                <p>No collections match your search.</p>
              </div>
            ) : filteredCollections.length > 0 ? (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select a Collection</Label>
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {filteredCollections.map((collection) => {
                    const isInCollection = isPromptInCollection(collection.id)
                    return (
                      <div
                        key={collection.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex-1 pr-4">
                          <div className="mb-1 font-semibold text-foreground">
                            {collection.title}
                          </div>
                          {collection.description && (
                            <div className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                              {collection.description}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {collection.visibility === 'public' ? 'Public' : 'Private'}
                          </div>
                        </div>
                        <Button
                          variant={isInCollection ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => !isInCollection && handleAddToCollection(collection.id)}
                          disabled={isInCollection || loading}
                          className="shrink-0 gap-2"
                        >
                          {isInCollection ? (
                            <>
                              <Check className="h-4 w-4" />
                              <span className="hidden sm:inline">Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" />
                              <span className="hidden sm:inline">Add</span>
                            </>
                          )}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : collections.length === 0 && !showCreateForm ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                <p>No collections yet. Create one above to get started!</p>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
