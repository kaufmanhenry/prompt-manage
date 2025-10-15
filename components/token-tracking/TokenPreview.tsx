'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, DollarSign, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { TokenPreviewProps, TokenEstimate, CostOptimizationSuggestion } from '@/lib/types/token-tracking'

/**
 * TokenPreview Component
 * 
 * Displays real-time cost preview before executing a prompt.
 * Shows input/output token estimates and cost breakdown.
 * Provides model switching suggestions for cost optimization.
 * 
 * @example
 * ```tsx
 * <TokenPreview
 *   promptText={prompt}
 *   contextText={context}
 *   model="gpt-4o-mini"
 *   onModelChange={setModel}
 *   subscription="team"
 * />
 * ```
 */
export function TokenPreview({
  promptText,
  contextText = '',
  model,
  onModelChange,
  subscription,
}: TokenPreviewProps) {
  const [estimate, setEstimate] = useState<TokenEstimate>({
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    estimatedCost: 0,
  })
  const [suggestions, setSuggestions] = useState<CostOptimizationSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Estimate tokens whenever prompt or context changes
    const estimateUsage = async () => {
      if (!promptText) {
        setEstimate({ inputTokens: 0, outputTokens: 0, totalTokens: 0, estimatedCost: 0 })
        return
      }

      setIsLoading(true)
      try {
        // TODO: Replace with actual API call
        const fullInput = contextText + '\n' + promptText
        const inputTokens = estimateTokenCount(fullInput)
        const outputTokens = Math.ceil(inputTokens * 0.8) // Estimate output as 80% of input

        const cost = await calculateCost(inputTokens, outputTokens, model)

        setEstimate({
          inputTokens,
          outputTokens,
          totalTokens: inputTokens + outputTokens,
          estimatedCost: cost,
        })

        // Generate optimization suggestions
        const newSuggestions = await generateSuggestions(inputTokens, outputTokens, model, contextText)
        setSuggestions(newSuggestions)
      } catch (error) {
        console.error('Error estimating tokens:', error)
      } finally {
        setIsLoading(false)
      }
    }

    estimateUsage()
  }, [promptText, contextText, model])

  // Free users don't see detailed preview
  if (subscription === 'free') {
    return (
      <Card className="border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Sparkles className="h-4 w-4" />
          <span>~{estimate.totalTokens.toLocaleString()} tokens</span>
          <Badge variant="outline" className="ml-auto text-xs">
            Upgrade for cost preview
          </Badge>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Estimated Cost Preview
          </span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {model}
        </Badge>
      </div>

      {/* Token breakdown */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600 dark:text-gray-400">Input tokens</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            ~{estimate.inputTokens.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-gray-600 dark:text-gray-400">Output tokens</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            ~{estimate.outputTokens.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Cost */}
      <div className="mt-3 flex items-center justify-between border-t border-blue-200 pt-3 dark:border-blue-800">
        <span className="text-sm text-gray-600 dark:text-gray-400">Estimated cost:</span>
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
          ${estimate.estimatedCost.toFixed(4)}
        </span>
      </div>

      {/* Optimization suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-blue-200 pt-3 dark:border-blue-800">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300"
            >
              <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium">{suggestion.title}</div>
                <div className="text-blue-600 dark:text-blue-400">
                  Save ${suggestion.savings.toFixed(4)} ({suggestion.savingsPercentage.toFixed(0)}%)
                </div>
              </div>
              {suggestion.type === 'model_switch' && onModelChange && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    // Extract model from suggestion
                    const match = suggestion.description.match(/to ([\w-]+)/)
                    if (match) {
                      onModelChange(match[1])
                    }
                  }}
                >
                  Switch
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

// ============================================================================
// HELPER FUNCTIONS (TODO: Move to lib/pricing.ts)
// ============================================================================

function estimateTokenCount(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  // For production, use OpenAI's tiktoken library
  return Math.ceil(text.length / 4)
}

async function calculateCost(inputTokens: number, outputTokens: number, model: string): Promise<number> {
  // TODO: Use actual pricing from lib/pricing.ts
  const pricing: Record<string, { input: number; output: number }> = {
    'gpt-4o-mini': { input: 0.150, output: 0.600 },
    'gpt-4o': { input: 2.50, output: 10.00 },
    'gpt-4-turbo': { input: 10.00, output: 30.00 },
  }

  const rates = pricing[model] || pricing['gpt-4o-mini']
  const inputCost = (inputTokens / 1_000_000) * rates.input
  const outputCost = (outputTokens / 1_000_000) * rates.output

  return inputCost + outputCost
}

async function generateSuggestions(
  inputTokens: number,
  outputTokens: number,
  model: string,
  contextText: string
): Promise<CostOptimizationSuggestion[]> {
  const suggestions: CostOptimizationSuggestion[] = []

  // Suggest model switch if using expensive model
  if (model === 'gpt-4' || model === 'gpt-4-turbo') {
    const currentCost = await calculateCost(inputTokens, outputTokens, model)
    const miniCost = await calculateCost(inputTokens, outputTokens, 'gpt-4o-mini')
    const savings = currentCost - miniCost
    const savingsPercentage = (savings / currentCost) * 100

    if (savingsPercentage > 50) {
      suggestions.push({
        type: 'model_switch',
        title: 'Switch to GPT-4o Mini',
        description: 'Switch to gpt-4o-mini for significant cost savings',
        currentCost,
        projectedCost: miniCost,
        savings,
        savingsPercentage,
        difficulty: 'easy',
      })
    }
  }

  // Suggest context reduction if context is long
  if (contextText.length > 2000) {
    suggestions.push({
      type: 'context_reduction',
      title: 'Reduce context length',
      description: 'Consider shortening the context to reduce input tokens',
      currentCost: await calculateCost(inputTokens, outputTokens, model),
      projectedCost: await calculateCost(inputTokens * 0.7, outputTokens, model),
      savings: await calculateCost(inputTokens * 0.3, 0, model),
      savingsPercentage: 30,
      difficulty: 'medium',
    })
  }

  return suggestions
}

