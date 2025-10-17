# Token Tracking System - Architecture Diagrams

## System Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE LAYER                           │
│                                                                             │
│  ┌─────────────────────┐    ┌──────────────────┐    ┌──────────────────┐ │
│  │   Prompt Lab        │    │   Usage          │    │   Budget         │ │
│  │   ─────────────     │    │   Dashboard      │    │   Settings       │ │
│  │ • Token Preview     │    │   ─────────      │    │   ────────       │ │
│  │ • Usage Display     │    │ • Summary Cards  │    │ • Set Limits     │ │
│  │ • Budget Warnings   │    │ • Trend Charts   │    │ • Alerts Config  │ │
│  │ • Model Selector    │    │ • Breakdowns     │    │ • Max Tokens     │ │
│  └──────────┬──────────┘    └────────┬─────────┘    └────────┬─────────┘ │
└─────────────┼────────────────────────┼────────────────────────┼───────────┘
              │                        │                        │
              │                        │                        │
              ▼                        ▼                        ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER (Next.js)                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  POST /api/usage/track                                              │  │
│  │  • Logs token usage from prompt execution                           │  │
│  │  • Updates budget tracking                                          │  │
│  │  • Checks thresholds and creates alerts                             │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  GET /api/usage/stats?period=month&groupBy=model                    │  │
│  │  • Aggregates usage data for dashboards                             │  │
│  │  • Calculates trends and breakdowns                                 │  │
│  │  • Returns top prompts and insights                                 │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  GET/PUT /api/usage/budget                                          │  │
│  │  • Manages budget limits and thresholds                             │  │
│  │  • Returns current budget status                                    │  │
│  │  • Updates settings                                                 │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  POST /api/prompt/run (Enhanced)                                    │  │
│  │  • Executes prompt with OpenAI                                      │  │
│  │  • Calls usage/track after execution                                │  │
│  │  • Returns results + token metrics                                  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬────────────────────────────────────────────┘
                                │
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                          BUSINESS LOGIC LAYER                               │
│                                                                             │
│  ┌──────────────────────┐    ┌──────────────────────┐                     │
│  │  lib/pricing.ts      │    │  lib/budget-         │                     │
│  │  ─────────────       │    │  enforcement.ts      │                     │
│  │                      │    │  ─────────────       │                     │
│  │ • MODEL_PRICING      │    │ • checkBudgetLimits()│                     │
│  │ • calculateCost()    │    │ • createAlert()      │                     │
│  │ • estimateTokens()   │    │ • canExecutePrompt() │                     │
│  └──────────────────────┘    └──────────────────────┘                     │
│                                                                             │
│  ┌──────────────────────┐    ┌──────────────────────┐                     │
│  │  lib/token-          │    │  lib/cost-           │                     │
│  │  tracking.ts         │    │  optimization.ts     │                     │
│  │  ─────────────       │    │  ─────────────       │                     │
│  │                      │    │ • generateRecommend  │                     │
│  │ • logTokenUsage()    │    │   -ations()          │                     │
│  │ • getUsageStats()    │    │ • findOptimizations()│                     │
│  └──────────────────────┘    └──────────────────────┘                     │
└───────────────────────────────┬────────────────────────────────────────────┘
                                │
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER (PostgreSQL)                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  token_usage_logs                                                   │  │
│  │  ────────────────                                                   │  │
│  │  • id (uuid, PK)                                                    │  │
│  │  • user_id (uuid, FK → auth.users)                                 │  │
│  │  • team_id (uuid, FK → teams)                                      │  │
│  │  • prompt_id (uuid, FK → prompts)                                  │  │
│  │  • run_id (uuid, FK → prompt_run_history)                          │  │
│  │  • input_tokens (int)                                              │  │
│  │  • output_tokens (int)                                             │  │
│  │  • total_tokens (int, generated)                                   │  │
│  │  • input_cost_usd (numeric)                                        │  │
│  │  • output_cost_usd (numeric)                                       │  │
│  │  • total_cost_usd (numeric, generated)                             │  │
│  │  • model (text)                                                    │  │
│  │  • execution_type (text)                                           │  │
│  │  • created_at (timestamptz)                                        │  │
│  │                                                                      │  │
│  │  Indexes:                                                           │  │
│  │  • idx_token_usage_user_date (user_id, created_at DESC)            │  │
│  │  • idx_token_usage_team_date (team_id, created_at DESC)            │  │
│  │  • idx_token_usage_prompt (prompt_id)                              │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  usage_budgets                                                      │  │
│  │  ─────────────                                                      │  │
│  │  • id (uuid, PK)                                                    │  │
│  │  • entity_type (text: 'user' | 'team')                             │  │
│  │  • entity_id (uuid)                                                 │  │
│  │  • monthly_budget_usd (numeric)                                    │  │
│  │  • max_tokens_per_prompt (int)                                     │  │
│  │  • daily_budget_usd (numeric)                                      │  │
│  │  • alert_threshold_1 (int, default 75)                             │  │
│  │  • alert_threshold_2 (int, default 90)                             │  │
│  │  • alert_threshold_3 (int, default 100)                            │  │
│  │  • period_start (date)                                             │  │
│  │  • period_tokens_used (int)                                        │  │
│  │  • period_cost_usd (numeric)                                       │  │
│  │  • created_at (timestamptz)                                        │  │
│  │  • updated_at (timestamptz)                                        │  │
│  │                                                                      │  │
│  │  Unique: (entity_type, entity_id, period_start)                    │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  usage_alerts                                                       │  │
│  │  ────────────                                                       │  │
│  │  • id (uuid, PK)                                                    │  │
│  │  • budget_id (uuid, FK → usage_budgets)                            │  │
│  │  • user_id (uuid, FK → auth.users)                                 │  │
│  │  • alert_type (text: 'threshold_75', 'threshold_90', etc.)         │  │
│  │  • alert_level (text: 'info', 'warning', 'critical')               │  │
│  │  • message (text)                                                  │  │
│  │  • current_usage_usd (numeric)                                     │  │
│  │  • budget_limit_usd (numeric)                                      │  │
│  │  • usage_percentage (int)                                          │  │
│  │  • acknowledged (bool, default false)                              │  │
│  │  • acknowledged_at (timestamptz)                                   │  │
│  │  • created_at (timestamptz)                                        │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  teams                                                              │  │
│  │  ─────                                                              │  │
│  │  • id (uuid, PK)                                                    │  │
│  │  • name (text)                                                     │  │
│  │  • subscription_tier (text: 'free', 'team', 'enterprise')          │  │
│  │  • owner_id (uuid, FK → auth.users)                                │  │
│  │  • created_at (timestamptz)                                        │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  team_members                                                       │  │
│  │  ────────────                                                       │  │
│  │  • id (uuid, PK)                                                    │  │
│  │  • team_id (uuid, FK → teams)                                      │  │
│  │  • user_id (uuid, FK → auth.users)                                 │  │
│  │  • role (text: 'owner', 'admin', 'member')                         │  │
│  │  • joined_at (timestamptz)                                         │  │
│  │                                                                      │  │
│  │  Unique: (team_id, user_id)                                        │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram: Prompt Execution with Token Tracking

