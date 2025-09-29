'use client'

import {
  ChevronDown,
  ChevronRight,
  Copy,
  Loader2,
  Plus,
  Rocket,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

type VariablesRow = Record<string, string>

type RunResponse = {
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

type KeyValue = { key: string; value: string }

export function SimplePromptLab() {
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT)
  const [context, setContext] = useState<string>(DEFAULT_CONTEXT)
  const [showContext, setShowContext] = useState<boolean>(false)
  const [variables, setVariables] = useState<KeyValue[]>([
    { key: 'product', value: 'my SaaS tool' },
    { key: 'audience', value: 'small business owners' },
    { key: 'benefit', value: 'saving time and money' },
  ])
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [runs, setRuns] = useState<
    Array<{
      response: string
      tokens?: number | null
      latencyMs?: number | null
      costUsd?: number | null
      createdAt: string
    }>
  >([])
  const { toast } = useToast()

  function toVariablesRow(): VariablesRow {
    const row: VariablesRow = {}
    for (const kv of variables) {
      if (kv.key.trim()) row[kv.key.trim()] = kv.value
    }
    return row
  }

  async function runOnce() {
    setIsRunning(true)
    try {
      // Create a prompt that asks AI to improve the user's prompt
      const promptImprovementRequest = `You are an expert prompt engineer. I want you to improve this prompt to make it more effective and specific.

Original prompt: "${prompt}"

Variables I'm using: ${Object.entries(toVariablesRow()).map(([key, value]) => `${key} = "${value}"`).join(', ')}

${context ? `Additional context: ${context}` : ''}

Please provide an improved version of this prompt that:
1. Is more specific and actionable
2. Uses better structure and formatting
3. Includes clear instructions for the AI
4. Incorporates the variables and context effectively
5. Follows prompt engineering best practices

Return only the improved prompt, no explanations.`

      const res = await fetch('/api/prompt/run/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant: 'A',
          model: 'gpt-4',
          prompt: promptImprovementRequest,
          context: '',
          variablesRows: [{}],
        }),
      })
      const json = (await res.json()) as RunResponse
      const out = json.outputs?.[0]
      setRuns((prev) => [
        {
          response: out?.response || 'No response',
          tokens: out?.tokens_used ?? null,
          latencyMs: out?.execution_time_ms ?? null,
          costUsd: out?.cost_usd ?? null,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ])

      toast({
        title: 'Success!',
        description: 'Your prompt has been improved.',
      })
    } catch (error) {
      console.error('Error running prompt:', error)
      toast({
        title: 'Oops!',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsRunning(false)
    }
  }

  function addVar() {
    setVariables((v) => [...v, { key: '', value: '' }])
  }
  function removeVar(index: number) {
    setVariables((v) => v.filter((_, i) => i !== index))
  }
  function updateVar(index: number, field: 'key' | 'value', value: string) {
    setVariables((v) => v.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  return (
    <div className="mx-auto w-full max-w-full overflow-hidden rounded-2xl border border-emerald-200/50 bg-white p-4 shadow-sm ring-1 ring-emerald-500/10 dark:border-emerald-900/40 dark:bg-gray-900 md:max-w-4xl md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Prompt Lab</span>
          <Badge variant="outline" className="text-xs">
            Create Better Prompts
          </Badge>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Your prompt (we'll improve it)
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
            placeholder="Example: Write 5 Google Ads headlines for {product} targeting {audience}..."
          />
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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Fill in the details
            </label>
            <Button size="sm" variant="outline" onClick={addVar}>
              <Plus className="h-4 w-4 mr-1" /> Add Variable
            </Button>
          </div>
          <div className="space-y-3">
            {variables.map((kv, i) => (
              <div key={i} className="grid grid-cols-5 gap-3">
                <Input
                  placeholder="Variable name"
                  value={kv.key}
                  onChange={(e) => updateVar(i, 'key', e.target.value)}
                  className="col-span-2"
                />
                <Input
                  placeholder="Value"
                  value={kv.value}
                  onChange={(e) => updateVar(i, 'value', e.target.value)}
                  className="col-span-2"
                />
                <Button size="sm" variant="ghost" onClick={() => removeVar(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button onClick={runOnce} disabled={isRunning} size="lg">
            {isRunning ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Rocket className="h-5 w-5 mr-2" />
            )}
            Generate Prompt
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-lg font-medium text-gray-800 dark:text-gray-200">Improved Prompts</span>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Sparkles className="h-4 w-4" /> {runs.length} {runs.length === 1 ? 'prompt' : 'prompts'}
          </div>
        </div>
        {runs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Rocket className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Click "Generate Prompt" to see your improved prompt here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {runs.map((r, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Generated {new Date(r.createdAt).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(r.response)
                        toast({
                          title: 'Copied!',
                          description: 'Content copied to clipboard',
                        })
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="max-h-64">
                  <ScrollArea className="h-full">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200">
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

export default SimplePromptLab
