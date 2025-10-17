# Token Tracking UI Components

## Component Architecture

### Component Hierarchy

```
PromptLab (Enhanced)
├── TokenPreview (Real-time cost estimator)
├── TokenUsageDisplay (Post-execution metrics)
├── BudgetWarning (Alert banner)
└── PromptRunHistory (Enhanced with cost data)

Dashboard
├── UsageDashboard
│   ├── UsageSummaryCards
│   ├── UsageTrendChart
│   ├── CostBreakdownChart
│   └── TopPromptsTable
├── BudgetSettings
│   ├── BudgetLimitForm
│   └── AlertThresholdConfig
└── TeamUsageDashboard (Enterprise only)
    ├── TeamMemberUsageTable
    ├── DepartmentBreakdown
    └── CostOptimizationRecommendations
```

## 1. Enhanced Prompt Lab Components

### TokenPreview Component

Real-time preview of estimated token usage before running a prompt.

**Location:** Embedded in PromptLab below the prompt textarea

**UI Mockup (Text):**

```
┌─────────────────────────────────────────────────────┐
│ 💰 Estimated Cost Preview                           │
├─────────────────────────────────────────────────────┤
│ Input tokens:     ~450                              │
│ Output tokens:    ~500 (estimated)                  │
│ Total tokens:     ~950                              │
│                                                      │
│ Model: gpt-4o-mini                                  │
│ Estimated cost:   $0.0004                           │
│                                                      │
│ [ Switch to GPT-3.5 to save 60% ▼ ]                │
└─────────────────────────────────────────────────────┘
```

**Implementation:**

```typescript
// components/TokenPreview.tsx
'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, DollarSign, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { estimateTokens, calculateCost, MODEL_PRICING } from '@/lib/pricing'

interface TokenPreviewProps {
  promptText: string
  contextText?: string
  model: string
  onModelChange?: (model: string) => void
  subscription: 'free' | 'team' | 'enterprise'
}

export function TokenPreview({
  promptText,
  contextText = '',
  model,
  onModelChange,
  subscription,
}: TokenPreviewProps) {
  const [estimate, setEstimate] = useState({
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    cost: 0,
  })
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    const fullInput = contextText + '\n' + promptText
    const inputTokens = estimateTokens(fullInput)
    const outputTokens = Math.ceil(inputTokens * 0.8) // Estimate output as 80% of input
    const totalTokens = inputTokens + outputTokens

    const costs = calculateCost(inputTokens, outputTokens, model)

    setEstimate({
      inputTokens,
      outputTokens,
      totalTokens,
      cost: costs.totalCost,
    })

    // Generate suggestions
    const newSuggestions = []
    if (inputTokens > 2000 && contextText.length > 500) {
      newSuggestions.push('Consider shortening the context to reduce input tokens')
    }
    if (model === 'gpt-4' || model === 'gpt-4-turbo') {
      const miniCost = calculateCost(inputTokens, outputTokens, 'gpt-4o-mini')
      const savings = ((costs.totalCost - miniCost.totalCost) / costs.totalCost) * 100
      if (savings > 50) {
        newSuggestions.push(`Switch to GPT-4o Mini to save ${savings.toFixed(0)}%`)
      }
    }
    setSuggestions(newSuggestions)
  }, [promptText, contextText, model])

  // Free users don't see detailed preview
  if (subscription === 'free') {
    return (
      <Card className="border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Sparkles className="h-4 w-4" />
          <span>~{estimate.totalTokens} tokens</span>
          <Badge variant="outline" className="ml-auto text-xs">
            Upgrade for cost preview
          </Badge>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Estimated Cost Preview
          </span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {MODEL_PRICING[model]?.name || model}
        </Badge>
      </div>

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

      <div className="mt-3 flex items-center justify-between border-t border-blue-200 pt-3 dark:border-blue-800">
        <span className="text-sm text-gray-600 dark:text-gray-400">Estimated cost:</span>
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
          ${estimate.cost.toFixed(4)}
        </span>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-blue-200 pt-3 dark:border-blue-800">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300"
            >
              <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
```

### TokenUsageDisplay Component

Displays actual token usage after prompt execution.

**UI Mockup (Text):**

