// Audit logging utility for sensitive operations (temporarily console-only until database is ready)
export interface AuditLogEntry {
  user_id: string
  action: string
  resource_type: string
  resource_id?: string
  metadata?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
}

export function logAuditEvent(
  userId: string,
  action: string,
  resourceType: string,
  options: {
    resourceId?: string
    metadata?: Record<string, unknown>
    ipAddress?: string
    userAgent?: string
  } = {},
) {
  const auditEntry: AuditLogEntry = {
    user_id: userId,
    action,
    resource_type: resourceType,
    resource_id: options.resourceId,
    metadata: options.metadata || {},
    ip_address: options.ipAddress,
    user_agent: options.userAgent,
  }

  // For now, just log to console
  // TODO: Replace with database logging once migration is run
  console.log('AUDIT:', auditEntry)
}

// Sanitize error messages for logging
export function sanitizeError(error: unknown): { message: string; code?: string } {
  if (!error) return { message: 'Unknown error' }

  const err = error as Error & { code?: string; status?: number }
  return {
    message: err.message || (typeof error === 'string' ? error : 'Unknown error'),
    code: err.code || err.status?.toString(),
  }
}

// Enhanced error logging with sanitization
export function logError(
  userId: string | null,
  action: string,
  error: unknown,
  context?: Record<string, unknown>,
) {
  const sanitizedError = sanitizeError(error)

  // Log to console (development)
  console.error(`Error in ${action}:`, {
    userId,
    error: sanitizedError,
    context,
    timestamp: new Date().toISOString(),
  })

  // TODO: In production, send to error tracking service like Sentry
  // if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  //   Sentry.captureException(error, { contexts: { user: { id: userId }, action, context } })
  // }
}
