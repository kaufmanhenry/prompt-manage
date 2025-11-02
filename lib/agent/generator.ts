// Agent Prompt Generation Logic
import OpenAI from 'openai'

// Lazy-load OpenAI client to avoid build-time initialization
let openai: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })
  }
  return openai
}

interface AgentGenerationInput {
  topic: string
  keyword: string
  category?: string
  temperature?: number
}

interface GeneratedPrompt {
  name: string
  description: string
  prompt_text: string
  tags: string[]
  model: string
  metadata?: {
    example_output?: string
    use_cases?: string[]
    difficulty?: string
  }
}

interface QualityReview {
  score: number
  feedback: string
  suggestions?: string[]
}

/**
 * Generate a prompt idea based on topic/keyword
 */
export async function generatePromptIdea(
  input: AgentGenerationInput,
): Promise<{ idea: string; description: string }> {
  const systemPrompt = `You are an expert prompt engineer creating high-quality prompts for AI models. 
Generate creative and useful prompt ideas based on the given topic/keyword.`

  const userPrompt = `Generate a prompt idea for the topic: "${input.topic}" (keyword: "${input.keyword}").
The prompt should be:
- Useful and actionable
- Clear and specific
- Suitable for modern AI models (GPT-5, Claude, Gemini)
- SEO-friendly and discoverable

Return your response in this JSON format:
{
  "idea": "A concise prompt title/idea (max 60 characters)",
  "description": "A brief description of what this prompt does (2-3 sentences)"
}`

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: input.temperature || 0.8,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('No response from OpenAI')

  const parsed = JSON.parse(content)
  return {
    idea: parsed.idea,
    description: parsed.description,
  }
}

/**
 * Generate full prompt content
 */
export async function generatePromptContent(
  input: AgentGenerationInput,
  idea: string,
  description: string,
): Promise<GeneratedPrompt> {
  const systemPrompt = `You are an expert prompt engineer. Generate complete, production-ready prompts for AI models.
Your prompts should be clear, specific, actionable, and optimized for modern LLMs.`

  const userPrompt = `Generate a complete prompt for the topic: "${input.topic}" (keyword: "${input.keyword}").

Idea: ${idea}
Description: ${description}

Create a full prompt that includes:
1. Clear instructions for the AI
2. Context and background information
3. Specific requirements and constraints
4. Desired output format (if applicable)
5. Best practices and examples (when helpful)

Also generate:
- 3-5 relevant tags (including the main keyword)
- A suggested model (GPT-5, Claude-4-opus, Gemini-1-5-pro, etc.)
- An example output or use case description

Return your response in this JSON format:
{
  "name": "${idea}",
  "description": "${description}",
  "prompt_text": "The complete prompt text (300-800 words, detailed and actionable)",
  "tags": ["tag1", "tag2", "tag3", "${input.keyword}"],
  "model": "gpt-5",
  "metadata": {
    "example_output": "Brief example of expected output",
    "use_cases": ["use case 1", "use case 2"],
    "difficulty": "beginner|intermediate|advanced"
  }
}`

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: input.temperature || 0.7,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('No response from OpenAI')

  const parsed = JSON.parse(content)
  return parsed
}

/**
 * Review and score prompt quality
 */
export async function reviewPromptQuality(prompt: GeneratedPrompt): Promise<QualityReview> {
  const systemPrompt = `You are a quality control expert for AI prompts. Review prompts and score them based on:
1. Clarity and specificity (0-25 points)
2. Usefulness and actionability (0-25 points)
3. SEO and discoverability (0-25 points)
4. Uniqueness and originality (0-25 points)

Provide constructive feedback and suggestions for improvement.`

  const userPrompt = `Review this prompt and assign a quality score (0-100):

Title: ${prompt.name}
Description: ${prompt.description}
Prompt Text: ${prompt.prompt_text.substring(0, 1000)}...
Tags: ${prompt.tags.join(', ')}
Model: ${prompt.model}

Return your response in this JSON format:
{
  "score": 85,
  "feedback": "Overall assessment of the prompt quality",
  "suggestions": ["suggestion 1", "suggestion 2"]
}`

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3, // Lower temperature for consistent scoring
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('No response from OpenAI')

  const parsed = JSON.parse(content)
  return {
    score: parsed.score || 0,
    feedback: parsed.feedback || '',
    suggestions: parsed.suggestions || [],
  }
}

/**
 * Main generation function
 */
export async function generateAgentPrompt(input: AgentGenerationInput): Promise<{
  prompt: GeneratedPrompt
  quality: QualityReview
  raw_input: string
  raw_output: string
}> {
  // Step 1: Generate idea
  const { idea, description } = await generatePromptIdea(input)
  const ideaInput = `Topic: ${input.topic}, Keyword: ${input.keyword}, Idea: ${idea}, Description: ${description}`

  // Step 2: Generate full prompt
  const prompt = await generatePromptContent(input, idea, description)
  const promptOutput = JSON.stringify(prompt, null, 2)

  // Step 3: Review quality
  const quality = await reviewPromptQuality(prompt)

  return {
    prompt,
    quality,
    raw_input: ideaInput,
    raw_output: promptOutput,
  }
}
