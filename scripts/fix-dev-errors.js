#!/usr/bin/env node
/* eslint-disable */

/**
 * Development Environment Fix Script
 * Fixes common React DOM errors in Next.js 15.5.6 development
 */

const fs = require('fs')
const path = require('path')

console.log('🔧 Fixing development environment issues...')

// 1. Clear Next.js cache
console.log('📦 Clearing Next.js cache...')
try {
  const { execSync } = require('child_process')
  execSync('rm -rf .next', { stdio: 'inherit' })
  console.log('✅ Next.js cache cleared')
} catch (error) {
  console.log('⚠️  Could not clear cache (this is normal on Windows)')
}

// 2. Clear node_modules/.cache
console.log('🗑️  Clearing node modules cache...')
try {
  const { execSync } = require('child_process')
  execSync('rm -rf node_modules/.cache', { stdio: 'inherit' })
  console.log('✅ Node modules cache cleared')
} catch (error) {
  console.log('⚠️  Could not clear node modules cache')
}

// 3. Check for common issues
console.log('🔍 Checking for common issues...')

// Check package.json for version conflicts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const nextVersion = packageJson.dependencies.next
const reactVersion = packageJson.dependencies.react

console.log(`📋 Next.js version: ${nextVersion}`)
console.log(`⚛️  React version: ${reactVersion}`)

if (nextVersion.startsWith('15.') && reactVersion.startsWith('18.')) {
  console.log('✅ Version compatibility looks good')
} else {
  console.log('⚠️  Version compatibility might be an issue')
}

// 4. Create .env.local if it doesn't exist
const envLocalPath = '.env.local'
if (!fs.existsSync(envLocalPath)) {
  console.log('📝 Creating .env.local template...')
  const envTemplate = `# Development Environment Variables
# Copy from .env.example and fill in your values

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development flags
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=development
`
  fs.writeFileSync(envLocalPath, envTemplate)
  console.log('✅ .env.local template created')
}

console.log('\n🎉 Development environment fix complete!')
console.log('\n📋 Next steps:')
console.log('1. Run: npm install')
console.log('2. Run: npm run dev')
console.log('3. If errors persist, try: npm run build && npm run start')
console.log("\n💡 These errors are typically development-only and won't affect production.")
