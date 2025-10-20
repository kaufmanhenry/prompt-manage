import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

// GET /api/prompts/[id]/versions - Get version history for a prompt
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id } = await context.params

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the prompt to verify access
    const { data: prompt, error: promptError } = await supabase
      .from('prompts')
      .select('id, user_id, is_public')
      .eq('id', id)
      .single()

    if (promptError || !prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Check if user can access this prompt
    const canAccess = prompt.user_id === user.id || prompt.is_public
    if (!canAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get version history using the database function
    const { data: versions, error: versionsError } = await supabase
      .rpc('get_prompt_version_history', { prompt_id: id })

    if (versionsError) {
      console.error('Error fetching version history:', versionsError)
      return NextResponse.json({ error: 'Failed to fetch version history' }, { status: 500 })
    }

    // Get current version info
    const { data: currentPrompt } = await supabase
      .from('prompts')
      .select('version')
      .eq('id', id)
      .single()

    return NextResponse.json({
      success: true,
      versions: versions || [],
      current_version: currentPrompt?.version || 1,
      total_versions: versions?.length || 0,
    })
  } catch (error) {
    console.error('Version history API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/prompts/[id]/versions - Create a new version (with change summary)
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { id } = await context.params

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { change_summary: _change_summary } = body

    // Verify the prompt belongs to the user
    const { data: prompt, error: promptError } = await supabase
      .from('prompts')
      .select('id, user_id, is_public')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (promptError || !prompt) {
      return NextResponse.json({ error: 'Prompt not found or access denied' }, { status: 404 })
    }

    // Check if prompt is public (can't edit)
    if (prompt.is_public) {
      return NextResponse.json({ 
        error: 'Public prompts cannot be edited. Use "Duplicate & Edit" to create a copy.' 
      }, { status: 400 })
    }

    // The version will be created automatically by the database trigger
    // when the prompt is updated. This endpoint is for providing change summary.
    // We'll store the change summary in a way that the trigger can access it.
    
    // For now, we'll just return success - the actual version creation
    // happens when the prompt is updated via the main prompt update endpoint
    
    return NextResponse.json({
      success: true,
      message: 'Version will be created when prompt is updated',
    })
  } catch (error) {
    console.error('Create version API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
