import { NextResponse } from 'next/server'

import { isAdminEmail } from '@/lib/admin'
import { createClient } from '@/utils/supabase/server'

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { agent_prompt_id, action } = body // action: 'approve', 'reject', 'publish', 'unpublish'

    if (!agent_prompt_id || !action) {
      return NextResponse.json({ error: 'agent_prompt_id and action are required' }, { status: 400 })
    }

      // Get agent prompt (select only needed fields)
    const { data: agentPrompt, error: fetchError } = await supabase
      .from('agent_prompts')
      .select('id, agent_id, prompt_id, status, raw_output, topic, agents(owner_id, team_id)')
      .eq('id', agent_prompt_id)
      .single()

    if (fetchError || !agentPrompt) {
      return NextResponse.json({ error: 'Agent prompt not found' }, { status: 404 })
    }

    // Verify ownership
    const agent = agentPrompt.agents
    if (!agent || agent.owner_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (action === 'publish') {
      if (!agentPrompt.prompt_id) {
        // Need to create the prompt first (select only needed fields)
        const { data: agentData } = await supabase
          .from('agents')
          .select('id, owner_id, team_id')
          .eq('id', agentPrompt.agent_id)
          .single()

        if (!agentData) {
          return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
        }

        // Parse the generated prompt from metadata or raw_output
        let promptData: any = {}
        try {
          if (agentPrompt.raw_output) {
            promptData = JSON.parse(agentPrompt.raw_output)
          }
        } catch {
          return NextResponse.json({ error: 'Invalid prompt data' }, { status: 400 })
        }

        const { data: createdPrompt, error: createError } = await supabase
          .from('prompts')
          .insert({
            user_id: agentData.owner_id,
            team_id: agentData.team_id,
            name: promptData.name || agentPrompt.topic,
            description: promptData.description || '',
            prompt_text: promptData.prompt_text || '',
            model: promptData.model || 'gpt-5',
            tags: promptData.tags || [],
            is_public: true,
            agent_id: agentData.id,
          })
          .select('id')
          .single()

        if (createError) {
          return NextResponse.json({ error: createError.message }, { status: 500 })
        }

        // Update agent_prompt with prompt_id and status
        await supabase
          .from('agent_prompts')
          .update({
            prompt_id: createdPrompt.id,
            status: 'published',
          })
          .eq('id', agent_prompt_id)
      } else {
        // Update existing prompt to public
        await supabase.from('prompts').update({ is_public: true }).eq('id', agentPrompt.prompt_id)

        // Update agent_prompt status
        await supabase
          .from('agent_prompts')
          .update({ status: 'published' })
          .eq('id', agent_prompt_id)
      }
    } else if (action === 'unpublish') {
      if (agentPrompt.prompt_id) {
        await supabase.from('prompts').update({ is_public: false }).eq('id', agentPrompt.prompt_id)
        await supabase
          .from('agent_prompts')
          .update({ status: 'review' })
          .eq('id', agent_prompt_id)
      }
    } else if (action === 'approve') {
      await supabase
        .from('agent_prompts')
        .update({ status: 'approved' })
        .eq('id', agent_prompt_id)
    } else if (action === 'reject') {
      await supabase
        .from('agent_prompts')
        .update({ status: 'rejected' })
        .eq('id', agent_prompt_id)
    }

    return NextResponse.json({ success: true, action })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating agent prompt:', error)
    }
    const errorMessage =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

