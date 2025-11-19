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
      console.error('Supabase error:', error)
      return Response.json([], { status: 200 })
    }

    return Response.json(categories || [], { status: 200 })
  } catch (error: unknown) {
    console.error('Error fetching categories:', error)
    // Always return empty array instead of error object
    return Response.json([], { status: 200 })
  }
}
