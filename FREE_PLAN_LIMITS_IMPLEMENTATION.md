# Free Plan Limits Implementation Guide

**Status:** 🔴 **REQUIRES IMPLEMENTATION**  
**Goal:** Enforce free plan limits and gate premium features properly

---

## Overview

This document outlines the complete process for implementing and enforcing free plan limits across the entire Prompt Manage platform.

---

## Current State Assessment

### ✅ What's Already Implemented

1. **Backend Subscription Checks:**
   - ✅ `lib/subscription.ts` - Core logic for checking subscription limits
   - ✅ `canUserCreatePrompt()` - Checks 25 prompt limit for free users
   - ✅ `canUserExport()` - Returns false for free users
   - ✅ `canUserImport()` - Returns false for free users
   - ✅ API routes check limits: `/api/prompts/bulk-import`, `/api/prompts/bulk-export`, `/api/save-free-tool-prompt`

2. **Frontend Paywall System:**
   - ✅ `hooks/usePaywall.tsx` - Hook for checking limits and showing paywall
   - ✅ `components/Paywall.tsx` - Modal component for upgrade prompts
   - ✅ Import/Export page checks subscription before allowing actions

3. **Client-Side Checks:**
   - ✅ `PromptForm.tsx` - Checks `canCreatePrompt` before submitting new prompts

### ❌ What Needs to Be Implemented/Fixed

1. **Prompt Creation API Route** - Need to find/create and ensure it checks limits
2. **Dashboard UI** - Hide/gate premium features visually
3. **Usage Warnings** - Show warnings when approaching limits
4. **Limit Enforcement** - Ensure all prompt creation paths check limits

---

## Implementation Checklist

### 1. ✅ Lock Bulk Import/Export Feature

**Status:** ✅ **MOSTLY COMPLETE**

**Current Implementation:**

- ✅ `/api/prompts/bulk-import` - Checks `canUserImport()` and returns 403 if not allowed
- ✅ `/api/prompts/bulk-export` - Checks `canUserExport()` and returns 403 if not allowed
- ✅ `/dashboard/import-export` page - Shows paywall modal if user doesn't have access

**Verification Steps:**

1. ✅ Test with free user - Should show paywall modal
2. ✅ Test with paid user - Should allow import/export
3. ✅ Test API endpoints directly - Should return 403 for free users

**Action Items:**

- ✅ None - Already implemented correctly

---

### 2. ⚠️ Lock Prompt Creation at 25 Prompts

**Status:** ⚠️ **PARTIALLY COMPLETE**

**Current Implementation:**

- ✅ Backend check exists in `canUserCreatePrompt()` - Returns false when `promptsTotal >= 25`
- ✅ `PromptForm.tsx` - Checks `canCreatePrompt` before submitting
- ⚠️ Need to verify all prompt creation paths are protected

**Missing/Needs Verification:**

1. Need to find/create main `/api/prompts` POST route that enforces limits
2. Verify all prompt creation entry points check limits
3. Add visual warning when user is at 20+ prompts (approaching limit)

**Action Items:**

#### A. Find/Create Main Prompt Creation API Route

**Location:** Should be `app/api/prompts/route.ts` (or similar)

**Required Checks:**

```typescript
import { canUserCreatePrompt, getUserSubscription, getUserUsage } from '@/lib/subscription'

export async function POST(request: NextRequest) {
  // ... authentication ...

  // Check subscription and usage limits
  const [subscription, usage] = await Promise.all([
    getUserSubscription(user.id),
    getUserUsage(user.id),
  ])

  if (!canUserCreatePrompt(subscription, usage)) {
    return NextResponse.json(
      {
        error: 'Prompt limit reached',
        details:
          subscription?.status === 'past_due' || subscription?.status === 'unpaid'
            ? 'Your payment failed. Please update your payment method to continue using premium features.'
            : subscription?.status === 'canceled'
              ? 'Your subscription was canceled. Resubscribe to continue using premium features.'
              : 'You have reached your prompt limit (25 prompts). Please upgrade or delete existing prompts to continue.',
      },
      { status: 403 },
    )
  }

  // ... create prompt ...
}
```

#### B. Add Usage Warning in Dashboard

**Location:** `app/dashboard/page.tsx` or `components/PromptForm.tsx`

**Implementation:**

