'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Prompt } from '@/lib/schemas/prompt'
import { SearchIcon, Filter, X } from 'lucide-react'
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

  const clearAllFilters = () => {
    onFilterChange({
      search: '',
      selectedTags: [],
      selectedModels: [],
    })
  }

  const hasActiveFilters = filters.search || filters.selectedTags.length > 0 || filters.selectedModels.length > 0

  return (
    <div className="w-80 border-r bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 shrink-0">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Filters
            </h2>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Search */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search prompts..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-0 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Active Filters */}
        {hasActiveFilters && (
          <Card className="border-0 shadow-sm bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Active Filters
                </p>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <Badge variant="secondary" className="text-xs">
                      Search: &quot;{filters.search}&quot;
                    </Badge>
                  )}
                  {filters.selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {filters.selectedModels.map((model) => (
                    <Badge key={model} variant="secondary" className="text-xs">
                      {model}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="space-y-4">
            <Accordion type="multiple" defaultValue={['models', 'tags']} className="space-y-4">
              <AccordionItem value="models" className="border-0">
                <AccordionTrigger className="px-0 py-2 text-sm font-medium hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span>Models</span>
                    {filters.selectedModels.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {filters.selectedModels.length}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0">
                  <div className="mt-3 flex flex-wrap gap-2">
                    {allModels.map((model) => (
                      <Button
                        key={model}
                        variant={
                          filters.selectedModels.includes(model)
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        className={`h-auto rounded-full px-3 py-1 text-xs ${
                          filters.selectedModels.includes(model)
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleModelClick(model)}
                      >
                        {model}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="tags" className="border-0">
                <AccordionTrigger className="px-0 py-2 text-sm font-medium hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span>Tags</span>
                    {filters.selectedTags.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {filters.selectedTags.length}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-0">
                  <div className="mt-3 flex flex-wrap gap-2">
                    {allTags.length > 0 ? (
                      allTags.map((tag) => (
                        <Button
                          key={tag}
                          variant={
                            filters.selectedTags.includes(tag) ? 'default' : 'outline'
                          }
                          size="sm"
                          className={`h-auto rounded-full px-3 py-1 text-xs ${
                            filters.selectedTags.includes(tag)
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </Button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No tags found
                      </p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
} 