/**
 * Prompt Audience Generator
 * 
 * Generates unique, human-sounding, SEO-optimized "Who is this for?" descriptions
 * for public prompt pages. Each description is tailored to the prompt's content,
 * tags, and model to avoid generic, repetitive copy.
 */

interface PromptContext {
  name: string
  description?: string | null
  tags?: string[]
  model: string
  promptText?: string
}

interface AudienceDescription {
  primary: string // Main "Who is this for?" text
  secondary?: string // Optional additional context
  personas: string[] // Specific user types (for badges)
  keywords: string[] // SEO keywords to emphasize
}

/**
 * Generates a unique, context-aware audience description
 */
export function generateAudienceDescription(prompt: PromptContext): AudienceDescription {
  const tags = (prompt.tags || []).map((t) => t.toLowerCase())
  const name = (prompt.name || '').toLowerCase()
  const description = (prompt.description || '').toLowerCase()
  const combined = `${name} ${description} ${tags.join(' ')}`

  // Detect personas based on comprehensive keyword analysis
  const personas = detectPersonas(combined, name, tags)
  
  // Generate primary description based on context
  const primary = generatePrimaryDescription(prompt, personas, combined)
  
  // Generate secondary context if applicable
  const secondary = generateSecondaryContext(prompt, combined)
  
  // Extract SEO keywords
  const keywords = extractKeywords(prompt, combined)

  return {
    primary,
    secondary,
    personas: personas.slice(0, 5), // Limit to 5 badges
    keywords,
  }
}

/**
 * Detects relevant personas from prompt context
 */
function detectPersonas(combined: string, name: string, tags: string[]): string[] {
  const personaMap: Record<string, string[]> = {
    'Content Creators': ['content', 'blog', 'article', 'writing', 'writer', 'creator', 'youtube', 'tiktok', 'instagram'],
    'Marketing Professionals': ['marketing', 'marketer', 'campaign', 'seo', 'social media', 'email', 'ad', 'growth'],
    'Sales Teams': ['sales', 'cold email', 'outreach', 'proposal', 'pitch', 'lead', 'prospect'],
    'Software Developers': ['code', 'developer', 'dev', 'programming', 'debug', 'api', 'function', 'algorithm'],
    'Product Managers': ['product', 'roadmap', 'feature', 'user story', 'backlog', 'sprint', 'agile'],
    'Entrepreneurs': ['startup', 'founder', 'business', 'idea', 'venture', 'pitch deck', 'fundraising'],
    'UX/UI Designers': ['design', 'ui', 'ux', 'interface', 'wireframe', 'prototype', 'figma'],
    'Data Analysts': ['data', 'analytics', 'analysis', 'sql', 'excel', 'visualization', 'metrics'],
    'HR Professionals': ['hr', 'recruiter', 'hiring', 'job description', 'interview', 'candidate'],
    'Customer Support': ['support', 'customer service', 'ticket', 'help', 'faq', 'troubleshoot'],
    'Copywriters': ['copywriting', 'copy', 'headline', 'tagline', 'ad copy', 'persuasive'],
    'Social Media Managers': ['social', 'twitter', 'linkedin', 'facebook', 'instagram', 'tiktok', 'thread'],
    'Project Managers': ['project', 'pm', 'stakeholder', 'timeline', 'milestone', 'gantt'],
    'Educators': ['teacher', 'education', 'lesson', 'curriculum', 'student', 'learning'],
    'Researchers': ['research', 'paper', 'study', 'literature review', 'methodology', 'hypothesis'],
    'Freelancers': ['freelance', 'gig', 'client', 'proposal', 'invoice', 'contract'],
    'E-commerce Sellers': ['ecommerce', 'shopify', 'product description', 'amazon', 'listing', 'store'],
    'Consultants': ['consultant', 'consulting', 'advisory', 'strategy', 'framework', 'recommendation'],
    'Video Creators': ['video', 'youtube', 'script', 'vlog', 'editing', 'storyboard'],
    'Podcast Hosts': ['podcast', 'episode', 'interview', 'audio', 'show notes'],
  }

  const detected = new Set<string>()

  for (const [persona, keywords] of Object.entries(personaMap)) {
    if (keywords.some(kw => combined.includes(kw))) {
      detected.add(persona)
    }
  }

  // If no matches, infer from name structure
  if (detected.size === 0) {
    if (name.includes('write') || name.includes('create') || name.includes('generate')) {
      detected.add('Content Creators')
    }
    if (name.includes('analyze') || name.includes('explain')) {
      detected.add('Professionals')
    }
  }

  return Array.from(detected)
}

