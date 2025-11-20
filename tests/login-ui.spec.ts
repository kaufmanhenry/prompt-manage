import { expect, type Page, test } from '@playwright/test'

test('login buttons are visible and correctly styled', async ({ page }: { page: Page }) => {
  await page.goto('/')

  await page.waitForLoadState('networkidle')

  // Debug: Print page content
  // console.log(await page.content())

  // Scope to the hero section by finding the main heading and going up to its container
  const heroContainer = page.getByRole('heading', { name: 'Stop Losing Your Best Prompts' }).locator('xpath=..')

  // Check Google Sign In button in hero
  const googleBtn = heroContainer.getByRole('button', { name: 'Sign in with Google' })
  try {
    await expect(googleBtn).toBeVisible({ timeout: 5000 })
    // Verify it has the new classes (checking for exact class string to see diff if it fails)
    await expect(googleBtn).toHaveClass('aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap outline-none transition-[background-color,border-color,box-shadow,transform,color] duration-normal ease-standard will-change-transform focus-visible:border-ring focus-visible:ring-ring/50 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*=\'size-\'])] :size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 [@media(hover:hover)]:hover:-translate-y-px bg-primary text-primary-foreground shadow-xs [@media(hover:hover)]:hover:bg-primary/90 rounded-md has-[>svg]:px-4 h-12 px-6 text-base font-medium')
  } catch (e) {
    console.log('Google button not found or style mismatch. Page content:')
    console.log(await page.content())
    throw e
  }

  // Check Email Sign In button in hero
  const emailBtn = heroContainer.getByRole('button', { name: 'Sign in with Email' })
  await expect(emailBtn).toBeVisible()
  await expect(emailBtn).toHaveClass(/h-12/)

  // Check Browse Templates button in hero
  const browseBtn = heroContainer.getByRole('button', { name: 'Browse Templates' })
  await expect(browseBtn).toBeVisible()
})
