import { z } from 'zod'

// Version control types
export const promptVersionSchema = z.object({
  id: z.string().uuid(),
  prompt_id: z.string().uuid(),
  version: z.number().int().positive(),
  name: z.string().min(1).max(120),
  description: z.string().nullable(),
  prompt_text: z.string().min(1),
  model: z.string(),
  tags: z.array(z.string()).default([]),
  change_type: z.enum(['create', 'edit', 'fork', 'revert']).default('edit'),
  change_summary: z.string().nullable(),
  created_by: z.string().uuid(),
  created_at: z.string(),
})

export const promptWithVersionsSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(120),
  description: z.string().nullable(),
  prompt_text: z.string().min(1),
  model: z.string(),
  tags: z.array(z.string()).default([]),
  is_public: z.boolean().default(false),
  slug: z.string().nullable(),
  view_count: z.number().default(0),
  version: z.number().int().positive().default(1),
  parent_id: z.string().uuid().nullable(),
  is_forked: z.boolean().default(false),
  fork_count: z.number().default(0),
  inserted_at: z.string(),
  updated_at: z.string(),
  last_edited_at: z.string(),
})

// API request/response types
export const createVersionRequestSchema = z.object({
  prompt_id: z.string().uuid(),
  change_summary: z.string().optional(),
})

export const forkPromptRequestSchema = z.object({
  source_prompt_id: z.string().uuid(),
  new_name: z.string().min(1).max(120),
  new_description: z.string().optional(),
})

export const revertPromptRequestSchema = z.object({
  prompt_id: z.string().uuid(),
  target_version: z.number().int().positive(),
})

export const versionHistoryResponseSchema = z.object({
  versions: z.array(promptVersionSchema),
  current_version: z.number().int().positive(),
  total_versions: z.number().int().positive(),
})

// UI component prop types
export interface PromptVersion {
  id: string
  prompt_id: string
  version: number
  name: string
  description: string | null
  prompt_text: string
  model: string
  tags: string[]
  change_type: 'create' | 'edit' | 'fork' | 'revert'
  change_summary: string | null
  created_by: string
  created_at: string
}

export interface PromptWithVersions {
  id: string
  user_id: string
  name: string
  description: string | null
  prompt_text: string
  model: string
  tags: string[]
  is_public: boolean
  slug: string | null
  view_count: number
  version: number
  parent_id: string | null
  is_forked: boolean
  fork_count: number
  inserted_at: string
  updated_at: string
  last_edited_at: string
}

export interface VersionHistoryProps {
  promptId: string
  currentVersion: number
  onVersionSelect?: (version: PromptVersion) => void
  onRevert?: (version: number) => void
  canEdit?: boolean
}

export interface VersionComparisonProps {
  promptId: string
  versionA: number
  versionB: number
}

export interface ForkPromptProps {
  sourcePrompt: PromptWithVersions
  onFork?: (newPromptId: string) => void
}

export interface EditPromptProps {
  prompt: PromptWithVersions
  onSave?: (updatedPrompt: PromptWithVersions) => void
  onCancel?: () => void
}

// Utility types
export type ChangeType = 'create' | 'edit' | 'fork' | 'revert'

export interface VersionDiff {
  field: string
  oldValue: string | string[] | null
  newValue: string | string[] | null
  type: 'added' | 'removed' | 'modified'
}

export interface VersionComparisonResult {
  versionA: PromptVersion
  versionB: PromptVersion
  diffs: VersionDiff[]
  hasChanges: boolean
}

// API response types
export interface ForkPromptResponse {
  success: boolean
  new_prompt_id?: string
  error?: string
}

export interface RevertPromptResponse {
  success: boolean
  new_version?: number
  error?: string
}

export interface VersionHistoryResponse {
  success: boolean
  versions?: PromptVersion[]
  current_version?: number
  total_versions?: number
  error?: string
}

// Export inferred types
export type PromptVersion = z.infer<typeof promptVersionSchema>
export type PromptWithVersions = z.infer<typeof promptWithVersionsSchema>
export type CreateVersionRequest = z.infer<typeof createVersionRequestSchema>
export type ForkPromptRequest = z.infer<typeof forkPromptRequestSchema>
export type RevertPromptRequest = z.infer<typeof revertPromptRequestSchema>
export type VersionHistoryResponse = z.infer<typeof versionHistoryResponseSchema>
