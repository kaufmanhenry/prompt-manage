#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const FILE_PATH = path.join(__dirname, '..', 'app', 'api', 'directory', 'tools', 'route.ts')
const BACKUP_PATH = FILE_PATH + '.backup'

console.log('🔧 Fixing admin tool update RLS issue...\n')

// Read the file
console.log('📖 Reading file...')
let content = fs.readFileSync(FILE_PATH, 'utf8')

// Create backup
console.log('📦 Creating backup...')
fs.writeFileSync(BACKUP_PATH, content)
console.log(`✓ Backup created: ${BACKUP_PATH}\n`)

// Find and replace the problematic section
const oldCode = `    // Update the tool
    const { data: tool, error } = await supabase
      .from('ai_tools')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single()`

const newCode = `    // Use admin client to bypass RLS for admin users
    const { createAdminClient } = await import('@/utils/supabase/server')
    const adminClient = createAdminClient()

    // Update the tool using admin client
    const { data: tool, error } = await adminClient
      .from('ai_tools')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single()`

console.log('🔨 Applying fix...')

if (!content.includes(oldCode)) {
  console.error('❌ Error: Could not find the code to replace.')
  console.error('The file may have already been fixed or has unexpected content.')
  console.error('\nLooking for:')
  console.error(oldCode)
  process.exit(1)
}

const newContent = content.replace(oldCode, newCode)

// Verify the change was made
if (newContent === content) {
  console.error('❌ Error: No changes were made.')
  process.exit(1)
}

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
console.log('2. Restart your dev server: npm run dev')
console.log('3. Test by updating a tool in the directory')
console.log('4. If it works, commit the changes')
console.log(`5. If not, restore from backup: cp ${BACKUP_PATH} ${FILE_PATH}`)
