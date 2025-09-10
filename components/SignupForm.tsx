'use client';

import { Mail } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Store the redirect info in localStorage for after signup
      if (promptId && promptName && redirectUrl) {
        localStorage.setItem(
          'pendingPromptCopy',
          JSON.stringify({
            promptId,
            promptName,
            redirectUrl,
          })
        );
      }

      const { error } = await createClient().auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
          shouldCreateUser: true,
        },
      });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        const message = promptId
          ? `We've sent a secure sign-in link to ${email}. After signing in, "${promptName}" will be added to your prompts.`
          : `We've sent a secure sign-in link to ${email}. Check your inbox.`;

        toast({
          title: 'Magic link sent!',
          description: message,
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
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
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending magic link...' : 'Send magic link'}
          </Button>
        </form>

        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
