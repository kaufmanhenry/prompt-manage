import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { canUserCreatePrompt, getUserSubscription, getUserUsage } from '@/lib/subscription'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, prompt_text, model, tags, description, is_public, team_id } = body

    if (!name || !prompt_text) {
      return NextResponse.json({ error: 'Name and prompt text are required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get user - must be logged in to create prompts
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check subscription and usage limits BEFORE creating prompt
    const [subscription, usage] = await Promise.all([
      getUserSubscription(user.id),
      getUserUsage(user.id),
    ])

    if (!canUserCreatePrompt(subscription, usage, user.email)) {
      return NextResponse.json(
        {
          error: 'Prompt limit reached',
          details:
            subscription?.status === 'past_due' || subscription?.status === 'unpaid'
              ? 'Your payment failed. Please update your payment method to continue using premium features.'
              : subscription?.status === 'canceled'
                ? 'Your subscription was canceled. Resubscribe to continue using premium features.'
                : usage.promptsTotal >= 25
                  ? 'You have reached your prompt limit (25 prompts). Please upgrade to Team or Pro plan for unlimited prompts, or delete existing prompts to create more.'
                  : 'You have reached your prompt limit. Please upgrade to continue creating prompts.',
        },
        { status: 403 },
      )
    }

    // Create the prompt
    const promptData = {
      name,
      prompt_text,
      model: model || 'gpt-4o-mini',
      tags: tags || [],
      description: description || null,
      user_id: user.id,
      team_id: team_id || null,
      is_public: is_public || false,
    }

    const { data: prompt, error: insertError } = await supabase
      .from('prompts')
      .insert(promptData)
      .select()
      .single()

    if (insertError) {
      console.error('Error creating prompt:', insertError)
      return NextResponse.json({ error: 'Failed to create prompt' }, { status: 500 })
    }

    return NextResponse.json({ prompt }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/prompts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
