# Prompt Run Rate Limiting Implementation

## Overview

This document describes the rate limiting system implemented for prompt executions (API runs) to prevent abuse and manage OpenAI API costs.

## Rate Limits by Plan

| Plan  | Price/Month | Monthly Prompt Runs | Storage Limit |
|-------|-------------|---------------------|---------------|
| Free  | $0          | 10 runs/month       | 25 prompts    |
| Team  | $20         | 100 runs/month      | Unlimited     |
| Pro   | $99         | 1,000 runs/month    | Unlimited     |

## Implementation Details

### Files Modified

1. **`lib/pricing.ts`**
   - Added `promptRunsPerMonth` field to plan limits
   - Updated plan features to display run limits

2. **`lib/subscription.ts`**
   - Added `promptRunsThisMonth` and `promptRunsTotal` to `UsageStats` interface
   - Updated `getUserUsage()` to query `prompt_run_history` table
   - Created `canUserRunPrompt()` function to check limits

3. **`app/api/prompt/run/route.ts`**
   - Added rate limit check before executing prompts
   - Returns 429 status with upgrade message when limit reached
   - Includes usage stats in successful responses

### Database Requirements

The implementation relies on the `prompt_run_history` table to track executions:

```sql
CREATE TABLE prompt_run_history (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  prompt_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  -- other fields...
);
```

This table is created by migration: `20250115000000_token_tracking_system_fixed.sql`

### API Response Format

**Success Response (200):**
```json
{
  "success": true,
  "response": "AI generated response...",
  "prompt": { "id": "...", "name": "...", "prompt_text": "..." },
  "execution_time_ms": 1234,
  "tokens_used": 567,
  "usage": {
    "runsThisMonth": 5,
    "limit": 10,
    "remaining": 5
  }
}
```

**Rate Limit Exceeded (429):**
```json
{
  "error": "Monthly prompt run limit reached",
  "message": "You've reached your monthly limit of 10 prompt runs. Upgrade your plan to run more prompts.",
  "limit": 10,
  "remaining": 0,
  "upgradeUrl": "/pricing"
}
```

## How It Works

1. **User initiates prompt run** via `/api/prompt/run`
2. **System checks authentication** and retrieves user ID
3. **System fetches subscription and usage data** in parallel:
   - Current subscription plan (Free, Team, or Pro)
   - Monthly prompt run count from `prompt_run_history`
4. **Rate limit validation** using `canUserRunPrompt()`:
   - Admins bypass limits (treated as Pro)
   - Past due/unpaid subscriptions blocked
   - Free users limited to 10 runs/month
   - Team users limited to 100 runs/month
   - Pro users limited to 1,000 runs/month
5. **If allowed**, execute prompt and log to history
6. **If denied**, return 429 error with upgrade information

## Admin Access

Admin users (defined in `lib/admin.ts`) automatically receive Pro-level access with 1,000 runs/month, regardless of their actual subscription status.

## Monitoring Usage

Users can monitor their usage through:
- API responses (includes usage stats)
- Dashboard (to be implemented)
- Settings/Billing page (to be implemented)

## Future Enhancements

- [ ] Real-time usage dashboard
- [ ] Email notifications at 80% and 100% of limit
- [ ] Per-minute rate limiting (prevent spam attacks)
- [ ] Usage analytics and reporting
- [ ] Auto-scaling limits for enterprise customers
- [ ] Rollover unused runs to next month (optional feature)

## Testing

To test rate limiting:

1. **Free Account:**
   ```bash
   # Run prompt 10 times
   # 11th run should return 429 error
   ```

2. **Subscription Check:**
   ```bash
   # Verify subscription status via /api/subscription/status
   # Check usage via getUserUsage() function
   ```

3. **Month Reset:**
   - Rate limits reset automatically on the 1st of each month
   - Calculated dynamically based on `created_at >= start_of_month`

## Security Considerations

- ✅ Authentication required (no anonymous runs)
- ✅ User can only run their own prompts
- ✅ Rate limits prevent cost abuse
- ✅ Admin detection server-side only
- ✅ Database-backed counting (not client-controlled)

## Cost Impact

Before rate limiting:
- Free users could run unlimited prompts → unbounded OpenAI costs

After rate limiting:
- Free users: max $0.50-$2/month in OpenAI costs (10 runs × ~$0.05-0.20)
- Team users: max $5-$20/month (100 runs)
- Pro users: max $50-$200/month (1,000 runs)

**Note:** These are rough estimates. Actual costs depend on prompt length, model used, and response size.

## Migration Path

This implementation is backward compatible:
- Existing `prompt_run_history` entries count toward limits
- No data migration required
- Works with existing database schema

## Support

For questions or issues with rate limiting:
- Check `/settings/billing` for current usage
- Review plan limits at `/pricing`
- Contact support for limit increases
