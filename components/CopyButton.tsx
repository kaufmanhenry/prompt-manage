'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  label?: string
}

export default function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'hover:bg-muted',
        label && 'flex items-center gap-2 w-full bg-accent px-2 py-1 rounded-lg',
        !label && 'h-8 w-8'
      )}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="size-4 text-green-500" />
      ) : (
        <Copy className="size-4" />
      )}
      {label && <span className="text-sm font-medium">{copied ? 'Copied!' : label}</span>}
      <span className="sr-only">Copy to clipboard</span>
    </Button>
  )
}
