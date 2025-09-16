import { expect, test } from '@playwright/test'

test.describe('PromptForm Tags', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login')
    await page.fill('[data-testid="email"]', 'test@example.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-button"]')

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard')
  })

  test('shows existing user tags in tag selector', async ({ page }) => {
    // Create a prompt with tags first
    await page.goto('/dashboard')

    // Click create prompt button
    await page.click('[data-testid="create-prompt"]')

    // Fill prompt form with tags
    await page.fill('[data-testid="prompt-name"]', 'Test Prompt with Tags')
    await page.fill('[data-testid="prompt-text"]', 'This is a test prompt')
    await page.selectOption('[data-testid="prompt-model"]', 'gpt-4')

    // Add tags
    await page.fill('[data-testid="prompt-tags"]', 'test, example, demo')
    await page.keyboard.press('Enter')

    // Submit form
    await page.click('[data-testid="submit-prompt"]')

    // Wait for success
    await expect(page.locator('text=Prompt Created')).toBeVisible()

    // Create another prompt and verify tags are available
    await page.click('[data-testid="create-prompt"]')

    // Click on the tags field to open the selector
    await page.click('[data-testid="prompt-tags"]')

    // Verify that the previously created tags are available as options
    await expect(page.locator('text=test')).toBeVisible()
    await expect(page.locator('text=example')).toBeVisible()
    await expect(page.locator('text=demo')).toBeVisible()
  })

  test('allows creating new tags while showing existing ones', async ({
    page,
  }) => {
    await page.goto('/dashboard')

    // Click create prompt button
    await page.click('[data-testid="create-prompt"]')

    // Click on the tags field
    await page.click('[data-testid="prompt-tags"]')

    // Type a new tag
    await page.fill('[data-testid="prompt-tags"]', 'new-tag')
    await page.keyboard.press('Enter')

    // Verify the new tag was added
    await expect(page.locator('text=new-tag')).toBeVisible()
  })
})