```
┌──────────────┐
│   User       │
│   Types      │
│   Prompt     │
└──────┬───────┘
       │
       │ 1. Input prompt text
       ▼
┌─────────────────────────────────────────┐
│   Frontend: Prompt Lab Component        │
│                                         │
│  • estimateTokens(promptText)           │
│  • calculateCost(tokens, model)         │
│  • Display preview: "~$0.0009"          │
└──────────────┬──────────────────────────┘
               │
               │ 2. User clicks "Run"
               ▼
┌─────────────────────────────────────────┐
│   Frontend: onClick handler              │
│                                         │
│  • Disable button                       │
│  • Show loading state                   │
│  • POST /api/prompt/run                 │
└──────────────┬──────────────────────────┘
               │
               │ 3. API request
               ▼
┌─────────────────────────────────────────┐
│   Backend: /api/prompt/run              │
│                                         │
│  • Authenticate user                    │
│  • Check budget limits                  │
│  • If over budget → return error        │
│  • Else continue                        │
└──────────────┬──────────────────────────┘
               │
               │ 4. Execute prompt
               ▼
┌─────────────────────────────────────────┐
│   OpenAI API                            │
│                                         │
│  • Process prompt                       │
│  • Generate response                    │
│  • Return: {                            │
│      response: "...",                   │
│      usage: {                           │
│        prompt_tokens: 452,              │
│        completion_tokens: 387,          │
│        total_tokens: 839                │
│      }                                  │
│    }                                    │
└──────────────┬──────────────────────────┘
               │
               │ 5. Response received
               ▼
┌─────────────────────────────────────────┐
│   Backend: Calculate costs              │
│                                         │
│  const inputCost = calculateCost(       │
│    452, 0, 'gpt-4o-mini'                │
│  )                                      │
│  const outputCost = calculateCost(      │
│    0, 387, 'gpt-4o-mini'                │
│  )                                      │
│  const totalCost = inputCost +          │
│                    outputCost           │
└──────────────┬──────────────────────────┘
               │
               │ 6. Log usage
               ▼
┌─────────────────────────────────────────┐
│   POST /api/usage/track                 │
│                                         │
│  INSERT INTO token_usage_logs (         │
│    user_id, prompt_id,                  │
│    input_tokens: 452,                   │
│    output_tokens: 387,                  │
│    input_cost_usd: 0.000068,            │
│    output_cost_usd: 0.000232,           │
│    model: 'gpt-4o-mini',                │
│    ...                                  │
│  )                                      │
└──────────────┬──────────────────────────┘
               │
               │ 7. Update budget
               ▼
┌─────────────────────────────────────────┐
│   Update usage_budgets                  │
│                                         │
│  UPDATE usage_budgets                   │
│  SET period_cost_usd =                  │
│      period_cost_usd + 0.0003           │
│  WHERE entity_type = 'user'             │
│    AND entity_id = user_id              │
│    AND period_start = '2025-12-01'      │
└──────────────┬──────────────────────────┘
               │
               │ 8. Check thresholds
               ▼
┌─────────────────────────────────────────┐
│   Budget Enforcement                    │
│                                         │
│  currentUsage = $22.80 + $0.0003        │
│  budget = $30.00                        │
│  percentage = 76.01%                    │
│                                         │
│  IF percentage >= 75% THEN              │
│    createAlert('threshold_75', ...)     │
│  END IF                                 │
└──────────────┬──────────────────────────┘
               │
               │ 9. Return response
               ▼
┌─────────────────────────────────────────┐
│   API Response                          │
│                                         │
│  {                                      │
│    success: true,                       │
│    response: "AI generated text...",    │
│    prompt: { id, name, text },          │
│    execution_time_ms: 1200,             │
│    tokens_used: 839,                    │
│    cost: {                              │
│      input: 0.000068,                   │
│      output: 0.000232,                  │
│      total: 0.0003                      │
│    },                                   │
│    budget: {                            │
│      current: 22.80,                    │
│      limit: 30.00,                      │
│      percentage: 76%                    │
│    },                                   │
│    warning: {                           │
│      type: 'approaching_limit',         │
│      message: '76% of budget used'      │
│    }                                    │
│  }                                      │
└──────────────┬──────────────────────────┘
               │
               │ 10. Display results
               ▼
┌─────────────────────────────────────────┐
│   Frontend: Display Results             │
│                                         │
│  • Show AI response                     │
│  • Display TokenUsageDisplay component  │
│  • Show BudgetWarning if threshold hit  │
│  • Update history panel                 │
│  • Re-enable run button                 │
└─────────────────────────────────────────┘
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Prompt Lab (Enhanced)                        │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  Prompt Editor (Textarea)                                       │ │
│ │  ┌──────────────────────────────────────────────────────────┐  │ │
│ │  │  Write your prompt here...                               │  │ │
│ │  │  [User types and edits prompt text]                      │  │ │
│ │  └──────────────────────────────────────────────────────────┘  │ │
│ │                                                                  │ │
│ │  onChange → estimateTokens() → updates state                   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  <TokenPreview>                                                 │ │
│ │  ┌──────────────────────────────────────────────────────────┐  │ │
│ │  │  💰 Estimated Cost Preview                               │  │ │
│ │  │  Input:  ~450 tokens                                     │  │ │
│ │  │  Output: ~500 tokens (est)                               │  │ │
│ │  │  Total:  ~950 tokens                                     │  │ │
│ │  │  Estimated cost: $0.0009                                 │  │ │
│ │  │  💡 Tip: Switch to GPT-4o Mini to save 60%              │  │ │
│ │  └──────────────────────────────────────────────────────────┘  │ │
│ │                                                                  │ │
│ │  Props: { promptText, model, subscription }                    │ │
│ │  Updates: Real-time as user types                              │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  <BudgetWarning> (Conditional)                                  │ │
│ │  ┌──────────────────────────────────────────────────────────┐  │ │
│ │  │  ⚠️  Budget Alert                                         │  │ │
│ │  │  You've used 76% of your monthly budget                  │  │ │
│ │  │  [View Details] [Dismiss]                                │  │ │
│ │  └──────────────────────────────────────────────────────────┘  │ │
│ │                                                                  │ │
│ │  Shows: When threshold exceeded                                 │ │
│ │  Data from: Latest API response                                 │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  Run Button & Actions                                           │ │
│ │  ┌──────────────────────────────────────────────────────────┐  │ │
│ │  │  [▶ Run Prompt]  [Save]  [Clear]                         │  │ │
│ │  └──────────────────────────────────────────────────────────┘  │ │
│ │                                                                  │ │
│ │  onClick → POST /api/prompt/run → displays results              │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  <TokenUsageDisplay> (After execution)                          │ │
│ │  ┌──────────────────────────────────────────────────────────┐  │ │
│ │  │  ✅ Execution Complete                                    │  │ │
│ │  │  Input:  452 tokens ($0.000068)                          │  │ │
│ │  │  Output: 387 tokens ($0.000232)                          │  │ │
│ │  │  Total:  839 tokens  $0.0003                             │  │ │
│ │  │  Execution time: 1.2s                                    │  │ │
│ │  └──────────────────────────────────────────────────────────┘  │ │
│ │                                                                  │ │
│ │  Shows: After successful execution                              │ │
│ │  Data from: API response                                        │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  Results Panel                                                  │ │
│ │  ┌──────────────────────────────────────────────────────────┐  │ │
│ │  │  [AI-generated response text]                            │  │ │
│ │  │  [Copy] [Edit] [Save to Library]                        │  │ │
│ │  └──────────────────────────────────────────────────────────┘  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
```

