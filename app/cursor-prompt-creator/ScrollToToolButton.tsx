'use client'

import { ArrowRight, Code } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ScrollToToolButton() {
  const handleClick = () => {
    document.getElementById('cursor-tool')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Button
      size="lg"
      className="bg-blue-600 px-8 py-3 text-lg text-white hover:bg-blue-700"
      onClick={handleClick}
    >
      <Code className="mr-2 h-5 w-5" />
      Try Cursor Prompt Creator
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  )
}
