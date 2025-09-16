# Design System

This document outlines the design system used in the Prompt Manage project, including design tokens, components, and design principles.

## Design Philosophy

Our design system is built on the following principles:

- **Consistency**: Uniform design patterns across the application
- **Accessibility**: WCAG 2.1 AA compliance for inclusive design
- **Responsiveness**: Mobile-first approach with progressive enhancement
- **Performance**: Optimized for fast loading and smooth interactions
- **Maintainability**: Reusable components with clear documentation

## Design Tokens

### Color Palette

#### Primary Colors

```css
/* Primary Brand Colors */
--primary-50: #eff6ff --primary-100: #dbeafe --primary-200: #bfdbfe
  --primary-300: #93c5fd --primary-400: #60a5fa --primary-500: #3b82f6
  /* Main primary color */ --primary-600: #2563eb --primary-700: #1d4ed8
  --primary-800: #1e40af --primary-900: #1e3a8a --primary-950: #172554;
```

#### Neutral Colors

```css
/* Gray Scale */
--gray-50: #f9fafb --gray-100: #f3f4f6 --gray-200: #e5e7eb --gray-300: #d1d5db
  --gray-400: #9ca3af --gray-500: #6b7280 --gray-600: #4b5563
  --gray-700: #374151 --gray-800: #1f2937 --gray-900: #111827
  --gray-950: #030712;
```

#### Semantic Colors

```css
/* Success */
--success-50: #f0fdf4 --success-500: #22c55e --success-600: #16a34a
  /* Warning */ --warning-50: #fffbeb --warning-500: #f59e0b
  --warning-600: #d97706 /* Error */ --error-50: #fef2f2 --error-500: #ef4444
  --error-600: #dc2626 /* Info */ --info-50: #eff6ff --info-500: #3b82f6
  --info-600: #2563eb;
```

### Typography

#### Font Family

```css
/* Font Stack */
--font-sans:
  ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
  Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
  sans-serif --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Consolas,
  'Liberation Mono', Menlo, monospace;
```

#### Font Sizes

```css
/* Text Sizes */
--text-xs: 0.75rem /* 12px */ --text-sm: 0.875rem /* 14px */ --text-base: 1rem
  /* 16px */ --text-lg: 1.125rem /* 18px */ --text-xl: 1.25rem /* 20px */
  --text-2xl: 1.5rem /* 24px */ --text-3xl: 1.875rem /* 30px */
  --text-4xl: 2.25rem /* 36px */ --text-5xl: 3rem /* 48px */;
```

#### Semantic Type Scale

```css
/* CSS custom properties */
--font-size-xs: 0.75rem;   /* 12 */
--font-size-sm: 0.875rem;  /* 14 */
--font-size-base: 1rem;    /* 16 */
--font-size-lg: 1.125rem;  /* 18 */
--font-size-xl: 1.25rem;   /* 20 */
--font-size-2xl: 1.5rem;   /* 24 */
--font-size-3xl: 1.875rem; /* 30 */
--font-size-4xl: 2.25rem;  /* 36 */
--line-height-tight: 1.2;
--line-height-snug: 1.3;
--line-height-normal: 1.5;
```

#### Font Weights

```css
/* Font Weights */
--font-light: 300 --font-normal: 400 --font-medium: 500 --font-semibold: 600
  --font-bold: 700 --font-extrabold: 800;
```

### Spacing

#### Spacing Scale

```css
/* Spacing Tokens */
--space-0: 0px --space-1: 0.25rem /* 4px */ --space-2: 0.5rem /* 8px */
  --space-3: 0.75rem /* 12px */ --space-4: 1rem /* 16px */ --space-5: 1.25rem
  /* 20px */ --space-6: 1.5rem /* 24px */ --space-8: 2rem /* 32px */
  --space-10: 2.5rem /* 40px */ --space-12: 3rem /* 48px */ --space-16: 4rem
  /* 64px */ --space-20: 5rem /* 80px */ --space-24: 6rem /* 96px */;
```

### Border Radius

```css
/* Border Radius */
--radius-none: 0px --radius-sm: 0.125rem /* 2px */ --radius-base: 0.25rem
  /* 4px */ --radius-md: 0.375rem /* 6px */ --radius-lg: 0.5rem /* 8px */
  --radius-xl: 0.75rem /* 12px */ --radius-2xl: 1rem /* 16px */
  --radius-full: 9999px;
```

### Shadows

