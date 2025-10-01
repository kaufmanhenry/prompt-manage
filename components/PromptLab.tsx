'use client'

import {
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  FileText,
  Loader2,
  Play,
  Plus,
  Rocket,
  Save,
  Sparkles,
  Square,
  Trash2,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

type KeyValue = { key: string; value: string }

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

const PROMPT_TEMPLATES = [
  {
    name: 'Google Ads Headlines',
    category: 'Marketing',
    prompt: `Goal: Generate 5 Google Ads headlines (<= 30 chars)
Audience: {audience}
Product: {product}
Benefit: {benefit}
Tone: {tone}

Instructions:
- Use direct response style
- Include one curiosity angle
- Avoid clickbait`,
    variables: [
      { key: 'audience', value: 'Ecommerce marketers' },
      { key: 'product', value: 'Prompt Manage' },
      { key: 'benefit', value: 'Higher ROAS from better copy' },
      { key: 'tone', value: 'Confident and helpful' },
    ],
  },
  {
    name: 'Email Subject Lines',
    category: 'Marketing',
    prompt: `Create 10 compelling email subject lines for:
Product: {product}
Campaign: {campaign_type}
Audience: {audience}
Goal: {goal}

Requirements:
- Keep under 50 characters
- Include urgency or curiosity
- Avoid spam words
- Test different angles`,
    variables: [
      { key: 'product', value: 'SaaS Product' },
      { key: 'campaign_type', value: 'Newsletter' },
      { key: 'audience', value: 'Small business owners' },
      { key: 'goal', value: 'Increase open rates' },
    ],
  },
  {
    name: 'Social Media Posts',
    category: 'Social Media',
    prompt: `Create engaging social media content for:
Platform: {platform}
Brand: {brand}
Topic: {topic}
Tone: {tone}
Length: {length}

Include:
- Hook in first line
- Call-to-action
- Relevant hashtags
- Platform-specific formatting`,
    variables: [
      { key: 'platform', value: 'LinkedIn' },
      { key: 'brand', value: 'Tech Startup' },
      { key: 'topic', value: 'AI productivity tools' },
      { key: 'tone', value: 'Professional but approachable' },
      { key: 'length', value: 'Medium (2-3 sentences)' },
    ],
  },
  {
    name: 'Product Descriptions',
    category: 'E-commerce',
    prompt: `Write compelling product descriptions for:
Product: {product_name}
Category: {category}
Target: {target_audience}
Price: {price_range}
Features: {key_features}

Focus on:
- Benefits over features
- Emotional triggers
- Clear value proposition
- SEO-friendly keywords`,
    variables: [
      { key: 'product_name', value: 'Wireless Headphones' },
      { key: 'category', value: 'Electronics' },
      { key: 'target_audience', value: 'Music enthusiasts' },
      { key: 'price_range', value: '$100-200' },
      { key: 'key_features', value: 'Noise cancellation, 30hr battery' },
    ],
  },
  {
    name: 'Blog Post Outline',
    category: 'Content',
    prompt: `Create a detailed blog post outline for:
Topic: {topic}
Target Audience: {audience}
Word Count: {word_count}
SEO Keyword: {keyword}
Goal: {goal}

Structure:
- Compelling headline
- Introduction hook
- Main sections with subheadings
- Conclusion with CTA
- Suggested internal links`,
    variables: [
      { key: 'topic', value: 'AI tools for small businesses' },
      { key: 'audience', value: 'Small business owners' },
      { key: 'word_count', value: '2000 words' },
      { key: 'keyword', value: 'AI productivity' },
      { key: 'goal', value: 'Generate leads' },
    ],
  },
  {
    name: 'Customer Support Response',
    category: 'Support',
    prompt: `Draft a professional customer support response for:
Issue: {issue_type}
Customer: {customer_type}
Urgency: {urgency_level}
Resolution: {resolution_type}

Tone: {tone}
Include:
- Empathy statement
- Clear explanation
- Next steps
- Follow-up offer`,
    variables: [
      { key: 'issue_type', value: 'Billing question' },
      { key: 'customer_type', value: 'Premium subscriber' },
      { key: 'urgency_level', value: 'Medium' },
      { key: 'resolution_type', value: 'Account adjustment' },
      { key: 'tone', value: 'Helpful and professional' },
    ],
  },
]

const DEFAULT_CONTEXT = `Company: Prompt Manage helps marketing teams organize, test, and share prompts.
Voice: Clear, confident, and helpful.`

export function PromptLab({ initialPrompt, onSavePrompt, className = '' }: PromptLabProps) {
  const [prompt, setPrompt] = useState<string>(
    initialPrompt?.prompt_text || PROMPT_TEMPLATES[0].prompt,
  )
  const [context, setContext] = useState<string>(DEFAULT_CONTEXT)
  const [showContext, setShowContext] = useState<boolean>(false)
  const [variables, setVariables] = useState<KeyValue[]>(PROMPT_TEMPLATES[0].variables)
  const [model, setModel] = useState<string>(initialPrompt?.model || 'gpt-4')
  const [promptName, setPromptName] = useState<string>(initialPrompt?.name || '')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false)
  const [batchData, setBatchData] = useState<string>('')
  const [batchResults, setBatchResults] = useState<
    Array<{
      response: string
      tokens?: number | null
      latencyMs?: number | null
      variables?: VariablesRow
      createdAt: string
    }>
  >([])
  const [runs, setRuns] = useState<
    Array<{
      response: string
      tokens?: number | null
      latencyMs?: number | null
      createdAt: string
      variables?: VariablesRow
    }>
  >([])
  const [_selectedTemplate, _setSelectedTemplate] = useState<string>('')
  const [showTemplates, setShowTemplates] = useState<boolean>(false)
  const { toast } = useToast()

  // Auto-detect variables from prompt text
  useEffect(() => {
    const variableRegex = /\{([^}]+)\}/g
    const matches = prompt.match(variableRegex)
    if (matches) {
      const detectedVariables = matches.map((match) => {
        const key = match.slice(1, -1) // Remove { and }
        const existingVar = variables.find((v) => v.key === key)
        return {
          key,
          value: existingVar?.value || '',
        }
      })

      // Only update if we found new variables
      const hasNewVariables = detectedVariables.some(
        (dv) => !variables.some((v) => v.key === dv.key),
      )

      if (hasNewVariables) {
        setVariables(detectedVariables)
      }
    }
  }, [prompt]) // eslint-disable-line react-hooks/exhaustive-deps -- variables intentionally omitted to prevent infinite loop

  function toVariablesRow(): VariablesRow {
    const row: VariablesRow = {}
    for (const kv of variables) {
      if (kv.key.trim()) row[kv.key.trim()] = kv.value
    }
    return row
  }

  function substituteVariables(promptText: string, variables: VariablesRow): string {
    let substitutedPrompt = promptText
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{${key}\\}`, 'g')
      substitutedPrompt = substitutedPrompt.replace(regex, value)
    }
    return substitutedPrompt
  }

  async function runPrompt() {
    setIsRunning(true)
    try {
      const variablesRow = toVariablesRow()
      const substitutedPrompt = substituteVariables(prompt, variablesRow)

      // Use the private prompt running API if we have a prompt ID
      if (initialPrompt?.id) {
        const response = await fetch('/api/prompt/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            promptId: initialPrompt.id,
            promptText: substitutedPrompt, // Use the substituted prompt
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
            variables: variablesRow,
          },
          ...prev,
        ])
      } else {
        // Use the preview API for new prompts
        const res = await fetch('/api/prompt/run/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variant: 'A',
            model: model,
            prompt: substitutedPrompt, // Use the substituted prompt
            context,
            variablesRows: [variablesRow],
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
            variables: variablesRow,
          },
          ...prev,
        ])
      }

      toast({
        title: 'Prompt Executed',
        description: 'Your prompt has been successfully executed.',
      })
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

  async function runBatch() {
    if (!batchData.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter batch data (CSV format).',
        variant: 'destructive',
      })
      return
    }

    setIsRunning(true)
    try {
      // Parse CSV data
      const lines = batchData.trim().split('\n')
      const headers = lines[0].split(',').map((h) => h.trim())
      const rows = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim())
        const row: VariablesRow = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        return row
      })

      const results = []
      for (const row of rows) {
        const substitutedPrompt = substituteVariables(prompt, row)
        const res = await fetch('/api/prompt/run/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            variant: 'A',
            model: model,
            prompt: substitutedPrompt, // Use the substituted prompt
            context,
            variablesRows: [row],
          }),
        })
        const json = await res.json()
        const out = json.outputs?.[0]
        results.push({
          variables: row,
          response: out?.response || 'No response',
          tokens: out?.tokens_used ?? null,
          latencyMs: out?.execution_time_ms ?? null,
          createdAt: new Date().toISOString(),
        })
      }

      setBatchResults(results)
      toast({
        title: 'Batch Processing Complete',
        description: `Processed ${results.length} rows successfully.`,
      })
    } catch (error) {
      console.error('Error running batch:', error)
      toast({
        title: 'Error',
        description: 'Failed to run batch processing. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsRunning(false)
    }
  }

  function loadTemplate(template: (typeof PROMPT_TEMPLATES)[0]) {
    setPrompt(template.prompt)
    setVariables(template.variables)
    setPromptName(template.name)
    setShowTemplates(false)
    toast({
      title: 'Template Loaded',
      description: `Loaded "${template.name}" template.`,
    })
  }

  function exportResults() {
    const data = isBatchMode ? batchResults : runs
    const csvContent = isBatchMode ? generateBatchCSV(data) : generateRunsCSV(data)

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-results-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function generateBatchCSV(
    data: Array<{
      response: string
      tokens?: number | null
      latencyMs?: number | null
      variables?: VariablesRow
      createdAt: string
    }>,
  ) {
    if (data.length === 0) return ''

    const headers = ['Variables', 'Response', 'Tokens', 'Latency (ms)', 'Created At']
    const rows = data.map((item) => [
      JSON.stringify(item.variables),
      `"${item.response.replace(/"/g, '""')}"`,
      item.tokens || '',
      item.latencyMs || '',
      item.createdAt,
    ])

    return [headers, ...rows].map((row) => row.join(',')).join('\n')
  }

  function generateRunsCSV(
    data: Array<{
      response: string
      tokens?: number | null
      latencyMs?: number | null
      createdAt: string
    }>,
  ) {
    if (data.length === 0) return ''

    const headers = ['Response', 'Tokens', 'Latency (ms)', 'Created At']
    const rows = data.map((item) => [
      `"${item.response.replace(/"/g, '""')}"`,
      item.tokens || '',
      item.latencyMs || '',
      item.createdAt,
    ])

    return [headers, ...rows].map((row) => row.join(',')).join('\n')
  }

  async function savePrompt() {
    if (!promptName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for your prompt.',
        variant: 'destructive',
      })
      return
    }

    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter prompt text.',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    try {
      await onSavePrompt?.({
        name: promptName,
        prompt_text: prompt,
        model: model,
        tags: [],
        is_public: false,
      })

      toast({
        title: 'Prompt Saved',
        description: `"${promptName}" has been successfully saved.`,
      })
    } catch (error) {
      console.error('Error saving prompt:', error)
      toast({
        title: 'Error',
        description: 'Failed to save prompt. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
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
    <div
      className={`mx-auto w-full max-w-full overflow-hidden rounded-2xl border border-emerald-200/50 bg-white shadow-sm ring-1 ring-emerald-500/10 dark:border-emerald-900/40 dark:bg-gray-900 md:max-w-6xl ${className}`}
    >
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Prompt Lab
              </span>
              <Badge variant="outline" className="text-xs">
                {initialPrompt?.id ? 'Edit Mode' : 'Create Mode'}
              </Badge>
              {isBatchMode && (
                <Badge variant="secondary" className="text-xs">
                  Batch Mode
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Templates
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Prompt Templates</DialogTitle>
                  <DialogDescription>
                    Choose from pre-built templates to get started quickly.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2">
                  {PROMPT_TEMPLATES.map((template, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => loadTemplate(template)}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400">
                        {template.prompt.substring(0, 150)}...
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {template.variables.slice(0, 3).map((var_, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {var_.key}
                          </Badge>
                        ))}
                        {template.variables.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.variables.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="h-9 min-w-[160px]">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">gpt-4</SelectItem>
                <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                <SelectItem value="gpt-3.5-turbo">gpt-3.5-turbo</SelectItem>
                <SelectItem disabled value="__pro__">
                  All Models Available on PRO
                </SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={() => setIsBatchMode(!isBatchMode)}>
              {isBatchMode ? (
                <Square className="mr-2 h-4 w-4" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isBatchMode ? 'Single' : 'Batch'}
            </Button>

            {(runs.length > 0 || batchResults.length > 0) && (
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            )}

            {onSavePrompt && (
              <Button
                onClick={savePrompt}
                disabled={isSaving || !promptName.trim() || !prompt.trim()}
                variant="outline"
                size="sm"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Prompt
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs
          defaultValue="single"
          value={isBatchMode ? 'batch' : 'single'}
          onValueChange={(value) => setIsBatchMode(value === 'batch')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Run</TabsTrigger>
            <TabsTrigger value="batch">Batch Processing</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column - Input */}
              <div className="space-y-6">
                {/* Prompt Name */}
                {onSavePrompt && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Prompt Name
                    </label>
                    <Input
                      value={promptName}
                      onChange={(e) => setPromptName(e.target.value)}
                      placeholder="Enter a name for your prompt"
                      className="mt-1"
                    />
                  </div>
                )}

                {/* Prompt Text */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Prompt
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="mt-1 min-h-[200px] font-mono text-sm"
                    placeholder="Enter your prompt text here..."
                  />
                </div>

                {/* Context */}
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
                    Context (optional)
                  </button>
                  {showContext && (
                    <Textarea
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      className="min-h-[100px] font-mono text-sm"
                      placeholder="Add context about your company, brand voice, etc."
                    />
                  )}
                </div>

                {/* Variables */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Variables (optional)
                    </label>
                    <Button size="sm" variant="outline" onClick={addVar}>
                      <Plus className="h-4 w-4" /> Add Variable
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {variables.map((kv, i) => (
                      <div key={i} className="grid grid-cols-5 gap-3">
                        <Input
                          placeholder="key"
                          value={kv.key}
                          onChange={(e) => updateVar(i, 'key', e.target.value)}
                          className="col-span-2"
                        />
                        <Input
                          placeholder="value"
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

                {/* Prompt Preview */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Preview (what will be sent to AI)
                  </label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                      {substituteVariables(prompt, toVariablesRow())}
                    </pre>
                  </div>
                </div>

                {/* Run Button */}
                <div className="flex justify-end">
                  <Button onClick={runPrompt} disabled={isRunning} size="lg">
                    {isRunning ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Rocket className="h-5 w-5" />
                    )}
                    Run Prompt
                  </Button>
                </div>
              </div>

              {/* Right Column - Output */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Outputs
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Sparkles className="h-4 w-4" />
                    {runs.length} {runs.length === 1 ? 'run' : 'runs'}
                  </div>
                </div>

                {runs.length === 0 ? (
                  <Card className="p-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <Zap className="mx-auto mb-3 h-12 w-12 opacity-50" />
                      <p className="text-sm">Run your prompt to see output here</p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {runs.map((run, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(run.createdAt).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            {run.tokens != null && (
                              <Badge variant="secondary" className="text-xs">
                                {run.tokens} tokens
                              </Badge>
                            )}
                            {run.latencyMs != null && (
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(run.latencyMs)}ms
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                void navigator.clipboard.writeText(run.response)
                                toast({
                                  title: 'Copied',
                                  description: 'Response copied to clipboard',
                                })
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <ScrollArea className="max-h-64">
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                            {run.response}
                          </pre>
                        </ScrollArea>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="batch" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column - Batch Input */}
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Batch Data (CSV Format)
                  </label>
                  <Textarea
                    value={batchData}
                    onChange={(e) => setBatchData(e.target.value)}
                    className="mt-1 min-h-[300px] font-mono text-sm"
                    placeholder={`product,audience,tone
Prompt Manage,Ecommerce marketers,Confident
SaaS Tool,Small businesses,Professional
Mobile App,Gen Z users,Casual`}
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Enter CSV data with headers in the first row. Each row will be processed as a
                    separate run with the corresponding variables.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={runBatch} disabled={isRunning || !batchData.trim()} size="lg">
                    {isRunning ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Rocket className="h-5 w-5" />
                    )}
                    Process Batch
                  </Button>
                </div>
              </div>

              {/* Right Column - Batch Results */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Batch Results
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Sparkles className="h-4 w-4" />
                    {batchResults.length} {batchResults.length === 1 ? 'result' : 'results'}
                  </div>
                </div>

                {batchResults.length === 0 ? (
                  <Card className="p-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <Zap className="mx-auto mb-3 h-12 w-12 opacity-50" />
                      <p className="text-sm">Process batch data to see results here</p>
                    </div>
                  </Card>
                ) : (
                  <div className="max-h-[600px] space-y-4 overflow-y-auto">
                    {batchResults.map((result, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Row {idx + 1} • {new Date(result.createdAt).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            {result.tokens != null && (
                              <Badge variant="secondary" className="text-xs">
                                {result.tokens} tokens
                              </Badge>
                            )}
                            {result.latencyMs != null && (
                              <Badge variant="secondary" className="text-xs">
                                {Math.round(result.latencyMs)}ms
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                void navigator.clipboard.writeText(result.response)
                                toast({
                                  title: 'Copied',
                                  description: 'Response copied to clipboard',
                                })
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                            Variables:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(result.variables || {}).map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key}: {value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <ScrollArea className="max-h-48">
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                            {result.response}
                          </pre>
                        </ScrollArea>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default PromptLab
