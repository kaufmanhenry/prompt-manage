'use client'

import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

  const { data: collections = [], refetch } = useQuery({
    queryKey: ['collections', session?.user?.id],
    queryFn: async () => {
      const res = await fetch('/api/collections')
      const json = await res.json()
      return json.collections || []
    },
    enabled: !!session?.user?.id && open,
  })

  const { data: collectionPrompts = [] } = useQuery({
    queryKey: ['collection-prompts', promptId],
    queryFn: async () => {
      if (!collections.length) return []
      const promises = collections.map((c: any) =>
        fetch(`/api/collections/${c.id}/prompts`)
          .then((r) => r.json())
          .then((d) => ({ collectionId: c.id, prompts: d.prompts || [] }))
          .catch(() => ({ collectionId: c.id, prompts: [] })),
      )
      return Promise.all(promises)
    },
    enabled: !!collections.length && open,
  })

  const filteredCollections = collections.filter((c: any) => {
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
    const cp = collectionPrompts.find((cp: any) => cp.collectionId === collectionId)
    return cp?.prompts.some((p: any) => p.id === promptId) || false
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

  return (
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
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add to Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <DialogDescription>
            {promptName ? `Add "${promptName}" to a collection` : 'Add prompt to a collection'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create New Collection Section - Always Visible */}
          {!showCreateForm ? (
            <Button variant="outline" className="w-full" onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Collection
            </Button>
          ) : (
            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
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
              <div className="space-y-3">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={newCollectionTitle}
                    onChange={(e) => setNewCollectionTitle(e.target.value)}
                    placeholder="My collection"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newCollectionDescription}
                    onChange={(e) => setNewCollectionDescription(e.target.value)}
                    placeholder="What is inside this collection?"
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Visibility</Label>
                  <div className="mt-1 flex gap-3 text-sm">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="new-vis"
                        checked={newCollectionVisibility === 'private'}
                        onChange={() => setNewCollectionVisibility('private')}
                      />
                      Private
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="new-vis"
                        checked={newCollectionVisibility === 'public'}
                        onChange={() => setNewCollectionVisibility('public')}
                      />
                      Public
                    </label>
                  </div>
                </div>
                <Button
                  onClick={handleCreateAndAdd}
                  disabled={!newCollectionTitle.trim() || creating}
                  className="w-full"
                >
                  {creating ? 'Creating...' : 'Create & Add Prompt'}
                </Button>
              </div>
            </div>
          )}

          {/* Divider */}
          {collections.length > 0 && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
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
              <Label>Search Collections</Label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search collections..."
                className="mt-1"
              />
            </div>
          )}

          {/* Collections List */}
          {filteredCollections.length === 0 && collections.length > 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No collections match your search.</p>
            </div>
          ) : filteredCollections.length > 0 ? (
            <div className="space-y-2">
              {filteredCollections.map((collection: any) => {
                const isInCollection = isPromptInCollection(collection.id)
                return (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{collection.title}</div>
                      {collection.description && (
                        <div className="text-sm text-muted-foreground">
                          {collection.description}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-muted-foreground">
                        {collection.visibility === 'public' ? 'Public' : 'Private'}
                      </div>
                    </div>
                    <Button
                      variant={isInCollection ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => !isInCollection && handleAddToCollection(collection.id)}
                      disabled={isInCollection || loading}
                    >
                      {isInCollection ? 'Already Added' : 'Add'}
                    </Button>
                  </div>
                )
              })}
            </div>
          ) : collections.length === 0 && !showCreateForm ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>No collections yet. Create one above to get started!</p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