```css
/* Shadow Tokens */
--shadow-sm:
  0 1px 2px 0 rgb(0 0 0 / 0.05) --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1),
  0 1px 2px -1px rgb(0 0 0 / 0.1) --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1),
  0 2px 4px -2px rgb(0 0 0 / 0.1) --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1),
  0 4px 6px -4px rgb(0 0 0 / 0.1) --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1),
  0 8px 10px -6px rgb(0 0 0 / 0.1);
```

### Motion & Interaction

```css
/* Motion tokens */
--motion-duration-fast: 120ms;
--motion-duration-normal: 180ms;
--motion-duration-slow: 240ms;
--motion-ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
--motion-ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
```

Tailwind mappings:

- ease: `ease-standard`, `ease-emphasized`
- duration: `duration-fast`, `duration-normal`, `duration-slow`
- elevation: `elevate-1` … `elevate-4`
- focus: use `focus-visible:ring-[var(--focus-ring-width)]` and `ring-ring/50`

## Component Library

### Base Components

#### Button

```typescript
// Button variants
<Button variant="default">Default Button</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Button sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```
Usage notes:

- Subtle lift on hover and tokenized focus rings; never hardcode colors.

#### Input

```typescript
// Input types
<Input type="text" placeholder="Enter text" />
<Input type="email" placeholder="Enter email" />
<Input type="password" placeholder="Enter password" />

// Input states
<Input disabled placeholder="Disabled input" />
<Input className="error" placeholder="Error state" />
```
Usage notes:

- Defaults to `bg-surface-primary`; uses semantic focus rings.

#### Card

```typescript
// Card usage
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```
Usage notes:

- Uses `bg-surface-elevated` and `shadow` tokens; add `elevate-2` on hover as needed.

### Form Components

#### Form

```typescript
// Form with validation
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="Enter email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

#### Select

```typescript
// Select component
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Navigation Components

#### Command Palette

```typescript
// Global command palette
<Command>
  <CommandInput placeholder="Search commands..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Create Prompt</CommandItem>
      <CommandItem>View Dashboard</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

#### Dropdown Menu

```typescript
// Dropdown menu
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Layout Components

### Page Layout

```typescript
// Standard page layout
<Layout>
  <Header />
  <main className="flex-1">
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  </main>
  <Footer />
</Layout>
```

### Dashboard Layout

```typescript
// Dashboard with sidebar
<div className="flex min-h-screen">
  <Sidebar />
  <main className="flex-1">
    <div className="p-6">
      {children}
    </div>
  </main>
</div>
```

## Responsive Design

### Breakpoints

```css
/* Responsive Breakpoints */
--breakpoint-sm: 640px --breakpoint-md: 768px --breakpoint-lg: 1024px
  --breakpoint-xl: 1280px --breakpoint-2xl: 1536px;
```

### Responsive Utilities

```typescript
// Responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>

<div className="text-sm md:text-base lg:text-lg">
  {/* Responsive text */}
</div>

<div className="p-4 md:p-6 lg:p-8">
  {/* Responsive padding */}
</div>
```

## Dark Mode

### Theme Variables

```css
/* Light Mode */
:root {
  --background: 0 0% 100% --foreground: 222.2 84% 4.9% --card: 0 0% 100%
    --card-foreground: 222.2 84% 4.9% --popover: 0 0% 100%
    --popover-foreground: 222.2 84% 4.9% --primary: 221.2 83.2% 53.3%
    --primary-foreground: 210 40% 98% --secondary: 210 40% 96%
    --secondary-foreground: 222.2 84% 4.9% --muted: 210 40% 96%
    --muted-foreground: 215.4 16.3% 46.9% --accent: 210 40% 96%
    --accent-foreground: 222.2 84% 4.9% --destructive: 0 84.2% 60.2%
    --destructive-foreground: 210 40% 98% --border: 214.3 31.8% 91.4%
    --input: 214.3 31.8% 91.4% --ring: 221.2 83.2% 53.3% --radius: 0.5rem;
}

/* Dark Mode */
.dark {
  --background: 222.2 84% 4.9% --foreground: 210 40% 98% --card: 222.2 84% 4.9%
    --card-foreground: 210 40% 98% --popover: 222.2 84% 4.9%
    --popover-foreground: 210 40% 98% --primary: 217.2 91.2% 59.8%
    --primary-foreground: 222.2 84% 4.9% --secondary: 217.2 32.6% 17.5%
    --secondary-foreground: 210 40% 98% --muted: 217.2 32.6% 17.5%
    --muted-foreground: 215 20.2% 65.1% --accent: 217.2 32.6% 17.5%
    --accent-foreground: 210 40% 98% --destructive: 0 62.8% 30.6%
    --destructive-foreground: 210 40% 98% --border: 217.2 32.6% 17.5%
    --input: 217.2 32.6% 17.5% --ring: 224.3 76.3% 94.1%;
}
```

