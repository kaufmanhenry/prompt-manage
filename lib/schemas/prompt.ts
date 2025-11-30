import { z } from 'zod'

export const modelCategorySchema = z.enum(['LLM', 'Music', 'Video', 'Image', 'Voice', 'Code'])

export const modelSchema = z.enum([
  // LLM Models - OpenAI
  'o3',
  'o1',
  'gpt-5',
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4',
  'gpt-3.5-turbo',
  // LLM Models - Anthropic
  'claude-4-opus',
  'claude-sonnet-4.5',
  'claude-4-sonnet',
  'claude-3.5-sonnet',
  'claude-3-haiku',
  'claude-3-sonnet',
  // LLM Models - Google
  'gemini-3-pro',
  'gemini-2-5-pro',
  'gemini-1-5-pro',
  'gemma-3-27b',
  // LLM Models - Meta
  'llama-3.1-70b-instruct',
  // LLM Models - DeepSeek
  'deepseek-r1-v3',
  // LLM Models - Mistral
  'mistral-large',
  'mixtral-8x22b-instruct',
  'mistral-small',
  // LLM Models - xAI
  'grok-4',
  'grok-3-beta',
  // LLM Models - Alibaba/Qwen
  'qwen2.5-72b-instruct',
  // LLM Models - Cohere
  'command-r-plus',
  // Music Generation
  'suno-v4',
  'udio',
  // Video Generation
  'runway-gen-3',
  'pika-2',
  'google-veo',
  // Image Generation
  'dall-e-3',
  'midjourney',
  'stable-diffusion',
])

export const modelIdSchema = z.string().min(1)

export const promptSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required').max(120, 'Name must be 120 characters or less'),
  description: z.string().optional(),
  prompt_text: z.string().min(1, 'Prompt text is required'),
  model: modelSchema.optional(), // Keep for backward compatibility
  model_category: modelCategorySchema.optional(), // New field for category
  model_id: modelIdSchema.optional(), // New field for specific model
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
> & {
  copy_count?: number
  upvote_count?: number
}

// Schema for copying a public prompt
export const copyPromptSchema = z.object({
  source_prompt_id: z.string().uuid(),
  new_name: z.string().optional(),
})

export type CopyPrompt = z.infer<typeof copyPromptSchema>
