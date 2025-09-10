import { NextResponse } from 'next/server';
import { z } from 'zod';

import { requireAuth } from '@/lib/server/auth';
import { assertOrgAdmin, assertOrgMember, orgIdSchema } from '@/lib/server/org';
import { createRateLimiter } from '@/lib/server/rate-limit';

const limiter = createRateLimiter({ windowMs: 60_000, max: 60 });

type RouteContext = { params: { orgId: string } };

const addMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['OWNER', 'ADMIN', 'EDITOR', 'VIEWER']).default('EDITOR'),
});

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { supabase, userId } = await requireAuth();
    const parse = orgIdSchema.safeParse(context.params.orgId);
    if (!parse.success) return NextResponse.json({ error: 'Invalid orgId' }, { status: 400 });
    const orgId = parse.data;
    await assertOrgMember({ supabase, userId }, orgId);

    // Only admins can see member emails. We'll fetch user profiles but omit emails here.
    const { data: members, error } = await supabase
      .from('organization_members')
      .select('user_id, role')
      .eq('org_id', orgId)
      .order('created_at', { ascending: true });
    if (error) throw error;

    // Join display data (best-effort)
    const ids = (members ?? []).map((m) => m.user_id);
    let profiles: any[] = [];
    if (ids.length > 0) {
      const { data: profs } = await supabase
        .from('user_profiles')
        .select('id, display_name, avatar_url')
        .in('id', ids);
      profiles = profs ?? [];
    }

    const profileById = new Map(profiles.map((p) => [p.id, p]));
    const result = (members ?? []).map((m) => ({
      user_id: m.user_id,
      role: m.role,
      profile: profileById.get(m.user_id) ?? null,
    }));
    return NextResponse.json(result);
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
    await limiter(`org-members-add:${userId}`);
    await assertOrgAdmin({ supabase, userId }, orgId);

    const body = await request.json();
    const parsed = addMemberSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );

    const { userId: addUserId, role } = parsed.data;
    const { data, error } = await supabase
      .from('organization_members')
      .insert({ org_id: orgId, user_id: addUserId, role })
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status });
  }
}
