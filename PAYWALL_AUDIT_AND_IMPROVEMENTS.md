# Paywall System Audit & Improvements Report

**Date:** October 31, 2025  
**Status:** 🔴 **CRITICAL ISSUES IDENTIFIED**  
**Priority:** **HIGH** - Compliance and Security Risks

---

## 🔴 Critical Issues

### 1. **Missing Feature Gating - Import/Export**
**Risk:** **HIGH** - Free users can access paid features

**Issue:**
- `app/dashboard/import-export/page.tsx` has NO paywall checks
- Free plan explicitly states "No import/export feature, only for paid users"
- Users can bypass by going directly to `/dashboard/import-export`
- API routes (`/api/prompts/bulk-import`, `/api/prompts/bulk-export`) have NO subscription validation

**Impact:**
- Revenue loss (users avoid upgrading)
- Broken promise to paid users (feature isn't exclusive)
- Legal risk (terms violation)

**Fix Required:**
```typescript
// Add to import-export page and API routes
const { canExport, canImport } = checkFeatureAccess(subscription)
if (!canExport || !canImport) {
  showPaywall()
  return
}
```

---

### 2. **Past_Due Subscription Access**
**Risk:** **CRITICAL** - Users get free access after payment fails

**Issue:**
- `getUserSubscription()` only returns `status = 'active'` subscriptions (line 30)
- Users with `past_due` or `unpaid` status still get access because query filters them out
- Payment failures don't restrict access

**Impact:**
- Revenue loss (unpaid users continue using service)
- Stripe subscription shows past_due but app grants full access
- Legal/contractual risk

**Fix Required:**
```typescript
// Update getUserSubscription to check ALL statuses, not just 'active'
.select('*')
.eq('user_id', userId)
// Remove .eq('status', 'active') filter
// Then check status in canUserCreatePrompt()
if (subscription?.status === 'past_due' || subscription?.status === 'unpaid') {
  return false // Restrict access
}
```

---

### 3. **Client-Side Only Validation**
**Risk:** **HIGH** - Security vulnerability

**Issue:**
- Paywall checks only happen in `usePaywall` hook (client-side)
- `PromptForm` only checks client-side `canCreatePrompt`
- API routes don't validate subscription status before allowing actions
- Users can bypass by calling API directly or disabling JS

**Impact:**
- Direct API access bypasses paywall
- Free users can create unlimited prompts via API
- No server-side enforcement

**Fix Required:**
- Add subscription validation to ALL API routes that create/modify data:
  - `/api/prompts` (POST)
  - `/api/prompts/bulk-import` (POST)
  - `/api/prompts/bulk-export` (GET)
  - `/api/collections` (POST) - if collections are premium

---

### 4. **Error Handling Allows Access**
**Risk:** **MEDIUM** - Graceful degradation too permissive

**Issue:**
- `usePaywall.tsx` line 104: `setCanCreatePrompt(true)` on error
- If API fails or network errors, users get full access
- "Fail open" approach is a security risk

**Impact:**
- API outages grant free access to everyone
- Network issues bypass paywall
- Can be exploited by causing API errors

**Fix Required:**
```typescript
// Change to "fail closed" - deny access if subscription status unclear
catch (error) {
  console.error('Error checking usage:', error)
  // Fail closed - deny access until status confirmed
  setCanCreatePrompt(false)
  // Optionally show error message to user
}
```

---

### 5. **Missing User Communication**
**Risk:** **MEDIUM** - Poor UX, potential complaints

**Issue:**
- Users with `past_due` subscriptions get blocked but don't know why
- No clear messaging about payment failures
- No billing reminder before period ends
- Paywall modal doesn't show why access is restricted

**Impact:**
- User confusion and support tickets
- Churn from lack of transparency
- Legal complaints ("I paid but can't access")

**Fix Required:**
- Add status-specific messaging:
  - `past_due`: "Your payment failed. Please update your payment method."
  - `canceled`: "Your subscription was canceled. Resubscribe to continue."
  - `unpaid`: "Payment required. Please update your billing information."
- Add billing notification component
- Show usage warnings before limits hit

---

### 6. **No Usage Warnings**
**Risk:** **LOW** - UX issue

**Issue:**
- Free users get no warning before hitting 25 prompt limit
- Paid users get no warning before monthly limits
- First indication is paywall blocking action

**Impact:**
- Frustrated users (work lost/incomplete)
- Poor user experience

**Fix Required:**
- Add usage warning at 80% of limit
- Show progress bar in dashboard
- Email warnings before limits reached

---

### 7. **Missing Server-Side Feature Checks**
**Risk:** **HIGH** - Features not properly gated

**Issue:**
- `lib/subscription.ts` has `canUserCreatePrompt()` but no generic feature checker
- No `canExport`, `canImport`, `canShare` helpers
- Features checked inconsistently across codebase

**Impact:**
- Inconsistent access control
- Some features accidentally free, others accidentally paid
- Hard to audit what's gated

**Fix Required:**
```typescript
// Add to lib/subscription.ts
export function canUserExport(subscription: UserSubscription | null): boolean {
  if (!subscription || subscription.status !== 'active') return false
  const plan = STRIPE_CONFIG.plans[subscription.plan]
  return plan.limits.canExport === true
}

export function canUserImport(subscription: UserSubscription | null): boolean {
  if (!subscription || subscription.status !== 'active') return false
  const plan = STRIPE_CONFIG.plans[subscription.plan]
  return plan.limits.canExport === true // Same as export
}
```

---

### 8. **Missing Subscription Status Query**
**Risk:** **MEDIUM** - Incomplete data

**Issue:**
- `getUserSubscription()` filters to `status = 'active'` only
- Can't check if user has `past_due` or `canceled` subscription
- Need to query ALL statuses to properly restrict access

**Fix Required:**
```typescript
// Update getUserSubscription to return current subscription regardless of status
// OR create separate function:
export async function getUserSubscriptionAnyStatus(userId: string): Promise<UserSubscription | null> {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false }) // Get most recent
    .limit(1)
    .maybeSingle()
  
  // Return even if canceled/past_due
}
```

---

### 9. **No Retry Logic for Failed Payments**
**Risk:** **MEDIUM** - Revenue loss

**Issue:**
- When `invoice.payment_failed` event fires, subscription is marked `past_due`
- No automatic retry attempt
- No email notification to user
- User doesn't know payment failed until access is cut

**Impact:**
- Lost revenue from failed cards that could be updated
- User churn from lack of communication

**Fix Required:**
- Integrate Stripe automatic retry (configure in Stripe Dashboard)
- Send email notification on payment failure
- Show in-app notification with "Update Payment" CTA
- Retry logic before cutting access

---

### 10. **Missing Compliance Elements**
**Risk:** **MEDIUM** - Legal risk

**Issue:**
- No clear auto-renewal messaging in paywall
- No cancellation confirmation
- No billing history view
- No receipt/invoice access

**Impact:**
- Legal compliance issues (auto-renewal disclosure)
- User complaints about billing
- Support burden

**Fix Required:**
- Add auto-renewal disclosure to paywall modal
- Add cancellation confirmation with date
- Add billing history page (`/settings/billing/history`)
- Link to Stripe customer portal for invoices

---

### 11. **No Audit Trail**
**Risk:** **LOW** - Compliance/accounting

**Issue:**
- No logging of subscription changes
- Can't track who upgraded/downgraded when
- No audit log for compliance

**Impact:**
- Difficult to debug subscription issues
- Compliance requirements (SOC 2) may require audit logs
- Can't analyze upgrade/downgrade patterns

**Fix Required:**
- Add subscription change logging table
- Log all subscription events (upgrade, downgrade, cancel, payment_failed)
- Include user_id, timestamp, old_plan, new_plan, reason

---

### 12. **Webhook Error Handling**
**Risk:** **MEDIUM** - Data inconsistency

**Issue:**
- Webhook errors are logged but not retried
- If webhook fails, database subscription is out of sync with Stripe
- No dead letter queue for failed webhooks

**Impact:**
- Users charged but no access granted
- Users cancel but still charged
- Data inconsistencies

**Fix Required:**
- Implement webhook retry logic
- Add dead letter queue for failed webhooks
- Manual reconciliation process
- Alert on webhook failures

---

## 🟡 Medium Priority Issues

### 13. **No Grace Period**
**Issue:** Users with `past_due` are immediately cut off
**Fix:** Add 3-7 day grace period with warnings before restricting access

### 14. **Proration Not Clear**
**Issue:** Upgrades/downgrades don't show proration amounts
**Fix:** Show proration preview before confirming upgrade

### 15. **No Plan Comparison**
**Issue:** Paywall modal shows plans but no feature comparison table
**Fix:** Add detailed feature comparison table

### 16. **Missing Usage Dashboard**
**Issue:** Users can't see their usage stats easily
**Fix:** Add usage dashboard showing prompts used, limits, reset dates

---

## ✅ Recommendations Priority Order

### **Immediate (Fix Today):**
1. ✅ **Fix past_due access** - Critical revenue leak
2. ✅ **Add server-side validation** - Security risk
3. ✅ **Gate import/export** - Revenue loss
4. ✅ **Fix error handling** - Security risk

### **This Week:**
5. ✅ Add user communication (payment failure messages)
6. ✅ Add feature access helpers (`canExport`, `canImport`)
7. ✅ Update `getUserSubscription` to check all statuses
8. ✅ Add usage warnings

### **This Month:**
9. ✅ Add billing history page
10. ✅ Implement retry logic for payments
11. ✅ Add audit logging
12. ✅ Add compliance messaging (auto-renewal, cancellation)

---

## 📋 Implementation Checklist

- [ ] Fix `getUserSubscription` to return all statuses
- [ ] Add status checks to `canUserCreatePrompt` (block past_due/unpaid)
- [ ] Add server-side validation to all API routes
- [ ] Add paywall checks to import/export page and APIs
- [ ] Change error handling to "fail closed"
- [ ] Add `canExport` and `canImport` helpers
- [ ] Add status-specific user messaging
- [ ] Add usage warnings at 80% limit
- [ ] Add billing history page
- [ ] Add audit logging table
- [ ] Configure Stripe automatic retry
- [ ] Add email notifications for payment failures
- [ ] Add auto-renewal disclosure to paywall
- [ ] Add grace period for past_due subscriptions

---

## 🎯 Expected Impact

**After fixes:**
- ✅ **Revenue Protection:** No free access to paid features
- ✅ **Security:** Server-side validation prevents bypass
- ✅ **Compliance:** Clear terms, audit trail, proper access control
- ✅ **UX:** Clear communication, warnings, better experience
- ✅ **Reliability:** Retry logic, error handling, data consistency

**Risk Reduction:**
- Critical revenue leaks: **FIXED**
- Security vulnerabilities: **FIXED**
- Compliance issues: **RESOLVED**
- User confusion: **IMPROVED**

---

**Next Steps:** Prioritize critical fixes (1-4) for immediate implementation.

