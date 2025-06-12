'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { Prompt } from '@/lib/schemas/prompt'
import { PromptForm } from '@/components/PromptForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface Filters {
  selectedTags: string[]
  selectedModels: string[]
  search?: string
}

export function PromptsTable({ prompts = [], filters, isLoading }: { prompts?: Prompt[], filters: Filters, isLoading: boolean }) {
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
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
          <Card key={prompt.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{prompt.name}</CardTitle>
              <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary inline-block">
                {prompt.model}
              </span>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-3">
                {truncatePrompt(prompt.prompt_text)}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {prompt.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingPrompt(prompt)}
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMutation.mutate(prompt.id!)}
                className="flex-1"
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <PromptForm
        prompt={editingPrompt}
        open={!!editingPrompt}
        onOpenChange={(open: boolean) => !open && setEditingPrompt(null)}
      />
    </div>
  )
} 