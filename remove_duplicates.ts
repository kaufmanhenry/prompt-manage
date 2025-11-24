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

async function removeDuplicates() {
  console.log('Fetching all tools...')
  const { data: tools, error } = await supabase
    .from('ai_tools')
    .select('id, name, slug, created_at, status, upvote_count, review_count')
    .order('name')

  if (error) {
    console.error('Error fetching tools:', error)
    return
  }

  const nameMap = new Map<string, any[]>()

  tools.forEach((tool) => {
    const normalized = tool.name.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (!nameMap.has(normalized)) {
      nameMap.set(normalized, [])
    }
    nameMap.get(normalized)?.push(tool)
  })

  for (const [key, group] of Array.from(nameMap.entries())) {
    if (group.length > 1) {
      console.log(`\nProcessing duplicate group: "${key}"`)

      // Find the one to keep (highest review count)
      group.sort((a, b) => b.review_count - a.review_count)
      const keeper = group[0]
      const losers = group.slice(1)

      console.log(`  Keeping: ${keeper.name} (ID: ${keeper.id}, Reviews: ${keeper.review_count})`)

      // Sum upvotes from losers
      let totalUpvotesToAdd = 0
      const idsToDelete: string[] = []

      losers.forEach((loser) => {
        console.log(`  Removing: ${loser.name} (ID: ${loser.id}, Upvotes: ${loser.upvote_count})`)
        totalUpvotesToAdd += loser.upvote_count || 0
        idsToDelete.push(loser.id)
      })

      // Update keeper with added upvotes
      if (totalUpvotesToAdd > 0) {
        console.log(`  Adding ${totalUpvotesToAdd} upvotes to keeper...`)
        const { error: updateError } = await supabase
          .from('ai_tools')
          .update({ upvote_count: (keeper.upvote_count || 0) + totalUpvotesToAdd })
          .eq('id', keeper.id)

        if (updateError) {
          console.error('  Error updating keeper:', updateError)
          continue // Skip deletion if update fails
        }
      }

      // Delete losers
      console.log(`  Deleting ${idsToDelete.length} tools...`)
      const { error: deleteError } = await supabase.from('ai_tools').delete().in('id', idsToDelete)

      if (deleteError) {
        console.error('  Error deleting tools:', deleteError)
      } else {
        console.log('  Deletion successful.')
      }
    }
  }
}

void removeDuplicates()
