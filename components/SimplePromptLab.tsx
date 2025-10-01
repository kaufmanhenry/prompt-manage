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
  Save,
  Folder,
} from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

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

type SavedContext = {
  id: string
  name: string
  content: string
  createdAt: string
}

const CONTENT_TYPES = ['Email', 'Ad', 'Landing Page', 'Social', 'Blog', 'Other'] as const
type ContentType = typeof CONTENT_TYPES[number]

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
      return 'Outline a beginner’s guide to prompt engineering for marketers. Provide an H2/H3 structure and a brief intro and conclusion.'
    case 'Other':
    default:
      return 'Describe what you want to create in plain English. Example: draft a cold outreach message to book demos with marketing leaders.'
  }
}

function SimplePromptLab() {
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT)
  const [context, setContext] = useState<string>(DEFAULT_CONTEXT)
  const [showContext, setShowContext] = useState<boolean>(false)
  const [selectedContextId, setSelectedContextId] = useState<string>('')
  const [savedContexts, setSavedContexts] = useState<SavedContext[]>([])
  const [contextSearch, setContextSearch] = useState<string>('')
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false)
  const [newContextName, setNewContextName] = useState<string>('')
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [contentType, setContentType] = useState<ContentType>('Ad')
  const [promptTouched, setPromptTouched] = useState<boolean>(false)
  const [runs, setRuns] = useState<
    Array<{
      original: string
      response: string
      tokens?: number | null
      latencyMs?: number | null
      costUsd?: number | null
      createdAt: string
      isEditing?: boolean
      changes?: string[]
    }>
  >([])
  const [editingPrompt, setEditingPrompt] = useState<string>('')
  const [showFinalizeDialog, setShowFinalizeDialog] = useState<boolean>(false)
  const [finalPromptName, setFinalPromptName] = useState<string>('')
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Get user session
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  // Load saved contexts from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedContexts')
    if (saved) {
      try {
        setSavedContexts(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading saved contexts:', error)
      }
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isMeta = e.ctrlKey || e.metaKey
      if (e.key === 'Enter' && !isRunning) {
        e.preventDefault()
        runOnce()
      }
      if (isMeta && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (runs.length > 0) {
          setEditingPrompt(runs[0].response)
          // Default name from first 6 words
          const defaultName = runs[0].response
            .split(/\s+/)
            .slice(0, 6)
            .join(' ')
          setFinalPromptName(defaultName)
          setShowFinalizeDialog(true)
        }
      }
      if (isMeta && e.key.toLowerCase() === 'c') {
        e.preventDefault()
        if (runs.length > 0) {
          navigator.clipboard.writeText(runs[0].response)
          toast({ title: 'Copied!', description: 'Prompt copied to clipboard' })
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isRunning, runs])

  // Update example prompt when content type changes, if user hasn't typed a custom idea
  useEffect(() => {
    const example = getExampleForType(contentType)
    // Replace if untouched or currently equals another example template
    if (!promptTouched || CONTENT_TYPES.some((t) => prompt === getExampleForType(t as ContentType))) {
      setPrompt(example)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType])

  function toVariablesRow(): VariablesRow {
    const row: VariablesRow = {}
    for (const kv of variables) {
      if (kv.key.trim()) row[kv.key.trim()] = kv.value
    }
    return row
  }

  function saveContext() {
    if (!newContextName.trim() || !context.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter both a name and context content.',
        variant: 'destructive',
      })
      return
    }

    const newContext: SavedContext = {
      id: Date.now().toString(),
      name: newContextName.trim(),
      content: context.trim(),
      createdAt: new Date().toISOString(),
    }

    const updatedContexts = [...savedContexts, newContext]
    setSavedContexts(updatedContexts)
    localStorage.setItem('savedContexts', JSON.stringify(updatedContexts))
    
    setNewContextName('')
    setShowSaveDialog(false)
    
    toast({
      title: 'Context saved!',
      description: `"${newContext.name}" has been saved to your context library.`,
    })
  }

  function loadContext(contextId: string) {
    const savedContext = savedContexts.find(c => c.id === contextId)
    if (savedContext) {
      setContext(savedContext.content)
      setSelectedContextId(contextId)
      toast({
        title: 'Context loaded!',
        description: `Loaded "${savedContext.name}" context.`,
      })
    }
  }

  function deleteContext(contextId: string) {
    const updatedContexts = savedContexts.filter(c => c.id !== contextId)
    setSavedContexts(updatedContexts)
    localStorage.setItem('savedContexts', JSON.stringify(updatedContexts))
    
    if (selectedContextId === contextId) {
      setSelectedContextId('')
      setContext(DEFAULT_CONTEXT)
    }
    
    toast({
      title: 'Context deleted',
      description: 'The context has been removed from your library.',
    })
  }


  function generateWhatChanged(beforeText: string, afterText: string): string[] {
    const changes: string[] = []
    if (afterText.length !== beforeText.length) {
      const delta = afterText.length - beforeText.length
      changes.push(`${delta > 0 ? 'Expanded' : 'Condensed'} details (${Math.abs(delta)} chars)`) 
    }
    if (/\n\n|\d+\.|\-|\*/.test(afterText) && !/\n\n|\d+\.|\-|\*/.test(beforeText)) {
      changes.push('Improved structure and formatting')
    }
    if (/(you|your|audience|target|tone)/i.test(afterText) && !/(you|your|audience|target|tone)/i.test(beforeText)) {
      changes.push('Clarified audience and instructions')
    }
    if (context && afterText.toLowerCase().includes('brand')) {
      changes.push('Incorporated brand context')
    }
    return changes.slice(0, 3)
  }

  async function runOnce() {
    setIsRunning(true)
    setProgress(10)
    const start = Date.now()
    const progressTimer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 8 : p))
    }, 250)
    try {
      const res = await fetch('/api/prompt/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to improve prompt')
      }

      const result = await res.json()
      const after = result.response || 'No response'
      const changes = generateWhatChanged(prompt, after)
      setRuns((prev) => [
        {
          original: prompt,
          response: after,
          tokens: result.tokens_used ?? null,
          latencyMs: result.execution_time_ms ?? null,
          costUsd: null,
          createdAt: new Date().toISOString(),
          isEditing: false,
          changes,
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
        description: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      clearInterval(progressTimer)
      setProgress(100)
      setIsRunning(false)
      setTimeout(() => setProgress(0), 500)
    }
  }

  function startEditing(index: number) {
    const updatedRuns = runs.map((run, i) => ({
      ...run,
      isEditing: i === index
    }))
    setRuns(updatedRuns)
    setEditingPrompt(runs[index].response)
  }

  function saveEdit(index: number) {
    const updatedRuns = runs.map((run, i) => ({
      ...run,
      response: i === index ? editingPrompt : run.response,
      isEditing: false
    }))
    setRuns(updatedRuns)
    setEditingPrompt('')
    
    toast({
      title: 'Prompt updated!',
      description: 'Your changes have been saved.',
    })
  }

  function cancelEdit(index: number) {
    const updatedRuns = runs.map((run, i) => ({
      ...run,
      isEditing: false
    }))
    setRuns(updatedRuns)
    setEditingPrompt('')
  }

  function finalizePrompt(index: number) {
    setEditingPrompt(runs[index].response)
    // default name from first 6 words
    const defaultName = runs[index].response
      .split(/\s+/)
      .slice(0, 6)
      .join(' ')
    setFinalPromptName(defaultName)
    setShowFinalizeDialog(true)
  }

  function saveFinalPrompt() {
    if (!finalPromptName.trim()) {
      toast({
        title: 'Missing name',
        description: 'Please enter a name for your prompt.',
        variant: 'destructive',
      })
      return
    }

    if (!session?.user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in to save prompts.',
        variant: 'destructive',
      })
      return
    }

    // Save to database
    const saveToDatabase = async () => {
      try {
        const { error } = await createClient()
          .from('prompts')
          .insert({
            name: finalPromptName.trim(),
            prompt_text: editingPrompt,
            model: 'gpt-4',
            tags: [contentType.toLowerCase()],
            is_public: false,
            user_id: session.user.id,
          })

        if (error) throw error

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['prompts'] })
        
        setFinalPromptName('')
        setShowFinalizeDialog(false)
        setEditingPrompt('')
        
        toast({
          title: 'Prompt saved!',
          description: `"${finalPromptName}" has been saved to your prompt library.`,
        })
      } catch (error) {
        console.error('Error saving prompt:', error)
        toast({
          title: 'Error',
          description: 'Failed to save prompt. Please try again.',
          variant: 'destructive',
        })
      }
    }

    saveToDatabase()
  }

  return (
    <div className="mx-auto w-full max-w-full overflow-hidden rounded-2xl border border-emerald-200/50 bg-white p-4 shadow-sm ring-1 ring-emerald-500/10 dark:border-emerald-900/40 dark:bg-gray-900 md:max-w-4xl md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Turn your idea into a great prompt</span>
          <Badge variant="outline" className="text-xs">
            Create Better Prompts
          </Badge>
        </div>
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
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
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
                ? 'Example: Blog outline for beginner’s guide to prompts...'
                : 'Example: Describe what you want to create...'
            }
          />
          <p className="mt-1 text-xs text-gray-500">Write what you want—don’t worry about wording. We’ll turn it into a great prompt.</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
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
              <div className="flex items-center gap-2">
                <Select value={selectedContextId} onValueChange={loadContext}>
                  <SelectTrigger className="w-48 h-8 text-xs">
                    <SelectValue placeholder="Load saved context" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1">
                      <Input
                        value={contextSearch}
                        onChange={(e) => setContextSearch(e.target.value)}
                        placeholder="Search contexts..."
                        className="h-8 text-xs"
                      />
                    </div>
                    {savedContexts
                      .filter((c) => c.name.toLowerCase().includes(contextSearch.toLowerCase()))
                      .map((ctx) => (
                      <SelectItem key={ctx.id} value={ctx.id}>
                        <div className="flex items-center gap-2">
                          <Folder className="h-3 w-3" />
                          {ctx.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="h-8 text-xs">
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Context</DialogTitle>
                      <DialogDescription>
                        Give this context a name so you can reuse it later.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Context Name</label>
                        <Input
                          value={newContextName}
                          onChange={(e) => setNewContextName(e.target.value)}
                          placeholder="e.g., Company A Context, Project B Context"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveContext}>
                          Save Context
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
          {showContext && (
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[80px] font-mono text-sm"
              placeholder="Company: Your company name and what you do. Voice: Your brand personality..."
            />
          )}
        </div>


        {selectedContextId && (
          <div className="text-xs text-emerald-700 dark:text-emerald-300">Using context: {savedContexts.find(c=>c.id===selectedContextId)?.name}</div>
        )}

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

        {isRunning || progress > 0 ? (
          <div className="mt-2 h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}
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
                    {r.isEditing ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => saveEdit(idx)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelEdit(idx)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(idx)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => finalizePrompt(idx)}
                        >
                          Finalize & Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(r.response)
                            toast({
                              title: 'Copied!',
                              description: 'Prompt copied to clipboard',
                            })
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Before */}
                  <div className="rounded-md border border-gray-200 p-3 dark:border-gray-800">
                    <div className="mb-2 text-xs font-semibold text-gray-600">Your idea</div>
                    <ScrollArea className="h-full max-h-64">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">{r.original}</pre>
                    </ScrollArea>
                  </div>
                  {/* After */}
                  <div className="rounded-md border border-emerald-200 p-3 ring-1 ring-emerald-500/20 dark:border-emerald-900/40">
                    <div className="mb-2 text-xs font-semibold text-gray-600">Improved prompt</div>
                    {r.isEditing ? (
                      <Textarea
                        value={editingPrompt}
                        onChange={(e) => setEditingPrompt(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                    ) : (
                      <ScrollArea className="h-full max-h-64">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200">{r.response}</pre>
                      </ScrollArea>
                    )}
                  </div>
                </div>

                {r.changes && r.changes.length > 0 && (
                  <div className="mt-3 text-xs text-gray-600">
                    <span className="font-semibold">What changed:</span> {r.changes.join(' • ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Finalize Dialog */}
      <Dialog open={showFinalizeDialog} onOpenChange={setShowFinalizeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalize & Save Prompt</DialogTitle>
            <DialogDescription>
              Give your prompt a name and save it to your library.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Prompt Name</label>
              <Input
                value={finalPromptName}
                onChange={(e) => setFinalPromptName(e.target.value)}
                placeholder="e.g., Google Ads Headlines Generator"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Final Prompt</label>
              <Textarea
                value={editingPrompt}
                onChange={(e) => setEditingPrompt(e.target.value)}
                className="mt-1 min-h-[150px] font-mono text-sm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowFinalizeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={saveFinalPrompt}>
                Save Prompt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SimplePromptLab
