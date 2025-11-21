'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'

interface Category {
  id: string
  name: string
  slug: string
  icon_emoji: string
}

interface ToolFormData {
  name: string
  website_url: string
  description: string
  full_description?: string
  company_name?: string
  company_website?: string
  contact_email: string
  primary_category_id: string
  secondary_category_id?: string
  pricing_model: 'free' | 'freemium' | 'paid' | 'free_trial'
  pricing_tier?: string
  monthly_price?: number
  annual_price?: number
  has_free_trial?: boolean
  trial_duration_days?: number
  key_features: string
  use_cases: string
  integrations?: string
  platforms: string[]
  ai_models_used?: string
  api_available?: boolean
  is_open_source?: boolean
  github_url?: string
  founded_year?: number
}

export default function SubmitToolPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ToolFormData>({
    defaultValues: {
      pricing_model: 'freemium',
      platforms: ['web'],
    },
  })

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to submit a tool.',
          variant: 'destructive',
        })
        router.push('/?redirect=/directory/submit')
      } else {
        setIsAuthenticated(true)
        setValue('contact_email', session.user.email || '')
      }
    }
    void checkAuth()
  }, [supabase, router, toast, setValue])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/directory/categories')
        const data = await response.json()
        // Ensure data is an array
        if (Array.isArray(data)) {
          setCategories(data)
        } else {
          setCategories([])
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setCategories([])
      }
    }
    void fetchCategories()
  }, [])

  const pricingModel = watch('pricing_model')

  const onSubmit = async (data: ToolFormData) => {
    try {
      setIsLoading(true)

      // Convert comma-separated strings to arrays
      const submitData = {
        ...data,
        key_features: data.key_features
          .split(',')
          .map((f) => f.trim())
          .filter((f) => f),
        use_cases: data.use_cases
          .split(',')
          .map((u) => u.trim())
          .filter((u) => u),
        integrations: data.integrations
          ? data.integrations
            .split(',')
            .map((i) => i.trim())
            .filter((i) => i)
          : [],
        ai_models_used: data.ai_models_used
          ? data.ai_models_used
            .split(',')
            .map((m) => m.trim())
            .filter((m) => m)
          : [],
      }

      const response = await fetch('/api/directory/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const result = await response.json()

      toast({
        title: 'Success!',
        description:
          "Your tool has been submitted for review. We'll notify you once it's approved.",
      })

      router.push(`/directory/${result.slug}`)
    } catch (error: unknown) {
      console.error('Submission error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit tool'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/directory"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Directory
          </Link>

          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Submit Your AI Tool
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your tool with thousands of AI enthusiasts and professionals
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Tool Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., ChatGPT, Midjourney, Runway"
                    {...register('name', { required: 'Tool name is required' })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website_url">Website URL *</Label>
                  <Input
                    id="website_url"
                    type="url"
                    placeholder="https://example.com"
                    {...register('website_url', {
                      required: 'Website URL is required',
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Please enter a valid URL',
                      },
                    })}
                  />
                  {errors.website_url && (
                    <p className="mt-1 text-sm text-red-600">{errors.website_url.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Short Description *</Label>
                  <textarea
                    id="description"
                    placeholder="Brief description (150-300 characters)"
                    maxLength={300}
                    className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                    {...register('description', {
                      required: 'Description is required',
                      minLength: {
                        value: 50,
                        message: 'Description must be at least 50 characters',
                      },
                    })}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="full_description">Full Description</Label>
                  <textarea
                    id="full_description"
                    placeholder="Longer detailed description of your tool"
                    className="min-h-[120px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                    {...register('full_description')}
                  />
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Company Information
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    placeholder="Your company name"
                    {...register('company_name')}
                  />
                </div>

                <div>
                  <Label htmlFor="company_website">Company Website</Label>
                  <Input
                    id="company_website"
                    type="url"
                    placeholder="https://company.com"
                    {...register('company_website')}
                  />
                </div>

                <div>
                  <Label htmlFor="contact_email">Contact Email *</Label>
                  <Input id="contact_email" type="email" readOnly {...register('contact_email')} />
                </div>
              </div>
            </div>

            {/* Categorization */}
            <div>
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Categorization
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="primary_category">Primary Category *</Label>
                  <Select onValueChange={(value) => setValue('primary_category_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px]">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.primary_category_id && (
                    <p className="mt-1 text-sm text-red-600">Category is required</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="key_features">Key Features *</Label>
                  <textarea
                    id="key_features"
                    placeholder="Comma-separated list of features (e.g., Real-time collaboration, API access, Mobile app)"
                    className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                    {...register('key_features', {
                      required: 'At least one feature is required',
                    })}
                  />
                  {errors.key_features && (
                    <p className="mt-1 text-sm text-red-600">{errors.key_features.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="use_cases">Use Cases *</Label>
                  <textarea
                    id="use_cases"
                    placeholder="Comma-separated list of use cases (e.g., Content creation, Social media, Marketing)"
                    className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                    {...register('use_cases', {
                      required: 'At least one use case is required',
                    })}
                  />
                  {errors.use_cases && (
                    <p className="mt-1 text-sm text-red-600">{errors.use_cases.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Pricing Information
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="pricing_model">Pricing Model *</Label>
                  <Select
                    value={pricingModel}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onValueChange={(value: any) => setValue('pricing_model', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="freemium">Freemium</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="free_trial">Free Trial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {pricingModel === 'paid' && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="monthly_price">Monthly Price (USD)</Label>
                        <Input
                          id="monthly_price"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 29.99"
                          {...register('monthly_price', {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="annual_price">Annual Price (USD)</Label>
                        <Input
                          id="annual_price"
                          type="number"
                          step="0.01"
                          placeholder="e.g., 299.99"
                          {...register('annual_price', {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    </div>
                  </>
                )}

                {pricingModel === 'free_trial' && (
                  <div>
                    <Label htmlFor="trial_duration_days">Trial Duration (Days)</Label>
                    <Input
                      id="trial_duration_days"
                      type="number"
                      placeholder="e.g., 14"
                      {...register('trial_duration_days', {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Technical Details */}
            <div>
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Technical Details
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="ai_models_used">AI Models Used</Label>
                  <textarea
                    id="ai_models_used"
                    placeholder="Comma-separated list (e.g., GPT-4, Claude, Custom model)"
                    className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                    {...register('ai_models_used')}
                  />
                </div>

                <div>
                  <Label htmlFor="integrations">Integrations</Label>
                  <textarea
                    id="integrations"
                    placeholder="Comma-separated list (e.g., Zapier, Slack, GitHub)"
                    className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                    {...register('integrations')}
                  />
                </div>

                <div>
                  <Label htmlFor="github_url">GitHub URL (if open source)</Label>
                  <Input
                    id="github_url"
                    type="url"
                    placeholder="https://github.com/..."
                    {...register('github_url')}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
              <Link href="/directory" className="flex-1">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? 'Submitting...' : 'Submit Tool'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Box */}
        <div className="mt-8 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Note:</strong> Your submission will be reviewed within 24-48 hours. You'll
            receive an email confirmation once it's approved.
          </p>
        </div>
      </div>
    </div>
  )
}
