'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Prompt } from '@/lib/schemas/prompt'

interface SidebarProps {
  prompts?: Prompt[]
  filters: {
    search: string
    selectedTags: string[]
    selectedModels: string[]
  }
  onFilterChange: (filters: {
    search: string
    selectedTags: string[]
    selectedModels: string[]
  }) => void
}

export function Sidebar({ prompts = [], filters, onFilterChange }: SidebarProps) {
  // Get unique tags and models from all prompts, robustly handle null/undefined
  const allTags = Array.from(
    new Set(
      (prompts || [])
        .flatMap((p) => Array.isArray(p.tags) ? p.tags : [])
        .filter((tag) => typeof tag === 'string' && tag.length > 0)
    )
  )
  const allModels = Array.from(new Set((prompts || []).map((p) => p.model).filter(Boolean)))

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value })
  }

  const handleTagClick = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag]
    onFilterChange({ ...filters, selectedTags: newTags })
  }

  const handleModelClick = (model: string) => {
    const newModels = filters.selectedModels.includes(model)
      ? filters.selectedModels.filter(m => m !== model)
      : [...filters.selectedModels, model]
    onFilterChange({ ...filters, selectedModels: newModels })
  }

  return (
    <div className="w-64 border-r h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-4 border-b">
        <Input
          placeholder="Search prompts..."
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2">Models</h3>
            <div className="flex flex-wrap gap-2">
              {allModels.map((model) => (
                <Badge
                  key={model}
                  variant={filters.selectedModels.includes(model) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleModelClick(model)}
                >
                  {model}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
} 