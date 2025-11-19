import { createServerSideClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = createServerSideClient()

    const { data: categories, error } = await supabase
      .from('tool_categories')
      .select('id, name, slug, icon_emoji, description')
      .eq('is_active', true)
      .order('position', { ascending: true })

    if (error) {
      throw error
    }

    return Response.json(categories || [])
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
