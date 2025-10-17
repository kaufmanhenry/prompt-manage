// Simple in-memory rate limiter (temporarily until database migration is run)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const DEFAULT_RATE_LIMIT = 10 // requests per minute
const DEFAULT_WINDOW_SECONDS = 60 // 1 minute

export async function checkRateLimit(
  identifier: string,
  _requestType: string = 'api_call',
  limit: number = DEFAULT_RATE_LIMIT,
  windowSeconds: number = DEFAULT_WINDOW_SECONDS,
): Promise<{
  allowed: boolean
  remaining: number
  resetTime: Date
  currentCount: number
}> {
  // For now, use simple in-memory rate limiting
  // TODO: Replace with database-backed rate limiting once migration is run
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  const userLimit = rateLimitMap.get(identifier)

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: new Date(now + windowMs),
      currentCount: 1,
    }
  }

  if (userLimit.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(userLimit.resetTime),
      currentCount: userLimit.count,
    }
  }

  // Increment count
  userLimit.count++
  rateLimitMap.set(identifier, userLimit)

  return {
    allowed: true,
    remaining: limit - userLimit.count,
    resetTime: new Date(userLimit.resetTime),
    currentCount: userLimit.count,
  }
}

export function getClientIdentifier(request: Request): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'

  // For authenticated users, use user ID for more accurate rate limiting
  // This will be handled in the calling code

  return ip
}
