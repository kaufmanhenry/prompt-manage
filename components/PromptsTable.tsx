'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { Prompt } from '@/lib/schemas/prompt'
import { PromptForm } from '@/components/PromptForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import CopyButton from './CopyButton'
import Tag from './Tag'

interface Filters {
  selectedTags: string[]
  selectedModels: string[]
  search?: string
}

export function PromptsTable({ prompts = [], filters, isLoading, setFilters }: { prompts?: Prompt[], filters: Filters, isLoading: boolean, setFilters?: (f: Filters) => void }) {
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const queryClient = useQueryClient()

  // Filtering logic
  const filteredPrompts = prompts.filter((prompt: Prompt) => {
    const tagMatch = !filters.selectedTags.length || filters.selectedTags.every(tag => prompt.tags.includes(tag))
    const modelMatch = !filters.selectedModels.length || filters.selectedModels.includes(prompt.model)
    const search = filters.search?.toLowerCase() || ''
    const searchMatch =
      !search ||
      prompt.name.toLowerCase().includes(search) ||
      prompt.prompt_text.toLowerCase().includes(search) ||
      prompt.model.toLowerCase().includes(search) ||
      prompt.tags.some((tag: string) => tag.toLowerCase().includes(search))
    return tagMatch && modelMatch && searchMatch
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await createClient().from('prompts').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] })
    },
  })

  const truncatePrompt = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim().length > 0)
    if (lines.length > 3) {
      return lines.slice(0, 3).join('\n') + '\n...'
    }
    return text
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Prompts</div>
        <Button onClick={() => setEditingPrompt({} as Prompt)}>New Prompt</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {filteredPrompts.map((prompt: Prompt) => (
          <Card
            key={prompt.id}
            className="flex flex-col cursor-pointer hover:shadow-lg transition"
            onClick={() => setSelectedPrompt(prompt)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{prompt.name}</CardTitle>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary inline-block">
                {prompt.model}
              </span>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="relative">
                <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-sm font-mono whitespace-pre-line">
                  {truncatePrompt(prompt.prompt_text)}
                </div>
                <CopyButton text={prompt.prompt_text} className="absolute top-2 right-2" />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {prompt.tags.map((tag, i) => (
                  <Tag
                    key={tag}
                    tag={tag}
                    index={i}
                    onClick={e => {
                      e.stopPropagation();
                      if (setFilters) {
                        setFilters({ ...filters, selectedTags: [tag] });
                      }
                    }}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={e => { e.stopPropagation(); setEditingPrompt(prompt); }}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={e => { e.stopPropagation(); deleteMutation.mutate(prompt.id ? String(prompt.id) : ''); }}
                className="flex-1"
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Popover Modal for Selected Prompt */}
      {selectedPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => { setSelectedPrompt(null); setShowHistory(false); }}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full p-6 relative animate-fade-in max-h-[90vh] overflow-y-auto"
            style={{ maxWidth: '95vw' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-lg text-muted-foreground hover:text-primary"
              onClick={() => { setSelectedPrompt(null); setShowHistory(false); }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedPrompt.name}</h2>
            <div className="mb-2 text-xs text-muted-foreground flex items-center gap-2">
              Model: <span className="font-medium">{selectedPrompt.model}</span> &middot; Last edited: {selectedPrompt.updated_at ? new Date(selectedPrompt.updated_at).toLocaleString() : '—'}
              <span className="mx-2">·</span>
              <button
                className="text-xs underline text-primary hover:text-primary/80"
                onClick={() => setShowHistory(h => !h)}
                type="button"
              >
                History
              </button>
            </div>
            {showHistory && (
              <div className="mb-4 border rounded bg-gray-50 dark:bg-gray-800 p-2 max-h-48 overflow-y-auto">
                <div className="font-semibold mb-2 text-sm">Prompt History</div>
                <div className="text-xs text-muted-foreground">No history available.</div>
              </div>
            )}
            <div className="relative mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-sm font-mono whitespace-pre-line">
                {selectedPrompt.prompt_text}
              </div>
              <CopyButton text={selectedPrompt.prompt_text} className="absolute top-2 right-2" />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedPrompt.tags.map((tag, i) => (
                <Tag
                  key={tag}
                  tag={tag}
                  index={i}
                  onClick={e => {
                    e.stopPropagation();
                    if (setFilters) {
                      setFilters({ ...filters, selectedTags: [tag] });
                    }
                    setSelectedPrompt(null);
                  }}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingPrompt(selectedPrompt)}>Edit</Button>
              <Button variant="destructive" onClick={() => { deleteMutation.mutate(selectedPrompt.id ? String(selectedPrompt.id) : ''); setSelectedPrompt(null); }}>Delete</Button>
              <Button onClick={() => setSelectedPrompt(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      <PromptForm
        prompt={editingPrompt}
        open={!!editingPrompt}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setEditingPrompt(null);
          }
        }}
      />
    </div>
  )
} 