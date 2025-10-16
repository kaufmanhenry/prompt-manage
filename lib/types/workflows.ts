// Autonomous Workflow System Types
// Auto-generated from database schema

export type DataSourceType =
  | 'google_sheets'
  | 'airtable'
  | 'notion'
  | 'api'
  | 'csv'
  | 'json'
  | 'database'
  | 'crm'
  | 'webhook'

export type DataSourceStatus = 'active' | 'error' | 'paused' | 'disconnected'

export type SyncFrequency = 'real-time' | 'hourly' | 'daily' | 'weekly' | 'manual'

export type WorkflowExecutionMode = 'manual' | 'scheduled' | 'triggered' | 'continuous' | 'webhook'

export type WorkflowStatus = 'draft' | 'active' | 'paused' | 'archived' | 'error'

export type NodeType =
  | 'data_source'
  | 'prompt'
  | 'condition'
  | 'transform'
  | 'loop'
  | 'output'
  | 'webhook'
  | 'delay'

export type ExecutionStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'timeout'
  | 'skipped'
  | 'retrying'

export type WorkflowPermissionLevel = 'viewer' | 'runner' | 'editor' | 'admin'

export type WorkflowCategory =
  | 'content_generation'
  | 'data_processing'
  | 'analysis'
  | 'automation'
  | 'integration'
  | 'reporting'
  | 'other'

export type AlertSeverity = 'info' | 'warning' | 'critical'

export type WorkflowAlertType =
  | 'failure'
  | 'empty_output'
  | 'cost_threshold'
  | 'performance_degradation'
  | 'timeout'
  | 'retry_exhausted'

// ============================================================================
// DATABASE TABLES
// ============================================================================

export interface DataSource {
  id: string
  user_id: string
  team_id?: string
  
  name: string
  description?: string
  type: DataSourceType
  
  config: Record<string, unknown>
  
  status: DataSourceStatus
  sync_frequency?: SyncFrequency
  last_sync_at?: string
  next_sync_at?: string
  
  error_log?: Record<string, unknown>
  error_count: number
  
  created_at: string
  updated_at: string
}

export interface ConnectorCredentials {
  id: string
  user_id: string
  team_id?: string
  
  connector_type: string
  
  // Encrypted (not exposed to frontend)
  encrypted_credentials: Buffer
  encryption_key_id: string
  
  oauth_token_expires_at?: string
  oauth_refresh_token_encrypted?: Buffer
  
  status: 'active' | 'expired' | 'revoked' | 'error'
  last_used_at?: string
  last_refreshed_at?: string
  
  created_at: string
  updated_at: string
}

export interface DataSourceSync {
  id: string
  data_source_id: string
  
  status: ExecutionStatus
  
  started_at: string
  completed_at?: string
  
  records_fetched: number
  records_processed: number
  records_failed: number
  bytes_transferred: number
  
  error_message?: string
  error_details?: Record<string, unknown>
  
  sync_mode?: 'full' | 'incremental'
  sync_metadata?: Record<string, unknown>
  
  created_at: string
}

export interface Workflow {
  id: string
  user_id: string
  team_id?: string
  
  name: string
  description?: string
  
  definition: WorkflowDefinition
  
  execution_mode: WorkflowExecutionMode
  schedule_config?: ScheduleConfig
  trigger_config?: TriggerConfig
  
  max_concurrent_runs: number
  timeout_seconds: number
  retry_config: RetryConfig
  
  status: WorkflowStatus
  version: number
  is_template: boolean
  
  total_executions: number
  successful_executions: number
  failed_executions: number
  last_executed_at?: string
  
  tags?: string[]
  category?: string
  
  created_at: string
  updated_at: string
}

export interface WorkflowNode {
  id: string
  workflow_id: string
  node_id: string
  
  node_type: NodeType
  label: string
  
  config: NodeConfig
  position?: { x: number; y: number }
  
  depends_on?: string[]
  
  created_at: string
}

export interface WorkflowExecution {
  id: string
  workflow_id: string
  workflow_version: number
  
  triggered_by: 'manual' | 'schedule' | 'api' | 'webhook' | 'event' | 'system'
  triggered_by_user_id?: string
  trigger_data?: Record<string, unknown>
  
  status: ExecutionStatus
  started_at?: string
  completed_at?: string
  
  total_nodes: number
  completed_nodes: number
  failed_nodes: number
  skipped_nodes: number
  
  total_tokens_used: number
  total_cost_usd: number
  execution_time_ms?: number
  
  error_message?: string
  error_node_id?: string
  error_details?: Record<string, unknown>
  
  output_data?: Record<string, unknown>
  
  created_at: string
}

export interface NodeExecution {
  id: string
  workflow_execution_id: string
  node_id: string
  
