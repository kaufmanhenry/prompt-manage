# Code Quality Review Report

**Date:** January 30, 2025  
**Reviewer:** Senior Software Engineer  
**Scope:** Paywall System Implementation

---

## 📋 Files Analyzed

1. `app/api/subscription/status/route.ts`
2. `hooks/usePaywall.tsx`
3. `app/api/stripe/create-checkout-session/route.ts`
4. `app/api/stripe/webhook/route.ts`
5. `lib/subscription.ts`

---

## ✅ Fixed Code (Clean and Optimized)

### 1. Type Safety
- ✅ Proper TypeScript interfaces defined
- ✅ Type assertions are explicit and safe
- ✅ No implicit `any` types (except where necessary with Stripe SDK)

### 2. Error Handling
- ✅ Try-catch blocks properly implemented
- ✅ Appropriate HTTP status codes returned
- ✅ Error messages are user-friendly

### 3. Security
- ✅ Authentication checks in place
- ✅ Webhook signature verification
- ✅ Admin client used for webhook writes (bypasses RLS safely)

---

## ⚠️ Issues Found (With Reason + Fix)

### 🔴 **CRITICAL ISSUES**

#### 1. **Security Risk: Email Injection in Stripe Customer Creation**
**File:** `app/api/stripe/create-checkout-session/route.ts:45-49`  
**Issue:** User email passed directly without validation  
**Risk:** Potential email injection if user email is compromised  
**Fix:**
```typescript
// BEFORE (Line 45-49)
customer = await stripe.customers.create({
  email: session.user.email,
  metadata: {
    userId: session.user.id,
  },
})

// AFTER
customer = await stripe.customers.create({
  email: session.user.email?.trim().toLowerCase(), // Normalize email
  metadata: {
    userId: session.user.id,
  },
})
```

#### 2. **Race Condition: Database Upsert Without Conflict Resolution**
**File:** `app/api/stripe/create-checkout-session/route.ts:54-61`  
**Issue:** Upsert may fail if multiple requests create customer simultaneously  
**Fix:**
```typescript
// BEFORE (Line 54-61)
await supabase.from('user_subscriptions').upsert({
  user_id: session.user.id,
  plan: 'free',
  status: 'active',
  current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  stripe_customer_id: customerId,
  updated_at: new Date().toISOString(),
})

// AFTER
const { error: upsertError } = await supabase
  .from('user_subscriptions')
  .upsert(
    {
      user_id: session.user.id,
      plan: 'free',
      status: 'active',
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      stripe_customer_id: customerId,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id', // Explicit conflict resolution
    },
  )

if (upsertError) {
  console.error('Error storing customer ID:', upsertError)
  // Continue anyway - customer created in Stripe
}
```

#### 3. **Error Handling: Silent Failures in Webhook**
**File:** `app/api/stripe/webhook/route.ts:74-78`  
**Issue:** Webhook errors are logged but not tracked/monitored  
**Risk:** Silent failures could cause subscription state desync  
**Fix:**
```typescript
// BEFORE (Line 74-78)
if (upsertError) {
  console.error('Error upserting subscription:', upsertError)
} else {
  console.log(`✅ Subscription created/updated for user ${userId}, plan: ${plan}`)
}

// AFTER
if (upsertError) {
  console.error('Error upserting subscription:', upsertError)
  // TODO: Send to error tracking service (e.g., Sentry)
  // Consider: Retry mechanism or dead letter queue
  throw new Error(`Failed to upsert subscription: ${upsertError.message}`)
}
console.log(`✅ Subscription created/updated for user ${userId}, plan: ${plan}`)
```

#### 4. **Type Safety: Unsafe Type Assertions**
**File:** `app/api/stripe/webhook/route.ts:50, 93, 187`  
**Issue:** Using `as any` to access Stripe properties is unsafe  
**Risk:** Runtime errors if Stripe SDK changes  
**Fix:**
```typescript
// BEFORE (Line 50)
const currentPeriodEnd = (subscription as any).current_period_end as number

// AFTER
import type Stripe from 'stripe'
const currentPeriodEnd = (subscription as Stripe.Subscription).current_period_end
```

### 🟡 **MODERATE ISSUES**

