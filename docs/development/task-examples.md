# Multi-Agent Task Examples

This document provides practical examples of how to use the multi-agent methodology for specific features in the Prompt Manage MVP.

## Example 1: Implementing Prompt Versioning

### Task Assignment

**Feature**: Add versioning capability to prompts so users can track changes and revert to previous versions.

### Agent Coordination Workflow

#### 1. Project Manager Agent

**Prompt**: Use the Project Manager Agent prompt from `AGENT_PROMPTS.md`

**Task**: Define requirements and coordinate implementation

- Define versioning requirements (save versions on edit, show history, allow revert)
- Coordinate with Database Agent for schema changes
- Review final implementation

#### 2. Database & Schema Agent

**Prompt**: Use the Database & Schema Agent prompt from `AGENT_PROMPTS.md`

**Task**: Create prompt_versions table and update prompts table

```sql
-- Migration: add_prompt_versioning.sql
-- Add version tracking to prompts table
ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS current_version integer DEFAULT 1;

-- Create prompt_versions table
CREATE TABLE public.prompt_versions (
  id          uuid primary key default gen_random_uuid(),
  prompt_id   uuid references public.prompts on delete cascade,
  version     integer not null,
  name        text not null,
  description text,
  prompt_text text not null,
  model       text not null,
  tags        text[] default '{}',
  created_by  uuid references auth.users on delete cascade,
  created_at  timestamptz default now(),
  UNIQUE(prompt_id, version)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS prompt_versions_prompt_id_idx ON public.prompt_versions (prompt_id);
CREATE INDEX IF NOT EXISTS prompt_versions_created_at_idx ON public.prompt_versions (created_at);

-- Enable RLS
ALTER TABLE public.prompt_versions enable row level security;

-- RLS policies
CREATE POLICY "Users can manage their own prompt versions"
  ON public.prompt_versions FOR ALL
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Function to create new version
CREATE OR REPLACE FUNCTION create_prompt_version(
  p_prompt_id uuid,
  p_name text,
  p_description text,
  p_prompt_text text,
  p_model text,
  p_tags text[]
)
RETURNS integer AS $$
DECLARE
  next_version integer;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version), 0) + 1 INTO next_version
  FROM public.prompt_versions
  WHERE prompt_id = p_prompt_id;

  -- Insert new version
  INSERT INTO public.prompt_versions (
    prompt_id, version, name, description, prompt_text, model, tags, created_by
  ) VALUES (
    p_prompt_id, next_version, p_name, p_description, p_prompt_text, p_model, p_tags, auth.uid()
  );

  -- Update current version in prompts table
  UPDATE public.prompts
  SET current_version = next_version
  WHERE id = p_prompt_id;

  RETURN next_version;
END;
$$ LANGUAGE plpgsql;
```

#### 3. Backend Development Agent

**Prompt**: Use the Backend Development Agent prompt from `AGENT_PROMPTS.md`

**Task**: Create API endpoints for versioning

```typescript
// app/api/prompts/[id]/versions/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { id } = await context.params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get versions for the prompt
    const { data: versions, error } = await supabase
      .from('prompt_versions')
      .select('*')
      .eq('prompt_id', id)
      .eq('created_by', user.id)
      .order('version', { ascending: false });

    if (error) {
      console.error('Error fetching versions:', error);
      return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
    }

    return NextResponse.json(versions);
  } catch (error) {
    console.error('Versions API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { id } = await context.params;

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, prompt_text, model, tags } = await request.json();

    // Create new version using the function
    const { data, error } = await supabase.rpc('create_prompt_version', {
      p_prompt_id: id,
      p_name: name,
      p_description: description,
      p_prompt_text: prompt_text,
      p_model: model,
      p_tags: tags,
    });

    if (error) {
      console.error('Error creating version:', error);
      return NextResponse.json({ error: 'Failed to create version' }, { status: 500 });
    }

    return NextResponse.json({ version: data });
  } catch (error) {
    console.error('Create version API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

#### 4. Frontend Development Agent

**Prompt**: Use the Frontend Development Agent prompt from `AGENT_PROMPTS.md`

**Task**: Create versioning UI components

```typescript
// components/PromptVersionHistory.tsx
'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, RotateCcw } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface PromptVersion {
  id: string
  version: number
  name: string
  description: string | null
  prompt_text: string
  model: string
  tags: string[]
  created_at: string
}

interface PromptVersionHistoryProps {
  promptId: string
  onVersionSelect?: (version: PromptVersion) => void
}

