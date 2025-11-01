import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

// Helper function to create user profile if it doesn't exist
async function createUserProfileIfNeeded(
  supabase: SupabaseClient,
  userId: string,
  user: User,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single()

    // If profile exists, we're done
    if (existingProfile && !profileError) {
      return { success: true }
    }

    // Only create if profile doesn't exist (error code PGRST116 means no rows found)
    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const displayName =
        user.user_metadata?.display_name ||
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        'User'

      const fullName = user.user_metadata?.full_name || displayName

      // Insert profile - the trigger will auto-generate username
      const { error: insertError } = await supabase.from('user_profiles').insert({
        id: userId,
        display_name: displayName,
        full_name: fullName,
        email_notifications: true,
        dark_mode: false,
        theme_preference: 'system',
      })

      if (insertError) {
        console.error('Error creating user profile:', insertError)
        return {
          success: false,
          error: `Database error saving new user: ${insertError.message}`,
        }
      }

      return { success: true }
    }

    // If it's a different error, return it
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking user profile:', profileError)
      return {
        success: false,
        error: `Database error: ${profileError.message}`,
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error creating user profile:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token = requestUrl.searchParams.get('token') // Magic link token
  const type = requestUrl.searchParams.get('type') // Magic link type
  const errorCode = requestUrl.searchParams.get('error')
  const redirectTo = requestUrl.searchParams.get('redirect') || '/dashboard'

  // Handle OAuth errors
  if (errorCode) {
    console.error('OAuth error:', errorCode)
    const errorUrl = new URL('/auth/error', requestUrl.origin)
    errorUrl.searchParams.set('error', errorCode)
    errorUrl.searchParams.set('redirect', redirectTo)
    return NextResponse.redirect(errorUrl)
  }

  const supabase = await createClient()

  // Check if user already has a session (magic link may have auto-authenticated)
  const {
    data: { session: existingSession },
  } = await supabase.auth.getSession()

  // Handle magic link (email OTP)
  // Supabase magic links automatically create a session when clicked
  // But we also handle manual verification if needed
  if ((type === 'magiclink' || token) && !existingSession) {
    const email = requestUrl.searchParams.get('email') || undefined

    // For magic links, Supabase sends the token in the URL
    // We need to verify it manually if session doesn't exist
    const verifyResult = await supabase.auth.verifyOtp({
      token_hash: token || undefined,
      email: email || undefined,
      type: type === 'magiclink' ? 'magiclink' : 'email',
    })

    if (verifyResult.error) {
      console.error('Magic link verification error:', verifyResult.error)
      const errorUrl = new URL('/auth/error', requestUrl.origin)
      errorUrl.searchParams.set('error', verifyResult.error.message)
      errorUrl.searchParams.set('redirect', redirectTo)
      return NextResponse.redirect(errorUrl)
    }

    if (verifyResult.data?.session) {
      // Create profile if needed
      const profileResult = await createUserProfileIfNeeded(
        supabase,
        verifyResult.data.session.user.id,
        verifyResult.data.session.user,
      )

      if (!profileResult.success) {
        console.error('Profile creation failed:', profileResult.error)
        const errorUrl = new URL('/auth/error', requestUrl.origin)
        errorUrl.searchParams.set('error', profileResult.error || 'Failed to create user profile')
        errorUrl.searchParams.set('redirect', redirectTo)
        return NextResponse.redirect(errorUrl)
      }

      return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
    }
  } else if (existingSession) {
    // Magic link already authenticated, just create profile if needed
    const profileResult = await createUserProfileIfNeeded(
      supabase,
      existingSession.user.id,
      existingSession.user,
    )

    if (!profileResult.success) {
      console.error('Profile creation failed:', profileResult.error)
      const errorUrl = new URL('/auth/error', requestUrl.origin)
      errorUrl.searchParams.set('error', profileResult.error || 'Failed to create user profile')
      errorUrl.searchParams.set('redirect', redirectTo)
      return NextResponse.redirect(errorUrl)
    }

    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
  }

  // Handle OAuth callback (code exchange)
  if (code) {
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      const errorUrl = new URL('/auth/error', requestUrl.origin)
      errorUrl.searchParams.set('error', error.message)
      errorUrl.searchParams.set('redirect', redirectTo)
      return NextResponse.redirect(errorUrl)
    }

    if (session) {
      // Create profile if needed
      const profileResult = await createUserProfileIfNeeded(
        supabase,
        session.user.id,
        session.user,
      )

      if (!profileResult.success) {
        console.error('Profile creation failed:', profileResult.error)
        const errorUrl = new URL('/auth/error', requestUrl.origin)
        errorUrl.searchParams.set('error', profileResult.error || 'Failed to create user profile')
        errorUrl.searchParams.set('redirect', redirectTo)
        return NextResponse.redirect(errorUrl)
      }
    }
  }

  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
