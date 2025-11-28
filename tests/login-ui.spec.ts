import { expect, type Page, test } from '@playwright/test'

test('login buttons are visible and correctly styled', async ({ page }: { page: Page }) => {
  await page.goto('/')

  await page.waitForLoadState('networkidle')

  // Debug: Print page content
  // console.log(await page.content())

  // Scope to the hero section by finding the main heading and going up to its container
  const heroContainer = page
    .getByRole('heading', { name: /Secure.*Affordable.*Prompt Management/i })
    .locator('xpath=..')

  // Check Google Sign In button in hero (now labeled "Start Free - No Credit Card")
  const googleBtn = heroContainer.getByRole('button', { name: /Start Free.*No Credit Card/i })
  try {
    await expect(googleBtn).toBeVisible({ timeout: 5000 })
    // Verify it has key styling classes (using regex to be more resilient to class changes)
    // Note: Height is now responsive (sm:h-12) for mobile-first design
    await expect(googleBtn).toHaveClass(/sm:h-12/) // Responsive height
    await expect(googleBtn).toHaveClass(/shadow/) // Shadow styling
  } catch (e) {
    console.log('Google button not found or style mismatch. Page content:')
    console.log(await page.content())
    throw e
  }

  // Check View Pricing button in hero (replaces old "Browse Templates")
  const pricingBtn = heroContainer.getByRole('link', { name: 'View Pricing' })
  await expect(pricingBtn).toBeVisible()
})