export function PromptVersionHistory({ promptId, onVersionSelect }: PromptVersionHistoryProps) {
  const { toast } = useToast()
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(null)

  const { data: versions = [], isLoading } = useQuery({
    queryKey: ['prompt-versions', promptId],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('prompt_versions')
        .select('*')
        .eq('prompt_id', promptId)
        .order('version', { ascending: false })

      if (error) throw error
      return data as PromptVersion[]
    },
  })

  const handleVersionSelect = (version: PromptVersion) => {
    setSelectedVersion(version)
    onVersionSelect?.(version)
  }

  const handleRevert = async (version: PromptVersion) => {
    try {
      const response = await fetch(`/api/prompts/${promptId}/revert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: version.version }),
      })

      if (!response.ok) throw new Error('Failed to revert version')

      toast({
        title: 'Version Reverted',
        description: `Reverted to version ${version.version}`,
      })

      // Refresh data
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revert version',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return <div className="p-4">Loading version history...</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Version History ({versions.length} versions)
      </h3>

      <div className="space-y-2">
        {versions.map((version) => (
          <Card key={version.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">v{version.version}</Badge>
                  <span className="font-medium">{version.name}</span>
                  <Badge variant="outline">{version.model}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(version.created_at).toLocaleDateString()}
                </p>
                {version.description && (
                  <p className="text-sm text-muted-foreground">{version.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVersionSelect(version)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevert(version)}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Revert
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

#### 5. Testing & Quality Assurance Agent

**Prompt**: Use the Testing & Quality Assurance Agent prompt from `AGENT_PROMPTS.md`

**Task**: Create tests for versioning functionality

```typescript
// tests/prompt-versioning.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Prompt Versioning', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to dashboard
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/dashboard');
  });

  test('user can view version history', async ({ page }) => {
    // Create a prompt first
    await page.click('[data-testid="new-prompt-button"]');
    await page.fill('[data-testid="prompt-name"]', 'Test Prompt');
    await page.fill('[data-testid="prompt-text"]', 'Initial version');
    await page.click('[data-testid="save-prompt"]');

    // Edit the prompt to create a new version
    await page.click('[data-testid="edit-prompt"]');
    await page.fill('[data-testid="prompt-text"]', 'Updated version');
    await page.click('[data-testid="save-prompt"]');

    // Open version history
    await page.click('[data-testid="version-history"]');

    // Verify versions are displayed
    await expect(page.locator('text=v1')).toBeVisible();
    await expect(page.locator('text=v2')).toBeVisible();
  });

  test('user can revert to previous version', async ({ page }) => {
    // Setup: Create prompt with multiple versions
    // ... (setup code)

    // Revert to previous version
    await page.click('[data-testid="revert-version"]');

    // Verify revert confirmation
    await expect(page.locator('text=Version Reverted')).toBeVisible();
  });
});
```

#### 6. UI/UX Enhancement Agent

**Prompt**: Use the UI/UX Enhancement Agent prompt from `AGENT_PROMPTS.md`

**Task**: Enhance the versioning UI with animations and better UX

```typescript
// Enhanced version with animations and better UX
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { PromptVersionHistory } from './PromptVersionHistory'

export function EnhancedPromptVersionHistory({ promptId }: { promptId: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <span>Version History</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PromptVersionHistory promptId={promptId} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

## Example 2: Implementing Advanced Search

### Task Assignment

**Feature**: Add AI-powered search suggestions and advanced filtering options.

### Agent Coordination Workflow

#### 1. Project Manager Agent

- Define search requirements (AI suggestions, filters, performance)
- Coordinate with Backend Agent for search API
- Review search UX with UI/UX Agent

#### 2. Backend Development Agent

- Implement search API with full-text search
- Add AI-powered suggestions endpoint
- Optimize search performance

#### 3. Frontend Development Agent

- Create search component with suggestions
- Implement advanced filters
- Add search history

#### 4. UI/UX Enhancement Agent

- Add search animations
- Implement search suggestions dropdown
- Enhance search UX with keyboard navigation

#### 5. Testing & Quality Assurance Agent

- Test search functionality
- Validate search performance
- Test search accessibility

## Best Practices for Multi-Agent Collaboration

### 1. Communication

- Use clear, specific task descriptions
- Document dependencies between agents
- Share context and requirements clearly

### 2. Coordination

- Start with Project Manager Agent for planning
- Coordinate database changes first
- Test integration points between agents

### 3. Quality Assurance

- Each agent should validate their own work
- Testing Agent should verify end-to-end functionality
- Project Manager Agent should review final implementation

### 4. Documentation

- Update methodology document with new patterns
- Document agent-specific decisions
- Maintain clear feature documentation

This structured approach ensures efficient development while maintaining code quality and consistency across the Prompt Manage MVP.
