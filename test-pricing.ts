import { getStripePriceId } from './lib/pricing-server'

console.log('=== Testing Stripe Price ID Resolution ===')
console.log('Environment variables:')
console.log(
  'STRIPE_PRICE_TEAM_MONTHLY_ID:',
  process.env.STRIPE_PRICE_TEAM_MONTHLY_ID ? '✅ Set' : '❌ Missing',
)
console.log(
  'STRIPE_PRICE_PRO_MONTHLY_ID:',
  process.env.STRIPE_PRICE_PRO_MONTHLY_ID ? '✅ Set' : '❌ Missing',
)

console.log('\nAttempting to get Price IDs:')
try {
  const teamPriceId = getStripePriceId('team')
  console.log('Team Price ID:', teamPriceId)
} catch (error) {
  console.error('Team Price ID Error:', error instanceof Error ? error.message : error)
}

try {
  const proPriceId = getStripePriceId('pro')
  console.log('Pro Price ID:', proPriceId)
} catch (error) {
  console.error('Pro Price ID Error:', error instanceof Error ? error.message : error)
}
