import Link from 'next/link'
import React from 'react'

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">Legal & Compliance</h1>
      <p className="mb-6 text-base text-gray-700 dark:text-gray-200">
        Prompt Manage is committed to transparency, security, and compliance.
        Below you will find links to our key legal and policy documents. For
        legal inquiries, contact{' '}
        <a href="mailto:legal@promptmanage.com" className="underline">
          legal@promptmanage.com
        </a>
        .
      </p>
      <ul className="ml-6 list-disc space-y-2 text-lg text-blue-700 dark:text-blue-300">
        <li>
          <Link href="/about" className="underline">
            About
          </Link>
        </li>
        <li>
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>
        </li>
        <li>
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
        </li>
      </ul>
      <p className="mt-8 text-xs text-gray-500">
        Prompt Manage, Boston, MA (Suffolk County) &copy;{' '}
        {new Date().getFullYear()}
      </p>
    </div>
  )
}
