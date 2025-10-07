// Simple in-memory rate limiter for free tools
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = 10 // requests per minute
const RATE_WINDOW = 60000 // 1 minute in milliseconds

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const userLimit = rateLimitMap.get(identifier)

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_WINDOW
    })
    return {
      allowed: true,
      remaining: RATE_LIMIT - 1,
      resetTime: now + RATE_WINDOW
    }
  }

  if (userLimit.count >= RATE_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: userLimit.resetTime
    }
  }

  // Increment count
  userLimit.count++
  rateLimitMap.set(identifier, userLimit)

  return {
    allowed: true,
    remaining: RATE_LIMIT - userLimit.count,
    resetTime: userLimit.resetTime
  }
}

export function getClientIdentifier(request: Request): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return ip
}
