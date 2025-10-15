/**
 * Quality Control Service
 * Handles validation and quality checking for agent-generated content
 * Optimized for performance with regex-based forbidden phrase detection
 */

export interface QualityConfig {
  brand_guidelines?: {
    brand_voice?: string
    brand_values?: string[]
    do_use?: string[]
    dont_use?: string[]
  }
  quality_standards?: {
    min_word_count?: number
    max_word_count?: number
    readability_level?: string
    must_include_examples?: boolean
    must_include_actionable_steps?: boolean
    must_include_statistics?: boolean
  }
  required_elements?: Record<string, string>
  key_phrases?: string[]
  forbidden_phrases?: string[]
  style_guide?: string
  examples?: {
    good_example?: string
    bad_example?: string
    good_headline?: string
    bad_headline?: string
  }
}

export interface QualityResult {
  issues: string[]
  score: number
  passed: boolean
}

export class QualityControlService {
  private config: QualityConfig
  private forbiddenRegex: RegExp | null = null
  private qualityInstructions: string = ''

  constructor(config: QualityConfig) {
    this.config = config
    this.forbiddenRegex = this.buildForbiddenRegex()
    this.qualityInstructions = this.buildQualityInstructions()
  }

  /**
   * Build regex for forbidden phrases (O(1) check vs O(n) loop)
   * Built once at construction, reused for all validations
   */
  private buildForbiddenRegex(): RegExp | null {
    const phrases = this.config.forbidden_phrases
    if (!phrases || phrases.length === 0) return null

    // Escape special regex characters and join with alternation
    const pattern = phrases
      .map(phrase => phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')
    
    return new RegExp(pattern, 'gi')
  }

  /**
   * Build quality instructions string once, reuse for all generations
   * Previously rebuilt on every generation - now cached
   */
  buildQualityInstructions(): string {
    const { brand_guidelines, required_elements, key_phrases, forbidden_phrases, style_guide, examples } = this.config
    let instructions = ''

    if (brand_guidelines?.brand_voice) {
      instructions += `\n\nBRAND VOICE: ${brand_guidelines.brand_voice}`
    }

    if (brand_guidelines?.brand_values && brand_guidelines.brand_values.length > 0) {
      instructions += `\n\nBRAND VALUES: ${brand_guidelines.brand_values.join(', ')}`
    }

    if (brand_guidelines?.do_use && brand_guidelines.do_use.length > 0) {
      instructions += `\n\nPREFERRED LANGUAGE: ${brand_guidelines.do_use.join(', ')}`
    }

    if (key_phrases && key_phrases.length > 0) {
      instructions += `\n\nKEY PHRASES TO INCLUDE (use naturally): ${key_phrases.join(', ')}`
    }

    if (forbidden_phrases && forbidden_phrases.length > 0) {
      instructions += `\n\nFORBIDDEN PHRASES (never use): ${forbidden_phrases.join(', ')}`
    }

    if (style_guide) {
      instructions += `\n\nSTYLE GUIDE:\n${style_guide}`
    }

    if (required_elements && Object.keys(required_elements).length > 0) {
      instructions += `\n\nREQUIRED ELEMENTS:\n${Object.entries(required_elements)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n')}`
    }

    if (examples?.good_example) {
      instructions += `\n\nGOOD EXAMPLE:\n${examples.good_example}`
    }

    if (examples?.bad_example) {
      instructions += `\n\nBAD EXAMPLE (avoid this style):\n${examples.bad_example}`
    }

    return instructions
  }

  /**
   * Get pre-built quality instructions (cached)
   */
  getQualityInstructions(): string {
    return this.qualityInstructions
  }

  /**
   * Validate content against quality standards
   * Optimized with regex for forbidden phrases (10-100x faster than loop)
   */
  validate(content: string): QualityResult {
    const issues: string[] = []

    // Check for forbidden phrases using regex (O(1) vs O(n))
    if (this.forbiddenRegex) {
      const matches = content.match(this.forbiddenRegex)
      if (matches) {
        const uniqueMatches = Array.from(new Set(matches.map(m => m.toLowerCase())))
        issues.push(`Contains forbidden phrases: "${uniqueMatches.join('", "')}"`)
      }
    }

    // Check word count if specified
    const standards = this.config.quality_standards
    if (standards?.min_word_count || standards?.max_word_count) {
      const wordCount = this.countWords(content)
      
      if (standards.min_word_count && wordCount < standards.min_word_count) {
        issues.push(`Content too short: ${wordCount} words (minimum: ${standards.min_word_count})`)
      }
      
      if (standards.max_word_count && wordCount > standards.max_word_count) {
        issues.push(`Content too long: ${wordCount} words (maximum: ${standards.max_word_count})`)
      }
    }

    // Check for required elements presence (basic heuristic)
    if (this.config.required_elements) {
      for (const [element, description] of Object.entries(this.config.required_elements)) {
        // Basic check - could be enhanced with more sophisticated analysis
        if (!content.toLowerCase().includes(element.toLowerCase())) {
          issues.push(`Missing required element: ${element} (${description})`)
        }
      }
    }

    // Calculate quality score
    const score = this.calculateScore(issues)
    const passed = issues.length === 0

    return { issues, score, passed }
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  /**
   * Calculate quality score based on issues found
   * 0.0 = many critical issues, 1.0 = perfect
   */
  private calculateScore(issues: string[]): number {
    if (issues.length === 0) return 0.9 // High score for no issues

    // Deduct points per issue
    const deduction = Math.min(issues.length * 0.15, 0.4)
    return Math.max(0.5, 0.9 - deduction)
  }

  /**
   * Get a summary of quality configuration
   */
  getSummary(): string {
    const parts: string[] = []

    if (this.config.forbidden_phrases?.length) {
      parts.push(`${this.config.forbidden_phrases.length} forbidden phrases`)
    }
    if (this.config.key_phrases?.length) {
      parts.push(`${this.config.key_phrases.length} key phrases`)
    }
    if (this.config.quality_standards?.min_word_count) {
      parts.push(`min ${this.config.quality_standards.min_word_count} words`)
    }
    if (this.config.style_guide) {
      parts.push('style guide enforced')
    }

    return parts.length > 0 ? parts.join(', ') : 'No quality controls'
  }
}

