# Project Structure

This document provides a comprehensive overview of the Prompt Manage project structure, explaining the organization of files and directories.

## Root Directory Structure

```
prompt-manage/
├── app/                    # Next.js 14 App Router
├── components/             # Reusable React components
├── lib/                    # Utility libraries and schemas
├── utils/                  # Utility functions
├── supabase/              # Database migrations and config
├── tests/                 # Test files
├── docs/                  # Project documentation
├── public/                # Static assets
└── Configuration files
```

## App Directory (`app/`)

The `app/` directory follows Next.js 14 App Router conventions:

```
app/
├── (auth)/                # Auth group routes
│   ├── callback/          # OAuth callback
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   └── confirm/          # Magic link confirmation
├── api/                   # API routes
│   └── prompts/          # Prompt-related APIs
├── dashboard/            # Dashboard pages
├── p/                    # Public prompt pages
├── u/                    # User profile pages
├── profile/              # User profile management
├── settings/             # User settings
├── about/                # About page
├── contact/              # Contact page
├── docs/                 # Documentation pages
├── legal/                # Legal pages
├── privacy/              # Privacy policy
├── terms/                # Terms of service
├── globals.css           # Global styles
├── layout.tsx            # Root layout
├── page.tsx              # Homepage
└── sitemap.ts            # Sitemap generation
```

### Route Groups

- **`(auth)`**: Authentication-related pages grouped together
- **`api`**: Backend API endpoints
- **`dashboard`**: User dashboard and prompt management
- **`p`**: Public prompt viewing (short for "prompt")
- **`u`**: User profiles (short for "user")

## Components Directory (`components/`)

Reusable React components organized by functionality:

```
components/
├── ui/                    # shadcn/ui components
│   ├── accordion.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── command.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── multi-select.tsx
│   ├── scroll-area.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── switch.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toast.tsx
│   ├── toaster.tsx
│   ├── tooltip.tsx
│   └── use-toast.ts
├── CommandPalette.tsx     # Global command palette
├── CopyButton.tsx         # Copy to clipboard button
├── Footer.tsx             # Site footer
├── Header.tsx             # Site header
├── Layout.tsx             # Page layout wrapper
├── LoginForm.tsx          # Login form component
├── PromptContext.tsx      # Prompt context provider
├── PromptForm.tsx         # Prompt creation/editing form
├── PromptsTable.tsx       # Prompts display table
├── providers.tsx          # React providers
├── RelatedPrompts.tsx     # Related prompts component
├── SEO.tsx                # SEO component
├── Sidebar.tsx            # Dashboard sidebar
├── SignupForm.tsx         # Signup form component
├── Tag.tsx                # Tag display component
├── theme-provider.tsx     # Theme provider
└── ThemeHtmlScript.tsx    # Theme script for SSR
```

### Component Categories

- **UI Components**: shadcn/ui base components
- **Form Components**: Authentication and data entry forms
- **Layout Components**: Page structure and navigation
- **Feature Components**: Specific feature implementations
- **Utility Components**: Reusable utility components

## Library Directory (`lib/`)

Utility libraries and type definitions:

```
lib/
├── lib/                   # Nested lib directory
│   └── schemas/          # Zod validation schemas
│       └── prompt.ts     # Prompt schema
├── schemas/              # Main schemas directory
│   └── prompt.ts         # Prompt validation schema
└── utils.ts              # Utility functions
```

## Utils Directory (`utils/`)

Utility functions and configurations:

```
utils/
└── supabase/             # Supabase client configuration
    ├── client.ts         # Client-side Supabase client
    └── server.ts         # Server-side Supabase client
```

## Supabase Directory (`supabase/`)

Database configuration and migrations:

```
supabase/
├── config.toml           # Supabase configuration
└── migrations/           # Database migrations
    └── 20240320000000_initial_schema.sql
```

## Tests Directory (`tests/`)

Test files for the application:

```
tests/
├── login.spec.ts         # Login flow tests
├── prompt-editing.spec.ts # Prompt editing tests
└── related-prompts.spec.ts # Related prompts tests
```

## Documentation Directory (`docs/`)

Project documentation organized by category:

```
docs/
├── getting-started/      # Getting started guides
├── architecture/         # Architecture and methodology
├── development/          # Development guides
├── ui-ux/               # UI/UX documentation
├── technical/           # Technical documentation
├── features/            # Feature documentation
└── README.md            # Documentation index
```

## Public Directory (`public/`)

Static assets served by Next.js:

