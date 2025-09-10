import { NextResponse } from 'next/server';
import { z } from 'zod';

import { requireAuth } from '@/lib/server/auth';
import { assertOrgAdmin, orgIdSchema } from '@/lib/server/org';
import { createRateLimiter } from '@/lib/server/rate-limit';

const limiter = createRateLimiter({ windowMs: 60_000, max: 20 });

type RouteContext = { params: { orgId: string } };

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']).default('EDITOR'),
});

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { supabase, userId } = await requireAuth();
    const parse = orgIdSchema.safeParse(context.params.orgId);
    if (!parse.success) return NextResponse.json({ error: 'Invalid orgId' }, { status: 400 });
    const orgId = parse.data;
    await assertOrgAdmin({ supabase, userId }, orgId);

    const { data, error } = await supabase
      .from('organization_invitations')
      .select('id, org_id, email, role, status, invited_by, accepted_by, expires_at, created_at')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status });
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { supabase, userId } = await requireAuth();
    const parse = orgIdSchema.safeParse(context.params.orgId);
    if (!parse.success) return NextResponse.json({ error: 'Invalid orgId' }, { status: 400 });
    const orgId = parse.data;
    await limiter(`org-invite:${userId}`);
    await assertOrgAdmin({ supabase, userId }, orgId);

    const body = await request.json();
    const parsed = inviteSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    const { email, role } = parsed.data;

    const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('organization_invitations')
      .insert({ org_id: orgId, email, role, token, invited_by: userId, expires_at: expiresAt })
      .select('id, org_id, email, role, status, token, expires_at, created_at')
      .single();
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status });
  }
}