```typescript
// In PromptForm or Dashboard component
const { usage, subscription } = usePaywall()

useEffect(() => {
  if (!usage || !subscription) return

  const plan = subscription.plan || 'free'
  if (plan === 'free' && usage.promptsTotal >= 20 && usage.promptsTotal < 25) {
    toast({
      title: 'Approaching Limit',
      description: `You have ${usage.promptsTotal} of 25 prompts. Consider upgrading to continue creating prompts.`,
      variant: 'default',
    })
  }
}, [usage, subscription])
```

#### C. Update PromptForm to Handle Limit Errors

**Location:** `components/PromptForm.tsx`

**Current Implementation:**

- ✅ Already checks `canCreatePrompt` and shows paywall
- ⚠️ Need to handle API errors more gracefully

**Enhancement:**

```typescript
// In onSubmit handler, after API call
catch (error: any) {
  if (error?.response?.status === 403) {
    // Handle limit reached error
    const errorData = await error.response.json()
    toast({
      title: 'Prompt Limit Reached',
      description: errorData.details || 'You have reached your prompt limit. Please upgrade or delete prompts.',
      variant: 'destructive',
    })
    showPaywall()
    return
  }
  // ... handle other errors ...
}
```

---

### 3. ⚠️ Hide Premium Features for Free Users

**Status:** ⚠️ **NEEDS IMPLEMENTATION**

**Features to Hide/Lock:**

1. Bulk Import/Export (already gated, but should hide UI elements)
2. Advanced analytics (if exists)
3. Team collaboration features (if exists)
4. API access (if exists)
5. Custom integrations (if exists)

**Implementation Strategy:**

#### A. Create Feature Gate Component

**Location:** `components/FeatureGate.tsx` (new file)

```typescript
'use client'

import { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'

import Paywall from '@/components/Paywall'
import type { PlanType } from '@/lib/stripe'

interface FeatureGateProps {
  feature: 'import' | 'export' | 'analytics' | 'api' | 'integrations'
  children: ReactNode
  fallback?: ReactNode
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const response = await fetch('/api/subscription/status')
      if (!response.ok) return null
      return response.json()
    },
  })

  const currentPlan = subscriptionStatus?.subscription?.plan || 'free'
  const features = subscriptionStatus?.features || {}

  // Check if feature is available
  const hasAccess =
    feature === 'import' ? features.canImport :
    feature === 'export' ? features.canExport :
    currentPlan !== 'free' // For other features, any paid plan has access

  if (!hasAccess) {
    return (
      <>
        {fallback || (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-2 text-lg font-semibold">Upgrade Required</h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              This feature is available on Team and Pro plans.
            </p>
            <Paywall
              isOpen={false}
              onClose={() => {}}
              currentPlan={currentPlan}
              feature={feature}
            />
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
}
```

#### B. Update Import/Export Page

**Location:** `app/dashboard/import-export/page.tsx`

**Current:** Shows paywall modal on click
**Enhancement:** Hide or disable the entire import/export UI for free users

```typescript
// Add at top of component
if (!canImport && !canExport && session?.user?.id) {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Import/Export Unavailable</CardTitle>
          <CardDescription>
            Bulk import and export features are available on Team and Pro plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Paywall
            isOpen={true}
            onClose={() => router.push('/dashboard')}
            currentPlan={currentPlan}
            feature="Import/Export"
          />
        </CardContent>
      </Card>
    </div>
  )
}
```

#### C. Hide Premium Features in Navigation

**Location:** `components/Sidebar.tsx` or navigation component

```typescript
const { data: subscriptionStatus } = useQuery({
  queryKey: ['subscription-status'],
  queryFn: async () => {
    const response = await fetch('/api/subscription/status')
    if (!response.ok) return null
    return response.json()
  },
})

const canImport = subscriptionStatus?.features?.canImport || false
const canExport = subscriptionStatus?.features?.canExport || false
const isPaidPlan = subscriptionStatus?.subscription?.plan !== 'free'

// Only show import/export link if user has access
{canImport && canExport && (
  <Link href="/dashboard/import-export">
    Import/Export
  </Link>
)}
```

---

### 4. ✅ Display Usage Limits in UI

**Status:** ✅ **PARTIALLY IMPLMENTED**

**Current Implementation:**

- ✅ `usePaywall` hook provides usage data
- ✅ `Paywall` component shows usage

**Enhancement Needed:**

- Add usage display to dashboard home page
- Show progress bar when approaching limits
- Add warning messages at 80% capacity

**Implementation:**

#### A. Add Usage Display to Dashboard

**Location:** `app/dashboard/page.tsx`

