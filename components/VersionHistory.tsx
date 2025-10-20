'use client'

import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { 
  History, 
  GitBranch, 
  RotateCcw, 
  Edit3, 
  Plus,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useToast } from '@/components/ui/use-toast'
import { PromptVersion, VersionHistoryProps } from '@/lib/types/prompt-versions'

export function VersionHistory({ 
  promptId, 
  currentVersion, 
  onVersionSelect, 
  onRevert, 
  canEdit = true 
}: VersionHistoryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: versionData, isLoading, error } = useQuery({
    queryKey: ['prompt-versions', promptId],
    queryFn: async () => {
      const response = await fetch(`/api/prompts/${promptId}/versions`)
      if (!response.ok) {
        throw new Error('Failed to fetch version history')
      }
      return response.json()
    },
    enabled: !!promptId,
  })

  const handleRevert = async (version: number) => {
    if (!onRevert) return

    try {
      const response = await fetch(`/api/prompts/${promptId}/revert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_version: version }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to revert prompt')
      }

      const result = await response.json()
      
      toast({
        title: 'Version Reverted',
        description: `Reverted to version ${version}`,
      })

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['prompt-versions', promptId] })
      queryClient.invalidateQueries({ queryKey: ['prompts'] })

      onRevert(result.new_version)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to revert version',
        variant: 'destructive',
      })
    }
  }

  const handleVersionSelect = (version: PromptVersion) => {
    onVersionSelect?.(version)
  }

  const copyPromptText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied',
      description: 'Prompt text copied to clipboard',
    })
  }

  const getChangeTypeIcon = (changeType: string) => {
    switch (changeType) {
      case 'create':
        return <Plus className="h-3 w-3" />
      case 'edit':
        return <Edit3 className="h-3 w-3" />
      case 'fork':
        return <GitBranch className="h-3 w-3" />
      case 'revert':
        return <RotateCcw className="h-3 w-3" />
      default:
        return <Edit3 className="h-3 w-3" />
    }
  }

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'edit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'fork':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'revert':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading version history...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !versionData?.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">
              Failed to load version history
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const versions = versionData.versions || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Version History
          <Badge variant="secondary">{versions.length} versions</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {versions.map((version: PromptVersion) => (
          <Collapsible key={version.id}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {expandedVersion === version.version ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <Badge 
                      variant={version.version === currentVersion ? "default" : "outline"}
                      className="font-mono"
                    >
                      v{version.version}
                    </Badge>
                    <Badge 
                      className={`${getChangeTypeColor(version.change_type)} border-0`}
                    >
                      {getChangeTypeIcon(version.change_type)}
                      <span className="ml-1 capitalize">{version.change_type}</span>
                    </Badge>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{version.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {version.change_summary && (
                    <span className="text-xs text-muted-foreground max-w-48 truncate">
                      {version.change_summary}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyPromptText(version.prompt_text)
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {version.version !== currentVersion && canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRevert(version.version)
                        }}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-3 bg-muted/30 rounded-lg mt-2">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Model</label>
                    <div className="text-sm">{version.model}</div>
                  </div>
                  {version.tags.length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Tags</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {version.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Prompt Text</label>
                    <div className="mt-1 p-2 bg-background rounded border text-sm font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {version.prompt_text}
                    </div>
                  </div>
                  {version.description && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Description</label>
                      <div className="text-sm">{version.description}</div>
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        {versions.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">No version history available</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
