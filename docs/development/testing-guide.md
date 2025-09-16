# Testing Guide

This guide provides comprehensive testing strategies and best practices for the Prompt Manage project, covering unit tests, integration tests, E2E tests, and performance testing.

## Testing Philosophy

Our testing approach follows these principles:

- **Test-driven development** when possible
- **Comprehensive coverage** of critical user flows
- **Fast feedback** for developers
- **Reliable tests** that don't flake
- **Accessibility testing** for inclusive design
- **Performance testing** for optimal user experience

## Testing Stack

### Core Testing Tools

- **Playwright**: E2E testing framework
- **React Testing Library**: Component testing
- **Jest**: Unit testing framework
- **MSW (Mock Service Worker)**: API mocking
- **@testing-library/user-event**: User interaction simulation

### Testing Utilities

- **Playwright Test**: Browser automation
- **React Query DevTools**: Query debugging
- **Supabase Testing**: Database testing utilities

## Test Types and Structure

### 1. Unit Tests

**Purpose**: Test individual functions and components in isolation
**Location**: `__tests__/` directories or `.test.ts` files
**Coverage**: Business logic, utility functions, component rendering

### 2. Integration Tests

**Purpose**: Test interactions between components and services
**Location**: `tests/integration/` directory
**Coverage**: API routes, database operations, component integration

### 3. E2E Tests

**Purpose**: Test complete user workflows
**Location**: `tests/` directory (`.spec.ts` files)
**Coverage**: Full user journeys, critical paths

### 4. Performance Tests

**Purpose**: Ensure optimal performance
**Location**: `tests/performance/` directory
**Coverage**: Load times, memory usage, database performance

## Test Organization

```
tests/
├── unit/                  # Unit tests
│   ├── components/       # Component tests
│   ├── utils/           # Utility function tests
│   └── schemas/         # Schema validation tests
├── integration/          # Integration tests
│   ├── api/             # API route tests
│   ├── database/        # Database operation tests
│   └── auth/            # Authentication tests
├── e2e/                 # End-to-end tests
│   ├── auth/            # Authentication flows
│   ├── prompts/         # Prompt management flows
│   └── sharing/         # Sharing functionality
├── performance/         # Performance tests
├── fixtures/            # Test data and fixtures
└── helpers/             # Test utilities and helpers
```

## Unit Testing

### Component Testing

#### Basic Component Test

```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button', { name: 'Click me' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeDisabled()
  })
})
```

#### Form Component Test

```typescript
// __tests__/components/PromptForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptForm } from '@/components/PromptForm'
import { promptSchema } from '@/lib/schemas/prompt'

// Mock the toast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

describe('PromptForm', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('renders form fields', () => {
    render(<PromptForm />)

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/prompt text/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<PromptForm />)

    // Try to submit without filling required fields
    await user.click(screen.getByRole('button', { name: /create prompt/i }))

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/prompt text is required/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockOnSuccess = jest.fn()
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: '1', name: 'Test Prompt' }),
      })
    ) as jest.Mock

    render(<PromptForm onSuccess={mockOnSuccess} />)

    // Fill form
    await user.type(screen.getByLabelText(/name/i), 'Test Prompt')
    await user.type(screen.getByLabelText(/prompt text/i), 'Test prompt text')
    await user.selectOptions(screen.getByLabelText(/model/i), 'gpt-4')

    // Submit form
    await user.click(screen.getByRole('button', { name: /create prompt/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Prompt',
          description: '',
          prompt_text: 'Test prompt text',
          model: 'gpt-4',
          tags: [],
          is_public: false,
        }),
      })
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })
})
```

### Utility Function Testing

```typescript
// __tests__/utils/formatDate.test.ts
import { formatDate } from '@/utils/formatDate'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2024-01-15T10:30:00Z')
    expect(formatDate(date)).toBe('Jan 15, 2024')
  })

  it('handles invalid dates', () => {
    expect(formatDate('invalid-date')).toBe('Invalid Date')
  })

  it('formats relative dates', () => {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    expect(formatDate(oneHourAgo)).toBe('1 hour ago')
  })
})
```

### Schema Validation Testing

