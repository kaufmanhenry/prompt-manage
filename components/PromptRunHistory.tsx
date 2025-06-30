'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { 
  Clock, 
  RefreshCw, 
  XCircle, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare,
  Zap,
  Copy
} from 'lucide-react'
import { CardLoading } from '@/components/ui/loading'
import type { PromptRunHistory } from '@/lib/schemas/prompt-run-history'

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
    refetch
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
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'timeout':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Timeout</Badge>
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Run History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardLoading text="Loading history..." />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Run History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">Failed to load history</p>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const history = historyData?.history || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Run History
            <Badge variant="outline">{history.length}</Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            {onClose && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                Close
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2" />
            <p>No run history yet</p>
            <p className="text-sm">Run this prompt to see its history here</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {history.map((run) => (
                <div
                  key={run.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedRun?.id === run.id ? 'bg-muted border-primary' : ''
                  }`}
                  onClick={() => setSelectedRun(selectedRun?.id === run.id ? null : run)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(run.status)}
                      {getStatusBadge(run.status)}
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(run.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {run.execution_time_ms && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {formatDuration(run.execution_time_ms)}
                        </div>
                      )}
                      {run.tokens_used && (
                        <span>{run.tokens_used} tokens</span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mb-2">
                    Model: {run.model}
                  </div>

                  {run.error_message && (
                    <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                      Error: {run.error_message}
                    </div>
                  )}

                  {selectedRun?.id === run.id && (
                    <div className="mt-3 space-y-3">
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Prompt:</h4>
                        <div className="bg-muted p-3 rounded text-sm font-mono whitespace-pre-wrap">
                          {run.prompt_text}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Response:</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyResponse(run.response)
                            }}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="bg-muted p-3 rounded text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {run.response}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
} 