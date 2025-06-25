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
  name: z.string().min(1, 'Name is required').max(120, 'Name must be 120 characters or less'),
  description: z.string().optional(),
  prompt_text: z.string().min(1, 'Prompt text is required'),
  model: modelSchema,
  tags: z.array(z.string()).default([]),
  is_public: z.boolean().default(false),
  slug: z.string().optional(),
  view_count: z.number().default(0),
  parent_prompt_id: z.string().uuid().optional(),
  inserted_at: z.string().optional(),
  updated_at: z.string().optional(),
  user_id: z.string(),
})

export type Model = z.infer<typeof modelSchema>
export type Prompt = z.infer<typeof promptSchema>
export type CreatePrompt = Omit<Prompt, 'id' | 'updated_at' | 'inserted_at' | 'slug' | 'view_count'>
export type UpdatePrompt = Partial<CreatePrompt> & { id: string }
export type PublicPrompt = Pick<Prompt, 'id' | 'name' | 'description' | 'prompt_text' | 'model' | 'tags' | 'slug' | 'view_count' | 'inserted_at' | 'updated_at'>

// Schema for copying a public prompt
export const copyPromptSchema = z.object({
  source_prompt_id: z.string().uuid(),
  new_name: z.string().optional(),
})

export type CopyPrompt = z.infer<typeof copyPromptSchema> 