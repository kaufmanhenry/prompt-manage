import { test, expect, type Page } from '@playwright/test'

test('login page', async ({ page }: { page: Page }) => {
  await page.goto('/auth/login')

  // Check if the login form is visible
  await expect(page.getByRole('heading', { name: 'Welcome to Prompt Manage' })).toBeVisible()
  await expect(page.getByPlaceholder('Enter your email')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Send magic link' })).toBeVisible()

  // Try to submit without an email
  await page.getByRole('button', { name: 'Send magic link' }).click()
  await expect(page.getByPlaceholder('Enter your email')).toBeInvalid()

  // Enter an invalid email
  await page.getByPlaceholder('Enter your email').fill('invalid-email')
  await page.getByRole('button', { name: 'Send magic link' }).click()
  await expect(page.getByPlaceholder('Enter your email')).toBeInvalid()

  // Enter a valid email
  await page.getByPlaceholder('Enter your email').fill('test@example.com')
  await page.getByRole('button', { name: 'Send magic link' }).click()
  await expect(page.getByText('Check your email for the login link!')).toBeVisible()
}) 