/**
 * Generates the primary "Who is this for?" description
 */
function generatePrimaryDescription(
  prompt: PromptContext,
  personas: string[],
  combined: string,
): string {
  const name = prompt.name
  const model = prompt.model

  // Template variations for natural, unique descriptions
  const templates: ((personas: string[], name: string, model: string, combined: string) => string)[] = [
    // Professional benefit focus
    (p, n) => {
      if (p.length === 0) return `Perfect for anyone looking to ${extractAction(n)} efficiently using AI.`
      const personaList = formatPersonaList(p)
      const benefit = extractBenefit(n, combined)
      return `Designed for ${personaList} who need to ${benefit}.`
    },
    
    // Outcome focus
    (p, n) => {
      if (p.length === 0) return `Ideal for professionals seeking to ${extractAction(n)} faster and more effectively.`
      const personaList = formatPersonaList(p)
      const outcome = extractOutcome(n, combined)
      return `Built for ${personaList} looking to ${outcome}.`
    },
    
    // Time-saving focus
    (p, n) => {
      if (p.length === 0) return `A time-saving tool for ${extractAction(n)} with AI assistance.`
      const personaList = formatPersonaList(p)
      return `Essential for ${personaList} who want to save hours on ${extractTask(n, combined)}.`
    },
    
    // Quality focus
    (p, n) => {
      if (p.length === 0) return `Created for those who value quality when ${extractAction(n)}.`
      const personaList = formatPersonaList(p)
      const quality = extractQualityGoal(n, combined)
      return `Tailored for ${personaList} seeking ${quality}.`
    },
    
    // Use case focus
    (p, n) => {
      if (p.length === 0) return `Valuable for ${extractAction(n)} across various projects and workflows.`
      const personaList = formatPersonaList(p)
      const useCase = extractUseCase(n, combined)
      return `Perfect for ${personaList} working on ${useCase}.`
    },
  ]

  // Select template based on hash of prompt name (deterministic)
  const templateIndex = hashString(name) % templates.length
  const template = templates[templateIndex]
  
  return template(personas, name, model, combined)
}

/**
 * Generates optional secondary context
 */
function generateSecondaryContext(prompt: PromptContext, combined: string): string | undefined {
  const name = prompt.name.toLowerCase()
  
  // Add credibility/trust indicators
  if (combined.includes('seo') || combined.includes('optimization')) {
    return 'Optimized for search engines and modern content workflows.'
  }
  if (combined.includes('code') || combined.includes('developer')) {
    return 'Supports multiple programming languages and frameworks.'
  }
  if (combined.includes('marketing') || combined.includes('campaign')) {
    return 'Proven framework used by marketing teams worldwide.'
  }
  if (combined.includes('sales') || combined.includes('email')) {
    return 'Tested with high-performing sales teams.'
  }
  if (combined.includes('startup') || combined.includes('business')) {
    return 'Validated by entrepreneurs and business strategists.'
  }
  
  return undefined
}

/**
 * Extracts SEO keywords from prompt context
 */
function extractKeywords(prompt: PromptContext, combined: string): string[] {
  const keywords = new Set<string>()
  
  // Add model
  keywords.add(prompt.model.toLowerCase())
  
  // Add tags
  ;(prompt.tags || []).slice(0, 3).forEach(tag => keywords.add(tag.toLowerCase()))
  
  // Add action verbs
  const actionWords = ['create', 'generate', 'write', 'build', 'design', 'analyze', 'optimize', 'improve']
  actionWords.forEach(action => {
    if (combined.includes(action)) keywords.add(action)
  })
  
  return Array.from(keywords)
}

// Helper functions for description generation

function formatPersonaList(personas: string[]): string {
  if (personas.length === 0) return 'professionals'
  if (personas.length === 1) return personas[0].toLowerCase()
  if (personas.length === 2) return `${personas[0].toLowerCase()} and ${personas[1].toLowerCase()}`
  
  const last = personas[personas.length - 1]
  const others = personas.slice(0, -1)
  return `${others.map(p => p.toLowerCase()).join(', ')}, and ${last.toLowerCase()}`
}

function extractAction(name: string): string {
  const actions: Record<string, string> = {
    'create': 'create',
    'generate': 'generate',
    'write': 'write',
    'build': 'build',
    'design': 'design',
    'craft': 'craft',
    'develop': 'develop',
    'improve': 'improve',
    'optimize': 'optimize',
    'analyze': 'analyze',
  }
  
  for (const [keyword, action] of Object.entries(actions)) {
    if (name.toLowerCase().includes(keyword)) {
      return `${action} ${name.split(' ').slice(1, 4).join(' ').toLowerCase()}`.trim()
    }
  }
  
  return name.toLowerCase()
}

