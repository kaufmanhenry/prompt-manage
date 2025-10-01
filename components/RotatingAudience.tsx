'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type RotatingAudienceProps = {
  items: string[]
  intervalMs?: number
  className?: string
}

export default function RotatingAudience({ items, intervalMs = 1800, className }: RotatingAudienceProps) {
  const stableItems = useMemo(() => (items && items.length > 0 ? items : ['Marketing Teams']), [items])
  const [index, setIndex] = useState<number>(0)
  const [fade, setFade] = useState<boolean>(false)
  const longest = useMemo(() => stableItems.reduce((a, b) => (a.length >= b.length ? a : b), ''), [stableItems])
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setFade(true)
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % stableItems.length)
        setFade(false)
      }, 260)
    }, intervalMs)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [intervalMs, stableItems.length])

  return (
    <span aria-live="polite">
      <span className="relative inline-block align-baseline">
        {/* This hidden element reserves width to avoid layout shift */}
        <span className="invisible whitespace-nowrap">{longest}</span>
        <span
          className={
            'absolute inset-0 whitespace-nowrap transition-all duration-400 ' +
            (fade ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100')
          }
          style={{ willChange: 'transform, opacity' }}
        >
          <span
            className={
              className ||
              'bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent'
            }
          >
            {stableItems[index]}
          </span>
        </span>
      </span>
    </span>
  )
}


