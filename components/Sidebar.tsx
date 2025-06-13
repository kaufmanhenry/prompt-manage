'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Prompt } from '@/lib/schemas/prompt'
import { SearchIcon } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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
  const allTags = Array.from(
    new Set(
      (prompts || [])
        .flatMap((prompt) => prompt.tags || [])
        .filter(Boolean)
    )
  ).sort()

  const allModels = Array.from(
    new Set(
      (prompts || [])
        .map((prompt) => prompt.model)
        .filter(Boolean)
    )
  ).sort()

  const handleSearch = (value: string) => {
    onFilterChange({
      ...filters,
      search: value,
    })
  }

  const handleTagClick = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag]
    onFilterChange({
      ...filters,
      selectedTags: newTags,
    })
  }

  const handleModelClick = (model: string) => {
    const newModels = filters.selectedModels.includes(model)
      ? filters.selectedModels.filter((m) => m !== model)
      : [...filters.selectedModels, model]
    onFilterChange({
      ...filters,
      selectedModels: newModels,
    })
  }

  return (
    <div className="w-64 border-r bg-muted/50 p-4">
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <Accordion type="multiple" defaultValue={['models', 'tags']} className="space-y-4">
          <AccordionItem value="models">
            <AccordionTrigger className="px-2 text-sm font-medium">
              Models
            </AccordionTrigger>
            <AccordionContent>
              <div className="mt-2 space-y-1">
                {allModels.map((model) => (
                  <Button
                    key={model}
                    variant={filters.selectedModels.includes(model) ? 'secondary' : 'ghost'}
                    className="w-full justify-start px-2"
                    onClick={() => handleModelClick(model)}
                  >
                    <Badge
                      variant={filters.selectedModels.includes(model) ? 'default' : 'outline'}
                      className="w-full justify-start"
                    >
                      {model}
                    </Badge>
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="tags">
            <AccordionTrigger className="px-2 text-sm font-medium">
              Tags
            </AccordionTrigger>
            <AccordionContent>
              <div className="mt-2 space-y-1">
                {allTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={filters.selectedTags.includes(tag) ? 'secondary' : 'ghost'}
                    className="w-full justify-start px-2"
                    onClick={() => handleTagClick(tag)}
                  >
                    <Badge
                      variant={filters.selectedTags.includes(tag) ? 'default' : 'outline'}
                      className="w-full justify-start"
                    >
                      {tag}
                    </Badge>
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  )
} 