'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  Link as LinkIcon,
  Loader2,
  Lock,
  MoreVertical,
  PackageOpen,
  Play,
  Plus,
  SearchIcon,
  Share2,
  Trash2,
  TrendingUp,
  X,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/loading';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import type { Prompt } from '@/lib/schemas/prompt';
import type { PromptRunHistory } from '@/lib/schemas/prompt-run-history';
import { createClient } from '@/utils/supabase/client';

import CopyButton from './CopyButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface Filters {
  search: string;
  selectedTags: string[];
  selectedModels: string[];
}

interface PromptsTableProps {
  prompts: Prompt[];
  filters: Filters;
  onEditPrompt?: (prompt: Prompt) => void;
  onNewPrompt?: () => void;
  onClearFilters?: () => void;
  isLoading?: boolean;
}

interface PromptDetailsProps {
  prompt: Prompt | null;
  onEdit?: (prompt: Prompt) => void;
  onDelete?: (prompt: Prompt) => void;
  originalPromptSlug: string | null;
  onClose: () => void;
}

export function PromptsTable({
  prompts = [],
  filters,
  onEditPrompt,
  onNewPrompt,
  onClearFilters,
  isLoading = false,
}: PromptsTableProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [originalPromptSlug, setOriginalPromptSlug] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Debug selectedPrompt changes
  useEffect(() => {
    console.log('selectedPrompt changed:', selectedPrompt?.id);
  }, [selectedPrompt]);

  // Fetch original prompt slug when viewing a derivative prompt
  useEffect(() => {
    const fetchOriginalPromptSlug = async () => {
      if (selectedPrompt?.parent_prompt_id) {
        try {
          const { data, error } = await createClient()
            .from('prompts')
            .select('slug')
            .eq('id', selectedPrompt.parent_prompt_id)
            .single();

          if (!error && data?.slug) {
            setOriginalPromptSlug(data.slug);
          }
        } catch (err) {
          console.error('Error fetching original prompt slug:', err);
        }
      } else {
        setOriginalPromptSlug(null);
      }
    };

    fetchOriginalPromptSlug();
  }, [selectedPrompt?.parent_prompt_id]);

  const handleDeletePrompt = (prompt: Prompt) => {
    setPromptToDelete(prompt);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!promptToDelete) return;

    setDeleting(true);
    try {
      const { error } = await createClient()
        .from('prompts')
        .delete()
        .eq('id', promptToDelete.id)
        .eq('user_id', promptToDelete.user_id);

      if (error) throw error;

      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['prompts'] });

      toast({
        title: 'Prompt Deleted',
        description: `"${promptToDelete.name}" has been permanently deleted.`,
      });

      setShowDeleteDialog(false);
      setPromptToDelete(null);

      // Close the detailed view if it's open
      if (selectedPrompt?.id === promptToDelete.id) {
        setSelectedPrompt(null);
      }
    } catch (error) {
      console.error('Delete prompt error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete prompt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  // Filter prompts based on search and filters
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      !filters.search ||
      prompt.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      prompt.prompt_text.toLowerCase().includes(filters.search.toLowerCase());

    const matchesTags =
      filters.selectedTags.length === 0 ||
      filters.selectedTags.some((tag) => prompt.tags?.includes(tag));

    const matchesModels =
      filters.selectedModels.length === 0 || filters.selectedModels.includes(prompt.model);

    return matchesSearch && matchesTags && matchesModels;
  });

  // Show loading skeleton if data is loading
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Show empty state if no prompts
  if (prompts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <FileText className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No prompts yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get started by creating your first prompt. You can create prompts for different AI
            models and organize them with tags.
          </p>
          <Button onClick={onNewPrompt}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Prompt
          </Button>
        </div>
      </Card>
    );
  }

  // Show no results state if filters return no results
  if (
    filteredPrompts.length === 0 &&
    (filters.search || filters.selectedTags.length > 0 || filters.selectedModels.length > 0)
  ) {
    return (
      <Card className="p-12 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <SearchIcon className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No prompts found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search terms or filters to find what you&apos;re looking for.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              // Clear all filters
              onClearFilters?.();
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>
    );
  }

  // 4. Implement handleCopyPrompt
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/p/${selectedPrompt?.slug}`);
      toast({
        title: 'Copied!',
        description: 'Prompt text copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Debug Panel - only show if migration is not complete */}
      {/* Removed migration warning panel - sharing functionality is now enabled by default */}

      {selectedPrompt ? (
        <PromptDetails
          prompt={selectedPrompt}
          onEdit={onEditPrompt}
          onDelete={handleDeletePrompt}
          originalPromptSlug={originalPromptSlug}
          onClose={() => setSelectedPrompt(null)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer flex flex-col h-full"
              onClick={() => setSelectedPrompt(prompt)}
              data-testid="prompt-card"
            >
              <div className="flex-grow">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold line-clamp-1 flex-1">{prompt.name}</h3>
                    {prompt.is_public ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 border-green-200 ml-2"
                      >
                        <Globe className="mr-1 h-3 w-3" />
                        Public
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="ml-2">
                        <Lock className="mr-1 h-3 w-3" />
                        Private
                      </Badge>
                    )}
                  </div>
                  {prompt.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {prompt.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{prompt.model}</Badge>
                    {prompt.tags?.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                    {prompt.tags && prompt.tags.length > 2 && (
                      <Badge variant="outline">+{prompt.tags.length - 2}</Badge>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <pre className="text-sm text-muted-foreground line-clamp-3">
                    {prompt.prompt_text}
                  </pre>
                </div>

                {/* Stats for public prompts */}
                {prompt.is_public && (
                  <div className="mb-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{prompt.view_count} views</span>
                    </div>
                    {prompt.slug && (
                      <Link
                        href={`/p/${prompt.slug}`}
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Public Page
                      </Link>
                    )}
                  </div>
                )}

                {/* Derivative prompt indicator */}
                {prompt.parent_prompt_id && (
                  <div className="mb-4 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                    <LinkIcon className="h-3 w-3" />
                    <span>Derivative of public prompt</span>
                  </div>
                )}
              </div>

              <div
                className="flex items-center justify-between mt-auto pt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <CopyButton text={prompt.prompt_text} />
                  <Tooltip content="Run Prompt">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        console.log('Grid run prompt button clicked for:', prompt.id);
                        console.log('Current runningPrompts state:');
                        console.log('Button disabled state:');
                        alert('Grid button clicked! Testing basic functionality.');
                        // TODO: Implement run prompt functionality for grid view
                      }}
                      disabled={false} // Temporarily disable the disabled state for testing
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => toast({ title: 'Share action not implemented yet.' })}
                      >
                        <Share2 className="mr-2 size-4" />
                        {prompt.is_public ? 'Manage Sharing' : 'Share'}
                      </DropdownMenuItem>
                      {prompt.is_public && (
                        <DropdownMenuItem onClick={() => handleCopyLink()}>
                          <ExternalLink className="mr-2 size-4" />
                          Copy Link
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEditPrompt?.(prompt)}>
                        <Edit className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeletePrompt(prompt)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={false} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{/* Placeholder for Share Dialog Title */}</DialogTitle>
            <DialogDescription>{/* Placeholder for Share Dialog Description */}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">{/* Placeholder for Share Dialog Content */}</div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{promptToDelete?.name}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border p-4 bg-red-50 dark:bg-red-950">
              <h4 className="font-medium mb-2 flex items-center gap-2 text-red-800 dark:text-red-200">
                <Trash2 className="h-4 w-4" />
                Permanent Deletion
              </h4>
              <p className="text-sm text-red-600 dark:text-red-300">
                This prompt will be permanently deleted and cannot be recovered. If this prompt is
                public, it will also be removed from the public directory.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setPromptToDelete(null);
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete Prompt'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PromptDetailHeader({
  prompt,
  onRun,
  onEdit,
  onMore,
  runningPrompts,
}: {
  prompt: Prompt;
  onRun: () => void;
  onEdit: () => void;
  onMore: (action: string) => void;
  runningPrompts: Record<string, boolean>;
}) {
  return (
    <div className="flex items-center justify-between pb-4 border-b">
      <div>
        <h2 className="text-2xl font-semibold mb-1">{prompt.name}</h2>
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <Badge variant="secondary">{prompt.model}</Badge>
          {prompt.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="default" onClick={onRun} disabled={runningPrompts[prompt.id as string]}>
          {!runningPrompts[prompt.id as string] ? (
            <Play className="h-5 w-5 mr-2" />
          ) : (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          )}{' '}
          {runningPrompts[prompt.id as string] ? 'Running...' : 'Run'}
        </Button>
        <Button variant="outline" onClick={onEdit}>
          <Edit className="h-5 w-5 mr-2" /> Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onMore('share')}>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMore('copy')}>
              <Copy className="h-4 w-4 mr-2" /> Copy Prompt
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMore('delete')} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMore('close')}>
              <X className="h-4 w-4 mr-2" /> Close
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function PromptDetails({
  prompt,
  onEdit,
  onDelete,
  originalPromptSlug,
  onClose,
}: PromptDetailsProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [tab, setTab] = useState<'details' | 'history'>('details');
  const [selectedRun, setSelectedRun] = useState<PromptRunHistory | null>(null);
  const [runningPrompts, setRunningPrompts] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Query for prompt run history
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['prompt-run-history', prompt?.id],
    queryFn: async () => {
      if (!prompt?.id) return { success: false, history: [] };
      const response = await fetch(`/api/prompts/${prompt.id}/history?limit=50`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      return response.json();
    },
    enabled: !!prompt?.id,
  });

  const handleRunPrompt = async (prompt: Prompt) => {
    setRunningPrompts((prev) => ({ ...prev, [prompt.id as string]: true }));
    const promptId = prompt.id as string;

    try {
      const response = await fetch('/api/prompt/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to run prompt');
      }

      refetchHistory();

      toast({
        title: 'Prompt Executed',
        description: 'Your prompt has been successfully executed.',
      });
    } catch (error) {
      console.error('Run prompt error:', error);
      toast({
        title: 'Error',
        description: 'Failed to run prompt. Please try again.',
        variant: 'destructive',
      });
    }
    setRunningPrompts((prev) => ({ ...prev, [prompt.id as string]: false }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="size-3 text-green-800" />;
      case 'error':
        return <XCircle className="size-3 text-red-800" />;
      case 'timeout':
        return <AlertCircle className="size-3 text-yellow-800" />;
      default:
        return <AlertCircle className="size-3 text-gray-800" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 gap-1.5">
            {getStatusIcon(status)}
            Success
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive" className="gap-1.5">
            {getStatusIcon(status)}
            Error
          </Badge>
        );
      case 'timeout':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 gap-1.5">
            {getStatusIcon(status)}
            Timeout
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!prompt) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center h-full text-muted-foreground text-sm font-medium">
        <PackageOpen className="h-6 w-6" />
        <p>Select a prompt to view its details.</p>
      </div>
    );
  }

  const history = historyData?.history || [];

  // Handler for More dropdown
  const handleMore = (action: string) => {
    if (action === 'share') handleSharePrompt();
    else if (action === 'copy') handleCopyLink();
    else if (action === 'delete') onDelete?.(prompt);
    else if (action === 'close') onClose();
  };

  // 2. Implement handleSharePrompt and handleTogglePublic
  const handleSharePrompt = () => setShowShareDialog(true);
  const handleTogglePublic = async () => {
    if (!prompt) return;
    try {
      const response = await fetch(`/api/prompts/${prompt.id}/share`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_public: !prompt.is_public }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update prompt');
      }
      await refetchHistory();
      toast({
        title: prompt.is_public ? 'Prompt Made Private' : 'Prompt Published!',
        description: prompt.is_public
          ? 'Your prompt is now private and no longer accessible publicly.'
          : 'Your prompt has been published and is now publicly accessible.',
      });
      setShowShareDialog(false);
    } catch (error) {
      console.error('Error toggling public status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update prompt visibility. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // 4. Implement handleCopyPrompt
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/p/${prompt.slug}`);
      toast({
        title: 'Copied!',
        description: 'Prompt text copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-8 m-4 rounded-lg gap-6">
      <PromptDetailHeader
        prompt={prompt}
        onRun={() => handleRunPrompt(prompt)}
        onEdit={() => onEdit?.(prompt)}
        onMore={handleMore}
        runningPrompts={runningPrompts}
      />
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as 'details' | 'history')}
        className="w-full"
      >
        <TabsList className="mb-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">Run History</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          {/* Derivative and Public Link Info */}
          {prompt.is_public && prompt.slug && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950 px-2 py-1 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-green-800 dark:text-green-200 text-sm font-medium">
                    Public Link Available
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" /> Copy Link
                </Button>
              </div>
            </div>
          )}
          {prompt.parent_prompt_id && (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-2 mb-4">
              <div className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                  Derivative Prompt
                </span>
                {originalPromptSlug && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => window.open(`/p/${originalPromptSlug}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> View Original
                  </Button>
                )}
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                This prompt was copied from a public prompt and can be customized for your needs.
              </p>
            </div>
          )}
          {/* Prompt Text */}
          <div className="rounded-lg border bg-muted/50 p-6 mb-4 relative">
            <p className="text-xs font-medium text-muted-foreground mb-2">Prompt</p>
            <pre className="text-sm font-mono text-card-foreground whitespace-pre-wrap break-words">
              {prompt.prompt_text}
            </pre>
            <div className="absolute top-4 right-4">
              <CopyButton text={prompt.prompt_text} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Run History List */}
            <div className="flex-1 space-y-2">
              {historyLoading ? (
                <div className="text-center py-8">
                  <Spinner size="lg" />
                  <p className="text-sm text-muted-foreground mt-2">Loading history...</p>
                </div>
              ) : historyError ? (
                <div className="text-center py-8">
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600">Failed to load history</p>
                  <Button variant="outline" onClick={() => refetchHistory()}>
                    Retry
                  </Button>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No runs yet.</div>
              ) : (
                history.map((run: PromptRunHistory) => (
                  <Card
                    key={run.id}
                    className={`p-2 flex justify-between cursor-pointer hover:bg-accent/40 gap-2 ${
                      selectedRun?.id === run.id ? 'border-primary bg-accent/30' : ''
                    }`}
                    onClick={() => setSelectedRun(run)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{formatTimestamp(run.created_at)}</span>
                      {getStatusBadge(run.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-xs bg-accent px-2 py-1 rounded-lg">
                        {run.model}
                      </span>
                      <span className="font-medium text-xs bg-accent px-2 py-1 rounded-lg">
                        {run.tokens_used ?? '—'} tokens
                      </span>
                      <span className="font-medium text-xs bg-accent px-2 py-1 rounded-lg">
                        {formatDuration(run.execution_time_ms)}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
            {/* Run Details Panel */}
            <div className="flex-1 min-w-[300px]">
              {selectedRun ? (
                <Card className="p-4 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {formatTimestamp(selectedRun.created_at)}
                    </span>
                    {getStatusBadge(selectedRun.status)}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-xs bg-accent px-2 py-1 rounded-lg">
                        {selectedRun.model}
                      </span>
                      <span className="font-medium text-xs bg-accent px-2 py-1 rounded-lg">
                        {selectedRun.tokens_used ?? '—'} tokens
                      </span>
                      <span className="font-medium text-xs bg-accent px-2 py-1 rounded-lg">
                        {formatDuration(selectedRun.execution_time_ms)}
                      </span>
                    </div>
                  </div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="prompt" className="border-none">
                      <AccordionTrigger className="text-sm font-medium">Prompt</AccordionTrigger>
                      <AccordionContent>
                        <pre className="text-xs font-mono text-card-foreground whitespace-pre-wrap break-words bg-accent p-3 rounded-lg">
                          {selectedRun.prompt_text}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="rounded-lg border bg-muted/50 p-4 relative max-h-[400px] overflow-y-auto">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Response</p>
                    <pre className="text-sm font-mono text-card-foreground whitespace-pre-wrap break-words">
                      {selectedRun.response}
                    </pre>
                    <div className="absolute top-4 right-4">
                      <CopyButton text={selectedRun.response} />
                    </div>
                  </div>
                  {selectedRun.error_message && (
                    <div className="text-xs text-red-600">Error: {selectedRun.error_message}</div>
                  )}
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm font-medium border rounded-lg p-8">
                  <p>Select a run to view details.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{prompt.is_public ? 'Manage Prompt Sharing' : 'Share Prompt'}</DialogTitle>
            <DialogDescription>
              {prompt.is_public
                ? `"${prompt.name}" is currently public`
                : `Make "${prompt.name}" publicly accessible`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {prompt.is_public ? (
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    Public Link Available
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Anyone with this link can view your prompt
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => handleCopyLink()} className="flex-1">
                      <ExternalLink className="mr-2 size-4" />
                      Copy Link
                    </Button>
                    {prompt.slug && (
                      <a href={`/p/${prompt.slug}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">
                          <ExternalLink className="size-4" />
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Make Private</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Remove this prompt from public access
                  </p>
                  <Button variant="outline" onClick={handleTogglePublic} className="w-full">
                    {prompt.is_public ? 'Updating...' : 'Make Private'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h4 className="font-medium mb-2">Publish to Public Directory</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Make this prompt publicly accessible and discoverable
                  </p>
                  <Button onClick={handleTogglePublic} className="w-full">
                    {prompt.is_public ? 'Publishing...' : 'Publish Prompt'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
