import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { AutonomousAgent } from '@/lib/autonomous-agent'
import { batchProcess } from '@/lib/retry-utils'
import { createClient } from '@/utils/supabase/server'

// Agent scheduler API endpoint
export async function POST(request: NextRequest) {
  try {
    // Verify this is a scheduled request (from Vercel Cron or similar)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Get all active agents
    const { data: agents, error } = await supabase.from('agents').select('*').eq('is_active', true)

    if (error) {
      console.error('Error fetching agents:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Process agents in batches with concurrency limit (5 at a time)
    // This prevents overwhelming OpenAI API and respects rate limits
    const results = await batchProcess(
      agents || [],
      async (agent) => {
        try {
          const autonomousAgent = new AutonomousAgent(agent.id)

          // Generate a prompt
          const generation = await autonomousAgent.generatePrompt()

          if (generation && generation.quality_score >= 0.6) {
            // Only save high-quality prompts
            const promptId = await autonomousAgent.savePrompt(generation)

            if (promptId) {
              // Update metrics
              await autonomousAgent.updateMetrics(1, 0.01, generation.quality_score) // Estimate cost

              return {
                agent: agent.name,
                promptId,
                qualityScore: generation.quality_score,
                strategy: generation.strategy_context,
                success: true,
              }
            }
          }

          return {
            agent: agent.name,
            error: 'Quality score too low or generation failed',
            success: false,
          }
        } catch (agentError) {
          console.error(`Error processing agent ${agent.name}:`, agentError)
          return {
            agent: agent.name,
            error: agentError instanceof Error ? agentError.message : 'Unknown error',
            success: false,
          }
        }
      },
      { concurrency: 5 }, // Process 5 agents concurrently
    )

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Agent scheduler error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Manual trigger endpoint for testing
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const agentId = url.searchParams.get('agentId')

    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID required' }, { status: 400 })
    }

    const autonomousAgent = new AutonomousAgent(agentId)
    const generation = await autonomousAgent.generatePrompt()

    if (!generation) {
      return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
    }

    const promptId = await autonomousAgent.savePrompt(generation)

    return NextResponse.json({
      success: true,
      generation,
      promptId,
    })
  } catch (error) {
    console.error('Manual agent trigger error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
