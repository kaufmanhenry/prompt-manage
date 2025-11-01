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

    if (!agent_id) {
      return NextResponse.json({ error: 'agent_id is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('agent_keywords')
      .select('id, agent_id, keyword, category, priority, is_active, last_generated_at, created_at')
      .eq('agent_id', agent_id)
      .order('priority', { ascending: false })
      .order('last_generated_at', { ascending: true, nullsFirst: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ keywords: data || [] })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching keywords:', error)
    }
    const errorMessage =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { agent_id, keywords } = body

    if (!agent_id || !keywords || !Array.isArray(keywords)) {
      return NextResponse.json(
        { error: 'agent_id and keywords array are required' },
        { status: 400 },
      )
    }

    // Verify agent ownership
    const { data: agent } = await supabase
      .from('agents')
      .select('owner_id')
      .eq('id', agent_id)
      .single()

    if (!agent || agent.owner_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Insert keywords (using upsert to handle duplicates)
    const keywordRecords = keywords.map(
      (k: string | { keyword: string; category?: string; priority?: number }) => {
        if (typeof k === 'string') {
          return {
            agent_id,
            keyword: k,
            category: null,
            priority: 50,
            is_active: true,
          }
        }
        return {
          agent_id,
          keyword: k.keyword,
          category: k.category || null,
          priority: k.priority || 50,
          is_active: true,
        }
      },
    )

    const { data, error } = await supabase.from('agent_keywords').upsert(keywordRecords, {
      onConflict: 'agent_id,keyword',
      ignoreDuplicates: false,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, keywords: data })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating keywords:', error)
    }
    const errorMessage =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const keyword_id = searchParams.get('keyword_id')

    if (!keyword_id) {
      return NextResponse.json({ error: 'keyword_id is required' }, { status: 400 })
    }

    // Verify ownership via agent
    const { data: keyword } = await supabase
      .from('agent_keywords')
      .select('agents(owner_id)')
      .eq('id', keyword_id)
      .single()

    interface KeywordWithAgent {
      agents: {
        owner_id: string
      } | null
    }

    if (!keyword || (keyword as unknown as KeywordWithAgent).agents?.owner_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await supabase.from('agent_keywords').delete().eq('id', keyword_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error deleting keyword:', error)
    }
    const errorMessage =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
