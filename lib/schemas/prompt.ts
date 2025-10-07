import { z } from 'zod'

export const modelSchema = z.enum([
  // OpenAI
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4',
  'gpt-3.5-turbo',
  // Anthropic
  'claude-4-opus',
  'claude-4-sonnet',
  'claude-3.5-sonnet',
  'claude-3-haiku',
  'claude-3-sonnet',
  // Google
  'gemini-2-5-pro',
  'gemini-1-5-pro',
  'gemma-3-27b',
  // Meta
  'llama-3.1-70b-instruct',
  // DeepSeek
  'deepseek-r1-v3',
  // Mistral
  'mistral-large',
  'mixtral-8x22b-instruct',
  'mistral-small',
  // xAI
  'grok-4',
  // Alibaba/Qwen
  'qwen2.5-72b-instruct',
  // Cohere
  'command-r-plus',
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
export type PublicPrompt = Pick<
  Prompt,
  | 'id'
  | 'name'
  | 'description'
  | 'prompt_text'
  | 'model'
  | 'tags'
  | 'slug'
  | 'view_count'
  | 'inserted_at'
  | 'updated_at'
>

// Schema for copying a public prompt
export const copyPromptSchema = z.object({
  source_prompt_id: z.string().uuid(),
  new_name: z.string().optional(),
})

export type CopyPrompt = z.infer<typeof copyPromptSchema>
