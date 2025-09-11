import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/server/email';

// Minimal email forwarding using Resend HTTP API (no extra deps)
// Requires env: RESEND_API_KEY
// Optionally set CONTACT_TO (defaults to support@promptmanage.com) and CONTACT_FROM

type ContactPayload = {
  name?: string;
  email: string;
  company?: string;
  message?: string;
  source?: 'contact' | 'prompt-pack' | string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ContactPayload>;

    const toAddress = process.env.CONTACT_TO || 'support@promptmanage.com';
    const fromAddress = process.env.CONTACT_FROM || `Prompt Manage <no-reply@promptmanage.com>`;
    const hasProvider = Boolean(process.env.AWS_SES_REGION || process.env.RESEND_API_KEY);
    if (!hasProvider) return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });

    const email = (body.email || '').trim();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const name = (body.name || '').trim();
    const company = (body.company || '').trim();
    const message = (body.message || '').trim();
    const source = (body.source || 'contact').toString();

    const subjectPrefix = source === 'prompt-pack' ? 'Prompt Pack' : 'Contact';
    const subject = `New ${subjectPrefix} submission from ${name || email}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif; line-height:1.5;">
        <h2 style="margin:0 0 12px;">New ${subjectPrefix} Submission</h2>
        <p><strong>Source:</strong> ${source}</p>
        <p><strong>Name:</strong> ${name || '—'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || '—'}</p>
        ${message ? `<p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>` : ''}
      </div>
    `;

    await sendEmail({ from: fromAddress, to: [toAddress], subject, html, replyTo: email });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
