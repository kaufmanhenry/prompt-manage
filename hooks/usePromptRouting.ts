'use client'

import { useRouter } from 'next/navigation'

export function usePromptRouting() {
  const router = useRouter()

  const navigateToPrompt = (promptId: string) => {
    router.push(`/dashboard?prompt=${promptId}`)
  }

  const navigateToDashboard = () => {
    router.push('/dashboard')
  }

  return {
    navigateToPrompt,
    navigateToDashboard,
  }
} 