import { expect, type Page, test } from '@playwright/test'

test('login buttons are visible and correctly styled', async ({ page }: { page: Page }) => {
  await page.goto('/')

  await page.waitForLoadState('networkidle')

  // Debug: Print page content
  // console.log(await page.content())

  // Check Google Sign In button
  const googleBtn = page.getByRole('button', { name: 'Sign in with Google' })
  try {
    await expect(googleBtn).toBeVisible({ timeout: 5000 })
    // Verify it has the new classes (checking for height 12 which is h-12)
    await expect(googleBtn).toHaveClass(/h-12/)
  } catch (e) {
    console.log('Google button not found or style mismatch. Page content:')
    console.log(await page.content())
    throw e
  }

  // Check Email Sign In button
  const emailBtn = page.getByRole('button', { name: 'Sign in with Email' })
  await expect(emailBtn).toBeVisible()
  await expect(emailBtn).toHaveClass(/h-12/)

  // Check Browse Templates button
  const browseBtn = page.getByRole('button', { name: 'Browse Templates' })
  await expect(browseBtn).toBeVisible()
})
