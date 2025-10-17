'use client'

import { ChevronDown, ChevronRight, Copy, Rocket, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const CONTENT_TYPES = ['Email', 'Ad', 'Landing Page', 'Social', 'Blog', 'Other'] as const
type ContentType = (typeof CONTENT_TYPES)[number]

type _RunResponse = {
  success: boolean
  variant: string
  outputs: Array<{
    rowIndex: number
    response: string
    tokens_used: number
    execution_time_ms: number
    cost_usd: number
  }>
  aggregate: {
    total_tokens: number
    avg_latency_ms: number
    total_cost_usd: number
  }
}

const DEFAULT_PROMPT = `Write 5 Google Ads headlines for {product} targeting {audience}. Focus on {benefit}. Keep under 30 characters.`

const DEFAULT_CONTEXT = `Company: Prompt Manage helps marketing teams organize, test, and share prompts.
Voice: Clear, confident, and helpful.`

function getExampleForType(type: ContentType): string {
  switch (type) {
    case 'Email':
      return 'Write a product launch email announcing our new AI feature. Audience: existing customers. Tone: friendly and clear. Include a CTA to try it.'
    case 'Ad':
      return 'Create 5 Google Ads headlines for a project management SaaS. Audience: startup teams. Emphasize speed and simplicity. Each under 30 characters.'
    case 'Landing Page':
      return 'Draft hero section copy for an AI writing tool landing page. Include headline, subheadline, and a primary CTA. Tone: confident and helpful.'
    case 'Social':
      return 'Write a LinkedIn post announcing our upcoming webinar on prompt engineering. Include a hook, 3 value bullets, and a signup CTA.'
    case 'Blog':
      return "Outline a beginner's guide to prompt engineering for marketers. Provide an H2/H3 structure and a brief intro and conclusion."
    case 'Other':
    default:
      return 'Describe what you want to create in plain English. Example: draft a cold outreach message to book demos with marketing leaders.'
  }
}

export function InteractivePromptLab() {
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT)
  const [context, setContext] = useState<string>(DEFAULT_CONTEXT)
  const [showContext, setShowContext] = useState<boolean>(false)
  const [contentType, setContentType] = useState<ContentType>('Ad')
  const [model, setModel] = useState<string>('gpt-4o-mini')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [promptTouched, setPromptTouched] = useState<boolean>(false)
  const [runs, setRuns] = useState<
    Array<{
      original: string
      response: string
      tokens?: number | null
      latencyMs?: number | null
      costUsd?: number | null
      createdAt: string
    }>
  >([])

  // Update example prompt when content type changes, if user hasn't typed a custom idea
  React.useEffect(() => {
    const example = getExampleForType(contentType)
    // Replace if untouched or currently equals another example template
    if (!promptTouched || CONTENT_TYPES.some((t) => prompt === getExampleForType(t))) {
      setPrompt(example)
    }
  }, [contentType, promptTouched, prompt])

  async function runOnce() {
    setIsRunning(true)
    setProgress(10)
    const progressTimer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 8 : p))
    }, 250)
    try {
      const res = await fetch('/api/prompt/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context, model }),
      })
      const result = await res.json()
      const after = result.response || 'No response'
      setRuns((prev) => [
        {
          original: prompt,
          response: after,
          tokens: result.tokens_used ?? null,
          latencyMs: result.execution_time_ms ?? null,
          costUsd: null,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])
    } finally {
      clearInterval(progressTimer)
      setProgress(100)
      setIsRunning(false)
      setTimeout(() => setProgress(0), 500)
    }
  }

  return (
    <div className="mx-auto w-full max-w-full overflow-hidden rounded-2xl border border-emerald-200/50 bg-white p-4 shadow-sm ring-1 ring-emerald-500/10 dark:border-emerald-900/40 dark:bg-gray-900 md:max-w-4xl md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Turn your idea into a great prompt
          </span>
          <Badge variant="outline" className="text-xs">
            Create Better Prompts
          </Badge>
        </div>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="h-8 min-w-[170px] text-xs">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4 (active)</SelectItem>
            <SelectItem disabled value="gpt-4o">
              GPT-4o — Coming soon
            </SelectItem>
            <SelectItem disabled value="claude-3-5">
              Claude 3.5 — Coming soon
            </SelectItem>
            <SelectItem disabled value="gemini-1-5">
              Gemini 1.5 — Coming soon
            </SelectItem>
            <SelectItem disabled value="llama-3-1">
              Llama 3.1 — Coming soon
            </SelectItem>
            <SelectItem disabled value="mistral-large">
              Mistral Large — Coming soon
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
        {/* Content type chips */}
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={t === contentType ? 'default' : 'outline'}
              onClick={() => setContentType(t)}
              className="h-8"
            >
              {t}
            </Button>
          ))}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your idea
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
              setPromptTouched(true)
            }}
            className="min-h[120px] min-h-[120px] font-mono text-sm"
            placeholder={
              contentType === 'Email'
                ? 'Example: Launch email announcing our new feature...'
                : contentType === 'Ad'
                  ? 'Example: Google ad for project management SaaS...'
                  : contentType === 'Landing Page'
                    ? 'Example: Product page hero copy for AI writing tool...'
                    : contentType === 'Social'
                      ? 'Example: LinkedIn post announcing a webinar...'
                      : contentType === 'Blog'
                        ? "Example: Blog outline for beginner's guide to prompts..."
                        : 'Example: Describe what you want to create...'
            }
          />
          <p className="mt-1 text-xs text-gray-500">
            Write what you want—don't worry about wording. We'll turn it into a great prompt.
          </p>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            onClick={() => setShowContext(!showContext)}
          >
            {showContext ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            Add context about your brand (optional)
          </button>
          {showContext && (
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[80px] font-mono text-sm"
              placeholder="Company: Your company name and what you do. Voice: Your brand personality..."
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button onClick={runOnce} disabled={isRunning}>
            {isRunning ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            ) : (
              <Rocket className="h-4 w-4" />
            )}{' '}
            Generate
          </Button>
        </div>

        {isRunning || progress > 0 ? (
          <div className="mt-2 h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Outputs</span>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <Sparkles className="h-3.5 w-3.5" /> {runs.length} {runs.length === 1 ? 'run' : 'runs'}
          </div>
        </div>
        {runs.length === 0 ? (
          <div className="text-[12px] text-gray-500">Run to see output...</div>
        ) : (
          <div className="space-y-3">
            {runs.map((r, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-[12px] text-gray-600 dark:text-gray-400">
                    {new Date(r.createdAt).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-700 dark:text-gray-300">
                    {r.tokens != null && (
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 dark:bg-emerald-900/30">
                        {r.tokens} tokens
                      </span>
                    )}
                    {r.latencyMs != null && (
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 dark:bg-emerald-900/30">
                        {Math.round(r.latencyMs)}ms
                      </span>
                    )}
                    {r.costUsd != null && (
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 dark:bg-emerald-900/30">
                        ${r.costUsd.toFixed(4)}
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigator.clipboard.writeText(r.response)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="max-h-56 md:max-h-64">
                  <ScrollArea className="h-full">
                    <pre className="whitespace-pre-wrap text-[11px] leading-5 text-gray-800 dark:text-gray-200">
                      {r.response}
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InteractivePromptLab
