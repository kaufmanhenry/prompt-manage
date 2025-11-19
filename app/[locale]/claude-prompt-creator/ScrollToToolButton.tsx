'use client'

import { ArrowRight, Brain } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ScrollToToolButton() {
  const handleClick = () => {
    document.getElementById('claude-tool')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Button
      size="lg"
      className="bg-purple-600 px-8 py-3 text-lg text-white hover:bg-purple-700"
      onClick={handleClick}
    >
      <Brain className="mr-2 h-5 w-5" />
      Try Claude Prompt Creator
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  )
}
