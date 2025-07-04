'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t py-10 bg-white dark:bg-gray-950">
      <div className="mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
        <div className="flex md:flex-row flex-col md:gap-8 gap-4 w-full">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold tracking-tight">
              Prompt Manage
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Create, manage, and run AI prompts.<br />
              All in one place.
            </p>
          </div>
          <ul className="text-sm items-center space-y-2">
            <li className="font-medium text-xs text-muted-foreground">
              Company
            </li>
            <li>
              <Link
                href="/about"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Pricing
              </Link>
            </li>
          </ul>
          <ul className="text-sm items-center space-y-2">
            <li className="font-medium text-xs text-muted-foreground">
              Resources
            </li>
            <li>
              <Link
                href="/blog"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/p"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Prompt Directory
              </Link>
            </li>
            <li>
              <Link
                href="/models"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Models
              </Link>
            </li>
            <li>
              <Link
                href="/docs"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Docs
              </Link>
            </li>
            <li>
              <Link
                href="/demo"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Demo
              </Link>
            </li>
            <li>
              <Link
                href="/prompt-pack"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Free Prompt Pack
              </Link>
            </li>
            <li>
              <Link
                href="/stats"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Live Stats
              </Link>
            </li>
          </ul>
          <ul className="text-sm items-center space-y-2">
            <li className="font-medium text-xs text-muted-foreground">Legal</li>
            <li>
              <Link
                href="/terms"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/dmca"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                DMCA
              </Link>
            </li>
          </ul>
          <ul className="text-sm items-center space-y-2">
            <li className="font-medium text-xs text-muted-foreground">Use Cases</li>
            <li>
              <Link
                href="/support-teams"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Support Teams
              </Link>
            </li>
            <li>
              <Link
                href="/marketing-teams"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Marketing Teams
              </Link>
            </li>
            <li>
              <Link
                href="/ai-engineers"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                AI Engineers
              </Link>
            </li>
            <li>
              <Link
                href="/comparison"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                vs Notion & Spreadsheets
              </Link>
            </li>
          </ul>
          <ul className="text-sm items-center space-y-2">
            <li className="font-medium text-xs text-muted-foreground">Safety</li>
            <li>
              <Link
                href="/security"
                className="hover:underline text-gray-600 dark:text-gray-300"
              >
                Security
              </Link>
            </li>
          </ul>
          <div className="md:ml-auto space-y-2 flex flex-col justify-between">
            <div className="flex items-center gap-2 justify-start md:justify-end">
              <Link
                href="https://x.com/promptmanage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com/company/prompt-manage/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              &copy; 2025 Prompt Manage LLC.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
