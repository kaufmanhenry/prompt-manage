import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SignupForm } from '@/components/SignupForm'

export default async function SignupPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignupForm />
    </div>
  )
} 