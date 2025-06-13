'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Prompt } from '@/lib/schemas/prompt'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({
    models: true,
    tags: true,
  })
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value })
  }

  const handleModelChange = (value: string) => {
    const newModels = value && value !== 'all-models' ? [value] : []
    onFilterChange({ ...filters, selectedModels: newModels })
  }

  const handleTagChange = (value: string) => {
    const newTags = value && value !== 'all-tags' ? [value] : []
    onFilterChange({ ...filters, selectedTags: newTags })
  }

  // Accessible color for bubbles
  const modelColor = (selected: boolean) => selected ? 'bg-green-600 text-white' : 'bg-green-100 text-green-900'
  const tagColor = (selected: boolean) => selected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900'

  return (
    <div className="w-52 border-r h-[calc(100vh-4rem)] flex flex-col">
      <div className="p-2 border-b">
        <Input
          placeholder="Search prompts..."
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {/* Models Section */}
          <div>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('models')}>
              <h3 className="text-sm font-semibold mb-1">Models</h3>
              <span>{openSections.models ? '−' : '+'}</span>
            </div>
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            {openSections.models && (
              <div className="flex flex-wrap gap-2 mt-2">
                {allModels.map((model) => (
                  <span key={model} onClick={() => handleModelChange(model)}>
                    <Badge className={`cursor-pointer ${modelColor(filters.selectedModels.includes(model))}`}>{model}</Badge>
                  </span>
                ))}
                <span onClick={() => handleModelChange('all-models')}>
                  <Badge className={`cursor-pointer ${filters.selectedModels.length === 0 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-900'}`}>All Models</Badge>
                </span>
              </div>
            )}
          </div>
          {/* Tags Section */}
          <div>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection('tags')}>
              <h3 className="text-sm font-semibold mb-1">Tags</h3>
              <span>{openSections.tags ? '−' : '+'}</span>
            </div>
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            {openSections.tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {allTags.map((tag) => (
                  <span key={tag} onClick={() => handleTagChange(tag)}>
                    <Badge className={`cursor-pointer ${tagColor(filters.selectedTags.includes(tag))}`}>{tag}</Badge>
                  </span>
                ))}
                <span onClick={() => handleTagChange('all-tags')}>
                  <Badge className={`cursor-pointer ${filters.selectedTags.length === 0 ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900'}`}>All Tags</Badge>
                </span>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
} 