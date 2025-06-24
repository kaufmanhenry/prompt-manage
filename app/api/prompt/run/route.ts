import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: 'Prompt ID is required' }, { status: 400 })
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
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt.prompt_text,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'No response generated'

    return NextResponse.json({
      success: true,
      response,
      prompt: {
        id: prompt.id,
        name: prompt.name,
        prompt_text: prompt.prompt_text,
      },
    })
  } catch (error) {
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