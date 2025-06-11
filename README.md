# Prompt Manage

A modern, type-safe prompt-catalogue SaaS built with Next.js 14, Supabase, and shadcn/ui.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- React 18
- Tailwind CSS + shadcn/ui
- Supabase (Postgres + Auth)
- TanStack Query v5
- Zod
- Playwright for E2E testing

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE=your-service-role-key
   ```

   You can get these values from your Supabase project settings:
   - Go to your Supabase project dashboard
   - Click on "Settings" in the sidebar
   - Click on "API" in the settings menu
   - Copy the "Project URL" and "anon public" key
   - For the service role key, click on "Project Settings" > "API" > "Project API keys"

4. Initialize shadcn/ui:
   ```bash
   npx shadcn@latest init
   npx shadcn@latest add table dialog form input textarea select command button card
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Database Setup

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase:
   ```bash
   supabase init
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

## Testing

- Unit tests: `npm test`
- E2E tests: `npm run test:e2e`
- Debug tests: `npm run test:debug`
- UI mode: `npm run test:ui`

## Deployment

1. Deploy to Vercel:
   - Connect your GitHub repository to Vercel
   - Add the following environment variables in Vercel:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Deploy

2. Set up Supabase:
   - Create a new project in Supabase
   - Run migrations:
     ```bash
     supabase db push
     ```
   - Enable Email OTP authentication in Supabase Auth settings

## Features

- Email OTP authentication
- Prompt management (CRUD)
- Full-text search
- Command palette (⌘K)
- Dark mode support
- Real-time updates

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CommandPalette.tsx
│   ├── PromptForm.tsx
│   ├── PromptsTable.tsx
│   ├── theme-provider.tsx
│   └── ui/
├── lib/
│   ├── schemas/
│   │   └── prompt.ts
│   └── utils.ts
└── utils/
    └── supabase/
        ├── client.ts
        └── server.ts
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
