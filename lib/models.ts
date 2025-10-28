export type ModelCategory = 'LLM' | 'Music' | 'Video' | 'Image' | 'Voice' | 'Code'

export interface Model {
  id: string
  name: string
  company: string
  type: 'Proprietary' | 'Open Source'
  category: ModelCategory
  description: string
  capabilities: string[]
  icon: string
  color: string
  textColor: string
  features: string[]
  useCases: string[]
  companyUrl: string
}

export const supportedModels: Model[] = [
  // OpenAI
  {
    id: 'gpt-5',
    name: 'GPT-5',
    company: 'OpenAI',
    type: 'Proprietary',
    category: 'LLM',
    description: "OpenAI's most advanced model with enhanced capabilities across all domains.",
    capabilities: ['Advanced Reasoning', 'Multimodal', 'Enhanced Performance'],
    icon: '',
    color: 'bg-emerald-100 dark:bg-emerald-900',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    features: [
      'Enhanced reasoning and problem-solving',
      'Improved multimodal capabilities',
      'Superior performance across tasks',
    ],
    useCases: ['Advanced AI applications', 'Complex problem solving', 'Cutting-edge development'],
    companyUrl: 'https://openai.com',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    company: 'OpenAI',
    type: 'Proprietary',
    category: 'LLM',
    description:
      'Multimodal flagship handling text, images, audio, and video with strong reasoning.',
    capabilities: ['Multimodal', 'Advanced Reasoning', 'Large Context'],
    icon: '',
    color: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-600 dark:text-green-400',
    features: [
      'Text, image, audio, and video',
      'Superior code generation',
      'Low latency, high quality',
    ],
    useCases: ['Content generation', 'Analysis', 'Customer support'],
    companyUrl: 'https://openai.com',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    company: 'OpenAI',
    type: 'Proprietary',
    category: 'LLM',
    description: 'Cost-efficient 4o-class model for high-volume workloads and tools.',
    capabilities: ['Multimodal', 'Cost-efficient', 'Fast'],
    icon: '',
    color: 'bg-emerald-100 dark:bg-emerald-900',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    features: ['Low cost', 'Good quality', 'Great for tooling'],
    useCases: ['High-volume tasks', 'Assistants', 'Agents'],
    companyUrl: 'https://openai.com',
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    company: 'OpenAI',
    type: 'Proprietary',
    category: 'LLM',
    description: 'Proven model for advanced reasoning, coding, and complex tasks.',
    capabilities: ['Reasoning', 'Coding', 'Analysis'],
    icon: '',
    color: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-600 dark:text-green-400',
    features: ['Advanced reasoning', 'Code generation', 'Robustness'],
    useCases: ['Engineering', 'Research', 'Content'],
    companyUrl: 'https://openai.com',
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    company: 'OpenAI',
    type: 'Proprietary',
    category: 'LLM',
    description: 'Fast general-purpose model still widely used for cost-sensitive flows.',
    capabilities: ['Fast', 'Conversational', 'Cost-efficient'],
    icon: '',
    color: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600 dark:text-blue-400',
    features: ['Low cost', 'Good speed', 'General-purpose'],
    useCases: ['Chat', 'Summaries', 'Automation'],
    companyUrl: 'https://openai.com',
  },

  // Anthropic
  {
    id: 'claude-4-opus',
    name: 'Claude 4 Opus',
    company: 'Anthropic',
    type: 'Proprietary',
    category: 'LLM',
    description: 'Flagship Claude with top-tier reasoning and long context.',
    capabilities: ['Reasoning', 'Safety', 'Long Context'],
    icon: '',
    color: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-600 dark:text-purple-400',
    features: ['Complex reasoning', 'Safety-first', 'Enterprise ready'],
    useCases: ['Analysis', 'Coding', 'Compliance'],
    companyUrl: 'https://www.anthropic.com/claude',
  },
  {
    id: 'claude-4-sonnet',
    name: 'Claude 4 Sonnet',
    company: 'Anthropic',
    type: 'Proprietary',
    category: 'LLM',
    description: 'Balanced Claude 4 for performance, cost, and speed.',
    capabilities: ['Balanced', 'Fast', 'Accurate'],
    icon: '',
    color: 'bg-pink-100 dark:bg-pink-900',
    textColor: 'text-pink-600 dark:text-pink-400',
    features: ['Great balance', 'Cost-effective', 'General-purpose'],
    useCases: ['Daily ops', 'Knowledge work', 'Assistants'],
    companyUrl: 'https://www.anthropic.com/claude',
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    company: 'Anthropic',
    type: 'Proprietary',
    category: 'LLM',
    description: 'Strong mid-tier model known for consistent long-form outputs.',
    capabilities: ['Balanced', 'Reliable', 'Fast'],
    icon: '',
    color: 'bg-pink-100 dark:bg-pink-900',
    textColor: 'text-pink-600 dark:text-pink-400',
    features: ['Consistent quality', 'Good speed', 'Lower cost'],
    useCases: ['Reports', 'Summaries', 'Drafting'],
    companyUrl: 'https://www.anthropic.com/claude',
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    company: 'Anthropic',
    type: 'Proprietary',
    category: 'LLM',
    description: 'Fast, efficient Claude for quick responses and real-time UIs.',
    capabilities: ['Fast', 'Efficient'],
    icon: '',
    color: 'bg-pink-100 dark:bg-pink-900',
    textColor: 'text-pink-600 dark:text-pink-400',
    features: ['Low latency', 'Cost-effective'],
    useCases: ['Realtime UIs', 'High-frequency tasks'],
    companyUrl: 'https://www.anthropic.com/claude',
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    company: 'Anthropic',
    type: 'Proprietary',
    category: 'LLM',
    description: 'Balanced Claude 3 variant for general-purpose work.',
    capabilities: ['Balanced', 'Reliable'],
    icon: '',
    color: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-600 dark:text-purple-400',
    features: ['General-purpose', 'Reliable outputs'],
    useCases: ['Docs', 'Email', 'Support'],
    companyUrl: 'https://www.anthropic.com/claude',
  },

  // Google
  {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    company: 'Google DeepMind',
    type: 'Proprietary',
    category: 'LLM',
    description: 'Native multimodal model with massive context and strong reasoning.',
    capabilities: ['Multimodal', 'Large Context', 'Reasoning'],
    icon: '',
    color: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600 dark:text-blue-400',
    features: ['1M+ tokens', 'Google ecosystem'],
    useCases: ['Workspace', 'Search workflows'],
    companyUrl: 'https://deepmind.google/technologies/gemini/',
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    company: 'Google DeepMind',
    type: 'Proprietary',
    category: 'LLM',
    description: 'Proven Gemini 1.5 model with strong multimodal understanding.',
    capabilities: ['Multimodal', 'Reasoning'],
    icon: '',
    color: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600 dark:text-blue-400',
    features: ['Long context', 'Google integration'],
    useCases: ['Docs', 'Sheets', 'Education'],
    companyUrl: 'https://deepmind.google/technologies/gemini/',
  },
  {
    id: 'gemma-3-27b',
    name: 'Gemma 3 27B',
    company: 'Google',
    type: 'Open Source',
    category: 'LLM',
    description: 'Open-weight model with strong performance and multimodal support.',
    capabilities: ['Open Source', 'Multimodal'],
    icon: '',
    color: 'bg-red-100 dark:bg-red-900',
    textColor: 'text-red-600 dark:text-red-400',
    features: ['Google-backed', 'Open weights'],
    useCases: ['Customization', 'R&D'],
    companyUrl: 'https://ai.google.dev/gemma',
  },

  // Meta
  {
    id: 'llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B Instruct',
    company: 'Meta AI',
    type: 'Open Source',
    category: 'LLM',
    description: 'Strong open-weight instruction model ideal for production and R&D.',
    capabilities: ['Open Source', 'Reasoning'],
    icon: '',
    color: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-orange-600 dark:text-orange-400',
    features: ['70B parameters', 'Great instruction following'],
    useCases: ['Fine-tuning', 'Self-hosting'],
    companyUrl: 'https://ai.meta.com/llama/',
  },

  // DeepSeek
  {
    id: 'deepseek-r1-v3',
    name: 'DeepSeek R1/V3',
    company: 'DeepSeek',
    type: 'Open Source',
    category: 'LLM',
    description: 'Open models focused on reasoning and coding with great cost efficiency.',
    capabilities: ['Reasoning', 'Coding'],
    icon: '',
    color: 'bg-indigo-100 dark:bg-indigo-900',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    features: ['Strong math/coding', 'Low cost'],
    useCases: ['Dev tools', 'Math'],
    companyUrl: 'https://www.deepseek.com/',
  },

  // Mistral
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    company: 'Mistral AI',
    type: 'Open Source',
    category: 'LLM',
    description: 'High-performance open-weight model from Mistral.',
    capabilities: ['Performance', 'Reasoning'],
    icon: '',
    color: 'bg-teal-100 dark:bg-teal-900',
    textColor: 'text-teal-600 dark:text-teal-400',
    features: ['Strong results', 'Open weights'],
    useCases: ['Apps', 'Agents'],
    companyUrl: 'https://mistral.ai/',
  },
  {
    id: 'mixtral-8x22b-instruct',
    name: 'Mixtral 8x22B Instruct',
    company: 'Mistral AI',
    type: 'Open Source',
    category: 'LLM',
    description: 'MoE model with competitive quality and efficient inference.',
    capabilities: ['MoE', 'Efficient'],
    icon: '',
    color: 'bg-teal-100 dark:bg-teal-900',
    textColor: 'text-teal-600 dark:text-teal-400',
    features: ['Mixture-of-Experts', 'Great throughput'],
    useCases: ['Scaling', 'Cost control'],
    companyUrl: 'https://mistral.ai/',
  },
  {
    id: 'mistral-small',
    name: 'Mistral Small',
    company: 'Mistral AI',
    type: 'Open Source',
    category: 'LLM',
    description: 'Lightweight model for quick, cost-efficient tasks.',
    capabilities: ['Fast', 'Lightweight'],
    icon: '',
    color: 'bg-teal-100 dark:bg-teal-900',
    textColor: 'text-teal-600 dark:text-teal-400',
    features: ['Low latency', 'Low cost'],
    useCases: ['Realtime UIs', 'Autoscaling'],
    companyUrl: 'https://mistral.ai/',
  },

  // xAI
  {
    id: 'grok-4',
    name: 'Grok 4',
    company: 'xAI',
    type: 'Proprietary',
    category: 'LLM',
    description: 'Flagship reasoning model with strong benchmark results.',
    capabilities: ['Reasoning', 'Knowledge'],
    icon: '',
    color: 'bg-cyan-100 dark:bg-cyan-900',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    features: ['Strong reasoning', 'Modern training'],
    useCases: ['Research', 'Assistants'],
    companyUrl: 'https://x.ai',
  },
  {
    id: 'grok-3-beta',
    name: 'Grok 3 Beta',
    company: 'xAI',
    type: 'Proprietary',
    category: 'LLM',
    description: 'Beta version of Grok 3 with advanced reasoning capabilities.',
    capabilities: ['Reasoning', 'Beta Features', 'Knowledge'],
    icon: '',
    color: 'bg-cyan-100 dark:bg-cyan-900',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    features: ['Beta access', 'Advanced reasoning', 'Latest features'],
    useCases: ['Beta testing', 'Research', 'Early access'],
    companyUrl: 'https://x.ai',
  },

  // Alibaba/Qwen
  {
    id: 'qwen2.5-72b-instruct',
    name: 'Qwen2.5 72B Instruct',
    company: 'Alibaba (Qwen)',
    type: 'Open Source',
    category: 'LLM',
    description: 'Open-weight model with strong instruction following and reasoning.',
    capabilities: ['Open Source', 'Instruction Following'],
    icon: '',
    color: 'bg-yellow-100 dark:bg-yellow-900',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    features: ['72B parameters', 'Strong performance'],
    useCases: ['Customization', 'Enterprise'],
    companyUrl: 'https://qwenlm.ai',
  },

  // Cohere
  {
    id: 'command-r-plus',
    name: 'Command R+',
    company: 'Cohere',
    type: 'Proprietary',
    category: 'LLM',
    description: 'Retrieval-augmented model optimized for enterprise assistants and tools.',
    capabilities: ['RAG', 'Tools', 'Reasoning'],
    icon: '',
    color: 'bg-sky-100 dark:bg-sky-900',
    textColor: 'text-sky-700 dark:text-sky-300',
    features: ['Great with retrieval', 'Tool calling'],
    useCases: ['Enterprise QA', 'Agents'],
    companyUrl: 'https://cohere.com',
  },

  // Music Generation Models
  {
    id: 'suno-v4',
    name: 'Suno v4',
    company: 'Suno AI',
    type: 'Proprietary',
    category: 'Music',
    description: 'Revolutionary AI music generation that creates complete songs with vocals.',
    capabilities: ['Music Generation', 'Vocal Synthesis', 'Song Creation'],
    icon: '',
    color: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-600 dark:text-purple-400',
    features: ['Complete songs with vocals', 'Instrumental tracks', 'Multiple genres'],
    useCases: ['Background music', 'Podcast content', 'Original compositions'],
    companyUrl: 'https://suno.ai',
  },
  {
    id: 'udio',
    name: 'Udio',
    company: 'Udio AI',
    type: 'Proprietary',
    category: 'Music',
    description: 'Advanced AI music platform with exceptional vocal synthesis technology.',
    capabilities: ['Music Generation', 'Vocal Synthesis', 'Instrumental Creation'],
    icon: '',
    color: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-orange-600 dark:text-orange-400',
    features: ['Realistic vocals', 'Song composition', 'Multiple styles'],
    useCases: ['Original songs', 'Marketing audio', 'Creative projects'],
    companyUrl: 'https://udio.ai',
  },

  // Video Generation Models
  {
    id: 'runway-gen-3',
    name: 'Runway Gen-3',
    company: 'Runway ML',
    type: 'Proprietary',
    category: 'Video',
    description: 'AI video generation and editing with advanced visual effects.',
    capabilities: ['Video Generation', 'Video Editing', 'Visual Effects'],
    icon: '',
    color: 'bg-indigo-100 dark:bg-indigo-900',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    features: ['Text-to-video', 'Video editing', 'Effects'],
    useCases: ['Marketing videos', 'Social media', 'Creative content'],
    companyUrl: 'https://runwayml.com',
  },
  {
    id: 'pika-2',
    name: 'Pika 2',
    company: 'Pika AI',
    type: 'Proprietary',
    category: 'Video',
    description: 'AI video generation platform for creating high-quality video content.',
    capabilities: ['Video Generation', 'Text-to-Video', 'Video Editing'],
    icon: '',
    color: 'bg-rose-100 dark:bg-rose-900',
    textColor: 'text-rose-600 dark:text-rose-400',
    features: ['High quality output', 'Multiple formats', 'Easy editing'],
    useCases: ['Content creation', 'Social media', 'Promotional videos'],
    companyUrl: 'https://pika.art',
  },
  {
    id: 'google-veo',
    name: 'Google Veo',
    company: 'Google DeepMind',
    type: 'Proprietary',
    category: 'Video',
    description: 'High-quality AI video generation from text prompts.',
    capabilities: ['Video Generation', 'Text-to-Video', 'High Quality'],
    icon: '',
    color: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600 dark:text-blue-400',
    features: ['High quality', 'Realistic videos', 'Advanced generation'],
    useCases: ['Creative content', 'Marketing', 'Educational videos'],
    companyUrl: 'https://deepmind.google',
  },

  // Image Generation Models
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    company: 'OpenAI',
    type: 'Proprietary',
    category: 'Image',
    description: 'Advanced text-to-image generation with high quality and accurate prompts.',
    capabilities: ['Image Generation', 'Text-to-Image', 'High Quality'],
    icon: '',
    color: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-600 dark:text-green-400',
    features: ['High quality', 'Accurate prompts', 'Safe content'],
    useCases: ['Marketing images', 'Creative content', 'Design assets'],
    companyUrl: 'https://openai.com/dall-e-3',
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    company: 'Midjourney Inc',
    type: 'Proprietary',
    category: 'Image',
    description: 'AI image generation known for artistic and creative outputs.',
    capabilities: ['Image Generation', 'Artistic Style', 'Creative Output'],
    icon: '',
    color: 'bg-violet-100 dark:bg-violet-900',
    textColor: 'text-violet-600 dark:text-violet-400',
    features: ['Artistic style', 'Creative prompts', 'High quality'],
    useCases: ['Art generation', 'Creative projects', 'Concept art'],
    companyUrl: 'https://midjourney.com',
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    company: 'Stability AI',
    type: 'Open Source',
    category: 'Image',
    description: 'Open-source AI image generation with customization capabilities.',
    capabilities: ['Image Generation', 'Open Source', 'Customizable'],
    icon: '',
    color: 'bg-slate-100 dark:bg-slate-900',
    textColor: 'text-slate-600 dark:text-slate-400',
    features: ['Open source', 'Customizable', 'Self-hosting'],
    useCases: ['Custom generation', 'Research', 'Development'],
    companyUrl: 'https://stability.ai',
  },
]

