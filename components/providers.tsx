'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { ThemeProvider } from '@/components/theme-provider';
import { WorkspaceProvider } from '@/components/workspace/workspace-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <WorkspaceProvider>{children}</WorkspaceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
