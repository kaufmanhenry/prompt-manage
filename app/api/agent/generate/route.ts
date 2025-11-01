import { NextResponse } from 'next/server'

import { isAdminEmail } from '@/lib/admin'
import { generateAgentPrompt } from '@/lib/agent/generator'
import { createClient } from '@/utils/supabase/server'

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
    const { agent_id, topics, batch_size = 1 } = body

    if (!agent_id) {
      return NextResponse.json({ error: 'agent_id is required' }, { status: 400 })
    }

    // Get agent details (select only needed fields)
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id, name, keywords, category, output_type, is_active, brand_guidelines, quality_standards')
      .eq('id', agent_id)
      .single()

    if (agentError || !agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    if (!agent.is_active) {
      return NextResponse.json({ error: 'Agent is not active' }, { status: 400 })
    }

    // Get keywords to process
    let keywordsToProcess: Array<{ keyword: string; topic: string; category?: string }> = []

    if (topics && Array.isArray(topics)) {
      // Use provided topics
      keywordsToProcess = topics.map((t: string | { keyword: string; topic?: string }) => {
        if (typeof t === 'string') {
          return { keyword: t, topic: t }
        }
        return { keyword: t.keyword, topic: t.topic || t.keyword }
      })
    } else {
      // Fetch active keywords from database
      const { data: keywords } = await supabase
        .from('agent_keywords')
        .select('keyword, category')
        .eq('agent_id', agent_id)
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('last_generated_at', { ascending: true, nullsFirst: true })
        .limit(batch_size)

      if (!keywords || keywords.length === 0) {
        return NextResponse.json({ error: 'No active keywords found' }, { status: 400 })
      }

      keywordsToProcess = keywords.map((k) => ({
        keyword: k.keyword,
        topic: k.keyword,
        category: k.category || undefined,
      }))
    }

    const results = []

    // Generate prompts for each keyword
    for (const item of keywordsToProcess.slice(0, batch_size)) {
      try {
        const result = await generateAgentPrompt({
          topic: item.topic,
          keyword: item.keyword,
          category: item.category,
          temperature: agent.temperature || 0.7,
        })

        // Determine status based on quality and agent mode
        let status: 'draft' | 'review' | 'approved' | 'published' | 'rejected' = 'draft'
        if (result.quality.score >= agent.quality_threshold) {
          status = agent.mode === 'autonomous' ? 'published' : 'review'
        } else {
          status = 'rejected'
        }

        // Create prompt in database if approved/published
        let prompt_id: string | null = null
        if (status === 'published' || status === 'review') {
          const { data: createdPrompt, error: promptError } = await supabase
            .from('prompts')
            .insert({
              user_id: agent.owner_id,
              team_id: agent.team_id,
              name: result.prompt.name,
              description: result.prompt.description,
              prompt_text: result.prompt.prompt_text,
              model: result.prompt.model || 'gpt-5',
              tags: result.prompt.tags || [],
              is_public: status === 'published',
              agent_id: agent.id,
            })
            .select('id')
            .single()

          if (!promptError && createdPrompt) {
            prompt_id = createdPrompt.id
            if (status === 'published') {
              // Already marked as published in autonomous mode
            } else if (status === 'review') {
              // Will be reviewed manually
            }
          }
        }

        // Save agent_prompt record
        const { data: agentPrompt, error: agentPromptError } = await supabase
          .from('agent_prompts')
          .insert({
            agent_id: agent.id,
            prompt_id,
            topic: item.topic,
            keyword: item.keyword,
            raw_input: result.raw_input,
            raw_output: result.raw_output,
            quality_score: result.quality.score,
            status,
            metadata: result.prompt.metadata || {},
          })
          .select()
          .single()

        // Update keyword generation count
        if (item.keyword) {
          const { data: keyword } = await supabase
            .from('agent_keywords')
            .select('generated_count')
            .eq('keyword', item.keyword)
            .eq('agent_id', agent.id)
            .single()

          await supabase
            .from('agent_keywords')
            .update({
              generated_count: (keyword?.generated_count || 0) + 1,
              last_generated_at: new Date().toISOString(),
            })
            .eq('keyword', item.keyword)
            .eq('agent_id', agent.id)
        }

        results.push({
          success: true,
          agent_prompt_id: agentPrompt?.id,
          prompt_id,
          topic: item.topic,
          keyword: item.keyword,
          quality_score: result.quality.score,
          status,
        })
      } catch (error) {
        console.error(`Error generating prompt for ${item.keyword}:`, error)
        results.push({
          success: false,
          topic: item.topic,
          keyword: item.keyword,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      generated: results.length,
      results,
    })
  } catch (error) {
    console.error('Agent generation error:', error)
    // Hide detailed errors in production for security
    const errorMessage =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

