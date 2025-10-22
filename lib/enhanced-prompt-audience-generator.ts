/**
 * Enhanced Prompt Audience Generator
 * 
 * This is a significantly improved version that uses AI-powered analysis
 * to generate accurate, contextual, and SEO-optimized audience descriptions.
 * 
 * Key improvements:
 * - AI-powered content analysis using OpenAI/Claude
 * - Industry-specific audience detection
 * - Skill level assessment (beginner, intermediate, advanced)
 * - Use case analysis and context extraction
 * - SEO-optimized descriptions with natural language
 * - Scalable persona categorization
 * - Confidence scoring for accuracy
 */

import OpenAI from 'openai'

interface PromptContext {
  name: string
  description?: string | null
  tags?: string[]
  model: string
  promptText?: string
}

interface EnhancedAudienceDescription {
  primary: string
  secondary?: string
  personas: PersonaInfo[]
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'mixed'
  industry?: string
  useCases: string[]
  keywords: string[]
  confidence: number // 0-100, how confident we are in this analysis
  seoMetadata: SEOMetadata
}

interface PersonaInfo {
  name: string
  confidence: number
  reasoning: string
  specificUseCase?: string
}

interface SEOMetadata {
  primaryKeywords: string[]
  longTailKeywords: string[]
  semanticKeywords: string[]
  intentKeywords: string[]
}

