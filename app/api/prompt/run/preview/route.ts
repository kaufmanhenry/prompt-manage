import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

type VariablesRow = Record<string, string>

function substitute(template: string, vars: VariablesRow): string {
  return template.replace(/\{(.*?)\}/g, (_, key) => {
    const value = vars[key] ?? `{${key}}`
    return value
  })
}

function estimateTokens(text: string): number {
  // Very rough token estimate: ~4 characters per token
  return Math.max(1, Math.ceil(text.length / 4))
}

function estimateCost(tokens: number, model: string): number {
  // Mock pricing table (USD per 1K tokens)
  const pricing: Record<string, number> = {
    'gpt-4': 0.03,
    'gpt-4o': 0.005,
    'gpt-5': 0.01,
  }
  const rate = pricing[model] ?? 0.003
  return (tokens / 1000) * rate
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now()
  try {
    const body = await request.json()
    const variant: string = body.variant || 'A'
    const model: string = body.model || 'gpt-4'
    const prompt: string = body.prompt || ''
    const context: string = body.context || ''
    const variablesRows: VariablesRow[] = Array.isArray(body.variablesRows)
      ? body.variablesRows
      : []

    // Generate mock outputs by simple substitution and formatting
    const outputs = variablesRows.map((row, index) => {
      const combined = `${context}\n\n${substitute(prompt, row)}`
      // Create a pseudo output by paraphrasing the goal line slightly
      const firstLine = substitute(
        prompt.split('\n')[0] || 'Generate text',
        row
      )
      const response = [
        `Variant ${variant}: ${firstLine}`,
        '',
        `Audience: ${row.audience ?? 'N/A'}`,
        `Product: ${row.product ?? 'N/A'}`,
        `Benefit: ${row.benefit ?? 'N/A'}`,
        `Tone: ${row.tone ?? 'N/A'}`,
        '',
        '- Headline 1: Drive growth with consistent on-brand ads',
        '- Headline 2: Turn prompts into high-ROAS copy fast',
        '- Headline 3: Ship campaigns 2x faster',
        '- Headline 4: Test angles and keep what wins',
        '- Headline 5: Your team’s prompt library',
      ].join('\n')
      const tokens = estimateTokens(combined) + estimateTokens(response)
      const latency = 200 + Math.floor(Math.random() * 300)
      const cost = estimateCost(tokens, model)
      return {
        rowIndex: index,
        response,
        tokens_used: tokens,
        execution_time_ms: latency,
        cost_usd: cost,
      }
    })

    const totals = outputs.reduce(
      (acc, o) => {
        acc.total_tokens += o.tokens_used
        acc.total_cost_usd += o.cost_usd
        acc.total_latency_ms += o.execution_time_ms
        return acc
      },
      { total_tokens: 0, total_cost_usd: 0, total_latency_ms: 0 }
    )

    const response = {
      success: true,
      variant,
      outputs,
      aggregate: {
        total_tokens: totals.total_tokens,
        avg_latency_ms:
          outputs.length > 0
            ? Math.round(totals.total_latency_ms / outputs.length)
            : Date.now() - startedAt,
        total_cost_usd: Number(totals.total_cost_usd.toFixed(6)),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Preview run error', error)
    return NextResponse.json(
      { success: false, error: 'Bad request' },
      { status: 400 }
    )
  }
}
