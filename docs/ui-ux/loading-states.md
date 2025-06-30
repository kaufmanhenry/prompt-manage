# Loading States Documentation

This document outlines the standardized loading state system used throughout the Prompt Manage application to ensure consistency and better user experience.

## Overview

The loading state system consists of several reusable components that provide consistent visual feedback during asynchronous operations. All loading states follow the design system's color scheme and animation patterns.

## Components

### 1. Spinner Component

A standardized spinner component with configurable sizes.

```tsx
import { Spinner } from '@/components/ui/loading'

// Usage
<Spinner size="sm" />  // Small (16x16px)
<Spinner size="md" />  // Medium (24x24px) - default
<Spinner size="lg" />  // Large (32x32px)
```

**Props:**
- `size`: "sm" | "md" | "lg" (default: "md")
- `className`: Additional CSS classes

**Use cases:**
- Button loading states
- Inline loading indicators
- Small loading contexts

### 2. LoadingText Component

A combination of spinner and text for contextual loading messages.

```tsx
import { LoadingText } from '@/components/ui/loading'

// Usage
<LoadingText text="Loading..." />
<LoadingText text="Saving changes..." />
```

**Props:**
- `text`: Loading message (default: "Loading...")
- `className`: Additional CSS classes

**Use cases:**
- Card content loading
- Form submission states
- Component-level loading

### 3. CardLoading Component

A centered loading state for card components.

```tsx
import { CardLoading } from '@/components/ui/loading'

// Usage
<Card>
  <CardHeader>
    <CardTitle>Component Title</CardTitle>
  </CardHeader>
  <CardContent>
    <CardLoading text="Loading data..." />
  </CardContent>
</Card>
```

**Props:**
- `text`: Loading message (default: "Loading...")
- `className`: Additional CSS classes

**Use cases:**
- Card component loading states
- Data fetching in cards
- Component initialization

### 4. FullPageLoading Component

A full-screen loading state for page-level operations.

```tsx
import { FullPageLoading } from '@/components/ui/loading'

// Usage
<FullPageLoading text="Loading page..." />
```

**Props:**
- `text`: Loading message (default: "Loading...")
- `className`: Additional CSS classes

**Use cases:**
- Page transitions
- Initial page loads
- Suspense boundaries

### 5. Skeleton Component

A placeholder component for content that's loading.

```tsx
import { Skeleton } from '@/components/ui/skeleton'

// Usage
<Skeleton className="h-4 w-3/4" />
<Skeleton className="h-8 w-1/4" />
```

**Props:**
- Standard HTML div props
- Uses `animate-pulse` and `bg-muted` by default

**Use cases:**
- Content placeholders
- List item skeletons
- Form field placeholders

## Implementation Guidelines

### When to Use Each Component

1. **Spinner**: For button states and small inline loading
2. **LoadingText**: For component-level loading with context
3. **CardLoading**: For card content loading
4. **FullPageLoading**: For page-level loading
5. **Skeleton**: For content placeholders during loading

### Color Scheme

All loading components use the design system's color tokens:
- `text-muted-foreground` for text
- `bg-muted` for skeleton backgrounds
- Consistent with light/dark mode

### Animation

- **Spinners**: Use `animate-spin` for rotation
- **Skeletons**: Use `animate-pulse` for breathing effect
- **Smooth transitions**: All state changes should be smooth

## Migration Guide

### Before (Inconsistent)
```tsx
// Custom spinner with hardcoded colors
<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>

// Custom skeleton with hardcoded colors
<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>

// Inconsistent full-page loading
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
  <div className="text-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
    <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
  </div>
</div>
```

### After (Standardized)
```tsx
// Standardized spinner
<Spinner size="sm" />

// Standardized skeleton
<Skeleton className="h-4 w-3/4" />

// Standardized full-page loading
<FullPageLoading text="Loading..." />
```

## Examples by Component

### Button Loading States
```tsx
<Button disabled={loading}>
  {loading ? (
    <>
      <Spinner size="sm" className="mr-2" />
      Saving...
    </>
  ) : (
    'Save'
  )}
</Button>
```

### Card Loading States
```tsx
<Card>
  <CardHeader>
    <CardTitle>Data</CardTitle>
  </CardHeader>
  <CardContent>
    {isLoading ? (
      <CardLoading text="Loading data..." />
    ) : (
      <div>Content</div>
    )}
  </CardContent>
</Card>
```

### Skeleton Loading
```tsx
{isLoading ? (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-16" />
      </div>
    ))}
  </div>
) : (
  <div>Actual content</div>
)}
```

## Best Practices

1. **Always provide context**: Use descriptive loading text
2. **Be consistent**: Use the same loading pattern for similar operations
3. **Consider timing**: Use skeletons for longer loading times, spinners for quick operations
4. **Accessibility**: Loading states should be accessible to screen readers
5. **Performance**: Don't show loading states for operations under 200ms

## Accessibility

All loading components include proper ARIA attributes and are screen reader friendly:
- Loading text is announced to screen readers
- Spinners have appropriate ARIA labels
- Skeleton content is properly hidden from screen readers

## Future Enhancements

- Progress indicators for long-running operations
- Skeleton variations for different content types
- Loading state animations for better perceived performance 