// Industry-specific persona mappings with more granular detection
const INDUSTRY_PERSONAS = {
  'Technology & Software': {
    'Software Engineers': ['backend', 'frontend', 'full-stack', 'mobile', 'web', 'api', 'microservices', 'devops', 'cloud', 'kubernetes', 'docker'],
    'Data Scientists': ['machine learning', 'ai', 'ml', 'data science', 'analytics', 'python', 'r', 'tensorflow', 'pytorch', 'jupyter'],
    'DevOps Engineers': ['deployment', 'ci/cd', 'infrastructure', 'monitoring', 'scaling', 'aws', 'azure', 'gcp', 'terraform'],
    'Product Managers': ['product strategy', 'roadmap', 'user stories', 'agile', 'scrum', 'kanban', 'metrics', 'analytics'],
    'UX/UI Designers': ['user experience', 'interface design', 'wireframing', 'prototyping', 'figma', 'sketch', 'usability'],
    'QA Engineers': ['testing', 'quality assurance', 'automation', 'selenium', 'cypress', 'bug tracking', 'test cases'],
    'Security Engineers': ['cybersecurity', 'penetration testing', 'vulnerability', 'compliance', 'encryption', 'authentication'],
    'Technical Writers': ['documentation', 'api docs', 'technical writing', 'user guides', 'tutorials', 'knowledge base']
  },
  'Marketing & Sales': {
    'Digital Marketers': ['seo', 'sem', 'ppc', 'google ads', 'facebook ads', 'social media marketing', 'content marketing'],
    'Content Creators': ['blog writing', 'article writing', 'copywriting', 'social media content', 'video scripts', 'podcast scripts'],
    'Email Marketers': ['email campaigns', 'newsletter', 'automation', 'segmentation', 'a/b testing', 'deliverability'],
    'SEO Specialists': ['search engine optimization', 'keyword research', 'link building', 'technical seo', 'local seo'],
    'Social Media Managers': ['instagram', 'tiktok', 'twitter', 'linkedin', 'facebook', 'youtube', 'community management'],
    'Sales Professionals': ['cold outreach', 'lead generation', 'prospecting', 'sales scripts', 'pitch decks', 'crm'],
    'Growth Hackers': ['user acquisition', 'retention', 'conversion optimization', 'funnel analysis', 'experimentation'],
    'Brand Managers': ['brand strategy', 'brand voice', 'brand guidelines', 'reputation management', 'crisis communication']
  },
  'Business & Operations': {
    'Business Analysts': ['requirements', 'process improvement', 'data analysis', 'stakeholder management', 'documentation'],
    'Project Managers': ['project planning', 'timeline management', 'resource allocation', 'risk management', 'reporting'],
    'Operations Managers': ['process optimization', 'supply chain', 'logistics', 'efficiency', 'cost reduction'],
    'HR Professionals': ['recruitment', 'employee relations', 'performance management', 'training', 'compliance'],
    'Financial Analysts': ['financial modeling', 'budgeting', 'forecasting', 'investment analysis', 'reporting'],
    'Consultants': ['strategy consulting', 'management consulting', 'process improvement', 'change management'],
    'Entrepreneurs': ['startup', 'business planning', 'fundraising', 'pitch decks', 'market research', 'mvp'],
    'Executives': ['strategic planning', 'leadership', 'decision making', 'board presentations', 'stakeholder management']
  },
  'Creative & Media': {
    'Writers & Authors': ['creative writing', 'fiction', 'non-fiction', 'blogging', 'journalism', 'editing'],
    'Video Creators': ['youtube', 'video editing', 'scriptwriting', 'storyboarding', 'production', 'post-production'],
    'Podcasters': ['podcast production', 'interviewing', 'audio editing', 'show notes', 'distribution'],
    'Graphic Designers': ['visual design', 'branding', 'logo design', 'print design', 'digital design'],
    'Photographers': ['photography', 'photo editing', 'lightroom', 'photoshop', 'portrait', 'landscape'],
    'Musicians': ['music production', 'songwriting', 'audio engineering', 'mixing', 'mastering'],
    'Game Developers': ['game design', 'unity', 'unreal engine', 'character design', 'level design'],
    'Animators': ['2d animation', '3d animation', 'motion graphics', 'character animation', 'storyboarding']
  },
  'Education & Research': {
    'Teachers & Educators': ['lesson planning', 'curriculum development', 'student assessment', 'classroom management'],
    'Researchers': ['academic research', 'data collection', 'statistical analysis', 'literature review', 'methodology'],
    'Students': ['study guides', 'essay writing', 'research papers', 'presentations', 'exam preparation'],
    'Training Professionals': ['corporate training', 'workshop design', 'learning materials', 'assessment'],
    'Curriculum Developers': ['educational content', 'learning objectives', 'assessment design', 'pedagogy'],
    'Academic Writers': ['research papers', 'thesis writing', 'grant proposals', 'peer review', 'publication']
  },
  'Healthcare & Science': {
    'Medical Professionals': ['patient care', 'diagnosis', 'treatment planning', 'medical documentation'],
    'Researchers': ['clinical research', 'data analysis', 'study design', 'regulatory compliance'],
    'Healthcare Administrators': ['healthcare management', 'policy development', 'quality improvement'],
    'Scientists': ['laboratory research', 'data analysis', 'experimental design', 'publication'],
    'Pharmacists': ['medication management', 'drug interactions', 'patient counseling', 'inventory management'],
    'Nurses': ['patient care', 'documentation', 'care planning', 'health education']
  },
  'Finance & Legal': {
    'Financial Advisors': ['investment planning', 'portfolio management', 'risk assessment', 'client consultation'],
    'Accountants': ['bookkeeping', 'tax preparation', 'financial reporting', 'auditing', 'compliance'],
    'Lawyers': ['legal research', 'case analysis', 'document drafting', 'client consultation'],
    'Compliance Officers': ['regulatory compliance', 'risk management', 'policy development', 'auditing'],
    'Investment Bankers': ['financial modeling', 'due diligence', 'deal structuring', 'presentations'],
    'Insurance Professionals': ['risk assessment', 'policy development', 'claims processing', 'underwriting']
  },
  'E-commerce & Retail': {
    'E-commerce Managers': ['online store management', 'product listings', 'inventory management', 'customer service'],
    'Digital Merchandisers': ['product merchandising', 'catalog management', 'pricing strategy', 'promotions'],
    'Supply Chain Managers': ['inventory optimization', 'supplier management', 'logistics', 'cost reduction'],
    'Customer Service': ['customer support', 'ticket management', 'live chat', 'faq management'],
    'Retail Managers': ['store operations', 'staff management', 'inventory control', 'customer experience']
  }
}

// Skill level indicators
const SKILL_LEVEL_INDICATORS = {
  beginner: [
    'basic', 'simple', 'easy', 'introduction', 'getting started', 'beginner', 'novice',
    'step-by-step', 'tutorial', 'guide', 'how to', 'learn', 'understand', 'explain'
  ],
  intermediate: [
    'intermediate', 'advanced', 'professional', 'optimize', 'improve', 'enhance',
    'best practices', 'techniques', 'strategies', 'workflow', 'process', 'methodology'
  ],
  advanced: [
    'expert', 'master', 'complex', 'sophisticated', 'enterprise', 'scalable',
    'architecture', 'framework', 'system design', 'performance', 'optimization',
    'automation', 'integration', 'custom', 'specialized'
  ]
}

