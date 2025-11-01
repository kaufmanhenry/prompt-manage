import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

// Supported formats
type ImportFormat = 'csv' | 'json'

// CSV column mapping
const CSV_COLUMNS = {
  name: ['name', 'title', 'prompt_name'],
  prompt_text: ['prompt_text', 'prompt', 'content', 'text'],
  description: ['description', 'desc', 'summary'],
  model: ['model', 'ai_model', 'model_name'],
  tags: ['tags', 'tag', 'categories'],
  is_public: ['is_public', 'public', 'isPublic'],
}

// Helper to find column index by possible names
function findColumnIndex(header: string[], possibleNames: string[]): number {
  const lowerHeader = header.map((h) => h.toLowerCase().trim())
  for (const name of possibleNames) {
    const index = lowerHeader.indexOf(name.toLowerCase())
    if (index !== -1) return index
  }
  return -1
}

// Parse tags from string (comma-separated, space-separated, or JSON array)
function parseTags(tagsString: string | null | undefined): string[] {
  if (!tagsString) return []
  const trimmed = tagsString.trim()
  if (!trimmed) return []

  // Try JSON array first
  try {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed)) {
      return parsed.filter((tag) => typeof tag === 'string')
    }
  } catch {
    // Not JSON, continue with string parsing
  }

  // Try comma-separated
  if (trimmed.includes(',')) {
    return trimmed
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
  }

  // Try space-separated (if no commas)
  if (trimmed.includes(' ')) {
    return trimmed
      .split(' ')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
  }

  // Single tag
  return [trimmed]
}

