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
      <div className="relative w-full overflow-hidden rounded-lg border border-border/40 bg-card/40 p-4 shadow-sm backdrop-blur-sm md:p-5">
        <div className="space-y-3 md:space-y-4">
          {/* Header with live indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 md:h-8 md:w-8">
                <FileText className="h-3.5 w-3.5 text-primary md:h-4 md:w-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold md:text-sm">Prompt Library</h3>
                <p className="text-[10px] text-muted-foreground md:text-[11px]">
                  33 organized prompts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 md:h-2 md:w-2" />
              <span className="text-[10px] text-muted-foreground md:text-[11px]">Live</span>
            </div>
          </div>

          {/* Tags filter */}
          <div className="scrollbar-hide flex items-center gap-1.5 overflow-x-auto pb-1">
            <Sparkles className="h-3 w-3 shrink-0 text-muted-foreground md:h-3.5 md:w-3.5" />
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                className="cursor-pointer whitespace-nowrap text-[10px] transition-all hover:border-primary md:text-[11px]"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Prompt list */}
          <div className="space-y-1.5 md:space-y-2">
            {/* Always render 4 slots */}
            {Array.from({ length: 4 }).map((_, index) => {
              const prompt = filteredPrompts[index]
              if (prompt) {
                return (
                  <button
                    key={prompt.id}
                    onClick={() => setSelectedPrompt(prompt)}
                    className="group flex w-full items-center gap-2.5 rounded-lg border border-border/50 bg-background/50 p-2.5 text-left transition-all hover:border-primary/30 hover:bg-accent/50 md:gap-3 md:p-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary md:h-9 md:w-9">
                      <FileText className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium md:text-sm">{prompt.name}</p>
                      <p className="text-[10px] text-muted-foreground md:text-[11px]">
                        {prompt.model}
                      </p>
                    </div>
                  </button>
                )
              }
              // Empty slot to maintain height
              return (
                <div
                  key={`empty-${index}`}
                  className="flex h-[50px] w-full items-center justify-center rounded-lg border border-dashed border-border/30 bg-muted/20 md:h-[57px]"
                >
                  <p className="text-[10px] text-muted-foreground md:text-xs">No prompt</p>
                </div>
              )
            })}
          </div>

          {/* Footer note */}
          <div className="border-t border-border/40 pt-2.5 text-center md:pt-3">
            <p className="text-[10px] text-muted-foreground md:text-[11px]">
              Click any prompt to view details
            </p>
          </div>
        </div>
      </div>

      {/* Prompt Detail Modal */}
      {selectedPrompt && (
        <Dialog open={true} onOpenChange={() => setSelectedPrompt(null)}>
          <DialogContent className="max-h-[85vh] max-w-[calc(100vw-2rem)] overflow-y-auto sm:max-w-2xl md:max-w-3xl">
            {/* Header with gradient background */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent md:h-24" />

            <DialogHeader className="relative">
              <div className="flex items-start justify-between gap-3 md:gap-4">
                <div className="flex items-start gap-2.5 md:gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-4 ring-primary/5 md:h-12 md:w-12">
                    <FileText className="h-5 w-5 text-primary md:h-6 md:w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-base md:text-xl">
                      {selectedPrompt.name}
                    </DialogTitle>
                    <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                      {selectedPrompt.description}
                    </p>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="relative space-y-4 md:space-y-5">
              {/* Meta info cards */}
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <div className="rounded-lg border bg-card p-2.5 md:p-3">
                  <p className="text-[10px] text-muted-foreground md:text-xs">Model</p>
                  <p className="mt-0.5 text-xs font-semibold md:mt-1 md:text-sm">
                    {selectedPrompt.model}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-2.5 md:p-3">
                  <p className="text-[10px] text-muted-foreground md:text-xs">Views</p>
                  <p className="mt-0.5 text-xs font-semibold md:mt-1 md:text-sm">
                    {selectedPrompt.views.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-2.5 md:p-3">
                  <p className="text-[10px] text-muted-foreground md:text-xs">Uses</p>
                  <p className="mt-0.5 text-xs font-semibold md:mt-1 md:text-sm">
                    {selectedPrompt.uses}
                  </p>
                </div>
              </div>

              {/* Tags section */}
              <div className="space-y-1.5 md:space-y-2">
                <p className="text-[10px] font-medium text-muted-foreground md:text-xs">Tags</p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {selectedPrompt.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] md:text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Prompt content with layered design */}
              <div className="space-y-1.5 md:space-y-2">
                <p className="text-[10px] font-medium text-muted-foreground md:text-xs">
                  Prompt Content
                </p>
                <div className="relative rounded-lg border bg-gradient-to-br from-muted/30 to-muted/50 p-4 shadow-sm md:rounded-xl md:p-5">
                  <div className="bg-grid-pattern absolute inset-0 rounded-lg opacity-[0.02] md:rounded-xl" />
                  <p className="relative whitespace-pre-line text-xs leading-relaxed md:text-sm">
                    {selectedPrompt.content}
                  </p>
                </div>
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between rounded-lg border border-dashed bg-muted/20 px-3 py-2.5 md:px-4 md:py-3">
                <span className="text-[10px] text-muted-foreground md:text-xs">
                  Created {selectedPrompt.created}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
