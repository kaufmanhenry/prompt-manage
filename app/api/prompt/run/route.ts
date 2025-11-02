import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

import { getValidatedUserId } from '@/lib/auth-utils'
import { canUserRunPrompt, getUserSubscription, getUserUsage } from '@/lib/subscription'
import { createClient } from '@/utils/supabase/server'

// Initialize OpenAI client only when needed
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let userId: string | null = null

  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError) throw authError

    userId = getValidatedUserId(user)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check rate limits before proceeding
    const [subscription, usage] = await Promise.all([
      getUserSubscription(userId),
      getUserUsage(userId),
    ])

    const rateLimitCheck = canUserRunPrompt(subscription, usage, user?.email)

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Monthly prompt run limit reached',
          message: `You've reached your monthly limit of ${rateLimitCheck.limit} prompt runs. Upgrade your plan to run more prompts.`,
          limit: rateLimitCheck.limit,
          remaining: 0,
          upgradeUrl: '/pricing',
        },
        { status: 429 },
      )
    }

    const { promptId, promptText } = await request.json()

    if (!promptId) {
      return NextResponse.json({ error: 'Prompt ID is required' }, { status: 400 })
    }

    // Fetch the prompt and verify ownership
    const { data: prompt, error: fetchError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Update prompt text if provided and different from current
    let updatedPrompt = prompt
    if (promptText && promptText !== prompt.prompt_text) {
      const { data: updatedData, error: updateError } = await supabase
        .from('prompts')
        .update({ prompt_text: promptText })
        .eq('id', promptId)
        .eq('user_id', userId)
        .select('*')
        .single()

      if (updateError) {
        console.error('Failed to update prompt text:', updateError)
        return NextResponse.json({ error: 'Failed to update prompt text' }, { status: 500 })
      }

      updatedPrompt = updatedData
    }

    // Enforce model defaults and input truncation
    const MAX_INPUT_CHARS = 6000
    const safePromptText = String(updatedPrompt.prompt_text || '').slice(0, MAX_INPUT_CHARS)
    const model = updatedPrompt.model || 'gpt-4o-mini'

    // Call OpenAI API with the prompt content
    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: safePromptText,
        },
      ],
      max_completion_tokens: 500,
      temperature: 0.6,
    })

    const response = completion.choices[0]?.message?.content || 'No response generated'
    const executionTime = Date.now() - startTime
    const tokensUsed = completion.usage?.total_tokens || null

    // Log the prompt run to history
    const { error: logError } = await supabase.rpc('log_prompt_run', {
      p_prompt_id: promptId,
      p_prompt_text: updatedPrompt.prompt_text,
      p_response: response,
      p_model: model,
      p_tokens_used: tokensUsed,
      p_execution_time_ms: executionTime,
      p_status: 'success',
      p_error_message: null,
    })

    if (logError) {
      console.error('Failed to log prompt run:', logError)
      // Don't fail the request if logging fails, just log the error
    }

    return NextResponse.json({
      success: true,
      response,
      prompt: {
        id: updatedPrompt.id,
        name: updatedPrompt.name,
        prompt_text: updatedPrompt.prompt_text,
      },
      execution_time_ms: executionTime,
      tokens_used: tokensUsed,
      usage: {
        runsThisMonth: usage.promptRunsThisMonth + 1, // Include this run
        limit: rateLimitCheck.limit,
        remaining: rateLimitCheck.remaining - 1, // After this run
      },
    })
  } catch (error) {
    const executionTime = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Log the failed prompt run
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { promptId } = await request.json().catch(() => ({}))
        if (promptId) {
          const { data: prompt } = await supabase
            .from('prompts')
            .select('prompt_text, model')
            .eq('id', promptId)
            .eq('user_id', userId)
            .single()

          if (prompt) {
            await supabase.rpc('log_prompt_run', {
              p_prompt_id: promptId,
              p_prompt_text: prompt.prompt_text,
              p_response: 'Execution failed',
              p_model: prompt.model,
              p_tokens_used: null,
              p_execution_time_ms: executionTime,
              p_status: 'error',
              p_error_message: errorMessage,
            })
          }
        }
      }
    } catch (logError) {
      console.error('Failed to log failed prompt run:', logError)
    }

    console.error('Run prompt API error:', error)

    // Handle OpenAI-specific errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json({ error: `OpenAI API error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
