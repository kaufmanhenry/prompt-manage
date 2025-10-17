// Token Tracking & Cost Management Types
// Auto-generated from database schema

export type SubscriptionTier = 'free' | 'team' | 'enterprise'

export type TokenExecutionType =
  | 'prompt_run'
  | 'preview'
  | 'improvement'
  | 'agent_generation'
  | 'workflow_node'

export type AlertType =
  | 'threshold_75'
  | 'threshold_90'
  | 'budget_exceeded'
  | 'daily_limit'
  | 'token_limit'

export type AlertLevel = 'info' | 'warning' | 'critical'

// ============================================================================
// DATABASE TABLES
// ============================================================================

export interface Team {
  id: string
  name: string
  subscription_tier: SubscriptionTier
  owner_id: string
  monthly_budget_usd?: number
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  joined_at: string
}

export interface TokenUsageLog {
  id: string
  user_id: string
  team_id?: string
  prompt_id?: string
  run_id?: string

  // Token metrics
  input_tokens: number
  output_tokens: number
  total_tokens: number // computed

  // Cost metrics
  input_cost_usd: number
  output_cost_usd: number
  total_cost_usd: number // computed

  // Model info
  model: string
  model_version?: string
  execution_type: TokenExecutionType

  created_at: string
}

export interface UsageBudget {
  id: string
  entity_type: 'user' | 'team'
  entity_id: string

  // Budget settings
  monthly_budget_usd?: number
  max_tokens_per_prompt?: number
  daily_budget_usd?: number

  // Alert thresholds
  alert_threshold_1: number // default 75
  alert_threshold_2: number // default 90
  alert_threshold_3: number // default 100

  // Current period tracking
  period_start: string // date
  period_tokens_used: number
  period_cost_usd: number

  // Last alert
  last_alert_sent_at?: string
  last_alert_level?: number

  created_at: string
  updated_at: string
}

export interface UsageAlert {
  id: string
  budget_id?: string
  user_id: string

  alert_type: AlertType
  alert_level: AlertLevel

  title: string
  message: string
  current_usage_usd?: number
  budget_limit_usd?: number
  usage_percentage?: number

  // Notification
  notified_via?: string[]

  // Acknowledgment
  acknowledged: boolean
  acknowledged_by_user_id?: string
  acknowledged_at?: string

  // Metadata
  metadata?: Record<string, unknown>
  created_at: string
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface TrackTokenUsageRequest {
  promptId?: string
  runId?: string
  inputTokens: number
  outputTokens: number
  model: string
  executionType?: TokenExecutionType
}

export interface TrackTokenUsageResponse {
  success: boolean
  logId: string
  totalCost: number
  remainingBudget?: number
  warning?: {
    type: 'approaching_limit' | 'budget_exceeded'
    message: string
  }
}

export interface UsageStatsQuery {
  period?: 'day' | 'week' | 'month' | 'year'
  startDate?: string
  endDate?: string
  groupBy?: 'model' | 'prompt' | 'user' | 'day' | 'execution_type'
  teamId?: string
}

export interface UsageStatsSummary {
  totalTokens: number
  totalCost: number
  totalRuns: number
  avgCostPerRun: number
}

export interface UsageStatsBreakdown {
  category: string
  tokens: number
  cost: number
  runs: number
  percentage: number
}

export interface UsageStatsTrend {
  date: string
  tokens: number
  cost: number
  runs: number
}

export interface TopPrompt {
  promptId: string
  promptName: string
  tokens: number
  cost: number
  runs: number
}

export interface UsageStatsResponse {
  summary: UsageStatsSummary
  breakdown: UsageStatsBreakdown[]
  trends: UsageStatsTrend[]
  topPrompts: TopPrompt[]
}

export interface UpdateBudgetRequest {
  entityType: 'user' | 'team'
  entityId: string
  monthlyBudgetUsd?: number
  maxTokensPerPrompt?: number
  dailyBudgetUsd?: number
  alertThresholds?: [number, number, number]
}

export interface UpdateBudgetResponse {
  success: boolean
  budget: UsageBudget
}

export interface GetBudgetResponse {
  budget: UsageBudget | null
}

// ============================================================================
// UI COMPONENT PROPS
// ============================================================================

export interface TokenPreviewProps {
  promptText: string
  contextText?: string
  model: string
  onModelChange?: (model: string) => void
  subscription: SubscriptionTier
}

export interface TokenUsageDisplayProps {
  inputTokens: number
  outputTokens: number
  totalCost: number
  executionTimeMs: number
  model: string
  subscription: SubscriptionTier
}

export interface BudgetWarningProps {
  currentUsage: number
  budgetLimit: number
  level: AlertLevel
  onDismiss: () => void
  onViewDetails: () => void
  onIncreaseBudget?: () => void
}

export interface UsageDashboardProps {
  userId?: string
  teamId?: string
  period?: 'day' | 'week' | 'month' | 'year'
}

export interface BudgetSettingsProps {
  entityType: 'user' | 'team'
  entityId: string
  currentBudget?: UsageBudget
  onSave: (budget: UpdateBudgetRequest) => Promise<void>
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface ModelPricing {
  id: string
  name: string
  provider: string
  inputCostPer1M: number
  outputCostPer1M: number
  maxTokens: number
}

export interface CostCalculation {
  inputCost: number
  outputCost: number
  totalCost: number
}

export interface TokenEstimate {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
}

export interface BudgetStatus {
  current: number
  limit?: number
  percentage?: number
  remaining?: number
  isExceeded: boolean
  isNearLimit: boolean
}

export interface CostOptimizationSuggestion {
  type: 'model_switch' | 'context_reduction' | 'batch_processing' | 'caching'
  title: string
  description: string
  currentCost: number
  projectedCost: number
  savings: number
  savingsPercentage: number
  difficulty: 'easy' | 'medium' | 'hard'
  actionUrl?: string
}

// ============================================================================
// CHART DATA TYPES
// ============================================================================

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface PieChartData {
  name: string
  value: number
  percentage: number
  color?: string
}

export interface BarChartData {
  category: string
  value: number
  subValues?: Record<string, number>
}

// ============================================================================
// EXPORT DATA TYPES
// ============================================================================

export interface ExportUsageDataRequest {
  format: 'csv' | 'json' | 'pdf'
  startDate: string
  endDate: string
  includeDetails: boolean
  groupBy?: 'day' | 'week' | 'month'
}

export interface ExportUsageDataResponse {
  success: boolean
  downloadUrl: string
  expiresAt: string
}

// ============================================================================
// TEAM ANALYTICS TYPES
// ============================================================================

export interface TeamMemberUsage {
  userId: string
  userName: string
  runs: number
  tokens: number
  cost: number
  budgetLimit?: number
  budgetUsagePercentage?: number
}

export interface TeamUsageAnalytics {
  teamId: string
  teamName: string
  totalCost: number
  totalTokens: number
  totalRuns: number
  activeMembers: number
  avgCostPerMember: number
  period: {
    start: string
    end: string
  }
  members: TeamMemberUsage[]
  costBreakdownByModel: UsageStatsBreakdown[]
  costOptimizationSuggestions: CostOptimizationSuggestion[]
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface AlertNotification {
  id: string
  title: string
  message: string
  level: AlertLevel
  type: AlertType
  timestamp: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

export interface NotificationPreferences {
  email: boolean
  slack: boolean
  webhook: boolean
  alertTypes: AlertType[]
  minimumLevel: AlertLevel
  quietHoursEnabled: boolean
  quietHoursStart?: string
  quietHoursEnd?: string
}
