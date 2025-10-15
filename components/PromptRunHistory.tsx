'use client'

import { useQuery } from '@tanstack/react-query'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  MessageSquare,
  RefreshCw,
  Sparkles,
  X,
  XCircle,
  Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CardLoading } from '@/components/ui/loading'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'
import type { PromptRunHistory } from '@/lib/schemas/prompt-run-history'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

interface PromptRunHistoryProps {
  promptId: string
  onClose?: () => void
}

interface HistoryResponse {
  success: boolean
  history: PromptRunHistory[]
  pagination: {
    limit: number
    offset: number
    hasMore: boolean
  }
}

export function PromptRunHistory({ promptId, onClose }: PromptRunHistoryProps) {
  const { toast } = useToast()
  const [selectedRun, setSelectedRun] = useState<PromptRunHistory | null>(null)

  const {
    data: historyData,
    isLoading,
    error,
    refetch,
  } = useQuery<HistoryResponse>({
    queryKey: ['prompt-run-history', promptId],
    queryFn: async () => {
      const response = await fetch(`/api/prompts/${promptId}/history?limit=50`)
      if (!response.ok) {
        throw new Error('Failed to fetch history')
      }
      return response.json()
    },
  })

  const handleCopyResponse = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Copied to clipboard',
        description: 'Response copied to clipboard',
      })
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'timeout':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Success
          </Badge>
        )
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'timeout':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Timeout
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDuration = (ms: number | null) => {
    if (!ms) return 'N/A'
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const history = useMemo(() => historyData?.history || [], [historyData?.history])
  const cappedHistory = useMemo(() => history.slice(0, 100), [history])

  if (isLoading) {
    return (
      <Card className="gap-4 space-y-0 p-4">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Run History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CardLoading text="Loading history..." />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="gap-4 space-y-0 p-4">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Run History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="py-8 text-center">
            <XCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
            <p className="text-red-600">Failed to load history</p>
            <Button variant="outline" onClick={() => refetch()} className="mt-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="gap-0 space-y-0 p-4">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Run History
            <Badge variant="outline">{history.length}</Badge>
          </div>
          <div className="flex gap-2">
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {history.length === 0 ? (
          <div className="space-y-2 py-8 text-center text-muted-foreground">
            <MessageSquare className="mx-auto mb-2 h-8 w-8" />
            <p className="font-medium text-foreground">No run history yet</p>
            <p className="text-sm text-muted-foreground">Run this prompt to see its history here</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh History
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="h-full space-y-2">
                {cappedHistory.map((run) => (
                  <div
                    key={run.id}
                    className={`h-fit cursor-pointer rounded-lg p-2 transition-colors ${
                      selectedRun?.id === run.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedRun(selectedRun?.id === run.id ? null : run)}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(run.status)}
                        {getStatusBadge(run.status)}
                        <span className="text-sm text-muted-foreground">
                          {formatTimestamp(run.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {run.execution_time_ms && (
                          <div className="flex items-center gap-1 rounded-md bg-accent px-2 py-1">
                            <Zap className="h-3 w-3" />
                            {formatDuration(run.execution_time_ms)}
                          </div>
                        )}
                        {run.tokens_used && (
                          <div className="flex items-center gap-1 rounded-md bg-accent px-2 py-1">
                            <Sparkles className="h-3 w-3" />
                            {run.tokens_used} tokens
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-2 text-sm text-muted-foreground">Model: {run.model}</div>

                    {run.error_message && (
                      <div className="mb-2 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                        Error: {run.error_message}
                      </div>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="h-4 w-4" /> Refresh History
                </Button>
              </div>

              <div className="h-full space-y-3">
                {selectedRun ? (
                  <>
                    <div>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="prompt">
                          <AccordionTrigger className="text-sm font-medium">
                            Prompt
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="whitespace-pre-wrap rounded bg-muted p-3 font-mono text-sm">
                              {selectedRun.prompt_text}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-sm font-medium">Response:</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            void handleCopyResponse(selectedRun.response)
                          }}
                        >
                          <Copy className="mr-1 h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                      <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded bg-muted p-3 text-sm">
                        {selectedRun.response}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-md bg-accent p-4 py-8 text-center text-sm text-muted-foreground">
                    <MessageSquare className="mx-auto mb-2 h-4 w-4" />
                    <p>No run selected</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