```
public/
├── favicon.svg          # Site favicon
├── file.svg             # File icon
├── globe.svg            # Globe icon
├── logo.svg             # Site logo
├── next.svg             # Next.js logo
├── og-image.svg         # Open Graph image
├── robots.txt           # Robots.txt file
├── vercel.svg           # Vercel logo
└── window.svg           # Window icon
```

## Configuration Files

### Root Configuration

- **`package.json`**: Dependencies and scripts
- **`package-lock.json`**: Locked dependency versions
- **`tsconfig.json`**: TypeScript configuration
- **`next.config.js`**: Next.js configuration
- **`next.config.ts`**: TypeScript Next.js configuration
- **`tailwind.config.ts`**: Tailwind CSS configuration
- **`postcss.config.mjs`**: PostCSS configuration
- **`eslint.config.mjs`**: ESLint configuration
- **`playwright.config.ts`**: Playwright test configuration
- **`components.json`**: shadcn/ui configuration

### Environment and Git

- **`.env.local`**: Local environment variables (not in git)
- **`.gitignore`**: Git ignore patterns
- **`.gitattributes`**: Git attributes
- **`.prettierrc`**: Prettier configuration
- **`.prettierignore`**: Prettier ignore patterns
- **`.nvmrc`**: Node.js version specification
- **`.npmrc`**: npm configuration

## File Naming Conventions

### React Components

- **PascalCase**: `ComponentName.tsx`
- **Descriptive names**: `PromptForm.tsx`, `RelatedPrompts.tsx`
- **Feature-specific**: `LoginForm.tsx`, `SignupForm.tsx`

### API Routes

- **kebab-case**: `[id]/route.ts`
- **Nested structure**: `prompts/[id]/share/route.ts`
- **HTTP methods**: GET, POST, PUT, DELETE in same file

### Database Migrations

- **Timestamp prefix**: `20240320000000_initial_schema.sql`
- **Descriptive names**: `add_user_profiles.sql`
- **Versioned**: `v1_0_0_initial.sql`

### Test Files

- **`.spec.ts` suffix**: `login.spec.ts`
- **Feature-based**: `prompt-editing.spec.ts`
- **E2E focused**: End-to-end user flows

## Import Organization

### Absolute Imports

```typescript
// Components
import { Button } from '@/components/ui/button';
import { PromptForm } from '@/components/PromptForm';

// Utilities
import { createClient } from '@/utils/supabase/client';
import { promptSchema } from '@/lib/schemas/prompt';

// Types
import type { Prompt } from '@/lib/types';
```

### Relative Imports

```typescript
// Same directory
import { Header } from './Header';
import { Footer } from './Footer';

// Parent directory
import { Layout } from '../Layout';
```

## Code Organization Principles

### 1. Separation of Concerns

- **UI Components**: Pure presentation components
- **Business Logic**: API routes and utilities
- **Data Layer**: Database operations and schemas
- **Configuration**: Environment and build configs

### 2. Feature-Based Organization

- **Related files grouped**: Components, APIs, and tests for features
- **Clear boundaries**: Each feature is self-contained
- **Shared utilities**: Common code in utils and lib

### 3. Scalability

- **Modular structure**: Easy to add new features
- **Consistent patterns**: Predictable file locations
- **Clear naming**: Self-documenting file names

### 4. Maintainability

- **Documentation**: Comprehensive docs for each area
- **Testing**: Tests alongside implementation
- **Type safety**: TypeScript throughout the codebase

## Development Workflow

### Adding New Features

1. **Create feature directory** in appropriate location
2. **Add components** in `components/` or feature-specific location
3. **Add API routes** in `app/api/` following REST conventions
4. **Add database migrations** in `supabase/migrations/`
5. **Add tests** in `tests/` directory
6. **Update documentation** in `docs/` directory

### File Organization Checklist

- [ ] File is in the correct directory
- [ ] File name follows conventions
- [ ] Imports are organized properly
- [ ] Component is properly typed
- [ ] Tests are included
- [ ] Documentation is updated

## Best Practices

### 1. File Organization

- Keep related files close together
- Use consistent naming conventions
- Group by feature when possible
- Separate concerns clearly

### 2. Import Management

- Use absolute imports for shared code
- Use relative imports for closely related files
- Organize imports by type (React, third-party, local)
- Avoid deep nesting in import paths

### 3. Component Structure

- One component per file
- Export components as default when appropriate
- Use named exports for utilities and types
- Keep components focused and single-purpose

### 4. API Organization

- Group related endpoints together
- Use RESTful conventions
- Keep route handlers focused
- Implement proper error handling

---

_Last updated: December 2024_
