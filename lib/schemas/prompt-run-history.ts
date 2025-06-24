import { z } from 'zod'

export const promptRunHistorySchema = z.object({
  id: z.string().uuid(),
  prompt_id: z.string().uuid(),
  user_id: z.string().uuid(),
  prompt_text: z.string(),
  response: z.string(),
  model: z.string(),
  tokens_used: z.number().nullable(),
  execution_time_ms: z.number().nullable(),
  status: z.enum(['success', 'error', 'timeout']).default('success'),
  error_message: z.string().nullable(),
  created_at: z.string().datetime(),
})

export type PromptRunHistory = z.infer<typeof promptRunHistorySchema>

export const createPromptRunHistorySchema = promptRunHistorySchema.omit({
  id: true,
  user_id: true,
  created_at: true,
})

export type CreatePromptRunHistory = z.infer<typeof createPromptRunHistorySchema> 