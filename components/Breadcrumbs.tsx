'use client'

import { ChevronRight, Home } from 'lucide-react'

import { Link } from '@/i18n/routing'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      className="mb-8 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="flex items-center transition-colors hover:text-gray-700 dark:hover:text-gray-300"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-gray-700 dark:hover:text-gray-300"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
