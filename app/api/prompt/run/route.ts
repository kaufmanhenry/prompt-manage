import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

import { createClient } from '@/utils/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { promptId } = await request.json()

    if (!promptId) {
      return NextResponse.json(
        { error: 'Prompt ID is required' },
        { status: 400 }
      )
    }

    // Fetch the prompt and verify ownership
    const { data: prompt, error: fetchError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Call OpenAI API with the prompt content
    const completion = await openai.chat.completions.create({
      model: prompt.model,
      messages: [
        {
          role: 'user',
          content: prompt.prompt_text,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response =
      completion.choices[0]?.message?.content || 'No response generated'
    const executionTime = Date.now() - startTime
    const tokensUsed = completion.usage?.total_tokens || null

    // Log the prompt run to history
    const { error: logError } = await supabase.rpc('log_prompt_run', {
      p_prompt_id: promptId,
      p_prompt_text: prompt.prompt_text,
      p_response: response,
      p_model: prompt.model,
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
        id: prompt.id,
        name: prompt.name,
        prompt_text: prompt.prompt_text,
      },
      execution_time_ms: executionTime,
      tokens_used: tokensUsed,
    })
  } catch (error) {
    const executionTime = Date.now() - startTime
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

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
            .eq('user_id', user.id)
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
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
