#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const FILE_PATH = path.join(__dirname, '..', 'app', 'api', 'directory', 'tools', 'route.ts')
const BACKUP_PATH = FILE_PATH + '.create-backup'

console.log('🔧 Fixing admin tool create issue...\n')

// Read the file
console.log('📖 Reading file...')
let content = fs.readFileSync(FILE_PATH, 'utf8')

// Create backup
console.log('📦 Creating backup...')
fs.writeFileSync(BACKUP_PATH, content)
console.log(`✓ Backup created: ${BACKUP_PATH}\n`)

// Find and replace the POST endpoint
const oldCode = `    // Insert the tool
    const { data: tool, error } = await supabase
      .from('ai_tools')
      .insert({
        ...body,
        slug,
        submitted_by: session.user.id,
        status: 'pending', // Default to pending for moderation
      })
      .select()
      .single()`

const newCode = `    // Check if user is admin
    const { isAdmin } = await import('@/utils/admin')
    const isAdminUser = isAdmin(session.user.email)

    // Use admin client if user is admin (allows setting admin-only fields)
    const dbClient = isAdminUser ? (await import('@/utils/supabase/server')).createAdminClient() : supabase

    // Insert the tool
    const { data: tool, error } = await dbClient
      .from('ai_tools')
      .insert({
        ...body,
        slug,
        submitted_by: session.user.id,
        status: isAdminUser && body.status ? body.status : 'pending', // Admins can set status
      })
      .select()
      .single()`

console.log('🔨 Applying fix...')

if (!content.includes(oldCode)) {
  console.error('❌ Error: Could not find the code to replace.')
  console.error('The file may have already been fixed or has unexpected content.')
  process.exit(1)
}

const newContent = content.replace(oldCode, newCode)

// Write the fixed content
fs.writeFileSync(FILE_PATH, newContent)
console.log('✓ Fix applied successfully!\n')

// Show what changed
console.log('📝 Changes made:')
console.log('---')
console.log('REMOVED:')
console.log(oldCode)
console.log('\nADDED:')
console.log(newCode)
console.log('---\n')

console.log('✅ Done!\n')
console.log('Next steps:')
console.log('1. Review the changes above')
console.log('2. Restart your dev server')
console.log('3. Test creating a tool')
