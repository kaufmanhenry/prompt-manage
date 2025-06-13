'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Prompt } from '@/lib/schemas/prompt'
import CopyButton from './CopyButton'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Eye } from 'lucide-react'

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

  const handleRestoreHistory = (history: PromptHistory) => {
    if (selectedPrompt) {
      setSelectedPrompt({
        ...selectedPrompt,
        prompt_text: history.prompt_text
      })
    }
  }

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch = prompt.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      prompt.prompt_text.toLowerCase().includes(filters.search.toLowerCase())
    const matchesTags = filters.selectedTags.length === 0 ||
      filters.selectedTags.some(tag => prompt.tags?.includes(tag))
    const matchesModels = filters.selectedModels.length === 0 ||
      filters.selectedModels.includes(prompt.model)
    return matchesSearch && matchesTags && matchesModels
  })

  return (
    <div className="space-y-6">
      {selectedPrompt ? (
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{selectedPrompt.name}</h2>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary">{selectedPrompt.model}</Badge>
                {selectedPrompt.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
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
            </div>
          </div>
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
            <Card key={prompt.id} className="p-4">
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold">{prompt.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{prompt.model}</Badge>
                  {prompt.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <pre className="text-sm text-muted-foreground line-clamp-3">
                  {prompt.prompt_text}
                </pre>
              </div>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPrompt(prompt)}
                >
                  <Eye className="mr-2 size-4" />
                  View
                </Button>
                <CopyButton text={prompt.prompt_text} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 