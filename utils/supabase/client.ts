import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  if (typeof window !== 'undefined') {
    try {
      const origin = window.location.origin;
      const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (origin.includes('localhost') && supaUrl && !supaUrl.includes('localhost') && !supaUrl.includes('127.0.0.1')) {
        // Helpful warning if local dev is pointing to a remote Supabase project (can cause prod redirects)
        // eslint-disable-next-line no-console
        console.warn('[Supabase] Localhost origin is using remote Supabase URL:', supaUrl);
      }
    } catch {}
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
