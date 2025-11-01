import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('prompt_collections')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json({ collection: data })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params
  const supabase = await createClient()
  const body = await request.json()
  const { data: session } = await supabase.auth.getSession()
  const userId = session.session?.user.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: existing, error: exErr } = await supabase
    .from('prompt_collections')
    .select('creator_id')
    .eq('id', resolvedParams.id)
    .single()
  if (exErr || !existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (existing.creator_id !== userId)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Validate description for public collections
  if (body.visibility === 'public' && (!body.description?.trim())) {
    return NextResponse.json(
      { error: 'Description is required for public collections' },
      { status: 400 },
    )
  }

  const { data, error } = await supabase
    .from('prompt_collections')
    .update({
      title: body.title,
      description: body.description?.trim() || null,
      cover_image_url: body.cover_image_url,
      visibility: body.visibility,
      tags: body.tags,
    })
    .eq('id', resolvedParams.id)
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ collection: data })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: session } = await supabase.auth.getSession()
  const userId = session.session?.user.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: existing, error: exErr } = await supabase
    .from('prompt_collections')
    .select('creator_id')
    .eq('id', resolvedParams.id)
    .single()
  if (exErr || !existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (existing.creator_id !== userId)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { error } = await supabase.from('prompt_collections').delete().eq('id', resolvedParams.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}


