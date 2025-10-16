import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'

import { isAdminEmail } from '@/lib/admin'
import { agentConfigCache } from '@/lib/agent-config-cache'
import { createClient } from '@/utils/supabase/server'

// Check admin access for agent management
async function checkAdminAccess(_request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Unauthorized', status: 401 }
  }
  
  if (!isAdminEmail(user.email)) {
    return { error: 'Admin access required', status: 403 }
  }
  
  return { user }
}

// Agent management API
export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const adminCheck = await checkAdminAccess(request)
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const supabase = await createClient()

    // Get all agents with their metrics
    const { data: agents, error } = await supabase
      .from('agents')
      .select(`
        *,
        agent_generations(count),
        agent_metrics(
          date,
          prompts_generated,
          total_cost_usd,
          avg_quality_score,
          prompts_published,
          total_views
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching agents:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ agents })
  } catch (error) {
    console.error('Agent management error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const adminCheck = await checkAdminAccess(request)
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const body = await request.json()
    const { name, description, strategy, department, config } = body
    
    if (!name || !strategy) {
      return NextResponse.json({ error: 'Name and strategy required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Merge all config fields into the config object
    const agentConfig = {
      ...(config || {}),
      // Include all the advanced fields from the form
      output_type: body.output_type,
      target_audience: body.target_audience,
      tone: body.tone,
      length_preference: body.length_preference,
      output_format: body.output_format,
      brand_guidelines: body.brand_guidelines,
      quality_standards: body.quality_standards,
      required_elements: body.required_elements,
      key_phrases: body.key_phrases,
      forbidden_phrases: body.forbidden_phrases,
      style_guide: body.style_guide,
      examples: body.examples,
      review_required: body.review_required,
      min_quality_score: body.min_quality_score,
    }

    const { data, error } = await supabase
      .from('agents')
      .insert({
        name,
        description,
        strategy,
        department: department || 'general',
        config: agentConfig,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating agent:', error)
      return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ agent: data })
  } catch (error) {
    console.error('Agent creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check admin access
    const adminCheck = await checkAdminAccess(request)
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const { id, ...updates } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Agent ID required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('agents')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating agent:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Invalidate cache for this agent since config changed
    agentConfigCache.invalidate(id)

    return NextResponse.json({ agent: data })
  } catch (error) {
    console.error('Agent update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin access
    const adminCheck = await checkAdminAccess(request)
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Agent ID required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting agent:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Invalidate cache for deleted agent
    agentConfigCache.invalidate(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Agent deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
