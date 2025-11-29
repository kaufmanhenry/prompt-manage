/**
 * ⚠️ DEPRECATED - DO NOT USE THIS WEBHOOK ENDPOINT
 *
 * This file has been deprecated as of 2025-01-28.
 *
 * This webhook was designed for team-level billing but conflicts with the
 * current user-level billing implementation.
 *
 * CORRECT WEBHOOK: /api/stripe/webhook
 *
 * This endpoint expected 'teamId' metadata but checkout sends 'userId'.
 * Using this endpoint would cause subscription updates to fail.
 *
 * See: DEPRECATED_OLD_WEBHOOK.md for full details
 *
 * TODO: Delete this file entirely after confirming all webhooks point to /api/stripe/webhook
 */

export async function POST() {
  return new Response(
    JSON.stringify({
      error: 'This webhook endpoint is deprecated. Use /api/stripe/webhook instead.',
    }),
    {
      status: 410, // Gone
      headers: { 'Content-Type': 'application/json' },
    },
  )
}
