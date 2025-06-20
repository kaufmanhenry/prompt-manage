# Prompt Manage

A modern, type-safe prompt-catalogue SaaS built with Next.js 14, Supabase, and shadcn/ui.

## 📚 Documentation

For comprehensive documentation, visit our **[Documentation Hub](./docs/README.md)** which includes:

- **[Quick Start Guide](./docs/getting-started/quick-start-guide.md)** - Get up and running quickly
- **[Development Setup](./docs/getting-started/development-setup.md)** - Complete development environment setup
- **[Agent Methodology](./docs/architecture/agent-methodology.md)** - Multi-agent development approach
- **[Project Structure](./docs/architecture/project-structure.md)** - Codebase organization
- **[Feature Implementation](./docs/development/feature-implementation.md)** - How to build new features
- **[Testing Guide](./docs/development/testing-guide.md)** - Testing strategies and best practices

## Tech Stack

- Next.js 14 App Router
- TypeScript
- React 18
- Tailwind CSS + shadcn/ui
- Supabase (Postgres + Auth)
- TanStack Query v5
- Zod
- Playwright for E2E testing

## Quick Start

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd prompt-manage
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials to .env.local
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

For detailed setup instructions, see our **[Development Setup Guide](./docs/getting-started/development-setup.md)**.

## Features

- ✅ Email OTP authentication
- ✅ Prompt management (CRUD)
- ✅ Full-text search
- ✅ Command palette (⌘K)
- ✅ Dark mode support
- ✅ Real-time updates
- ✅ Prompt sharing and public access
- ✅ Related prompts discovery
- ✅ Responsive design

## Development

### Multi-Agent Development

This project uses a specialized multi-agent development methodology. Each agent has specific responsibilities:

- **Project Manager Agent**: Orchestrates development and ensures MVP requirements
- **Frontend Development Agent**: Builds UI components and user interactions
- **Backend Development Agent**: Develops API routes and server-side logic
- **Database & Schema Agent**: Manages database schema and migrations
- **Authentication & Security Agent**: Handles auth and security features
- **Testing & Quality Assurance Agent**: Creates tests and ensures quality
- **UI/UX Enhancement Agent**: Improves user experience and design

For detailed information, see our **[Agent Methodology Guide](./docs/architecture/agent-methodology.md)**.

### Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run all tests
npm run test:e2e     # Run E2E tests
npm run test:ui      # Run tests in UI mode

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier

# Database
supabase db push     # Push migrations
supabase db reset    # Reset database
```

### Project Structure

```
prompt-manage/
├── app/                    # Next.js 14 App Router
├── components/             # Reusable React components
├── lib/                    # Utility libraries and schemas
├── utils/                  # Utility functions
├── supabase/              # Database migrations and config
├── tests/                 # Test files
├── docs/                  # Project documentation
└── public/                # Static assets
```

For detailed project structure information, see our **[Project Structure Guide](./docs/architecture/project-structure.md)**.

## Database Setup

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Initialize and link**:
   ```bash
   supabase init
   supabase link --project-ref your-project-ref
   ```

3. **Run migrations**:
   ```bash
   supabase db push
   ```

## Testing

Our testing strategy includes:

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API and database operation testing
- **E2E Tests**: Complete user workflow testing
- **Performance Tests**: Load time and memory usage testing
- **Accessibility Tests**: WCAG compliance testing

For detailed testing information, see our **[Testing Guide](./docs/development/testing-guide.md)**.

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE`
3. Deploy automatically on push to main branch

### Supabase Setup

1. Create a new project in Supabase
2. Run migrations: `supabase db push`
3. Enable Email OTP authentication in Supabase Auth settings

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Follow our **[Feature Implementation Guide](./docs/development/feature-implementation.md)**
4. Write tests for your feature
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Create a Pull Request

## Documentation

- **[Documentation Hub](./docs/README.md)** - Main documentation index
- **[Getting Started](./docs/getting-started/)** - Setup and quick start guides
- **[Architecture](./docs/architecture/)** - System design and methodology
- **[Development](./docs/development/)** - Development guides and best practices
- **[Features](./docs/features/)** - Feature-specific documentation
- **[Technical](./docs/technical/)** - Technical reference and API docs

## License

MIT

---

*For questions and support, check our documentation or open an issue on GitHub.*
