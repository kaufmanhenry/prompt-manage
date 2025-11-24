import { createServerSideClient } from '@/utils/supabase/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const pricing = searchParams.get('pricing')
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)

    const supabase = createServerSideClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    let isAdminUser = false
    if (session?.user?.email) {
      const { isAdmin } = await import('@/utils/admin')
      isAdminUser = isAdmin(session.user.email)
    }

    let query = supabase.from('ai_tools').select(
      `
        id,
        name,
        slug,
        website_url,
        description,
        logo_url,
        primary_category_id,
        tool_categories!ai_tools_primary_category_id_fkey(name),
        pricing_model,
        rating,
        review_count,
        favorite_count,
        view_count,
        upvote_count,
        key_features,
        status
      `,
      { count: 'exact' },
    )

    // Filter by status - show all for admins, only approved for others
    if (!isAdminUser) {
      query = query.eq('status', 'approved')
    }

    query = query.order(
      sort === 'popular' ? 'upvote_count' : sort === 'highest_rated' ? 'rating' : 'created_at',
      {
        ascending: sort === 'popular' || sort === 'highest_rated' ? false : false,
      },
    )

    // Apply search filter
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,key_features.cs.{${search}}`,
      )
    }

    // Apply category filter
    if (category && category !== 'all') {
      query = query.eq('primary_category_id', category)
    }

    // Apply pricing filter
    if (pricing && pricing !== 'all') {
      query = query.eq('pricing_model', pricing)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: tools, error, count } = await query

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

    // Check if user is admin
    const { isAdmin } = await import('@/utils/admin')
    const isAdminUser = isAdmin(session.user.email)

    // Use admin client if user is admin (allows setting admin-only fields)
    const dbClient = isAdminUser
      ? (await import('@/utils/supabase/server')).createAdminClient()
      : supabase

    // Insert the tool
    const { data: tool, error } = await dbClient
      .from('ai_tools')
      .insert({
        ...body,
        slug,
        submitted_by: session.user.id,
        status: isAdminUser && body.status ? body.status : 'pending', // Admins can set status
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
      throw error
    }

    return Response.json(tool, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating tool - Full details:', error)
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Database error code:', (error as { code: string }).code)
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to create tool'
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log('[PUT /api/directory/tools] Session:', session ? 'exists' : 'null')
    console.log('[PUT /api/directory/tools] User email:', session?.user?.email)

    if (!session) {
      console.error('[PUT /api/directory/tools] No session found')
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin status
    const { isAdmin } = await import('@/utils/admin')
    const adminStatus = isAdmin(session.user.email)
    console.log('[PUT /api/directory/tools] Admin status:', adminStatus)

    if (!adminStatus) {
      console.error('[PUT /api/directory/tools] User is not admin:', session.user.email)
      return Response.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    const body = await request.json()
    console.log('[PUT /api/directory/tools] Request body keys:', Object.keys(body))
    console.log('[PUT /api/directory/tools] Tool ID:', body.id)

    const { id, ...updates } = body

    if (!id) {
      console.error('[PUT /api/directory/tools] Missing tool ID')
      return Response.json({ error: 'Missing tool ID' }, { status: 400 })
    }

    // Remove any undefined or null values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined && v !== null),
    )

    console.log('[PUT /api/directory/tools] Clean updates keys:', Object.keys(cleanUpdates))

    // Use admin client to bypass RLS for admin users
    const { createAdminClient } = await import('@/utils/supabase/server')
    const adminClient = createAdminClient()

    // Update the tool using admin client
    const { data: tool, error } = await adminClient
      .from('ai_tools')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[PUT /api/directory/tools] Supabase update error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      throw error
    }

    console.log('[PUT /api/directory/tools] Update successful, tool:', tool?.name)
    return Response.json(tool)
  } catch (error: unknown) {
    console.error('[PUT /api/directory/tools] Error updating tool:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update tool'
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
