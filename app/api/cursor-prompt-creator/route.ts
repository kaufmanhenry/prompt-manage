import { NextRequest, NextResponse } from 'next/server'
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

interface CursorPromptRequest {
  task: string
  context?: string
  language?: string
  framework?: string
  complexity?: 'beginner' | 'intermediate' | 'advanced'
  includeComments?: boolean
  includeTests?: boolean
  includeDocs?: boolean
}

interface CursorPromptResponse {
  prompt: string
  explanation: string
  tips: string[]
  examples: string[]
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = checkRateLimit(clientId)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
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
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    const { 
      task, 
      context = '', 
      language = 'javascript', 
      framework = '', 
      complexity = 'intermediate',
      includeComments = true,
      includeTests = false,
      includeDocs = false
    }: CursorPromptRequest = await request.json()

    if (!task || task.trim().length === 0) {
      return NextResponse.json(
        { error: 'Task description is required' },
        { status: 400 }
      )
    }

    // Input validation
    if (task.length > 5000) {
      return NextResponse.json(
        { error: 'Task description is too long. Please keep it under 5,000 characters.' },
        { status: 400 }
      )
    }

    // Generate Cursor-specific prompt
    const cursorPrompt = await generateCursorPrompt({
      task: task.trim(),
      context,
      language,
      framework,
      complexity,
      includeComments,
      includeTests,
      includeDocs
    })

    return NextResponse.json(cursorPrompt)
  } catch (error) {
    console.error('Cursor prompt generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate Cursor prompt' },
      { status: 500 }
    )
  }
}

async function generateCursorPrompt(params: CursorPromptRequest): Promise<CursorPromptResponse> {
  const {
    task,
    context,
    language,
    framework,
    complexity,
    includeComments,
    includeTests,
    includeDocs
  } = params

  const systemPrompt = `You are an expert at creating prompts for Cursor AI, a code editor with AI assistance. Generate a highly effective prompt that will help Cursor understand exactly what the developer wants to accomplish.

Key principles for Cursor prompts:
1. Be specific about the programming language and framework
2. Include clear requirements and constraints
3. Specify the desired output format
4. Mention any specific patterns or conventions to follow
5. Include context about the project or codebase when relevant
6. Be explicit about edge cases and error handling
7. Specify if you want comments, tests, or documentation included

Generate a prompt that follows this structure:
- Clear task description
- Technical specifications
- Output requirements
- Additional context or constraints`

  const userPrompt = `Create a Cursor AI prompt for this task:

Task: ${task}
${context ? `Context: ${context}` : ''}
Language: ${language}
${framework ? `Framework: ${framework}` : ''}
Complexity Level: ${complexity}
Include Comments: ${includeComments ? 'Yes' : 'No'}
Include Tests: ${includeTests ? 'Yes' : 'No'}
Include Documentation: ${includeDocs ? 'Yes' : 'No'}

Generate a comprehensive Cursor prompt that will produce high-quality code.`

  try {
    // Add timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const openai = getOpenAIClient()
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    const generatedContent = response.choices[0]?.message?.content || ''
    
    // Parse the response to extract prompt, explanation, tips, and examples
    const lines = generatedContent.split('\n').filter(line => line.trim())
    
    let prompt = ''
    let explanation = ''
    let tips: string[] = []
    let examples: string[] = []
    
    let currentSection = 'prompt'
    
    for (const line of lines) {
      if (line.toLowerCase().includes('explanation') || line.toLowerCase().includes('why')) {
        currentSection = 'explanation'
        continue
      } else if (line.toLowerCase().includes('tip') || line.toLowerCase().includes('best practice')) {
        currentSection = 'tips'
        continue
      } else if (line.toLowerCase().includes('example')) {
        currentSection = 'examples'
        continue
      }
      
      if (currentSection === 'prompt') {
        prompt += line + '\n'
      } else if (currentSection === 'explanation') {
        explanation += line + '\n'
      } else if (currentSection === 'tips' && line.trim().startsWith('-')) {
        tips.push(line.trim().substring(1).trim())
      } else if (currentSection === 'examples' && line.trim().startsWith('-')) {
        examples.push(line.trim().substring(1).trim())
      }
    }

    // Fallback if parsing didn't work well
    if (!prompt.trim()) {
      prompt = generatedContent
      explanation = 'This prompt is designed to help Cursor AI understand your coding requirements and generate appropriate code.'
    }

    return {
      prompt: prompt.trim(),
      explanation: explanation.trim() || 'This prompt is optimized for Cursor AI to understand your coding task.',
      tips: tips.length > 0 ? tips : [
        'Be specific about the programming language and framework',
        'Include clear requirements and constraints',
        'Specify the desired output format',
        'Mention any specific patterns or conventions to follow'
      ],
      examples: examples.length > 0 ? examples : [
        'React component with TypeScript',
        'API endpoint with error handling',
        'Database query with proper validation'
      ]
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw error
  }
}
