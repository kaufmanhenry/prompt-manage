'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { promptSchema, type Prompt, type Model } from '@/lib/schemas/prompt'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import MultipleSelector, { Option } from '@/components/ui/multi-select'
import { Controller } from 'react-hook-form'

interface PromptFormProps {
  prompt?: Prompt | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const models: Model[] = [
  'gpt-4',
  'gpt-3.5-turbo',
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-3-haiku',
  'gemini-pro',
  'mistral-large',
  'mistral-medium',
  'mistral-small',
]

export function PromptForm({ prompt, open, onOpenChange }: PromptFormProps) {
  const [loading, setLoading] = useState(false)
  const [tagInputValue, setTagInputValue] = useState('')
  const queryClient = useQueryClient()

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await createClient().auth.getSession()
      if (error) throw error
      return session
    },
  })

  const { data: collections = [] } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const { data, error } = await createClient()
        .from('collections')
        .select('id, name')
        .order('name', { ascending: true })
      if (error) throw error
      return data.map(c => ({ label: c.name, value: c.id }))
    },
  })

  const form = useForm<Prompt>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: prompt?.name || '',
      prompt_text: prompt?.prompt_text || '',
      model: prompt?.model || 'gpt-4',
      tags: prompt?.tags || [],
      user_id: prompt?.user_id || session?.user?.id || '',
      collection_ids: prompt?.collection_ids || [],
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
      collection_ids: prompt?.collection_ids || [],
      is_public: prompt?.is_public || false,
    })
  }, [prompt, session?.user?.id, form])

  const onSubmit = async (values: Prompt) => {
    if (!session?.user?.id) {
      console.error('No user session found')
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
        collection_ids: values.collection_ids,
        is_public: values.is_public,
        // Note: description, slug, view_count are not included
        // until the database migration is run
      }

      if (prompt?.id) {
        const { error } = await createClient()
          .from('prompts')
          .update(promptData)
          .eq('id', prompt.id)

        if (error) throw error
      } else {
        const { error } = await createClient()
          .from('prompts')
          .insert(promptData)

        if (error) throw error
      }

      queryClient.invalidateQueries({ queryKey: ['prompts'] })
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving prompt:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{prompt ? 'Edit Prompt' : 'New Prompt'}</DialogTitle>
          <DialogDescription>
            {prompt ? 'Update your existing prompt.' : 'Create a new prompt to use with your AI models.'}
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
                    <Input placeholder="Enter a name for your prompt" {...field} />
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
                  <FormDescription>
                    Choose the AI model that will use this prompt.
                  </FormDescription>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <Controller
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <MultipleSelector
                        value={field.value.map(v => ({ label: v, value: v }))}
                        onChange={(options) => field.onChange(options.map(o => o.value))}
                        placeholder="Select tags..."
                        creatable
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no tags found.
                          </p>
                        }
                      />
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="collection_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collections</FormLabel>
                  <Controller
                    control={form.control}
                    name="collection_ids"
                    render={({ field }) => (
                      <MultipleSelector
                        value={collections.filter((c: Option) => field.value.includes(c.value))}
                        onChange={(options) => field.onChange(options.map(o => o.value))}
                        defaultOptions={collections}
                        placeholder="Select collections..."
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no collections found.
                          </p>
                        }
                      />
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Public</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !session?.user?.id}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 