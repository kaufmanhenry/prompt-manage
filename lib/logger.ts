/**
 * Conditional logger - only logs in development
 * Prevents sensitive error information from leaking in production
 */

function filterSecrets(obj?: Record<string, unknown>) {
  if (!obj) return obj
  const secretKeys = ['password', 'token', 'apiKey', 'secret']
  const filtered = { ...obj } as Record<string, unknown>
  for (const key of secretKeys) {
    if (filtered[key]) filtered[key] = '[REDACTED]'
  }
  return filtered
}

export const logger = {
  error: (message: string, ...args: unknown[]): void => {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, ...args)
    }
    // In production, errors should be sent to error tracking service
    // TODO: Integrate with Sentry or similar service
  },
  warn: (message: string, ...args: unknown[]): void => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(message, ...args)
    }
  },
  log: (message: string, ...args: unknown[]): void => {
    if (process.env.NODE_ENV === 'development') {
      console.log(message, ...args)
    }
  },
  info: (message: string, meta?: Record<string, unknown>) => {
    const safeMeta = filterSecrets(meta)
    if (process.env.NODE_ENV === 'development') {
      console.info(message, safeMeta)
    }
  },
}
