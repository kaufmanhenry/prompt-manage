'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t py-8 bg-white dark:bg-gray-950">
      <div className="mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
        <div className="flex flex-col md:flex-row gap-12 w-full">
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200 tracking-tight">
              Prompt Manage
            </h3>
            <ul className="text-sm flex items-center gap-2">
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
            </ul>
          </div>
        </div>
        <div className="mt-8 md:mt-0 text-xs text-gray-500 dark:text-gray-400 w-full text-center md:text-right">
          Copyright © 2025 Prompt Manage LLC. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
