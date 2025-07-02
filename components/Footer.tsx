'use client'

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
        <div className="mt-8 md:mt-0 text-xs text-gray-500 dark:text-gray-400 w-full text-center md:text-right">
          © 2025 Prompt Manage LLC.
        </div>
      </div>
    </footer>
  )
}
