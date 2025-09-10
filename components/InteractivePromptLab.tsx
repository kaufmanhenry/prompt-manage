'use client'

import { useMemo, useState } from 'react'

import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { modelSchema } from '@/lib/schemas/prompt'
import {
  Rocket,
  Sparkles,
  Plus,
  Loader2,
  ChevronDown,
  ChevronRight,
  Trash2,
  Copy,
} from 'lucide-react'

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

const DEFAULT_PROMPT = `Goal: Generate 5 Google Ads headlines (<= 30 chars)
Audience: {audience}
Product: {product}
Benefit: {benefit}
Tone: {tone}

Instructions:
- Use direct response style
- Include one curiosity angle
- Avoid clickbait`

const DEFAULT_CONTEXT = `Company: Prompt Manage helps marketing teams organize, test, and share prompts.
Voice: Clear, confident, and helpful.`

type KeyValue = { key: string; value: string }

export function InteractivePromptLab() {
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT)
  const [context, setContext] = useState<string>(DEFAULT_CONTEXT)
  const [showContext, setShowContext] = useState<boolean>(false)
  const [variables, setVariables] = useState<KeyValue[]>([
    { key: 'product', value: 'Prompt Manage' },
    { key: 'audience', value: 'Ecommerce marketers' },
    { key: 'benefit', value: 'Higher ROAS from better copy' },
    { key: 'tone', value: 'Confident and helpful' },
  ])
  const [model, setModel] = useState<string>('gpt-4')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [runs, setRuns] = useState<Array<{
    response: string
    tokens?: number | null
    latencyMs?: number | null
    costUsd?: number | null
    createdAt: string
  }>>([])

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
      const res = await fetch('/api/prompt/run/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant: 'A',
          model: 'gpt-4',
          prompt,
          context,
          variablesRows: [toVariablesRow()],
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
    <div className="mx-auto w-full max-w-full md:max-w-md rounded-2xl border border-emerald-200/50 dark:border-emerald-900/40 bg-white dark:bg-gray-900 p-4 md:p-5 shadow-sm ring-1 ring-emerald-500/10 overflow-hidden">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Prompt Lab</span>
          <Badge variant="outline" className="text-[10px]">Preview</Badge>
        </div>
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="h-8 text-xs min-w-[160px]">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">gpt-4</SelectItem>
            <SelectItem disabled value="__pro__">All Models Available on PRO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-3 space-y-3">
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-300">Prompt</label>
          <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[140px] font-mono text-[12px]" />
        </div>
        <div className="space-y-1">
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300"
            onClick={() => setShowContext(!showContext)}
          >
            {showContext ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            Context (optional)
          </button>
          {showContext && (
            <Textarea value={context} onChange={(e) => setContext(e.target.value)} className="min-h-[80px] font-mono text-[12px]" />
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-600 dark:text-gray-300">Variables (optional)</label>
            <Button size="sm" variant="outline" onClick={addVar}><Plus className="w-3.5 h-3.5" /> Add</Button>
          </div>
          <div className="space-y-2">
            {variables.map((kv, i) => (
              <div key={i} className="grid grid-cols-5 gap-2">
                <Input
                  placeholder="key"
                  value={kv.key}
                  onChange={(e) => updateVar(i, 'key', e.target.value)}
                  className="col-span-2 h-8 text-xs"
                />
                <Input
                  placeholder="value"
                  value={kv.value}
                  onChange={(e) => updateVar(i, 'value', e.target.value)}
                  className="col-span-3 h-8 text-xs"
                />
                <div className="col-span-5 flex justify-end">
                  <Button size="sm" variant="ghost" onClick={() => removeVar(i)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button onClick={runOnce} disabled={isRunning}>
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />} Run
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Outputs</span>
          <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> {runs.length} {runs.length === 1 ? 'run' : 'runs'}
          </div>
        </div>
        {runs.length === 0 ? (
          <div className="text-[12px] text-gray-500">Run to see output...</div>
        ) : (
          <div className="space-y-3">
            {runs.map((r, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[12px] text-gray-600 dark:text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-700 dark:text-gray-300">
                    {r.tokens != null && <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30">{r.tokens} tokens</span>}
                    {r.latencyMs != null && <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30">{Math.round(r.latencyMs)}ms</span>}
                    {r.costUsd != null && <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30">${r.costUsd.toFixed(4)}</span>}
                    <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(r.response)}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="max-h-56 md:max-h-64">
                  <ScrollArea className="h-full">
                    <pre className="text-[11px] leading-5 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{r.response}</pre>
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


