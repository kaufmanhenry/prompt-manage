# Token Tracking & Cost Management System - Design Specification

## Executive Summary

This document outlines a comprehensive token tracking and cost management system for Prompt Lab that provides visibility, control, and optimization features across Free, Teams ($5/mo), and Enterprise ($27/mo) tiers.

## 1. System Architecture Overview

### Core Components

1. **Token Metering Service** - Real-time token counting and cost calculation
2. **Usage Analytics Service** - Aggregates usage data for dashboards
3. **Budget Enforcement Service** - Monitors limits and triggers alerts
4. **Cost Optimization Engine** - Provides recommendations to reduce costs

### Data Flow

```
Prompt Execution → Token Metering → Usage Logging → Analytics Aggregation → Dashboard Display
                                    ↓
                            Budget Enforcement → Alerts/Warnings
```

## 2. Database Schema Extensions

### New Tables

#### `token_usage_logs`

Tracks every API call with detailed token metrics.

```sql
CREATE TABLE public.token_usage_logs (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  team_id           uuid REFERENCES public.teams ON DELETE CASCADE,
  prompt_id         uuid REFERENCES public.prompts ON DELETE SET NULL,
  run_id            uuid REFERENCES public.prompt_run_history ON DELETE CASCADE,

  -- Token metrics
  input_tokens      integer NOT NULL,
  output_tokens     integer NOT NULL,
  total_tokens      integer GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,

  -- Cost metrics (USD)
  input_cost_usd    numeric(10, 6) NOT NULL,
  output_cost_usd   numeric(10, 6) NOT NULL,
  total_cost_usd    numeric(10, 6) GENERATED ALWAYS AS (input_cost_usd + output_cost_usd) STORED,

  -- Model and context
  model             text NOT NULL,
  model_version     text,
  execution_type    text NOT NULL, -- 'prompt_run', 'preview', 'improvement', 'agent_generation'

  -- Metadata
  created_at        timestamptz DEFAULT now(),

  -- Indexes for fast queries
  INDEX idx_token_usage_user_date (user_id, created_at DESC),
  INDEX idx_token_usage_team_date (team_id, created_at DESC) WHERE team_id IS NOT NULL,
  INDEX idx_token_usage_prompt (prompt_id) WHERE prompt_id IS NOT NULL
);
```

#### `usage_budgets`

Defines spending limits for users and teams.

```sql
CREATE TABLE public.usage_budgets (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type       text NOT NULL, -- 'user' or 'team'
  entity_id         uuid NOT NULL,

  -- Budget settings
  monthly_budget_usd numeric(10, 2),
  max_tokens_per_prompt integer,
  daily_budget_usd  numeric(10, 2),

  -- Alert thresholds (percentage)
  alert_threshold_1 integer DEFAULT 75, -- Alert at 75%
  alert_threshold_2 integer DEFAULT 90, -- Alert at 90%
  alert_threshold_3 integer DEFAULT 100, -- Alert at 100%

  -- Current period tracking
  period_start      date NOT NULL DEFAULT date_trunc('month', now()),
  period_tokens_used integer DEFAULT 0,
  period_cost_usd   numeric(10, 2) DEFAULT 0,

  -- Metadata
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),

  UNIQUE(entity_type, entity_id, period_start)
);
```

#### `usage_alerts`

Logs when budget thresholds are crossed.

```sql
CREATE TABLE public.usage_alerts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id         uuid REFERENCES public.usage_budgets ON DELETE CASCADE,
  user_id           uuid REFERENCES auth.users ON DELETE CASCADE,

  alert_type        text NOT NULL, -- 'threshold_75', 'threshold_90', 'budget_exceeded', 'daily_limit'
  alert_level       text NOT NULL, -- 'info', 'warning', 'critical'

  message           text NOT NULL,
  current_usage_usd numeric(10, 2),
  budget_limit_usd  numeric(10, 2),
  usage_percentage  integer,

  acknowledged      boolean DEFAULT false,
  acknowledged_at   timestamptz,

  created_at        timestamptz DEFAULT now(),

  INDEX idx_usage_alerts_user (user_id, acknowledged, created_at DESC)
);
```

#### `teams` (New table for team management)

```sql
CREATE TABLE public.teams (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  subscription_tier text NOT NULL DEFAULT 'free', -- 'free', 'team', 'enterprise'
  owner_id          uuid REFERENCES auth.users ON DELETE CASCADE,

  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

CREATE TABLE public.team_members (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id           uuid REFERENCES public.teams ON DELETE CASCADE,
  user_id           uuid REFERENCES auth.users ON DELETE CASCADE,
  role              text NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member'

  joined_at         timestamptz DEFAULT now(),

  UNIQUE(team_id, user_id)
);
```

