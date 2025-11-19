# Fix Supabase Environment Variables

## 🚨 **URGENT FIX**

Your `.env.local` file is missing Supabase credentials!

## ✅ **Quick Fix**

### 1. Get Your Supabase Credentials

Go to: **Supabase Dashboard → Project Settings → API**

You'll find:

- **Project URL** (starts with `https://`)
- **anon/public key** (starts with `eyJ...`)

### 2. Update `.env.local`

I've added placeholders to your `.env.local`. **Replace them with your actual values:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 📝 **Manual Instructions**

If you prefer to do it manually:

1. **Open** `.env.local` in your editor
2. **Add these lines** at the end:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Replace** the placeholder values with your actual Supabase credentials
4. **Save** the file
5. **Restart** your dev server

---

## 🔍 **Where to Find Your Credentials**

### Supabase Dashboard Method:

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## ✅ **Verify It Works**

After updating and restarting:

1. Refresh your browser
2. The error should be gone
3. Your app should load normally

---

**This is blocking your entire app - fix it ASAP!** 🚨