```typescript
// __tests__/schemas/prompt.test.ts
import { promptSchema } from '@/lib/schemas/prompt'

describe('promptSchema', () => {
  it('validates correct prompt data', () => {
    const validPrompt = {
      name: 'Test Prompt',
      description: 'A test prompt',
      prompt_text: 'This is a test prompt',
      model: 'gpt-4',
      tags: ['test', 'example'],
      is_public: false,
    }

    const result = promptSchema.safeParse(validPrompt)
    expect(result.success).toBe(true)
  })

  it('rejects invalid prompt data', () => {
    const invalidPrompt = {
      name: '', // Empty name should fail
      prompt_text: '', // Empty prompt text should fail
      model: 'invalid-model', // Invalid model should fail
    }

    const result = promptSchema.safeParse(invalidPrompt)
    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues).toHaveLength(3)
    }
  })
})
```

## E2E Testing

### Authentication Flow Testing

```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can sign up and log in', async ({ page }) => {
    const testEmail = `test-${Date.now()}@example.com`

    // Go to signup page
    await page.goto('/signup')

    // Fill signup form
    await page.fill('[data-testid="email"]', testEmail)
    await page.click('[data-testid="send-otp"]')

    // Wait for OTP email (in real test, you'd check email or use test email service)
    await page.waitForSelector('[data-testid="otp-input"]')

    // Enter OTP (mock for testing)
    await page.fill('[data-testid="otp-input"]', '123456')
    await page.click('[data-testid="verify-otp"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')

    // Should show welcome message
    await expect(page.locator('text=Welcome')).toBeVisible()
  })

  test('user can log out', async ({ page }) => {
    // Login first (use helper function)
    await loginUser(page, 'test@example.com')

    // Go to dashboard
    await page.goto('/dashboard')

    // Click logout
    await page.click('[data-testid="logout-button"]')

    // Should redirect to home page
    await expect(page).toHaveURL('/')

    // Should not show dashboard content
    await expect(page.locator('text=Dashboard')).not.toBeVisible()
  })
})

// Helper function for login
async function loginUser(page: any, email: string) {
  await page.goto('/login')
  await page.fill('[data-testid="email"]', email)
  await page.click('[data-testid="send-otp"]')
  await page.waitForSelector('[data-testid="otp-input"]')
  await page.fill('[data-testid="otp-input"]', '123456')
  await page.click('[data-testid="verify-otp"]')
  await expect(page).toHaveURL('/dashboard')
}
```

### Prompt Management Flow Testing

```typescript
// tests/prompt-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Prompt Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginUser(page, 'test@example.com')
  })

  test('user can create a new prompt', async ({ page }) => {
    await page.goto('/dashboard')

    // Click create prompt button
    await page.click('[data-testid="create-prompt"]')

    // Fill prompt form
    await page.fill('[data-testid="prompt-name"]', 'Test Prompt')
    await page.fill('[data-testid="prompt-description"]', 'Test Description')
    await page.fill('[data-testid="prompt-text"]', 'This is a test prompt')
    await page.selectOption('[data-testid="prompt-model"]', 'gpt-4')

    // Add tags
    await page.fill('[data-testid="prompt-tags"]', 'test, example')
    await page.keyboard.press('Enter')

    // Submit form
    await page.click('[data-testid="submit-prompt"]')

    // Verify success
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible()

    // Verify prompt appears in list
    await expect(page.locator('text=Test Prompt')).toBeVisible()
    await expect(page.locator('text=Test Description')).toBeVisible()
  })

  test('user can edit an existing prompt', async ({ page }) => {
    await page.goto('/dashboard')

    // Create a prompt first
    await createTestPrompt(page)

    // Click edit on the prompt
    await page.click('[data-testid="edit-prompt"]').first()

    // Update the prompt
    await page.fill('[data-testid="prompt-name"]', 'Updated Prompt')
    await page.click('[data-testid="submit-prompt"]')

    // Verify success
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible()

    // Verify updated prompt
    await expect(page.locator('text=Updated Prompt')).toBeVisible()
  })

  test('user can delete a prompt', async ({ page }) => {
    await page.goto('/dashboard')

    // Create a prompt first
    await createTestPrompt(page)

    // Click delete on the prompt
    await page.click('[data-testid="delete-prompt"]').first()

    // Confirm deletion
    await page.click('[data-testid="confirm-delete"]')

    // Verify success
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible()

    // Verify prompt is removed
    await expect(page.locator('text=Test Prompt')).not.toBeVisible()
  })
})

// Helper functions
async function createTestPrompt(page: any) {
  await page.click('[data-testid="create-prompt"]')
  await page.fill('[data-testid="prompt-name"]', 'Test Prompt')
  await page.fill('[data-testid="prompt-text"]', 'Test prompt text')
  await page.selectOption('[data-testid="prompt-model"]', 'gpt-4')
  await page.click('[data-testid="submit-prompt"]')
  await expect(page.locator('[data-testid="success-toast"]')).toBeVisible()
}
```

