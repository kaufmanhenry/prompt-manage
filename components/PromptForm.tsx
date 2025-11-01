'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { Option } from '@/components/ui/multi-select'
import MultipleSelector from '@/components/ui/multi-select'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useTeamContext } from '@/contexts/team-context'
import { usePaywall } from '@/hooks/usePaywall'
import { getModelsByCategory } from '@/lib/models'
import type { Prompt } from '@/lib/schemas/prompt'
import { promptSchema } from '@/lib/schemas/prompt'
import { createClient } from '@/utils/supabase/client'

interface PromptFormProps {
  prompt?: Prompt | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const modelsByCategory = getModelsByCategory()

export function PromptForm({ prompt, open, onOpenChange }: PromptFormProps) {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { currentTeamId } = useTeamContext()
  const {
    canCreatePrompt,
    showPaywall,
    PaywallComponent,
    isLoading: isPaywallLoading,
  } = usePaywall('Create Prompts')

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.setAttribute('data-1p-ignore', 'true')
      textareaRef.current.setAttribute('data-lpignore', 'true')
    }
  }, [open])

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  // Fetch all tags from user's existing prompts
  const { data: userTags = [] } = useQuery({
    queryKey: ['user-tags', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []

      const { data, error } = await createClient()
        .from('prompts')
        .select('tags')
        .eq('user_id', session.user.id)
        .not('tags', 'is', null)

      if (error) {
        console.error('Error fetching user tags:', error)
        return []
      }

      // Extract all unique tags from user's prompts
      const allTags = new Set<string>()
      data?.forEach((prompt) => {
        if (prompt.tags && Array.isArray(prompt.tags)) {
          prompt.tags.forEach((tag) => allTags.add(tag))
        }
      })

      return Array.from(allTags).sort()
    },
    enabled: !!session?.user?.id,
  })

  // Convert tags to Option format for MultipleSelector
  const tagOptions: Option[] = userTags.map((tag) => ({
    label: tag,
    value: tag,
  }))

  const form = useForm<Prompt>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: prompt?.name || '',
      prompt_text: prompt?.prompt_text || '',
      model: prompt?.model || 'gpt-4o-mini',
      tags: prompt?.tags || [],
      user_id: prompt?.user_id || session?.user?.id || '',
      is_public: prompt?.is_public || false,
    },
  })

  // Reset form values when prompt changes (for editing)
  useEffect(() => {
    form.reset({
      name: prompt?.name || '',
      prompt_text: prompt?.prompt_text || '',
      model: prompt?.model || 'gpt-4o-mini',
      tags: prompt?.tags || [],
      user_id: prompt?.user_id || session?.user?.id || '',
      is_public: prompt?.is_public || false,
    })
  }, [prompt, session?.user?.id, form])

  const onSubmit = async (values: Prompt) => {
    if (!session?.user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'Please log in to save prompts.',
        variant: 'destructive',
      })
      return
    }

    if (!currentTeamId) {
      toast({
        title: 'Team Required',
        description: 'Please select a team to save prompts.',
        variant: 'destructive',
      })
      return
    }

    // Check if user can create prompt (only for new prompts, not edits)
    if (!prompt?.id && !isPaywallLoading && !canCreatePrompt) {
      showPaywall()
      return
    }

    setLoading(true)
    try {
      // Only save the fields that exist in the current database schema
      const promptData = {
        name: values.name,
        prompt_text: values.prompt_text,
        model: values.model,
        tags: values.tags,
        user_id: session.user.id,
        team_id: currentTeamId,
        is_public: values.is_public,
        // Note: description, slug, view_count are not included
        // until the database migration is run
      }

      if (prompt?.id) {
        // Update existing prompt
        const { error } = await createClient()
          .from('prompts')
          .update(promptData)
          .eq('id', prompt.id)

        if (error) throw error

        toast({
          title: 'Prompt Updated',
          description: `"${values.name}" has been successfully updated.`,
        })
      } else {
        // Create new prompt via API (enforces limits server-side)
        const response = await fetch('/api/prompts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(promptData),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))

          // Handle limit reached error
          if (response.status === 403) {
            toast({
              title: 'Prompt Limit Reached',
              description:
                errorData.details ||
                'You have reached your prompt limit. Please upgrade or delete prompts.',
              variant: 'destructive',
            })
            showPaywall()
            return
          }

          throw new Error(errorData.error || 'Failed to create prompt')
        }

        toast({
          title: 'Prompt Created',
          description: `"${values.name}" has been successfully created.`,
        })
        // Reset form after successful creation
        form.reset({
          name: '',
          prompt_text: '',
          model: 'gpt-4o-mini',
          tags: [],
          user_id: session.user.id,
          is_public: false,
        })
      }

      void queryClient.invalidateQueries({ queryKey: ['prompts'] })
      void queryClient.invalidateQueries({ queryKey: ['user-tags'] })
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving prompt:', error)
      toast({
        title: 'Error',
        description: prompt?.id
          ? 'Failed to update prompt. Please try again.'
          : 'Failed to create prompt. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{prompt ? 'Edit Prompt' : 'New Prompt'}</DialogTitle>
            <DialogDescription>
              {prompt
                ? 'Update your existing prompt.'
                : 'Create a new prompt to use with your AI models.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a name for your prompt"
                        data-testid="prompt-name"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description field - uncomment after running database migration
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of what this prompt does" {...field} />
                  </FormControl>
                  <FormDescription>
                    A short description to help you remember what this prompt is for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      data-testid="prompt-model"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[400px]">
                        {Object.entries(modelsByCategory).map(
                          ([category, models]) =>
                            models.length > 0 && (
                              <SelectGroup key={category}>
                                <SelectLabel>
                                  {category === 'LLM' && 'Language Models'}
                                  {category === 'Music' && 'Music Generation'}
                                  {category === 'Video' && 'Video Generation'}
                                  {category === 'Image' && 'Image Generation'}
                                  {category === 'Voice' && 'Voice Synthesis'}
                                  {category === 'Code' && 'Code Assistants'}
                                </SelectLabel>
                                {models.map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    {model.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the AI model that will use this prompt.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!prompt && (
                <FormField
                  control={form.control}
                  name="prompt_text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your prompt text here..."
                          className="min-h-[200px] font-mono"
                          data-testid="prompt-text"
                          autoComplete="off"
                          {...field}
                          ref={textareaRef}
                        />
                      </FormControl>
                      <FormDescription>
                        The actual prompt that will be sent to the AI model.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <Controller
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <MultipleSelector
                          value={field.value.map((v) => ({ label: v, value: v }))}
                          onChange={(options: Option[]) =>
                            field.onChange(options.map((o) => o.value))
                          }
                          placeholder="Select tags..."
                          creatable
                          emptyIndicator={
                            <p className="text-center text-sm font-medium text-muted-foreground">
                              no tags found.
                            </p>
                          }
                          defaultOptions={tagOptions}
                          data-testid="prompt-tags"
                          inputProps={{
                            autoComplete: 'off',
                          }}
                        />
                      )}
                    />
                    <FormMessage />
                    <FormDescription>
                      Select from your existing tags or create new ones. Tags help organize and find
                      your prompts.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_public"
                render={({ field }) => (
                  <FormItem className="rounded-lg bg-accent p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <FormLabel>Public</FormLabel>
                        <FormDescription>
                          Make this prompt public so others can use it.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="z-5 sticky -bottom-6 flex justify-end gap-2 border-t bg-background py-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !session?.user?.id}
                  data-testid="submit-prompt"
                >
                  {loading ? 'Saving...' : prompt ? 'Update Prompt' : 'Create Prompt'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {PaywallComponent}
    </>
  )
}
