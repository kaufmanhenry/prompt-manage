import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'

import { AutonomousAgent } from '@/lib/autonomous-agent'

// Manual trigger endpoint for agent generation
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