### Extend Existing Tables

Add subscription tier tracking to `user_profiles`:

```sql
ALTER TABLE public.user_profiles
ADD COLUMN subscription_tier text DEFAULT 'free', -- 'free', 'team', 'enterprise'
ADD COLUMN team_id uuid REFERENCES public.teams ON DELETE SET NULL,
ADD COLUMN monthly_token_quota integer,
ADD COLUMN monthly_budget_usd numeric(10, 2);
```

Update `prompt_run_history` to link with token usage:

```sql
ALTER TABLE public.prompt_run_history
ADD COLUMN input_tokens integer,
ADD COLUMN output_tokens integer,
ADD COLUMN cost_usd numeric(10, 6),
ADD COLUMN token_log_id uuid REFERENCES public.token_usage_logs ON DELETE SET NULL;
```

## 3. Pricing Model Configuration

### Model Pricing Table (Updated 2025)

```typescript
// lib/pricing.ts

export interface ModelPricing {
  id: string
  name: string
  provider: string
  inputCostPer1M: number // USD per 1M input tokens
  outputCostPer1M: number // USD per 1M output tokens
  maxTokens: number
}

export const MODEL_PRICING: Record<string, ModelPricing> = {
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
    maxTokens: 128000,
  },
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    inputCostPer1M: 2.5,
    outputCostPer1M: 10.0,
    maxTokens: 128000,
  },
  'gpt-4-turbo': {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    inputCostPer1M: 10.0,
    outputCostPer1M: 30.0,
    maxTokens: 128000,
  },
  'claude-3-5-sonnet': {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
    maxTokens: 200000,
  },
  'gemini-1-5-pro': {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.0,
    maxTokens: 1000000,
  },
}

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  modelId: string,
): { inputCost: number; outputCost: number; totalCost: number } {
  const pricing = MODEL_PRICING[modelId] || MODEL_PRICING['gpt-4o-mini']

  const inputCost = (inputTokens / 1_000_000) * pricing.inputCostPer1M
  const outputCost = (outputTokens / 1_000_000) * pricing.outputCostPer1M
  const totalCost = inputCost + outputCost

  return {
    inputCost: Number(inputCost.toFixed(6)),
    outputCost: Number(outputCost.toFixed(6)),
    totalCost: Number(totalCost.toFixed(6)),
  }
}

// Token estimation for preview (before actual API call)
export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters for English text
  // This is a simplification; actual tokenization varies by model
  return Math.ceil(text.length / 4)
}
```

## 4. Subscription Tier Features

### Feature Matrix

| Feature                        | Free   | Teams ($5/mo) | Enterprise ($27/mo) |
| ------------------------------ | ------ | ------------- | ------------------- |
| **Token Tracking**             |
| Basic token count per run      | ✅     | ✅            | ✅                  |
| Real-time cost preview         | ❌     | ✅            | ✅                  |
| Input/output token breakdown   | ❌     | ✅            | ✅                  |
| Historical usage data          | 7 days | 90 days       | Unlimited           |
| **Budgets & Limits**           |
| Max tokens per prompt          | 1,000  | 10,000        | 100,000             |
| Monthly budget limits          | ❌     | ✅            | ✅                  |
| Daily budget limits            | ❌     | ❌            | ✅                  |
| Custom alerts                  | ❌     | 2 levels      | 3 levels            |
| **Dashboards**                 |
| Personal usage dashboard       | Basic  | ✅            | ✅                  |
| Team usage dashboard           | ❌     | ✅            | ✅                  |
| Cost breakdown by model        | ❌     | ✅            | ✅                  |
| Cost breakdown by prompt       | ❌     | ❌            | ✅                  |
| Cost breakdown by user         | ❌     | ❌            | ✅                  |
| Usage trends & graphs          | ❌     | ✅            | ✅                  |
| **Optimization**               |
| Basic cost tips                | ✅     | ✅            | ✅                  |
| Model recommendations          | ❌     | ✅            | ✅                  |
| Token optimization suggestions | ❌     | ❌            | ✅                  |
| Automated cost reports         | ❌     | ❌            | ✅                  |
| **Export & Reporting**         |
| Export usage CSV               | ❌     | ✅            | ✅                  |
| Detailed cost reports          | ❌     | ❌            | ✅                  |
| API access to usage data       | ❌     | ❌            | ✅                  |
| Custom report scheduling       | ❌     | ❌            | ✅                  |
