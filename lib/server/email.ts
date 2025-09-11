import type { SendEmailCommandInput } from '@aws-sdk/client-ses';

let sesClient: any | null = null;

export interface EmailMessage {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | string[];
}

function getArray(input: string | string[] | undefined): string[] | undefined {
  if (!input) return undefined;
  return Array.isArray(input) ? input : [input];
}

function hasSesEnv(): boolean {
  return Boolean(process.env.AWS_SES_REGION && (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_SES_ACCESS_KEY_ID));
}

async function ensureSes() {
  if (!hasSesEnv()) return null;
  if (sesClient) return sesClient;
  const region = process.env.AWS_SES_REGION as string;
  // Prefer standard AWS env vars; allow AWS_SES_* aliases
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_SES_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SES_SECRET_ACCESS_KEY;
  const { SESClient } = await import('@aws-sdk/client-ses');
  sesClient = new SESClient({
    region,
    credentials:
      accessKeyId && secretAccessKey
        ? { accessKeyId, secretAccessKey }
        : undefined,
  });
  return sesClient;
}

async function sendWithSes(message: EmailMessage) {
  const client = await ensureSes();
  if (!client) return false;

  const toAddresses = getArray(message.to) as string[];
  const replyToAddresses = getArray(message.replyTo);

  const input: SendEmailCommandInput = {
    Destination: { ToAddresses: toAddresses },
    Message: {
      Subject: { Data: message.subject, Charset: 'UTF-8' },
      Body: {
        ...(message.html ? { Html: { Data: message.html, Charset: 'UTF-8' } } : {}),
        ...(message.text ? { Text: { Data: message.text, Charset: 'UTF-8' } } : {}),
      },
    },
    Source: message.from,
    ...(replyToAddresses ? { ReplyToAddresses: replyToAddresses } : {}),
  };

  const { SendEmailCommand } = await import('@aws-sdk/client-ses');
  const command = new SendEmailCommand(input);
  await client.send(command);
  return true;
}

async function sendWithResend(message: EmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: message.from,
      to: getArray(message.to),
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: getArray(message.replyTo),
    }),
  });
  if (!res.ok) {
    const details = await res.text().catch(() => '');
    throw Object.assign(new Error('Resend send failed'), { details });
  }
  return true;
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  // Try SES first if configured, then fall back to Resend
  if (hasSesEnv()) {
    try {
      await sendWithSes(message);
      return;
    } catch (err) {
      // Fall through to fallback
      if (!process.env.RESEND_API_KEY) throw err;
    }
  }

  if (process.env.RESEND_API_KEY) {
    await sendWithResend(message);
    return;
  }

  throw new Error('No email provider configured. Set AWS_SES_REGION (+ credentials) or RESEND_API_KEY.');
}