```
┌─────────────────────────────────────────────────────┐
│ ✅ Execution Complete                               │
├─────────────────────────────────────────────────────┤
│ Input:  452 tokens  ($0.000068)                     │
│ Output: 387 tokens  ($0.000232)                     │
│ Total:  839 tokens  $0.0003                         │
│                                                      │
│ Execution time: 1.2s                                │
│ Model: gpt-4o-mini                                  │
└─────────────────────────────────────────────────────┘
```

**Implementation:**

```typescript
// components/TokenUsageDisplay.tsx
'use client'

import { CheckCircle, Clock, Cpu } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

interface TokenUsageDisplayProps {
  inputTokens: number
  outputTokens: number
  totalCost: number
  executionTimeMs: number
  model: string
  subscription: 'free' | 'team' | 'enterprise'
}

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
      <div className="mb-3 flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <span className="text-sm font-medium text-green-900 dark:text-green-100">
          Execution Complete
        </span>
      </div>

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

      <div className="mt-3 flex items-center gap-4 border-t border-green-200 pt-3 text-xs text-gray-500 dark:border-green-800 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{(executionTimeMs / 1000).toFixed(2)}s</span>
        </div>
        <div className="flex items-center gap-1">
          <Cpu className="h-3 w-3" />
          <span>{model}</span>
        </div>
      </div>
    </Card>
  )
}
```

### BudgetWarning Component

Alert banner when approaching or exceeding budget limits.

**UI Mockups (Text):**

**Warning (75% threshold):**

```
┌─────────────────────────────────────────────────────┐
│ ⚠️  Budget Alert                                     │
│ You've used 75% of your monthly budget ($15 / $20)  │
│ [View Details] [Dismiss]                            │
└─────────────────────────────────────────────────────┘
```

**Critical (100% exceeded):**

```
┌─────────────────────────────────────────────────────┐
│ 🚨 Budget Exceeded                                   │
│ Monthly budget exceeded: $22.50 / $20.00            │
│ Further executions may be limited.                  │
│ [Increase Budget] [View Usage]                      │
└─────────────────────────────────────────────────────┘
```

**Implementation:**

