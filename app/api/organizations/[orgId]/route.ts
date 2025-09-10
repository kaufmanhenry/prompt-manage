import { NextResponse } from 'next/server';
import { z } from 'zod';

import { requireAuth } from '@/lib/server/auth';
import { assertOrgAdmin, orgIdSchema, orgNameSchema, orgSlugSchema } from '@/lib/server/org';
import { createRateLimiter } from '@/lib/server/rate-limit';

const limiter = createRateLimiter({ windowMs: 60_000, max: 30 });

type RouteContext = { params: { orgId: string } };

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { supabase } = await requireAuth();
    const parse = orgIdSchema.safeParse(context.params.orgId);
    if (!parse.success) return NextResponse.json({ error: 'Invalid orgId' }, { status: 400 });
    const orgId = parse.data;

    // Membership enforced by RLS when selecting organization
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', orgId)
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status });
  }
}

const updateSchema = z
  .object({ name: orgNameSchema.optional(), slug: orgSlugSchema.optional() })
  .refine((v) => v.name || v.slug, { message: 'No changes' });

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { supabase, userId } = await requireAuth();
    const parse = orgIdSchema.safeParse(context.params.orgId);
    if (!parse.success) return NextResponse.json({ error: 'Invalid orgId' }, { status: 400 });
    const orgId = parse.data;
    await limiter(`org-update:${orgId}`);
    await assertOrgAdmin({ supabase, userId }, orgId);

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );

    const updates: Record<string, unknown> = {};
    if (parsed.data.name) updates.name = parsed.data.name;
    if (parsed.data.slug) updates.slug = parsed.data.slug;

    // If slug is being updated, ensure uniqueness
    if (updates.slug) {
      const { count, error: countError } = await supabase
        .from('organizations')
        .select('id', { count: 'exact', head: true })
        .eq('slug', updates.slug as string)
        .neq('id', orgId);
      if (countError) throw countError;
      if ((count ?? 0) > 0)
        return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('organizations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', orgId)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { supabase, userId } = await requireAuth();
    const parse = orgIdSchema.safeParse(context.params.orgId);
    if (!parse.success) return NextResponse.json({ error: 'Invalid orgId' }, { status: 400 });
    const orgId = parse.data;
    await limiter(`org-delete:${orgId}`);
    await assertOrgAdmin({ supabase, userId }, orgId);

    const { error } = await supabase.from('organizations').delete().eq('id', orgId);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status });
  }
}
