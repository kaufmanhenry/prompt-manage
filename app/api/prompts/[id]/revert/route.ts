import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { revertPromptRequestSchema } from '@/lib/types/prompt-versions'
import { createClient } from '@/utils/supabase/server'

// POST /api/prompts/[id]/revert - Revert prompt to a previous version
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

    // Validate request body
    const validationResult = revertPromptRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.errors,
        },
        { status: 400 },
      )
    }

    const { target_version } = validationResult.data

    // Verify the prompt belongs to the user
    const { data: prompt, error: promptError } = await supabase
      .from('prompts')
      .select('id, user_id, is_public, version')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (promptError || !prompt) {
      return NextResponse.json({ error: 'Prompt not found or access denied' }, { status: 404 })
    }

    // Check if trying to revert to current version
    if (target_version === prompt.version) {
      return NextResponse.json(
        {
          error: 'Already at the specified version',
        },
        { status: 400 },
      )
    }

    // Check if trying to revert to a future version
    if (target_version > prompt.version) {
      return NextResponse.json(
        {
          error: 'Cannot revert to a future version',
        },
        { status: 400 },
      )
    }

    // Use the database function to revert the prompt
    const { data: success, error: revertError } = await supabase.rpc('revert_prompt_to_version', {
      prompt_id: id,
      target_version,
    })

    if (revertError) {
      console.error('Revert error:', revertError)
      return NextResponse.json({ error: 'Failed to revert prompt' }, { status: 500 })
    }

    if (!success) {
      return NextResponse.json({ error: 'Revert operation failed' }, { status: 500 })
    }

    // Get the updated prompt with new version number
    const { data: updatedPrompt, error: fetchError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !updatedPrompt) {
      return NextResponse.json({ error: 'Failed to fetch updated prompt' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      new_version: updatedPrompt.version,
      prompt: updatedPrompt,
    })
  } catch (error) {
    console.error('Revert prompt API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
