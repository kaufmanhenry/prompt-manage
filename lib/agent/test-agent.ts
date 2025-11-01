// Agent Testing and QA Utilities
// Note: These functions run client-side and use API endpoints

export interface AgentPrompt {
  id: string
  agent_id: string
  prompt_id: string | null
  topic: string
  keyword: string
  raw_input: string | null
  raw_output: string | null
  quality_score: number | null
  status: 'draft' | 'review' | 'approved' | 'published' | 'rejected' | 'failed'
  error_message: string | null
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}

interface TestResult {
  test: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  details?: any
}

interface QualityMetrics {
  clarity: number
  usefulness: number
  uniqueness: number
  seoOptimization: number
  overall: number
}

interface AgentTestReport {
  timestamp: string
  agentId: string
  testsRun: number
  passed: number
  failed: number
  warnings: number
  results: TestResult[]
  qualityMetrics?: QualityMetrics
  recommendations: string[]
}

/**
 * Test agent prompt generation
 */
export async function testAgentGeneration(
  agentId: string,
  keywords: string[],
): Promise<TestResult[]> {
  const results: TestResult[] = []

  try {
    // Test 1: Agent exists and is active
    const agentRes = await fetch(`/api/agent/${agentId}`)
    const agentData = await agentRes.json()

    if (!agentData.agent) {
      results.push({
        test: 'Agent Exists',
        status: 'fail',
        message: 'Agent not found',
      })
      return results
    }

    results.push({
      test: 'Agent Exists',
      status: 'pass',
      message: `Agent "${agentData.agent.name}" found and active`,
    })

    // Test 2: Generate test prompts
    const generateRes = await fetch('/api/agent/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: agentId,
        topics: keywords.slice(0, 3).map((k) => ({ keyword: k, topic: k })),
        batch_size: 3,
      }),
    })

    const generateData = await generateRes.json()

    if (!generateData.success) {
      results.push({
        test: 'Prompt Generation',
        status: 'fail',
        message: `Generation failed: ${generateData.error}`,
      })
      return results
    }

    results.push({
      test: 'Prompt Generation',
      status: 'pass',
      message: `Generated ${generateData.generated} prompts successfully`,
      details: generateData.results,
    })

    // Test 3: Verify prompts saved correctly
    const promptsRes = await fetch(`/api/agent/prompts?agent_id=${agentId}&limit=10`)
    const promptsData = await promptsRes.json()

    if (!promptsData.prompts || promptsData.prompts.length === 0) {
      results.push({
        test: 'Prompt Storage',
        status: 'warning',
        message: 'No prompts found in database',
      })
    } else {
      results.push({
        test: 'Prompt Storage',
        status: 'pass',
        message: `Found ${promptsData.prompts.length} prompts in database`,
        details: {
          statuses: promptsData.prompts.map((p: AgentPrompt) => p.status),
        },
      })
    }

    // Test 4: Check metadata completeness
    const samplePrompts = promptsData.prompts?.slice(0, 5) || []
    const metadataComplete = samplePrompts.every((p: AgentPrompt) => {
      return (
        p.topic &&
        p.keyword &&
        p.quality_score !== null &&
        p.status &&
        p.raw_input &&
        p.raw_output
      )
    })

    results.push({
      test: 'Metadata Completeness',
      status: metadataComplete ? 'pass' : 'warning',
      message: metadataComplete
        ? 'All prompts have complete metadata'
        : 'Some prompts missing metadata fields',
      details: {
        checked: samplePrompts.length,
        complete: samplePrompts.filter((p: AgentPrompt) => {
          return (
            p.topic &&
            p.keyword &&
            p.quality_score !== null &&
            p.status &&
            p.raw_input &&
            p.raw_output
          )
        }).length,
      },
    })

    // Test 5: Check quality scores
    const avgQuality =
      samplePrompts.reduce((sum: number, p: AgentPrompt) => sum + (p.quality_score || 0), 0) /
      (samplePrompts.length || 1)

    results.push({
      test: 'Quality Scores',
      status: avgQuality >= 75 ? 'pass' : avgQuality >= 60 ? 'warning' : 'fail',
      message: `Average quality score: ${avgQuality.toFixed(1)}/100`,
      details: {
        average: avgQuality,
        threshold: agentData.agent.quality_threshold,
        samples: samplePrompts.map((p: AgentPrompt) => ({
          keyword: p.keyword,
          score: p.quality_score,
        })),
      },
    })

    return results
  } catch (error) {
    results.push({
      test: 'Test Execution',
      status: 'fail',
      message: `Test failed with error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error,
    })
    return results
  }
}

/**
 * Evaluate prompt quality
 */
export function evaluatePromptQuality(prompt: AgentPrompt): QualityMetrics {
  const metrics: QualityMetrics = {
    clarity: 0,
    usefulness: 0,
    uniqueness: 0,
    seoOptimization: 0,
    overall: 0,
  }

  try {
    // Parse prompt from raw_output
    let promptData: any = {}
    try {
      if (prompt.raw_output) {
        promptData = JSON.parse(prompt.raw_output)
      }
    } catch {
      // If parsing fails, use raw data
      promptData = {}
    }

    // Clarity: Check for clear structure, instructions, formatting
    const hasTitle = !!promptData.name || !!prompt.topic
    const hasDescription = !!promptData.description
    const hasClearText = !!promptData.prompt_text && promptData.prompt_text.length > 50
    const hasTags = !!promptData.tags && Array.isArray(promptData.tags) && promptData.tags.length > 0

    metrics.clarity = [
      hasTitle ? 25 : 0,
      hasDescription ? 25 : 0,
      hasClearText ? 25 : 0,
      hasTags ? 25 : 0,
    ].reduce((a, b) => a + b, 0)

    // Usefulness: Check for actionable content, examples, specific use cases
    const hasUseCases =
      !!promptData.metadata?.use_cases && Array.isArray(promptData.metadata.use_cases)
    const hasExampleOutput = !!promptData.metadata?.example_output
    const isSpecific = promptData.prompt_text && promptData.prompt_text.length > 200

    metrics.usefulness = [
      hasUseCases ? 33 : 0,
      hasExampleOutput ? 33 : 0,
      isSpecific ? 34 : 0,
    ].reduce((a, b) => a + b, 0)

    // Uniqueness: Check for unique keywords, topics
    const hasKeyword = !!prompt.keyword
    const _hasTopic = !!prompt.topic
    const uniqueKeywords = new Set([prompt.keyword, prompt.topic].filter(Boolean))

    metrics.uniqueness = [
      hasKeyword ? 50 : 0,
      uniqueKeywords.size > 1 ? 50 : 0,
    ].reduce((a, b) => a + b, 0)

    // SEO Optimization: Check for keywords, tags, descriptions
    const keywordInTitle =
      promptData.name && prompt.keyword && promptData.name.toLowerCase().includes(prompt.keyword.toLowerCase())
    const keywordInDescription =
      promptData.description &&
      prompt.keyword &&
      promptData.description.toLowerCase().includes(prompt.keyword.toLowerCase())
    const hasMultipleTags = hasTags && promptData.tags.length >= 3

    metrics.seoOptimization = [
      keywordInTitle ? 33 : 0,
      keywordInDescription ? 33 : 0,
      hasMultipleTags ? 34 : 0,
    ].reduce((a, b) => a + b, 0)

    // Overall: Weighted average
    metrics.overall =
      metrics.clarity * 0.3 +
      metrics.usefulness * 0.3 +
      metrics.uniqueness * 0.2 +
      metrics.seoOptimization * 0.2

    return metrics
  } catch (error) {
    console.error('Error evaluating prompt quality:', error)
    return metrics
  }
}

/**
 * Generate comprehensive test report
 */
export async function generateTestReport(agentId: string): Promise<AgentTestReport> {
  const results: TestResult[] = []
  const recommendations: string[] = []

  // Run basic tests
  const testKeywords = ['photography', 'marketing', 'writing']
  const testResults = await testAgentGeneration(agentId, testKeywords)
  results.push(...testResults)

  // Get recent prompts for quality review
  const promptsRes = await fetch(`/api/agent/prompts?agent_id=${agentId}&limit=50`)
  const promptsData = await promptsRes.json()
  const recentPrompts = promptsData.prompts || []

  // Evaluate quality
  let avgQuality: QualityMetrics = {
    clarity: 0,
    usefulness: 0,
    uniqueness: 0,
    seoOptimization: 0,
    overall: 0,
  }

  if (recentPrompts.length > 0) {
    const qualityScores = recentPrompts.map((p: AgentPrompt) => evaluatePromptQuality(p))
    avgQuality = {
      clarity:
        qualityScores.reduce((sum: number, q: QualityMetrics) => sum + q.clarity, 0) /
        qualityScores.length,
      usefulness:
        qualityScores.reduce((sum: number, q: QualityMetrics) => sum + q.usefulness, 0) /
        qualityScores.length,
      uniqueness:
        qualityScores.reduce((sum: number, q: QualityMetrics) => sum + q.uniqueness, 0) /
        qualityScores.length,
      seoOptimization:
        qualityScores.reduce((sum: number, q: QualityMetrics) => sum + q.seoOptimization, 0) /
        qualityScores.length,
      overall:
        qualityScores.reduce((sum: number, q: QualityMetrics) => sum + q.overall, 0) /
        qualityScores.length,
    }

    // Check for duplicates
    const titles = recentPrompts.map((p: AgentPrompt) => p.topic).filter(Boolean)
    const uniqueTitles = new Set(titles)
    const duplicateRate = (titles.length - uniqueTitles.size) / titles.length

    if (duplicateRate > 0.1) {
      results.push({
        test: 'Duplicate Detection',
        status: 'warning',
        message: `${(duplicateRate * 100).toFixed(1)}% duplicate titles detected`,
        details: { duplicateRate },
      })
      recommendations.push('Implement deduplication logic to prevent similar prompt generation')
    } else {
      results.push({
        test: 'Duplicate Detection',
        status: 'pass',
        message: 'Low duplicate rate detected',
      })
    }
  }

  // Generate recommendations
  if (avgQuality.overall < 70) {
    recommendations.push('Improve prompt generation templates for higher quality scores')
  }
  if (avgQuality.clarity < 70) {
    recommendations.push('Enhance clarity by ensuring all prompts have titles, descriptions, and tags')
  }
  if (avgQuality.usefulness < 70) {
    recommendations.push('Add use cases and example outputs to improve usefulness')
  }
  if (avgQuality.seoOptimization < 70) {
    recommendations.push('Optimize SEO by ensuring keywords appear in titles and descriptions')
  }

  const passed = results.filter((r) => r.status === 'pass').length
  const failed = results.filter((r) => r.status === 'fail').length
  const warnings = results.filter((r) => r.status === 'warning').length

  return {
    timestamp: new Date().toISOString(),
    agentId,
    testsRun: results.length,
    passed,
    failed,
    warnings,
    results,
    qualityMetrics: avgQuality,
    recommendations,
  }
}

