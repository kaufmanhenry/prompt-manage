import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

import { logAuditEvent, logError } from '@/lib/audit-log'
import { getValidatedUserId } from '@/lib/auth-utils'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'

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
  let identifier: string = ''

  try {
    const supabase = await import('@/utils/supabase/server').then((m) => m.createClient())

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError) throw authError

    // Validate user ID is a proper UUID, not a base64 token
    userId = getValidatedUserId(user)

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      logError(userId, 'prompt_improve', new Error('OpenAI API key not configured'))
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 })
    }

    // Rate limiting
    identifier = getClientIdentifier(request as unknown as Request)
    const rate = await checkRateLimit(identifier)
    if (!rate.allowed) {
      logAuditEvent(userId || 'anonymous', 'rate_limit_exceeded', 'api_call', {
        ipAddress: identifier,
        userAgent: request.headers.get('user-agent') || undefined,
        metadata: { requestType: 'prompt_improve', limit: 10, window: 60 },
      })
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: rate.resetTime.getTime(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rate.remaining.toString(),
            'X-RateLimit-Reset': rate.resetTime.getTime().toString(),
          },
        },
      )
    }

    const { prompt, context, model: requestedModel } = await request.json()

    if (!prompt) {
      logError(userId, 'prompt_improve', new Error('Prompt is required'))
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Enforce input truncation to reduce tokens
    const MAX_INPUT_CHARS = 4000
    const safePrompt = String(prompt || '').slice(0, MAX_INPUT_CHARS)
    const safeContext = String(context || '').slice(0, 2000)

    // Create the prompt improvement request
    const promptImprovementRequest = `You are an expert prompt engineer. I want you to improve this prompt to make it more effective and specific.

Original prompt: "${safePrompt}"

${safeContext ? `Additional context: ${safeContext}` : ''}

Please provide an improved version of this prompt that:
1. Is more specific and actionable
2. Uses better structure and formatting
3. Includes clear instructions for the AI
4. Incorporates the context effectively
5. Follows prompt engineering best practices

Return only the improved prompt, no explanations.`

    // Call OpenAI API
    const openai = getOpenAIClient()
    const model = requestedModel || 'gpt-4o-mini'
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: promptImprovementRequest,
        },
      ],
      max_tokens: 400,
      temperature: 0.5,
    })

    const response = completion.choices[0]?.message?.content || 'No response generated'
    const executionTime = Date.now() - startTime
    const tokensUsed = completion.usage?.total_tokens || null

    // Log successful operation
    logAuditEvent(userId || 'anonymous', 'prompt_improved', 'api_call', {
      metadata: {
        executionTime,
        tokensUsed,
        model: requestedModel || 'gpt-4o-mini',
        promptLength: safePrompt.length,
      },
      ipAddress: identifier,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({
      success: true,
      response,
      execution_time_ms: executionTime,
      tokens_used: tokensUsed,
    })
  } catch (error) {
    const executionTime = Date.now() - startTime

    // Log error with sanitized information
    logError(userId, 'prompt_improve', error, {
      executionTime,
      requestType: 'prompt_improve',
      ipAddress: identifier,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    // Don't expose internal error details to client
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing your request. Please try again.',
        execution_time_ms: executionTime,
      },
      { status: 500 },
    )
  }
}
