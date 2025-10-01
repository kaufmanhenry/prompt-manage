import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const { prompt, context } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Create the prompt improvement request
    const promptImprovementRequest = `You are an expert prompt engineer. I want you to improve this prompt to make it more effective and specific.

Original prompt: "${prompt}"

${context ? `Additional context: ${context}` : ''}

Please provide an improved version of this prompt that:
1. Is more specific and actionable
2. Uses better structure and formatting
3. Includes clear instructions for the AI
4. Incorporates the context effectively
5. Follows prompt engineering best practices

Return only the improved prompt, no explanations.`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: promptImprovementRequest,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'No response generated'
    const executionTime = Date.now() - startTime
    const tokensUsed = completion.usage?.total_tokens || null

    return NextResponse.json({
      success: true,
      response,
      execution_time_ms: executionTime,
      tokens_used: tokensUsed,
    })
  } catch (error) {
    const executionTime = Date.now() - startTime
    console.error('Prompt improvement error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        execution_time_ms: executionTime,
      },
      { status: 500 },
    )
  }
}
