import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolName, promptGenerated, fingerprint } = body
    
    if (!toolName) {
      return NextResponse.json({ error: 'Tool name required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Get user if logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // If not logged in, check rate limit
    if (!user) {
      const { data: rateLimit, error: rateLimitError } = await supabase
        .rpc('check_free_tool_rate_limit', {
          p_tool_name: toolName,
          p_ip_address: ip,
          p_fingerprint: fingerprint || ip
        })

      if (rateLimitError) {
        console.error('Rate limit check error:', rateLimitError)
        return NextResponse.json({ error: 'Rate limit check failed' }, { status: 500 })
      }

      if (!rateLimit.allowed) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            message: `You've reached the limit of 3 uses per 24 hours. Sign up for unlimited access!`,
            limit: rateLimit.limit,
            count: rateLimit.count,
            resetAt: rateLimit.reset_at
          }, 
          { status: 429 }
        )
      }
    }

    // Log the usage
    const { error: insertError } = await supabase
      .from('free_tool_usage')
      .insert({
        tool_name: toolName,
        user_id: user?.id || null,
        ip_address: ip,
        fingerprint: fingerprint || ip,
        prompt_generated: promptGenerated,
        saved_to_library: false
      })

    if (insertError) {
      console.error('Error logging usage:', insertError)
      // Don't fail the request if logging fails
    }

    // Get remaining uses if not logged in
    let remaining = null
    if (!user) {
      const { data: rateLimit } = await supabase
        .rpc('check_free_tool_rate_limit', {
          p_tool_name: toolName,
          p_ip_address: ip,
          p_fingerprint: fingerprint || ip
        })
      remaining = rateLimit?.remaining
    }

    return NextResponse.json({ 
      success: true,
      isLoggedIn: !!user,
      remaining: remaining
    })

  } catch (error) {
    console.error('Free tool usage error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Check rate limit without logging usage
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const toolName = searchParams.get('tool')
    const fingerprint = searchParams.get('fingerprint')
    
    if (!toolName) {
      return NextResponse.json({ error: 'Tool name required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Get user if logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    // If logged in, no rate limit
    if (user) {
      return NextResponse.json({ 
        allowed: true,
        isLoggedIn: true,
        remaining: -1 // unlimited
      })
    }

    // Get IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'

    // Check rate limit
    const { data: rateLimit, error } = await supabase
      .rpc('check_free_tool_rate_limit', {
        p_tool_name: toolName,
        p_ip_address: ip,
        p_fingerprint: fingerprint || ip
      })

    if (error) {
      console.error('Rate limit check error:', error)
      return NextResponse.json({ error: 'Rate limit check failed' }, { status: 500 })
    }

    return NextResponse.json({
      allowed: rateLimit.allowed,
      isLoggedIn: false,
      count: rateLimit.count,
      limit: rateLimit.limit,
      remaining: rateLimit.remaining,
      resetAt: rateLimit.reset_at
    })

  } catch (error) {
    console.error('Rate limit check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