## Database Relationships

```
┌────────────────┐
│  auth.users    │◄──────────┐
└────────┬───────┘           │
         │ 1                 │
         │                   │
         │ *                 │
         ▼                   │
┌────────────────┐           │
│ user_profiles  │           │
│ ──────────     │           │
│ • subscription │           │
│   _tier        │           │
│ • team_id ─────┼───┐       │
└────────────────┘   │       │
                     │       │
         ┌───────────┘       │
         │                   │
         │ *                 │
         ▼           1       │
┌────────────────┐           │
│    teams       │◄──────────┤
│    ─────       │           │
│ • owner_id ────┼───────────┘
└───────┬────────┘
        │ 1
        │
        │ *
        ▼
┌────────────────┐
│ team_members   │
│ ────────────   │
│ • user_id      │
│ • team_id      │
│ • role         │
└────────────────┘


┌─────────────────┐
│  prompts        │
└────────┬────────┘
         │ 1
         │
         │ *
         ▼
┌──────────────────────┐
│ token_usage_logs     │◄───────┐
│ ────────────────     │        │
│ • user_id ───────────┼────────┤
│ • team_id            │        │
│ • prompt_id          │        │
│ • run_id             │        │
│ • input_tokens       │        │
│ • output_tokens      │        │
│ • total_cost_usd     │        │
└──────────────────────┘        │
                                │
                                │
┌──────────────────────┐        │
│  usage_budgets       │        │
│  ─────────────       │        │
│ • entity_type        │        │
│ • entity_id          │        │
│ • monthly_budget     │        │
│ • period_cost_usd    │        │
└────────┬─────────────┘        │
         │ 1                    │
         │                      │
         │ *                    │
         ▼                      │
┌──────────────────────┐        │
│  usage_alerts        │        │
│  ────────────        │        │
│ • budget_id          │        │
│ • user_id ───────────┼────────┘
│ • alert_type         │
│ • message            │
│ • acknowledged       │
└──────────────────────┘
```

