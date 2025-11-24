import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Read .env.local
const envPath = path.join(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars: Record<string, string> = {}

envContent.split('\n').forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    const key = match[1].trim()
    const value = match[2].trim().replace(/^["']|["']$/g, '') // Remove quotes
    envVars[key] = value
  }
})

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE']

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function findDuplicates() {
  console.log('Fetching all tools...')
  const { data: tools, error } = await supabase
    .from('ai_tools')
    .select('id, name, slug, created_at, status, upvote_count, review_count, description')
    .order('name')

  if (error) {
    console.error('Error fetching tools:', error)
    return
  }

  const nameMap = new Map<string, any[]>()

  tools.forEach((tool) => {
    // Normalize name: lowercase, remove spaces and special chars
    const normalized = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (!nameMap.has(normalized)) {
      nameMap.set(normalized, [])
    }
    nameMap.get(normalized)?.push(tool)
  })

  console.log('\nPotential Duplicates:')
  let duplicateCount = 0
  nameMap.forEach((group, key) => {
    if (group.length > 1) {
      duplicateCount++
      console.log(`\nGroup: "${key}"`)
      group.forEach((tool) => {
        console.log(`  - ${tool.name} (ID: ${tool.id})`)
        console.log(`    Created: ${tool.created_at}`)
        console.log(`    Reviews: ${tool.review_count}, Upvotes: ${tool.upvote_count}`)
        console.log(`    Description: ${tool.description.substring(0, 50)}...`)
      })
    }
  })

  if (duplicateCount === 0) {
    console.log('No obvious duplicates found by normalized name.')
  }
}

findDuplicates()
