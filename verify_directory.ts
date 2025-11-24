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

async function verify() {
  console.log('Verifying Directory State...\n')

  // 1. Check "Newest" order
  console.log('1. Checking "Newest" order (Top 5):')
  const { data: newestTools, error: newestError } = await supabase
    .from('ai_tools')
    .select('name, created_at, status')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(5)

  if (newestError) console.error(newestError)
  else {
    newestTools.forEach((tool, i) => {
      console.log(`   ${i + 1}. ${tool.name} (${tool.created_at})`)
    })
  }

  // 2. Check "Google Antigravity" visibility
  console.log('\n2. Checking "Google Antigravity":')
  const { data: antigravity, error: agError } = await supabase
    .from('ai_tools')
    .select('name, status')
    .ilike('name', '%Antigravity%')
    .single()

  if (agError) console.error(agError)
  else {
    console.log(`   Found: ${antigravity.name}, Status: ${antigravity.status}`)
  }

  // 3. Check Duplicates (ElevenLabs & Jasper)
  console.log('\n3. Checking Duplicates:')
  const { data: duplicates, error: dupError } = await supabase
    .from('ai_tools')
    .select('name, upvote_count, review_count')
    .in('name', ['ElevenLabs', 'Jasper'])

  if (dupError) console.error(dupError)
  else {
    duplicates.forEach((tool) => {
      console.log(`   ${tool.name}: Upvotes=${tool.upvote_count}, Reviews=${tool.review_count}`)
    })
  }
}

void verify()
