'use client'

import { FileText, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'

const samplePrompts = [
  {
    id: 1,
    name: 'Code Review Assistant',
    model: 'Claude 4 Sonnet',
    tags: ['coding', 'productivity'],
  },
  {
    id: 2,
    name: 'Content Marketing Strategy',
    model: 'GPT-4o',
    tags: ['marketing', 'content'],
  },
  {
    id: 3,
    name: 'Data Analysis Helper',
    model: 'Gemini 2.5 Pro',
    tags: ['analytics', 'data'],
  },
  {
    id: 4,
    name: 'Email Writer Pro',
    model: 'Claude 4 Sonnet',
    tags: ['writing', 'business'],
  },
]

const allTags = ['marketing', 'coding', 'productivity', 'content', 'analytics', 'writing']

export function DashboardPreview() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [activePromptIndex, setActivePromptIndex] = useState(0)

  // Cycle through prompts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromptIndex((prev) => (prev + 1) % samplePrompts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const filteredPrompts = selectedTag
    ? samplePrompts.filter((p) => p.tags.includes(selectedTag))
    : samplePrompts

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
      <div className="space-y-5">
        {/* Header with live indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Prompt Library</h3>
              <p className="text-[10px] text-muted-foreground">33 organized prompts</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-[10px] text-muted-foreground">Live</span>
          </div>
        </div>

        {/* Tags filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Sparkles className="h-3 w-3 shrink-0 text-muted-foreground" />
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              className="cursor-pointer text-[10px] transition-all hover:border-primary"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Prompt list */}
        <div className="space-y-2">
          {filteredPrompts.slice(0, 4).map((prompt, index) => (
            <div
              key={prompt.id}
              className={`group flex items-center gap-3 rounded-md border p-2.5 transition-all ${
                activePromptIndex === index
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border/50 bg-background/50 hover:border-border'
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${
                  activePromptIndex === index
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{prompt.name}</p>
                <p className="text-[10px] text-muted-foreground">{prompt.model}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="border-t border-border/50 pt-3 text-center">
          <p className="text-[10px] text-muted-foreground">
            Tag, organize, and search across all your prompts
          </p>
        </div>
      </div>
    </div>
  )
}