## State Management Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    React Component State                      │
│                                                               │
│  Prompt Lab Component                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  State:                                                 │ │
│  │  • prompt: string                                       │ │
│  │  • model: string                                        │ │
│  │  • isRunning: boolean                                   │ │
│  │  • estimate: { tokens, cost }                           │ │
│  │  • actualUsage: { tokens, cost } | null                 │ │
│  │  • budget: { current, limit, percentage }              │ │
│  │  • alert: Alert | null                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
         │
         │ Updates via:
         │
         ├──► onChange(prompt) → estimateTokens()
         │                    → setEstimate({ ... })
         │
         ├──► onClick(run) → setIsRunning(true)
         │                → POST /api/prompt/run
         │                → setActualUsage(response.usage)
         │                → setBudget(response.budget)
         │                → setAlert(response.warning)
         │                → setIsRunning(false)
         │
         └──► onDismissAlert() → setAlert(null)


┌──────────────────────────────────────────────────────────────┐
│                    React Query Cache                          │
│                                                               │
│  Usage Dashboard Component                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  useQuery({                                             │ │
│  │    queryKey: ['usage-stats', period, groupBy],          │ │
│  │    queryFn: () => fetch('/api/usage/stats'),            │ │
│  │    staleTime: 60000, // 1 minute                        │ │
│  │  })                                                      │ │
│  │                                                          │ │
│  │  Cached Data:                                           │ │
│  │  • summary: { totalTokens, totalCost, ... }             │ │
│  │  • breakdown: [...models/prompts/users]                 │ │
│  │  • trends: [...daily data points]                       │ │
│  │  • topPrompts: [...top 10 by cost]                      │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
         │
         │ Invalidated by:
         │
         ├──► After prompt execution
         │    → queryClient.invalidateQueries(['usage-stats'])
         │
         ├──► After budget update
         │    → queryClient.invalidateQueries(['usage-budget'])
         │
         └──► Manual refresh
              → refetch()
```
