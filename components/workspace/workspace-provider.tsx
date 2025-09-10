'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Workspace = { type: 'personal' } | { type: 'org'; orgId: string };

interface WorkspaceContextValue {
  currentWorkspace: Workspace;
  setWorkspace: (ws: Workspace) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace>({ type: 'personal' });

  // Initialize from URL (?org=<id>) or localStorage
  useEffect(() => {
    const urlOrg = searchParams.get('org');
    if (urlOrg) {
      setCurrentWorkspace({ type: 'org', orgId: urlOrg });
      if (typeof window !== 'undefined') {
        localStorage.setItem('workspace', JSON.stringify({ type: 'org', orgId: urlOrg }));
      }
      return;
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('workspace');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Workspace;
          if (parsed && (parsed.type === 'personal' || (parsed.type === 'org' && parsed.orgId))) {
            setCurrentWorkspace(parsed);
            if (parsed.type === 'org') {
              const sp = new URLSearchParams(Array.from(searchParams.entries()));
              sp.set('org', parsed.orgId);
              router.replace(`${pathname}?${sp.toString()}`);
            }
            return;
          }
        } catch {}
      }
    }
    setCurrentWorkspace({ type: 'personal' });
  }, [pathname, router, searchParams]);

  const setWorkspace = useCallback(
    (ws: Workspace) => {
      setCurrentWorkspace(ws);
      if (typeof window !== 'undefined') {
        localStorage.setItem('workspace', JSON.stringify(ws));
      }
      const sp = new URLSearchParams(Array.from(searchParams.entries()));
      if (ws.type === 'org') {
        sp.set('org', ws.orgId);
      } else {
        sp.delete('org');
      }
      router.push(`${pathname}?${sp.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const value = useMemo(
    () => ({ currentWorkspace, setWorkspace }),
    [currentWorkspace, setWorkspace]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
}
