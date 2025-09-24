import { expect, type Page, test } from '@playwright/test'

test('signin button visible in header', async ({ page }: { page: Page }) => {
  await page.goto('/')

  await page.waitForLoadState('networkidle')

  await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible()
})