## Performance Testing

### Load Time Testing

```typescript
// tests/performance/load-times.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Performance', () => {
  test('dashboard loads within acceptable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/dashboard')

    // Wait for main content to load
    await page.waitForSelector('[data-testid="dashboard-content"]')

    const loadTime = Date.now() - startTime

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('prompt list loads efficiently', async ({ page }) => {
    await page.goto('/dashboard')

    // Measure time to load prompts
    const startTime = Date.now()
    await page.waitForSelector('[data-testid="prompt-card"]')
    const loadTime = Date.now() - startTime

    // Should load within 2 seconds
    expect(loadTime).toBeLessThan(2000)
  })
})
```

## Accessibility Testing

### Basic Accessibility Tests

```typescript
// tests/accessibility.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Accessibility', () => {
  test('homepage meets accessibility standards', async ({ page }) => {
    await page.goto('/')

    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    expect(headings.length).toBeGreaterThan(0)

    // Check for alt text on images
    const images = await page.locator('img').all()
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy()
    }

    // Check for proper form labels
    const inputs = await page.locator('input, textarea, select').all()
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count()
        expect(label).toBeGreaterThan(0)
      }
    }
  })

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/dashboard')

    // Tab through all interactive elements
    await page.keyboard.press('Tab')

    // Should focus on first interactive element
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName
    )
    expect(focusedElement).toBeTruthy()
  })
})
```

## Running Tests

### Test Commands

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e         # E2E tests only
npm run test:performance # Performance tests only

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode (Playwright)
npm run test:ui

# Debug tests
npm run test:debug
```

## Best Practices

### 1. Test Organization

- Group related tests together
- Use descriptive test names
- Keep tests focused and atomic
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Test Data Management

- Use factories for test data
- Clean up test data after tests
- Use unique identifiers for test data
- Mock external dependencies

### 3. Test Reliability

- Avoid flaky tests
- Use proper wait strategies
- Handle async operations correctly
- Test error scenarios

### 4. Performance

- Keep tests fast
- Use parallel execution when possible
- Optimize test setup and teardown
- Monitor test execution times

### 5. Maintenance

- Keep tests up-to-date with code changes
- Refactor tests when needed
- Remove obsolete tests
- Document complex test scenarios

## Common Testing Patterns

### 1. Page Object Model

```typescript
// tests/pages/DashboardPage.ts
export class DashboardPage {
  constructor(private page: any) {}

  async goto() {
    await this.page.goto('/dashboard')
  }

  async createPrompt(name: string, text: string) {
    await this.page.click('[data-testid="create-prompt"]')
    await this.page.fill('[data-testid="prompt-name"]', name)
    await this.page.fill('[data-testid="prompt-text"]', text)
    await this.page.click('[data-testid="submit-prompt"]')
  }

  async getPromptCards() {
    return this.page.locator('[data-testid="prompt-card"]')
  }
}
```

### 2. Test Utilities

```typescript
// tests/utils/test-helpers.ts
export async function loginUser(page: any, email: string) {
  await page.goto('/login')
  await page.fill('[data-testid="email"]', email)
  await page.click('[data-testid="send-otp"]')
  await page.waitForSelector('[data-testid="otp-input"]')
  await page.fill('[data-testid="otp-input"]', '123456')
  await page.click('[data-testid="verify-otp"]')
  await expect(page).toHaveURL('/dashboard')
}

export async function createTestPrompt(page: any, data = {}) {
  const defaultData = {
    name: 'Test Prompt',
    text: 'Test prompt text',
    model: 'gpt-4',
    ...data,
  }

  await page.click('[data-testid="create-prompt"]')
  await page.fill('[data-testid="prompt-name"]', defaultData.name)
  await page.fill('[data-testid="prompt-text"]', defaultData.text)
  await page.selectOption('[data-testid="prompt-model"]', defaultData.model)
  await page.click('[data-testid="submit-prompt"]')
  await expect(page.locator('[data-testid="success-toast"]')).toBeVisible()
}
```

---

_Last updated: December 2024_
