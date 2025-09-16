import { z } from 'zod'

export const promptSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  name: z.string().min(1).max(120),
  prompt_text: z.string().min(1),
  model: z.string().min(1),
  tags: z.array(z.string()).default([]),
  inserted_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
})

export type Prompt = z.infer<typeof promptSchema>

export const createPromptSchema = promptSchema.omit({
  id: true,
  user_id: true,
  inserted_at: true,
  updated_at: true,
})

export type CreatePrompt = z.infer<typeof createPromptSchema>

export const updatePromptSchema = createPromptSchema.partial()

export type UpdatePrompt = z.infer<typeof updatePromptSchema>
