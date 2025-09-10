import { createClient } from '@/utils/supabase/server';

export interface AuthContext {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
}

export async function requireAuth(): Promise<AuthContext> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }

  return { supabase, userId: user.id };
}
