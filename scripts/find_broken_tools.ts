import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

const toolsToDelete = ['optimizer', 'generator', 'creator', 'claude', 'cursor']

async function findTools() {
  console.log('Searching for tools to delete...')

  // Use ILIKE for case-insensitive matching
  const { data: tools, error } = await supabase
    .from('ai_tools')
    .select('id, name, slug, status')
    .or(toolsToDelete.map((name) => `name.ilike.%${name}%`).join(','))

  if (error) {
    console.error('Error fetching tools:', error)
    return
  }

  if (tools.length === 0) {
    console.log('No tools found matching the criteria.')
  } else {
    console.log(`Found ${tools.length} tools to delete:`)
    tools.forEach((tool) => {
      console.log(`- [${tool.id}] ${tool.name} (${tool.slug}) - Status: ${tool.status}`)
    })
  }
}

void findTools()
