import { NextResponse } from 'next/server'

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    stripeConfig: {
      secretKey: process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing',
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing',
      teamPriceId: process.env.STRIPE_PRICE_TEAM_MONTHLY_ID ? '✅ Set' : '❌ Missing',
      proPriceId: process.env.STRIPE_PRICE_PRO_MONTHLY_ID ? '✅ Set' : '❌ Missing',
    },
    actualValues: {
      teamPriceId: process.env.STRIPE_PRICE_TEAM_MONTHLY_ID || 'NOT SET',
      proPriceId: process.env.STRIPE_PRICE_PRO_MONTHLY_ID || 'NOT SET',
    },
    supabaseConfig: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
      serviceRole: process.env.SUPABASE_SERVICE_ROLE ? '✅ Set' : '❌ Missing',
    },
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
  }

  return NextResponse.json(diagnostics, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
