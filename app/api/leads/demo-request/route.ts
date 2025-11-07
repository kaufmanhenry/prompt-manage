import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { teamId, pendingEmail, currentPlan, source } = await req.json()

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 })
    }

    // Get team details
    const { data: team } = await supabase
      .from('teams')
      .select('name, tier')
      .eq('id', teamId)
      .single()

    // Get user details
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()

    // Create demo request record
    const { data: demoRequest, error: insertError } = await supabase
      .from('demo_requests')
      .insert({
        team_id: teamId,
        user_id: user.id,
        user_email: user.email,
        user_name: userProfile?.display_name || null,
        team_name: team?.name || null,
        current_plan: currentPlan || team?.tier || 'team',
        pending_invite_email: pendingEmail || null,
        source: source || 'unknown',
        status: 'pending',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Failed to create demo request:', insertError)
      // Don't fail the request, just log
    }

    // Send notification to sales team
    const resendApiKey = process.env.RESEND_API_KEY
    const salesEmail = process.env.SALES_EMAIL || 'sales@promptmanage.com'

    if (resendApiKey && salesEmail) {
      const emailPayload = {
        from: process.env.CONTACT_FROM || 'notifications@promptmanage.com',
        to: [salesEmail],
        subject: `🚀 New Demo Request - ${team?.name || 'Team'} wants to upgrade`,
        html: `
          <h2>New Demo Request</h2>
          <p>A team has requested a demo to upgrade from ${currentPlan || 'Team'} to Pro!</p>

          <h3>Details:</h3>
          <ul>
            <li><strong>Team:</strong> ${team?.name || 'Unknown'}</li>
            <li><strong>Contact:</strong> ${userProfile?.display_name || 'Unknown'} (${user.email})</li>
            <li><strong>Current Plan:</strong> ${currentPlan || team?.tier || 'team'}</li>
            <li><strong>Team ID:</strong> ${teamId}</li>
            <li><strong>Trying to invite:</strong> ${pendingEmail || 'N/A'}</li>
            <li><strong>Source:</strong> ${source || 'unknown'}</li>
          </ul>

          <p><strong>Action Required:</strong> Reach out to schedule a demo!</p>

          <p>
            <a href="mailto:${user.email}?subject=Demo Request for ${team?.name || 'Your Team'}&body=Hi ${userProfile?.display_name || ''},

Thanks for your interest in upgrading to Pro! I'd love to show you how Pro can help your team.

When would be a good time for a quick demo?

Best,
The Prompt Manage Team"
              style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Reply to Demo Request
            </a>
          </p>
        `,
      }

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload),
      }).catch((err) => console.error('Failed to send sales notification:', err))
    }

    return NextResponse.json({
      success: true,
      demoRequestId: demoRequest?.id,
    })
  } catch (error) {
    console.error('Demo request error:', error)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
