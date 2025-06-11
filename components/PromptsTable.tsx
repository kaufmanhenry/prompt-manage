'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { Prompt } from '@/lib/schemas/prompt'
import { PromptForm } from '@/components/PromptForm'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function PromptsTable() {
  const [search, setSearch] = useState('')
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const queryClient = useQueryClient()

  const { data: prompts = [], isLoading } = useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('prompts')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      return data as Prompt[]
    },
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

  const filteredPrompts = prompts.filter((prompt: Prompt) =>
    prompt.name.toLowerCase().includes(search.toLowerCase()) ||
    prompt.prompt_text.toLowerCase().includes(search.toLowerCase()) ||
    prompt.model.toLowerCase().includes(search.toLowerCase()) ||
    prompt.tags.some((tag: string) => tag.toLowerCase().includes(search.toLowerCase()))
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search prompts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setEditingPrompt({} as Prompt)}>New Prompt</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Prompt Text</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPrompts.map((prompt: Prompt) => (
            <TableRow key={prompt.id}>
              <TableCell>{prompt.name}</TableCell>
              <TableCell>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                  {prompt.model}
                </span>
              </TableCell>
              <TableCell>{prompt.prompt_text}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPrompt(prompt)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(prompt.id!)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PromptForm
        prompt={editingPrompt}
        open={!!editingPrompt}
        onOpenChange={(open: boolean) => !open && setEditingPrompt(null)}
      />
    </div>
  )
} 