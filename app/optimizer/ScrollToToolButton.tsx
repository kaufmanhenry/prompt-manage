'use client'

import { ArrowRight, Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ScrollToToolButton() {
  const scrollToTool = () => {
    document.getElementById('optimizer-tool')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Button
      size="lg"
      className="bg-blue-600 px-8 py-3 text-lg text-white hover:bg-blue-700"
      onClick={scrollToTool}
    >
      <Zap className="mr-2 h-5 w-5" />
      Try Prompt Optimizer
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  )
}
