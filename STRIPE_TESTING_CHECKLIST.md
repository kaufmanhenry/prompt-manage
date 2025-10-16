# Stripe Integration Testing Checklist

## ✅ **Pre-Testing Setup** (Do Once)

### Database
- [ ] Run migration in Supabase Dashboard
- [ ] Verify `user_profiles` table has new columns:
  - `stripe_customer_id`
  - `subscription_tier`
  - `subscription_status`
  - `subscription_period_end`

### Local Environment
- [ ] Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
- [ ] Login to Stripe: `stripe login`
- [ ] Start webhook forwarding in Terminal 2:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```
- [ ] Copy webhook secret from output
- [ ] Update `.env.local` with webhook secret
- [ ] Restart dev server: `npm run dev`

---

## 🧪 **Test 1: Team Plan Subscription**

### Steps
1. [ ] Go to `http://localhost:3000/pricing`
2. [ ] Click **"Subscribe to Team"**
3. [ ] Verify redirect to Stripe checkout
4. [ ] Fill in test details:
   - Email: `test@example.com`
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/34`
   - CVC: `123`
   - ZIP: `12345`
5. [ ] Click **"Subscribe"**
6. [ ] Verify redirect back to dashboard with success message

### Verification
- [ ] Check Terminal 2 (stripe listen) for webhook events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `invoice.paid`
- [ ] Check Supabase `user_profiles` table:
  - `subscription_tier` = `'team'`
  - `subscription_status` = `'active'` or `'trialing'`
  - `stripe_customer_id` is populated
  - `subscription_period_end` is set
- [ ] Go to Stripe Dashboard → Customers
  - Verify customer created with email `test@example.com`
- [ ] Go to Stripe Dashboard → Subscriptions
  - Verify subscription is active
  - Check 14-day trial period

---

## 🧪 **Test 2: Enterprise Plan Subscription**

### Steps
1. [ ] Use a different test user or clear previous subscription
2. [ ] Go to `http://localhost:3000/pricing`
3. [ ] Click **"Subscribe to Enterprise"**
4. [ ] Complete checkout with test card
5. [ ] Verify redirect

### Verification
- [ ] Check `subscription_tier` = `'enterprise'` in database
- [ ] Verify $27.00 subscription in Stripe Dashboard

---

## 🧪 **Test 3: Billing Portal Access**

### Steps
1. [ ] Subscribe to Team or Enterprise (if not already)
2. [ ] Go to `http://localhost:3000/settings/billing`
3. [ ] Verify plan displays correctly
4. [ ] Click **"Manage Billing"**
5. [ ] Verify redirect to Stripe Customer Portal
6. [ ] Explore portal:
   - View payment method
   - View invoices
   - Update billing info

### Verification
- [ ] Portal loads successfully
- [ ] Subscription details are accurate
- [ ] Can navigate back to app

---

## 🧪 **Test 4: Subscription Cancellation**

### Steps
1. [ ] In Billing Portal, click **"Cancel subscription"**
2. [ ] Confirm cancellation (cancel at period end)
3. [ ] Return to app

### Verification
- [ ] Check webhook: `customer.subscription.updated` with `cancel_at_period_end: true`
- [ ] Subscription still shows as `active` until period end
- [ ] Period end date is displayed

---

## 🧪 **Test 5: Failed Payment**

### Steps
1. [ ] In Stripe Dashboard, go to Subscriptions
2. [ ] Click on test subscription
3. [ ] Click "Update subscription" → "Update payment method"
4. [ ] Change to declining card: `4000 0000 0000 0341`
5. [ ] Trigger invoice manually or wait for billing cycle

### Verification
- [ ] Check webhook: `invoice.payment_failed`
- [ ] Database `subscription_status` = `'past_due'`
- [ ] User sees warning on billing page

---

## 🧪 **Test 6: Subscription Upgrade/Downgrade**

### Steps
1. [ ] Subscribe to Team plan
2. [ ] In Billing Portal, click "Update plan"
3. [ ] Upgrade to Enterprise
4. [ ] Verify proration

### Verification
- [ ] Webhook: `customer.subscription.updated`
- [ ] Database tier updated to `'enterprise'`
- [ ] Prorated invoice created

---

## 🧪 **Test 7: Manual Webhook Triggers**

