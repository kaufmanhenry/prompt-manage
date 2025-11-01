'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CheckCircle2,
  Edit,
  ExternalLink,
  FolderOpen,
  Globe,
  Lock,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import CollectionForm from '@/components/CollectionForm'
import { Sidebar } from '@/components/Sidebar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'

type Collection = {
  id: string
  title: string
  description: string | null
  visibility: 'private' | 'public'
  created_at: string
  slug?: string | null
  cover_image_url?: string | null
  tags?: string[] | null
}

type CollectionPrompt = {
  id: string
  name: string
  slug: string
  description: string | null
  model: string | null
  tags: string[] | null
  is_public: boolean
  view_count: number
  sort_order: number
}

export default function CollectionsManagerPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [collections, setCollections] = useState<Collection[]>([])
  const [selected, setSelected] = useState<Collection | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showAddPrompts, setShowAddPrompts] = useState<string | null>(null)
  const [promptSearch, setPromptSearch] = useState('')
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set())
  const [collectionSearch, setCollectionSearch] = useState('')

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  const { data: prompts = [] } = useQuery({
    queryKey: ['prompts', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('prompts')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('updated_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id,
  })

  const { data: collectionPrompts = {} } = useQuery({
    queryKey: ['collection-prompts', collections.map((c) => c.id)],
    queryFn: async () => {
      if (collections.length === 0) return {}
      const results: Record<string, CollectionPrompt[]> = {}
      await Promise.all(
        collections.map(async (c) => {
          try {
            const res = await fetch(`/api/collections/${c.id}/prompts`)
            const json = await res.json()
            results[c.id] = json.prompts || []
          } catch {
            results[c.id] = []
          }
        }),
      )
      return results
    },
    enabled: collections.length > 0,
  })

  const refresh = async () => {
    const res = await fetch('/api/collections')
    const json = await res.json()
    const collectionsWithFields = (json.collections || []).map((c: any) => ({
      ...c,
      slug: c.slug || null,
      cover_image_url: c.cover_image_url || null,
      tags: c.tags || [],
    }))
    setCollections(collectionsWithFields)
    queryClient.invalidateQueries({ queryKey: ['collection-prompts'] })
  }

  useEffect(() => {
    void refresh()
  }, [])

  const handleRemovePrompt = async (collectionId: string, promptId: string) => {
    try {
      const res = await fetch(`/api/collections/${collectionId}/prompts?prompt_id=${promptId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to remove prompt')
      toast({
        title: 'Prompt removed',
        description: 'The prompt has been removed from the collection.',
      })
      void refresh()
    } catch (error) {
      console.error('Error removing prompt:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove prompt',
        variant: 'destructive',
      })
    }
  }

  const filteredPrompts = prompts.filter((p: any) => {
    if (!promptSearch) return true
    const search = promptSearch.toLowerCase()
    return (
      (p.name || '').toLowerCase().includes(search) ||
      (p.description || '').toLowerCase().includes(search) ||
      (p.prompt_text || '').toLowerCase().includes(search) ||
      (p.tags || []).some((tag: string) => tag.toLowerCase().includes(search))
    )
  })

  const filteredCollections = collections.filter((c) => {
    if (!collectionSearch) return true
    const search = collectionSearch.toLowerCase()
    return (
      c.title.toLowerCase().includes(search) ||
      (c.description || '').toLowerCase().includes(search)
    )
  })

  const isPromptInCollection = (collectionId: string, promptId: string) => {
    return (collectionPrompts[collectionId] || []).some((cp) => cp.id === promptId)
  }

  const handleTogglePromptSelection = (promptId: string) => {
    const newSelection = new Set(selectedPrompts)
    if (newSelection.has(promptId)) {
      newSelection.delete(promptId)
    } else {
      newSelection.add(promptId)
    }
    setSelectedPrompts(newSelection)
  }

  const handleAddSelectedPrompts = async (collectionId: string) => {
    if (selectedPrompts.size === 0) {
      toast({
        title: 'No prompts selected',
        description: 'Please select at least one prompt to add.',
        variant: 'destructive',
      })
      return
    }

    try {
      const promises = Array.from(selectedPrompts).map((promptId) =>
        fetch(`/api/collections/${collectionId}/prompts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt_id: promptId }),
        }),
      )

      const results = await Promise.allSettled(promises)
      const failed = results.filter((r) => r.status === 'rejected' || !r.value?.ok)

      if (failed.length > 0) {
        toast({
          title: 'Some prompts failed',
          description: `Added ${selectedPrompts.size - failed.length} of ${selectedPrompts.size} prompts.`,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Prompts added',
          description: `Successfully added ${selectedPrompts.size} prompt${selectedPrompts.size > 1 ? 's' : ''} to the collection.`,
        })
      }

      setSelectedPrompts(new Set())
      setShowAddPrompts(null)
      void refresh()
    } catch (error) {
      console.error('Error adding prompts:', error)
      toast({
        title: 'Error',
        description: 'Failed to add prompts',
        variant: 'destructive',
      })
    }
  }

  const handleSelectAll = () => {
    const collectionId = showAddPrompts || ''
    const filteredIds = filteredPrompts
      .filter((p: any) => p.id && !isPromptInCollection(collectionId, p.id))
      .map((p: any) => p.id)
      .filter((id): id is string => id != null)
    setSelectedPrompts(new Set(filteredIds))
  }

  const handleDeselectAll = () => {
    setSelectedPrompts(new Set())
  }

  const openCreate = () => {
    setSelected(null)
    setShowForm(true)
  }

  const openEdit = (c: Collection) => {
    setSelected(c)
    setShowForm(true)
  }

  const togglePublish = async (c: Collection) => {
    try {
      const newVisibility = c.visibility === 'public' ? 'private' : 'public'
      if (newVisibility === 'public' && (!c.description?.trim())) {
        toast({
          title: 'Description required',
          description: 'Please add a description before publishing your collection.',
          variant: 'destructive',
        })
        return
      }

      const response = await fetch(`/api/collections/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: c.title,
          description: c.description?.trim() || null,
          cover_image_url: c.cover_image_url || null,
          visibility: newVisibility,
          tags: c.tags || [],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to update collection')
      }

      toast({
        title: newVisibility === 'public' ? 'Collection published!' : 'Collection unpublished',
        description:
          newVisibility === 'public'
            ? 'Your collection is now publicly visible.'
            : 'Your collection is now private.',
      })

      void refresh()
    } catch (error) {
      console.error('Publish error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update collection',
        variant: 'destructive',
      })
    }
  }

  const deleteCollection = async (id: string) => {
    try {
      const res = await fetch(`/api/collections/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete collection')
      toast({
        title: 'Collection deleted',
        description: 'The collection has been permanently deleted.',
      })
      void refresh()
    } catch (error) {
      console.error('Error deleting collection:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete collection',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        prompts={prompts}
        selectedPromptId={null}
        onSelectPrompt={() => {}}
        session={session}
        currentPage="collections"
      />
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Organize and share your prompts in curated collections
                </p>
              </div>
              <Button onClick={openCreate} size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                New Collection
              </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
                value={collectionSearch}
                onChange={(e) => setCollectionSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Collection Form */}
          {showForm && (
            <Card className="mb-8 border-2">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {selected ? 'Edit Collection' : 'Create New Collection'}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CollectionForm
                  initial={
                    selected
                      ? {
                          id: selected.id,
                          title: selected.title,
                          description: selected.description ?? undefined,
                          cover_image_url: selected.cover_image_url ?? undefined,
                          visibility: selected.visibility,
                        }
                      : undefined
                  }
                  onSaved={() => {
                    setShowForm(false)
                    void refresh()
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Collections Grid */}
          {filteredCollections.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <FolderOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  {collections.length === 0 ? 'No collections yet' : 'No collections found'}
                </h3>
                <p className="mb-6 text-center text-sm text-muted-foreground">
                  {collections.length === 0
                    ? 'Create your first collection to organize and share your prompts.'
                    : 'Try adjusting your search terms.'}
                </p>
                {collections.length === 0 && (
                  <Button onClick={openCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Collection
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCollections.map((c) => {
                const promptsInCollection = collectionPrompts[c.id] || []
                return (
                  <Card key={c.id} className="group relative overflow-hidden transition-all hover:shadow-lg">
                    {/* Cover Image */}
                    {c.cover_image_url && (
                      <div className="relative h-32 w-full overflow-hidden bg-muted">
                        <Image
                          src={c.cover_image_url}
                          alt={c.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}

                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="mb-4 flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            {c.visibility === 'public' ? (
                              <Globe className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <Badge variant={c.visibility === 'public' ? 'default' : 'secondary'} className="text-xs">
                              {c.visibility === 'public' ? 'Public' : 'Private'}
                            </Badge>
                          </div>
                          <h3 className="mb-1 text-lg font-semibold leading-tight">{c.title}</h3>
                          {c.description && (
                            <p className="line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                          )}
                        </div>

                        {/* Actions Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(c)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => togglePublish(c)}>
                              {c.visibility === 'public' ? (
                                <>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Globe className="mr-2 h-4 w-4" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            {c.visibility === 'public' && c.slug && (
                              <DropdownMenuItem asChild>
                                <Link href={`/collections/${c.slug}`} target="_blank">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Public
                                </Link>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete collection?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the collection
                                    and its mapping to prompts.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteCollection(c.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Stats & Actions */}
                      <div className="mb-4 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <FolderOpen className="h-4 w-4" />
                            {promptsInCollection.length} prompt{promptsInCollection.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <Dialog
                          open={showAddPrompts === c.id}
                          onOpenChange={(open) => {
                            setShowAddPrompts(open ? c.id : null)
                            if (!open) {
                              setSelectedPrompts(new Set())
                              setPromptSearch('')
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1.5">
                              <Plus className="h-3.5 w-3.5" />
                              Add
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Add Prompts to Collection</DialogTitle>
                              <DialogDescription>
                                Search and select prompts to add to &quot;{c.title}&quot;
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    placeholder="Search prompts..."
                                    value={promptSearch}
                                    onChange={(e) => setPromptSearch(e.target.value)}
                                    className="pl-9"
                                  />
                                </div>
                                {selectedPrompts.size > 0 && (
                                  <Button
                                    onClick={() => handleAddSelectedPrompts(c.id)}
                                    className="gap-2"
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add {selectedPrompts.size}
                                  </Button>
                                )}
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {selectedPrompts.size > 0
                                    ? `${selectedPrompts.size} selected`
                                    : 'Select prompts to add'}
                                </span>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                                    Select All
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={handleDeselectAll}>
                                    Clear
                                  </Button>
                                </div>
                              </div>
                              <div className="max-h-96 space-y-2 overflow-y-auto rounded-lg border p-2">
                                {filteredPrompts.length === 0 ? (
                                  <div className="py-8 text-center text-sm text-muted-foreground">
                                    No prompts found
                                  </div>
                                ) : (
                                  filteredPrompts.map((p: any) => {
                                    const isInCollection = isPromptInCollection(c.id, p.id)
                                    const isSelected = selectedPrompts.has(p.id)
                                    return (
                                      <div
                                        key={p.id}
                                        className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                                          isSelected
                                            ? 'border-primary bg-primary/5'
                                            : isInCollection
                                              ? 'border-muted bg-muted/30 opacity-60'
                                              : 'border-border hover:bg-muted/50'
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() => handleTogglePromptSelection(p.id)}
                                          disabled={isInCollection}
                                          className="h-4 w-4 cursor-pointer rounded disabled:cursor-not-allowed"
                                        />
                                        <div className="min-w-0 flex-1">
                                          <div className="truncate text-sm font-medium">{p.name}</div>
                                          {p.description && (
                                            <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                              {p.description}
                                            </div>
                                          )}
                                          <div className="mt-1.5 flex gap-1.5">
                                            {p.model && (
                                              <Badge variant="outline" className="text-xs">
                                                {p.model}
                                              </Badge>
                                            )}
                                            {isInCollection && (
                                              <Badge variant="secondary" className="text-xs">
                                                In collection
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {/* Prompts List */}
                      <div className="space-y-2 border-t pt-4">
                        {promptsInCollection.length > 0 ? (
                          <>
                            <div className="space-y-1.5">
                              {promptsInCollection.slice(0, 3).map((p) => (
                                <div
                                  key={p.id}
                                  className="group/prompt flex items-center justify-between rounded-md border bg-card p-2.5 transition-colors hover:bg-muted/50"
                                >
                                  <Link
                                    href={p.slug ? `/p/${p.slug}` : '/dashboard'}
                                    className="min-w-0 flex-1 hover:text-primary"
                                  >
                                    <div className="truncate text-sm font-medium">{p.name}</div>
                                    {p.model && (
                                      <Badge variant="outline" className="mt-1 text-xs">
                                        {p.model}
                                      </Badge>
                                    )}
                                  </Link>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 opacity-0 transition-opacity group-hover/prompt:opacity-100"
                                    onClick={() => handleRemovePrompt(c.id, p.id)}
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            {promptsInCollection.length > 3 && (
                              <p className="text-center text-xs text-muted-foreground">
                                +{promptsInCollection.length - 3} more prompt
                                {promptsInCollection.length - 3 !== 1 ? 's' : ''}
                              </p>
                            )}
                          </>
                        ) : (
                          <div className="py-6 text-center">
                            <p className="text-sm text-muted-foreground">No prompts yet</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2"
                              onClick={() => setShowAddPrompts(c.id)}
                            >
                              <Plus className="mr-1.5 h-3.5 w-3.5" />
                              Add prompts
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Public Link */}
                      {c.visibility === 'public' && c.slug && (
                        <div className="mt-4 rounded-lg border-2 border-emerald-500/20 bg-emerald-500/5 p-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                              Published
                            </span>
                          </div>
                          <Link
                            href={`/collections/${c.slug}`}
                            target="_blank"
                            className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                          >
                            View public collection
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
