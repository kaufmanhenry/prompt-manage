import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

type InviteEmailPayload = {
  invitationId: string
}

export async function POST(request: NextRequest) {
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

    const body = (await request.json()) as Partial<InviteEmailPayload>

    if (!body.invitationId) {
      return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 })
    }

    // Get invitation details
    const { data: invitation, error: inviteError } = await supabase
      .from('team_invitations')
      .select('*, teams(name)')
      .eq('id', body.invitationId)
      .single()

    if (inviteError || !invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    // Get the inviter's profile
    const { data: inviterProfile } = await supabase
      .from('user_profiles')
      .select('display_name')
      .eq('id', invitation.invited_by)
      .single()

    const resendApiKey = process.env.RESEND_API_KEY
    const fromAddress = process.env.CONTACT_FROM || 'invites@promptmanage.com'
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    if (!resendApiKey) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    const inviteUrl = `${baseUrl}/invite/${invitation.token}`
    const inviterName = inviterProfile?.display_name || 'Someone'
    const teamName = invitation.teams.name

    const subject = `You've been invited to join ${teamName} on Prompt Manage`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 24px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">Team Invitation</h1>
            </div>

            <!-- Content -->
            <div style="padding: 40px 32px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #374151; line-height: 1.6;">
                Hi there!
              </p>

              <p style="margin: 0 0 24px; font-size: 16px; color: #374151; line-height: 1.6;">
                <strong>${inviterName}</strong> has invited you to join <strong>${teamName}</strong> on Prompt Manage.
              </p>

              <div style="background-color: #f9fafb; border-left: 4px solid #667eea; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">Role:</p>
                <p style="margin: 0; font-size: 16px; color: #111827; font-weight: 500; text-transform: capitalize;">${invitation.role}</p>
              </div>

              <p style="margin: 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                Click the button below to accept the invitation and join the team:
              </p>

              <!-- Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${inviteUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 500; box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);">
                  Accept Invitation
                </a>
              </div>

              <p style="margin: 32px 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0; font-size: 14px; color: #667eea; word-break: break-all;">
                ${inviteUrl}
              </p>

              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.6;">
                  This invitation will expire on <strong>${new Date(invitation.expires_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280;">
                Prompt Manage - Collaborative Prompt Management
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const payload = {
      from: fromAddress,
      to: [invitation.email],
      subject,
      html,
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const details = await res.text().catch(() => '')
      console.error('Resend API error:', details)
      return NextResponse.json({ error: 'Failed to send email', details }, { status: 502 })
    }

    const result = await res.json()
    return NextResponse.json({ success: true, emailId: result.id })
  } catch (error) {
    console.error('Send invitation email error:', error)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
