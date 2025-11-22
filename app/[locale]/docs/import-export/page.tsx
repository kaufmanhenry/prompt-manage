import { AlertCircle, CheckCircle2, FileUp, FileDown, Download, Upload } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Import & Export Guide - Prompt Manage',
  description:
    'Learn how to bulk import and export your prompts in Prompt Manage. Supports CSV and JSON formats for easy backup, migration, and bulk editing.',
  keywords: [
    'prompt import export',
    'bulk import prompts',
    'export prompts csv',
    'backup prompts',
    'migrate prompts',
    'bulk editing',
   '

CSV format',
    'JSON format',
  ],
}

export default function ImportExportGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Import & Export Guide
          </h1>
          <p className="text-lg text-muted-foreground">
            Bulk import and export your prompts with CSV or JSON formats. Perfect for backups,
            migrations, and bulk editing.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: November 22, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {/* Premium Feature Notice */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                  Premium Feature
                </h3>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                  Import and Export features require a Team ($20/mo) or Pro ($99/mo) plan. Free
                  plan users can upgrade to access these powerful bulk management tools.
                </p>
                <Link href="/pricing" className="mt-2 inline-block">
                  <Button variant="outline" size="sm" className="mt-2">
                    View Pricing Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <section>
            <h2 className="mb-6 text-3xl font-bold">Quick Start</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/40">
                    <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Import Prompts</h3>
                </div>
                <ol className="list-decimal space-y-2 pl-6 text-sm text-muted-foreground">
                  <li>Go to your Dashboard</li>
                  <li>Click "Import / Export" button</li>
                  <li>Select "Import" tab</li>
                  <li>Choose your CSV or JSON file (max 10MB)</li>
                  <li>Click "Import Prompts"</li>
                </ol>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/40">
                    <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Export Prompts</h3>
                </div>
                <ol className="list-decimal space-y-2 pl-6 text-sm text-muted-foreground">
                  <li>Go to your Dashboard</li>
                  <li>Click "Import / Export" button</li>
                  <li>Select "Export" tab</li>
                  <li>Choose CSV or JSON format</li>
                  <li>File downloads automatically</li>
                </ol>
              </div>
            </div>
          </section>

          {/* CSV Format */}
          <section id="csv-format">
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                  <FileUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold">CSV Format Guide</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  CSV (Comma-Separated Values) format is perfect for working with spreadsheets like
                  Excel or Google Sheets.
                </p>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Required Columns</h3>
                  <ul className="list-disc space-y-1 pl-6 text-sm">
                    <li>
                      <code className="rounded bg-muted px-2 py-0.5">name</code> - The prompt's title
                      (also accepts: title, prompt_name)
                    </li>
                    <li>
                      <code className="rounded bg-muted px-2 py-0.5">prompt_text</code> - The actual
                      prompt content (also accepts: prompt, content, text)
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Optional Columns</h3>
                  <ul className="list-disc space-y-1 pl-6 text-sm">
                    <li>
                      <code className="rounded bg-muted px-2 py-0.5">description</code> - Prompt
                      description (also accepts: desc, summary)
                    </li>
                    <li>
                      <code className="rounded bg-muted px-2 py-0.5">model</code> - AI model (e.g.,
                      gpt-4o, claude-3-5-sonnet) - defaults to gpt-4o
                    </li>
                    <li>
                      <code className="rounded bg-muted px-2 py-0.5">tags</code> - Comma or
                      space-separated tags
                    </li>
                    <li>
                      <code className="rounded bg-muted px-2 py-0.5">is_public</code> - Boolean (true/false, 1/0, yes/no)
                      - Always set to false on import for security
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Example CSV</h3>
                  <div className="overflow-x-auto rounded-lg bg-muted p-4">
                    <pre className="text-xs">
{`name,prompt_text,description,model,tags
"Email Subject Line","Write 5 compelling email subject lines","Marketing helper",gpt-4o,"marketing email"
"Blog Outline","Create a detailed blog post outline","Content creation",claude-3-5-sonnet,"writing blogging"
"Code Review","Review this code for bugs and improvements","Development helper",gpt-4o,"coding development"`}
                    </pre>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h4 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-200">
                    CSV Best Practices
                  </h4>
                  <ul className="list-disc space-y-1 pl-6 text-sm text-blue-900 dark:text-blue-200">
                    <li>Use double quotes around fields that contain commas or newlines</li>
                    <li>Escape quotes inside fields by doubling them: <code>"He said ""Hello"""</code></li>
                    <li>Column names are case-insensitive</li>
                    <li>UTF-8 encoding is supported for international characters</li>
                    <li>Maximum file size: 10MB</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* JSON Format */}
          <section id="json-format">
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/40">
                  <FileDown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold">JSON Format Guide</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  JSON format is ideal for programmatic access and preserves data types perfectly.
                </p>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Structure</h3>
                  <p className="text-sm">
                    JSON files should contain an array of prompt objects. Each object must have{' '}
                    <code className="rounded bg-muted px-2 py-0.5">name</code> and{' '}
                    <code className="rounded bg-muted px-2 py-0.5">prompt_text</code> fields.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Example JSON</h3>
                  <div className="overflow-x-auto rounded-lg bg-muted p-4">
                    <pre className="text-xs">
{`[
  {
    "name": "Email Subject Line",
    "prompt_text": "Write 5 compelling email subject lines",
    "description": "Marketing helper",
    "model": "gpt-4o",
    "tags": ["marketing", "email"],
    "is_public": false,
    "inserted_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-20T14:45:00Z"
  },
  {
    "name": "Blog Outline",
    "prompt_text": "Create a detailed blog post outline",
    "description": "Content creation",
    "model": "claude-3-5-sonnet",
    "tags": ["writing", "blogging"]
  }
]`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Field Details</h3>
                  <ul className="list-disc space-y-1 pl-6 text-sm">
                    <li><strong>name</strong> (string, required) - Max 120 characters</li>
                    <li><strong>prompt_text</strong> (string, required) - Max 100,000 characters</li>
                    <li><strong>description</strong> (string, optional)</li>
                    <li><strong>model</strong> (string, optional) - Defaults to "gpt-4o"</li>
                    <li><strong>tags</strong> (array or string, optional) - Array format recommended</li>
                    <li><strong>is_public</strong> (boolean, optional) - Always set to false on import</li>
                    <li><strong>inserted_at/updated_at</strong> (string, export only) - ISO 8601 timestamps</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                  <h4 className="mb-2 text-sm font-semibold text-purple-900 dark:text-purple-200">
                    JSON Tips
                  </h4>
                  <ul className="list-disc space-y-1 pl-6 text-sm text-purple-900 dark:text-purple-200">
                    <li>Use proper JSON formatting with valid syntax</li>
                    <li>Tags can be an array <code>["tag1", "tag2"]</code> or comma-separated string</li>
                    <li>Timestamps are included in exports but optional for imports</li>
                    <li>Single object or array of objects both accepted</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Import Options */}
          <section id="import-options">
            <div className="rounded-lg border border-border bg-card p-8">
              <h2 className="mb-6 text-2xl font-bold">Import Options & Features</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Skip Duplicates
                  </h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Enable this option to automatically skip prompts that already exist in your library.
                  </p>
                  <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                    <li>Duplicates are detected by matching: name + prompt_text (case-insensitive)</li>
                    <li>Checked by default to prevent accidental duplicates</li>
                    <li>Skipped prompts are counted and reported in the results</li>
                    <li>Uncheck to allow importing duplicate prompts</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Batch Processing
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Large files are processed in batches of 100 prompts for optimal performance. You'll
                    receive a summary showing:
                  </p>
                  <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                    <li><strong>Imported:</strong> Number of successfully imported prompts</li>
                    <li><strong>Skipped:</strong> Number of duplicate prompts skipped</li>
                    <li><strong>Errors:</strong> Number of invalid rows (missing required fields)</li>
                    <li><strong>Total:</strong> Total rows processed</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    Privacy & Security
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    All imported prompts are automatically set to <strong>private</strong> for your
                    security. This prevents accidental public exposure of imported content.
                  </p>
                  <ul className="list-disc mt-2 space-y-1 pl-6 text-sm text-muted-foreground">
                    <li>The <code>is_public</code> field is always set to <code>false</code> on import</li>
                    <li>User-provided <code>is_public</code> values are ignored</li>
                    <li>You can manually make prompts public after import if desired</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section id="use-cases">
            <div className="rounded-lg border border-border bg-card p-8">
              <h2 className="mb-6 text-2xl font-bold">Common Use Cases</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-background p-4">
                  <h3 className="mb-2 font-semibold text-foreground">Backup Your Library</h3>
                  <p className="text-sm text-muted-foreground">
                    Export all your prompts regularly as a backup. Store the JSON file safely to
                    prevent data loss.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <h3 className="mb-2 font-semibold text-foreground">Migrate from Other Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Export prompts from other platforms, convert to CSV/JSON format, and import into
                    Prompt Manage.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <h3 className="mb-2 font-semibold text-foreground">Bulk Create Prompts</h3>
                  <p className="text-sm text-muted-foreground">
                    Create prompts in Excel or Google Sheets, export as CSV, and import hundreds of
                    prompts at once.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <h3 className="mb-2 font-semibold text-foreground">Share with Team</h3>
                  <p className="text-sm text-muted-foreground">
                    Export your best prompts and share the file with team members. They can import and
                    customize for their needs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section id="troubleshooting">
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/40">
                  <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold">Troubleshooting</h2>
              </div>
              <div className="space-y-6 text-muted-foreground">
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    "File too large" error
                  </h3>
                  <p className="text-sm">
                    Maximum file size is 10MB. If your file exceeds this:
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-6 text-sm">
                    <li>Split into multiple smaller files</li>
                    <li>Remove unnecessary columns from CSV</li>
                    <li>For JSON, ensure proper formatting without extra whitespace</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    "CSV must contain 'name' and 'prompt_text' columns"
                  </h3>
                  <p className="text-sm">
                    Your CSV is missing required columns. Make sure your CSV has headers named:
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-6 text-sm">
                    <li><code className="rounded bg-muted px-2 py-0.5">name</code> (or title, prompt_name)</li>
                    <li><code className="rounded bg-muted px-2 py-0.5">prompt_text</code> (or prompt, content, text)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    "All prompts already exist (duplicates skipped)"
                  </h3>
                  <p className="text-sm">
                    All prompts in your file match existing prompts in your library.
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-6 text-sm">
                    <li>Uncheck "Skip duplicates" if you want to import them anyway</li>
                    <li>Or modify the prompt names/text to make them unique</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    "Invalid file type"
                  </h3>
                  <p className="text-sm">
                    File must be .csv or .json format. Make sure:
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-6 text-sm">
                    <li>File extension is correct (.csv or .json)</li>
                    <li>File is saved in the proper format from your editor</li>
                    <li>CSV files use UTF-8 encoding</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    "Export/Import feature requires a paid subscription"
                  </h3>
                  <p className="text-sm">
                    This is a premium feature. Upgrade to Team or Pro plan:
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-6 text-sm">
                    <li>Team Plan: $20/month - Perfect for small teams</li>
                    <li>Pro Plan: $99/month - Advanced features and unlimited prompts</li>
                    <li>
                      <Link href="/pricing" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
                        View pricing plans
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Limits & Restrictions */}
          <section id="limits">
            <div className="rounded-lg border border-border bg-card p-8">
              <h2 className="mb-6 text-2xl font-bold">Limits & Restrictions</h2>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="font-semibold text-foreground">File Size</h3>
                    <p className="text-sm text-muted-foreground">
                      Maximum 10MB per file for both CSV and JSON imports
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="font-semibold text-foreground">Field Limits</h3>
                    <p className="text-sm text-muted-foreground">
                      Name: 120 characters max | Prompt text: 100,000 characters max (auto-truncated if exceeded)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="font-semibold text-foreground">No Usage Quotas</h3>
                    <p className="text-sm text-muted-foreground">
                      Team/Pro users have unlimited import/export operations with no monthly limits
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h3 className="font-semibold text-foreground">Team Isolation</h3>
                    <p className="text-sm text-muted-foreground">
                      Imports go to your current team. Exports include only prompts from your current team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Links */}
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Related Documentation</h2>
            <p className="mb-6 text-muted-foreground">
              Explore more guides to get the most out of Prompt Manage
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/docs">
                <Button variant="outline" size="lg">
                  All Documentation
                </Button>
              </Link>
              <Link href="/docs/payments-subscriptions">
                <Button variant="outline" size="lg">
                  Upgrade to Team/Pro
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
