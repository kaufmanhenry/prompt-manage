/**
 * Retry utility with exponential backoff
 * For handling transient API failures gracefully
 */

interface RetryOptions {
  maxRetries?: number
  initialDelayMs?: number
  maxDelayMs?: number
  backoffMultiplier?: number
  retryableErrors?: string[]
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'rate_limit_exceeded']
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: unknown, retryableErrors: string[]): boolean {
  if (!error) return false

  // Type guard for error object
  if (typeof error !== 'object') return false

  const err = error as { code?: string; message?: string; type?: string }

  // Check error code
  if (err.code && retryableErrors.includes(err.code)) return true

  // Check error message
  if (err.message && retryableErrors.some(msg => err.message?.includes(msg))) return true

  // Check error type
  if (err.type && retryableErrors.includes(err.type)) return true

  return false
}

/**
 * Execute function with exponential backoff retry
 * 
 * @example
 * const result = await withRetry(
 *   () => openai.chat.completions.create(...),
 *   { maxRetries: 3 }
 * )
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  let lastError: Error | null = null

  for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: unknown) {
      lastError = error as Error

      // If this is the last attempt, throw
      if (attempt === opts.maxRetries - 1) {
        throw error
      }

      // Check if error is retryable
      if (!isRetryableError(error, opts.retryableErrors)) {
        throw error
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.initialDelayMs * Math.pow(opts.backoffMultiplier, attempt),
        opts.maxDelayMs
      )

      console.log(`Retry attempt ${attempt + 1}/${opts.maxRetries} after ${delay}ms...`)
      await sleep(delay)
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError || new Error('Retry failed')
}

/**
 * Batch process items with concurrency limit
 * Useful for processing multiple agents without overwhelming APIs
 * 
 * @example
 * await batchProcess(
 *   agents,
 *   async (agent) => agent.generatePrompt(),
 *   { concurrency: 5 }
 * )
 */
export async function batchProcess<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  options: { concurrency?: number } = {}
): Promise<R[]> {
  const concurrency = options.concurrency || 5
  const results: R[] = []
  
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    const batchResults = await Promise.all(
      batch.map(item => 
        fn(item).catch(error => {
          console.error(`Batch item failed:`, error)
          return null as R
        })
      )
    )
    results.push(...batchResults)
  }
  
  return results
}

