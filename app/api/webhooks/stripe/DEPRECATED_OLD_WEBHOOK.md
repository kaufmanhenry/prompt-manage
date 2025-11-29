# ⚠️ DEPRECATED - OLD WEBHOOK ENDPOINT

This webhook endpoint (`/api/webhooks/stripe`) has been **DEPRECATED** and should not be used.

## Why Deprecated?

This webhook was designed for team-level billing but the codebase now uses **user-level billing** with the `user_subscriptions` table.

### Problems with this endpoint:

1. Expects `teamId` metadata - checkout sends `userId` ❌
2. Updates `teams` table - app uses `user_subscriptions` table ❌
3. Uses different field names (`tier` vs `plan`) ❌
4. Would cause subscription updates to fail silently ❌

## Use This Instead

**Correct webhook endpoint:** `/api/stripe/webhook`

- File: `app/api/stripe/webhook/route.ts`
- Updates: `user_subscriptions` table
- Metadata: `userId` and `plan`
- Status: ✅ Production ready

## Migration Note

This file was deprecated on 2025-01-28 during paywall audit.

The old webhook logic has been preserved here for reference but should NOT be configured in Stripe Dashboard.

---

**Date Deprecated:** 2025-01-28
**Replaced By:** `/api/stripe/webhook`