### Theme Provider

```typescript
// Theme provider usage
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

## Animation and Transitions

### Transition Classes

```css
/* Transition utilities */
--transition-all:
  all 0.15s cubic-bezier(0.4, 0, 0.2, 1) --transition-colors: color 0.15s
    ease-in-out,
  background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
  text-decoration-color 0.15s ease-in-out, fill 0.15s ease-in-out,
  stroke 0.15s ease-in-out --transition-opacity: opacity 0.15s ease-in-out
    --transition-shadow: box-shadow 0.15s ease-in-out
    --transition-transform: transform 0.15s ease-in-out;
```

### Animation Classes

```typescript
// Animation utilities
<div className="animate-in fade-in duration-300">
  {/* Fade in animation */}
</div>

<div className="animate-in slide-in-from-top duration-300">
  {/* Slide in from top */}
</div>

<div className="animate-in zoom-in duration-300">
  {/* Zoom in animation */}
</div>
```

## Accessibility

### ARIA Labels

```typescript
// Proper ARIA usage
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

<Input aria-describedby="email-error" />
<div id="email-error" className="text-red-600">
  Please enter a valid email address
</div>
```

### Focus Management

```typescript
// Focus management
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Prompt</DialogTitle>
    </DialogHeader>
    <form>
      <Input autoFocus /> {/* Auto focus on first input */}
    </form>
  </DialogContent>
</Dialog>
```

### Keyboard Navigation

```typescript
// Keyboard navigation support
<div role="button" tabIndex={0} onKeyDown={handleKeyDown}>
  Clickable div with keyboard support
</div>
```

## Icon System

### Lucide Icons

```typescript
// Icon usage
import { Plus, Edit, Trash2, Search } from 'lucide-react'

<Button>
  <Plus className="h-4 w-4 mr-2" />
  Add Item
</Button>

<Search className="h-5 w-5 text-gray-400" />
```

### Icon Guidelines

- Use consistent icon sizes (16px, 20px, 24px)
- Maintain proper spacing around icons
- Use semantic colors for icons
- Ensure icons are accessible with proper labels

## Best Practices

### Component Design

1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition**: Build complex components from simple ones
3. **Props Interface**: Define clear prop interfaces with TypeScript
4. **Default Values**: Provide sensible defaults for optional props
5. **Error Boundaries**: Handle errors gracefully

### Styling Guidelines

1. **Utility First**: Use Tailwind utility classes when possible
2. **Custom CSS**: Use custom CSS for complex animations or layouts
3. **CSS Variables**: Use CSS custom properties for theme values
4. **Responsive Design**: Design mobile-first with progressive enhancement
5. **Performance**: Optimize for performance with efficient CSS

### Accessibility Standards

1. **WCAG 2.1 AA**: Follow WCAG 2.1 AA guidelines
2. **Semantic HTML**: Use proper HTML semantics
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **Screen Readers**: Test with screen readers and provide proper labels
5. **Color Contrast**: Maintain sufficient color contrast ratios

### Performance Considerations

1. **Bundle Size**: Keep component bundle size minimal
2. **Lazy Loading**: Lazy load components when appropriate
3. **Optimization**: Optimize images and assets
4. **Caching**: Implement proper caching strategies
5. **Monitoring**: Monitor performance metrics

## Component Documentation

### Storybook Integration

```typescript
// Component story example
export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants and sizes.',
      },
    },
  },
} as Meta

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
}
```

### Usage Examples

```typescript
// Common usage patterns
// 1. Primary action button
<Button variant="default" size="lg">
  Create Prompt
</Button>

// 2. Secondary action button
<Button variant="outline" size="default">
  Cancel
</Button>

// 3. Destructive action button
<Button variant="destructive" size="sm">
  Delete
</Button>

// 4. Icon button
<Button variant="ghost" size="sm">
  <Edit className="h-4 w-4" />
</Button>
```

---

_Last updated: December 2024_
