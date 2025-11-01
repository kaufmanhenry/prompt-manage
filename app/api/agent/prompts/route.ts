import { NextResponse } from 'next/server'

import { isAdminEmail } from '@/lib/admin'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const agent_id = searchParams.get('agent_id')
    const status = searchParams.get('status')
    const keyword = searchParams.get('keyword')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('agent_prompts')
      .select(
        `
        *,
        prompts(id, name, slug, is_public, view_count),
        agents(id, name)
      `,
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (agent_id) {
      query = query.eq('agent_id', agent_id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (keyword) {
      query = query.or(`keyword.ilike.%${keyword}%,topic.ilike.%${keyword}%`)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get count
    let countQuery = supabase.from('agent_prompts').select('id', { count: 'exact', head: true })

    if (agent_id) {
      countQuery = countQuery.eq('agent_id', agent_id)
    }

    if (status) {
      countQuery = countQuery.eq('status', status)
    }

    const { count } = await countQuery

    return NextResponse.json({
      prompts: data || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching agent prompts:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
