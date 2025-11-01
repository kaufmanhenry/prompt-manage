'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Download, Upload, FileText, FileJson, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useState, useRef } from 'react'

import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'

export default function ImportExportPage() {
  const [importFormat, setImportFormat] = useState<'csv' | 'json'>('csv')
  const [skipDuplicates, setSkipDuplicates] = useState(true)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    imported: number
    skipped: number
    errors: number
    total: number
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  const { data: prompts = [] } = useQuery({
    queryKey: ['prompts', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      const { data, error } = await createClient()
        .from('prompts')
        .select('id, name, prompt_text')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!session?.user?.id,
  })

  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const fileInput = fileInputRef.current
    if (!fileInput?.files || fileInput.files.length === 0) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to import',
        variant: 'destructive',
      })
      return
    }

    const file = fileInput.files[0]

    // File size validation (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'File size must be less than 10MB',
        variant: 'destructive',
      })
      return
    }

    // File type validation
    const validTypes = importFormat === 'csv' ? ['.csv', 'text/csv'] : ['.json', 'application/json']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!validTypes.includes(fileExtension) && !validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: `Please select a ${importFormat.toUpperCase()} file`,
        variant: 'destructive',
      })
      return
    }

    setImporting(true)
    setImportResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('format', importFormat)
      formData.append('skipDuplicates', skipDuplicates.toString())

      const response = await fetch('/api/prompts/bulk-import', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to import prompts')
      }

      setImportResult({
        imported: result.imported || 0,
        skipped: result.skipped || 0,
        errors: result.errors || 0,
        total: result.total || 0,
      })

      toast({
        title: 'Import successful!',
        description: `Imported ${result.imported} prompts${result.skipped > 0 ? `, skipped ${result.skipped} duplicates` : ''}`,
      })

      // Invalidate queries to refresh the prompts list
      await queryClient.invalidateQueries({ queryKey: ['prompts'] })
      await queryClient.invalidateQueries({ queryKey: ['prompts', session?.user?.id] })

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Import error:', error)
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Failed to import prompts',
        variant: 'destructive',
      })
    } finally {
      setImporting(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const response = await fetch('/api/prompts/bulk-export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          // Export all prompts (promptIds can be added later for selective export)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to export prompts')
      }

      // Handle CSV download
      if (format === 'csv') {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)

        // Cross-browser compatible download
        try {
          const a = document.createElement('a')
          a.href = url
          a.download = `prompts-export-${new Date().toISOString().split('T')[0]}.csv`

          // Append to body (required for Firefox)
          document.body.appendChild(a)
          a.click()

          // Clean up
          setTimeout(() => {
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
          }, 100)
        } catch (downloadError) {
          window.URL.revokeObjectURL(url)
          throw downloadError
        }
      } else {
        // Handle JSON download
        const jsonData = await response.json()
        const jsonStr = JSON.stringify(jsonData, null, 2)
        const blobObj = new Blob([jsonStr], { type: 'application/json;charset=utf-8' })
        const url = window.URL.createObjectURL(blobObj)

        try {
          const a = document.createElement('a')
          a.href = url
          a.download = `prompts-export-${new Date().toISOString().split('T')[0]}.json`

          // Append to body (required for Firefox)
          document.body.appendChild(a)
          a.click()

          // Clean up
          setTimeout(() => {
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
          }, 100)
        } catch (downloadError) {
          window.URL.revokeObjectURL(url)
          throw downloadError
        }
      }

      toast({
        title: 'Export successful!',
        description: `Exported ${prompts.length} prompts as ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Failed to export prompts',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar
        prompts={prompts}
        selectedPromptId={null}
        onSelectPrompt={() => {}}
        session={session}
        currentPage="import-export"
      />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Import & Export Prompts</h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Import prompts from CSV/JSON files or export your prompts for backup
            </p>
          </div>

          <Tabs defaultValue="import" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="import" className="text-xs sm:text-sm">
                <Upload className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                Import
              </TabsTrigger>
              <TabsTrigger value="export" className="text-xs sm:text-sm">
                <Download className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                Export
              </TabsTrigger>
            </TabsList>

            {/* Import Tab */}
            <TabsContent value="import" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Import Prompts from File</CardTitle>
                  <CardDescription>
                    Upload a CSV or JSON file containing your prompts. The file should include columns/fields for:
                    name, prompt_text, description, model, tags, and is_public.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleImport} className="space-y-6">
                    {/* File Format Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="format">File Format</Label>
                      <Select value={importFormat} onValueChange={(v) => setImportFormat(v as 'csv' | 'json')}>
                        <SelectTrigger id="format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="csv">
                            <span className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              CSV
                            </span>
                          </SelectItem>
                          <SelectItem value="json">
                            <span className="flex items-center gap-2">
                              <FileJson className="h-4 w-4" />
                              JSON
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* File Input */}
                    <div className="space-y-2">
                      <Label htmlFor="file">Upload File</Label>
                      <Input
                        id="file"
                        type="file"
                        ref={fileInputRef}
                        accept={importFormat === 'csv' ? '.csv' : '.json'}
                        required
                        className="cursor-pointer"
                      />
                      <p className="text-sm text-muted-foreground">
                        Accepted format: {importFormat.toUpperCase()}. Max file size: 10MB. Name max: 120 chars.
                      </p>
                    </div>

                    {/* Options */}
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="skipDuplicates"
                        checked={skipDuplicates}
                        onChange={(e) => setSkipDuplicates(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 cursor-pointer"
                      />
                      <Label htmlFor="skipDuplicates" className="font-normal cursor-pointer text-sm sm:text-base">
                        Skip duplicate prompts (matches by name and prompt text)
                      </Label>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" disabled={importing} className="w-full">
                      {importing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Import Prompts
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Import Results */}
                  {importResult && (
                    <div className="mt-6 space-y-2 rounded-lg border p-4">
                      <h3 className="font-semibold">Import Results</h3>
                      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>
                            <strong>{importResult.imported}</strong> imported
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-yellow-500" />
                          <span>
                            <strong>{importResult.skipped}</strong> skipped (duplicates)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>
                            <strong>{importResult.errors}</strong> errors
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>
                            <strong>{importResult.total}</strong> total
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* CSV Format Guide */}
              {importFormat === 'csv' && (
                <Card>
                  <CardHeader>
                    <CardTitle>CSV Format Guide</CardTitle>
                    <CardDescription>Your CSV file should have these columns (in any order):</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Required:</strong>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                          <li>
                            <code>name</code> - Prompt name/title
                          </li>
                          <li>
                            <code>prompt_text</code> - The actual prompt text
                          </li>
                        </ul>
                      </div>
                      <div>
                        <strong>Optional:</strong>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                          <li>
                            <code>description</code> - Prompt description
                          </li>
                          <li>
                            <code>model</code> - AI model (defaults to gpt-4o)
                          </li>
                          <li>
                            <code>tags</code> - Comma or space-separated tags
                          </li>
                          <li>
                            <code>is_public</code> - true/false (defaults to false)
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* JSON Format Guide */}
              {importFormat === 'json' && (
                <Card>
                  <CardHeader>
                    <CardTitle>JSON Format Guide</CardTitle>
                    <CardDescription>Your JSON file should be an array of prompt objects:</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="rounded bg-muted p-3 text-xs overflow-auto sm:p-4">
                      {`[
  {
    "name": "Prompt Name",
    "prompt_text": "Your prompt text here",
    "description": "Optional description",
    "model": "gpt-4o",
    "tags": ["tag1", "tag2"],
    "is_public": false
  }
]`}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Export Tab */}
            <TabsContent value="export" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Export Your Prompts</CardTitle>
                  <CardDescription>
                    Download all your prompts as a CSV or JSON file for backup or migration. Currently exporting{' '}
                    <strong>{prompts.length}</strong> prompts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Button
                      variant="outline"
                      onClick={() => handleExport('csv')}
                      className="h-auto flex-col gap-2 py-4 sm:py-6"
                      type="button"
                    >
                      <FileText className="h-6 w-6 sm:h-8 sm:w-8" />
                      <span className="text-sm sm:text-base">Export as CSV</span>
                      <span className="text-xs text-muted-foreground">Excel/Sheets compatible</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleExport('json')}
                      className="h-auto flex-col gap-2 py-4 sm:py-6"
                      type="button"
                    >
                      <FileJson className="h-6 w-6 sm:h-8 sm:w-8" />
                      <span className="text-sm sm:text-base">Export as JSON</span>
                      <span className="text-xs text-muted-foreground">Programmatic access</span>
                    </Button>
                  </div>

                  <div className="rounded-lg border p-4 bg-muted/50">
                    <h3 className="font-semibold mb-2">What gets exported:</h3>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Prompt name and text</li>
                      <li>Description (if available)</li>
                      <li>Model preference</li>
                      <li>Tags</li>
                      <li>Public/private status</li>
                      <li>Created and updated timestamps</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

