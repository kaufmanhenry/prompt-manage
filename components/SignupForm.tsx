'use client';

import { Chrome } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@/utils/supabase/client';

interface SignupFormProps {
  promptId?: string;
  promptName?: string;
  redirectUrl?: string;
}

export function SignupForm({ promptId, promptName, redirectUrl }: SignupFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // No OTP flow; Google OAuth only

  const handleGoogle = async () => {
    setLoading(true);
    try {
      // Preserve pending prompt info for post-signup handling
      if (promptId && promptName && redirectUrl) {
        localStorage.setItem(
          'pendingPromptCopy',
          JSON.stringify({ promptId, promptName, redirectUrl })
        );
      }
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (error: unknown) {
      console.error('Google signup error:', error);
      const description = error instanceof Error ? error.message : 'Google sign-in failed';
      toast({ title: 'Error', description, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {promptId ? 'Save this prompt to your library' : 'Create an account'}
        </CardTitle>
        <CardDescription className="text-center">
          {promptId ? (
            <>
              Create a free account to save{' '}
              <span className="font-bold">&ldquo;{promptName}&rdquo;</span> to your library.
            </>
          ) : (
            'Enter your email to get started with Prompt Manage'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
          <Chrome className="mr-2 h-4 w-4" /> Continue with Google
        </Button>

        <div className="text-center text-sm"></div>
      </CardContent>
    </Card>
  );
}