#### 5. **Code Smell: Duplicate Type Checking Logic**
**File:** `hooks/usePaywall.tsx:26-40`  
**Issue:** `canUserCreatePrompt` function duplicates logic from `lib/subscription.ts`  
**Fix:** Import from `lib/subscription.ts` instead
```typescript
// BEFORE (Line 26-40)
function canUserCreatePrompt(
  subscription: { plan: PlanType } | null,
  usage: { promptsThisMonth: number } | null,
): boolean {
  // Duplicate logic...
}

// AFTER
import { canUserCreatePrompt } from '@/lib/subscription'

// In hook:
const canCreate = subscription && usage 
  ? canUserCreatePrompt(
      { plan: subscription.plan, status: subscription.status } as UserSubscription,
      usage as UsageStats
    )
  : true
```

#### 6. **Performance: Missing Error Boundaries**
**File:** `hooks/usePaywall.tsx:63-83`  
**Issue:** Network errors could crash component if not handled  
**Fix:** Add error boundary or better error handling
```typescript
// AFTER (Line 63-83)
try {
  const response = await fetch('/api/subscription/status')
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to fetch subscription status')
  }

  const data = await response.json()
  // Validate response structure
  if (!data.subscription || !data.usage) {
    throw new Error('Invalid response structure')
  }
  
  setUsage(data.usage)
  setSubscription(data.subscription)
  const canCreate = canUserCreatePrompt(data.subscription, data.usage)
  setCanCreatePrompt(canCreate)
} catch (error) {
  console.error('Error checking usage:', error)
  // Graceful degradation: allow creation on error
  setCanCreatePrompt(true)
  // TODO: Report to error tracking service
}
```

#### 7. **Code Smell: Unused Request Parameter**
**File:** `app/api/subscription/status/route.ts:7`  
**Issue:** `request` parameter is never used  
**Fix:** Remove parameter or prefix with underscore
```typescript
// BEFORE (Line 7)
export async function GET(request: NextRequest) {

// AFTER
export async function GET(_request: NextRequest) {
```

#### 8. **Security: Missing Rate Limiting**
**File:** `app/api/subscription/status/route.ts`  
**Issue:** No rate limiting on subscription status endpoint  
**Risk:** Potential abuse/DoS  
**Fix:** Add rate limiting middleware (e.g., `@upstash/ratelimit`)

#### 9. **Data Consistency: Missing Validation in Usage Query**
**File:** `lib/subscription.ts:75`  
**Issue:** `.single()` could throw if multiple prompts exist (should never happen, but...)  
**Fix:**
```typescript
// BEFORE (Line 75)
.single()

// AFTER
.maybeSingle() // Returns null if no result instead of throwing
```

#### 10. **Type Safety: Missing Null Checks**
**File:** `lib/subscription.ts:42-43`  
**Issue:** Potential null values not explicitly handled  
**Fix:**
```typescript
// BEFORE (Line 42-43)
stripeCustomerId: data.stripe_customer_id || '',
stripeSubscriptionId: data.stripe_subscription_id || '',

// AFTER
stripeCustomerId: data.stripe_customer_id ?? '',
stripeSubscriptionId: data.stripe_subscription_id ?? '',
```

### 🟢 **MINOR ISSUES**

#### 11. **Style: Inconsistent Error Logging**
**File:** Multiple files  
**Issue:** Some errors use `console.error`, others use `console.log`  
**Fix:** Standardize on `console.error` for errors, `console.log` for info

#### 12. **Code Smell: Magic Numbers**
**File:** `app/api/stripe/create-checkout-session/route.ts:58`  
**Issue:** Hardcoded 365 days  
**Fix:**
```typescript
// BEFORE (Line 58)
current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),

// AFTER
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000
current_period_end: new Date(Date.now() + ONE_YEAR_MS).toISOString(),
```

#### 13. **Performance: Unnecessary API Calls**
**File:** `hooks/usePaywall.tsx:65`  
**Issue:** Fetch called on every component mount, no caching  
**Fix:** Use React Query or add caching
```typescript
// AFTER
const { data, isLoading, error } = useQuery({
  queryKey: ['subscription-status'],
  queryFn: async () => {
    const response = await fetch('/api/subscription/status')
    if (!response.ok) throw new Error('Failed to fetch')
    return response.json()
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: true,
})
```

#### 14. **Type Safety: Loose Type for Status**
**File:** `hooks/usePaywall.tsx:22`  
**Issue:** `status: string` is too loose  
**Fix:**
```typescript
// BEFORE (Line 22)
status: string

// AFTER
status: 'active' | 'canceled' | 'past_due' | 'unpaid'
```

