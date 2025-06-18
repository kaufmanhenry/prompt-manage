'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t py-8 bg-white dark:bg-gray-950">
      <div className="mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
        <div className="flex flex-col md:flex-row gap-12 w-full">
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:underline text-gray-600 dark:text-gray-300">About</Link></li>
              <li><Link href="/pricing" className="hover:underline text-gray-600 dark:text-gray-300">Pricing</Link></li>
              <li><Link href="/security" className="hover:underline text-gray-600 dark:text-gray-300">Security</Link></li>
              <li><Link href="/terms" className="hover:underline text-gray-600 dark:text-gray-300">Terms</Link></li>
              <li><Link href="/privacy" className="hover:underline text-gray-600 dark:text-gray-300">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:underline text-gray-600 dark:text-gray-300">Contact Us</Link></li>
              <li><Link href="/customers" className="hover:underline text-gray-600 dark:text-gray-300">Customers</Link></li>
              <li><Link href="/docs" className="hover:underline text-gray-600 dark:text-gray-300">Documentation</Link></li>
              <li><Link href="/community" className="hover:underline text-gray-600 dark:text-gray-300">Community</Link></li>
              <li><Link href="/research" className="hover:underline text-gray-600 dark:text-gray-300">Research</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 md:mt-0 text-xs text-gray-500 dark:text-gray-400 w-full md:w-auto text-center md:text-right">
          Copyright © 2025 Prompt Manage LLC. All rights reserved.
        </div>
      </div>
    </footer>
  )
} 