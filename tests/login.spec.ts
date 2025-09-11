import { expect, type Page, test } from '@playwright/test';

test('login page', async ({ page }: { page: Page }) => {
  await page.goto('/auth/login');

  // Wait for the page to load
  await page.waitForLoadState('networkidle');

  // Check if the login page presents Google sign-in only
  await expect(page.getByText('Welcome back')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
});
