'use client'

import {
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  Loader2,
  MoreVertical,
  Rocket,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

type VariablesRow = Record<string, string>

type RunResponse = {
  success: boolean
  response: string
  prompt: {
    id: string
    name: string
    prompt_text: string
  }
  execution_time_ms: number
  tokens_used: number | null
}

interface PromptLabProps {
  initialPrompt?: {
    id?: string
    name?: string
    prompt_text?: string
    model?: string
  }
  onSavePrompt?: (prompt: {
    name: string
    prompt_text: string
    model: string
    tags: string[]
    is_public: boolean
  }) => Promise<void>
  className?: string
}

const QUICK_TEMPLATES = [
  {
    name: 'Marketing Copy',
    prompt: 'Write {type} for {product} targeting {audience}. Tone: {tone}.',
    vars: { type: 'ad copy', product: 'SaaS tool', audience: 'small businesses', tone: 'professional' },
  },
  {
    name: 'Email',
    prompt: 'Draft a {email_type} email about {topic} for {recipient}.',
    vars: { email_type: 'follow-up', topic: 'product demo', recipient: 'potential customers' },
  },
  {
    name: 'Social Post',
    prompt: 'Create a {platform} post about {topic}. Include hashtags and CTA.',
    vars: { platform: 'LinkedIn', topic: 'AI productivity' },
  },
]

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

function estimateCost(tokens: number, model: string): string {
  const pricing: Record<string, number> = {
    'gpt-4o-mini': 0.00015,
    'gpt-4o': 0.0025,
    'gpt-4': 0.03,
    'gpt-3.5-turbo': 0.0005,
  }
  const rate = pricing[model] ?? 0.0005
  const cost = (tokens / 1000) * rate
  return cost < 0.01 ? `<$0.01` : `$${cost.toFixed(3)}`
}

export function PromptLab({ initialPrompt, onSavePrompt, className = '' }: PromptLabProps) {
  const [prompt, setPrompt] = useState(initialPrompt?.prompt_text || '')
  const [model, setModel] = useState(initialPrompt?.model || 'gpt-4o-mini')
  const [promptName, setPromptName] = useState(initialPrompt?.name || '')
  const [isRunning, setIsRunning] = useState(false)
  const [showHistory, setShowHistory] = useState(true)
  const [showContext, setShowContext] = useState(false)
  const [context, setContext] = useState('')
  const [runs, setRuns] = useState<
    Array<{
      response: string
      tokens?: number | null
      latencyMs?: number | null
      createdAt: string
      variables?: VariablesRow
    }>
  >([])
  const { toast } = useToast()

  // Auto-detect variables from prompt
  const detectedVars = useMemo(() => {
    const matches = prompt.match(/\{([^}]+)\}/g)
    if (!matches) return []
    return [...new Set(matches.map((m) => m.slice(1, -1)))]
  }, [prompt])

  const [varValues, setVarValues] = useState<Record<string, string>>({})

  // Initialize var values when detected
  useEffect(() => {
    const newVars: Record<string, string> = {}
    detectedVars.forEach((varName) => {
      if (!(varName in varValues)) {
        newVars[varName] = ''
      }
    })
    if (Object.keys(newVars).length > 0) {
      setVarValues((prev) => ({ ...prev, ...newVars }))
    }
  }, [detectedVars]) // eslint-disable-line react-hooks/exhaustive-deps

  // Compute final prompt with substitutions
  const finalPrompt = useMemo(() => {
    let result = prompt
    detectedVars.forEach((varName) => {
      const value = varValues[varName] || `{${varName}}`
      result = result.replace(new RegExp(`\\{${varName}\\}`, 'g'), value)
    })
    return result
  }, [prompt, detectedVars, varValues])

  // Real-time stats
  const stats = useMemo(() => {
    const chars = finalPrompt.length
    const tokens = estimateTokens(finalPrompt)
    const cost = estimateCost(tokens, model)
    return { chars, tokens, cost }
  }, [finalPrompt, model])

  async function runPrompt() {
    setIsRunning(true)
    try {
      if (initialPrompt?.id) {
        const response = await fetch('/api/prompt/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            promptId: initialPrompt.id,
            promptText: finalPrompt,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to run prompt')
        }

        const result = (await response.json()) as RunResponse
        setRuns((prev) => [
          {
            response: result.response,
            tokens: result.tokens_used,
            latencyMs: result.execution_time_ms,
            createdAt: new Date().toISOString(),
            variables: varValues,
          },
          ...prev,
        ])
      } else {
        const res = await fetch('/api/prompt/run/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variant: 'A',
            model: model,
            prompt: finalPrompt,
            context,
            variablesRows: [varValues],
          }),
        })
        const json = await res.json()
        const out = json.outputs?.[0]
        setRuns((prev) => [
          {
            response: out?.response || 'No response',
            tokens: out?.tokens_used ?? null,
            latencyMs: out?.execution_time_ms ?? null,
            createdAt: new Date().toISOString(),
            variables: varValues,
          },
          ...prev,
        ])
      }

      if (!showHistory) setShowHistory(true)
    } catch (error) {
      console.error('Error running prompt:', error)
      toast({
        title: 'Error',
        description: 'Failed to run prompt. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsRunning(false)
    }
  }

  function loadTemplate(template: typeof QUICK_TEMPLATES[0]) {
    setPrompt(template.prompt)
    setVarValues(template.vars)
  }

  async function savePrompt() {
    if (!onSavePrompt) return
    if (!promptName.trim()) {
      toast({ title: 'Error', description: 'Please enter a name for your prompt.', variant: 'destructive' })
      return
    }

    try {
      await onSavePrompt({
        name: promptName,
        prompt_text: prompt,
        model: model,
        tags: [],
        is_public: false,
      })
      toast({ title: 'Saved', description: `"${promptName}" has been saved.` })
    } catch (error) {
      console.error('Error saving prompt:', error)
      toast({ title: 'Error', description: 'Failed to save prompt.', variant: 'destructive' })
    }
  }

  function exportResults() {
    const csv = [
      ['Response', 'Tokens', 'Latency (ms)', 'Variables', 'Created At'],
      ...runs.map((r) => [
        `"${r.response.replace(/"/g, '""')}"`,
        r.tokens || '',
        r.latencyMs || '',
        JSON.stringify(r.variables || {}),
        r.createdAt,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-results-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`flex h-full min-h-[600px] flex-col bg-white dark:bg-gray-950 ${className}`}>
      {/* Minimal sticky header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center gap-3">
          {onSavePrompt && (
            <Input
              value={promptName}
              onChange={(e) => setPromptName(e.target.value)}
              placeholder="Untitled prompt"
              className="h-9 w-64 border-0 px-0 text-base font-medium focus-visible:ring-0"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-9 w-[140px] border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o-mini">GPT-4o mini</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={runPrompt} disabled={isRunning || !prompt.trim()} size="sm">
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            Run
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onSavePrompt && (
                <DropdownMenuItem onClick={savePrompt}>Save Prompt</DropdownMenuItem>
              )}
              {runs.length > 0 && (
                <DropdownMenuItem onClick={exportResults}>Export Results</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setShowContext(!showContext)}>
                {showContext ? 'Hide' : 'Show'} Context
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content area: side-by-side layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Prompt editor */}
        <div className="flex flex-1 flex-col border-r border-gray-200 dark:border-gray-800">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {/* Context (collapsible) */}
              {showContext && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">Context</label>
                  <Textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Add background context, brand voice, or instructions..."
                    className="min-h-[80px] text-sm"
                  />
                </div>
              )}

              {/* Prompt textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-500">Prompt</label>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>{stats.chars} chars</span>
                    <span>~{stats.tokens} tokens</span>
                    <span>{stats.cost}</span>
                  </div>
                </div>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Write your prompt here... Use {variables} for dynamic content."
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>

              {/* Inline variables */}
              {detectedVars.length > 0 && (
                <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Variables</div>
                  <div className="space-y-2">
                    {detectedVars.map((varName) => (
                      <div key={varName} className="flex items-center gap-2">
                        <div className="w-24 text-xs font-medium text-gray-600 dark:text-gray-400">
                          {varName}
                        </div>
                        <Input
                          value={varValues[varName] || ''}
                          onChange={(e) =>
                            setVarValues((prev) => ({ ...prev, [varName]: e.target.value }))
                          }
                          placeholder={`Enter ${varName}...`}
                          className="h-8 flex-1 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              {detectedVars.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">Preview</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                    <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                      {finalPrompt}
                    </pre>
                  </div>
                </div>
              )}

              {/* Quick templates */}
              {runs.length === 0 && (
                <div className="space-y-2 pt-4">
                  <label className="text-xs font-medium text-gray-500">Quick Start</label>
                  <div className="grid gap-2">
                    {QUICK_TEMPLATES.map((template, idx) => (
                      <button
                        key={idx}
                        onClick={() => loadTemplate(template)}
                        className="rounded-lg border border-gray-200 bg-white p-3 text-left text-sm hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 dark:hover:bg-gray-900"
                      >
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {template.name}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">{template.prompt}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Results panel */}
        <div
          className={`flex flex-col border-l border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 ${
            showHistory ? 'w-[400px]' : 'w-12'
          } transition-all duration-200`}
        >
          {showHistory ? (
            <>
              <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    History
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {runs.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                {runs.length === 0 ? (
                  <div className="flex h-full items-center justify-center p-8 text-center">
                    <div className="text-gray-400">
                      <Zap className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      <p className="text-xs">Run your prompt to see results</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-4">
                    {runs.map((run, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex gap-2">
                            {run.tokens != null && (
                              <span className="text-xs text-gray-500">{run.tokens}t</span>
                            )}
                            {run.latencyMs != null && (
                              <span className="text-xs text-gray-500">{Math.round(run.latencyMs)}ms</span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              void navigator.clipboard.writeText(run.response)
                              toast({ title: 'Copied to clipboard' })
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                            {run.response}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(true)}
                className="h-7 w-7 p-0"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PromptLab
