'use client'

import { FileText, Sparkles } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const samplePrompts = [
  {
    id: 1,
    name: 'Code Review Assistant',
    model: 'Claude 4 Sonnet',
    tags: ['coding', 'productivity'],
    description: 'Expert code analysis with actionable feedback',
    views: 1243,
    uses: 89,
    created: '2 weeks ago',
    content:
      'You are an expert code reviewer. Analyze the following code for:\n\n- Potential bugs and edge cases\n- Performance optimizations\n- Code style and best practices\n- Security vulnerabilities\n\nProvide specific, actionable feedback with examples.',
  },
  {
    id: 2,
    name: 'Content Marketing Strategy',
    model: 'GPT-4o',
    tags: ['marketing', 'content'],
    description: 'Comprehensive marketing strategy framework',
    views: 876,
    uses: 52,
    created: '1 week ago',
    content:
      'Create a comprehensive content marketing strategy for [PRODUCT/SERVICE]. Include:\n\n- Target audience analysis\n- Content pillars and themes\n- Distribution channels\n- Success metrics and KPIs\n- 90-day action plan',
  },
  {
    id: 3,
    name: 'Data Analysis Helper',
    model: 'Gemini 2.5 Pro',
    tags: ['analytics', 'data'],
    description: 'Statistical insights and data visualization',
    views: 654,
    uses: 34,
    created: '3 days ago',
    content:
      'Analyze the provided dataset and:\n\n1. Identify key trends and patterns\n2. Highlight anomalies or outliers\n3. Provide statistical insights\n4. Suggest actionable recommendations\n5. Create visualizations if applicable',
  },
  {
    id: 4,
    name: 'Email Writer Pro',
    model: 'Claude 4 Sonnet',
    tags: ['writing', 'business'],
    description: 'Professional email composition template',
    views: 2156,
    uses: 127,
    created: '1 month ago',
    content:
      'Write a professional email for [PURPOSE]:\n\n- Clear subject line\n- Appropriate tone and formality\n- Concise message body\n- Strong call-to-action\n- Professional closing\n\nKeep it under 200 words.',
  },
]

const allTags = ['marketing', 'coding', 'productivity', 'content', 'analytics', 'writing']

export function DashboardPreview() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<(typeof samplePrompts)[0] | null>(null)

  const filteredPrompts = selectedTag
    ? samplePrompts.filter((p) => p.tags.includes(selectedTag))
    : samplePrompts

  return (
    <>
      <div className="relative w-full overflow-hidden rounded-lg border border-border/40 bg-card/40 p-5 shadow-sm backdrop-blur-sm">
        <div className="space-y-4">
          {/* Header with live indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Prompt Library</h3>
                <p className="text-[11px] text-muted-foreground">33 organized prompts</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[11px] text-muted-foreground">Live</span>
            </div>
          </div>

          {/* Tags filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                className="cursor-pointer text-[11px] transition-all hover:border-primary"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Prompt list */}
          <div className="space-y-2">
            {/* Always render 4 slots */}
            {Array.from({ length: 4 }).map((_, index) => {
              const prompt = filteredPrompts[index]
              if (prompt) {
                return (
                  <button
                    key={prompt.id}
                    onClick={() => setSelectedPrompt(prompt)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-border/50 bg-background/50 p-3 text-left transition-all hover:border-primary/30 hover:bg-accent/50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{prompt.name}</p>
                      <p className="text-[11px] text-muted-foreground">{prompt.model}</p>
                    </div>
                  </button>
                )
              }
              // Empty slot to maintain height
              return (
                <div
                  key={`empty-${index}`}
                  className="flex h-[57px] w-full items-center justify-center rounded-lg border border-dashed border-border/30 bg-muted/20"
                >
                  <p className="text-xs text-muted-foreground">No prompt</p>
                </div>
              )
            })}
          </div>

          {/* Footer note */}
          <div className="border-t border-border/40 pt-3 text-center">
            <p className="text-[11px] text-muted-foreground">
              Click any prompt to view details
            </p>
          </div>
        </div>
      </div>

      {/* Prompt Detail Modal */}
      {selectedPrompt && (
        <Dialog open={true} onOpenChange={() => setSelectedPrompt(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            {/* Header with gradient background */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent" />

            <DialogHeader className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-4 ring-primary/5">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedPrompt.name}</DialogTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedPrompt.description}</p>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="relative space-y-5">
              {/* Meta info cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Model</p>
                  <p className="mt-1 text-sm font-semibold">{selectedPrompt.model}</p>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Views</p>
                  <p className="mt-1 text-sm font-semibold">{selectedPrompt.views.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <p className="text-xs text-muted-foreground">Uses</p>
                  <p className="mt-1 text-sm font-semibold">{selectedPrompt.uses}</p>
                </div>
              </div>

              {/* Tags section */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPrompt.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Prompt content with layered design */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Prompt Content</p>
                <div className="relative rounded-xl border bg-gradient-to-br from-muted/30 to-muted/50 p-5 shadow-sm">
                  <div className="absolute inset-0 rounded-xl bg-grid-pattern opacity-[0.02]" />
                  <p className="relative whitespace-pre-line text-sm leading-relaxed">
                    {selectedPrompt.content}
                  </p>
                </div>
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between rounded-lg border border-dashed bg-muted/20 px-4 py-3">
                <span className="text-xs text-muted-foreground">Created {selectedPrompt.created}</span>
                <Badge variant="outline" className="text-[10px]">
                  Click to copy (demo)
                </Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