```typescript
const { usage, subscription, canCreatePrompt } = usePaywall()

// In JSX
{subscription?.plan === 'free' && usage && (
  <Card>
    <CardHeader>
      <CardTitle>Prompt Usage</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Prompts Stored</span>
          <span className="font-semibold">
            {usage.promptsTotal} / 25
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${(usage.promptsTotal / 25) * 100}%` }}
          />
        </div>
        {usage.promptsTotal >= 20 && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            ⚠️ You're approaching your limit. Upgrade to create unlimited prompts.
          </p>
        )}
        {!canCreatePrompt && (
          <p className="text-sm text-red-600 dark:text-red-400">
            ❌ You've reached your limit. Delete prompts or upgrade to continue.
          </p>
        )}
      </div>
    </CardContent>
  </Card>
)}
```

---

## Testing Checklist

### Free Plan Limits

- [ ] **Prompt Limit (25 prompts)**
  - [ ] Create 25 prompts as free user - Should succeed
  - [ ] Try to create 26th prompt - Should show paywall and fail
  - [ ] Delete one prompt - Should be able to create new prompt
  - [ ] Verify backend API returns 403 when limit reached

- [ ] **Bulk Import/Export**
  - [ ] Visit `/dashboard/import-export` as free user - Should show paywall
  - [ ] Try to import file via API - Should return 403
  - [ ] Try to export prompts via API - Should return 403
  - [ ] Import/Export button should be disabled/hidden for free users

- [ ] **UI Elements**
  - [ ] Premium features should be hidden or disabled in navigation
  - [ ] Usage display shows correct counts (X/25 prompts)
  - [ ] Warning appears at 20+ prompts
  - [ ] Error message appears when trying to create 26th prompt

### Paid Plan Access

- [ ] **Team Plan ($20/mo)**
  - [ ] Can create unlimited prompts
  - [ ] Can use bulk import/export
  - [ ] All premium features accessible

- [ ] **Pro Plan ($99/mo)**
  - [ ] Can create unlimited prompts
  - [ ] Can use bulk import/export
  - [ ] All premium features accessible

---

## Files to Create/Modify

### New Files

1. `components/FeatureGate.tsx` - Component for gating premium features
2. `app/api/prompts/route.ts` - Main prompt creation API (if doesn't exist)

### Files to Modify

1. `components/PromptForm.tsx` - Add better error handling for limit errors
2. `app/dashboard/page.tsx` - Add usage display and warnings
3. `app/dashboard/import-export/page.tsx` - Improve free user experience
4. `components/Sidebar.tsx` - Hide premium features in navigation
5. `hooks/usePaywall.tsx` - Add usage warning toast notifications

---

## Implementation Priority

1. **High Priority** (Blocks free plan enforcement):
   - ✅ Verify bulk import/export is locked (already done)
   - ⚠️ Find/create and protect main prompt creation API route
   - ⚠️ Add usage display to dashboard
   - ⚠️ Add warning when approaching limit

2. **Medium Priority** (Better UX):
   - Hide premium features in navigation
   - Improve error messages
   - Add feature gate component

3. **Low Priority** (Nice to have):
   - Usage progress bars
   - Inline upgrade prompts
   - Analytics on feature usage

---

## Quick Start Implementation

### Step 1: Create/Verify Main Prompt API Route

Check if `app/api/prompts/route.ts` exists. If not, create it:

```bash
# Check if route exists
ls app/api/prompts/route.ts

# If not, create the directory and file
mkdir -p app/api/prompts
touch app/api/prompts/route.ts
```

Then implement the POST handler with limit checks (see section 2.A above).

### Step 2: Add Usage Display to Dashboard

Modify `app/dashboard/page.tsx` to show usage for free users.

### Step 3: Test Free Plan Limits

1. Create a test free user account
2. Create 25 prompts
3. Try to create 26th - should fail with paywall
4. Try to import/export - should show paywall

---

## Notes

- All subscription checks should happen **server-side** in API routes
- Client-side checks are for UX only - never rely on them for security
- Use `canUserCreatePrompt()` from `lib/subscription.ts` consistently
- Free users can share prompts publicly (is_public: true) - this is allowed
- Collections are available on all plans (according to pricing page)

---

## Next Steps

1. ✅ Verify bulk import/export locking (COMPLETE)
2. ⚠️ Implement prompt creation API route with limit checks
3. ⚠️ Add usage display and warnings to dashboard
4. ⚠️ Hide premium features in UI for free users
5. ⚠️ Test all scenarios with free and paid accounts
