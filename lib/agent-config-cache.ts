/**
 * Agent Configuration Cache
 * LRU cache for agent configurations to reduce database queries
 * 15-minute TTL, max 500 agents cached
 */

interface AgentConfig {
  id: string
  name: string
  strategy: string
  output_type: string
  tone: string
  target_audience: string
  length_preference: string
  output_format: Record<string, unknown>
  brand_guidelines: Record<string, unknown>
  quality_standards: Record<string, unknown>
  required_elements: Record<string, unknown>
  key_phrases: string[]
  forbidden_phrases: string[]
  style_guide: string
  examples: Record<string, unknown>
  review_required: boolean
  min_quality_score: number
  config: Record<string, unknown>
  topics?: string[]
  industries?: string[]
  subjects?: string[]
  events?: string[]
  platforms?: string[]
  persona?: string
}

interface CacheEntry {
  data: AgentConfig
  timestamp: number
}

class AgentConfigCache {
  private cache: Map<string, CacheEntry> = new Map()
  private maxSize: number = 500
  private ttlMs: number = 15 * 60 * 1000 // 15 minutes

  /**
   * Get agent config from cache
   * Returns null if not found or expired
   */
  get(agentId: string): AgentConfig | null {
    const entry = this.cache.get(agentId)

    if (!entry) return null

    // Check if expired
    const age = Date.now() - entry.timestamp
    if (age > this.ttlMs) {
      this.cache.delete(agentId)
      return null
    }

    return entry.data
  }

  /**
   * Set agent config in cache
   * Implements LRU eviction if cache is full
   */
  set(agentId: string, data: AgentConfig): void {
    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(agentId, {
      data,
      timestamp: Date.now(),
    })
  }

  /**
   * Invalidate a specific agent's cache
   * Call this when agent config is updated
   */
  invalidate(agentId: string): void {
    this.cache.delete(agentId)
  }

  /**
   * Clear entire cache
   * Useful for testing or major config changes
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttlMs: this.ttlMs,
      hitRate: this.calculateHitRate(),
    }
  }

  private hits: number = 0
  private misses: number = 0

  private calculateHitRate(): number {
    const total = this.hits + this.misses
    return total > 0 ? this.hits / total : 0
  }

  // Track cache hits for monitoring
  recordHit(): void {
    this.hits++
  }

  recordMiss(): void {
    this.misses++
  }
}

// Singleton instance
export const agentConfigCache = new AgentConfigCache()