  status: ExecutionStatus
  started_at?: string
  completed_at?: string
  
  input_data?: Record<string, unknown>
  output_data?: Record<string, unknown>
  
  tokens_used?: number
  cost_usd?: number
  model?: string
  execution_time_ms?: number
  
  attempt_number: number
  max_attempts: number
  error_message?: string
  error_details?: Record<string, unknown>
  
  created_at: string
}

export interface WorkflowPermission {
  id: string
  workflow_id: string
  user_id: string
  
  permission_level: WorkflowPermissionLevel
  
  granted_by_user_id: string
  granted_at: string
}

export interface WorkflowTemplate {
  id: string
  name: string
  description?: string
  category: WorkflowCategory
  
  definition: WorkflowDefinition
  
  is_public: boolean
  created_by_user_id?: string
  
  tags?: string[]
  use_count: number
  rating?: number
  rating_count: number
  
  created_at: string
  updated_at: string
}

export interface WorkflowAlert {
  id: string
  workflow_id?: string
  workflow_execution_id?: string
  
  alert_type: WorkflowAlertType
  severity: AlertSeverity
  
  title: string
  message: string
  metadata?: Record<string, unknown>
  
  notified_users?: string[]
  notified_via?: string[]
  notification_sent_at?: string
  
  acknowledged: boolean
  acknowledged_by_user_id?: string
  acknowledged_at?: string
  
  created_at: string
}

// ============================================================================
// WORKFLOW DEFINITION TYPES
// ============================================================================

export interface WorkflowDefinition {
  version: string
  nodes: WorkflowNodeDefinition[]
  edges: WorkflowEdge[]
  settings: WorkflowSettings
}

export interface WorkflowNodeDefinition {
  id: string
  type: NodeType
  label: string
  config: NodeConfig
  position?: { x: number; y: number }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  condition?: string
  label?: string
}

export interface WorkflowSettings {
  maxConcurrentNodes: number
  timeout: number
  retryPolicy: RetryPolicy
  errorHandling: 'stop' | 'continue' | 'fallback'
}

export interface RetryPolicy {
  maxAttempts: number
  backoff: 'linear' | 'exponential' | 'constant'
  initialDelay: number
  maxDelay: number
}

export interface RetryConfig {
  max_attempts: number
  backoff: 'linear' | 'exponential' | 'constant'
  initial_delay_ms: number
  max_delay_ms: number
}

export interface ScheduleConfig {
  type: 'cron' | 'interval'
  cron?: string
  interval_minutes?: number
  timezone?: string
  enabled: boolean
}

export interface TriggerConfig {
  type: 'webhook' | 'event' | 'api'
  webhook_url?: string
  event_type?: string
  api_key?: string
}

// ============================================================================
// NODE CONFIGURATION TYPES
// ============================================================================

export type NodeConfig =
  | DataSourceNodeConfig
  | PromptNodeConfig
  | ConditionNodeConfig
  | TransformNodeConfig
  | LoopNodeConfig
  | OutputNodeConfig
  | WebhookNodeConfig
  | DelayNodeConfig

export interface DataSourceNodeConfig {
  sourceId: string
  sourceType: DataSourceType
  query?: QueryConfig
  transform?: TransformConfig
}

export interface PromptNodeConfig {
  promptTemplate: string
  model: string
  temperature?: number
  maxTokens?: number
  contextTemplate?: string
}

export interface ConditionNodeConfig {
  condition: string
  trueBranch: string
  falseBranch: string
}

export interface TransformNodeConfig {
  transformType: 'map' | 'filter' | 'reduce' | 'custom'
  code?: string
  mapping?: Record<string, string>
}

export interface LoopNodeConfig {
  iterateOver: string
  itemVariable: string
  bodyNodes: string[]
  maxIterations?: number
}

export interface OutputNodeConfig {
  destination: 'database' | 'file' | 'webhook' | 'email'
  config: Record<string, unknown>
}

export interface WebhookNodeConfig {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: string
}

export interface DelayNodeConfig {
  delayMs: number
  condition?: string
}

export interface QueryConfig {
  columns?: string[]
  where?: QueryCondition[]
  orderBy?: string
  limit?: number
}

export interface QueryCondition {
  field: string
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'startsWith' | 'endsWith'
  value: unknown
}