function extractBenefit(name: string, combined: string): string {
  if (combined.includes('faster') || combined.includes('quick')) return 'work faster without sacrificing quality'
  if (combined.includes('professional') || combined.includes('quality')) return 'deliver professional-grade results'
  if (combined.includes('scale') || combined.includes('automate')) return 'scale their operations efficiently'
  if (combined.includes('convert') || combined.includes('sales')) return 'increase conversions and close more deals'
  if (combined.includes('engage') || combined.includes('audience')) return 'engage their audience effectively'
  
  return `${extractAction(name)} more effectively`
}

function extractOutcome(name: string, combined: string): string {
  if (combined.includes('traffic') || combined.includes('seo')) return 'boost organic traffic and search rankings'
  if (combined.includes('revenue') || combined.includes('sales')) return 'drive revenue growth'
  if (combined.includes('engagement') || combined.includes('social')) return 'increase engagement and reach'
  if (combined.includes('productivity') || combined.includes('efficient')) return 'maximize productivity'
  if (combined.includes('quality') || combined.includes('professional')) return 'deliver exceptional quality'
  
  return `achieve better results with ${extractAction(name)}`
}

function extractTask(name: string, combined: string): string {
  if (combined.includes('content')) return 'content creation and publishing'
  if (combined.includes('email')) return 'email writing and campaigns'
  if (combined.includes('code') || combined.includes('development')) return 'development and debugging'
  if (combined.includes('social')) return 'social media management'
  if (combined.includes('research')) return 'research and analysis'
  
  return name.toLowerCase().replace(/^(create|generate|write|build)\s+/i, '')
}

function extractQualityGoal(name: string, combined: string): string {
  if (combined.includes('conversion') || combined.includes('persuasive')) return 'high-converting, persuasive copy'
  if (combined.includes('seo') || combined.includes('optimization')) return 'SEO-optimized, discoverable content'
  if (combined.includes('professional') || combined.includes('polished')) return 'professional, polished results'
  if (combined.includes('creative') || combined.includes('original')) return 'creative, original content'
  if (combined.includes('accurate') || combined.includes('precise')) return 'accurate, detailed outputs'
  
  return 'high-quality results'
}

function extractUseCase(name: string, combined: string): string {
  if (combined.includes('campaign') || combined.includes('launch')) return 'campaigns and product launches'
  if (combined.includes('blog') || combined.includes('article')) return 'blog posts and articles'
  if (combined.includes('social') || combined.includes('post')) return 'social media content'
  if (combined.includes('email') || combined.includes('newsletter')) return 'email marketing and newsletters'
  if (combined.includes('product') || combined.includes('description')) return 'product descriptions and listings'
  if (combined.includes('code') || combined.includes('api')) return 'software development projects'
  
  return `${name.toLowerCase()} projects`
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Generates a compelling Call-to-Action based on prompt context
 */
export function generateCTA(prompt: PromptContext): { text: string; emphasis?: string } {
  const combined = `${prompt.name} ${prompt.description || ''} ${(prompt.tags || []).join(' ')}`.toLowerCase()
  
  if (combined.includes('business') || combined.includes('startup') || combined.includes('entrepreneur')) {
    return {
      text: 'Start building your business with AI today.',
      emphasis: 'Clone this prompt and customize it for your unique needs.',
    }
  }
  
  if (combined.includes('marketing') || combined.includes('campaign') || combined.includes('ad')) {
    return {
      text: 'Take your marketing to the next level.',
      emphasis: 'Use this prompt in your next campaign to save hours and boost results.',
    }
  }
  
  if (combined.includes('code') || combined.includes('developer') || combined.includes('api')) {
    return {
      text: 'Accelerate your development workflow.',
      emphasis: 'Integrate this prompt into your coding process for faster, cleaner results.',
    }
  }
  
  if (combined.includes('content') || combined.includes('blog') || combined.includes('article')) {
    return {
      text: 'Create content that resonates.',
      emphasis: 'Try this prompt in your content workflow and watch your productivity soar.',
    }
  }
  
  if (combined.includes('sales') || combined.includes('email') || combined.includes('outreach')) {
    return {
      text: 'Close more deals with better communication.',
      emphasis: 'Use this prompt to craft personalized, high-converting messages.',
    }
  }
  
  return {
    text: 'Get started with this prompt today.',
    emphasis: 'Clone it, customize it, and make it your own.',
  }
}

