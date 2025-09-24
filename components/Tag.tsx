import { useState } from 'react'

import { cn } from '@/lib/utils'

const tagVariants = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100',
  green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-100',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100',
} as const

type TagVariant = keyof typeof tagVariants

export default function Tag({
  tag,
  onClick,
  variant = 'blue',
}: {
  tag: string
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void
  variant?: TagVariant
}) {
  const [show, setShow] = useState(false)
  const color = tagVariants[variant]

  return (
    <span
      className={cn(
        'relative cursor-pointer px-2 py-0.5 rounded-full text-xs font-medium transition-shadow',
        color,
        'hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
      )}
      onClick={onClick}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
    >
      {tag}
      {show && (
        <span className="absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md">
          {tag}
        </span>
      )}
    </span>
  )
}