```typescript
// components/BudgetWarning.tsx
'use client'

import { AlertTriangle, XCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface BudgetWarningProps {
  currentUsage: number
  budgetLimit: number
  level: 'info' | 'warning' | 'critical'
  onDismiss: () => void
  onViewDetails: () => void
  onIncreaseBudget?: () => void
}

export function BudgetWarning({
  currentUsage,
  budgetLimit,
  level,
  onDismiss,
  onViewDetails,
  onIncreaseBudget,
}: BudgetWarningProps) {
  const percentage = (currentUsage / budgetLimit) * 100

  const styles = {
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-900 dark:text-blue-100',
      icon: <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      title: 'Budget Alert',
    },
    warning: {
      bgColor: 'bg-amber-50 dark:bg-amber-950',
      borderColor: 'border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-900 dark:text-amber-100',
      icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      title: 'Budget Warning',
    },
    critical: {
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-900 dark:text-red-100',
      icon: <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
      title: 'Budget Exceeded',
    },
  }

  const style = styles[level]

  return (
    <Card className={`${style.bgColor} ${style.borderColor} p-4`}>
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="flex-1">
          <div className={`mb-1 text-sm font-semibold ${style.textColor}`}>
            {style.title}
          </div>
          <div className="mb-3 text-sm text-gray-700 dark:text-gray-300">
            {level === 'critical' ? (
              <>
                Monthly budget exceeded: ${currentUsage.toFixed(2)} / ${budgetLimit.toFixed(2)}
                <br />
                <span className="text-xs">Further executions may be limited.</span>
              </>
            ) : (
              `You've used ${percentage.toFixed(0)}% of your monthly budget ($${currentUsage.toFixed(2)} / $${budgetLimit.toFixed(2)})`
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onViewDetails}>
              View Details
            </Button>
            {level === 'critical' && onIncreaseBudget && (
              <Button size="sm" onClick={onIncreaseBudget}>
                Increase Budget
              </Button>
            )}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Card>
  )
}
```

## 2. Usage Dashboard Components

### UsageDashboard Component

Main dashboard showing usage statistics and trends.

**UI Mockup (Text):**

```
┌─────────────────────────────────────────────────────────────┐
│ Usage Dashboard - December 2025                              │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │  $12.45  │ │  450K    │ │  $0.028  │ │  145     │       │
│ │  Spent   │ │  Tokens  │ │  Avg/Run │ │  Runs    │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│ Daily Usage Trend (Last 30 days)                            │
│ ┌────────────────────────────────────────────────────┐      │
│ │     ▁▂▃▄▅█▇▆▅▄▃▂▁                                  │      │
│ │ Cost: $0.2 - $1.5/day                              │      │
│ └────────────────────────────────────────────────────┘      │
│                                                              │
│ Cost Breakdown by Model                                     │
│ ┌────────────────────────────────────────────────────┐      │
│ │ gpt-4o-mini  ████████████████ 65% ($8.09)          │      │
│ │ gpt-4o       ██████ 25% ($3.11)                     │      │
│ │ gpt-4        ██ 10% ($1.25)                         │      │
│ └────────────────────────────────────────────────────┘      │
│                                                              │
│ Top Prompts by Cost                                         │
│ ┌────────────────────────────────────────────────────┐      │
│ │ 1. Blog Post Generator      $4.25    125 runs      │      │
│ │ 2. Code Review Assistant    $3.10     45 runs      │      │
│ │ 3. Email Campaign Writer    $2.80     89 runs      │      │
│ └────────────────────────────────────────────────────┘      │
│                                                              │
│ [Export CSV] [View Detailed Report]                         │
└─────────────────────────────────────────────────────────────┘
```

**Implementation:** (See full implementation in next section)

## 3. Budget Settings Component

### BudgetSettingsForm

**UI Mockup (Text):**

```
┌─────────────────────────────────────────────────────────┐
│ Budget & Limit Settings                                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│ Monthly Budget Limit                                     │
│ ┌───────────────────────────────┐                       │
│ │ $ 50.00                       │                       │
│ └───────────────────────────────┘                       │
│ Set a monthly spending limit to control costs            │
│                                                           │
│ Max Tokens Per Prompt                                    │
│ ┌───────────────────────────────┐                       │
│ │ 10000                         │                       │
│ └───────────────────────────────┘                       │
│ Prevent individual prompts from using too many tokens    │
│                                                           │
│ Alert Thresholds                                         │
│ ☑ Alert at 75% of budget                                │
│ ☑ Alert at 90% of budget                                │
│ ☑ Alert at 100% of budget                               │
│                                                           │
│ [Save Settings] [Cancel]                                 │
└─────────────────────────────────────────────────────────┘
```

## 4. Team Usage Dashboard (Enterprise)

**UI Mockup (Text):**

```
┌─────────────────────────────────────────────────────────────┐
│ Team Usage Dashboard                                         │
│ Acme Corp Engineering Team                                   │
├─────────────────────────────────────────────────────────────┤
│ Team Summary                                                 │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│ │  $125.45 │ │  8 Users │ │  $15.68  │                     │
│ │  Total   │ │  Active  │ │  Avg/User│                     │
│ └──────────┘ └──────────┘ └──────────┘                     │
│                                                              │
│ Usage by Team Member                                        │
│ ┌────────────────────────────────────────────────────┐      │
│ │ User              Runs   Tokens    Cost     %      │      │
│ ├────────────────────────────────────────────────────┤      │
│ │ John Doe           245   125K     $18.50   14.7%  │      │
│ │ Jane Smith         198    98K     $15.20   12.1%  │      │
│ │ Bob Johnson        156    75K     $12.80   10.2%  │      │
│ └────────────────────────────────────────────────────┘      │
│                                                              │
│ Cost Optimization Recommendations                           │
│ ┌────────────────────────────────────────────────────┐      │
│ │ 💡 Switch 35% of GPT-4 usage to GPT-4o Mini        │      │
│ │    Potential savings: $42.30/month                 │      │
│ │                                                      │      │
│ │ 💡 3 prompts use excessive context (>5000 tokens)  │      │
│ │    Optimize to save $15/month                      │      │
│ └────────────────────────────────────────────────────┘      │
│                                                              │
│ [Export Team Report] [Manage Budget] [View Insights]        │
└─────────────────────────────────────────────────────────────┘
```
