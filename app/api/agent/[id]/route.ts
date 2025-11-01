import { NextResponse } from 'next/server'

import { isAdminEmail } from '@/lib/admin'
import { createClient } from '@/utils/supabase/server'

// GET: Get agent details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('agents')
      .select('id, name, description, category, output_type, keywords, is_active, mode, temperature, quality_threshold, owner_id, team_id, brand_guidelines, quality_standards, created_at, updated_at')
      .eq('id', resolvedParams.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.owner_id !== session.user.id) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json({ agent: data })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching agent:', error)
    }
    const errorMessage =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// PATCH: Update agent settings
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()

    // Verify ownership
    const { data: agent } = await supabase
      .from('agents')
      .select('owner_id')
      .eq('id', resolvedParams.id)
      .single()

    if (!agent || agent.owner_id !== session.user.id) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Update agent
    const updates: any = {}
    if (body.name !== undefined) updates.name = body.name
    if (body.mode !== undefined) updates.mode = body.mode
    if (body.is_active !== undefined) updates.is_active = body.is_active
    if (body.temperature !== undefined) updates.temperature = body.temperature
    if (body.quality_threshold !== undefined) updates.quality_threshold = body.quality_threshold

    const { data, error } = await supabase
      .from('agents')
      .update(updates)
      .eq('id', resolvedParams.id)
      .select('id, name, description, category, output_type, keywords, is_active, mode, temperature, quality_threshold, owner_id, team_id, brand_guidelines, quality_standards, created_at, updated_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ agent: data })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating agent:', error)
    }
    const errorMessage =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// DELETE: Delete agent
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Verify ownership
    const { data: agent } = await supabase
      .from('agents')
      .select('owner_id')
      .eq('id', resolvedParams.id)
      .single()

    if (!agent || agent.owner_id !== session.user.id) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const { error } = await supabase.from('agents').delete().eq('id', resolvedParams.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error deleting agent:', error)
    }
    const errorMessage =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

