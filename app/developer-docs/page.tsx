import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'API Documentation — Prompt Manage',
  description: 'Developer documentation for the Prompt Manage API. Integrate prompt management into your applications.',
  keywords: ['API', 'developer', 'documentation', 'REST API', 'integration'],
  openGraph: {
    title: 'API Documentation — Prompt Manage',
    description: 'Developer documentation for the Prompt Manage API.',
    type: 'website',
  },
}

export default function DeveloperDocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            API Documentation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Integrate Prompt Manage into your applications.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          {/* Introduction */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Introduction</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              The Prompt Manage API allows you to programmatically manage prompts, run AI models, and integrate prompt management into your workflows.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              All API requests are made to <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-900">https://promptmanage.com/api</code> and require authentication.
            </p>
          </section>

          {/* Authentication */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Authentication</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              API requests require an API key. Generate one in your account settings.
            </p>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <p className="mb-2 font-mono text-sm">Authorization: Bearer YOUR_API_KEY</p>
            </div>
          </section>

          {/* Example Request */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Example Request</h2>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
              <pre className="text-sm">
                <code>{`curl https://promptmanage.com/api/prompts \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
              </pre>
            </div>
          </section>

          {/* Endpoints */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Endpoints</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-base font-medium">Prompts</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• <code>GET /api/prompts</code> - List all prompts</li>
                  <li>• <code>POST /api/prompts</code> - Create a prompt</li>
                  <li>• <code>GET /api/prompts/:id</code> - Get a prompt</li>
                  <li>• <code>PUT /api/prompts/:id</code> - Update a prompt</li>
                  <li>• <code>DELETE /api/prompts/:id</code> - Delete a prompt</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Teams</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• <code>GET /api/teams</code> - List teams</li>
                  <li>• <code>GET /api/teams/:id/members</code> - List team members</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Audit Logs</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• <code>GET /api/audit-logs</code> - List audit logs (Enterprise only)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Rate Limits */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Rate Limits</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Free: 60 requests/hour</li>
              <li>• Team: 600 requests/hour</li>
              <li>• Enterprise: Custom limits</li>
            </ul>
          </section>

          {/* Support */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Support</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              For API questions or technical support, contact our team.
            </p>
            <div>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Developer Support</p>
              <a
                href="mailto:support@promptmanage.com"
                className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                support@promptmanage.com
              </a>
            </div>
            <div className="mt-8">
              <Link href="/docs" className="text-sm underline hover:text-gray-600 dark:hover:text-gray-300">
                View Full Documentation
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
