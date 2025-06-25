'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Prompt } from '@/lib/schemas/prompt'
import { EyeIcon } from 'lucide-react'
import { Badge } from './ui/badge'

interface SidebarProps {
  prompts?: Prompt[]
  selectedPromptId?: string | null
  onSelectPrompt: (promptId: string) => void
}

export function Sidebar({
  prompts = [],
  selectedPromptId,
  onSelectPrompt,
}: SidebarProps) {
  return (
    <aside className="w-80 border-r bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 shrink-0 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          My Prompts
        </h2>
        <Button
          size="sm"
          variant="outline"
          className="px-2 py-1"
          onClick={() => onSelectPrompt('new')}
        >
          + Add
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1">
          {prompts.length === 0 ? (
            <div className="text-sm text-muted-foreground p-4">
              No prompts found.
            </div>
          ) : (
            prompts.map((prompt) => (
              <Button
                key={prompt.id}
                variant={prompt.id === selectedPromptId ? 'secondary' : 'ghost'}
                className="justify-start w-full text-left rounded-md px-3 py-2"
                onClick={() => onSelectPrompt(prompt.id as string)}
              >
                <div className="font-medium truncate">{prompt.name}</div>
                {prompt.description && (
                  <div className="text-xs text-muted-foreground truncate">
                    {prompt.description}
                  </div>
                )}
                {prompt.model && (
                  <Badge className="text-xs" variant="outline">
                    {prompt.model}
                  </Badge>
                )}
                {prompt.tags.length > 0 && (
                  <div className="text-xs text-muted-foreground truncate">
                    {prompt.tags.join(', ')}
                  </div>
                )}
                {prompt.is_public && (
                  <div className="text-xs text-muted-foreground truncate">
                    <EyeIcon className="w-4 h-4" />
                  </div>
                )}
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
