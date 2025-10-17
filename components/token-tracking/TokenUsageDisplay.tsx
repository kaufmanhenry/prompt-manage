'use client'

import { CheckCircle, Clock, Cpu } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { TokenUsageDisplayProps } from '@/lib/types/token-tracking'

/**
 * TokenUsageDisplay Component
 *
 * Displays actual token usage and cost after prompt execution.
 * Shows input/output breakdown, total cost, and execution time.
 * Tier-specific visibility (Free vs Teams/Enterprise).
 *
 * @example
 * ```tsx
 * <TokenUsageDisplay
 *   inputTokens={452}
 *   outputTokens={387}
 *   totalCost={0.0003}
 *   executionTimeMs={1200}
 *   model="gpt-4o-mini"
 *   subscription="team"
 * />
 * ```
 */
export function TokenUsageDisplay({
  inputTokens,
  outputTokens,
  totalCost,
  executionTimeMs,
  model,
  subscription,
}: TokenUsageDisplayProps) {
  const totalTokens = inputTokens + outputTokens

  return (
    <Card className="border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <span className="text-sm font-medium text-green-900 dark:text-green-100">
          Execution Complete
        </span>
      </div>

      {/* Token breakdown (Teams/Enterprise only) */}
      {subscription !== 'free' ? (
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Input:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {inputTokens.toLocaleString()} tokens
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Output:</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {outputTokens.toLocaleString()} tokens
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-green-200 pt-2 dark:border-green-800">
            <span className="text-gray-600 dark:text-gray-400">Total cost:</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              ${totalCost.toFixed(4)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {totalTokens.toLocaleString()} tokens used
        </div>
      )}

      {/* Execution metadata */}
      <div className="mt-3 flex items-center gap-4 border-t border-green-200 pt-3 text-xs text-gray-500 dark:border-green-800 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{(executionTimeMs / 1000).toFixed(2)}s</span>
        </div>
        <div className="flex items-center gap-1">
          <Cpu className="h-3 w-3" />
          <span>{model}</span>
        </div>
        {subscription !== 'free' && (
          <div className="ml-auto">
            <Badge variant="outline" className="text-xs">
              ${(totalCost * 1000).toFixed(2)}/1K tokens
            </Badge>
          </div>
        )}
      </div>
    </Card>
  )
}
