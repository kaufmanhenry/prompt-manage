import { expect, test } from '@playwright/test'

test.describe('Run Prompt Feature', () => {
  test('should show run prompt button on dashboard', async ({ page }) => {
    // Navigate to dashboard (assuming user is logged in)
    await page.goto('/dashboard')

    // Wait for prompts to load
    await page.waitForSelector('[data-testid="prompt-card"]', {
      timeout: 10000,
    })

    // Check if run prompt button exists
    const runButton = page.locator('button:has-text("Run Prompt")')
    await expect(runButton).toBeVisible()
  })

  test('should handle unauthorized access to run prompt API', async ({ request }) => {
    // Test API without authentication
    const response = await request.post('/api/prompt/run', {
      data: { promptId: 'test-id' },
    })

    expect(response.status()).toBe(401)
    const data = await response.json()
    expect(data.error).toBe('Unauthorized')
  })

  test('should handle missing promptId in API request', async ({ request }) => {
    // Test API with missing promptId
    const response = await request.post('/api/prompt/run', {
      data: {},
    })

    expect(response.status()).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('Prompt ID is required')
  })
})
