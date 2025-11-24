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

async function checkTool() {
  console.log('Searching for "Google Antigravity"...')
  const { data: tools, error } = await supabase
    .from('ai_tools')
    .select('*')
    .ilike('name', '%Antigravity%')

  if (error) {
    console.error('Error fetching tools:', error)
    return
  }

  console.log('Found tools:', JSON.stringify(tools, null, 2))
}

checkTool()
