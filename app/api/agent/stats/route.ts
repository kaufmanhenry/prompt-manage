import { NextResponse } from 'next/server'

import { isAdminEmail } from '@/utils/admin'
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

    // Get agent (select only needed fields)
    const { data: agent } = await supabase
      .from('agents')
      .select('id, name, mode, is_active, owner_id')
      .eq('id', agent_id)
      .single()

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Get prompt counts by status
    const { data: promptCounts } = await supabase
      .from('agent_prompts')
      .select('status')
      .eq('agent_id', agent_id)

    const counts = {
      total: promptCounts?.length || 0,
      draft: promptCounts?.filter((p) => p.status === 'draft').length || 0,
      review: promptCounts?.filter((p) => p.status === 'review').length || 0,
      approved: promptCounts?.filter((p) => p.status === 'approved').length || 0,
      published: promptCounts?.filter((p) => p.status === 'published').length || 0,
      rejected: promptCounts?.filter((p) => p.status === 'rejected').length || 0,
      failed: promptCounts?.filter((p) => p.status === 'failed').length || 0,
    }

    // Get average quality score
    const { data: scores } = await supabase
      .from('agent_prompts')
      .select('quality_score')
      .eq('agent_id', agent_id)
      .not('quality_score', 'is', null)

    const avgQuality =
      scores && scores.length > 0
        ? scores.reduce((sum, s) => sum + (s.quality_score || 0), 0) / scores.length
        : 0

    // Get prompts generated today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count: todayCount } = await supabase
      .from('agent_prompts')
      .select('id', { count: 'exact', head: true })
      .eq('agent_id', agent_id)
      .gte('created_at', today.toISOString())

    // Get prompts generated this week
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const { count: weekCount } = await supabase
      .from('agent_prompts')
      .select('id', { count: 'exact', head: true })
      .eq('agent_id', agent_id)
      .gte('created_at', weekAgo.toISOString())

    // Get keyword stats
    const { data: keywords } = await supabase
      .from('agent_keywords')
      .select('keyword, generated_count, last_generated_at')
      .eq('agent_id', agent_id)
      .eq('is_active', true)
      .order('generated_count', { ascending: false })
      .limit(10)

    return NextResponse.json({
      agent: {
        id: agent.id,
        name: agent.name,
        mode: agent.mode,
        is_active: agent.is_active,
      },
      stats: {
        ...counts,
        average_quality: Math.round(avgQuality * 100) / 100,
        generated_today: todayCount || 0,
        generated_this_week: weekCount || 0,
      },
      top_keywords: keywords || [],
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching agent stats:', error)
    }
    const errorMessage =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
