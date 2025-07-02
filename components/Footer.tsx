'use client'

import { Sparkles, Linkedin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="border-t py-3 bg-white dark:bg-gray-950">
      <div className="mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
        <div className="flex gap-4 w-full items-center">
          <Image src="/logo.svg" alt="Prompt Manage" width={24} height={24} />
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
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
              href="https://linkedin.com/company/promptmanage"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="mt-8 md:mt-0 text-xs text-gray-500 dark:text-gray-400 w-full text-center md:text-right">
          © 2025 Prompt Manage LLC.
        </div>
      </div>
    </footer>
  )
}
