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
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, session?.user?.id])

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{prompt ? 'Edit Prompt' : 'New Prompt'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} />
                  </FormControl>
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
                      {...field}
                      value={field.value?.join(', ') || ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.split(',').map((tag) => tag.trim())
                        )
                      }
                      placeholder="Enter tags separated by commas"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
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