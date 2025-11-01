import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('prompt_collections')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ collections: data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { data: session } = await supabase.auth.getSession()
  const userId = session.session?.user.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Validate description for public collections
  if (body.visibility === 'public' && (!body.description?.trim())) {
    return NextResponse.json(
      { error: 'Description is required for public collections' },
      { status: 400 },
    )
  }

  const payload = {
    title: body.title,
    description: body.description?.trim() || null,
    cover_image_url: body.cover_image_url ?? null,
    visibility: body.visibility ?? 'private',
    creator_id: userId,
  }

  const { data, error } = await supabase.from('prompt_collections').insert(payload).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ collection: data })
}


