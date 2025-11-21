import { expect, type Page, test } from '@playwright/test'

test('signin button visible in header', async ({ page }: { page: Page }) => {
  await page.goto('/')

  await page.waitForLoadState('networkidle')

  // Target specifically the button in the header (banner role)
  await expect(
    page.getByRole('banner').getByRole('button', { name: 'Sign in with Google' }),
  ).toBeVisible()
})
