import { test, expect } from '@playwright/test'

test.describe('Prompt Editing', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to dashboard
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'test@example.com')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
  })

  test('user can edit an existing prompt', async ({ page }) => {
    // Create a prompt first
    await page.click('text=New Prompt')
    await page.fill('input[placeholder="Enter a name for your prompt"]', 'Test Prompt for Editing')
    await page.fill('textarea[placeholder="Enter your prompt text here..."]', 'Initial prompt text')
    await page.click('text=Create Prompt')
    
    // Wait for the prompt to be created and dialog to close
    await page.waitForSelector('text=Test Prompt for Editing')
    
    // Click the edit button (three dots menu)
    await page.click('button[aria-label="More options"]')
    await page.click('text=Edit')
    
    // Verify edit form opens with pre-filled data
    await expect(page.locator('text=Edit Prompt')).toBeVisible()
    await expect(page.locator('input[value="Test Prompt for Editing"]')).toBeVisible()
    await expect(page.locator('textarea')).toHaveValue('Initial prompt text')
    
    // Edit the prompt
    await page.fill('input[placeholder="Enter a name for your prompt"]', 'Updated Test Prompt')
    await page.fill('textarea[placeholder="Enter your prompt text here..."]', 'Updated prompt text')
    
    // Save the changes
    await page.click('text=Update Prompt')
    
    // Verify the prompt was updated
    await expect(page.locator('text=Updated Test Prompt')).toBeVisible()
    await expect(page.locator('text=Updated prompt text')).toBeVisible()
  })

  test('edit form shows correct title and button text', async ({ page }) => {
    // Create a prompt first
    await page.click('text=New Prompt')
    await page.fill('input[placeholder="Enter a name for your prompt"]', 'Test Prompt')
    await page.fill('textarea[placeholder="Enter your prompt text here..."]', 'Test text')
    await page.click('text=Create Prompt')
    
    // Wait for prompt to be created
    await page.waitForSelector('text=Test Prompt')
    
    // Open edit form
    await page.click('button[aria-label="More options"]')
    await page.click('text=Edit')
    
    // Verify edit form elements
    await expect(page.locator('text=Edit Prompt')).toBeVisible()
    await expect(page.locator('text=Update your existing prompt.')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toHaveText('Update Prompt')
  })

  test('new prompt form shows correct title and button text', async ({ page }) => {
    // Open new prompt form
    await page.click('text=New Prompt')
    
    // Verify new prompt form elements
    await expect(page.locator('text=New Prompt')).toBeVisible()
    await expect(page.locator('text=Create a new prompt to use with your AI models.')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toHaveText('Create Prompt')
  })
}) 