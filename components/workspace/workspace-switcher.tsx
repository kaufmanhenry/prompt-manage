'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

import { useWorkspace } from './workspace-provider';

type Org = {
  id: string;
  name: string;
  slug: string;
};

export function WorkspaceSwitcher() {
  const router = useRouter();
  const { currentWorkspace, setWorkspace } = useWorkspace();

  const { data: orgs = [], isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const res = await fetch('/api/organizations');
      if (!res.ok) throw new Error('Failed to load organizations');
      return (await res.json()) as Org[];
    },
  });

  const activeLabel = useMemo(() => {
    if (currentWorkspace.type === 'personal') return 'Personal';
    const org = orgs.find((o) => o.id === currentWorkspace.orgId);
    return org?.name || 'Team';
  }, [currentWorkspace, orgs]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full">
          {activeLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Workspace</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setWorkspace({ type: 'personal' })}>
          Personal
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-2 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-48" />
          </div>
        ) : (
          <>
            {orgs.length > 0 && <DropdownMenuLabel>Teams</DropdownMenuLabel>}
            {orgs.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => setWorkspace({ type: 'org', orgId: org.id })}
              >
                <span className="flex-1 truncate">{org.name}</span>
              </DropdownMenuItem>
            ))}
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/teams/new')}>
          Create new team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
