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

async function listAllTools() {
  console.log('Fetching all tools...')

  const { data: tools, error } = await supabase
    .from('ai_tools')
    .select('id, name, slug, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching tools:', error)
    return
  }

  console.log(`Found ${tools.length} tools:`)
  tools.forEach((tool) => {
    console.log(`- [${tool.id}] ${tool.name} (${tool.slug}) - Status: ${tool.status}`)
  })
}

void listAllTools()
