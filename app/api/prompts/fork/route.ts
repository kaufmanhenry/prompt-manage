import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import { forkPromptRequestSchema } from '@/lib/types/prompt-versions'

// POST /api/prompts/fork - Fork a public prompt
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate request body
    const validationResult = forkPromptRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid request data',
        details: validationResult.error.errors 
      }, { status: 400 })
    }

    const { source_prompt_id, new_name, new_description } = validationResult.data

    // Verify the source prompt exists and is public
    const { data: sourcePrompt, error: sourceError } = await supabase
      .from('prompts')
      .select('id, name, description, prompt_text, model, tags, is_public, user_id')
      .eq('id', source_prompt_id)
      .single()

    if (sourceError || !sourcePrompt) {
      return NextResponse.json({ error: 'Source prompt not found' }, { status: 404 })
    }

    if (!sourcePrompt.is_public) {
      return NextResponse.json({ error: 'Can only fork public prompts' }, { status: 400 })
    }

    // Check if user is trying to fork their own prompt
    if (sourcePrompt.user_id === user.id) {
      return NextResponse.json({ 
        error: 'You cannot fork your own prompt. Edit it directly instead.' 
      }, { status: 400 })
    }

    // Use the database function to fork the prompt
    const { data: newPromptId, error: forkError } = await supabase
      .rpc('fork_public_prompt', {
        source_prompt_id,
        new_name,
        new_description: new_description || null
      })

    if (forkError) {
      console.error('Fork error:', forkError)
      return NextResponse.json({ error: 'Failed to fork prompt' }, { status: 500 })
    }

    // Get the newly created prompt
    const { data: newPrompt, error: fetchError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', newPromptId)
      .single()

    if (fetchError || !newPrompt) {
      return NextResponse.json({ error: 'Failed to fetch forked prompt' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      new_prompt_id: newPromptId,
      prompt: newPrompt,
    })
  } catch (error) {
    console.error('Fork prompt API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
