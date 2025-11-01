import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

// GET: Get prompts in a collection
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const supabase = await createClient()
    const { data: session } = await supabase.auth.getSession()
    const userId = session.session?.user.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get collection to verify ownership
    const { data: collection, error: collError } = await supabase
      .from('prompt_collections')
      .select('creator_id')
      .eq('id', resolvedParams.id)
      .single()

    if (collError || !collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    if (collection.creator_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get prompts in collection
    const { data: collectionPrompts, error: cpError } = await supabase
      .from('collection_prompts')
      .select(
        `
        prompt_id,
        sort_order,
        prompts (
          id,
          name,
          description,
          slug,
          model,
          tags,
          is_public,
          view_count
        )
      `,
      )
      .eq('collection_id', resolvedParams.id)
      .order('sort_order', { ascending: true })

    if (cpError) {
      return NextResponse.json({ error: cpError.message }, { status: 500 })
    }

    interface CollectionPromptItem {
      prompt_id: string
      sort_order: number
      prompts: {
        id: string
        name: string
        description: string | null
        slug: string | null
        model: string | null
        tags: string[] | null
        is_public: boolean
        view_count: number
      }
    }

    return NextResponse.json({
      prompts: ((collectionPrompts || []) as unknown as CollectionPromptItem[]).map((cp) => ({
        ...cp.prompts,
        sort_order: cp.sort_order,
      })),
    })
  } catch (error) {
    console.error('Error fetching collection prompts:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

// POST: Add prompt to collection
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const supabase = await createClient()
    const { data: session } = await supabase.auth.getSession()
    const userId = session.session?.user.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { prompt_id } = body

    if (!prompt_id) {
      return NextResponse.json({ error: 'prompt_id is required' }, { status: 400 })
    }

    // Get collection to verify ownership
    const { data: collection, error: collError } = await supabase
      .from('prompt_collections')
      .select('creator_id')
      .eq('id', resolvedParams.id)
      .single()

    if (collError || !collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    if (collection.creator_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if prompt already in collection
    const { data: existing } = await supabase
      .from('collection_prompts')
      .select('id')
      .eq('collection_id', resolvedParams.id)
      .eq('prompt_id', prompt_id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Prompt already in collection' }, { status: 400 })
    }

    // Get max sort_order
    const { data: maxOrder } = await supabase
      .from('collection_prompts')
      .select('sort_order')
      .eq('collection_id', resolvedParams.id)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxOrder?.sort_order || 0) + 1

    // Add prompt to collection
    const { data, error } = await supabase
      .from('collection_prompts')
      .insert({
        collection_id: resolvedParams.id,
        prompt_id,
        sort_order: nextOrder,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error adding prompt to collection:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}

// DELETE: Remove prompt from collection
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const supabase = await createClient()
    const { data: session } = await supabase.auth.getSession()
    const userId = session.session?.user.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const prompt_id = searchParams.get('prompt_id')

    if (!prompt_id) {
      return NextResponse.json({ error: 'prompt_id is required' }, { status: 400 })
    }

    // Get collection to verify ownership
    const { data: collection, error: collError } = await supabase
      .from('prompt_collections')
      .select('creator_id')
      .eq('id', resolvedParams.id)
      .single()

    if (collError || !collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    if (collection.creator_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Remove prompt from collection
    const { error } = await supabase
      .from('collection_prompts')
      .delete()
      .eq('collection_id', resolvedParams.id)
      .eq('prompt_id', prompt_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing prompt from collection:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    )
  }
}
