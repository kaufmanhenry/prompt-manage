'use client';

import { Chrome } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // No OTP flow; Google OAuth only

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      console.error('Google login error:', error);
      const description = error instanceof Error ? error.message : 'Google sign-in failed';
      toast({ title: 'Error', description, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your Prompt Manage account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
          <Chrome className="mr-2 h-4 w-4" /> Continue with Google
        </Button>

        <div className="space-y-2 text-center">
          <div className="text-sm">Don&apos;t have an account? <Link href="/auth/signup" className="text-primary hover:underline">Sign up</Link></div>
        </div>
      </CardContent>
    </Card>
  );
}
