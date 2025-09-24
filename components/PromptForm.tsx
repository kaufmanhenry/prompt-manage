'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import type { Prompt } from '@/lib/schemas/prompt'
import { modelSchema, promptSchema } from '@/lib/schemas/prompt'
import { createClient } from '@/utils/supabase/client'

interface PromptFormProps {
  prompt?: Prompt | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const models = modelSchema.options

export function PromptForm({ prompt, open, onOpenChange }: PromptFormProps) {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const { toast } = useToast()

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
      model: prompt?.model || 'gpt-4',
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
      model: prompt?.model || 'gpt-4',
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

    setLoading(true)
    try {
      // Only save the fields that exist in the current database schema
      const promptData = {
        name: values.name,
        prompt_text: values.prompt_text,
        model: values.model,
        tags: values.tags,
        user_id: session.user.id,
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
        // Create new prompt
        const { error } = await createClient().from('prompts').insert(promptData)

        if (error) throw error

        toast({
          title: 'Prompt Created',
          description: `"${values.name}" has been successfully created.`,
        })
        // Reset form after successful creation
        form.reset({
          name: '',
          prompt_text: '',
          model: 'gpt-4',
          tags: [],
          user_id: session.user.id,
          is_public: false,
        })
      }

      queryClient.invalidateQueries({ queryKey: ['prompts'] })
      queryClient.invalidateQueries({ queryKey: ['user-tags'] })
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
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the AI model that will use this prompt.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The actual prompt that will be sent to the AI model.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
  )
}
