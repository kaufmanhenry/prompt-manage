import { NextResponse } from 'next/server';
import { z } from 'zod';

import { requireAuth } from '@/lib/server/auth';
import { orgNameSchema, orgSlugSchema } from '@/lib/server/org';
import { createRateLimiter } from '@/lib/server/rate-limit';

const limiter = createRateLimiter({ windowMs: 60_000, max: 10 });

const createOrgSchema = z.object({
  name: orgNameSchema,
  slug: orgSlugSchema,
});

export async function GET() {
  try {
    const { supabase } = await requireAuth();
    // RLS ensures only organizations where user is a member are returned
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, userId } = await requireAuth();
    await limiter(`org-create:${userId}`);

    const body = await request.json();
    const parsed = createOrgSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }
    const { name, slug } = parsed.data;

    // Ensure slug is unique
    const { count, error: countError } = await supabase
      .from('organizations')
      .select('id', { count: 'exact', head: true })
      .eq('slug', slug);
    if (countError) throw countError;
    if ((count ?? 0) > 0) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('organizations')
      .insert({ name, slug, created_by: userId })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status });
  }
}
