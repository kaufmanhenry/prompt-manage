import OpenAI from 'openai'

import { createClient } from '@/utils/supabase/server'

import { agentConfigCache } from './agent-config-cache'
import { type QualityConfig,QualityControlService } from './quality-control-service'
import { withRetry } from './retry-utils'

// Agent strategies and their configurations
export interface AgentConfig {
  strategy: 'trending' | 'niche' | 'educational' | 'seasonal'
  topics?: string[]
  industries?: string[]
  subjects?: string[]
  events?: string[]
  frequency: string
}

export interface AgentGeneration {
  name: string
  description: string
  prompt_text: string
  model: string
  tags: string[]
  strategy_context: string
  quality_score: number
}

export class AutonomousAgent {
  private openai: OpenAI
  private supabase: ReturnType<typeof createClient>
  private agentId: string
  private qualityService: QualityControlService | null = null

  constructor(agentId: string) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    this.supabase = createClient()
    this.agentId = agentId
  }

  // Main generation method
  async generatePrompt(): Promise<AgentGeneration | null> {
    try {
      const agent = await this.getAgentConfig()
      if (!agent) return null

      // Initialize quality service once per generation
      this.qualityService = new QualityControlService({
        brand_guidelines: agent.brand_guidelines as QualityConfig['brand_guidelines'],
        quality_standards: agent.quality_standards as QualityConfig['quality_standards'],
        required_elements: agent.required_elements as QualityConfig['required_elements'],
        key_phrases: agent.key_phrases as string[],
        forbidden_phrases: agent.forbidden_phrases as string[],
        style_guide: agent.style_guide as string,
        examples: agent.examples as QualityConfig['examples']
      })

      const strategy = agent.strategy
      const outputType = (agent.output_type as string) || 'prompt'
      const tone = (agent.tone as string) || 'professional'
      const targetAudience = (agent.target_audience as string) || 'general users'
      const lengthPreference = (agent.length_preference as string) || 'medium'
      
      let generation: AgentGeneration

      // Generate based on output type if not a standard prompt
      if (outputType !== 'prompt') {
        generation = await this.generateCustomOutput(agent, outputType, tone, targetAudience, lengthPreference)
      } else {
        // Standard prompt generation by strategy
        switch (strategy) {
          case 'trending':
            generation = await this.generateTrendingPrompt(agent)
            break
          case 'niche':
            generation = await this.generateNichePrompt(agent)
            break
          case 'educational':
            generation = await this.generateEducationalPrompt(agent)
            break
          case 'seasonal':
            generation = await this.generateSeasonalPrompt(agent)
            break
          default:
            throw new Error(`Unknown strategy: ${String(strategy)}`)
        }
      }

      // Score the generation quality
      generation.quality_score = await this.scorePrompt(generation)

      return generation
    } catch (error) {
      console.error('Agent generation error:', error)
      return null
    }
  }

  // Generate custom output types (blog posts, docs, emails, etc.)
  private async generateCustomOutput(
    agent: AgentConfig & { topics?: string[]; industries?: string[]; subjects?: string[]; }, 
    outputType: string, 
    tone: string, 
    targetAudience: string,
    lengthPreference: string
  ): Promise<AgentGeneration> {
    const topics = agent.topics || agent.industries || agent.subjects || ['general']
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]
    
    let systemPrompt = ''
    let userPrompt = ''
    let maxTokens = 500
    let name = ''
    let description = ''
    let tags: string[] = []

    // Get pre-built quality instructions from service (cached, optimized)
    const qualityInstructions = this.qualityService?.getQualityInstructions() || ''

    switch (outputType) {
      case 'blog_post':
        maxTokens = lengthPreference === 'comprehensive' ? 1500 : lengthPreference === 'detailed' ? 1000 : 600
        systemPrompt = `You are an expert blog writer creating SEO-optimized content for ${targetAudience}. Write in a ${tone} tone.${qualityInstructions}`
        userPrompt = `Create a complete blog post about ${randomTopic}. Include:
        - Compelling headline
        - Introduction hook
        - 3-5 main sections with subheadings
        - Practical examples
        - Conclusion with call-to-action
        - SEO keywords
        Target audience: ${targetAudience}
        Length: ${lengthPreference === 'comprehensive' ? '1200-1500 words' : lengthPreference === 'detailed' ? '800-1000 words' : '500-700 words'}
        
        IMPORTANT: Follow all brand guidelines, style rules, and quality standards provided above.`
        name = `${randomTopic} Blog Post`
        description = `Complete blog post about ${randomTopic} for ${targetAudience}`
        tags = [randomTopic.toLowerCase(), 'blog', 'content']
        break

      case 'documentation':
        maxTokens = 800
        systemPrompt = `You are a technical documentation expert writing for ${targetAudience}. Be clear, precise, and ${tone}.${qualityInstructions}`
        userPrompt = `Create technical documentation for ${randomTopic}. Include:
        - Overview and purpose
        - Prerequisites
        - Step-by-step instructions
        - Code examples (if applicable)
        - Common issues and troubleshooting
        - Best practices
        Target audience: ${targetAudience}`
        name = `${randomTopic} Documentation`
        description = `Technical documentation for ${randomTopic}`
        tags = [randomTopic.toLowerCase(), 'documentation', 'technical']
        break

      case 'email':
        maxTokens = 400
        systemPrompt = `You are an email marketing expert writing for ${targetAudience}. Use a ${tone} tone.${qualityInstructions}`
        userPrompt = `Create a compelling email about ${randomTopic}. Include:
        - 3 subject line options
        - Preview text
        - Personalized greeting
        - Engaging body copy
        - Clear call-to-action
        - Professional sign-off
        Target audience: ${targetAudience}
        Tone: ${tone}`
        name = `${randomTopic} Email Campaign`
        description = `Email campaign for ${randomTopic}`
        tags = [randomTopic.toLowerCase(), 'email', 'marketing']
        break

      case 'social_media':
        maxTokens = 300
        systemPrompt = `You are a social media expert creating engaging posts for ${targetAudience}. Be ${tone} and platform-optimized.${qualityInstructions}`
        userPrompt = `Create social media content about ${randomTopic}. Include:
        - LinkedIn post (professional, 150-200 words)
        - Twitter/X thread (5-7 tweets)
        - Instagram caption with hashtags
        - Engagement questions
        Target audience: ${targetAudience}
        Tone: ${tone}`
        name = `${randomTopic} Social Media Pack`
        description = `Social media content for ${randomTopic}`
        tags = [randomTopic.toLowerCase(), 'social-media', 'content']
        break

      case 'code':
        maxTokens = 600
        systemPrompt = `You are an expert software engineer writing production-ready code for ${targetAudience}. Be clean, well-documented, and ${tone}.${qualityInstructions}`
        userPrompt = `Create a code snippet or utility for ${randomTopic}. Include:
        - Clear function/class documentation
        - Type safety (if applicable)
        - Error handling
        - Usage examples
        - Unit test examples
        Target audience: ${targetAudience}
        Best practices: Follow industry standards`
        name = `${randomTopic} Code Snippet`
        description = `Production-ready code for ${randomTopic}`
        tags = [randomTopic.toLowerCase(), 'code', 'development']
        break

      case 'tutorial':
        maxTokens = 800
        systemPrompt = `You are an educational content creator teaching ${targetAudience}. Be ${tone} and step-by-step.${qualityInstructions}`
        userPrompt = `Create a tutorial for ${randomTopic}. Include:
        - What you'll learn (3-5 objectives)
        - Prerequisites
        - Step-by-step instructions with screenshots/examples
        - Common mistakes to avoid
        - Next steps and resources
        Target audience: ${targetAudience}
        Difficulty: Beginner to intermediate`
        name = `${randomTopic} Tutorial`
        description = `Complete tutorial for ${randomTopic}`
        tags = [randomTopic.toLowerCase(), 'tutorial', 'education']
        break

      default:
        // Generic content generation
        maxTokens = 500
        systemPrompt = `You are a professional content creator writing for ${targetAudience}. Use a ${tone} tone.${qualityInstructions}`
        userPrompt = `Create high-quality content about ${randomTopic} in the format of ${outputType}. Make it practical and actionable for ${targetAudience}.
        
        IMPORTANT: Follow all brand guidelines, style rules, and quality standards provided above.`
        name = `${randomTopic} ${outputType.replace('_', ' ')}`
        description = `${outputType.replace('_', ' ')} about ${randomTopic}`
        tags = [randomTopic.toLowerCase(), outputType.replace('_', '-')]
    }

    // Call OpenAI with retry logic for transient failures
    const response = await withRetry(
      () => this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
      { maxRetries: 3, retryableErrors: ['rate_limit_exceeded', 'ECONNRESET', 'ETIMEDOUT'] }
    )

    const content = response.choices[0]?.message?.content || ''

    // Post-generation quality check using optimized service
    const qualityResult = this.qualityService?.validate(content) || { 
      issues: [], 
      score: 0.8, 
      passed: true 
    }
    
    // Log quality issues for review
    if (qualityResult.issues.length > 0) {
      console.warn(`Quality issues detected in ${outputType}:`, qualityResult.issues)
    }

    return {
      name,
      description,
      prompt_text: content,
      model: 'gpt-4o-mini',
      tags,
      strategy_context: `Generated ${outputType} for ${randomTopic}${qualityResult.issues.length > 0 ? ` (Quality issues: ${qualityResult.issues.join(', ')})` : ''}`,
      quality_score: qualityResult.score,
    }
  }

  // Trending topics strategy with persona support
  private async generateTrendingPrompt(config: AgentConfig & Record<string, unknown>): Promise<AgentGeneration> {
    const topics = config.topics || ['AI', 'productivity', 'marketing']
    const platforms = (config.platforms as string[]) || []
    const persona = (config.persona as string) || 'professional'
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)] || ''

    let prompt: string
    let name: string
    let description: string
    let tags: string[]

    if (persona === 'content_creator') {
      prompt = `Generate a high-quality prompt for content creators focused on ${randomTopic}. 
      The prompt should be specific, actionable, and optimized for ${randomPlatform ? randomPlatform + ' ' : ''}content creation.
      
      Focus on: ${randomTopic}
      Platform: ${randomPlatform || 'multi-platform'}
      Make it practical for content creators and include engagement strategies.`

      name = `${randomTopic} Content Creator Prompt`
      description = `Trending ${randomTopic.toLowerCase()} prompt for content creators`
      tags = [randomTopic.toLowerCase(), 'content', 'creation', 'trending']
      if (randomPlatform) tags.push(randomPlatform.toLowerCase())
    } else {
      // Default trending generation
      prompt = `Generate a high-quality prompt for ${randomTopic} that would be useful for professionals. 
      The prompt should be specific, actionable, and follow best practices. 
      Include clear instructions and expected output format.
      
      Focus on: ${randomTopic}
      Make it practical and immediately usable.`

      name = `${randomTopic} Expert Prompt`
      description = `Professional ${randomTopic.toLowerCase()} prompt for immediate use`
      tags = [randomTopic.toLowerCase(), 'professional', 'trending']
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content || ''

    return {
      name,
      description,
      prompt_text: content,
      model: 'gpt-4o-mini',
      tags,
      strategy_context: `Generated for trending topic: ${randomTopic}`,
      quality_score: 0.8, // Will be updated by scoring
    }
  }

  // Niche industry strategy with persona support
  private async generateNichePrompt(config: AgentConfig & Record<string, unknown>): Promise<AgentGeneration> {
    const industries = config.industries || ['healthcare', 'finance', 'education']
    const topics = config.topics || []
    const persona = (config.persona as string) || 'professional'
    const randomIndustry = industries[Math.floor(Math.random() * industries.length)]
    const randomTopic = topics[Math.floor(Math.random() * topics.length)] || randomIndustry

    let prompt: string
    let name: string
    let description: string
    let tags: string[]

    if (persona === 'marketing_manager') {
      prompt = `Create a specialized prompt for marketing managers in ${randomIndustry}. 
      The prompt should focus on ${randomTopic} and provide actionable strategies for:
      - Campaign planning and execution
      - Analytics and performance measurement
      - Growth optimization and conversion
      - Brand positioning and messaging
      
      Make it specific to ${randomIndustry} marketing challenges and include clear success metrics.`

      name = `${randomIndustry} Marketing Manager Prompt`
      description = `Specialized marketing prompt for ${randomIndustry} industry managers`
      tags = [randomIndustry.toLowerCase(), 'marketing', 'management', randomTopic.toLowerCase()]
    } else if (persona === 'content_creator') {
      prompt = `Create a specialized prompt for content creators in ${randomIndustry}. 
      The prompt should focus on ${randomTopic} and provide strategies for:
      - Content planning and ideation
      - Platform-specific optimization
      - Audience engagement and growth
      - Content performance tracking
      
      Make it practical for content creators and include platform-specific tips.`

      name = `${randomIndustry} Content Creator Prompt`
      description = `Specialized content creation prompt for ${randomIndustry} creators`
      tags = [randomIndustry.toLowerCase(), 'content', 'creation', randomTopic.toLowerCase()]
    } else if (persona === 'small_business_owner') {
      prompt = `Create a specialized prompt for small business owners in ${randomIndustry}. 
      The prompt should focus on ${randomTopic} and provide practical solutions for:
      - Daily operations and efficiency
      - Customer service and retention
      - Sales and revenue growth
      - Resource optimization
      
      Make it actionable for small business owners with limited resources.`

      name = `${randomIndustry} Small Business Owner Prompt`
      description = `Specialized business prompt for ${randomIndustry} small business owners`
      tags = [randomIndustry.toLowerCase(), 'small-business', 'operations', randomTopic.toLowerCase()]
    } else {
      // Default niche generation
      prompt = `Create a specialized prompt for ${randomIndustry} professionals. 
      The prompt should address specific challenges in this industry and provide 
      actionable solutions. Make it detailed and industry-specific.
      
      Industry: ${randomIndustry}
      Focus on real-world applications and compliance considerations.`

      name = `${randomIndustry} Professional Prompt`
      description = `Specialized prompt for ${randomIndustry} industry professionals`
      tags = [randomIndustry.toLowerCase(), 'professional', 'industry-specific']
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.6,
    })

    const content = response.choices[0]?.message?.content || ''

    return {
      name,
      description,
      prompt_text: content,
      model: 'gpt-4o-mini',
      tags,
      strategy_context: `Generated for ${persona} in industry: ${randomIndustry}`,
      quality_score: 0.8,
    }
  }

  // Educational strategy with persona support
  private async generateEducationalPrompt(config: AgentConfig & Record<string, unknown>): Promise<AgentGeneration> {
    const subjects = config.subjects || ['prompt engineering', 'AI tools', 'workflow optimization']
    const industries = config.industries || []
    const persona = (config.persona as string) || 'learner'
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]
    const randomIndustry = industries[Math.floor(Math.random() * industries.length)] || ''

    let prompt: string
    let name: string
    let description: string
    let tags: string[]

    if (persona === 'small_business_owner') {
      prompt = `Create an educational prompt that teaches ${randomSubject} for small business owners${randomIndustry ? ' in ' + randomIndustry : ''}. 
      The prompt should be structured as a practical learning exercise with:
      - Step-by-step instructions
      - Real-world examples and case studies
      - Actionable implementation steps
      - Success metrics and KPIs
      
      Subject: ${randomSubject}
      Industry: ${randomIndustry || 'general business'}
      Make it beginner-friendly but comprehensive for business growth.`

      name = `Learn ${randomSubject} - Small Business Guide`
      description = `Educational ${randomSubject.toLowerCase()} prompt for small business owners`
      tags = [randomSubject.toLowerCase().replace(' ', '-'), 'education', 'small-business']
      if (randomIndustry) tags.push(randomIndustry.toLowerCase())
    } else {
      // Default educational generation
      prompt = `Create an educational prompt that teaches ${randomSubject}. 
      The prompt should be structured as a learning exercise with clear steps, 
      examples, and expected outcomes. Make it beginner-friendly but comprehensive.
      
      Subject: ${randomSubject}
      Include practical examples and progressive difficulty levels.`

      name = `Learn ${randomSubject} - Tutorial Prompt`
      description = `Educational prompt for learning ${randomSubject}`
      tags = [randomSubject.toLowerCase().replace(' ', '-'), 'education', 'tutorial']
    }

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.5,
    })

    const content = response.choices[0]?.message?.content || ''

    return {
      name,
      description,
      prompt_text: content,
      model: 'gpt-4o-mini',
      tags,
      strategy_context: `Generated for education: ${randomSubject}`,
      quality_score: 0.8,
    }
  }

  // Seasonal strategy
  private async generateSeasonalPrompt(_config: AgentConfig & Record<string, unknown>): Promise<AgentGeneration> {
    const currentMonth = new Date().getMonth()
    const seasons = ['spring', 'summer', 'fall', 'winter']
    const season = seasons[Math.floor(currentMonth / 3)]
    
    const holidays = ['New Year', 'Valentine\'s Day', 'Easter', 'Mother\'s Day', 'Father\'s Day', 'Independence Day', 'Halloween', 'Thanksgiving', 'Christmas']
    const currentHoliday = holidays[Math.floor(Math.random() * holidays.length)]

    const prompt = `Create a seasonal prompt related to ${season} or ${currentHoliday}. 
    The prompt should be timely and relevant to current events, holidays, or seasonal activities. 
    Make it practical for businesses or individuals during this time.
    
    Season/Holiday: ${season}/${currentHoliday}
    Focus on seasonal relevance and practical applications.`

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 350,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content || ''

    return {
      name: `${currentHoliday} ${season} Prompt`,
      description: `Seasonal prompt for ${currentHoliday} and ${season} activities`,
      prompt_text: content,
      model: 'gpt-4o-mini',
      tags: [season, currentHoliday.toLowerCase().replace('\'', ''), 'seasonal'],
      strategy_context: `Generated for season: ${season}, holiday: ${currentHoliday}`,
      quality_score: 0.8,
    }
  }

  // Score prompt quality using AI
  private async scorePrompt(generation: AgentGeneration): Promise<number> {
    const scoringPrompt = `Rate this prompt on a scale of 0.0 to 1.0 based on:
    1. Clarity and specificity (0.25)
    2. Practical usefulness (0.25) 
    3. Professional quality (0.25)
    4. Completeness (0.25)
    
    Prompt: "${generation.prompt_text}"
    
    Respond with only a number between 0.0 and 1.0.`

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: scoringPrompt }],
        max_tokens: 10,
        temperature: 0.1,
      })

      const score = parseFloat(response.choices[0]?.message?.content || '0.5')
      return Math.max(0, Math.min(1, score)) // Clamp between 0 and 1
    } catch (error) {
      console.error('Scoring error:', error)
      return 0.5 // Default score
    }
  }

  // Get agent configuration from database with caching
  private async getAgentConfig(): Promise<AgentConfig & Record<string, unknown> | null> {
    // Check cache first
    const cached = agentConfigCache.get(this.agentId)
    if (cached) {
      agentConfigCache.recordHit()
      return cached as unknown as AgentConfig & Record<string, unknown>
    }

    agentConfigCache.recordMiss()

    // Fetch from database if not in cache
    const supabase = await this.supabase
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', this.agentId)
      .eq('is_active', true)
      .single()

    if (error || !data) return null

    const config = {
      strategy: data.strategy as 'trending' | 'niche' | 'educational' | 'seasonal',
      output_type: data.output_type,
      tone: data.tone,
      target_audience: data.target_audience,
      length_preference: data.length_preference,
      output_format: data.output_format,
      brand_guidelines: data.brand_guidelines,
      quality_standards: data.quality_standards,
      required_elements: data.required_elements,
      key_phrases: data.key_phrases,
      forbidden_phrases: data.forbidden_phrases,
      style_guide: data.style_guide,
      examples: data.examples,
      review_required: data.review_required,
      min_quality_score: data.min_quality_score,
      ...data.config,
    }

    // Store in cache for future use
    agentConfigCache.set(this.agentId, config)

    return config
  }

  // Save generated prompt to database
  async savePrompt(generation: AgentGeneration): Promise<string | null> {
    try {
      const supabase = await this.supabase
      const { data, error } = await supabase.rpc('create_agent_prompt', {
        p_name: generation.name,
        p_description: generation.description,
        p_prompt_text: generation.prompt_text,
        p_model: generation.model,
        p_tags: generation.tags,
        p_agent_id: this.agentId,
        p_strategy_context: generation.strategy_context,
        p_quality_score: generation.quality_score,
      })

      if (error) {
        console.error('Error saving agent prompt:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in savePrompt:', error)
      return null
    }
  }

  // Update agent metrics
  async updateMetrics(promptsGenerated: number, costUsd: number, qualityScore: number): Promise<void> {
    try {
      const supabase = await this.supabase
      await supabase.rpc('update_agent_metrics', {
        p_agent_id: this.agentId,
        p_date: new Date().toISOString().split('T')[0],
        p_prompts_generated: promptsGenerated,
        p_cost_usd: costUsd,
        p_quality_score: qualityScore,
      })
    } catch (error) {
      console.error('Error updating metrics:', error)
    }
  }
}
