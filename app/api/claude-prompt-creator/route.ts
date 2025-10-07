import OpenAI from 'openai'
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

interface ClaudePromptRequest {
  requirements: string
  context?: string
  complexity?: string
  domain?: string
  taskType?: string
}

interface ClaudePrompt {
  prompt: string
  context?: string
  complexity?: string
  domain?: string
  taskType?: string
  suggestions?: string[]
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(clientId)
    
    if (!rateLimit.allowed) {
      return Response.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      )
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    const body: ClaudePromptRequest = await request.json()
    const { requirements, context, complexity, domain, taskType } = body

    if (!requirements?.trim()) {
      return Response.json({ error: 'Requirements are required' }, { status: 400 })
    }

    // Input validation
    if (requirements.length > 5000) {
      return Response.json(
        { error: 'Requirements are too long. Please keep it under 5,000 characters.' },
        { status: 400 }
      )
    }

    // Build the system prompt for Claude-specific optimization
    const systemPrompt = `You are an expert prompt engineer specializing in creating highly effective prompts for Claude AI (Anthropic). 

Claude excels at:
- Complex reasoning and analysis
- Creative writing and content generation
- Code review and technical documentation
- Ethical considerations and safety
- Multi-step problem solving
- Detailed explanations and tutorials

Create a prompt that:
1. Is clear and specific about the desired output
2. Provides sufficient context for Claude to understand the task
3. Uses Claude's strengths in reasoning and analysis
4. Includes examples or formatting instructions when helpful
5. Considers ethical implications if relevant
6. Is structured for optimal Claude performance

Requirements: ${requirements}
${context ? `Context: ${context}` : ''}
${complexity ? `Complexity Level: ${complexity}` : ''}
${domain ? `Domain: ${domain}` : ''}
${taskType ? `Task Type: ${taskType}` : ''}

Generate a prompt optimized specifically for Claude AI.`

    // Add timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Create a Claude-optimized prompt for: ${requirements}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }, {
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const generatedPrompt = completion.choices[0]?.message?.content || ''

    // Generate suggestions based on the prompt
    const suggestions = generateSuggestions(requirements, complexity, domain, taskType)

    const response: ClaudePrompt = {
      prompt: generatedPrompt,
      context,
      complexity,
      domain,
      taskType,
      suggestions,
    }

    return Response.json(response)
  } catch (error) {
    console.error('Error generating Claude prompt:', error)
    return Response.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    )
  }
}

function generateSuggestions(
  requirements: string,
  complexity?: string,
  domain?: string,
  taskType?: string
): string[] {
  const suggestions: string[] = []

  // Complexity-based suggestions
  if (complexity === 'beginner') {
    suggestions.push('Consider adding step-by-step instructions for clarity')
    suggestions.push('Include examples to help Claude understand the expected output')
  } else if (complexity === 'advanced') {
    suggestions.push('Add specific technical constraints or requirements')
    suggestions.push('Consider asking Claude to explain its reasoning process')
  }

  // Domain-based suggestions
  if (domain === 'creative') {
    suggestions.push('Specify tone, style, or creative direction')
    suggestions.push('Consider asking for multiple creative options')
  } else if (domain === 'technical') {
    suggestions.push('Include specific technical requirements or constraints')
    suggestions.push('Ask Claude to explain technical concepts clearly')
  } else if (domain === 'business') {
    suggestions.push('Consider including target audience or business context')
    suggestions.push('Ask for practical implementation steps')
  }

  // Task type suggestions
  if (taskType === 'analysis') {
    suggestions.push('Specify the depth and scope of analysis required')
    suggestions.push('Ask Claude to provide evidence or reasoning for conclusions')
  } else if (taskType === 'writing') {
    suggestions.push('Specify word count, tone, and target audience')
    suggestions.push('Consider asking for an outline before the full content')
  } else if (taskType === 'problem-solving') {
    suggestions.push('Break down complex problems into smaller steps')
    suggestions.push('Ask Claude to consider multiple solution approaches')
  }

  // General Claude-specific suggestions
  suggestions.push('Leverage Claude\'s strength in ethical reasoning when relevant')
  suggestions.push('Ask Claude to explain its thought process for complex tasks')
  suggestions.push('Consider asking Claude to identify potential issues or limitations')

  return suggestions.slice(0, 4) // Return top 4 suggestions
}
