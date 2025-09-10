# Development Setup Guide

This guide provides detailed instructions for setting up your development environment for the Prompt Manage project.

## Prerequisites

### Required Software

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm 6+** - Usually comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Supabase CLI** - Install via npm: `npm install -g supabase`

### Optional but Recommended

- **Cursor IDE** - For AI-assisted development
- **PostgreSQL** - For local database development (optional)
- **Docker** - For containerized development (optional)

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd prompt-manage
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add the following variables to `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE=your-service-role-key

# Optional: Development overrides
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE`

## Database Setup

### 1. Initialize Supabase

```bash
# Initialize Supabase in the project
supabase init

# Link to your Supabase project
supabase link --project-ref your-project-ref
```

### 2. Run Database Migrations

```bash
# Push migrations to your Supabase project
supabase db push

# Or run migrations locally (if using local Supabase)
supabase start
supabase db reset
```

### 3. Verify Database Setup

Check that the following tables exist in your Supabase dashboard:

- `prompts`
- `user_profiles` (if applicable)
- `prompt_versions` (if applicable)

## Development Server

### 1. Start Development Server

```bash
npm run dev
```

The application will be available at:

- **Local**: http://localhost:3000
- **Network**: http://your-ip:3000

### 2. Verify Setup

1. Open http://localhost:3000 in your browser
2. You should see the Prompt Manage homepage
3. Try signing up/logging in to test authentication
4. Create a test prompt to verify database connectivity

## Development Tools

### 1. Code Quality Tools

```bash
# TypeScript type checking
npm run type-check

# ESLint linting
npm run lint

# Prettier formatting
npm run format

# Run all checks
npm run check
```

### 2. Testing

```bash
# Unit tests
npm run test

# E2E tests with Playwright
npm run test:e2e

# Test in UI mode
npm run test:ui

# Debug tests
npm run test:debug
```

### 3. Database Tools

```bash
# Generate new migration
supabase db diff --schema public

# Reset database
supabase db reset

# View database in browser
supabase db diff --schema public --linked
```

## IDE Configuration

### Cursor IDE Setup

1. Install Cursor IDE
2. Open the project folder
3. Install recommended extensions:
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - Prettier - Code formatter
   - ESLint

### VS Code Setup (Alternative)

1. Install VS Code
2. Install recommended extensions:
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - Prettier - Code formatter
   - ESLint
   - Supabase

## Authentication Setup

### 1. Enable Email OTP

1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Enable **Email OTP** authentication
3. Configure email templates if needed

### 2. Test Authentication

1. Try signing up with a new email
2. Check that you receive the OTP email
3. Verify you can log in with the OTP

## Common Issues and Solutions

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
npm run dev -- -p 3001
```

### Database Connection Issues

1. Check your Supabase credentials in `.env.local`
2. Verify your Supabase project is active
3. Check network connectivity

### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf .next
rm tsconfig.tsbuildinfo

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Supabase CLI Issues

```bash
# Update Supabase CLI
npm update -g supabase

# Re-link project
supabase unlink
supabase link --project-ref your-project-ref
```

## Development Workflow

### 1. Feature Development

1. Create a new branch: `git checkout -b feature/your-feature`
2. Follow the multi-agent methodology (see `docs/architecture/agent-methodology.md`)
3. Write tests for your feature
4. Run all checks: `npm run check`
5. Create a pull request

### 2. Database Changes

1. Create a new migration: `supabase db diff --schema public`
2. Test the migration locally
3. Push to development: `supabase db push`
4. Update schema types if needed

### 3. Testing

1. Write unit tests for new components
2. Write E2E tests for user flows
3. Test on different browsers
4. Verify accessibility compliance

## Production Deployment

### 1. Build for Production

```bash
npm run build
```

### 2. Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### 3. Environment Variables for Production

Make sure to set these in your production environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE`

## Additional Resources

- **[Quick Start Guide](./quick-start-guide.md)** - Quick reference for getting started
- **[Agent Methodology](../architecture/agent-methodology.md)** - Multi-agent development approach
- **[Task Examples](../development/task-examples.md)** - Practical development examples
- **[API Reference](../technical/api-reference.md)** - API documentation
- **[Database Schema](../technical/database-schema.md)** - Database structure

## Support

If you encounter issues:

1. Check the **[Common Issues](#common-issues-and-solutions)** section above
2. Review the **[Task Examples](../development/task-examples.md)** for similar scenarios
3. Check the project's GitHub issues
4. Ask for help in the project's discussion forum

---

_Last updated: December 2024_
