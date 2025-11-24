import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const model = searchParams.get('model') || 'all'
    const tag = searchParams.get('tag') || 'all'
    const sortBy = searchParams.get('sortBy') || 'recent'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '21')

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          error: 'Database not configured',
          prompts: [],
          totalCount: 0,
          page,
          limit,
          totalPages: 0,
        },
        { status: 503 },
      )
    }

    const supabase = await createClient()

    // Build query - only select needed fields for performance
    // Note: We'll calculate copy_count via subquery
    let query = supabase
      .from('prompts')
      .select(
        'id, name, slug, description, prompt_text, model, tags, view_count, inserted_at, updated_at',
        {
          count: 'exact',
        },
      )
      .eq('is_public', true)

    // Apply filters
    if (model !== 'all') {
      query = query.eq('model', model)
    }

    if (tag !== 'all') {
      query = query.contains('tags', [tag])
    }

    if (search.trim()) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    if (sortBy === 'recent') {
      query = query.order('updated_at', { ascending: false })
    } else {
      query = query.order('view_count', { ascending: false })
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Database error:', error)
      }
      return NextResponse.json(
        {
          error: 'Failed to fetch prompts',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 500 },
      )
    }

    // Fetch copy counts for all prompts in this batch
    const promptIds = (data || []).map((p) => p.id)
    const { data: copyCounts } = await supabase
      .from('prompts')
      .select('parent_prompt_id')
      .in('parent_prompt_id', promptIds)

    // Count copies per prompt
    const copyCountMap = new Map<string, number>()
    copyCounts?.forEach((copy) => {
      if (copy.parent_prompt_id) {
        copyCountMap.set(copy.parent_prompt_id, (copyCountMap.get(copy.parent_prompt_id) || 0) + 1)
      }
    })

    // Transform data to ensure all required fields exist
    const transformedData = (data || []).map((prompt) => ({
      ...prompt,
      description: prompt.description || null,
      prompt_text: prompt.prompt_text || '', // Ensure prompt_text exists
      is_public: true, // All results are public
      slug: prompt.slug || prompt.id, // Fallback to ID if no slug
      view_count: prompt.view_count || 0,
      copy_count: copyCountMap.get(prompt.id) || 0, // Add copy count
      inserted_at: prompt.inserted_at || prompt.updated_at || null,
    }))

    const response = NextResponse.json({
      prompts: transformedData,
      totalCount: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')

    return response
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('API error:', error)
    }
    return NextResponse.json(
      {
        error: 'Internal server error',
        details:
          process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    )
  }
}
