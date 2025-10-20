'use client'

import type { Session } from '@supabase/supabase-js'
import { GlobeIcon, LogOut, Settings } from 'lucide-react'
import { FilterIcon, Tag as TagIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Prompt } from '@/lib/schemas/prompt'
import { createClient } from '@/utils/supabase/client'

import { Badge } from './ui/badge'
import {
  DropdownMenuCheckboxItem,
} from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'

interface SidebarProps {
  prompts?: Prompt[]
  selectedPromptId?: string | null
  onSelectPrompt: (promptId: string) => void
  isLoading?: boolean
  session?: Session | null
}

export function Sidebar({
  prompts = [],
  selectedPromptId,
  onSelectPrompt,
  isLoading = false,
  session,
}: SidebarProps) {
  // Local state for model and tag filters and search
  const [modelFilters, setModelFilters] = useState<string[]>([])
  const [tagFilters, setTagFilters] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const uniqueModels = Array.from(new Set(prompts.map((p) => p.model).filter(Boolean)))
  const uniqueTags = Array.from(new Set(prompts.flatMap((p) => p.tags)))

  // Filtering logic
  const filteredPrompts = prompts.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesModel = modelFilters.length === 0 || modelFilters.includes(p.model)
    const matchesTags = tagFilters.length === 0 || tagFilters.every((tag) => p.tags.includes(tag))
    return matchesName && matchesModel && matchesTags
  })

  const toggleModel = (model: string) => {
    setModelFilters((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model],
    )
  }
  const toggleTag = (tag: string) => {
    setTagFilters((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }
  const clearModelFilters = () => setModelFilters([])
  const clearTagFilters = () => setTagFilters([])
  const clearAllFilters = () => {
    setModelFilters([])
    setTagFilters([])
    setSearch('')
  }

  const handleSignOut = async () => {
    await createClient().auth.signOut()
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r bg-white/50 backdrop-blur-sm dark:bg-gray-800/50">
      {/* Team Name Header */}
      <div className="shrink-0 border-b p-4">
        <div className="mb-2 flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Prompt Manage"
            width={24}
            height={24}
            className="h-6 w-6 dark:invert"
          />
          <h1 className="text-lg font-semibold">Prompt Manage</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          {session?.user?.user_metadata?.display_name || 'My Workspace'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="shrink-0 px-4 pb-2 pt-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search prompts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900"
        />
        {/* Model filter button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="px-2 py-1" aria-label="Filter by model">
              <FilterIcon className="mr-1 h-4 w-4" /> Model
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="flex flex-col gap-2">
              {uniqueModels.length === 0 ? (
                <div className="text-sm text-muted-foreground">No models found.</div>
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
              <Button variant="ghost" size="sm" className="mt-3 w-full" onClick={clearModelFilters}>
                <XIcon className="mr-1 h-4 w-4" /> Clear Model Filters
              </Button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Tag filter button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" className="px-2 py-1" aria-label="Filter by tag">
              <TagIcon className="mr-1 h-4 w-4" /> Tag
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
              {uniqueTags.length === 0 ? (
                <div className="text-sm text-muted-foreground">No tags found.</div>
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
              <Button variant="ghost" size="sm" className="mt-3 w-full" onClick={clearTagFilters}>
                <XIcon className="mr-1 h-4 w-4" /> Clear Tag Filters
              </Button>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Active filter chips */}
      {(modelFilters.length > 0 || tagFilters.length > 0 || search) && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: &quot;{search}&quot;
              <button
                type="button"
                className="ml-1 focus:outline-none"
                onClick={() => setSearch('')}
                aria-label="Remove search filter"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {modelFilters.map((model) => (
            <Badge key={model} variant="secondary" className="flex items-center gap-1">
              {model}
              <button
                type="button"
                className="ml-1 focus:outline-none"
                onClick={() => toggleModel(model)}
                aria-label={`Remove filter ${model}`}
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {tagFilters.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                type="button"
                className="ml-1 focus:outline-none"
                onClick={() => toggleTag(tag)}
                aria-label={`Remove tag filter ${tag}`}
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}
      </div>

      {/* Scrollable Prompts List */}
      <ScrollArea className="flex-1 px-4">
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
            <div className="p-4 text-sm text-muted-foreground">No prompts found.</div>
          ) : (
            filteredPrompts.map((prompt) => (
              <Button
                key={prompt.id}
                variant={prompt.id === selectedPromptId ? 'secondary' : 'ghost'}
                className="h-auto w-full flex-wrap justify-start rounded-lg px-2 py-2 text-left"
                onClick={() => onSelectPrompt(prompt.id as string)}
              >
                <div className="flex w-full justify-between">
                  <div className="line-clamp-3 truncate whitespace-normal font-medium">
                    {prompt.name}
                  </div>
                  {prompt.is_public && (
                    <div className="ml-auto text-right">
                      <GlobeIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
                {prompt.description && (
                  <div className="truncate text-xs text-muted-foreground">{prompt.description}</div>
                )}
                {prompt.model && (
                  <Badge className="text-xs" variant="outline">
                    {prompt.model}
                  </Badge>
                )}
                {prompt.tags.length > 0 && (
                  <div className="line-clamp-2 w-full truncate whitespace-normal text-xs text-muted-foreground">
                    {prompt.tags.join(', ')}
                  </div>
                )}
              </Button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* User Profile Footer */}
      <div className="shrink-0 border-t bg-background p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full justify-start gap-3 px-2 py-2 hover:bg-accent"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {session?.user?.email?.[0].toUpperCase() || 'U'}
              </div>
              <div className="flex min-w-0 flex-1 flex-col items-start text-left">
                <span className="truncate text-sm font-medium">
                  {session?.user?.user_metadata?.display_name || 'User'}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {session?.user?.email || ''}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
