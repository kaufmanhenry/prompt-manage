# Quick Start Guide: Multi-Agent Development in Cursor

This guide provides a quick reference for using the multi-agent methodology to develop the Prompt Manage MVP in Cursor.

## 🚀 Getting Started

### 1. Setup Your Environment

```bash
# Ensure you have the required tools
node --version  # Should be 18+
npm --version   # Should be 6+
supabase --version  # Install if not available

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 2. Choose Your Agent Role

Based on the task you're working on, select the appropriate agent:

| Task Type            | Agent to Use                | Key Files                              |
| -------------------- | --------------------------- | -------------------------------------- |
| **Project Planning** | Project Manager             | `AGENT_METHODOLOGY.md`, `package.json` |
| **UI Components**    | Frontend Development        | `app/`, `components/`                  |
| **API Development**  | Backend Development         | `app/api/`, `utils/supabase/`          |
| **Database Changes** | Database & Schema           | `supabase/migrations/`, `lib/schemas/` |
| **Authentication**   | Authentication & Security   | `app/auth/`, `middleware.ts`           |
| **Testing**          | Testing & Quality Assurance | `tests/`, `playwright.config.ts`       |
| **UI/UX Polish**     | UI/UX Enhancement           | `components/ui/`, `app/globals.css`    |

### 3. Use Agent Prompts

1. **Copy the appropriate agent prompt** from `AGENT_PROMPTS.md`
2. **Paste it into Cursor** before starting your work
3. **Reference the methodology** in `AGENT_METHODOLOGY.md` for context
4. **Follow the collaboration workflow** when working with other agents

## 📋 Common Workflows

### Adding a New Feature

1. **Start with Project Manager Agent**

   ```
   Copy: Project Manager Agent prompt
   Task: Define feature requirements and scope
   ```

2. **Database changes needed?**

   ```
   Copy: Database & Schema Agent prompt
   Task: Create migration and update schema
   ```

3. **Backend API needed?**

   ```
   Copy: Backend Development Agent prompt
   Task: Create API endpoints
   ```

4. **Frontend UI needed?**

   ```
   Copy: Frontend Development Agent prompt
   Task: Create React components
   ```

5. **Testing required?**

   ```
   Copy: Testing & Quality Assurance Agent prompt
   Task: Write tests and validate functionality
   ```

6. **UI/UX polish needed?**
   ```
   Copy: UI/UX Enhancement Agent prompt
   Task: Add animations and improve UX
   ```

### Fixing a Bug

1. **Identify the bug type**:
   - Frontend bug → Frontend Development Agent
   - Backend bug → Backend Development Agent
   - Database issue → Database & Schema Agent
   - Security issue → Authentication & Security Agent

2. **Use the appropriate agent prompt**

3. **Test the fix**:
   ```
   Copy: Testing & Quality Assurance Agent prompt
   Task: Verify the bug is fixed
   ```

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Database operations
supabase db push    # Push migrations
supabase db reset   # Reset database
supabase db diff    # Generate migration
```

## 📁 Key File Locations

### Frontend Development

- **Pages**: `app/` directory
- **Components**: `components/` directory
- **UI Library**: `components/ui/`
- **Styles**: `app/globals.css`, `tailwind.config.ts`

### Backend Development

- **API Routes**: `app/api/` directory
- **Database Client**: `utils/supabase/`
- **Validation**: `lib/schemas/`
- **Middleware**: `middleware.ts`

### Database & Schema

- **Migrations**: `supabase/migrations/`
- **Config**: `supabase/config.toml`
- **Schemas**: `lib/schemas/`

### Testing

- **E2E Tests**: `tests/` directory
- **Config**: `playwright.config.ts`
- **Linting**: `eslint.config.mjs`

## 🔄 Agent Collaboration Examples

### Example 1: Adding User Profiles

**Project Manager Agent**:

- Define profile requirements (display name, bio, avatar)
- Coordinate with Database Agent for schema changes

**Database & Schema Agent**:

```sql
-- Migration: add_user_profiles.sql
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS avatar_url text;
```

**Backend Development Agent**:

```typescript
// app/api/profile/route.ts
export async function PUT(request: NextRequest) {
  // Update user profile logic
}
```

**Frontend Development Agent**:

```typescript
// components/ProfileForm.tsx
export function ProfileForm() {
  // Profile form component
}
```

### Example 2: Adding Search Filters

**Project Manager Agent**:

- Define filter requirements (tags, models, date range)

**Backend Development Agent**:

```typescript
// app/api/prompts/search/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tags = searchParams.get('tags')?.split(',')
  const model = searchParams.get('model')
  // Search logic with filters
}
```

**Frontend Development Agent**:

```typescript
// components/SearchFilters.tsx
export function SearchFilters() {
  // Filter UI components
}
```

## 🎯 Best Practices

### 1. Agent Communication

- **Document your changes** with clear comments
- **Update related files** when making changes
- **Notify other agents** when your work affects theirs
- **Follow naming conventions** consistently

### 2. Code Quality

- **Use TypeScript** for all new code
- **Follow existing patterns** in the codebase
- **Handle errors gracefully** with proper error boundaries
- **Write tests** for new functionality

### 3. Performance

- **Optimize database queries** with proper indexes
- **Use proper caching** with TanStack Query
- **Implement pagination** for large datasets
- **Optimize bundle size** with code splitting

### 4. Security

- **Validate all inputs** with Zod schemas
- **Use RLS policies** for database security
- **Implement proper authentication** checks
- **Follow OWASP guidelines** for security

## 🚨 Troubleshooting

### Common Issues

1. **TypeScript Errors**
   - Run `npm run type-check`
   - Check for missing imports
   - Verify type definitions

2. **Database Migration Issues**
   - Run `supabase db reset` to reset database
   - Check migration syntax
   - Verify RLS policies

3. **Authentication Issues**
   - Check environment variables
   - Verify Supabase configuration
   - Test auth flow manually

4. **Build Errors**
   - Run `npm run lint` to check for issues
   - Verify all imports are correct
   - Check for missing dependencies

### Getting Help

1. **Check the methodology document** (`AGENT_METHODOLOGY.md`)
2. **Review task examples** (`TASK_EXAMPLES.md`)
3. **Use the appropriate agent prompt** for your task
4. **Coordinate with other agents** if needed

## 📈 Success Metrics

Track your progress with these metrics:

- **Code Quality**: Zero TypeScript errors, passing ESLint
- **Test Coverage**: 90%+ coverage for new features
- **Performance**: Lighthouse score > 90
- **Security**: No security vulnerabilities
- **User Experience**: Intuitive navigation, fast loading

## 🎉 Next Steps

1. **Choose your first task** from the MVP roadmap
2. **Select the appropriate agent** for your task
3. **Use the agent prompt** to guide your development
4. **Follow the collaboration workflow** when needed
5. **Document your progress** and share with the team

This methodology ensures efficient, high-quality development while maintaining consistency across the Prompt Manage MVP. Happy coding! 🚀
