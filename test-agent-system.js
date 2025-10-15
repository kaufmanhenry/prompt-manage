#!/usr/bin/env node

// Quick test script to verify agent system is working
const testAgentSystem = async () => {
  const baseUrl = 'http://localhost:3000'
  
  console.log('🤖 Testing Agent System...')
  console.log('📍 Make sure your dev server is running on http://localhost:3000')
  console.log('📍 And you have the database migration applied in Supabase\n')
  
  try {
    // Test 1: Check if agents API is accessible
    console.log('1. Testing agents API access...')
    const agentsResponse = await fetch(`${baseUrl}/api/agents`)
    
    if (!agentsResponse.ok) {
      const error = await agentsResponse.text()
      console.error('❌ Agents API failed:', error)
      console.log('\n🔧 Troubleshooting:')
      console.log('- Make sure you\'re logged in with an admin email')
      console.log('- Check that the database migration was applied')
      console.log('- Verify your OpenAI API key is set in .env.local')
      return
    }
    
    const agentsData = await agentsResponse.json()
    console.log(`✅ Found ${agentsData.agents.length} agents`)
    
    // Test 2: Test manual agent generation
    if (agentsData.agents.length > 0) {
      const firstAgent = agentsData.agents[0]
      console.log(`\n2. Testing prompt generation with "${firstAgent.name}"...`)
      
      const generateResponse = await fetch(`${baseUrl}/api/agents/schedule?agentId=${firstAgent.id}`)
      
      if (!generateResponse.ok) {
        const error = await generateResponse.text()
        console.error('❌ Prompt generation failed:', error)
        console.log('\n🔧 Troubleshooting:')
        console.log('- Check your OpenAI API key in .env.local')
        console.log('- Verify the agent is active')
        return
      }
      
      const generationData = await generateResponse.json()
      console.log('✅ Prompt generated successfully!')
      console.log(`📝 Name: ${generationData.generation.name}`)
      console.log(`📊 Quality Score: ${generationData.generation.quality_score}`)
      console.log(`🏷️ Tags: ${generationData.generation.tags.join(', ')}`)
      console.log(`📄 Preview: ${generationData.generation.prompt_text.substring(0, 100)}...`)
    }
    
    console.log('\n🎉 Agent system is working correctly!')
    console.log('\n📋 Next steps:')
    console.log('1. Go to http://localhost:3000/dashboard/agents')
    console.log('2. View all agents and their metrics')
    console.log('3. Test manual generation for each agent')
    console.log('4. Create new custom agents if needed')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\n🔧 Make sure:')
    console.log('- Dev server is running (npm run dev)')
    console.log('- You\'re logged in with an admin email')
    console.log('- Database migration is applied')
    console.log('- OpenAI API key is configured')
  }
}

// Run the test
testAgentSystem()
