'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Copy,
  Sparkles,
  Code,
  Save,
  User
} from 'lucide-react'
import Link from 'next/link'

interface CursorPrompt {
  prompt: string
  framework?: string
  complexity?: string
  language?: string
  taskType?: string
  suggestions?: string[]
}

export default function CursorPromptCreator() {
  const [requirements, setRequirements] = useState('')
  const [framework, setFramework] = useState('')
  const [complexity, setComplexity] = useState('')
  const [language, setLanguage] = useState('')
  const [taskType, setTaskType] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState<CursorPrompt | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generatePrompt = async () => {
    if (!requirements.trim()) {
      toast({
        title: 'Requirements needed',
        description: 'Please describe what you want to build.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/cursor-prompt-creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requirements,
          framework,
          complexity,
          language,
          taskType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate prompt')
      }

      const data = await response.json()
      setGeneratedPrompt(data)
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

  const saveToLibrary = () => {
    // Redirect to signup/login with the prompt data
    const promptData = {
      name: `Cursor: ${requirements.slice(0, 50)}...`,
      prompt_text: generatedPrompt?.prompt || '',
      model: 'cursor',
      tags: [framework, complexity, language, taskType].filter(Boolean),
      description: `Generated Cursor prompt for ${requirements}`,
    }
    
    // Store in sessionStorage for after login
    sessionStorage.setItem('pendingPrompt', JSON.stringify(promptData))
    
    // Redirect to signup
    window.location.href = '/?redirect=/dashboard'
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Code className="h-4 w-4" />
            Free Developer Tool
          </div>
        </div>
        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Cursor Prompt Creator
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Generate perfect prompts for Cursor AI code editor. Get better code generation with prompts tailored to your specific needs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Configure Your Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="requirements">What do you want to build?</Label>
              <Textarea
                id="requirements"
                placeholder="e.g., Create a React component for user authentication with form validation and error handling"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="framework">Framework</Label>
                <Select value={framework} onValueChange={setFramework}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="vue">Vue</SelectItem>
                    <SelectItem value="angular">Angular</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="django">Django</SelectItem>
                    <SelectItem value="flask">Flask</SelectItem>
                    <SelectItem value="nextjs">Next.js</SelectItem>
                    <SelectItem value="nuxt">Nuxt</SelectItem>
                    <SelectItem value="svelte">Svelte</SelectItem>
                    <SelectItem value="vanilla">Vanilla JS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="complexity">Complexity</Label>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                    <SelectItem value="swift">Swift</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="taskType">Task Type</Label>
                <Select value={taskType} onValueChange={setTaskType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="component">Component</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="refactor">Refactor</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="optimize">Optimize</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  Generate Cursor Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Prompt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-green-600" />
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
                  <Button onClick={saveToLibrary} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="mr-2 h-4 w-4" />
                    Save to Library
                  </Button>
                </div>

                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                  <div className="flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 text-blue-600" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-800 dark:text-blue-200">
                        Want to save this prompt?
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        Create a free account to save prompts, organize them by project, and access 300+ templates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <Code className="mx-auto mb-2 h-12 w-12" />
                <p>Your generated Cursor prompt will appear here</p>
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
            Tips for Better Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Be Specific</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Include details about functionality, styling, and any specific requirements.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Mention Constraints</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Specify performance requirements, browser support, or architectural decisions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Include Examples</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Provide sample data or expected input/output formats when relevant.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">State Your Skill Level</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This helps generate code appropriate for your experience level.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}