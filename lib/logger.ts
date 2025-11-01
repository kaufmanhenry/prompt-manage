/**
 * Conditional logger - only logs in development
 * Prevents sensitive error information from leaking in production
 */

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
}
