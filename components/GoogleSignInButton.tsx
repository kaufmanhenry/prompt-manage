'use client';

import type { ButtonHTMLAttributes } from 'react';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';

interface GoogleSignInButtonProps {
  label: string;
  className?: string;
  size?: ButtonHTMLAttributes<HTMLButtonElement>['size'] | 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
}

export function GoogleSignInButton({ label, className, size = 'default', variant = 'default' }: GoogleSignInButtonProps) {
  const handleClick = async () => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    await createClient().auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
  };

  return (
    <Button size={size as any} variant={variant as any} className={className} onClick={handleClick}>
      {label}
    </Button>
  );
}


