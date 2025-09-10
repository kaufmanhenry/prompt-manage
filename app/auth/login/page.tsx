import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/LoginForm';
import { createClient } from '@/utils/supabase/server';

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
