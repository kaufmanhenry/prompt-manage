import { NextResponse } from 'next/server';
import { z } from 'zod';

import { requireAuth } from '@/lib/server/auth';
import { createRateLimiter } from '@/lib/server/rate-limit';

const limiter = createRateLimiter({ windowMs: 60_000, max: 20 });

const acceptSchema = z.object({ token: z.string().min(32).max(128) });

export async function POST(request: Request) {
  try {
    const { supabase, userId } = await requireAuth();
    await limiter(`invite-accept:${userId}`);

    const body = await request.json();
    const parsed = acceptSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );

    const { data, error } = await supabase.rpc('accept_org_invitation', {
      p_token: parsed.data.token,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    const status = error?.status ?? 500;
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status });
  }
}
