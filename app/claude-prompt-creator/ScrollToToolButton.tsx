'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Brain } from 'lucide-react'

export function ScrollToToolButton() {
  const handleClick = () => {
    document.getElementById('claude-tool')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Button
      size="lg"
      className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
      onClick={handleClick}
    >
      <Brain className="mr-2 h-5 w-5" />
      Try Claude Prompt Creator
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  )
}
