# Feature Implementation Guide

This guide provides a structured approach to implementing new features in the Prompt Manage project using the multi-agent development methodology.

## Overview

The feature implementation process follows a systematic approach using specialized AI agents that work together to build comprehensive, well-tested features. This ensures consistency, quality, and maintainability across the codebase.

## Implementation Process

### Phase 1: Planning and Requirements

#### 1.1 Feature Definition
- **Agent**: Project Manager Agent
- **Deliverables**:
  - Clear feature requirements
  - User stories and acceptance criteria
  - Technical scope and constraints
  - Integration points with existing features

#### 1.2 Architecture Planning
- **Agent**: Project Manager Agent + Database & Schema Agent
- **Deliverables**:
  - Database schema changes (if needed)
  - API endpoint design
  - Component architecture
  - Security considerations

### Phase 2: Database and Backend

#### 2.1 Database Schema
- **Agent**: Database & Schema Agent
- **Deliverables**:
  - Database migration files
  - Updated Zod schemas
  - Row Level Security (RLS) policies
  - Database indexes and optimizations

#### 2.2 API Development
- **Agent**: Backend Development Agent
- **Deliverables**:
  - API route handlers
  - Request/response validation
  - Error handling
  - Authentication and authorization

### Phase 3: Frontend Development

#### 3.1 Component Development
- **Agent**: Frontend Development Agent
- **Deliverables**:
  - React components
  - State management
  - User interactions
  - Form handling

#### 3.2 UI/UX Implementation
- **Agent**: UI/UX Enhancement Agent
- **Deliverables**:
  - Visual design implementation
  - Responsive design
  - Accessibility features
  - User experience polish

### Phase 4: Testing and Quality Assurance

#### 4.1 Testing Implementation
- **Agent**: Testing & Quality Assurance Agent
- **Deliverables**:
  - Unit tests
  - Integration tests
  - E2E tests
  - Performance tests

#### 4.2 Security Review
- **Agent**: Authentication & Security Agent
- **Deliverables**:
  - Security audit
  - Vulnerability assessment
  - Authentication flow validation
  - Data protection review

### Phase 5: Integration and Deployment

#### 5.1 Integration Testing
- **Agent**: Project Manager Agent
- **Deliverables**:
  - End-to-end feature testing
  - Integration with existing features
  - Performance validation
  - User acceptance testing

#### 5.2 Documentation
- **Agent**: Project Manager Agent
- **Deliverables**:
  - Feature documentation
  - API documentation updates
  - User guide updates
  - Technical documentation

## Detailed Implementation Steps

### Step 1: Feature Planning

#### 1.1 Define Requirements
```markdown
## Feature: [Feature Name]

### User Stories
- As a [user type], I want [goal] so that [benefit]
- As a [user type], I want [goal] so that [benefit]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Technical Requirements
- Database changes needed: [Yes/No]
- API endpoints needed: [List]
- UI components needed: [List]
- Security considerations: [List]
```

#### 1.2 Create Feature Branch
```bash
git checkout -b feature/feature-name
```

### Step 2: Database Implementation

#### 2.1 Create Migration
```bash
# Generate migration
supabase db diff --schema public

# Review and edit migration file
# Add to supabase/migrations/
```

#### 2.2 Update Schemas
```typescript
// lib/schemas/feature.ts
import { z } from 'zod'

export const featureSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type Feature = z.infer<typeof featureSchema>
```

#### 2.3 Apply Migration
```bash
supabase db push
```

### Step 3: API Development

#### 3.1 Create API Routes
```typescript
// app/api/features/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { featureSchema } from '@/lib/schemas/feature'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get features
    const { data: features, error } = await supabase
      .from('features')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching features:', error)
      return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 })
    }

    return NextResponse.json(features)
  } catch (error) {
    console.error('Features API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = featureSchema.parse(body)

    // Create feature
    const { data: feature, error } = await supabase
      .from('features')
      .insert([{ ...validatedData, user_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error('Error creating feature:', error)
      return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 })
    }

    return NextResponse.json(feature)
  } catch (error) {
    console.error('Create feature API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Step 4: Frontend Development

#### 4.1 Create Components
```typescript
// components/FeatureForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { featureSchema, type Feature } from '@/lib/schemas/feature'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

interface FeatureFormProps {
  feature?: Feature
  onSuccess?: () => void
}

