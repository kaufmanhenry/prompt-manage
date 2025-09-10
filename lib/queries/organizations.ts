import { useQuery } from '@tanstack/react-query';

export type Organization = {
  id: string;
  name: string;
  slug: string;
};

export function useOrganizations() {
  return useQuery<Organization[]>({
    queryKey: ['organizations'],
    queryFn: async () => {
      const res = await fetch('/api/organizations');
      if (!res.ok) throw new Error('Failed to load organizations');
      return (await res.json()) as Organization[];
    },
    staleTime: 60_000,
  });
}
