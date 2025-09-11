import { NextResponse } from 'next/server';
import { z } from 'zod';

import { requireAuth } from '@/lib/server/auth';
import { assertOrgAdmin, assertOrgEditor } from '@/lib/server/org';
import { createRateLimiter } from '@/lib/server/rate-limit';

const limiter = createRateLimiter({ windowMs: 60_000, max: 30 });

type RouteContext = { params: { id: string } };

const transferSchema = z.object({
  orgId: z.string().uuid().nullable(),
  visibility: z.enum(['private', 'team', 'public']).optional(),
});

export async function POST(request: Request, context: RouteContext) {
  try {
    const { supabase, userId } = await requireAuth();
    const promptId = context.params.id;
    if (!promptId || !/^[0-9a-fA-F-]{36}$/.test(promptId)) {
      return NextResponse.json({ error: 'Invalid promptId' }, { status: 400 });
    }
    await limiter(`prompt-transfer:${userId}`);

    const body = await request.json();
    const parsed = transferSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    const { orgId, visibility } = parsed.data;

    // Fetch current prompt to determine current ownership
    const { data: prompt, error: fetchError } = await supabase
      .from('prompts')
      .select('id, user_id, org_id, visibility, is_public')
      .eq('id', promptId)
      .single();
    if (fetchError || !prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    // Authorization logic:
    // - Moving to org: require editor+ in that org
    // - Moving from org to personal: require admin in current org AND user is prompt owner if user-owned is relevant
    if (orgId) {
      await assertOrgEditor({ supabase, userId }, orgId);
    } else if (prompt.org_id) {
      await assertOrgAdmin({ supabase, userId }, prompt.org_id);
    } else {
      // personal -> personal changes only allowed by owner
      if (prompt.user_id !== userId)
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates: Record<string, unknown> = {};
    if (orgId) {
      updates.org_id = orgId;
      // if moving to org and visibility is not provided, default to 'team'
      if (!visibility) updates.visibility = 'team';
    } else {
      updates.org_id = null;
      // if moving back to personal with team visibility, normalize to private
      if (prompt.visibility === 'team' && !visibility) updates.visibility = 'private';
    }
    if (visibility) updates.visibility = visibility;
    // Preserve existing is_public behavior; visibility 'public' is additive
    if (visibility === 'public') {
      updates.is_public = true;
    }
    if (visibility === 'private' || visibility === 'team') {
      // Do not force is_public=false if previously public; only change if explicitly requested later by share API
    }

    const { error: updateError } = await supabase
      .from('prompts')
      .update(updates)
      .eq('id', promptId);
    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status });
  }
}
