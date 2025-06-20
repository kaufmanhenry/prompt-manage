'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { promptSchema, Prompt, modelSchema } from '@/lib/schemas/prompt'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import MultipleSelector, { Option } from '@/components/ui/multi-select'

interface PromptFormProps {
  prompt?: Prompt | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const models = modelSchema.options

export function PromptForm({ prompt, open, onOpenChange }: PromptFormProps) {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await createClient().auth.getSession()
      return session
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
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <Controller
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <MultipleSelector
                        value={field.value.map(v => ({ label: v, value: v }))}
                        onChange={(options: Option[]) => field.onChange(options.map(o => o.value))}
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