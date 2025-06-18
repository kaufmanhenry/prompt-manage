import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const requestUrl = new URL(request.url)
    const id = requestUrl.searchParams.get('id')

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { is_public } = await request.json()

    // Verify the prompt belongs to the user
    const { data: prompt, error: fetchError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Update the prompt
    const { data: updatedPrompt, error: updateError } = await supabase
      .from('prompts')
      .update({ is_public })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating prompt:', updateError)
      return NextResponse.json(
        { error: 'Failed to update prompt' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedPrompt)
  } catch (error) {
    console.error('Share API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
