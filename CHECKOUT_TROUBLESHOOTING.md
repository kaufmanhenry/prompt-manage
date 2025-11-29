# Checkout Troubleshooting Guide

This guide helps diagnose and resolve internal server errors during the checkout process.

## Quick Diagnostics

When you encounter a checkout error, check your server logs for messages starting with `[Checkout]`. These will tell you exactly where the error occurred.

## Common Issues and Solutions

### 1. Missing Stripe Price IDs (Most Common)

**Error Message in Logs:**
```
[Checkout] CRITICAL: Error getting Stripe Price ID for plan "team": Missing Stripe Price ID for team plan
```

**Solution:**
1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Find or create your Team and Pro products
3. Copy the Price IDs (start with `price_...`)
4. Add them to your `.env.local` file:
   ```
   STRIPE_PRICE_TEAM_MONTHLY_ID=price_xxxxxxxxxxxxx
   STRIPE_PRICE_PRO_MONTHLY_ID=price_xxxxxxxxxxxxx
   ```
5. Restart your development server

### 2. Missing Stripe Secret Key

**Error Message in Logs:**
```
Missing STRIPE_SECRET_KEY environment variable
```

**Solution:**
1. Go to [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys)
2. Copy your Secret Key (starts with `sk_test_` or `sk_live_`)
3. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   ```
4. Restart your development server

### 3. Test Mode vs Live Mode Mismatch

**Symptoms:**
- Checkout works in development but fails in production
- Errors about invalid customer or price IDs

**Solution:**
Ensure you're using matching test/live keys:
- **Development:** Use `sk_test_...` and `price_test_...`
- **Production:** Use `sk_live_...` and `price_live_...`

### 4. Database Connection Issues

**Error Message in Logs:**
```
[Checkout] Database error fetching subscription: [error details]
```

**Solution:**
1. Check your Supabase connection:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Verify the `user_subscriptions` table exists
3. Check Supabase service status

### 5. Stripe API Errors

**Error Message in Logs:**
```
[Checkout] CRITICAL: Stripe checkout session creation failed: [error details]
```

**Common Causes:**
- Invalid Price ID (doesn't exist or wrong mode)
- Price ID is for a different Stripe account
- Stripe account not activated
- Invalid customer data

**Solution:**
1. Verify Price IDs in Stripe Dashboard
2. Check you're using the correct Stripe account
3. Ensure your Stripe account is activated (not in restricted mode)

## Server Logs Guide

The checkout process logs detailed information at each step:

```
[Checkout] Processing checkout for user: <user_id> plan: <plan>
[Checkout] Found existing Stripe customer: <customer_id>
  OR
[Checkout] Creating new Stripe customer for user: <user_id>
[Checkout] Created new Stripe customer: <customer_id>
[Checkout] Using Stripe Price ID: <price_id> for plan: <plan>
[Checkout] Creating Stripe checkout session with base URL: <url>
[Checkout] Successfully created checkout session: <session_id>
```

If any step fails, you'll see a `CRITICAL` or `ERROR` log at that point.

## Environment Variable Checklist

Use this checklist to verify all required variables are set:

### Required (Checkout will fail without these):
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_PRICE_TEAM_MONTHLY_ID`
- [ ] `STRIPE_PRICE_PRO_MONTHLY_ID`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Recommended:
- [ ] `NEXT_PUBLIC_BASE_URL` (defaults to localhost if missing)
- [ ] `NEXT_PUBLIC_APP_URL`

## Testing Checklist

Before deploying to production:

1. [ ] Test checkout with a test card in development
2. [ ] Verify webhook is configured in Stripe Dashboard
3. [ ] Confirm all environment variables are set in production
4. [ ] Test with Stripe test mode first
5. [ ] Monitor server logs during first real checkout

## Stripe Test Cards

Use these for testing:

- **Success:** `4242 4242 4242 4242`
- **Requires Authentication:** `4000 0025 0000 3155`
- **Declined:** `4000 0000 0000 9995`

All test cards:
- Use any future expiry date
- Use any 3-digit CVC
- Use any ZIP code

## Getting Help

If you're still experiencing issues:

1. Check server logs for `[Checkout]` messages
2. Verify all environment variables are set correctly
3. Test with Stripe test mode and test cards
4. Check [Stripe Dashboard → Logs](https://dashboard.stripe.com/logs) for API errors
5. Review [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks) for webhook issues

## Developer Notes

### New Error Logging (Added)

The checkout endpoint now includes detailed logging:
- All steps in the checkout process are logged
- Errors are prefixed with `[Checkout]` for easy filtering
- Critical errors are marked as `CRITICAL` or `FATAL ERROR`

### Environment Validation

The checkout endpoint now validates environment variables before processing. If required variables are missing, you'll get a clear error message:

**Client Error:**
```json
{
  "error": "Server configuration error",
  "details": "Missing required payment configuration. Please contact support."
}
```

**Server Logs:**
```
[Checkout] Missing required environment variables: [list of missing vars]
```

### File References

Key files for checkout flow:
- API Route: `/app/api/stripe/create-checkout-session/route.ts`
- Pricing Page: `/app/[locale]/pricing/page.tsx`
- Server Config: `/lib/pricing-server.ts`
- Environment Validation: `/lib/env-validation.ts`
