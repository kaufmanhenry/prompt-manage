import { createServerSideClient } from '@/utils/supabase/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const pricing = searchParams.get('pricing')
    const sort = searchParams.get('sort') || 'newest'

    const supabase = createServerSideClient()

    let query = supabase
      .from('ai_tools')
      .select(
        `
        id,
        name,
        slug,
        website_url,
        description,
        logo_url,
        primary_category_id,
        tool_categories(name),
        pricing_model,
        rating,
        review_count,
        favorite_count,
        view_count,
        upvote_count,
        key_features
      `,
        { count: 'exact' },
      )
      .eq('status', 'approved')
      .order(
        sort === 'popular' ? 'upvote_count' : sort === 'highest_rated' ? 'rating' : 'created_at',
        {
          ascending: sort === 'popular' || sort === 'highest_rated' ? false : false,
        },
      )

    // Apply search filter
    if (search) {
      query = query.textSearch('search', search)
    }

    // Apply category filter
    if (category && category !== 'all') {
      query = query.eq('primary_category_id', category)
    }

    // Apply pricing filter
    if (pricing && pricing !== 'all') {
      query = query.eq('pricing_model', pricing)
    }

    const { data: tools, error, count } = await query.limit(50)

    if (error) {
      console.error('Supabase query error:', error)
      return Response.json(
        {
          tools: [],
          total: 0,
        },
        { status: 200 },
      )
    }

    // Format the response
    const formattedTools =
      tools?.map((tool: Record<string, unknown>) => ({
        ...tool,
        category_name: (tool.tool_categories as Record<string, unknown>)?.name || 'Uncategorized',
        tool_categories: undefined, // Remove nested data
      })) || []

    return Response.json({
      tools: formattedTools,
      total: count || 0,
    })
  } catch (error: unknown) {
    console.error('Error fetching tools:', error)
    // Return empty state instead of error to prevent frontend crashes
    return Response.json(
      {
        tools: [],
        total: 0,
      },
      { status: 200 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'name',
      'website_url',
      'description',
      'primary_category_id',
      'pricing_model',
      'contact_email',
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return Response.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create slug from name
    const slug = body.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .substring(0, 50)

    // Insert the tool
    const { data: tool, error } = await supabase
      .from('ai_tools')
      .insert({
        ...body,
        slug,
        submitted_by: session.user.id,
        status: 'pending', // Default to pending for moderation
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return Response.json(tool, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating tool:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create tool'
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
