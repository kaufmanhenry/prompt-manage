'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { Prompt } from '@/lib/schemas/prompt'
import { PromptForm } from '@/components/PromptForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import CopyButton from './CopyButton'
import Tag from './Tag'
import { Trash2, Share2, FileText, Link as LinkIcon } from 'lucide-react'
import { Tooltip } from './ui/tooltip'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

// Simple token counter (you can replace this with a more sophisticated implementation)
function countTokens(text: string): number {
  // This is a very basic approximation
  // In production, use a proper tokenizer like tiktoken
  return Math.ceil(text.length / 4)
}

interface Filters {
  selectedTags: string[]
  selectedModels: string[]
  search?: string
}

export function PromptsTable({ prompts = [], filters, isLoading, setFilters }: { prompts?: Prompt[], filters: Filters, isLoading: boolean, setFilters?: (f: Filters) => void }) {
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [historyPrompt, setHistoryPrompt] = useState<any>(null)
  const queryClient = useQueryClient()

  // Demo: store prompt history in local state (in real app, fetch from backend)
  const [promptHistories, setPromptHistories] = useState<{ [id: string]: any[] }>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null)

  const [editingPromptId, setEditingPromptId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<Prompt>>({})

  // Load and persist promptHistories in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('promptHistories')
    if (stored) setPromptHistories(JSON.parse(stored))
  }, [])
  useEffect(() => {
    localStorage.setItem('promptHistories', JSON.stringify(promptHistories))
  }, [promptHistories])

  // Robust history save
  const saveHistory = (prompt: Prompt) => {
    if (prompt.id) {
      const id = String(prompt.id)
      const currentHistory = promptHistories[id] || []
      setPromptHistories({
        ...promptHistories,
        [id]: [
          {
            ...prompt,
            timestamp: new Date().toISOString(),
          },
          ...currentHistory,
        ],
      })
    }
  }

  // Call saveHistory on edit, restore, duplicate
  const handleEditPrompt = (prompt: Prompt) => {
    saveHistory(prompt)
  }
  const handleRestoreHistory = (hist: any) => {
    // Optionally update the prompt in DB here
    saveHistory(hist)
    setEditingPrompt(hist)
    setShowHistory(false)
  }

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
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > 30 ? clean.slice(0, 30) + '…' : clean;
  }

  // Accessible color for tags
  const tagColor = (selected: boolean) => selected
    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
    : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100 shadow-sm';
  const modelColor = (selected: boolean) => selected
    ? 'bg-green-600 text-white border-green-600 shadow-sm'
    : 'bg-green-50 text-green-900 border-green-200 hover:bg-green-100 shadow-sm';

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filter chip above grid */}
      <div className="flex gap-2 items-center min-h-[2.5rem]">
        {filters.selectedTags.length > 0 && (
          <span className="rounded-full px-3 py-1 bg-blue-100 text-blue-900 text-sm font-medium border border-blue-300">Tag: {filters.selectedTags.join(', ')}</span>
        )}
        {filters.selectedModels.length > 0 && (
          <span className="rounded-full px-3 py-1 bg-green-100 text-green-900 text-sm font-medium border border-green-300">Model: {filters.selectedModels.join(', ')}</span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-2">
        {filteredPrompts.map((prompt: Prompt) => (
          <Card
            key={prompt.id}
            className="flex flex-col border border-gray-200 bg-white shadow-lg rounded-xl p-5 min-h-[320px] max-h-[400px] transition-all hover:shadow-2xl focus-within:ring-2 focus-within:ring-blue-600 cursor-pointer group"
            tabIndex={0}
            onClick={() => setSelectedPrompt(prompt)}
          >
            <CardHeader className="pb-2 font-sans font-light">
              <CardTitle className="text-xl text-gray-900 font-sans font-light tracking-tight line-clamp-1">{prompt.name}</CardTitle>
              <div className="flex items-center justify-between mt-2">
                <span className={`inline-block rounded-xl px-2 py-1 text-sm font-sans font-light border border-gray-200 bg-gray-100 text-blue-700 shadow-sm transition-colors duration-150 ${filters.selectedModels.includes(prompt.model) ? 'bg-blue-100 border-blue-200 text-blue-800' : ''}`}>{prompt.model}</span>
                <span className="text-xs font-sans font-light tracking-wide px-2 py-1 rounded-xl bg-gray-100 border border-gray-200 ml-2 shadow-sm text-gray-800">{countTokens(prompt.prompt_text)} tokens</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow pt-0 pb-2">
              <div className="relative min-h-[3.5rem] mb-2">
                <div className="bg-gray-50 rounded-lg p-2 text-sm font-mono whitespace-pre-line h-full overflow-hidden text-gray-900 shadow-sm border border-gray-100">
                  {truncatePrompt(prompt.prompt_text)}
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <CopyButton text={prompt.prompt_text} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {prompt.tags.map((tag, i) => (
                  <span
                    key={tag}
                    className={`inline-block cursor-pointer rounded-xl px-2 py-1 text-sm font-sans font-light border border-gray-200 bg-gray-100 text-gray-800 shadow-sm transition-colors duration-150 ${filters.selectedTags.includes(tag) ? 'bg-blue-100 border-blue-200 text-blue-800' : ''}`}
                    onClick={e => {
                      e.stopPropagation();
                      setFilters && setFilters({ ...filters, selectedTags: [tag] });
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-0">
              <Tooltip content="Delete Prompt">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => { e.stopPropagation(); setPromptToDelete(prompt); setShowDeleteConfirm(true); }}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" aria-label="Share Prompt" className="text-blue-600 hover:text-blue-800">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {navigator.clipboard.writeText(window.location.origin + '/dashboard?prompt=' + prompt.id)}}>
                    <LinkIcon className="h-4 w-4 mr-2" /> Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {navigator.clipboard.writeText(prompt.prompt_text)}}>
                    <FileText className="h-4 w-4 mr-2" /> Export to Text
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    Advanced Sharing (coming soon)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prompt?</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete <b>{promptToDelete?.name}</b>? This cannot be undone.</div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (promptToDelete) deleteMutation.mutate(String(promptToDelete.id))
              setShowDeleteConfirm(false)
              setPromptToDelete(null)
            }}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popover Modal for Selected Prompt */}
      {selectedPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => { setSelectedPrompt(null); setShowHistory(false); setEditingPromptId(null); setEditValues({}); }}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-xl aspect-square p-8 relative animate-fade-in max-h-[90vh] overflow-y-auto flex flex-col justify-center"
            style={{ maxWidth: '95vw' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-lg text-muted-foreground hover:text-primary"
              onClick={() => { setSelectedPrompt(null); setShowHistory(false); setEditingPromptId(null); setEditValues({}); }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedPrompt.name}</h2>
            <div className="mb-2 text-xs text-muted-foreground flex items-center gap-2">
              Model: <span className="font-medium">{selectedPrompt.model}</span> &middot; Last edited: {selectedPrompt.updated_at ? new Date(selectedPrompt.updated_at).toLocaleString() : '—'}
              <span className="mx-2">·</span>
              <span className="text-muted-foreground">{countTokens(selectedPrompt.prompt_text)} tokens</span>
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
                {promptHistories[String(selectedPrompt.id)] && promptHistories[String(selectedPrompt.id)].length > 0 ? (
                  <ul className="space-y-2">
                    {promptHistories[String(selectedPrompt.id)].map((hist, idx) => (
                      <li key={idx} className="flex flex-col gap-1 border-b pb-2 last:border-b-0">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{hist.timestamp ? new Date(hist.timestamp).toLocaleString() : ''}</span>
                          <Button size="sm" variant="outline" onClick={() => handleRestoreHistory(hist)}>Restore</Button>
                        </div>
                        <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 rounded p-1 overflow-x-auto">
                          {hist.prompt_text}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-xs text-muted-foreground">No history available.</div>
                )}
              </div>
            )}
            <div className="relative mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-sm font-mono whitespace-pre-line">
                {selectedPrompt.prompt_text}
              </div>
              <div className="absolute top-2 right-2 z-10">
                <CopyButton text={selectedPrompt.prompt_text} />
              </div>
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
              <Button variant="destructive" onClick={() => { setPromptToDelete(selectedPrompt); setShowDeleteConfirm(true); }}>Delete</Button>
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
            if (editingPrompt) {
              handleEditPrompt(editingPrompt);
            }
            setEditingPrompt(null);
          }
        }}
      />
    </div>
  )
} 