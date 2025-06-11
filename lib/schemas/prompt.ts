import { z } from 'zod'

export const modelSchema = z.enum([
  'gpt-4',
  'gpt-3.5-turbo',
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-3-haiku',
  'gemini-pro',
  'mistral-large',
  'mistral-medium',
  'mistral-small',
])

export const promptSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  prompt_text: z.string().min(1, 'Prompt text is required'),
  model: modelSchema,
  tags: z.array(z.string()).default([]),
  updated_at: z.string().optional(),
  user_id: z.string(),
})

export type Model = z.infer<typeof modelSchema>
export type Prompt = z.infer<typeof promptSchema>
export type CreatePrompt = Omit<Prompt, 'id' | 'updated_at'>
export type UpdatePrompt = Partial<CreatePrompt> & { id: string } 