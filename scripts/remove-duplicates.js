require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function findAndRemoveDuplicates() {
  try {
    console.log('Finding duplicate tools...')

    // Get all tools
    const { data: tools, error } = await supabase
      .from('ai_tools')
      .select('id, name, slug, status, created_at')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching tools:', error)
      return
    }

    // Find duplicates by name (case-insensitive)
    const nameMap = new Map()
    const duplicates = []

    tools.forEach((tool) => {
      const lowerName = tool.name.toLowerCase()
      if (nameMap.has(lowerName)) {
        duplicates.push({
          name: tool.name,
          existing: nameMap.get(lowerName),
          duplicate: tool,
        })
      } else {
        nameMap.set(lowerName, tool)
      }
    })

    if (duplicates.length === 0) {
      console.log('No duplicates found!')
      return
    }

    console.log(`\nFound ${duplicates.length} duplicate(s):\n`)

    for (const dup of duplicates) {
      console.log(`Duplicate: ${dup.name}`)
      console.log(
        `  Existing: ID=${dup.existing.id}, slug=${dup.existing.slug}, status=${dup.existing.status}, created=${dup.existing.created_at}`,
      )
      console.log(
        `  Duplicate: ID=${dup.duplicate.id}, slug=${dup.duplicate.slug}, status=${dup.duplicate.status}, created=${dup.duplicate.created_at}`,
      )

      // Keep the approved one, or the older one if both have same status
      let toKeep, toDelete

      if (dup.existing.status === 'approved' && dup.duplicate.status !== 'approved') {
        toKeep = dup.existing
        toDelete = dup.duplicate
      } else if (dup.duplicate.status === 'approved' && dup.existing.status !== 'approved') {
        toKeep = dup.duplicate
        toDelete = dup.existing
      } else {
        // Both same status, keep older one
        toKeep =
          new Date(dup.existing.created_at) < new Date(dup.duplicate.created_at)
            ? dup.existing
            : dup.duplicate
        toDelete = toKeep === dup.existing ? dup.duplicate : dup.existing
      }

      console.log(`  -> Keeping: ${toKeep.id}`)
      console.log(`  -> Deleting: ${toDelete.id}\n`)

      // Delete the duplicate
      const { error: deleteError } = await supabase.from('ai_tools').delete().eq('id', toDelete.id)

      if (deleteError) {
        console.error(`Error deleting ${toDelete.id}:`, deleteError)
      } else {
        console.log(`✓ Deleted duplicate: ${dup.name} (${toDelete.id})`)
      }
    }

    console.log('\nDone!')
  } catch (err) {
    console.error('Error:', err)
  }
}

findAndRemoveDuplicates()
