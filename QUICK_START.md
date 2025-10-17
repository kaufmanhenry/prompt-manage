# Stripe Testing - Quick Start Guide

## 🚀 **Start Here** (After Migration)

### 1️⃣ Pull Latest Code

```bash
cd /Users/mikemoloney/Documents/prompt-manage
git pull origin main
```

### 2️⃣ Start Dev Server

```bash
npm run dev
```

### 3️⃣ Quick Test (2 minutes)

1. Open: `http://localhost:3000/pricing`
2. Click **"Subscribe to Team"**
3. Fill in:
   - Email: `test@example.com`
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/34`, CVC: `123`, ZIP: `12345`
4. Click **"Subscribe"**
5. ✅ You should redirect to dashboard

### 4️⃣ Verify It Worked

- Go to: `http://localhost:3000/settings/billing`
- Should show: **Team** plan, **Active** status
- Check Supabase → `user_profiles` table for subscription data
- Check Stripe Dashboard for new customer

---

## 🔧 **Set Up Webhooks** (Optional but Recommended)

### Terminal 1 (Dev Server)

```bash
npm run dev
```

### Terminal 2 (Webhooks)

```bash
# Install Stripe CLI (one time)
brew install stripe/stripe-cli/stripe

# Login (one time)
stripe login

# Start forwarding (keep running)
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Copy the webhook secret** (starts with `whsec_`) and add to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

Then restart dev server (Terminal 1):

```bash
npm run dev
```

---

## 🧪 **Test Cards**

| Card Number           | Result                |
| --------------------- | --------------------- |
| `4242 4242 4242 4242` | ✅ Success            |
| `4000 0000 0000 9995` | ❌ Declined           |
| `4000 0025 0000 3155` | 🔒 Requires 3D Secure |

Use any future date, any CVC, any ZIP.

---

## 📁 **Key URLs**

| Page             | URL                                           |
| ---------------- | --------------------------------------------- |
| Pricing          | `http://localhost:3000/pricing`               |
| Billing Settings | `http://localhost:3000/settings/billing`      |
| Dashboard        | `http://localhost:3000/dashboard`             |
| Stripe Dashboard | `https://dashboard.stripe.com/test/dashboard` |

---

## ❓ **Troubleshooting**

### "Unauthorized" error when subscribing

→ Make sure you're logged in to Prompt Manage first

### Checkout button does nothing

→ Check browser console for errors  
→ Verify `.env.local` has Stripe keys

### Database not updating after checkout

→ Set up webhooks (see above)  
→ Check Terminal 2 for webhook events

### "No webhook secret" error

→ Add `STRIPE_WEBHOOK_SECRET` to `.env.local`  
→ Restart dev server

---

## 📚 **Full Documentation**

- **Testing Checklist**: `STRIPE_TESTING_CHECKLIST.md` (10 tests)
- **Local Webhooks**: `STRIPE_LOCAL_TESTING.md`
- **Implementation Summary**: `STRIPE_IMPLEMENTATION_SUMMARY.md`

---

**That's it! You're ready to test.** 🎉
