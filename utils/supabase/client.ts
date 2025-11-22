import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          if (typeof document === 'undefined') return undefined
          const value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop()
          return value
        },
        set(name: string, value: string, options: { maxAge?: number; path?: string }) {
          if (typeof document === 'undefined') return
          document.cookie = `${name}=${value}; path=${options.path || '/'}; max-age=${options.maxAge || 31536000}; SameSite=Lax${
            process.env.NODE_ENV === 'production' ? '; Secure' : ''
          }`
        },
        remove(name: string, options: { path?: string }) {
          if (typeof document === 'undefined') return
          document.cookie = `${name}=; path=${options.path || '/'}; max-age=0`
        },
      },
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'sb-auth-token',
      },
    },
  )
}
