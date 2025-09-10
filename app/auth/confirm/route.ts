import { NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirect') || '/dashboard';

  if (code) {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (session && !error) {
      // Check if user profile exists, create if it doesn't
      const { error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const displayName =
          session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'User';

        await supabase.from('user_profiles').insert({
          id: session.user.id,
          display_name: displayName,
          email_notifications: true,
          dark_mode: false,
          theme_preference: 'system',
        });
      }
    }
  }

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
}
