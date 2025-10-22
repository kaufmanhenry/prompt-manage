'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

// Context to manage tooltip state
const TooltipContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen }}>{children}</TooltipContext.Provider>
  )
}

interface TooltipTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

export function TooltipTrigger({ children, asChild }: TooltipTriggerProps) {
  const { setIsOpen } = React.useContext(TooltipContext)

  const handleMouseEnter = () => setIsOpen(true)
  const handleMouseLeave = () => setIsOpen(false)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    })
  }

  return (
    <div
      className="inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

interface TooltipContentProps {
  children: React.ReactNode
  className?: string
}

export function TooltipContent({ children, className }: TooltipContentProps) {
  const { isOpen } = React.useContext(TooltipContext)

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
        'animate-in fade-in-0 zoom-in-95',
        className,
      )}
    >
      {children}
    </div>
  )
}
