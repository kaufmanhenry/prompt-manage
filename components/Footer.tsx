'use client'

import { Sparkles } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t py-3 bg-white dark:bg-gray-950">
      <div className="mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
        <div className="flex gap-2 w-full items-center">
          <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg h-6 w-6 mr-2">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
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
        <div className="mt-8 md:mt-0 text-xs text-gray-500 dark:text-gray-400 w-full text-center md:text-right">
          © 2025 Prompt Manage LLC.
        </div>
      </div>
    </footer>
  )
}