// Parse boolean from string
function parseBoolean(value: string | null | undefined): boolean {
  if (!value) return false
  const lower = value.toLowerCase().trim()
  return lower === 'true' || lower === '1' || lower === 'yes' || lower === 'y'
}

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

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const format = (formData.get('format') as ImportFormat) || 'csv'
    const skipDuplicates = formData.get('skipDuplicates') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // File size validation (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large', details: 'Maximum file size is 10MB' },
        { status: 400 },
      )
    }

    // File type validation
    const fileName = file.name.toLowerCase()
    const isCSV = fileName.endsWith('.csv') || file.type === 'text/csv'
    const isJSON = fileName.endsWith('.json') || file.type === 'application/json'

    if (format === 'csv' && !isCSV) {
      return NextResponse.json(
        { error: 'Invalid file type', details: 'Please upload a CSV file' },
        { status: 400 },
      )
    }

    if (format === 'json' && !isJSON) {
      return NextResponse.json(
        { error: 'Invalid file type', details: 'Please upload a JSON file' },
        { status: 400 },
      )
    }

    // Read file content with encoding handling
    let fileContent: string
    try {
      fileContent = await file.text()
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to read file', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 },
      )
    }

    if (!fileContent || fileContent.trim().length === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 })
    }

    let prompts: Array<{
      name: string
      prompt_text: string
      description?: string | null
      model?: string | null
      tags?: string[]
      is_public?: boolean
    }> = []

    // Parse based on format
    if (format === 'csv') {
      // Simple CSV parser (handles quoted fields)
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = []
        let current = ''
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"'
              i++ // Skip next quote
            } else {
              inQuotes = !inQuotes
            }
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }
        result.push(current.trim())
        return result
      }

      // Handle different line endings (Windows \r\n, Mac \r, Unix \n)
      const lines = fileContent
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      if (lines.length < 2) {
        return NextResponse.json(
          { error: 'CSV must have at least a header and one data row' },
          { status: 400 },
        )
      }

      const header = parseCSVLine(lines[0])
      const dataRows = lines.slice(1).map((line) => parseCSVLine(line))

      // Find column indices
      const nameIdx = findColumnIndex(header, CSV_COLUMNS.name)
      const promptIdx = findColumnIndex(header, CSV_COLUMNS.prompt_text)
      const descIdx = findColumnIndex(header, CSV_COLUMNS.description)
      const modelIdx = findColumnIndex(header, CSV_COLUMNS.model)
      const tagsIdx = findColumnIndex(header, CSV_COLUMNS.tags)
      const publicIdx = findColumnIndex(header, CSV_COLUMNS.is_public)

      // Validate required columns
      if (nameIdx === -1 || promptIdx === -1) {
        return NextResponse.json(
          {
            error: 'CSV must contain "name" and "prompt_text" columns',
            foundColumns: header,
          },
          { status: 400 },
        )
      }

      // Parse rows with validation
      prompts = dataRows
        .map((row, index) => {
          // Handle rows with fewer columns than header
          if (row.length < Math.max(nameIdx, promptIdx) + 1) {
            console.warn(`Row ${index + 2} has fewer columns than header, skipping`)
            return null
          }

          const name = row[nameIdx]?.trim() || ''
          const promptText = row[promptIdx]?.trim() || ''

          if (!name || !promptText) {
            return null // Skip invalid rows
          }

          // Validate and truncate length limits (database constraints)
          // Database constraint: name <= 120, prompt_text has no explicit limit but we'll cap at 100k
          const finalName = name.length > 120 ? name.substring(0, 120) : name
          const finalPromptText = promptText.length > 100000 ? promptText.substring(0, 100000) : promptText

          if (name.length > 120) {
            console.warn(`Row ${index + 2}: name too long (${name.length} chars), truncated to 120`)
          }
          if (promptText.length > 100000) {
            console.warn(`Row ${index + 2}: prompt_text too long (${promptText.length} chars), truncated to 100000`)
          }

          return {
            name: finalName,
            prompt_text: finalPromptText,
            description: descIdx !== -1 ? row[descIdx]?.trim() || null : null,
            model: modelIdx !== -1 ? row[modelIdx]?.trim() || null : null,
            tags: tagsIdx !== -1 ? parseTags(row[tagsIdx]) : [],
            is_public: publicIdx !== -1 ? parseBoolean(row[publicIdx]) : false,
          }
        })
        .filter((p): p is NonNullable<typeof p> => p !== null)
    } else if (format === 'json') {
      // Parse JSON
      try {
        const parsed = JSON.parse(fileContent)
        const jsonPrompts = Array.isArray(parsed) ? parsed : [parsed]

        prompts = jsonPrompts
          .map((item: any) => {
            if (!item.name || !item.prompt_text) {
              return null
            }

            return {
              name: String(item.name).trim(),
              prompt_text: String(item.prompt_text).trim(),
              description: item.description ? String(item.description).trim() : null,
              model: item.model ? String(item.model).trim() : null,
              tags: Array.isArray(item.tags) ? item.tags.map((t: any) => String(t)) : parseTags(item.tags),
              is_public: item.is_public === true || item.is_public === 'true',
            }
          })
          .filter((p: any): p is NonNullable<typeof p> => p !== null)
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid JSON format', details: error instanceof Error ? error.message : 'Unknown error' },
          { status: 400 },
        )
      }
    } else {
      return NextResponse.json({ error: 'Unsupported format. Use "csv" or "json"' }, { status: 400 })
    }

    if (prompts.length === 0) {
      return NextResponse.json({ error: 'No valid prompts found in file' }, { status: 400 })
    }

    // Check for duplicates if enabled
    let existingPrompts: string[] = []
    if (skipDuplicates) {
      const { data: existing } = await supabase
        .from('prompts')
        .select('name, prompt_text')
        .eq('user_id', user.id)

      if (existing) {
        existingPrompts = existing.map((p) => `${p.name}|${p.prompt_text}`.toLowerCase())
      }
    }

    // Prepare inserts
    const inserts = prompts
      .filter((p) => {
        if (skipDuplicates) {
          const key = `${p.name}|${p.prompt_text}`.toLowerCase()
          return !existingPrompts.includes(key)
        }
        return true
      })
      .map((p) => ({
        user_id: user.id,
        name: p.name,
        prompt_text: p.prompt_text,
        description: p.description || null,
        model: p.model || 'gpt-4o',
        tags: p.tags || [],
        is_public: p.is_public || false,
      }))

    if (inserts.length === 0) {
      return NextResponse.json(
        {
          success: true,
          imported: 0,
          skipped: prompts.length,
          message: 'All prompts already exist (duplicates skipped)',
        },
        { status: 200 },
      )
    }

    // Insert in batches (Supabase has limits)
    const BATCH_SIZE = 100
    let imported = 0
    let errors = 0

    for (let i = 0; i < inserts.length; i += BATCH_SIZE) {
      const batch = inserts.slice(i, i + BATCH_SIZE)
      const { error: insertError } = await supabase.from('prompts').insert(batch)

      if (insertError) {
        console.error('Batch insert error:', insertError)
        errors += batch.length
      } else {
        imported += batch.length
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped: prompts.length - imported - errors,
      errors,
      total: prompts.length,
    })
  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json(
      {
        error: 'Failed to import prompts',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

