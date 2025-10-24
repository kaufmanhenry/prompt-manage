// Authentication utility functions

/**
 * Validates that a user ID is a proper UUID format
 * @param userId - The user ID to validate
 * @returns The validated user ID or null if invalid
 */
export function validateUserId(userId: string | undefined | null): string | null {
  if (!userId || typeof userId !== 'string') {
    return null
  }

  // Check if it's a valid UUID format (36 characters with hyphens)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (userId.length === 36 && uuidRegex.test(userId)) {
    return userId
  }

  // If it looks like a base64 token or other invalid format, log warning and return null
  if (userId.length > 36 || userId.includes('base64') || userId.includes('eyJ')) {
    console.warn('Invalid user ID format detected:', {
      type: typeof userId,
      length: userId.length,
      preview: userId.substring(0, 20),
      isBase64Like: userId.includes('eyJ'),
    })
  }

  return null
}

/**
 * Safely extracts and validates user ID from Supabase auth response
 * @param user - The user object from Supabase auth
 * @returns The validated user ID or null if invalid/not authenticated
 */
export function getValidatedUserId(user: { id?: string } | null | undefined): string | null {
  if (!user?.id) {
    return null
  }

  return validateUserId(user.id)
}
