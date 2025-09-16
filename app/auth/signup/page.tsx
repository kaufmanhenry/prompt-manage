import { redirect } from 'next/navigation'

import { SignupForm } from '@/components/SignupForm'
import { createClient } from '@/utils/supabase/server'

interface SignupPageProps {
  searchParams: Promise<{
    promptId?: string
    promptName?: string
    redirect?: string
  }>
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const params = await searchParams

  if (session) {
    // If user is already signed in and there's a redirect, go to the redirect URL
    if (params.redirect) {
      redirect(params.redirect)
    }
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignupForm
        promptId={params.promptId}
        promptName={params.promptName}
        redirectUrl={params.redirect}
      />
    </div>
  )
}
