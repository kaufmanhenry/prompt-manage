# Prompt Manage Design System

## Design Philosophy

Prompt Manage empowers users to organize and manage AI prompts efficiently. The design system prioritizes **clarity, efficiency, and consistency** to help users focus on their work without visual distractions.

## Brand Identity

### Color Palette

**Primary Brand Colors**

- Emerald: `emerald-600` (#10b981) - Primary actions, active states, brand moments
- Supporting gradient: emerald → teal → sky (used sparingly for hero/brand elements)

**Semantic Colors**

- Success: `emerald-600`
- Destructive: `red-600`
- Warning: `amber-500`
- Info: `blue-500`

**Neutral Palette**

- Background (light): `gray-50`
- Background (dark): `gray-900`
- Text primary: `gray-900` / `gray-50`
- Text secondary: `gray-600` / `gray-400`
- Borders: `gray-200` / `gray-800`
- Subtle backgrounds: `gray-100` / `gray-800`

### Typography

**Font Families**

- Sans-serif: DM Sans (400, 500, 600, 700)
- Monospace: DM Mono (400, 500)

**Type Scale**

- **Display (Hero)**: text-4xl (36px) / text-5xl (48px) / text-6xl (60px)
  - Use: Landing page heroes
  - Weight: font-extrabold (800)
  - Line height: leading-tight (1.2)

- **H1 (Page Title)**: text-3xl (30px)
  - Use: Main page headers
  - Weight: font-bold (700)
  - Line height: leading-tight
  - Tracking: tracking-tight

- **H2 (Section Header)**: text-2xl (24px)
  - Use: Section headers, card titles
  - Weight: font-bold (700)
  - Line height: leading-snug (1.375)

- **H3 (Subsection)**: text-xl (20px)
  - Use: Subsections, prominent labels
  - Weight: font-semibold (600)

- **H4 (Card Header)**: text-lg (18px)
  - Use: Card headers, list titles
  - Weight: font-semibold (600)

- **Body Large**: text-lg (18px)
  - Use: Intro paragraphs, featured content
  - Weight: font-normal (400)
  - Line height: leading-relaxed (1.625)

- **Body**: text-base (16px)
  - Use: Standard body text
  - Weight: font-normal (400)
  - Line height: leading-normal (1.5)

- **Body Small**: text-sm (14px)
  - Use: Secondary information, labels
  - Weight: font-normal (400) / font-medium (500)
  - Line height: leading-normal

- **Caption**: text-xs (12px)
  - Use: Meta information, timestamps, tags
  - Weight: font-normal (400) / font-medium (500)

### Spacing Scale

Use Tailwind's default spacing scale consistently:

- **xs**: gap-1, p-1 (4px) - Tight inline spacing
- **sm**: gap-2, p-2 (8px) - Compact spacing
- **md**: gap-4, p-4 (16px) - Default spacing
- **lg**: gap-6, p-6 (24px) - Generous spacing
- **xl**: gap-8, p-8 (32px) - Section spacing
- **2xl**: gap-12, p-12 (48px) - Major section breaks

**Component Spacing Standards**

- Card padding: `p-6` (default), `p-4` (compact stat cards)
- Page content padding: `p-8`
- Section vertical spacing: `space-y-8`
- Inline element gaps: `gap-2` (buttons, badges, icon+text)
- Form field spacing: `space-y-4`

**Grid Spacing Standards**

- **Stat Cards** (dashboard metrics): `gap-4` - Tighter spacing for data density
- **Content Cards** (features, workflows): `gap-6` - Balanced spacing for readability
- **Content Sections** (large cards): `gap-8` - Generous spacing for visual hierarchy
- **Responsive grids**: Use consistent gaps across breakpoints unless reducing for mobile

Examples:

```tsx
// Stat cards - tight 4-column grid
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

// Feature cards - balanced 3-column grid
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

// Content sections - spacious 2-column grid
<div className="grid gap-8 lg:grid-cols-2">
```

### Border Radius

- **sm**: `rounded-md` (6px) - Inputs, small buttons
- **default**: `rounded-lg` (8px) - Standard buttons, tabs, icon containers
- **lg**: `rounded-xl` (12px) - **ALL CARDS** - Feature cards, modal windows, content cards
- **full**: `rounded-full` - Pills, badges, avatars

**Card Border Radius Standard**

- Use `rounded-xl` for ALL card-like components
- Consistent across marketing pages, dashboard, and app pages
- Creates cohesive, modern aesthetic

### Shadows & Elevation

Use design tokens from globals.css:

- **Level 1**: `shadow-sm` - Subtle lift (inputs, small cards)
- **Level 2**: `shadow` - Standard cards (default state)
- **Level 3**: `shadow-md` - **Hover states**, dropdowns, interactive cards
- **Level 4**: `shadow-lg` - Modals, popovers, overlays

**Card Shadow Standards**

- Static cards: No shadow or `shadow-sm` (rely on borders)
- Interactive cards: `hover:shadow-md` for lift effect
- Dashboard stat cards: No shadow (use Card component default)
- Marketing/feature cards: `hover:shadow-md` on hover

### Icons

**Icon Sizing Standards**

- **Navigation/Inline**: `h-4 w-4` - Sidebar, buttons, inline with text
- **Section Headers**: `h-5 w-5` - Card titles, page section headers
- **Stat Indicators**: `h-4 w-4` - Corner icons in stat cards
- **Feature Icons**: `h-5 w-5` or `h-6 w-6` - Inside icon containers
- **Empty States**: `h-12 w-12` - Large decorative icons
- **Logos**: `h-6 w-6` - Brand/company logos

**Icon Patterns**

1. **Plain Icons** (Functional/Data)
   - Use for: Navigation, stats, inline indicators, section headers
   - Style: `text-muted-foreground` or `text-current`
   - No background container

   ```tsx
   <FileText className="h-4 w-4 text-muted-foreground" />
   ```

2. **Icon Containers** (Feature/Marketing)
   - Use for: Feature showcases, workflow steps, marketing content
   - Style: Emerald background with icon
   - Sizes: `h-10 w-10` (default) or `h-12 w-12` (emphasis)

   ```tsx
   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
     <Megaphone className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
   </div>
   ```

3. **Numbered Badges** (Rankings/Steps)
   - Use for: Ordered lists, steps, rankings
   - Style: Primary color background with number
   ```tsx
   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-medium text-primary">
     1
   </div>
   ```

**Icon Usage Guidelines**

- **Consistency**: Use the same pattern within similar contexts
- **Color**: Emerald for brand/features, muted for functional
- **Alignment**: Vertically center with adjacent text
- **Spacing**: `gap-2` between icon and text (inline), `gap-3` for larger spacing

## Component Patterns

### Buttons

**Primary Button**

```tsx
<Button size="default">Primary Action</Button>
// Classes: bg-primary text-primary-foreground hover:bg-primary/90
```

**Secondary Button**

```tsx
<Button variant="outline">Secondary Action</Button>
// Classes: border border-input bg-background hover:bg-accent
```

**Ghost Button**

```tsx
<Button variant="ghost">Tertiary Action</Button>
// Classes: hover:bg-accent hover:text-accent-foreground
```

**Sizes**

- sm: `h-8 px-3 text-sm`
- default: `h-10 px-4 py-2`
- lg: `h-11 px-8 text-base`

### Cards

Cards are a primary component for grouping related content. Consistency in card styling is critical for a professional appearance.

**Standard Card Pattern (Static)**

```tsx
<div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
  {/* Content */}
</div>
```

- Use for: Workflow cards, feature showcases, static content
- Border: `border-gray-200` / `dark:border-gray-800`
- Background: `bg-white` / `dark:bg-gray-900`
- Padding: `p-6` (default), `p-4` (compact)
- Radius: `rounded-xl` (always)

**Interactive Card Pattern (Hover Effects)**

```tsx
<Link href="/path" className="card-interactive">
  {/* Content */}
</Link>

// Or manually:
className="rounded-xl border border-gray-200 bg-white p-6
           transition-all hover:border-emerald-300 hover:shadow-md
           dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-700"
```

- Use for: Clickable cards, links, navigation elements
- Adds: `transition-all` for smooth animations
- Hover: Border becomes emerald, shadow lifts to `shadow-md`

**Dashboard Stat Card (shadcn/ui Card)**

```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Title</CardTitle>
    <Icon className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-xs text-muted-foreground">Description</p>
  </CardContent>
</Card>
```

- Use for: Dashboard metrics, statistics, KPIs
- Uses shadcn/ui Card component with default styling
- Icon: Top-right corner, `h-4 w-4 text-muted-foreground`
- Value: `text-2xl font-bold`
- Description: `text-xs text-muted-foreground`

**Compact Card Pattern**

```tsx
<div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  {/* Smaller content */}
</div>
```

- Use for: Metric tiles, compact stat displays
- Padding: `p-4` instead of `p-6`

**Card Grid Patterns**

Use utility classes for consistent grid layouts:

```tsx
// Stat cards - 4 columns, tight spacing
<div className="grid-stat-cards">
  {statCards}
</div>
// Expands to: grid gap-4 md:grid-cols-2 lg:grid-cols-4

// Feature cards - 3 columns, balanced spacing
<div className="grid-feature-cards">
  {featureCards}
</div>
// Expands to: grid gap-6 md:grid-cols-2 lg:grid-cols-3

// Content cards - 2 columns, generous spacing
<div className="grid-content-cards">
  {contentCards}
</div>
// Expands to: grid gap-8 md:grid-cols-2

// Content cards - 3 columns
<div className="grid-content-3col">
  {contentCards}
</div>
// Expands to: grid gap-6 md:grid-cols-2 lg:grid-cols-3
```

**Card Best Practices**

- ✓ Always use `rounded-xl` for cards
- ✓ Use `p-6` for default cards, `p-4` for compact
- ✓ Use emerald borders on hover for interactive cards
- ✓ Apply `hover:shadow-md` for lift effect on clickables
- ✓ Keep card content hierarchy consistent (icon, title, description, action)
- ✗ Don't mix border radius sizes
- ✗ Don't use `rounded-lg` for cards (reserved for buttons/tabs)
- ✗ Don't add shadows without hover states unless modal/overlay

### Navigation Tabs

**Active State**

```tsx
className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
           bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
```

**Inactive State**

```tsx
className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
           text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
```

### Form Inputs

```tsx
className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm
           focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900"
```

### Badges/Pills

```tsx
<Badge variant="outline">Label</Badge>
// Small: text-xs px-2 py-0.5
// Default: text-sm px-2.5 py-0.5
```

## Layout Patterns

### Dashboard Layout

```tsx
<div className="flex h-screen">
  <Sidebar />
  <main className="flex-1 overflow-y-auto bg-accent/50 p-8">
    <div className="mx-auto max-w-7xl space-y-8">{/* Page content */}</div>
  </main>
</div>
```

### Public Page Layout

```tsx
<div className="min-h-screen bg-background">
  <Header />
  <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{/* Page content */}</main>
</div>
```

### Content Width Standards

- **Default container**: `max-w-7xl` (1280px)
- **Narrow content**: `max-w-3xl` (768px) - Text-heavy pages, forms
- **Wide content**: `max-w-[90rem]` (1440px) - Marketing pages only

## Animation & Interaction

### Transitions

- **Standard**: `transition-colors` (200ms) - Hover states, theme changes
- **Emphasized**: `transition-all` (200ms) - Cards, interactive elements
- Use easing: `ease-in-out` (default Tailwind)

### Interactive States

- **Hover**: Subtle background change or shadow lift
- **Active/Selected**: Emerald background + emerald text
- **Focus**: `focus:ring-2 focus:ring-primary focus:outline-none`
- **Disabled**: `opacity-50 cursor-not-allowed`

## Accessibility

### Focus States

Always include visible focus indicators:

```tsx
focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
```

### Color Contrast

- Ensure 4.5:1 contrast ratio for body text
- Ensure 3:1 contrast ratio for large text (18px+)
- Use semantic colors with sufficient contrast

### Text Sizing

- Minimum body text: 14px (text-sm)
- Preferred body text: 16px (text-base)
- Never use text smaller than 12px except for decorative purposes

## Best Practices

### DO ✓

- Use design tokens from tailwind.config and globals.css
- Follow the spacing scale consistently
- Use emerald for active states and primary actions
- Keep card padding at p-6, page padding at p-8
- Use rounded-lg for most interactive elements
- Use font-medium for navigation, font-semibold for headings
- Use text-sm for secondary UI, text-base for content

### DON'T ✗

- Mix different spacing values arbitrarily (p-3, p-5, p-7)
- Use multiple shades of the same color inconsistently
- Create one-off button or card variants
- Use pixel values directly (use Tailwind tokens)
- Use too many font weights in one view
- Override Tailwind spacing without good reason
- Use colored backgrounds for every card

## Implementation Checklist

When creating a new component or page:

- [ ] Use correct typography scale (H1 for page title, H2 for sections)
- [ ] Apply consistent spacing (p-8 for main content, gap-8 for sections)
- [ ] Use emerald for active/selected states
- [ ] Include hover and focus states
- [ ] Follow the layout pattern (dashboard vs public)
- [ ] Use rounded-lg for interactive elements
- [ ] Apply proper text colors (gray-900/gray-600 for light mode)
- [ ] Test in dark mode
- [ ] Ensure responsive behavior
- [ ] Verify accessibility (focus states, contrast, sizing)