/**
 * Main function to generate enhanced audience description
 */
export async function generateEnhancedAudienceDescription(
  prompt: PromptContext,
  options: {
    useAI?: boolean
    apiKey?: string
    model?: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3'
  } = {}
): Promise<EnhancedAudienceDescription> {
  const { useAI = true, apiKey, model = 'gpt-4' } = options

  if (useAI && apiKey) {
    return await generateAIAudienceDescription(prompt, apiKey, model)
  }

  // Fallback to enhanced rule-based system
  return generateRuleBasedAudienceDescription(prompt)
}

/**
 * AI-powered audience analysis using OpenAI/Claude
 */
async function generateAIAudienceDescription(
  prompt: PromptContext,
  apiKey: string,
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3'
): Promise<EnhancedAudienceDescription> {
  const openai = new OpenAI({ apiKey })

  const systemPrompt = `You are an expert at analyzing AI prompts and determining their target audience. 
Analyze the following prompt and provide a detailed audience analysis.

Return a JSON response with this exact structure:
{
  "primary": "Main audience description (1-2 sentences, natural and engaging)",
  "secondary": "Optional additional context or credibility indicator",
  "personas": [
    {
      "name": "Specific role/title",
      "confidence": 85,
      "reasoning": "Why this persona fits",
      "specificUseCase": "Specific use case for this persona"
    }
  ],
  "skillLevel": "beginner|intermediate|advanced|mixed",
  "industry": "Primary industry or domain",
  "useCases": ["Specific use case 1", "Specific use case 2"],
  "keywords": ["keyword1", "keyword2"],
  "confidence": 90,
  "seoMetadata": {
    "primaryKeywords": ["main keyword", "secondary keyword"],
    "longTailKeywords": ["long tail phrase 1", "long tail phrase 2"],
    "semanticKeywords": ["related term 1", "related term 2"],
    "intentKeywords": ["action word 1", "action word 2"]
  }
}

Guidelines:
- Be specific and accurate, not generic
- Focus on the actual content and purpose of the prompt
- Consider skill level required to use this prompt effectively
- Identify specific industries and roles that would benefit
- Use natural, engaging language for descriptions
- Include SEO-relevant keywords naturally
- Provide confidence scores (0-100) for accuracy
- Limit personas to 3-5 most relevant ones
- Make descriptions unique and contextual`

  const userPrompt = `Analyze this AI prompt:

Name: ${prompt.name}
Description: ${prompt.description || 'No description provided'}
Tags: ${(prompt.tags || []).join(', ')}
Model: ${prompt.model}
Prompt Text: ${prompt.promptText || 'No prompt text provided'}`

  try {
    const response = await openai.chat.completions.create({
      model: model === 'claude-3' ? 'gpt-4' : model, // Fallback for now
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1000
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // Parse JSON response
    const parsed = JSON.parse(content)
    
    // Validate and enhance the response
    return {
      primary: parsed.primary || 'Professional tool for enhanced productivity',
      secondary: parsed.secondary,
      personas: parsed.personas || [],
      skillLevel: parsed.skillLevel || 'intermediate',
      industry: parsed.industry,
      useCases: parsed.useCases || [],
      keywords: parsed.keywords || [],
      confidence: parsed.confidence || 75,
      seoMetadata: parsed.seoMetadata || {
        primaryKeywords: [],
        longTailKeywords: [],
        semanticKeywords: [],
        intentKeywords: []
      }
    }
  } catch (error) {
    console.error('AI audience analysis failed:', error)
    // Fallback to rule-based system
    return generateRuleBasedAudienceDescription(prompt)
  }
}

/**
 * Enhanced rule-based audience analysis (fallback)
 */
function generateRuleBasedAudienceDescription(prompt: PromptContext): EnhancedAudienceDescription {
  const combined = `${prompt.name} ${prompt.description || ''} ${(prompt.tags || []).join(' ')} ${prompt.promptText || ''}`.toLowerCase()
  
  // Detect industry and personas
  const { industry, personas } = detectIndustryAndPersonas(combined, prompt.name)
  
  // Determine skill level
  const skillLevel = detectSkillLevel(combined, prompt.name)
  
  // Generate descriptions
  const primary = generateContextualDescription(prompt, personas, industry, skillLevel)
  const secondary = generateSecondaryContext(prompt, industry, skillLevel)
  
  // Extract use cases
  const useCases = extractUseCases(prompt, combined)
  
  // Generate SEO metadata
  const seoMetadata = generateSEOMetadata(prompt, industry, personas)
  
  return {
    primary,
    secondary,
    personas: personas.map(p => ({
      name: p.name,
      confidence: p.confidence,
      reasoning: p.reasoning,
      specificUseCase: p.specificUseCase
    })),
    skillLevel,
    industry,
    useCases,
    keywords: seoMetadata.primaryKeywords,
    confidence: calculateOverallConfidence(personas, industry),
    seoMetadata
  }
}

/**
 * Detect industry and personas with enhanced accuracy
 */
function detectIndustryAndPersonas(combined: string, name: string): { industry: string, personas: PersonaInfo[] } {
  const detectedPersonas: PersonaInfo[] = []
  let primaryIndustry = 'General'

  // Check each industry
  for (const [industry, roles] of Object.entries(INDUSTRY_PERSONAS)) {
    for (const [role, keywords] of Object.entries(roles)) {
      const matches = keywords.filter(keyword => 
        combined.includes(keyword.toLowerCase()) || 
        name.toLowerCase().includes(keyword.toLowerCase())
      )
      
      if (matches.length > 0) {
        const confidence = Math.min(95, 60 + (matches.length * 10))
        detectedPersonas.push({
          name: role,
          confidence,
          reasoning: `Detected keywords: ${matches.join(', ')}`,
          specificUseCase: generateSpecificUseCase(role, matches[0])
        })
        
        if (confidence > 80) {
          primaryIndustry = industry
        }
      }
    }
  }

  // If no industry detected, try broader patterns
  if (detectedPersonas.length === 0) {
    const fallbackPersonas = detectFallbackPersonas(combined, name)
    detectedPersonas.push(...fallbackPersonas)
  }

  return {
    industry: primaryIndustry,
    personas: detectedPersonas.slice(0, 5) // Limit to top 5
  }
}

/**
 * Detect skill level required
 */
function detectSkillLevel(combined: string, name: string): 'beginner' | 'intermediate' | 'advanced' | 'mixed' {
  const beginnerMatches = SKILL_LEVEL_INDICATORS.beginner.filter(indicator => 
    combined.includes(indicator) || name.toLowerCase().includes(indicator)
  ).length
  
  const intermediateMatches = SKILL_LEVEL_INDICATORS.intermediate.filter(indicator => 
    combined.includes(indicator) || name.toLowerCase().includes(indicator)
  ).length
  
  const advancedMatches = SKILL_LEVEL_INDICATORS.advanced.filter(indicator => 
    combined.includes(indicator) || name.toLowerCase().includes(indicator)
  ).length

  const totalMatches = beginnerMatches + intermediateMatches + advancedMatches
  
  if (totalMatches === 0) return 'intermediate' // Default
  
  if (beginnerMatches > intermediateMatches && beginnerMatches > advancedMatches) {
    return 'beginner'
  } else if (advancedMatches > intermediateMatches && advancedMatches > beginnerMatches) {
    return 'advanced'
  } else if (beginnerMatches > 0 && advancedMatches > 0) {
    return 'mixed'
  } else {
    return 'intermediate'
  }
}

/**
 * Generate contextual description based on analysis
 */
function generateContextualDescription(
  prompt: PromptContext,
  personas: PersonaInfo[],
  industry: string,
  skillLevel: string
): string {
  const templates = [
    // Industry-focused
    (p, ind, skill) => {
      if (personas.length === 0) return `Essential for ${ind.toLowerCase()} professionals seeking to ${extractAction(prompt.name)} more effectively.`
      const personaList = formatPersonaList(personas.map(p => p.name))
      return `Designed for ${personaList} in ${ind.toLowerCase()} who need to ${extractAction(prompt.name)} with ${skill} expertise.`
    },
    
    // Skill-level focused
    (p, ind, skill) => {
      if (personas.length === 0) return `Perfect for ${skill} users looking to ${extractAction(prompt.name)} efficiently.`
      const personaList = formatPersonaList(personas.map(p => p.name))
      return `Tailored for ${skill} ${personaList} who want to ${extractAction(prompt.name)} professionally.`
    },
    
    // Use-case focused
    (p, ind, skill) => {
      if (personas.length === 0) return `Ideal for professionals working on ${extractUseCase(prompt.name)} projects.`
      const personaList = formatPersonaList(personas.map(p => p.name))
      return `Built for ${personaList} handling ${extractUseCase(prompt.name)} workflows.`
    },
    
    // Benefit-focused
    (p, ind, skill) => {
      if (personas.length === 0) return `Created for teams that value efficiency when ${extractAction(prompt.name)}.`
      const personaList = formatPersonaList(personas.map(p => p.name))
      return `Essential for ${personaList} who need to ${extractBenefit(prompt.name)} faster.`
    }
  ]

  const templateIndex = hashString(prompt.name) % templates.length
  return templates[templateIndex](prompt, industry, skillLevel)
}

/**
 * Generate secondary context with credibility indicators
 */
function generateSecondaryContext(
  prompt: PromptContext,
  industry: string,
  skillLevel: string
): string | undefined {
  const contexts = [
    `Optimized for ${industry.toLowerCase()} workflows and best practices.`,
    `Supports ${skillLevel}-level users with comprehensive guidance.`,
    `Proven effective in professional ${industry.toLowerCase()} environments.`,
    `Designed with ${industry.toLowerCase()} standards and requirements in mind.`,
    `Tested and validated by ${industry.toLowerCase()} professionals.`
  ]

  // Return context based on hash for consistency
  const contextIndex = hashString(prompt.name) % contexts.length
  return contexts[contextIndex]
}

/**
 * Extract specific use cases from prompt
 */
function extractUseCases(prompt: PromptContext, combined: string): string[] {
  const useCasePatterns = [
    { pattern: /campaign|marketing campaign/i, useCase: 'Marketing campaigns' },
    { pattern: /blog|article|content/i, useCase: 'Content creation' },
    { pattern: /email|newsletter/i, useCase: 'Email marketing' },
    { pattern: /social media|social/i, useCase: 'Social media management' },
    { pattern: /code|development|programming/i, useCase: 'Software development' },
    { pattern: /analysis|analytics|data/i, useCase: 'Data analysis' },
    { pattern: /design|ui|ux/i, useCase: 'Design projects' },
    { pattern: /sales|outreach|prospecting/i, useCase: 'Sales activities' },
    { pattern: /research|study/i, useCase: 'Research projects' },
    { pattern: /presentation|pitch/i, useCase: 'Presentations and pitches' }
  ]

  const useCases: string[] = []
  useCasePatterns.forEach(({ pattern, useCase }) => {
    if (pattern.test(combined)) {
      useCases.push(useCase)
    }
  })

  return useCases.slice(0, 3) // Limit to 3 use cases
}

/**
 * Generate comprehensive SEO metadata
 */
function generateSEOMetadata(
  prompt: PromptContext,
  industry: string,
  personas: PersonaInfo[]
): SEOMetadata {
  const primaryKeywords = [
    prompt.model.toLowerCase(),
    ...(prompt.tags || []).slice(0, 3),
    extractAction(prompt.name)
  ]

  const longTailKeywords = [
    `${prompt.model} prompt for ${industry.toLowerCase()}`,
    `${extractAction(prompt.name)} ${prompt.model} template`,
    `${industry.toLowerCase()} ${extractAction(prompt.name)} prompt`
  ]

  const semanticKeywords = [
    'AI prompt',
    'artificial intelligence',
    'automation',
    'productivity',
    'workflow',
    'template',
    'guide'
  ]

  const intentKeywords = [
    'create',
    'generate',
    'build',
    'design',
    'analyze',
    'optimize',
    'improve'
  ]

  return {
    primaryKeywords: [...new Set(primaryKeywords)],
    longTailKeywords: [...new Set(longTailKeywords)],
    semanticKeywords: [...new Set(semanticKeywords)],
    intentKeywords: [...new Set(intentKeywords)]
  }
}

// Helper functions
function detectFallbackPersonas(combined: string, name: string): PersonaInfo[] {
  const fallbackMap = {
    'Content Creators': ['write', 'create', 'generate', 'content', 'blog', 'article'],
    'Marketing Professionals': ['marketing', 'campaign', 'promotion', 'advertising'],
    'Business Professionals': ['business', 'strategy', 'planning', 'analysis'],
    'Developers': ['code', 'development', 'programming', 'technical'],
    'Educators': ['teach', 'education', 'learning', 'tutorial', 'guide']
  }

  const detected: PersonaInfo[] = []
  for (const [persona, keywords] of Object.entries(fallbackMap)) {
    const matches = keywords.filter(keyword => 
      combined.includes(keyword) || name.toLowerCase().includes(keyword)
    )
    if (matches.length > 0) {
      detected.push({
        name: persona,
        confidence: 70,
        reasoning: `Detected general keywords: ${matches.join(', ')}`,
        specificUseCase: generateSpecificUseCase(persona, matches[0])
      })
    }
  }

  return detected.slice(0, 3)
}

function generateSpecificUseCase(persona: string, keyword: string): string {
  const useCaseMap: Record<string, Record<string, string>> = {
    'Content Creators': {
      'write': 'blog posts and articles',
      'create': 'engaging content',
      'generate': 'fresh content ideas'
    },
    'Marketing Professionals': {
      'campaign': 'marketing campaigns',
      'promotion': 'promotional materials',
      'advertising': 'ad copy and campaigns'
    },
    'Developers': {
      'code': 'code generation and debugging',
      'development': 'software development',
      'programming': 'programming tasks'
    }
  }

  return useCaseMap[persona]?.[keyword] || `${keyword} tasks`
}

function formatPersonaList(personas: string[]): string {
  if (personas.length === 0) return 'professionals'
  if (personas.length === 1) return personas[0].toLowerCase()
  if (personas.length === 2) return `${personas[0].toLowerCase()} and ${personas[1].toLowerCase()}`
  
  const last = personas[personas.length - 1]
  const others = personas.slice(0, -1)
  return `${others.map(p => p.toLowerCase()).join(', ')}, and ${last.toLowerCase()}`
}

function extractAction(name: string): string {
  const actions = ['create', 'generate', 'write', 'build', 'design', 'analyze', 'optimize', 'improve']
  for (const action of actions) {
    if (name.toLowerCase().includes(action)) {
      return action
    }
  }
  return 'work with'
}

function extractBenefit(name: string): string {
  if (name.toLowerCase().includes('faster') || name.toLowerCase().includes('quick')) {
    return 'work faster without sacrificing quality'
  }
  if (name.toLowerCase().includes('professional') || name.toLowerCase().includes('quality')) {
    return 'deliver professional-grade results'
  }
  if (name.toLowerCase().includes('scale') || name.toLowerCase().includes('automate')) {
    return 'scale their operations efficiently'
  }
  return `${extractAction(name)} more effectively`
}

function extractUseCase(name: string): string {
  if (name.toLowerCase().includes('campaign')) return 'campaign management'
  if (name.toLowerCase().includes('blog') || name.toLowerCase().includes('article')) return 'content creation'
  if (name.toLowerCase().includes('email')) return 'email marketing'
  if (name.toLowerCase().includes('social')) return 'social media management'
  if (name.toLowerCase().includes('code') || name.toLowerCase().includes('development')) return 'software development'
  if (name.toLowerCase().includes('analysis') || name.toLowerCase().includes('data')) return 'data analysis'
  return `${extractAction(name)} projects`
}

function calculateOverallConfidence(personas: PersonaInfo[], industry: string): number {
  if (personas.length === 0) return 50
  
  const avgPersonaConfidence = personas.reduce((sum, p) => sum + p.confidence, 0) / personas.length
  const industryBonus = industry !== 'General' ? 10 : 0
  
  return Math.min(95, Math.round(avgPersonaConfidence + industryBonus))
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

/**
 * Generate enhanced CTA based on audience analysis
 */
export function generateEnhancedCTA(audience: EnhancedAudienceDescription): { text: string; emphasis?: string } {
  const { industry, skillLevel, personas } = audience
  
  if (industry === 'Technology & Software') {
    return {
      text: 'Accelerate your development workflow.',
      emphasis: 'Integrate this prompt into your coding process for faster, cleaner results.'
    }
  }
  
  if (industry === 'Marketing & Sales') {
    return {
      text: 'Take your marketing to the next level.',
      emphasis: 'Use this prompt in your next campaign to save hours and boost results.'
    }
  }
  
  if (skillLevel === 'beginner') {
    return {
      text: 'Get started with confidence.',
      emphasis: 'This prompt is designed to guide you through the process step-by-step.'
    }
  }
  
  if (skillLevel === 'advanced') {
    return {
      text: 'Optimize your professional workflow.',
      emphasis: 'Built for experts who demand precision and efficiency.'
    }
  }
  
  return {
    text: 'Enhance your productivity today.',
    emphasis: 'Clone this prompt and customize it for your specific needs.'
  }
}
