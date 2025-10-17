# Stripe Local Webhook Testing Guide

## Quick Setup

### 1. Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or download from: https://github.com/stripe/stripe-cli/releases
```

### 2. Login to Stripe

```bash
stripe login
```

This will open your browser to authenticate with Stripe.

### 3. Forward Webhooks to Localhost

```bash
# Terminal 1: Run your dev server
npm run dev

# Terminal 2: Forward webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 4. Copy Webhook Secret

When you run `stripe listen`, you'll see output like:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**Copy that secret and update your `.env.local`:**

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 5. Restart Your Dev Server

After updating `.env.local`, restart:

```bash
npm run dev
```

---

## Testing Webhooks

### Trigger Test Events

In a new terminal, you can manually trigger webhook events:

```bash
# Test successful checkout
stripe trigger checkout.session.completed

# Test successful payment
stripe trigger invoice.paid

# Test failed payment
stripe trigger invoice.payment_failed

# Test subscription created
stripe trigger customer.subscription.created

# Test subscription canceled
stripe trigger customer.subscription.deleted
```

### Monitor Webhook Events

The terminal running `stripe listen` will show all webhook events in real-time:

```
2025-01-16 10:30:00 --> checkout.session.completed [evt_xxxxx]
2025-01-16 10:30:01 <-- [200] POST http://localhost:3000/api/webhooks/stripe [evt_xxxxx]
```

---

## Test Card Numbers

Use these test cards in Stripe checkout:

| Card Number           | Description                        |
| --------------------- | ---------------------------------- |
| `4242 4242 4242 4242` | Successful payment                 |
| `4000 0000 0000 9995` | Declined - insufficient funds      |
| `4000 0025 0000 3155` | 3D Secure authentication required  |
| `4000 0000 0000 0341` | Attaches to customer, charges fail |

**For all test cards:**

- Use any future expiration date (e.g., `12/34`)
- Use any 3-digit CVC (e.g., `123`)
- Use any ZIP code (e.g., `12345`)

---

## Debugging Webhooks

### Check Webhook Logs

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click on your local webhook endpoint
3. View all events and their payloads

### Common Issues

**Problem:** Webhooks not being received

**Solutions:**

- Ensure `stripe listen` is running
- Check that dev server is on port 3000
- Verify `STRIPE_WEBHOOK_SECRET` is set correctly
- Restart dev server after updating env vars

**Problem:** Webhook signature verification failed

**Solutions:**

- Copy the webhook secret from `stripe listen` output
- Update `.env.local` with the correct secret
- Restart dev server

---

## Production Webhooks

For production, you'll need to:

1. Deploy your app
2. Go to: https://dashboard.stripe.com/webhooks
3. Click "Add endpoint"
4. Set URL: `https://yourdomain.com/api/webhooks/stripe`
5. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
6. Copy webhook signing secret
7. Add to production environment variables

---

## Testing Checklist

- [ ] Install Stripe CLI
- [ ] Login to Stripe: `stripe login`
- [ ] Start webhook forwarding: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Copy webhook secret to `.env.local`
- [ ] Restart dev server
- [ ] Test subscription checkout with `4242 4242 4242 4242`
- [ ] Verify webhook received in terminal
- [ ] Check database for updated subscription data
- [ ] Test billing portal access
- [ ] Test subscription cancellation

---

**You're all set for local Stripe testing!** 🎉
