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

3. **Set up environment variables**:

   ```bash
   # Create a .env.local file in the root directory
   touch .env.local
   ```

   Fill in your environment variables in `.env.local`:

   ```env
   # OpenAI API Key - Get from https://platform.openai.com/api-keys
   OPENAI_API_KEY=your_openai_api_key_here

   # Supabase Configuration - Get from your Supabase project settings
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Important**: Replace `your_openai_api_key_here` with your actual OpenAI API key. You can get one from [OpenAI's platform](https://platform.openai.com/api-keys).

4. **Start development**:
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
- **Prompt Management**: Create, edit, and organize your AI prompts
- **Public Sharing**: Share prompts publicly with a unique URL
- **Tagging System**: Organize prompts with custom tags
- **Model Support**: Support for multiple AI models (GPT-4, GPT-3.5-turbo, Claude, etc.)
- **Run Prompts**: Execute stored prompts using OpenAI's GPT-3.5-turbo model directly from the dashboard

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
   - `AWS_SES_REGION` (e.g. `us-east-1`)
   - `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` (or use IAM role)
   - Optional fallback: `RESEND_API_KEY`
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

_For questions and support, check our documentation or open an issue on GitHub._

## Run Prompt Feature

The dashboard now includes a "Run Prompt" feature that allows logged-in users to execute their stored prompts using OpenAI's GPT-3.5-turbo model.

### How to Use

1. **Navigate to Dashboard**: Go to your dashboard where all your prompts are listed
2. **Run a Prompt**: Click the "Run Prompt" button on any prompt card
3. **View Response**: The AI response will appear below the prompt content
4. **Toggle Response**: You can hide/show the response using the close button

### Features

- **Real-time Execution**: Prompts are executed immediately when you click the button
- **Loading States**: Visual feedback during prompt execution
- **Error Handling**: Graceful error handling with user-friendly messages
- **Response Display**: Clean, formatted display of AI responses
- **Secure Access**: Only authenticated users can run their own prompts

### Technical Details

- **API Endpoint**: `POST /api/prompt/run`
- **Model**: GPT-3.5-turbo (configurable for future expansion)
- **Authentication**: Requires valid user session
- **Rate Limiting**: Standard OpenAI API limits apply

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd prompt-manage
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Run the database migration in your Supabase SQL editor:

```sql
-- Copy the contents of database-migration.sql
-- This will create the necessary tables and enable sharing features
```

## API Routes

### POST /api/prompt/run

Executes a stored prompt using OpenAI's GPT-3.5-turbo model.

**Request Body:**

```json
{
  "promptId": "string"
}
```

**Response:**

```json
{
  "success": true,
  "response": "AI generated response",
  "prompt": {
    "id": "string",
    "name": "string",
    "prompt_text": "string"
  }
}
```

**Authentication:** Required (valid user session)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
