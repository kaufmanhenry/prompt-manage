'use client'

import { BarChart3, Clock, Eye, FileText, Sparkles, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const samplePrompts = [
  {
    id: 1,
    name: 'Code Review Assistant',
    model: 'Claude 4 Sonnet',
    views: 234,
    tags: ['coding', 'productivity'],
  },
  {
    id: 2,
    name: 'Content Marketing Strategy',
    model: 'GPT-4o',
    views: 189,
    tags: ['marketing', 'content'],
  },
  {
    id: 3,
    name: 'Data Analysis Helper',
    model: 'Gemini 2.5 Pro',
    views: 156,
    tags: ['analytics', 'data'],
  },
]

const sampleTags = [
  { tag: 'marketing', count: 12 },
  { tag: 'coding', count: 8 },
  { tag: 'productivity', count: 7 },
  { tag: 'content', count: 6 },
]

const sampleModels = [
  { model: 'GPT-4o', count: 15, percentage: 45 },
  { model: 'Claude 4 Sonnet', count: 12, percentage: 36 },
  { model: 'Gemini 2.5 Pro', count: 6, percentage: 19 },
]

export function DashboardPreview() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [activePromptIndex, setActivePromptIndex] = useState(0)

  // Cycle through prompts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePromptIndex((prev) => (prev + 1) % samplePrompts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-accent/5 p-4 shadow-lg">
      <div className="relative space-y-4">
        {/* Header */}
        <div className="border-b border-border pb-3">
          <h3 className="text-base font-semibold">Your Prompt Library</h3>
          <p className="text-xs text-muted-foreground">
            33 prompts organized and ready to use
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-2 md:grid-cols-3">
          <Card
            className={`cursor-pointer border-l-2 border-l-primary transition-all duration-200 ${
              hoveredCard === 1 ? 'shadow-md' : ''
            }`}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                <FileText className="h-3 w-3" />
                Total Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold">33</div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">28 public · 5 private</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 ${
              hoveredCard === 2 ? 'shadow-md' : ''
            }`}
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold">8</div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">24.2% of total</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-200 ${
              hoveredCard === 3 ? 'shadow-md' : ''
            }`}
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                <Eye className="h-3 w-3" />
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="text-xl font-bold">1,247</div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">All public prompts</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Prompts Preview */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1.5 text-xs">
              <Clock className="h-3 w-3" />
              Recent Prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-1.5">
              {samplePrompts.map((prompt, index) => (
                <div
                  key={prompt.id}
                  className={`flex items-center gap-2 rounded-md border p-2 transition-all duration-500 ${
                    activePromptIndex === index
                      ? 'border-primary/30 bg-accent/50'
                      : 'border-transparent bg-card/50'
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
                      activePromptIndex === index
                        ? 'bg-primary/15 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <FileText className="h-3 w-3" />
                  </div>
                  <div className="flex-1 space-y-0">
                    <p
                      className={`text-xs font-semibold transition-colors ${
                        activePromptIndex === index ? 'text-primary' : ''
                      }`}
                    >
                      {prompt.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span>{prompt.model}</span>
                      <span>·</span>
                      <span>{prompt.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom Grid - Models and Tags */}
        <div className="grid gap-2 md:grid-cols-2">
          {/* Top Models */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-1.5 text-xs">
                <BarChart3 className="h-3 w-3" />
                Top Models
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-2">
                {sampleModels.map(({ model, count, percentage }) => (
                  <div key={model} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-medium">{model}</span>
                      <span className="text-muted-foreground">
                        {count} prompt{count === 1 ? '' : 's'}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Tags */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-1.5 text-xs">
                <Sparkles className="h-3 w-3" />
                Popular Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex flex-wrap gap-1.5">
                {sampleTags.map(({ tag, count }) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'secondary'}
                    className="cursor-pointer text-[10px] transition-colors"
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  >
                    {tag}
                    <span className="ml-1 opacity-70">({count})</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
