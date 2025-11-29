/**
 * Environment Variable Validation
 *
 * Validates that all required environment variables are set.
 * Call this early in the application lifecycle to fail fast if configuration is missing.
 */

interface EnvValidationResult {
  isValid: boolean
  missing: string[]
  warnings: string[]
}

const REQUIRED_ENV_VARS = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_TEAM_MONTHLY_ID',
  'STRIPE_PRICE_PRO_MONTHLY_ID',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
] as const

const RECOMMENDED_ENV_VARS = ['NEXT_PUBLIC_BASE_URL', 'NEXT_PUBLIC_APP_URL'] as const

/**
 * Validate that all required environment variables are set
 * @returns Validation result with missing variables
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const missing: string[] = []
  const warnings: string[] = []

  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar] || process.env[envVar] === '') {
      missing.push(envVar)
    }
  }

  // Check recommended variables (just warnings)
  for (const envVar of RECOMMENDED_ENV_VARS) {
    if (!process.env[envVar] || process.env[envVar] === '') {
      warnings.push(envVar)
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  }
}

/**
 * Validate environment variables and log results
 * Throws an error if required variables are missing in production
 */
export function validateAndLogEnvironment(): void {
  const result = validateEnvironmentVariables()

  if (!result.isValid) {
    console.error('❌ Missing required environment variables:')
    result.missing.forEach((envVar) => {
      console.error(`   - ${envVar}`)
    })

    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `Missing required environment variables: ${result.missing.join(', ')}. ` +
          'Application cannot start without these variables.',
      )
    } else {
      console.error(
        '\n⚠️  Application may not function correctly without these variables.\n' +
          'Set them in your .env.local file.\n',
      )
    }
  } else {
    console.log('✅ All required environment variables are set')
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️  Recommended environment variables not set:')
    result.warnings.forEach((envVar) => {
      console.warn(`   - ${envVar}`)
    })
    console.warn('   These are recommended but not required.\n')
  }
}

/**
 * Get a validated environment variable or throw
 */
export function getRequiredEnvVar(name: string): string {
  const value = process.env[name]
  if (!value || value === '') {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}
