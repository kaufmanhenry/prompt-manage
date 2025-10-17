# Token Tracking API Implementation

## API Endpoints

### 1. Token Usage Tracking

#### `POST /api/usage/track`

Logs token usage from a prompt execution.

**Request:**

```typescript
{
  promptId?: string
  runId?: string
  inputTokens: number
  outputTokens: number
  model: string
  executionType: 'prompt_run' | 'preview' | 'improvement' | 'agent_generation'
}
```

**Response:**

```typescript
{
  success: boolean
  logId: string
  totalCost: number
  remainingBudget?: number
  warning?: {
    type: 'approaching_limit' | 'budget_exceeded'
    message: string
  }
}
```

**Implementation:**

```typescript
// app/api/usage/track/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { calculateCost, MODEL_PRICING } from '@/lib/pricing'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { promptId, runId, inputTokens, outputTokens, model, executionType } = body

  // Calculate costs
  const costs = calculateCost(inputTokens, outputTokens, model)

  // Get user's team and budget info
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('team_id, subscription_tier')
    .eq('id', user.id)
    .single()

  // Log usage
  const { data: log, error: logError } = await supabase
    .from('token_usage_logs')
    .insert({
      user_id: user.id,
      team_id: profile?.team_id,
      prompt_id: promptId,
      run_id: runId,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      input_cost_usd: costs.inputCost,
      output_cost_usd: costs.outputCost,
      model: model,
      execution_type: executionType,
    })
    .select()
    .single()

  if (logError) {
    console.error('Failed to log usage:', logError)
    return NextResponse.json({ error: 'Failed to log usage' }, { status: 500 })
  }

  // Check budget limits
  const budgetCheck = await checkBudgetLimits(supabase, user.id, profile?.team_id, costs.totalCost)

  return NextResponse.json({
    success: true,
    logId: log.id,
    totalCost: costs.totalCost,
    ...budgetCheck,
  })
}

async function checkBudgetLimits(
  supabase: any,
  userId: string,
  teamId: string | null,
  costUsd: number,
) {
  const currentMonth = new Date().toISOString().slice(0, 7) + '-01'

  // Get or create budget for current period
  const entityType = teamId ? 'team' : 'user'
  const entityId = teamId || userId

  const { data: budget } = await supabase
    .from('usage_budgets')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .eq('period_start', currentMonth)
    .single()

  if (!budget || !budget.monthly_budget_usd) {
    return {} // No budget set
  }

  const newTotal = (budget.period_cost_usd || 0) + costUsd
  const percentage = (newTotal / budget.monthly_budget_usd) * 100

  // Update budget tracking
  await supabase
    .from('usage_budgets')
    .update({
      period_cost_usd: newTotal,
      updated_at: new Date().toISOString(),
    })
    .eq('id', budget.id)

  // Check thresholds and create alerts
  let warning = null
  if (percentage >= 100) {
    warning = {
      type: 'budget_exceeded',
      message: `Monthly budget exceeded: $${newTotal.toFixed(2)} / $${budget.monthly_budget_usd}`,
    }
    await createAlert(
      supabase,
      budget.id,
      userId,
      'budget_exceeded',
      'critical',
      newTotal,
      budget.monthly_budget_usd,
      percentage,
    )
  } else if (percentage >= budget.alert_threshold_2) {
    warning = {
      type: 'approaching_limit',
      message: `${percentage.toFixed(0)}% of monthly budget used`,
    }
    await createAlert(
      supabase,
      budget.id,
      userId,
      'threshold_90',
      'warning',
      newTotal,
      budget.monthly_budget_usd,
      percentage,
    )
  } else if (percentage >= budget.alert_threshold_1) {
    await createAlert(
      supabase,
      budget.id,
      userId,
      'threshold_75',
      'info',
      newTotal,
      budget.monthly_budget_usd,
      percentage,
    )
  }

  return {
    remainingBudget: budget.monthly_budget_usd - newTotal,
    warning,
  }
}

async function createAlert(
  supabase: any,
  budgetId: string,
  userId: string,
  alertType: string,
  alertLevel: string,
  currentUsage: number,
  budgetLimit: number,
  percentage: number,
) {
  // Check if alert already exists for this threshold in current period
  const { data: existing } = await supabase
    .from('usage_alerts')
    .select('id')
    .eq('budget_id', budgetId)
    .eq('alert_type', alertType)
    .gte('created_at', new Date(new Date().setDate(1)).toISOString())
    .single()

  if (existing) return // Alert already sent

  await supabase.from('usage_alerts').insert({
    budget_id: budgetId,
    user_id: userId,
    alert_type: alertType,
    alert_level: alertLevel,
    message: `Budget alert: ${percentage.toFixed(0)}% of monthly budget used`,
    current_usage_usd: currentUsage,
    budget_limit_usd: budgetLimit,
    usage_percentage: Math.round(percentage),
  })
}
```

