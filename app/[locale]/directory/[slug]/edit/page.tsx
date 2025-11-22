'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
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
    id: string
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

export default function EditToolPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const router = useRouter()
    const { toast } = useToast()
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const supabase = createClient()

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ToolFormData>({
        defaultValues: {
            pricing_model: 'freemium',
            platforms: ['web'],
        },
    })

    // Fetch tool data and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const categoriesRes = await fetch('/api/directory/categories')
                const categoriesData = await categoriesRes.json()
                if (Array.isArray(categoriesData)) {
                    setCategories(categoriesData)
                }

                // Fetch tool data
                const { data: tool, error } = await supabase
                    .from('ai_tools')
                    .select('*')
                    .eq('slug', slug)
                    .single()

                if (error || !tool) {
                    toast({
                        title: 'Error',
                        description: 'Tool not found',
                        variant: 'destructive',
                    })
                    router.push('/directory')
                    return
                }

                // Populate form
                reset({
                    ...tool,
                    key_features: Array.isArray(tool.key_features) ? tool.key_features.join(', ') : tool.key_features,
                    use_cases: Array.isArray(tool.use_cases) ? tool.use_cases.join(', ') : tool.use_cases,
                    integrations: Array.isArray(tool.integrations) ? tool.integrations.join(', ') : tool.integrations,
                    ai_models_used: Array.isArray(tool.ai_models_used) ? tool.ai_models_used.join(', ') : tool.ai_models_used,
                })
            } catch (error) {
                console.error('Error fetching data:', error)
                toast({
                    title: 'Error',
                    description: 'Failed to load tool data',
                    variant: 'destructive',
                })
            } finally {
                setIsLoading(false)
            }
        }
        void fetchData()
    }, [slug, supabase, router, toast, reset])

    const pricingModel = watch('pricing_model')

    const onSubmit = async (data: ToolFormData) => {
        try {
            setIsSaving(true)

            // Convert comma-separated strings to arrays
            const submitData = {
                ...data,
                key_features: typeof data.key_features === 'string'
                    ? data.key_features.split(',').map((f) => f.trim()).filter((f) => f)
                    : data.key_features,
                use_cases: typeof data.use_cases === 'string'
                    ? data.use_cases.split(',').map((u) => u.trim()).filter((u) => u)
                    : data.use_cases,
                integrations: typeof data.integrations === 'string'
                    ? data.integrations.split(',').map((i) => i.trim()).filter((i) => i)
                    : [],
                ai_models_used: typeof data.ai_models_used === 'string'
                    ? data.ai_models_used.split(',').map((m) => m.trim()).filter((m) => m)
                    : [],
            }

            const response = await fetch('/api/directory/tools', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData),
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            toast({
                title: 'Success!',
                description: 'Tool updated successfully.',
            })

            router.push(`/directory/${slug}`)
            router.refresh()
        } catch (error: unknown) {
            console.error('Update error:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to update tool'
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/directory/${slug}`}
                        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tool
                    </Link>

                    <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Tool
                    </h1>
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
                                        {...register('website_url', {
                                            required: 'Website URL is required',
                                        })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Short Description *</Label>
                                    <textarea
                                        id="description"
                                        maxLength={300}
                                        className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                                        {...register('description', {
                                            required: 'Description is required',
                                        })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="full_description">Full Description</Label>
                                    <textarea
                                        id="full_description"
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
                                        {...register('company_name')}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="company_website">Company Website</Label>
                                    <Input
                                        id="company_website"
                                        type="url"
                                        {...register('company_website')}
                                    />
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
                                    <Select
                                        onValueChange={(value) => setValue('primary_category_id', value)}
                                        defaultValue={watch('primary_category_id')}
                                    >
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
                                </div>

                                <div>
                                    <Label htmlFor="key_features">Key Features *</Label>
                                    <textarea
                                        id="key_features"
                                        className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                                        {...register('key_features', { required: true })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="use_cases">Use Cases *</Label>
                                    <textarea
                                        id="use_cases"
                                        className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                                        {...register('use_cases', { required: true })}
                                    />
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
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="monthly_price">Monthly Price (USD)</Label>
                                            <Input
                                                id="monthly_price"
                                                type="number"
                                                step="0.01"
                                                {...register('monthly_price', { valueAsNumber: true })}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="annual_price">Annual Price (USD)</Label>
                                            <Input
                                                id="annual_price"
                                                type="number"
                                                step="0.01"
                                                {...register('annual_price', { valueAsNumber: true })}
                                            />
                                        </div>
                                    </div>
                                )}

                                {pricingModel === 'free_trial' && (
                                    <div>
                                        <Label htmlFor="trial_duration_days">Trial Duration (Days)</Label>
                                        <Input
                                            id="trial_duration_days"
                                            type="number"
                                            {...register('trial_duration_days', { valueAsNumber: true })}
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
                                        className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                                        {...register('ai_models_used')}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="integrations">Integrations</Label>
                                    <textarea
                                        id="integrations"
                                        className="min-h-[80px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                                        {...register('integrations')}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="github_url">GitHub URL</Label>
                                    <Input
                                        id="github_url"
                                        type="url"
                                        {...register('github_url')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
                            <Link href={`/directory/${slug}`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}
