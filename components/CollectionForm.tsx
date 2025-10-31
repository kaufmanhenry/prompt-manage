'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

type Props = {
  initial?: {
    id?: string
    title?: string
    description?: string | null
    cover_image_url?: string | null
    visibility?: 'private' | 'public'
  }
  onSaved?: () => void
}

export default function CollectionForm({ initial, onSaved }: Props) {
  const { toast } = useToast()
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [cover, setCover] = useState(initial?.cover_image_url || '')
  const [visibility, setVisibility] = useState<'private' | 'public'>(initial?.visibility || 'private')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null)

    // Client-side validation
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (visibility === 'public' && !description.trim()) {
      setError('A 2-4 sentence description is required for public collections')
      return
    }

    setLoading(true)
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        cover_image_url: cover.trim() || null,
        visibility,
      }
      const res = await fetch(initial?.id ? `/api/collections/${initial.id}` : '/api/collections', {
        method: initial?.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Request failed')
      }

      toast({
        title: 'Success',
        description: initial?.id ? 'Collection updated' : 'Collection created',
      })
      onSaved?.()
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to save collection'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My collection" />
      </div>
      <div>
        <Label>
          Description {visibility === 'public' && <span className="text-primary">*</span>}
        </Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={
            visibility === 'public'
              ? 'Add a 2-4 sentence description about this collection to help others discover it. Describe what prompts are included, the use cases, and why this collection is valuable.'
              : 'What is inside this collection?'
          }
          rows={4}
          className="mt-1"
        />
        {visibility === 'public' && (
          <p className="mt-1 text-xs text-muted-foreground">
            <strong>Recommended:</strong> Write 2-4 sentences describing your collection. This helps
            others discover and understand your collection, improving SEO and engagement. Describe what
            prompts are included, the use cases, and why this collection is valuable.
          </p>
        )}
        {visibility === 'private' && (
          <p className="mt-1 text-xs text-muted-foreground">
            Optional: Add a description to help you remember what this collection contains.
          </p>
        )}
      </div>
      <div>
        <Label>Cover Image URL</Label>
        <Input value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://..." />
      </div>
      <div>
        <Label>Visibility</Label>
        <div className="flex gap-3 text-sm">
          <label className="flex items-center gap-1">
            <input type="radio" name="vis" checked={visibility === 'private'} onChange={() => setVisibility('private')} />
            Private
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="vis" checked={visibility === 'public'} onChange={() => setVisibility('public')} />
            Public
          </label>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button
        onClick={submit}
        disabled={loading || !title.trim() || (visibility === 'public' && !description.trim())}
        className="w-full"
      >
        {loading ? 'Saving…' : 'Save Collection'}
      </Button>
      {visibility === 'public' && !description.trim() && (
        <p className="text-xs text-destructive">
          A description is required for public collections to help others discover your work.
        </p>
      )}
    </div>
  )
}


