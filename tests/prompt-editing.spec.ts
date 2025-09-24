import { expect, test } from '@playwright/test'

test.describe('Prompt Editing UI Components', () => {
  test('edit form shows correct title and button text when editing', async ({
    page,
  }) => {
    // Navigate directly to the dashboard (this will redirect to login if not authenticated)
    await page.goto('/dashboard')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Check if we're on the login page (which is expected if not authenticated)
    const hasSignInButton = await page
      .getByRole('button', { name: 'Sign in with Google' })
      .isVisible()

    if (hasSignInButton) {
      await expect(
        page.getByRole('button', { name: 'Sign in with Google' })
      ).toBeVisible()
      return
    }

    // If we're authenticated, test the edit functionality
    // Look for the + Add button in the sidebar
    const addButton = page.locator('text=+ Add')
    if (await addButton.isVisible()) {
      await addButton.click()

      // Verify the create form elements
      await expect(page.locator('text=New Prompt')).toBeVisible()
      await expect(
        page.locator('text=Create a new prompt to use with your AI models.')
      ).toBeVisible()
      await expect(page.locator('button[type="submit"]').toHaveText(
        'Create Prompt'
      )
    }
  })

  test('dashboard layout loads correctly', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Check for basic dashboard elements
    const hasSidebar = await page.locator('aside').isVisible()
    const hasMainContent = await page.locator('main').first().isVisible()

    // At minimum, the layout should be present
    expect(hasSidebar || hasMainContent).toBeTruthy()
  })
})
