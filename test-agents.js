#!/usr/bin/env node
/* eslint-env node */

// Quick test script to verify agent creation and generation
const testAgentCreation = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  console.log('🤖 Testing Agent Creation and Generation...')
  
  try {
    // Test 1: Create a test agent
    console.log('\n1. Creating test agent...')
    const createResponse = await fetch(`${baseUrl}/api/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Marketing Manager Agent',
        description: 'Test agent for marketing managers',
        strategy: 'niche',
        config: {
          industries: ['marketing', 'advertising'],
          topics: ['campaigns', 'analytics'],
          persona: 'marketing_manager',
          frequency: 'daily'
        }
      })
    })
    
    if (!createResponse.ok) {
      const error = await createResponse.text()
      console.error('❌ Agent creation failed:', error)
      return
    }
    
    const agentData = await createResponse.json()
    console.log('✅ Agent created:', agentData.agent.name)
    
    // Test 2: Generate a prompt with the agent
    console.log('\n2. Generating test prompt...')
    const generateResponse = await fetch(`${baseUrl}/api/agents/schedule?agentId=${agentData.agent.id}`)
    
    if (!generateResponse.ok) {
      const error = await generateResponse.text()
      console.error('❌ Prompt generation failed:', error)
      return
    }
    
    const generationData = await generateResponse.json()
    console.log('✅ Prompt generated:', generationData.generation.name)
    console.log('📊 Quality score:', generationData.generation.quality_score)
    console.log('🏷️ Tags:', generationData.generation.tags.join(', '))
    
    console.log('\n🎉 All tests passed! Agent system is working correctly.')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testAgentCreation()
