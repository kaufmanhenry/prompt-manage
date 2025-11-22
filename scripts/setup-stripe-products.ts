import { config } from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import Stripe from 'stripe'

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') })

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY not found in .env.local')
  process.exit(1)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
})

async function setupStripeProducts() {
  console.log('🚀 Setting up Stripe products...\n')

  try {
    // Create Team product
    console.log('Creating Team product...')
    const teamProduct = await stripe.products.create({
      name: 'Prompt Manage Team',
      description: 'Team plan with unlimited prompts, collaboration, and full Prompt Lab access',
      metadata: {
        tier: 'team',
      },
    })

    // Create Team monthly price
    const teamMonthlyPrice = await stripe.prices.create({
      product: teamProduct.id,
      unit_amount: 2000, // $20.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'team',
        interval: 'month',
      },
    })

    console.log('✅ Team product created')
    console.log(`   Product ID: ${teamProduct.id}`)
    console.log(`   Price ID: ${teamMonthlyPrice.id}`)
    console.log(`   Amount: $${teamMonthlyPrice.unit_amount! / 100}/month\n`)

    // Create Pro product
    console.log('Creating Pro product...')
    const proProduct = await stripe.products.create({
      name: 'Prompt Manage Pro',
      description:
        'Pro plan with advanced features, priority support, and enterprise-grade security',
      metadata: {
        tier: 'pro',
      },
    })

    // Create Pro monthly price
    const proMonthlyPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 9900, // $99.00
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        tier: 'pro',
        interval: 'month',
      },
    })

    console.log('✅ Pro product created')
    console.log(`   Product ID: ${proProduct.id}`)
    console.log(`   Price ID: ${proMonthlyPrice.id}`)
    console.log(`   Amount: $${proMonthlyPrice.unit_amount! / 100}/month\n`)

    // Update .env.local file
    const envPath = path.join(process.cwd(), '.env.local')
    let envContent = fs.readFileSync(envPath, 'utf-8')

    envContent = envContent.replace(
      /STRIPE_PRODUCT_TEAM_ID=.*/,
      `STRIPE_PRODUCT_TEAM_ID=${teamProduct.id}`,
    )
    envContent = envContent.replace(
      /STRIPE_PRICE_TEAM_MONTHLY_ID=.*/,
      `STRIPE_PRICE_TEAM_MONTHLY_ID=${teamMonthlyPrice.id}`,
    )
    envContent = envContent.replace(
      /STRIPE_PRODUCT_PRO_ID=.*/,
      `STRIPE_PRODUCT_PRO_ID=${proProduct.id}`,
    )
    envContent = envContent.replace(
      /STRIPE_PRICE_PRO_MONTHLY_ID=.*/,
      `STRIPE_PRICE_PRO_MONTHLY_ID=${proMonthlyPrice.id}`,
    )

    fs.writeFileSync(envPath, envContent)

    console.log('✅ Updated .env.local with product IDs\n')

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎉 Stripe setup complete!\n')
    console.log('Next steps:')
    console.log('1. Restart your dev server: npm run dev')
    console.log('2. Visit: http://localhost:3000/pricing')
    console.log('3. Click "Subscribe to Team" to test checkout')
    console.log('4. Use test card: 4242 4242 4242 4242')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log('📋 Summary:')
    console.log(`Team Product ID: ${teamProduct.id}`)
    console.log(`Team Price ID: ${teamMonthlyPrice.id}`)
    console.log(`Pro Product ID: ${proProduct.id}`)
    console.log(`Pro Price ID: ${proMonthlyPrice.id}`)
  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error)
    process.exit(1)
  }
}

void setupStripeProducts()
