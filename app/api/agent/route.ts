import { NextResponse } from 'next/server'

import { isAdminEmail } from '@/lib/admin'
import { createClient } from '@/utils/supabase/server'

// GET: List all agents
export async function GET(_request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('agents')
      .select('id, name, description, category, output_type, is_active, mode, temperature, quality_threshold, owner_id, team_id, created_at, updated_at')
      .eq('owner_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ agents: data || [] })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching agents:', error)
    }
    const errorMessage =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// POST: Create a new agent
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
    const { name, team_id, mode, temperature, quality_threshold } = body

    // Create agent
    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        name: name || 'PromptManage Agent',
        owner_id: session.user.id,
        team_id: team_id || null,
        mode: mode || 'review',
        temperature: temperature || 0.7,
        quality_threshold: quality_threshold || 85,
        is_active: true,
      })
      .select('id, name, description, category, output_type, is_active, mode, temperature, quality_threshold, owner_id, team_id, created_at, updated_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Insert default keywords if provided
    if (body.keywords && Array.isArray(body.keywords)) {
      const keywordRecords = body.keywords.map((k: string | { keyword: string; category?: string }) => {
        if (typeof k === 'string') {
          return {
            agent_id: agent.id,
            keyword: k,
            category: null,
            priority: 50,
            is_active: true,
          }
        }
        return {
          agent_id: agent.id,
          keyword: k.keyword,
          category: k.category || null,
          priority: 50,
          is_active: true,
        }
      })

      await supabase.from('agent_keywords').insert(keywordRecords)
    }

    return NextResponse.json({ agent })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating agent:', error)
    }
    const errorMessage =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

