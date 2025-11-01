'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Edit,
  ExternalLink,
  FolderOpen,
  Globe,
  Lock,
  MoreVertical,
  Plus,
  Search,
  Share2,
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
import type { Prompt } from '@/lib/schemas/prompt'
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

  const { data: prompts = [] } = useQuery<Prompt[]>({
    queryKey: ['prompts', session?.user?.id],
    queryFn: async (): Promise<Prompt[]> => {
      const { data, error } = await createClient()
        .from('prompts')
        .select('id, name, prompt_text, description, model, tags, is_public, view_count, user_id, inserted_at, updated_at')
        .eq('user_id', session?.user?.id)
        .order('updated_at', { ascending: false })
      if (error) throw error
      // Ensure all required fields are present with defaults to match Prompt type
      return ((data || []) as any[]).map((p): Prompt => ({
        id: p.id,
        name: p.name || '',
        prompt_text: p.prompt_text || '',
        description: p.description || undefined,
        model: p.model || undefined,
        tags: p.tags || [],
        is_public: p.is_public ?? false,
        view_count: p.view_count || 0,
        user_id: p.user_id || '',
        inserted_at: p.inserted_at || undefined,
        updated_at: p.updated_at || undefined,
      }))
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error removing prompt:', error)
      }
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error adding prompts:', error)
      }
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Publish error:', error)
      }
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error deleting collection:', error)
      }
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
          <div className="mb-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Collections</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/60">
                  Group related prompts into organized collections. Share them with your team or publish
                  them publicly. Collections help teams manage prompts by use case, model, or project.
                </p>
              </div>
              <Button onClick={openCreate} size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                New Collection
              </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <Input
                placeholder="Search collections..."
                value={collectionSearch}
                onChange={(e) => setCollectionSearch(e.target.value)}
                className="border-border/50 bg-background pl-9"
              />
            </div>
          </div>

          {/* Collection Form */}
          {showForm && (
            <div className="mb-10 rounded-lg border border-border/50 bg-card p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {selected ? 'Edit Collection' : 'Create New Collection'}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="h-8 w-8 p-0">
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
            </div>
          )}

          {/* Collections Grid */}
          {filteredCollections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
                <FolderOpen className="h-10 w-10 text-foreground/40" />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                {collections.length === 0 ? 'No collections yet' : 'No collections found'}
              </h3>
              {collections.length === 0 ? (
                <>
                  <p className="mb-8 max-w-md text-center text-sm leading-relaxed text-foreground/60">
                    Collections help you organize prompts by use case, model, or project. Create your
                    first collection to get started.
                  </p>
                  <div className="mb-8 w-full max-w-2xl space-y-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
                      Example Collections
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { title: 'Marketing Prompts', desc: 'Social media, ads, content creation' },
                        { title: 'Code Generation', desc: 'Debugging, refactoring, documentation' },
                        { title: 'Customer Support', desc: 'Responses, FAQs, troubleshooting' },
                        { title: 'Data Analysis', desc: 'Reports, insights, visualizations' },
                      ].map((example, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-border/30 bg-background p-4 transition-colors hover:border-border/50"
                        >
                          <div className="mb-2 flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-foreground/40" />
                            <span className="text-sm font-medium text-foreground">{example.title}</span>
                          </div>
                          <p className="text-xs text-foreground/50">{example.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={openCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Collection
                  </Button>
                </>
              ) : (
                <p className="text-center text-sm text-foreground/60">
                  Try adjusting your search terms.
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCollections.map((c) => {
                const promptsInCollection = collectionPrompts[c.id] || []
                return <div
                    key={c.id}
                    className="group relative flex flex-col rounded-lg bg-card transition-colors duration-200 hover:bg-foreground/5"
                  >
                    {/* Cover Image */}
                    {c.cover_image_url && (
                      <div className="relative h-32 w-full overflow-hidden rounded-t-lg bg-muted">
                        <Image
                          src={c.cover_image_url}
                          alt={c.title}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                          unoptimized
                        />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-6">
                      {/* Header */}
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-2.5 flex items-center gap-2">
                            {c.visibility === 'public' ? (
                              <Globe className="h-3.5 w-3.5 text-foreground/50" />
                            ) : (
                              <Lock className="h-3.5 w-3.5 text-foreground/40" />
                            )}
                            <span className="text-xs font-medium uppercase tracking-wider text-foreground/50">
                              {c.visibility === 'public' ? 'Public' : 'Private'}
                            </span>
                          </div>
                          <h3 className="mb-2 text-base font-semibold leading-tight text-foreground">
                            {c.title}
                          </h3>
                          {c.description && (
                            <p className="line-clamp-2 text-sm leading-relaxed text-foreground/60">
                              {c.description}
                            </p>
                          )}
                        </div>

                        {/* Actions Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                            >
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

                      {/* Prompts List */}
                      {promptsInCollection.length > 0 && (
                        <div className="mb-4 space-y-1.5">
                          {promptsInCollection.slice(0, 3).map((p) => (
                            <div
                              key={p.id}
                              className="group/prompt flex items-center justify-between rounded px-2 py-1.5 transition-colors hover:bg-foreground/5"
                            >
                              <Link
                                href={p.slug ? `/p/${p.slug}` : '/dashboard'}
                                className="min-w-0 flex-1 hover:text-foreground"
                              >
                                <div className="truncate text-xs font-medium text-foreground/80">
                                  {p.name}
                                </div>
                                {p.model && (
                                  <span className="mt-0.5 block text-xs text-foreground/45">{p.model}</span>
                                )}
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover/prompt:opacity-100"
                                onClick={() => handleRemovePrompt(c.id, p.id)}
                                title="Remove"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          {promptsInCollection.length > 3 && (
                            <p className="pt-1 text-center text-xs text-foreground/45">
                              +{promptsInCollection.length - 3} more
                            </p>
                          )}
                        </div>
                      )}

                      {/* Stats & Actions */}
                      <div className="mb-4 mt-auto flex items-center justify-between border-t border-border/20 pt-4">
                        <div className="flex items-center gap-2 text-xs text-foreground/50">
                          <FolderOpen className="h-4 w-4" />
                          <span className="font-medium">
                            {promptsInCollection.length} prompt{promptsInCollection.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {c.visibility === 'public' && c.slug && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                              asChild
                            >
                              <Link href={`/collections/${c.slug}`} target="_blank" title="View Public">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                            title="Share"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                          </Button>
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 gap-1.5 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                                title="Add Prompts"
                              >
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
                    </div>
                  </div>
                </div>
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
