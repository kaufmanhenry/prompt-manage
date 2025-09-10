import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { copyPromptSchema } from '@/lib/schemas/prompt';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const validation = copyPromptSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error },
        { status: 400 }
      );
    }

    const { source_prompt_id, new_name } = validation.data;

    // Verify the source prompt exists and is public
    const { data: sourcePrompt, error: sourceError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', source_prompt_id)
      .eq('is_public', true)
      .single();

    if (sourceError || !sourcePrompt) {
      return NextResponse.json({ error: 'Public prompt not found' }, { status: 404 });
    }

    // Check if user already has a copy of this prompt
    const { data: existingCopy } = await supabase
      .from('prompts')
      .select('id')
      .eq('parent_prompt_id', source_prompt_id)
      .eq('user_id', user.id)
      .single();

    if (existingCopy) {
      return NextResponse.json(
        { error: 'You already have a copy of this prompt' },
        { status: 409 }
      );
    }

    // Copy the prompt using the database function
    const { data: newPromptId, error: copyError } = await supabase.rpc('copy_public_prompt', {
      source_prompt_id,
      target_user_id: user.id,
      new_name: new_name || null,
    });

    if (copyError) {
      console.error('Copy prompt error:', copyError);
      return NextResponse.json({ error: 'Failed to copy prompt' }, { status: 500 });
    }

    // Get the newly created prompt
    const { data: newPrompt, error: fetchError } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', newPromptId)
      .single();

    if (fetchError) {
      console.error('Fetch new prompt error:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch copied prompt' }, { status: 500 });
    }

    // Get the original prompt's slug for linking back
    const { data: originalPrompt } = await supabase
      .from('prompts')
      .select('slug')
      .eq('id', source_prompt_id)
      .single();

    return NextResponse.json({
      message: 'Prompt copied successfully',
      prompt: newPrompt,
      originalPrompt: {
        id: source_prompt_id,
        slug: originalPrompt?.slug,
      },
    });
  } catch (error) {
    console.error('Copy prompt error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