export interface TransformConfig {
  filter?: string
  map?: Record<string, string>
  limit?: number
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateWorkflowRequest {
  name: string
  description?: string
  definition?: Partial<WorkflowDefinition>
  execution_mode?: WorkflowExecutionMode
  tags?: string[]
  category?: string
}

export interface CreateWorkflowResponse {
  success: boolean
  workflow: Workflow
}

export interface UpdateWorkflowRequest {
  name?: string
  description?: string
  definition?: WorkflowDefinition
  execution_mode?: WorkflowExecutionMode
  schedule_config?: ScheduleConfig
  status?: WorkflowStatus
  tags?: string[]
}

export interface UpdateWorkflowResponse {
  success: boolean
  workflow: Workflow
}

export interface TriggerWorkflowRequest {
  workflowId: string
  triggerData?: Record<string, unknown>
}

export interface TriggerWorkflowResponse {
  success: boolean
  executionId: string
}

export interface GetWorkflowExecutionResponse {
  execution: WorkflowExecution
  nodeExecutions: NodeExecution[]
}

export interface ListWorkflowsQuery {
  status?: WorkflowStatus
  tags?: string[]
  category?: string
  search?: string
  limit?: number
  offset?: number
}

export interface ListWorkflowsResponse {
  workflows: Workflow[]
  total: number
}

export interface CreateDataSourceRequest {
  name: string
  description?: string
  type: DataSourceType
  config: Record<string, unknown>
  sync_frequency?: SyncFrequency
}

export interface CreateDataSourceResponse {
  success: boolean
  dataSource: DataSource
}

export interface TestConnectionRequest {
  dataSourceId: string
}

export interface TestConnectionResponse {
  success: boolean
  message: string
  details?: Record<string, unknown>
}

// ============================================================================
// UI COMPONENT PROPS
// ============================================================================

export interface WorkflowBuilderProps {
  workflowId?: string
  initialDefinition?: WorkflowDefinition
  onSave: (workflow: CreateWorkflowRequest | UpdateWorkflowRequest) => Promise<void>
  readOnly?: boolean
}

export interface NodePaletteProps {
  onSelectNode: (nodeType: NodeType) => void
  availableDataSources: DataSource[]
}

export interface NodeEditorProps {
  node: WorkflowNodeDefinition
  onChange: (node: WorkflowNodeDefinition) => void
  onDelete: () => void
}

export interface WorkflowExecutionViewerProps {
  executionId: string
  onRerun?: () => void
}

export interface DataSourceManagerProps {
  userId: string
  teamId?: string
  onConnect: (dataSource: CreateDataSourceRequest) => Promise<void>
}

export interface WorkflowListProps {
  userId: string
  teamId?: string
  filters?: ListWorkflowsQuery
}

// ============================================================================
// WORKFLOW BUILDER STATE
// ============================================================================

export interface WorkflowBuilderState {
  definition: WorkflowDefinition
  selectedNodeId?: string
  selectedEdgeId?: string
  isDirty: boolean
  validationErrors: ValidationError[]
}

export interface ValidationError {
  nodeId?: string
  edgeId?: string
  message: string
  severity: 'error' | 'warning'
}

// ============================================================================
// EXECUTION CONTEXT
// ============================================================================

export interface ExecutionContext {
  workflowId: string
  executionId: string
  data: Map<string, unknown>
  variables: Map<string, unknown>
  startTime: number
}

// ============================================================================
// CONNECTOR TYPES
// ============================================================================

export interface ConnectorConfig {
  sourceId: string
  query?: QueryConfig
  transform?: TransformConfig
  pagination?: PaginationConfig
}

export interface PaginationConfig {
  type: 'page' | 'offset' | 'cursor'
  pageSize?: number
  pageParam?: string
  offsetParam?: string
  limitParam?: string
  cursorParam?: string
}

export interface SyncConfig {
  mode: 'full' | 'incremental'
  frequency: SyncFrequency
  lastSyncedAt?: Date
}

export interface SyncResult {
  success: boolean
  recordsSynced: number
  error?: string
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface WorkflowAnalytics {
  workflowId: string
  workflowName: string
  
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  successRate: number
  
  avgExecutionTime: number
  avgTokensUsed: number
  avgCost: number
  
  totalCost: number
  totalTokens: number
  
  executionsByDay: ChartDataPoint[]
  costByDay: ChartDataPoint[]
  failuresByNode: Record<string, number>
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

export interface TemplateMetadata {
  name: string
  description: string
  category: WorkflowCategory
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  requiredConnectors: DataSourceType[]
}

export interface TemplateDeployRequest {
  templateId: string
  customizations?: {
    name?: string
    dataSourceMappings?: Record<string, string>
    promptCustomizations?: Record<string, string>
  }
}

export interface TemplateDeployResponse {
  success: boolean
  workflowId: string
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface WorkflowNotificationPreferences {
  onFailure: boolean
  onSuccess: boolean
  onCostThreshold: boolean
  costThreshold?: number
  channels: ('email' | 'slack' | 'webhook')[]
  webhookUrl?: string
  slackChannel?: string
}

