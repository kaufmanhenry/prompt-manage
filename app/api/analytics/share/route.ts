import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt_id, platform } = body

    if (!prompt_id || !platform) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get current user (optional - shares can be anonymous)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Track the share
    const { error } = await supabase.from('prompt_shares').insert({
      prompt_id,
      platform,
      user_id: user?.id || null,
    })

    if (error) {
      console.error('Error tracking share:', error)
      return NextResponse.json({ error: 'Failed to track share' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Share tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
