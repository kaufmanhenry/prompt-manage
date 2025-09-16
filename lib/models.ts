export interface Model {
  id: string
  name: string
  company: string
  type: 'Proprietary' | 'Open Source'
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
  {
    id: 'gpt-5',
    name: 'GPT-5',
    company: 'OpenAI',
    type: 'Proprietary',
    description:
      "OpenAI's latest and most advanced model with enhanced capabilities across all domains.",
    capabilities: [
      'Advanced Reasoning',
      'Multimodal Processing',
      'Enhanced Performance',
    ],
    icon: '🚀',
    color: 'bg-emerald-100 dark:bg-emerald-900',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    features: [
      'Enhanced reasoning and problem-solving',
      'Improved multimodal capabilities',
      'Advanced code generation',
      'Superior performance across tasks',
      'Latest AI technology',
    ],
    useCases: [
      'Advanced AI applications',
      'Complex problem solving',
      'Cutting-edge development',
    ],
    companyUrl: 'https://openai.com/gpt-5',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    company: 'OpenAI',
    type: 'Proprietary',
    description:
      'The current benchmark for multimodal capabilities, seamlessly handling text, image, audio, and video.',
    capabilities: [
      'Multimodal Processing',
      'Advanced Reasoning',
      'Real-time Knowledge',
    ],
    icon: '🤖',
    color: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-600 dark:text-green-400',
    features: [
      'Seamless text, image, audio, and video processing',
      'Advanced reasoning and problem-solving',
      'Real-time knowledge access',
      'Superior code generation and debugging',
      'Large context window for complex tasks',
    ],
    useCases: [
      'Enterprise content creation and analysis',
      'Multimodal document processing',
      'Real-time customer support automation',
    ],
    companyUrl: 'https://openai.com/gpt-4o',
  },
  {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    company: 'Google DeepMind',
    type: 'Proprietary',
    description:
      "Google's top-tier model with deep multimodal understanding, massive context window, and strong reasoning.",
    capabilities: [
      'Multimodal Understanding',
      'Massive Context',
      'Deep Reasoning',
    ],
    icon: '🧠',
    color: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600 dark:text-blue-400',
    features: [
      'Massive context window for large datasets',
      'Deep multimodal understanding',
      'Advanced reasoning capabilities',
      'Full-stack development support',
      'Integration with Google ecosystem',
    ],
    useCases: [
      'Large-scale data analysis and processing',
      'Enterprise knowledge management',
      'Complex research and development',
    ],
    companyUrl: 'https://deepmind.google/technologies/gemini/',
  },
  {
    id: 'claude-4-opus',
    name: 'Claude 4 Opus',
    company: 'Anthropic',
    type: 'Proprietary',
    description:
      "Anthropic's flagship model, excelling in complex reasoning, coding, and safety-focused applications.",
    capabilities: ['Complex Reasoning', 'Safety-focused', 'Long Context'],
    icon: '🛡️',
    color: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-600 dark:text-purple-400',
    features: [
      'Superior complex reasoning abilities',
      'Safety-focused design and outputs',
      'Long-context processing capabilities',
      'Enterprise-grade reliability',
      'Structured thinking and analysis',
    ],
    useCases: [
      'Complex business strategy and analysis',
      'Secure enterprise applications',
      'Regulatory compliance and auditing',
    ],
    companyUrl: 'https://www.anthropic.com/claude',
  },
  {
    id: 'deepseek-r1-v3',
    name: 'DeepSeek R1/V3',
    company: 'DeepSeek',
    type: 'Open Source',
    description:
      'Powerful and cost-efficient open-source model with exceptional performance in reasoning and coding.',
    capabilities: ['Strong Reasoning', 'Mathematics', 'Code Generation'],
    icon: '🔍',
    color: 'bg-indigo-100 dark:bg-indigo-900',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    features: [
      'Exceptional mathematical reasoning',
      'Superior code generation capabilities',
      'Cost-efficient operation',
      'Strong technical performance',
      'Open-source accessibility',
    ],
    useCases: [
      'Mathematical modeling and analysis',
      'Software development and debugging',
      'Technical documentation generation',
    ],
    companyUrl: 'https://www.deepseek.com/',
  },
  {
    id: 'llama-4-series',
    name: 'Llama 4 Series',
    company: 'Meta AI',
    type: 'Open Source',
    description:
      'Leading edge open-source LLMs with groundbreaking context windows and strong performance.',
    capabilities: ['Massive Context', 'Customizable', 'Research-ready'],
    icon: '🦙',
    color: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-orange-600 dark:text-orange-400',
    features: [
      'Up to 10M token context window (Scout)',
      'Fully open-source and customizable',
      'Strong performance across tasks',
      'Research and development friendly',
      'Multiple model sizes available',
    ],
    useCases: [
      'Custom enterprise AI applications',
      'Research and development projects',
      'Cost-effective AI deployment',
    ],
    companyUrl: 'https://ai.meta.com/llama/',
  },
  {
    id: 'mistral-large-mixtral',
    name: 'Mistral Large/Mixtral',
    company: 'Mistral AI',
    type: 'Open Source',
    description:
      'Renowned for punching above their weight with competitive performance and efficient architecture.',
    capabilities: [
      'Efficient Architecture',
      'MoE Design',
      'Competitive Performance',
    ],
    icon: '🌪️',
    color: 'bg-teal-100 dark:bg-teal-900',
    textColor: 'text-teal-600 dark:text-teal-400',
    features: [
      'Mixture-of-Experts (MoE) architecture',
      'Competitive performance with fewer parameters',
      'Resource-optimized operation',
      'Strong reasoning capabilities',
      'Open-source availability',
    ],
    useCases: [
      'Resource-constrained environments',
      'High-performance AI applications',
      'Cost-optimized AI solutions',
    ],
    companyUrl: 'https://mistral.ai/',
  },
  {
    id: 'gpt-4-5',
    name: 'GPT-4.5',
    company: 'OpenAI',
    type: 'Proprietary',
    description:
      'Powerful model with advanced unsupervised learning and broad knowledge for demanding text-based tasks.',
    capabilities: ['Advanced Learning', 'Broad Knowledge', 'Text Processing'],
    icon: '⚡',
    color: 'bg-yellow-100 dark:bg-yellow-900',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    features: [
      'Advanced unsupervised learning',
      'Broad knowledge base',
      'High-performance text processing',
      'Reliable for demanding tasks',
      'Proven track record',
    ],
    useCases: [
      'Knowledge-intensive applications',
      'Content creation and curation',
      'Advanced text analysis',
    ],
    companyUrl: 'https://openai.com/gpt-4',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    company: 'Anthropic',
    type: 'Proprietary',
    description:
      'Highly capable middle-ground model offering strong balance of performance, speed, and cost-efficiency.',
    capabilities: ['Balanced Performance', 'Cost-efficient', 'Fast Processing'],
    icon: '🎭',
    color: 'bg-pink-100 dark:bg-pink-900',
    textColor: 'text-pink-600 dark:text-pink-400',
    features: [
      'Balanced performance and speed',
      'Cost-efficient operation',
      'Fast processing capabilities',
      'General-purpose applications',
      'Reliable for daily use',
    ],
    useCases: [
      'Daily business operations',
      'Cost-sensitive applications',
      'General enterprise tasks',
    ],
    companyUrl: 'https://www.anthropic.com/claude',
  },
  {
    id: 'gemma-3-27b',
    name: 'Gemma 3 27B',
    company: 'Google',
    type: 'Open Source',
    description:
      'Open-source model from Google with strong performance and multimodal capabilities.',
    capabilities: ['Google Ecosystem', 'Multimodal', 'Open Source'],
    icon: '💎',
    color: 'bg-red-100 dark:bg-red-900',
    textColor: 'text-red-600 dark:text-red-400',
    features: [
      'Integration with Google AI initiatives',
      'Multimodal capabilities',
      'Open-source accessibility',
      'Strong performance',
      'Broad compatibility',
    ],
    useCases: [
      'Google ecosystem integration',
      'Multimodal content processing',
      'Accessible AI development',
    ],
    companyUrl: 'https://ai.google.dev/gemma',
  },
  {
    id: 'grok-3-beta',
    name: 'Grok 3 (Beta)',
    company: 'xAI',
    type: 'Proprietary',
    description:
      'Beta model with focus on real-time knowledge access and less restrictive guardrails.',
    capabilities: [
      'Real-time Knowledge',
      'Less Restrictive',
      'Innovative Approach',
    ],
    icon: '🚀',
    color: 'bg-cyan-100 dark:bg-cyan-900',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    features: [
      'Real-time knowledge access',
      'Less restrictive guardrails',
      'Innovative approach to AI',
      'Beta features and capabilities',
      'Potential for unique applications',
    ],
    useCases: [
      'Real-time information processing',
      'Innovative AI applications',
      'Experimental AI development',
    ],
    companyUrl: 'https://x.ai/grok',
  },
  // Legacy models for backward compatibility
  {
    id: 'gpt-4',
    name: 'GPT-4',
    company: 'OpenAI',
    type: 'Proprietary',
    description:
      'Advanced language model with strong reasoning and creative capabilities.',
    capabilities: ['Advanced Reasoning', 'Creative Writing', 'Code Generation'],
    icon: '🤖',
    color: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-600 dark:text-green-400',
    features: [
      'Advanced reasoning capabilities',
      'Creative writing and content generation',
      'Code generation and debugging',
      'Complex analysis and problem-solving',
    ],
    useCases: [
      'Creative content generation',
      'Software development support',
      'Complex problem solving',
    ],
    companyUrl: 'https://openai.com/gpt-4',
  },
  {
    id: 'gpt-3-5-turbo',
    name: 'GPT-3.5 Turbo',
    company: 'OpenAI',
    type: 'Proprietary',
    description: 'Fast and efficient model for general-purpose tasks.',
    capabilities: ['Fast Processing', 'Cost-efficient', 'General Purpose'],
    icon: '⚡',
    color: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600 dark:text-blue-400',
    features: [
      'Fast processing speed',
      'Cost-efficient operation',
      'General-purpose applications',
      'Conversational AI capabilities',
    ],
    useCases: [
      'High-volume processing',
      'Cost-sensitive applications',
      'General business tasks',
    ],
    companyUrl: 'https://openai.com/gpt-3-5-turbo',
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    company: 'Anthropic',
    type: 'Proprietary',
    description: 'Balanced model offering strong performance and reliability.',
    capabilities: ['Balanced Performance', 'Reliability', 'Safety-focused'],
    icon: '🛡️',
    color: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-600 dark:text-purple-400',
    features: [
      'Balanced performance and speed',
      'High reliability and consistency',
      'Safety-focused design',
      'General-purpose applications',
    ],
    useCases: [
      'Reliable business applications',
      'Safety-critical operations',
      'General enterprise use',
    ],
    companyUrl: 'https://www.anthropic.com/claude',
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    company: 'Anthropic',
    type: 'Proprietary',
    description: 'Fast and efficient model for quick tasks and responses.',
    capabilities: ['Fast Processing', 'Efficient', 'Quick Responses'],
    icon: '🎭',
    color: 'bg-pink-100 dark:bg-pink-900',
    textColor: 'text-pink-600 dark:text-pink-400',
    features: [
      'Very fast processing speed',
      'Cost-effective operation',
      'Quick response generation',
      'Efficient resource usage',
      'Ideal for real-time applications',
    ],
    useCases: [
      'Real-time applications',
      'High-frequency processing',
      'Cost-optimized operations',
    ],
    companyUrl: 'https://www.anthropic.com/claude',
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    company: 'Google DeepMind',
    type: 'Proprietary',
    description:
      "Google's advanced language model with strong reasoning capabilities.",
    capabilities: ['Advanced Reasoning', 'Multimodal', 'Google Ecosystem'],
    icon: '🧠',
    color: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600 dark:text-blue-400',
    features: [
      'Advanced reasoning capabilities',
      'Multimodal understanding',
      'Integration with Google services',
      'Code generation and analysis',
    ],
    useCases: [
      'Google ecosystem integration',
      'Multimodal business applications',
      'Advanced reasoning tasks',
    ],
    companyUrl: 'https://deepmind.google/technologies/gemini/',
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    company: 'Mistral AI',
    type: 'Open Source',
    description: 'High-performance model with efficient architecture.',
    capabilities: [
      'High Performance',
      'Efficient Architecture',
      'Strong Reasoning',
    ],
    icon: '🌪️',
    color: 'bg-teal-100 dark:bg-teal-900',
    textColor: 'text-teal-600 dark:text-teal-400',
    features: [
      'High performance across tasks',
      'Efficient architecture design',
      'Open-source availability',
      'Strong reasoning capabilities',
    ],
    useCases: [
      'High-performance AI applications',
      'Resource-efficient deployments',
      'Advanced reasoning tasks',
    ],
    companyUrl: 'https://mistral.ai/',
  },
  {
    id: 'mistral-medium',
    name: 'Mistral Medium',
    company: 'Mistral AI',
    type: 'Open Source',
    description: 'Balanced model offering good performance and efficiency.',
    capabilities: ['Balanced Performance', 'Efficient', 'General Purpose'],
    icon: '🌪️',
    color: 'bg-teal-100 dark:bg-teal-900',
    textColor: 'text-teal-600 dark:text-teal-400',
    features: [
      'Balanced performance and speed',
      'Efficient operation',
      'Open-source availability',
      'General-purpose applications',
    ],
    useCases: [
      'Balanced business applications',
      'Efficient resource utilization',
      'General enterprise tasks',
    ],
    companyUrl: 'https://mistral.ai/',
  },
  {
    id: 'mistral-small',
    name: 'Mistral Small',
    company: 'Mistral AI',
    type: 'Open Source',
    description: 'Fast and lightweight model for quick tasks.',
    capabilities: ['Fast Processing', 'Lightweight', 'Quick Responses'],
    icon: '🌪️',
    color: 'bg-teal-100 dark:bg-teal-900',
    textColor: 'text-teal-600 dark:text-teal-400',
    features: [
      'Fast processing speed',
      'Lightweight architecture',
      'Open-source availability',
      'Quick response generation',
    ],
    useCases: [
      'Fast response applications',
      'Resource-constrained environments',
      'Quick task processing',
    ],
    companyUrl: 'https://mistral.ai/',
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