// Helper functions
export function getModelById(id: string): Model | undefined {
  return supportedModels.find((model) => model.id === id)
}

export function getModelByName(name: string): Model | undefined {
  return supportedModels.find((model) => model.name === name)
}

export function getModelIds(): string[] {
  return supportedModels.map((model) => model.id)
}

export function getModelNames(): string[] {
  return supportedModels.map((model) => model.name)
}

export function getProprietaryModels(): Model[] {
  return supportedModels.filter((model) => model.type === 'Proprietary')
}

export function getOpenSourceModels(): Model[] {
  return supportedModels.filter((model) => model.type === 'Open Source')
}

export function getModelsByCompany(): Record<string, Model[]> {
  const grouped: Record<string, Model[]> = {}
  supportedModels.forEach((model) => {
    if (!grouped[model.company]) {
      grouped[model.company] = []
    }
    grouped[model.company].push(model)
  })
  return grouped
}

export function getModelsByCategory(): Record<ModelCategory, Model[]> {
  const grouped: Record<ModelCategory, Model[]> = {
    LLM: [],
    Music: [],
    Video: [],
    Image: [],
    Voice: [],
    Code: [],
  }
  supportedModels.forEach((model) => {
    grouped[model.category].push(model)
  })
  return grouped
}

export function getModelsByCategoryArray(): Model[] {
  const grouped = getModelsByCategory()
  // Return in order: LLM, Music, Video, Image, etc.
  return [
    ...grouped.LLM,
    ...grouped.Music,
    ...grouped.Video,
    ...grouped.Image,
    ...grouped.Voice,
    ...grouped.Code,
  ]
}

export function getModelsForCategory(category: ModelCategory): Model[] {
  return supportedModels.filter((model) => model.category === category)
}
