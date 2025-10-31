'use client'

import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, FolderOpen, Plus, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import CollectionForm from '@/components/CollectionForm'
import { AddToCollectionDialog } from '@/components/AddToCollectionDialog'
import { Sidebar } from '@/components/Sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createClient } from '@/utils/supabase/client'
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

type Collection = {
  id: string
  title: string
  description: string | null
  visibility: 'private' | 'public'
  created_at: string
  slug?: string | null
  cover_image_url?: string | null
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
  const [collections, setCollections] = useState<Collection[]>([])
  const [selected, setSelected] = useState<Collection | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showAddPrompts, setShowAddPrompts] = useState<string | null>(null)
  const [promptSearch, setPromptSearch] = useState('')
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set())

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

  const handleRemovePrompt = async (collectionId: string, promptId: string) => {
    try {
      const res = await fetch(`/api/collections/${collectionId}/prompts?prompt_id=${promptId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to remove prompt')
      // Refresh data
      window.location.reload()
    } catch (error) {
      console.error('Error removing prompt:', error)
      alert('Failed to remove prompt')
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

  const isPromptInCollection = (collectionId: string, promptId: string) => {
    return (collectionPrompts[collectionId] || []).some((cp) => cp.id === promptId)
  }

  const handleAddPrompt = async (collectionId: string, promptId: string) => {
    try {
      const res = await fetch(`/api/collections/${collectionId}/prompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_id: promptId }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Failed to add prompt')
      }
      // Refresh data
      window.location.reload()
    } catch (error) {
      console.error('Error adding prompt:', error)
      alert(error instanceof Error ? error.message : 'Failed to add prompt')
    }
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
      alert('Please select at least one prompt')
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
      const failed = results.filter((r) => r.status === 'rejected' || !r.value.ok)

      if (failed.length > 0) {
        alert(`Added ${selectedPrompts.size - failed.length} prompts. ${failed.length} failed.`)
      } else {
        alert(`Successfully added ${selectedPrompts.size} prompt${selectedPrompts.size > 1 ? 's' : ''}!`)
      }

      setSelectedPrompts(new Set())
      window.location.reload()
    } catch (error) {
      console.error('Error adding prompts:', error)
      alert('Failed to add prompts')
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

  const refresh = async () => {
    const res = await fetch('/api/collections')
    const json = await res.json()
    // Ensure collections include slug and cover_image_url
    const collectionsWithSlug = (json.collections || []).map((c: any) => ({
      ...c,
      slug: c.slug || null,
      cover_image_url: c.cover_image_url || null,
    }))
    setCollections(collectionsWithSlug)
  }

  useEffect(() => {
    void refresh()
  }, [])

  const openCreate = () => {
    setSelected(null)
    setShowForm(true)
  }

  const openEdit = (c: Collection) => {
    setSelected(c)
    setShowForm(true)
  }

  const togglePublish = async (c: Collection) => {
    await fetch(`/api/collections/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visibility: c.visibility === 'public' ? 'private' : 'public' }),
    })
    void refresh()
  }

  const deleteCollection = async (id: string) => {
    await fetch(`/api/collections/${id}`, { method: 'DELETE' })
    void refresh()
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Collections</h1>
              <p className="text-muted-foreground">Organize your prompts into collections</p>
            </div>
            <Button onClick={openCreate}>New Collection</Button>
          </div>

      {showForm && (
            <Card className="mb-6 p-6">
          <CollectionForm
            initial={selected ? { id: selected.id, title: selected.title, description: selected.description ?? undefined, cover_image_url: (selected as any).cover_image_url ?? undefined, visibility: selected.visibility } : undefined}
            onSaved={() => {
              setShowForm(false)
              void refresh()
            }}
          />
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {collections.map((c) => {
          const promptsInCollection = collectionPrompts[c.id] || []
          return (
            <Card key={c.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</div>
                <Badge variant={c.visibility === 'public' ? 'default' : 'secondary'}>
                  {c.visibility === 'public' ? 'Public' : 'Private'}
                </Badge>
              </div>
              <div className="mb-1 font-semibold text-lg">{c.title}</div>
              <div className="mb-3 text-sm text-muted-foreground">{c.description}</div>

              {/* Public Link - Prominently Displayed */}
              {c.visibility === 'public' && c.slug && (
                <div className="mb-4 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Published Collection
                      </div>
                      <p className="mb-2 text-xs text-muted-foreground">
                        Your collection is live and publicly accessible. Share it to maximize traffic and
                        backlinks!
                      </p>
                      <Link
                        href={`/collections/${c.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        <span>View Public Collection →</span>
                      </Link>
                    </div>
                    <Link href={`/collections/${c.slug}`} target="_blank">
                      <Button variant="default" size="sm" className="bg-primary text-primary-foreground">
                        View Public
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Prompts in Collection */}
              <div className="mb-4 space-y-2 border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold">
                    Prompts ({promptsInCollection.length})
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
                      <Button variant="default" size="sm" className="bg-primary text-primary-foreground">
                        <Plus className="mr-1 h-4 w-4" />
                        Add Prompts
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Prompts to Collection</DialogTitle>
                        <DialogDescription>
                          Search and select prompts to add to &quot;{c.title}&quot;
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Search prompts..."
                            value={promptSearch}
                            onChange={(e) => setPromptSearch(e.target.value)}
                            className="flex-1"
                          />
                          {selectedPrompts.size > 0 && (
                            <Button
                              variant="default"
                              onClick={() => handleAddSelectedPrompts(c.id)}
                              className="bg-primary"
                            >
                              Add {selectedPrompts.size} Selected
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-muted-foreground">
                            {selectedPrompts.size > 0 ? `${selectedPrompts.size} selected` : 'Select prompts to add'}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                              Select All
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleDeselectAll}>
                              Clear
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-2">
                          {filteredPrompts.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">No prompts found</p>
                          ) : (
                            filteredPrompts.map((p: any) => {
                              const isInCollection = isPromptInCollection(c.id, p.id)
                              const isSelected = selectedPrompts.has(p.id)
                              return (
                                <div
                                  key={p.id}
                                  className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${
                                    isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleTogglePromptSelection(p.id)}
                                    disabled={isInCollection}
                                    className="h-4 w-4 rounded cursor-pointer"
                                  />
                                  <Link
                                    href={p.slug ? `/p/${p.slug}` : '/dashboard'}
                                    target="_blank"
                                    className="flex-1 hover:text-primary"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="font-semibold">{p.name}</div>
                                    {p.description && (
                                      <div className="text-sm text-muted-foreground line-clamp-1">
                                        {p.description}
                                      </div>
                                    )}
                                    <div className="flex gap-2 mt-1">
                                      {p.model && (
                                        <Badge variant="outline" className="text-xs">
                                          {p.model}
                                        </Badge>
                                      )}
                                      {isInCollection && (
                                        <Badge variant="secondary" className="text-xs">
                                          Already in collection
                                        </Badge>
                                      )}
                                    </div>
                                  </Link>
                                  {p.slug && (
                                    <Link href={`/p/${p.slug}`} target="_blank" onClick={(e) => e.stopPropagation()}>
                                      <Button variant="ghost" size="sm">
                                        Open
                                      </Button>
                                    </Link>
                                  )}
                                </div>
                              )
                            })
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {promptsInCollection.length > 0 ? (
                  <div className="space-y-2">
                    {promptsInCollection.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2 border rounded bg-muted/50"
                      >
                        <Link
                          href={p.slug ? `/p/${p.slug}` : `/dashboard`}
                          className="flex-1 hover:text-primary"
                        >
                          <div className="font-medium text-sm">{p.name}</div>
                          {p.model && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {p.model}
                            </Badge>
                          )}
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePrompt(c.id, p.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-2">
                    No prompts yet. Click &quot;Add&quot; to add prompts.
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => openEdit(c)}>
                  Edit
                </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    {c.visibility === 'public' ? 'Unpublish' : 'Publish'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm {c.visibility === 'public' ? 'Unpublish' : 'Publish'}</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will {c.visibility === 'public' ? 'hide this collection from the public.' : 'make this collection publicly visible and indexable.'}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => togglePublish(c)}>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete collection?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the collection and its mapping to prompts.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteCollection(c.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              </div>
            </Card>
          )
        })}
      </div>
        </div>
      </main>
    </div>
  )
}


