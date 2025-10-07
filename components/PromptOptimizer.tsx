'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  Copy, 
  Sparkles,
  TrendingUp,
  Target,
  FileText
} from 'lucide-react'

interface PromptAnalysis {
  score: number
  suggestions: string[]
  strengths: string[]
  improvements: string[]
  optimizedPrompt?: string
}

const examplePrompts = [
  "Write a blog post about AI",
  "Create a marketing email for our new product launch",
  "Help me write a professional email to my boss about working from home",
  "Generate ideas for a startup business",
  "Explain quantum computing in simple terms",
  "Write a Python function to sort a list",
  "Create a social media post for our company's anniversary",
  "Help me write a cover letter for a software engineer position"
]

export default function PromptOptimizer() {
  const [prompt, setPrompt] = useState('')
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const analyzePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt to analyze',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/optimizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt.trim(),
          generateOptimized: true 
        }),
      })

      if (!response.ok) {
        if (response.status === 429) {
          const data = await response.json()
          toast({
            title: 'Rate limit exceeded',
            description: 'Please wait a moment before trying again.',
            variant: 'destructive'
          })
          return
        }
        throw new Error('Failed to analyze prompt')
      }

      const result = await response.json()
      setAnalysis(result)
      
      toast({
        title: 'Analysis Complete!',
        description: `Your prompt scored ${result.score}/100. Check the suggestions below.`,
      })
    } catch (error) {
      console.error('Analysis error:', error)
      toast({
        title: 'Error',
        description: 'Failed to analyze prompt. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: 'Prompt copied to clipboard',
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 dark:bg-green-900/20'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
    return 'text-red-600 bg-red-50 dark:bg-red-900/20'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Needs Work'
    return 'Poor'
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Prompt Optimizer
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Get 3x better results from AI with optimized prompts. Analyze your prompt and get specific suggestions for improvement.
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Prompt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your prompt here... For example: 'Write a blog post about AI'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {prompt.length} characters
            </span>
            <Button 
              onClick={analyzePrompt} 
              disabled={loading || !prompt.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analyze Prompt
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Overall Score:
                    </span>
                    <Badge className={`${getScoreColor(analysis.score)} font-semibold`}>
                      {analysis.score}/100 - {getScoreLabel(analysis.score)}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        analysis.score >= 80 ? 'bg-green-500' : 
                        analysis.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${analysis.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  What's Working Well
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {strength}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Lightbulb className="h-5 w-5" />
                  Suggestions for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {suggestion}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Optimized Prompt */}
          {analysis.optimizedPrompt && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Optimized Prompt
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(analysis.optimizedPrompt!)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {analysis.optimizedPrompt}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tips Section */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Lightbulb className="h-5 w-5" />
            Pro Tips for Better Prompts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Be Specific</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Instead of "write about AI", try "write a 500-word blog post about AI in healthcare for medical professionals"
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Provide Context</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Include background information, target audience, and the purpose of your request
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Specify Format</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Tell the AI exactly how you want the output formatted (bullet points, paragraphs, etc.)
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Add Examples</h4>
              <p className="text-blue-700 dark:text-blue-300">
                Include examples of what you want or don't want to guide the AI's response
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
