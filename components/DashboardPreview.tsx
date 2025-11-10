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
    <div className="relative w-full overflow-hidden rounded-2xl border-2 border-border bg-gradient-to-br from-background via-background to-accent/10 p-6 shadow-2xl">
      {/* Gradient overlay for depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />

      <div className="relative space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-4">
          <h3 className="text-xl font-bold">Your Prompt Library</h3>
          <p className="text-sm text-muted-foreground">
            33 prompts organized and ready to use
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            className={`cursor-pointer border-l-4 border-l-primary transition-all duration-300 ${
              hoveredCard === 1 ? 'scale-105 shadow-lg' : ''
            }`}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <FileText className="h-4 w-4" />
                Total Prompts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">33</div>
              <p className="mt-1 text-xs text-muted-foreground">28 public · 5 private</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-300 ${
              hoveredCard === 2 ? 'scale-105 shadow-lg' : ''
            }`}
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="mt-1 text-xs text-muted-foreground">24.2% of total prompts</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all duration-300 ${
              hoveredCard === 3 ? 'scale-105 shadow-lg' : ''
            }`}
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Eye className="h-4 w-4" />
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="mt-1 text-xs text-muted-foreground">Across all public prompts</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Prompts Preview */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  Recent Prompts
                </CardTitle>
                <CardDescription className="mt-1 text-xs">
                  Your most recently updated
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {samplePrompts.map((prompt, index) => (
                <div
                  key={prompt.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-all duration-500 ${
                    activePromptIndex === index
                      ? 'border-primary/50 bg-accent shadow-md'
                      : 'border-transparent bg-card/50'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      activePromptIndex === index
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p
                      className={`text-sm font-semibold transition-colors ${
                        activePromptIndex === index ? 'text-primary' : ''
                      }`}
                    >
                      {prompt.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Models */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BarChart3 className="h-4 w-4" />
                Top Models
              </CardTitle>
              <CardDescription className="text-xs">Most used AI models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sampleModels.map(({ model, count, percentage }) => (
                  <div key={model} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{model}</span>
                      <span className="text-muted-foreground">
                        {count} prompt{count === 1 ? '' : 's'}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Tags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4" />
                Popular Tags
              </CardTitle>
              <CardDescription className="text-xs">Most frequently used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {sampleTags.map(({ tag, count }) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'secondary'}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  >
                    {tag}
                    <span className="ml-1.5 text-xs opacity-70">({count})</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subtle overlay gradient at bottom */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
    </div>
  )
}
