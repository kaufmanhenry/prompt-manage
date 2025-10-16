'use client'

import {
  Brain,
  Copy,
  Lightbulb,
  Save,
  Sparkles,
  User,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useFreeTool } from '@/hooks/useFreeTool'

interface ClaudePrompt {
  prompt: string
  context?: string
  complexity?: string
  domain?: string
  taskType?: string
  suggestions?: string[]
}

export default function ClaudePromptCreator() {
  const [requirements, setRequirements] = useState('')
  const [context, setContext] = useState('')
  const [complexity, setComplexity] = useState('')
  const [domain, setDomain] = useState('')
  const [taskType, setTaskType] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState<ClaudePrompt | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const { isLoggedIn, rateLimit, checkRateLimit, logUsage, saveToLibrary } = useFreeTool({ 
    toolName: 'claude-creator' 
  })

  const generatePrompt = async () => {
    if (!requirements.trim()) {
      toast({
        title: 'Requirements needed',
        description: 'Please describe what you want Claude to help you with.',
        variant: 'destructive',
      })
      return
    }

    // Check rate limit for non-logged-in users
    const allowed = await checkRateLimit()
    if (!allowed) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/claude-prompt-creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requirements,
          context,
          complexity,
          domain,
          taskType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate prompt')
      }

      const data = await response.json()
      setGeneratedPrompt(data)

      // Log usage
      await logUsage(data.prompt)

      toast({
        title: 'Prompt Generated!',
        description: isLoggedIn 
          ? 'Your Claude prompt is ready.' 
          : `Generated! You have ${rateLimit?.remaining || 0} free uses remaining today.`,
      })
    } catch (error) {
      console.error('Error generating prompt:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate prompt. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const copyPrompt = async () => {
    if (!generatedPrompt?.prompt) return
    
    try {
      await navigator.clipboard.writeText(generatedPrompt.prompt)
      toast({
        title: 'Copied!',
        description: 'Prompt copied to clipboard.',
      })
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const handleSaveToLibrary = async () => {
    if (!generatedPrompt?.prompt) return

    setSaving(true)
    try {
      const promptData = {
        name: `Claude: ${requirements.slice(0, 50)}${requirements.length > 50 ? '...' : ''}`,
        prompt_text: generatedPrompt.prompt,
        model: 'claude-3-5-sonnet-20241022',
        tags: [domain, complexity, taskType].filter(Boolean),
        description: `Generated Claude prompt for: ${requirements.slice(0, 100)}`,
      }

      const result = await saveToLibrary(promptData)

      if (result.success) {
        // Optionally redirect to the saved prompt
        // router.push(`/dashboard?prompt=${result.promptId}`)
      }
    } catch (error) {
      console.error('Error saving prompt:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            <Brain className="h-4 w-4" />
            Free AI Tool
          </div>
        </div>
        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Claude Prompt Creator
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Generate perfect prompts for Claude AI. Leverage Claude's strengths in reasoning, analysis, and creative problem-solving.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Configure Your Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="requirements">What do you want Claude to help you with?</Label>
              <Textarea
                id="requirements"
                placeholder="e.g., Analyze market trends for sustainable energy and provide strategic recommendations for a startup"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="context">Additional Context (Optional)</Label>
              <Textarea
                id="context"
                placeholder="e.g., Target audience: B2B SaaS companies, Budget: $50k-100k, Timeline: 6 months"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="mt-1"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="complexity">Complexity Level</Label>
                <Select value={complexity} onValueChange={setComplexity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="domain">Domain</Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creative">Creative</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="taskType">Task Type</Label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analysis">Analysis</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="problem-solving">Problem Solving</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="explanation">Explanation</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generatePrompt} 
              disabled={loading || !requirements.trim()}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Skeleton className="mr-2 h-4 w-4" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Claude Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Prompt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Generated Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedPrompt ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-accent p-4">
                  <pre className="whitespace-pre-wrap break-words text-sm">
                    {generatedPrompt.prompt}
                  </pre>
                </div>

                {generatedPrompt.suggestions && generatedPrompt.suggestions.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Suggestions:
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {generatedPrompt.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Lightbulb className="mt-0.5 h-3 w-3 text-yellow-500" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={copyPrompt} variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Prompt
                  </Button>
                  <Button 
                    onClick={handleSaveToLibrary} 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Skeleton className="mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isLoggedIn ? 'Save to Library' : 'Sign Up to Save'}
                      </>
                    )}
                  </Button>
                </div>
                
                {!isLoggedIn && rateLimit && rateLimit.remaining !== null && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{rateLimit.remaining} free uses remaining</strong> today. 
                      {' '}
                      <Link href="/?redirect=/dashboard" className="font-semibold text-blue-600 hover:underline">
                        Sign up free
                      </Link> for unlimited access.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                  <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 text-purple-600" />
                    <div className="text-sm">
                      <p className="font-medium text-purple-800 dark:text-purple-200">
                        Want to save this prompt?
                      </p>
                      <p className="text-purple-700 dark:text-purple-300">
                        Create a free account to save prompts, organize them by project, and access 300+ templates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Brain className="mx-auto mb-2 h-12 w-12" />
                <p>Your generated Claude prompt will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Tips for Better Results with Claude
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Leverage Claude's Strengths</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Claude excels at reasoning, analysis, and ethical considerations. Ask for detailed explanations.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Provide Rich Context</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Claude performs better with comprehensive background information and specific constraints.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Ask for Reasoning</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Request Claude to explain its thought process, especially for complex problem-solving tasks.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Consider Ethical Implications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Claude is particularly good at considering ethical aspects - leverage this for responsible AI use.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
