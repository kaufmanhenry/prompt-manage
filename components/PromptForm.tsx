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
import { createClient } from '@/utils/supabase/client'
import { useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'

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

  const form = useForm<Prompt>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: prompt?.name || '',
      prompt_text: prompt?.prompt_text || '',
      model: prompt?.model || 'gpt-4',
      tags: prompt?.tags || [],
      user_id: prompt?.user_id || session?.user?.id || '',
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
    })
  }, [prompt, session?.user?.id, form])

  const onSubmit = async (values: Prompt) => {
    if (!session?.user?.id) {
      console.error('No user session found')
      return
    }

    setLoading(true)
    try {
      const promptData = {
        ...values,
        user_id: session.user.id,
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
                  <FormControl>
                    <Input
                      value={tagInputValue}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault()
                          const value = tagInputValue.trim()
                          if (value && !field.value?.includes(value)) {
                            const newTags = [...(field.value || []), value]
                            field.onChange(newTags)
                            setTagInputValue('')
                          }
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.endsWith(',')) {
                          const tag = value.slice(0, -1).trim()
                          if (tag && !field.value?.includes(tag)) {
                            const newTags = [...(field.value || []), tag]
                            field.onChange(newTags)
                            setTagInputValue('')
                          }
                        } else {
                          setTagInputValue(value)
                        }
                      }}
                      placeholder="Type a tag and press Enter or comma"
                    />
                  </FormControl>
                  <FormDescription>
                    Add tags to help organize and find your prompts.
                  </FormDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-sm text-primary"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => {
                            const newTags = field.value?.filter((_, i) => i !== index)
                            field.onChange(newTags)
                          }}
                          className="rounded-full p-0.5 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
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