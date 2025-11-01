import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { canUserExport, getUserSubscription } from '@/lib/subscription'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check subscription for export access
    const subscription = await getUserSubscription(user.id)
    if (!canUserExport(subscription)) {
      return NextResponse.json(
        {
          error: 'Export feature requires a paid subscription',
          details: 'Please upgrade to Team or Pro plan to export prompts.',
        },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { promptIds, format = 'csv' } = body

    // Fetch prompts (select only needed fields for export)
    let query = supabase
      .from('prompts')
      .select('name, prompt_text, description, model, tags, is_public, inserted_at, updated_at')
      .eq('user_id', user.id)

    if (promptIds && Array.isArray(promptIds) && promptIds.length > 0) {
      query = query.in('id', promptIds)
    }

    const { data: prompts, error } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 })
    }

    if (!prompts || prompts.length === 0) {
      return NextResponse.json({ error: 'No prompts found to export' }, { status: 404 })
    }

    // Format output
    if (format === 'csv') {
      // Simple CSV formatter (handles quotes and commas)
      const escapeCSV = (value: string): string => {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }

      // Convert to CSV
      const headers = ['name', 'prompt_text', 'description', 'model', 'tags', 'is_public', 'inserted_at', 'updated_at']
      const csvRows = [
        headers.map(escapeCSV).join(','),
        ...prompts.map((p) =>
          [
            escapeCSV(p.name || ''),
            escapeCSV(p.prompt_text || ''),
            escapeCSV(p.description || ''),
            escapeCSV(p.model || ''),
            escapeCSV(Array.isArray(p.tags) ? p.tags.join(', ') : ''),
            escapeCSV(p.is_public ? 'true' : 'false'),
            escapeCSV(p.inserted_at || ''),
            escapeCSV(p.updated_at || ''),
          ].join(','),
        ),
      ]

      const csv = csvRows.join('\n')

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="prompts-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    } else if (format === 'json') {
      // Convert to JSON
      const jsonData = prompts.map((p) => ({
        name: p.name || '',
        prompt_text: p.prompt_text || '',
        description: p.description || '',
        model: p.model || '',
        tags: Array.isArray(p.tags) ? p.tags : [],
        is_public: p.is_public || false,
        inserted_at: p.inserted_at || '',
        updated_at: p.updated_at || '',
      }))

      return NextResponse.json(jsonData, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="prompts-export-${new Date().toISOString().split('T')[0]}.json"`,
        },
      })
    } else {
      return NextResponse.json({ error: 'Unsupported format. Use "csv" or "json"' }, { status: 400 })
    }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Bulk export error:', error)
      }
      const errorMessage =
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : 'Internal server error'
      return NextResponse.json(
        {
          error: 'Failed to export prompts',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        },
        { status: 500 },
      )
    }
}

