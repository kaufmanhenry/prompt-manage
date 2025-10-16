'use client'

import { AlertTriangle, CheckCircle, Clock, RefreshCw,XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ExecutionStatus,NodeExecution, WorkflowExecution } from '@/lib/types/workflows'

interface WorkflowExecutionViewerProps {
  executionId: string
  onRerun?: () => void
}

/**
 * WorkflowExecutionViewer Component
 * 
 * Displays real-time execution progress and results for a workflow run.
 * Shows node-by-node execution status, timing, and costs.
 * Supports re-running workflows.
 * 
 * @example
 * ```tsx
 * <WorkflowExecutionViewer
 *   executionId="exec-123"
 *   onRerun={() => triggerWorkflow(workflowId)}
 * />
 * ```
 */
export function WorkflowExecutionViewer({
  executionId,
  onRerun,
}: WorkflowExecutionViewerProps) {
  const [execution, setExecution] = useState<WorkflowExecution | null>(null)
  const [nodeExecutions, setNodeExecutions] = useState<NodeExecution[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchExecution = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/workflows/executions/${executionId}`)
        const data = await response.json()
        
        setExecution(data.execution)
        setNodeExecutions(data.nodeExecutions)
      } catch (error) {
        console.error('Failed to fetch execution:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchExecution()

    // Poll for updates if execution is running
    const interval = setInterval(() => {
      if (execution?.status === 'running' || execution?.status === 'queued') {
        void fetchExecution()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [executionId, execution?.status])

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-600">Loading execution...</span>
        </div>
      </Card>
    )
  }

  if (!execution) {
    return (
      <Card className="p-8">
        <p className="text-center text-gray-600">Execution not found</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Execution Summary */}
      <Card className="p-4">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">Execution Summary</h3>
            <p className="text-sm text-gray-600">ID: {execution.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={execution.status} />
            {onRerun && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRerun}
                disabled={execution.status === 'running'}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Rerun
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <div className="text-xs text-gray-500">Started</div>
            <div className="text-sm font-medium">
              {execution.started_at
                ? new Date(execution.started_at).toLocaleString()
                : 'Not started'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Duration</div>
            <div className="text-sm font-medium">
              {execution.execution_time_ms
                ? `${(execution.execution_time_ms / 1000).toFixed(2)}s`
                : '-'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Nodes</div>
            <div className="text-sm font-medium">
              {execution.completed_nodes} / {execution.total_nodes} completed
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Cost</div>
            <div className="text-sm font-medium">${execution.total_cost_usd.toFixed(4)}</div>
          </div>
        </div>

        {execution.error_message && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 dark:bg-red-950">
            <div className="flex items-start gap-2">
              <XCircle className="mt-0.5 h-4 w-4 text-red-600" />
              <div className="flex-1">
                <div className="text-sm font-medium text-red-900 dark:text-red-100">
                  Error in node: {execution.error_node_id}
                </div>
                <div className="text-sm text-red-700 dark:text-red-300">
                  {execution.error_message}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Node Executions */}
      <Card className="p-4">
        <h3 className="mb-4 text-lg font-semibold">Node Executions</h3>
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {nodeExecutions.map((nodeExec) => (
              <NodeExecutionItem key={nodeExec.id} nodeExecution={nodeExec} />
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Output Data */}
      {execution.output_data && (
        <Card className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Output Data</h3>
          <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4 text-xs dark:bg-gray-900">
            {JSON.stringify(execution.output_data, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  )
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

function StatusBadge({ status }: { status: ExecutionStatus }) {
  const styles = {
    queued: { variant: 'secondary' as const, label: 'Queued', icon: Clock },
    running: { variant: 'default' as const, label: 'Running', icon: RefreshCw },
    completed: { variant: 'default' as const, label: 'Completed', icon: CheckCircle },
    failed: { variant: 'destructive' as const, label: 'Failed', icon: XCircle },
    cancelled: { variant: 'secondary' as const, label: 'Cancelled', icon: XCircle },
    timeout: { variant: 'destructive' as const, label: 'Timeout', icon: AlertTriangle },
    skipped: { variant: 'secondary' as const, label: 'Skipped', icon: AlertTriangle },
    retrying: { variant: 'default' as const, label: 'Retrying', icon: RefreshCw },
  }

  const style = styles[status]
  const Icon = style.icon

  return (
    <Badge variant={style.variant}>
      <Icon className="mr-1 h-3 w-3" />
      {style.label}
    </Badge>
  )
}

function NodeExecutionItem({ nodeExecution }: { nodeExecution: NodeExecution }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{nodeExecution.node_id}</span>
          <StatusBadge status={nodeExecution.status} />
        </div>
        {nodeExecution.execution_time_ms && (
          <span className="text-xs text-gray-500">
            {(nodeExecution.execution_time_ms / 1000).toFixed(2)}s
          </span>
        )}
      </div>

      {nodeExecution.tokens_used && (
        <div className="text-xs text-gray-600">
          Tokens: {nodeExecution.tokens_used.toLocaleString()} • Cost: $
          {nodeExecution.cost_usd?.toFixed(4)}
        </div>
      )}

      {nodeExecution.error_message && (
        <div className="mt-2 text-xs text-red-600">
          Error (Attempt {nodeExecution.attempt_number}/{nodeExecution.max_attempts}):{' '}
          {nodeExecution.error_message}
        </div>
      )}
    </div>
  )
}