#### 15. **Code Smell: Missing Abort Controller**
**File:** `hooks/usePaywall.tsx:65`  
**Issue:** Fetch request not cancellable on unmount  
**Fix:**
```typescript
// AFTER (Line 65)
useEffect(() => {
  const abortController = new AbortController()
  
  async function checkUsage() {
    // ... existing code ...
    const response = await fetch('/api/subscription/status', {
      signal: abortController.signal,
    })
    // ... rest of code ...
  }

  void checkUsage()
  
  return () => {
    abortController.abort()
  }
}, [])
```

---

## 💡 Best Practice Notes

### 1. **Environment Variables Validation**
**Recommendation:** Add runtime validation for required environment variables
```typescript
// Create lib/env.ts
function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

// Usage
const stripeSecret = requireEnv('STRIPE_SECRET_KEY')
```

### 2. **Structured Logging**
**Recommendation:** Replace `console.log` with structured logging
```typescript
// Use a logging library like Winston or Pino
import { logger } from '@/lib/logger'

logger.info('Subscription created', {
  userId,
  plan,
  subscriptionId,
})
```

### 3. **Database Transaction Handling**
**Recommendation:** Use transactions for multi-step database operations
```typescript
// For webhook operations that modify multiple tables
const { data, error } = await supabase.rpc('update_subscription_with_transaction', {
  user_id: userId,
  // ... params
})
```

### 4. **Error Tracking**
**Recommendation:** Integrate error tracking service (Sentry, Rollbar)
```typescript
import * as Sentry from '@sentry/nextjs'

try {
  // ... code ...
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: 'webhook' },
    extra: { userId, eventType },
  })
  throw error
}
```

### 5. **Testing Recommendations**
**Missing:** Unit tests for subscription logic
- Test `canUserCreatePrompt` with various scenarios
- Test webhook handlers with mock Stripe events
- Test error handling paths

### 6. **API Response Consistency**
**Recommendation:** Standardize API response format
```typescript
// Create lib/api-response.ts
export function successResponse<T>(data: T, meta?: object) {
  return NextResponse.json({
    success: true,
    data,
    ...meta,
  })
}

export function errorResponse(message: string, status = 500, details?: object) {
  return NextResponse.json({
    success: false,
    error: message,
    ...details,
  }, { status })
}
```

### 7. **Type Safety for Stripe Events**
**Recommendation:** Create type-safe event handlers
```typescript
type WebhookHandler<T extends Stripe.Event.Type> = (
  event: Extract<Stripe.Event, { type: T }>
) => Promise<void>

const handlers: Record<string, WebhookHandler<any>> = {
  'checkout.session.completed': handleCheckoutCompleted,
  // ...
}
```

### 8. **Caching Strategy**
**Recommendation:** Implement caching for subscription status
```typescript
// Use React Query or SWR for client-side caching
// Use Redis for server-side caching of subscription data
```

### 9. **Idempotency Keys**
**Recommendation:** Add idempotency keys for webhook processing
```typescript
// Store processed event IDs to prevent duplicate processing
const eventId = event.id
const { data: existing } = await supabase
  .from('processed_webhooks')
  .select('id')
  .eq('stripe_event_id', eventId)
  .single()

if (existing) {
  return NextResponse.json({ received: true, duplicate: true })
}
```

### 10. **Input Validation**
**Recommendation:** Use Zod for runtime validation
```typescript
import { z } from 'zod'

const checkoutSessionSchema = z.object({
  plan: z.enum(['team', 'pro']),
})

const { plan } = checkoutSessionSchema.parse(await request.json())
```

---

## 📊 Summary

### Issues by Severity:
- 🔴 **Critical:** 4 issues
- 🟡 **Moderate:** 6 issues  
- 🟢 **Minor:** 6 issues

### Categories:
- **Security:** 3 issues
- **Type Safety:** 5 issues
- **Error Handling:** 4 issues
- **Performance:** 3 issues
- **Code Quality:** 5 issues

### Priority Actions:
1. ✅ Fix race condition in customer creation (Issue #2)
2. ✅ Add proper error tracking for webhooks (Issue #3)
3. ✅ Fix type safety issues with Stripe types (Issue #4)
4. ✅ Remove duplicate logic in paywall hook (Issue #5)
5. ✅ Add rate limiting to subscription status endpoint (Issue #8)

---

**Report Generated:** January 30, 2025  
**Next Review:** After implementing critical fixes

