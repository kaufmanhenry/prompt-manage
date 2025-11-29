# Stripe Webhook Event Verification Guide

## How to Verify Webhook Events in Stripe Dashboard

### Step 1: Access Stripe Webhooks

1. Open [Stripe Dashboard](https://dashboard.stripe.com)
2. Click on **Developers** in the left sidebar
3. Click on **Webhooks**

### Step 2: Find Your Webhook

Look for your webhook endpoint:

- **URL:** `https://promptmanage.com/api/stripe/webhook`
- Click on this webhook to view details

### Step 3: Verify Events

In the webhook details page, scroll to **"Events to send"** section.

**You should see these 5 events:**

- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

### Step 4: Add Missing Events

If any events are missing:

1. Click **"+ Add events"** button
2. Search for the missing event name
3. Check the box next to it
4. Click **"Add events"**

### Step 5: Test the Webhook

1. In webhook details, click **"Send test webhook"**
2. Select `checkout.session.completed`
3. Click **"Send test webhook"**
4. Check response shows **200 OK**

---

## Quick Checklist

- [ ] Webhook URL: `https://promptmanage.com/api/stripe/webhook`
- [ ] All 5 events selected
- [ ] `STRIPE_WEBHOOK_SECRET` set in environment
- [ ] Test returns 200 OK
- [ ] Webhook status: **Enabled**

---

**Created:** 2025-01-28
