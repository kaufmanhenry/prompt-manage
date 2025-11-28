import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  canUserCreatePrompt,
  getSubscriptionStatusMessage,
  getUserSubscription,
  getUserUsage,
} from '@/lib/subscription'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, prompt_text, model, tags, description, toolName } = body

    if (!name || !prompt_text) {
      return NextResponse.json({ error: 'Name and prompt text required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get user - must be logged in to save
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'You must be logged in to save prompts' }, { status: 401 })
    }

    // Check subscription and usage limits
    const [subscription, usage] = await Promise.all([
      getUserSubscription(user.id),
      getUserUsage(user.id),
    ])

    if (!canUserCreatePrompt(subscription, usage, user.email)) {
      // Use centralized status message for subscription issues
      const statusMessage = getSubscriptionStatusMessage(subscription)
      const details =
        statusMessage ||
        'You have reached your prompt limit. Please upgrade to continue creating prompts.'

      return NextResponse.json(
        {
          error: 'Prompt limit reached',
          details,
        },
        { status: 403 },
      )
    }

    // Save the prompt to the database
    const { data: prompt, error: insertError } = await supabase
      .from('prompts')
      .insert({
        user_id: user.id,
        name: name.trim(),
        prompt_text: prompt_text.trim(),
        description: description?.trim() || null,
        model: model || 'gpt-4o',
        tags: tags || [],
        is_public: false, // Default to private
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error saving prompt:', insertError)
      return NextResponse.json(
        { error: 'Failed to save prompt', details: insertError.message },
        { status: 500 },
      )
    }

    // Update the free_tool_usage record to mark it as saved
    if (toolName) {
      await supabase
        .from('free_tool_usage')
        .update({ saved_to_library: true })
        .eq('user_id', user.id)
        .eq('tool_name', toolName)
        .eq('saved_to_library', false)
        .order('created_at', { ascending: false })
        .limit(1)
    }

    return NextResponse.json({
      success: true,
      prompt: prompt,
    })
  } catch (error) {
    console.error('Save prompt error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
