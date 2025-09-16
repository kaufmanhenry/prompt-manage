import { expect, type Page, test } from '@playwright/test'

test('login page', async ({ page }: { page: Page }) => {
  await page.goto('/auth/login')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Check if the login form is visible
  await expect(page.getByText('Welcome back')).toBeVisible()
  await expect(page.getByPlaceholder('Enter your email')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Send magic link' })
  ).toBeVisible()

  // Try to submit without an email
  await page.getByRole('button', { name: 'Send magic link' }).click()
  // The form should prevent submission with invalid email

  // Enter an invalid email
  await page.getByPlaceholder('Enter your email').fill('invalid-email')
  await page.getByRole('button', { name: 'Send magic link' }).click()
  // The form should prevent submission with invalid email

  // Enter a valid email and submit
  await page.getByPlaceholder('Enter your email').fill('test@example.com')
  await page.getByRole('button', { name: 'Send magic link' }).click()

  // Wait a moment for the toast to appear
  await page.waitForTimeout(1000)

  // Check that the success message appears somewhere on the page
  await expect(page.locator('text=Magic link sent!')).toBeVisible()
})