export function FeatureForm({ feature, onSuccess }: FeatureFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<Feature>({
    resolver: zodResolver(featureSchema),
    defaultValues: feature || {
      name: '',
      description: '',
    },
  })

  const onSubmit = async (values: Feature) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/features', {
        method: feature ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to save feature')
      }

      toast({
        title: feature ? 'Feature Updated' : 'Feature Created',
        description: `"${values.name}" has been successfully ${feature ? 'updated' : 'created'}.`,
      })

      onSuccess?.()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save feature. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          {...form.register('name')}
          placeholder="Enter feature name"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="Enter feature description"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : (feature ? 'Update Feature' : 'Create Feature')}
      </Button>
    </form>
  )
}
```

### Step 5: Testing Implementation

#### 5.1 Unit Tests
```typescript
// tests/features.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Features', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login user
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'test@example.com')
    await page.click('[data-testid="send-otp"]')
    // ... OTP flow
  })

  test('should create a new feature', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click create feature button
    await page.click('[data-testid="create-feature"]')
    
    // Fill form
    await page.fill('[data-testid="feature-name"]', 'Test Feature')
    await page.fill('[data-testid="feature-description"]', 'Test Description')
    
    // Submit form
    await page.click('[data-testid="submit-feature"]')
    
    // Verify success
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible()
    
    // Verify feature appears in list
    await expect(page.locator('text=Test Feature')).toBeVisible()
  })
})
```

### Step 6: Documentation

#### 6.1 Feature Documentation
```markdown
# Feature Name

## Overview
Brief description of the feature and its purpose.

## User Stories
- As a user, I want to...
- As a user, I want to...

## Implementation Details

### Database Changes
- New table: `features`
- New columns: `feature_id`, `feature_name`
- RLS policies implemented

### API Endpoints
- `GET /api/features` - List user's features
- `POST /api/features` - Create new feature
- `PUT /api/features/[id]` - Update feature
- `DELETE /api/features/[id]` - Delete feature

### Components
- `FeatureForm` - Create/edit feature form
- `FeaturesList` - Display list of features
- `FeatureCard` - Individual feature display

### Testing
- Unit tests for components
- Integration tests for API endpoints
- E2E tests for user flows

## Usage Examples

### Creating a Feature
```typescript
const response = await fetch('/api/features', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My Feature',
    description: 'Feature description'
  })
})
```

## Security Considerations
- Users can only access their own features
- RLS policies enforce data isolation
- Input validation prevents malicious data

## Performance Considerations
- Database indexes on frequently queried columns
- Pagination for large feature lists
- Efficient React rendering with proper keys

## Future Enhancements
- Feature categories
- Feature sharing
- Feature analytics
```

## Best Practices

### 1. Code Organization
- Keep related files together
- Use consistent naming conventions
- Follow existing patterns in the codebase
- Separate concerns clearly

### 2. Error Handling
- Implement comprehensive error handling
- Provide user-friendly error messages
- Log errors for debugging
- Handle edge cases gracefully

### 3. Testing
- Write tests for all new functionality
- Test both happy path and error cases
- Ensure good test coverage
- Test accessibility and responsive design

### 4. Security
- Validate all inputs
- Implement proper authentication checks
- Use RLS policies for data protection
- Follow OWASP security guidelines

### 5. Performance
- Optimize database queries
- Implement proper caching
- Use efficient React patterns
- Monitor performance metrics

## Common Pitfalls

### 1. Incomplete Error Handling
- Always handle API errors
- Provide fallback states
- Don't let errors crash the app

### 2. Poor State Management
- Use appropriate state management patterns
- Avoid prop drilling
- Keep state as local as possible

### 3. Missing Validation
- Validate all user inputs
- Use Zod schemas consistently
- Handle edge cases

### 4. Inadequate Testing
- Test all user flows
- Test error scenarios
- Test accessibility
- Test responsive design

## Checklist

### Before Starting
- [ ] Feature requirements are clear
- [ ] Database schema is designed
- [ ] API endpoints are planned
- [ ] UI components are sketched
- [ ] Security considerations are identified

### During Development
- [ ] Database migration is created and tested
- [ ] API endpoints are implemented and tested
- [ ] Frontend components are built
- [ ] Error handling is comprehensive
- [ ] Tests are written and passing

### Before Deployment
- [ ] All tests are passing
- [ ] Code is reviewed
- [ ] Documentation is updated
- [ ] Performance is acceptable
- [ ] Security is validated
- [ ] Accessibility is verified

---

*Last updated: December 2024* 