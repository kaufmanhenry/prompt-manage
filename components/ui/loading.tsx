import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size], className)} />
  );
}

interface LoadingTextProps {
  text?: string;
  className?: string;
}

export function LoadingText({ text = 'Loading...', className }: LoadingTextProps) {
  return (
    <div className={cn('flex items-center gap-2 text-muted-foreground', className)}>
      <Spinner size="sm" />
      <span>{text}</span>
    </div>
  );
}

interface FullPageLoadingProps {
  text?: string;
  className?: string;
}

export function FullPageLoading({ text = 'Loading...', className }: FullPageLoadingProps) {
  return (
    <div className={cn('min-h-screen bg-background flex items-center justify-center', className)}>
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-2" />
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

interface CardLoadingProps {
  text?: string;
  className?: string;
}

export function CardLoading({ text = 'Loading...', className }: CardLoadingProps) {
  return (
    <div className={cn('flex items-center justify-center py-8', className)}>
      <LoadingText text={text} />
    </div>
  );
}
