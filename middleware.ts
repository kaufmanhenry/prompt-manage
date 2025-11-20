import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  // 1. Run next-intl middleware first to handle locale routing
  const response = intlMiddleware(request)

  // 2. Initialize Supabase response
  // We need to copy headers from intlMiddleware response to maintain locale cookies/headers
  let supabaseResponse = response

  // Skip Supabase auth in test environments where credentials aren't available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        })
        supabaseResponse = NextResponse.next({
          request,
        })
        // Copy headers from intl response again if we created a new response
        response.headers.forEach((value: string, key: string) => {
          supabaseResponse.headers.set(key, value)
        })
        supabaseResponse.cookies.set({
          name,
          value,
          ...options,
        })
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        })
        supabaseResponse = NextResponse.next({
          request,
        })
        // Copy headers from intl response again if we created a new response
        response.headers.forEach((value: string, key: string) => {
          supabaseResponse.headers.set(key, value)
        })
        supabaseResponse.cookies.set({
          name,
          value: '',
          ...options,
        })
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  // Note: We need to check against the pathname *without* the locale prefix if present
  // But request.nextUrl.pathname includes the locale (e.g. /en/dashboard)
  // We can use a regex or routing.locales to strip it
  const pathname = request.nextUrl.pathname
  const protectedRoutes = ['/dashboard', '/settings', '/profile']

  // Check if path is protected (handling locale prefix)
  const isProtectedRoute = protectedRoutes.some((route) => {
    // Check exact match or locale-prefixed match
    return (
      pathname.startsWith(route) ||
      routing.locales.some((locale) => pathname.startsWith(`/${locale}${route}`))
    )
  })

  if (isProtectedRoute && !session) {
    // Redirect unauthenticated users to home with redirect param
    // We should respect the current locale
    const redirectUrl = new URL('/', request.url)
    // If current path has locale, keep it?
    // Actually, let's just redirect to root and let intl middleware handle locale
    // Or better, redirect to /login or /?redirect=...

    // Simple approach: Redirect to root (which redirects to /en or /zh)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (optional, but usually we don't localize API)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.svg|favicon.svg|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
