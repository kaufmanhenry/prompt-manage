// Agent System Types

export interface Agent {
  id: string
  name: string
  owner_id: string
  team_id: string | null
  mode: 'autonomous' | 'review'
  is_active: boolean
  temperature: number
  quality_threshold: number
  created_at: string
  updated_at: string
}

export interface AgentPrompt {
  id: string
  agent_id: string
  prompt_id: string | null
  topic: string
  keyword: string
  raw_input: string | null
  raw_output: string | null
  quality_score: number | null
  status: 'draft' | 'review' | 'approved' | 'published' | 'rejected' | 'failed'
  error_message: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  prompts?: {
    id: string
    name: string
    slug: string
    is_public: boolean
    view_count: number
  }
}

export interface AgentKeyword {
  id: string
  agent_id: string
  keyword: string
  category: string | null
  priority: number
  is_active: boolean
  generated_count: number
  last_generated_at: string | null
  created_at: string
}

export interface AgentStats {
  agent: {
    id: string
    name: string
    mode: string
    is_active: boolean
  }
  stats: {
    total: number
    draft: number
    review: number
    approved: number
    published: number
    rejected: number
    failed: number
    average_quality: number
    generated_today: number
    generated_this_week: number
  }
  top_keywords: Array<{
    keyword: string
    generated_count: number
    last_generated_at: string | null
  }>
}