Use Stripe CLI to test individual webhooks:

```bash
# Test checkout completion
stripe trigger checkout.session.completed

# Test subscription created
stripe trigger customer.subscription.created

# Test payment success
stripe trigger invoice.paid

# Test payment failure
stripe trigger invoice.payment_failed

# Test subscription canceled
stripe trigger customer.subscription.deleted
```

### Verification
- [ ] Each webhook is received (check Terminal 2)
- [ ] Each webhook returns 200 status
- [ ] Database updates appropriately
- [ ] No errors in app console

---

## 🧪 **Test 8: Feature Access Control**

### Steps
1. [ ] Create test with free account
2. [ ] Try to access Team-only feature
3. [ ] Verify blocked or limited access
4. [ ] Subscribe to Team
5. [ ] Verify feature now accessible

### Test Features
- [ ] Running prompts (free: blocked, team/enterprise: allowed)
- [ ] Unlimited prompt storage (free: 25 max, team/enterprise: unlimited)
- [ ] Shared libraries (free: no, team/enterprise: yes)

---

## 🧪 **Test 9: Webhook Signature Verification**

### Steps
1. [ ] Send a POST request to `/api/webhooks/stripe` without signature
2. [ ] Send with invalid signature

### Verification
- [ ] Returns 400 error: "Missing signature"
- [ ] Returns 400 error: "Invalid signature"
- [ ] No database updates occur

---

## 🧪 **Test 10: Edge Cases**

### Duplicate Checkout
- [ ] Start checkout session
- [ ] Start another checkout without completing first
- [ ] Complete both
- [ ] Verify only one subscription created

### Session Expiry
- [ ] Create checkout session
- [ ] Wait 24 hours (or expire manually in Stripe)
- [ ] Try to complete
- [ ] Verify session expired error

### User Already Has Subscription
- [ ] User with active subscription
- [ ] Try to subscribe again
- [ ] Verify appropriate handling

---

## 📊 **Monitoring & Logs**

### During Testing, Monitor:
- [ ] Terminal 1: Next.js dev server logs
- [ ] Terminal 2: Stripe webhook logs (`stripe listen`)
- [ ] Browser console for errors
- [ ] Supabase logs for database errors
- [ ] Stripe Dashboard → Events for all webhook events

### Check These URLs:
- [ ] `http://localhost:3000/pricing` - Pricing page
- [ ] `http://localhost:3000/settings/billing` - Billing management
- [ ] `http://localhost:3000/dashboard` - Post-checkout redirect
- [ ] Stripe Dashboard: https://dashboard.stripe.com/test/dashboard

---

## ✅ **Success Criteria**

All tests pass when:
- [ ] Users can successfully subscribe to Team and Enterprise
- [ ] Webhooks are received and processed correctly
- [ ] Database updates accurately reflect subscription changes
- [ ] Billing portal access works
- [ ] Subscription cancellation works
- [ ] Failed payments are handled gracefully
- [ ] Feature access control works based on tier
- [ ] No console errors during checkout flow
- [ ] Stripe Dashboard shows accurate data

---

## 🐛 **Common Issues & Solutions**

### Issue: Webhooks not received
**Solution:**
- Ensure `stripe listen` is running
- Check that webhook secret is correct in `.env.local`
- Restart dev server after updating env vars

### Issue: Checkout redirects to wrong URL
**Solution:**
- Verify `NEXT_PUBLIC_BASE_URL` in `.env.local`
- Check success/cancel URLs in checkout session

### Issue: Database not updating
**Solution:**
- Check webhook handler logs
- Verify migration was run correctly
- Check RLS policies on `user_profiles` table

### Issue: "No billing account found" error
**Solution:**
- User hasn't completed checkout yet
- Check `stripe_customer_id` is populated
- Verify user is authenticated

---

## 📝 **Test Results Template**

```markdown
## Test Results - [Date]

**Tester:** [Name]
**Environment:** Local Development
**Stripe Mode:** Test

### Results Summary
- Total Tests: 10
- Passed: 
- Failed: 
- Blocked: 

### Failed Tests
1. [Test Name]: [Reason] - [Status]

### Notes
- [Any observations or issues encountered]

### Next Steps
- [Action items based on test results]
```

---

**Happy Testing!** 🚀

