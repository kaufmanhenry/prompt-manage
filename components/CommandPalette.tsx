'use client';

import { useQuery } from '@tanstack/react-query';
import { PlusIcon, UsersIcon, Settings, UserPlus, SwitchCamera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import type { Prompt } from '@/lib/schemas/prompt';
import { useWorkspace } from '@/components/workspace/workspace-provider';
import { createClient } from '@/utils/supabase/client';

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { currentWorkspace } = useWorkspace();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const { data: prompts = [] } = useQuery({
    queryKey: ['prompts', currentWorkspace.type === 'org' ? currentWorkspace.orgId : 'personal'],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('prompts')
        .select('*')
        .eq(
          currentWorkspace.type === 'org' ? 'org_id' : 'user_id',
          currentWorkspace.type === 'org' ? (currentWorkspace as any).orgId : (await createClient().auth.getUser()).data.user?.id
        )
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as Prompt[];
    },
  });

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search prompts..." className="border-none focus:ring-0" />
      <CommandList>
        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
          No prompts found.
        </CommandEmpty>
        <CommandGroup heading="Prompts">
          {prompts.map((prompt: Prompt) => (
            <CommandItem
              key={prompt.id}
              onSelect={() => {
                router.push(`/dashboard?prompt=${prompt.id}`);
                setOpen(false);
              }}
              className="flex items-center gap-2"
            >
              <div className="flex flex-1 flex-col gap-1">
                <span className="font-medium">{prompt.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {prompt.model}
                  </Badge>
                  {prompt.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              router.push('/dashboard?new=true');
              setOpen(false);
            }}
            className="flex items-center gap-2"
          >
            <PlusIcon className="size-4" />
            <span>Create New Prompt</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push('/teams/new');
              setOpen(false);
            }}
            className="flex items-center gap-2"
          >
            <UsersIcon className="size-4" />
            <span>Create Team</span>
          </CommandItem>
          {currentWorkspace.type === 'org' && (
            <>
              <CommandItem
                onSelect={() => {
                  router.push(`/teams/${(currentWorkspace as any).orgId}/settings`);
                  setOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <Settings className="size-4" />
                <span>Team Settings</span>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  router.push(`/teams/${(currentWorkspace as any).orgId}/settings#invites`);
                  setOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <UserPlus className="size-4" />
                <span>Invite Member</span>
              </CommandItem>
            </>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
