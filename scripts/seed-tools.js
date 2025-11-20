require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Try both variable names just in case
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key')
  process.exit(1)
}

console.log('Using Supabase URL:', supabaseUrl)
const keyType =
  process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY
    ? 'SERVICE_ROLE'
    : 'ANON (Likely cause of RLS error)'
console.log('Using Key Type:', keyType)

console.log('Connecting to Supabase...')
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function seed() {
  try {
    // 1. Ensure Categories
    const categories = [
      { name: 'Image', slug: 'image', icon_emoji: '🎨' },
      { name: 'Video', slug: 'video', icon_emoji: '🎬' },
      { name: 'Audio', slug: 'audio', icon_emoji: '🎵' },
      { name: 'Text', slug: 'text', icon_emoji: '📝' },
      { name: 'Design', slug: 'design', icon_emoji: '✏️' },
      { name: 'Code', slug: 'code', icon_emoji: '💻' },
      { name: 'Business', slug: 'business', icon_emoji: '💼' },
    ]

    const categoryIds = {}

    console.log('Seeding categories...')
    for (const cat of categories) {
      // Check if exists
      const { data, error } = await supabase
        .from('tool_categories')
        .select('id')
        .eq('slug', cat.slug)
        .single()

      if (data) {
        categoryIds[cat.slug] = data.id
      } else {
        // Create
        const { data: newCat, error: insertError } = await supabase
          .from('tool_categories')
          .insert(cat)
          .select()
          .single()

        if (insertError) {
          console.error(`Error creating category ${cat.name}:`, insertError.message)
        } else if (newCat) {
          categoryIds[cat.slug] = newCat.id
          console.log(`Created category: ${cat.name}`)
        }
      }
    }

    // 2. Insert Tools
    const tools = [
      {
        name: 'Wender',
        slug: 'wender',
        website_url: 'https://www.wenderapp.com/',
        description:
          'AI design tool for creating stunning visuals and user interfaces. Streamline your design workflow with intelligent automation.',
        primary_category_id: categoryIds['design'] || categoryIds['image'],
        pricing_model: 'freemium',
        status: 'approved',
        key_features: ['UI Design', 'AI Generation', 'Web Design', 'Prototyping'],
        logo_url: 'https://www.wenderapp.com/favicon.ico', // Placeholder
      },
      {
        name: 'Midjourney',
        slug: 'midjourney',
        website_url: 'https://www.midjourney.com',
        description:
          'AI image generation with stunning artistic quality and creative control over style and composition.',
        primary_category_id: categoryIds['image'],
        pricing_model: 'paid',
        status: 'approved',
        key_features: ['Art Creation', 'High Quality', 'Discord Interface'],
        logo_url: null,
      },
      {
        name: 'Suno',
        slug: 'suno',
        website_url: 'https://suno.com',
        description:
          'AI music generation platform that creates original songs, melodies, and audio content.',
        primary_category_id: categoryIds['audio'],
        pricing_model: 'freemium',
        status: 'approved',
        key_features: ['Music Generation', 'Song Creation', 'Melody Composition'],
        logo_url: null,
      },
      {
        name: 'Runway',
        slug: 'runway',
        website_url: 'https://runwayml.com',
        description:
          'AI video generation and editing platform with advanced visual effects and creative tools.',
        primary_category_id: categoryIds['video'],
        pricing_model: 'freemium',
        status: 'approved',
        key_features: ['Video Generation', 'Video Editing', 'Visual Effects'],
        logo_url: null,
      },
      {
        name: 'ChatGPT',
        slug: 'chatgpt',
        website_url: 'https://chat.openai.com',
        description:
          'Advanced AI language model for conversation, writing, analysis, and coding assistance.',
        primary_category_id: categoryIds['text'],
        pricing_model: 'freemium',
        status: 'approved',
        key_features: ['Conversation', 'Writing', 'Coding', 'Analysis'],
        logo_url: null,
      },
    ]

    console.log('Seeding tools...')
    for (const tool of tools) {
      if (!tool.primary_category_id) {
        console.warn(`Skipping ${tool.name} because category is missing`)
        continue
      }

      // We omit submitted_by and hope it's nullable. If not, we'll get an error.
      const { error } = await supabase.from('ai_tools').upsert(tool, { onConflict: 'slug' })

      if (error) {
        console.error(`Error inserting tool ${tool.name}:`, error.message)
      } else {
        console.log(`Upserted tool: ${tool.name}`)
      }
    }

    console.log('Seeding complete!')
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

seed()