### 2. Usage Analytics

#### `GET /api/usage/stats`

Retrieves usage statistics for dashboards.

**Query Parameters:**

- `period`: 'day' | 'week' | 'month' | 'year'
- `startDate`: ISO date string
- `endDate`: ISO date string
- `groupBy`: 'model' | 'prompt' | 'user' | 'day'
- `teamId`: (optional) For team admins

**Response:**

```typescript
{
  summary: {
    totalTokens: number
    totalCost: number
    totalRuns: number
    avgCostPerRun: number
  }
  breakdown: Array<{
    category: string
    tokens: number
    cost: number
    runs: number
    percentage: number
  }>
  trends: Array<{
    date: string
    tokens: number
    cost: number
  }>
  topPrompts: Array<{
    promptId: string
    promptName: string
    tokens: number
    cost: number
    runs: number
  }>
}
```

**Implementation:**

```typescript
// app/api/usage/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get('period') || 'month'
  const groupBy = searchParams.get('groupBy') || 'day'
  const teamId = searchParams.get('teamId')

  // Check permissions
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('team_id, subscription_tier')
    .eq('id', user.id)
    .single()

  if (teamId && teamId !== profile?.team_id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Calculate date range
  const endDate = new Date()
  const startDate = new Date()
  switch (period) {
    case 'day':
      startDate.setDate(endDate.getDate() - 1)
      break
    case 'week':
      startDate.setDate(endDate.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1)
      break
    case 'year':
      startDate.setFullYear(endDate.getFullYear() - 1)
      break
  }

  // Build query
  let query = supabase
    .from('token_usage_logs')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  if (teamId) {
    query = query.eq('team_id', teamId)
  } else {
    query = query.eq('user_id', user.id)
  }

  const { data: logs, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }

  // Calculate summary
  const summary = {
    totalTokens: logs.reduce((sum, log) => sum + log.total_tokens, 0),
    totalCost: logs.reduce((sum, log) => sum + log.total_cost_usd, 0),
    totalRuns: logs.length,
    avgCostPerRun:
      logs.length > 0 ? logs.reduce((sum, log) => sum + log.total_cost_usd, 0) / logs.length : 0,
  }

  // Group by category
  const breakdown = calculateBreakdown(logs, groupBy)

  // Calculate trends
  const trends = calculateTrends(logs, period)

  // Top prompts (if not free tier)
  const topPrompts =
    profile?.subscription_tier !== 'free' ? await getTopPrompts(supabase, logs) : []

  return NextResponse.json({
    summary,
    breakdown,
    trends,
    topPrompts,
  })
}

function calculateBreakdown(logs: any[], groupBy: string) {
  const grouped = new Map<string, { tokens: number; cost: number; runs: number }>()

  logs.forEach((log) => {
    const key = log[groupBy] || 'Unknown'
    const existing = grouped.get(key) || { tokens: 0, cost: 0, runs: 0 }
    grouped.set(key, {
      tokens: existing.tokens + log.total_tokens,
      cost: existing.cost + log.total_cost_usd,
      runs: existing.runs + 1,
    })
  })

  const totalCost = Array.from(grouped.values()).reduce((sum, item) => sum + item.cost, 0)

  return Array.from(grouped.entries())
    .map(([category, data]) => ({
      category,
      ...data,
      percentage: totalCost > 0 ? (data.cost / totalCost) * 100 : 0,
    }))
    .sort((a, b) => b.cost - a.cost)
}

function calculateTrends(logs: any[], period: string) {
  const dailyData = new Map<string, { tokens: number; cost: number }>()

  logs.forEach((log) => {
    const date = new Date(log.created_at).toISOString().split('T')[0]
    const existing = dailyData.get(date) || { tokens: 0, cost: 0 }
    dailyData.set(date, {
      tokens: existing.tokens + log.total_tokens,
      cost: existing.cost + log.total_cost_usd,
    })
  })

  return Array.from(dailyData.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

async function getTopPrompts(supabase: any, logs: any[]) {
  const promptStats = new Map<string, { tokens: number; cost: number; runs: number }>()

  logs.forEach((log) => {
    if (!log.prompt_id) return
    const existing = promptStats.get(log.prompt_id) || { tokens: 0, cost: 0, runs: 0 }
    promptStats.set(log.prompt_id, {
      tokens: existing.tokens + log.total_tokens,
      cost: existing.cost + log.total_cost_usd,
      runs: existing.runs + 1,
    })
  })

  const topPromptIds = Array.from(promptStats.entries())
    .sort((a, b) => b[1].cost - a[1].cost)
    .slice(0, 10)
    .map(([id]) => id)

  if (topPromptIds.length === 0) return []

  const { data: prompts } = await supabase.from('prompts').select('id, name').in('id', topPromptIds)

  const promptMap = new Map(prompts?.map((p) => [p.id, p.name]) || [])

  return topPromptIds.map((id) => ({
    promptId: id,
    promptName: promptMap.get(id) || 'Unknown',
    ...promptStats.get(id)!,
  }))
}
```

