'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
        </div>
        <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
          An Error Occurred
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          We apologize for the inconvenience. Please try again, or return to the homepage if the
          issue persists.
        </p>
        <Button onClick={reset} className="inline-flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
