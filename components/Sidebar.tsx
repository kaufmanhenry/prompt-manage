'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Prompt } from '@/lib/schemas/prompt'
import { EyeIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from './ui/dropdown-menu'
import { XIcon, FilterIcon, Tag as TagIcon } from 'lucide-react'
import { Skeleton } from './ui/skeleton'

interface SidebarProps {
  prompts?: Prompt[]
  selectedPromptId?: string | null
  onSelectPrompt: (promptId: string) => void
  isLoading?: boolean
}

export function Sidebar({
  prompts = [],
  selectedPromptId,
  onSelectPrompt,
  isLoading = false,
}: SidebarProps) {
  // Local state for model and tag filters and search
  const [modelFilters, setModelFilters] = useState<string[]>([])
  const [tagFilters, setTagFilters] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const uniqueModels = Array.from(
    new Set(prompts.map((p) => p.model).filter(Boolean))
  )
  const uniqueTags = Array.from(new Set(prompts.flatMap((p) => p.tags)))

  // Filtering logic
  const filteredPrompts = prompts.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesModel =
      modelFilters.length === 0 || modelFilters.includes(p.model)
    const matchesTags =
      tagFilters.length === 0 || tagFilters.every((tag) => p.tags.includes(tag))
    return matchesName && matchesModel && matchesTags
  })

  const toggleModel = (model: string) => {
    setModelFilters((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    )
  }
  const toggleTag = (tag: string) => {
    setTagFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }
  const clearModelFilters = () => setModelFilters([])
  const clearTagFilters = () => setTagFilters([])
  const clearAllFilters = () => {
    setModelFilters([])
    setTagFilters([])
    setSearch('')
  }

  return (
    <aside className="w-80 border-r bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 shrink-0 flex flex-col">
      {/* Top filter row */}
      <div className="flex items-center gap-2 mb-4 justify-between">
        <h2 className="text-lg font-medium  ">Prompts</h2>
        <Button
          size="sm"
          variant="outline"
          className="px-2 py-1"
          onClick={() => onSelectPrompt('new')}
          data-testid="create-prompt"
        >
          + Add
        </Button>
      </div>
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search prompts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border px-2 py-1 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {/* Model filter button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="px-2 py-1"
              aria-label="Filter by model"
            >
              <FilterIcon className="w-4 h-4 mr-1" /> Model
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="flex flex-col gap-2">
              {uniqueModels.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No models found.
                </div>
              ) : (
                uniqueModels.map((model) => (
                  <DropdownMenuCheckboxItem
                    key={model}
                    checked={modelFilters.includes(model)}
                    onCheckedChange={() => toggleModel(model)}
                  >
                    {model}
                  </DropdownMenuCheckboxItem>
                ))
              )}
            </div>
            {modelFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full"
                onClick={clearModelFilters}
              >
                <XIcon className="w-4 h-4 mr-1" /> Clear Model Filters
              </Button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Tag filter button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="px-2 py-1"
              aria-label="Filter by tag"
            >
              <TagIcon className="w-4 h-4 mr-1" /> Tag
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {uniqueTags.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No tags found.
                </div>
              ) : (
                uniqueTags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={tagFilters.includes(tag)}
                    onCheckedChange={() => toggleTag(tag)}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))
              )}
            </div>
            {tagFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full"
                onClick={clearTagFilters}
              >
                <XIcon className="w-4 h-4 mr-1" /> Clear Tag Filters
              </Button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Active filter chips */}
      {(modelFilters.length > 0 || tagFilters.length > 0 || search) && (
        <div className="flex flex-wrap gap-2 mb-2">
          {search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: &quot;{search}&quot;
              <button
                type="button"
                className="ml-1 focus:outline-none"
                onClick={() => setSearch('')}
                aria-label="Remove search filter"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {modelFilters.map((model) => (
            <Badge
              key={model}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {model}
              <button
                type="button"
                className="ml-1 focus:outline-none"
                onClick={() => toggleModel(model)}
                aria-label={`Remove filter ${model}`}
              >
                <XIcon className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {tagFilters.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                className="ml-1 focus:outline-none"
                onClick={() => toggleTag(tag)}
                aria-label={`Remove tag filter ${tag}`}
              >
                <XIcon className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="space-y-2 p-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="text-sm text-muted-foreground p-4">
              No prompts found.
            </div>
          ) : (
            filteredPrompts.map((prompt) => (
              <Button
                key={prompt.id}
                variant={prompt.id === selectedPromptId ? 'secondary' : 'ghost'}
                className="justify-start w-full text-left rounded-lg px-2 py-2 flex-wrap h-auto"
                onClick={() => onSelectPrompt(prompt.id as string)}
              >
                <div className="font-medium truncate w-full whitespace-normal line-clamp-3">
                  {prompt.name}
                </div>
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
                  <div className="text-xs text-muted-foreground truncate w-full whitespace-normal line-clamp-2">
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
