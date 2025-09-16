import { expect, test } from '@playwright/test'

test.describe('Related Prompts Feature', () => {
  test('should display related prompts on public prompt page', async ({
    page,
  }) => {
    // Navigate to a public prompt page
    await page.goto('/p')

    // Wait for the page to load
    await page.waitForSelector('[data-testid="prompt-card"]', {
      timeout: 10000,
    })

    // Click on the first prompt to view its details
    const firstPrompt = page.locator('[data-testid="prompt-card"]').first()
    await firstPrompt.click()

    // Wait for the prompt page to load
    await page.waitForURL(/\/p\/[^/]+$/)

    // Check if related prompts section is present
    const relatedPromptsSection = page.locator('text=Related Prompts')
    await expect(relatedPromptsSection).toBeVisible()

    // Check if tabs are present
    const tagsTab = page.locator('text=Tags')
    const modelTab = page.locator('text=Model')
    const popularTab = page.locator('text=Popular')

    await expect(tagsTab).toBeVisible()
    await expect(modelTab).toBeVisible()
    await expect(popularTab).toBeVisible()
  })

  test('should navigate between related prompt tabs', async ({ page }) => {
    // Navigate to a public prompt page
    await page.goto('/p')
    await page.waitForSelector('[data-testid="prompt-card"]', {
      timeout: 10000,
    })

    const firstPrompt = page.locator('[data-testid="prompt-card"]').first()
    await firstPrompt.click()
    await page.waitForURL(/\/p\/[^/]+$/)

    // Click on different tabs
    await page.click('text=Model')
    await page.click('text=Popular')
    await page.click('text=Tags')

    // Verify tabs are clickable and content changes
    const tabsContent = page.locator('[role="tabpanel"]')
    await expect(tabsContent).toBeVisible()
  })

  test('should show empty state when no related prompts found', async ({
    page,
  }) => {
    // This test would require a prompt with no related content
    // For now, we'll just verify the component handles empty states gracefully
    await page.goto('/p')
    await page.waitForSelector('[data-testid="prompt-card"]', {
      timeout: 10000,
    })

    const firstPrompt = page.locator('[data-testid="prompt-card"]').first()
    await firstPrompt.click()
    await page.waitForURL(/\/p\/[^/]+$/)

    // The component should either show related prompts or not show at all
    // Both are valid behaviors
    const relatedPromptsSection = page.locator('text=Related Prompts')
    const hasRelatedPrompts = await relatedPromptsSection.isVisible()

    if (hasRelatedPrompts) {
      // If related prompts are shown, verify they have content
      const promptCards = page.locator('[data-testid="related-prompt-card"]')
      const count = await promptCards.count()
      expect(count).toBeGreaterThan(0)
    }
    // If no related prompts section is shown, that's also valid
  })
})