### 3. Budget Management

#### `PUT /api/usage/budget`

Sets or updates budget limits.

**Request:**

```typescript
{
  entityType: 'user' | 'team'
  entityId: string
  monthlyBudgetUsd?: number
  maxTokensPerPrompt?: number
  dailyBudgetUsd?: number
  alertThresholds?: [number, number, number] // e.g., [75, 90, 100]
}
```

**Implementation:**

```typescript
// app/api/usage/budget/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function PUT(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    entityType,
    entityId,
    monthlyBudgetUsd,
    maxTokensPerPrompt,
    dailyBudgetUsd,
    alertThresholds,
  } = body

  // Verify permissions
  if (entityType === 'user' && entityId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (entityType === 'team') {
    const { data: member } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', entityId)
      .eq('user_id', user.id)
      .single()

    if (!member || !['owner', 'admin'].includes(member.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const currentMonth = new Date().toISOString().slice(0, 7) + '-01'

  const { data, error } = await supabase
    .from('usage_budgets')
    .upsert(
      {
        entity_type: entityType,
        entity_id: entityId,
        period_start: currentMonth,
        monthly_budget_usd: monthlyBudgetUsd,
        max_tokens_per_prompt: maxTokensPerPrompt,
        daily_budget_usd: dailyBudgetUsd,
        alert_threshold_1: alertThresholds?.[0] || 75,
        alert_threshold_2: alertThresholds?.[1] || 90,
        alert_threshold_3: alertThresholds?.[2] || 100,
      },
      {
        onConflict: 'entity_type,entity_id,period_start',
      },
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 })
  }

  return NextResponse.json({ success: true, budget: data })
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const entityType = searchParams.get('entityType') || 'user'
  const entityId = searchParams.get('entityId') || user.id

  const currentMonth = new Date().toISOString().slice(0, 7) + '-01'

  const { data: budget } = await supabase
    .from('usage_budgets')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .eq('period_start', currentMonth)
    .single()

  return NextResponse.json({ budget })
}
```
