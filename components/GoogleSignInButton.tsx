'use client';

import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';

interface GoogleSignInButtonProps {
  label: string;
  className?: string;
  size?: ComponentProps<typeof Button>['size'];
  variant?: ComponentProps<typeof Button>['variant'];
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


