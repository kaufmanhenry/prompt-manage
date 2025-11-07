'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Download, Loader2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'

interface ImportExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promptCount: number
}

export function ImportExportDialog({ open, onOpenChange, promptCount }: ImportExportDialogProps) {
  const [importing, setImporting] = useState(false)
  const [skipDuplicates, setSkipDuplicates] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const fileInput = fileInputRef.current
    if (!fileInput?.files || fileInput.files.length === 0) {
      toast({
        title: 'No file selected',
        description: 'Please select a CSV file to import',
        variant: 'destructive',
      })
      return
    }

    const file = fileInput.files[0]

    // File size validation (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'File size must be less than 10MB',
        variant: 'destructive',
      })
      return
    }

    // File type validation
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (fileExtension !== '.csv' && file.type !== 'text/csv') {
      toast({
        title: 'Invalid file type',
        description: 'Please select a CSV file',
        variant: 'destructive',
      })
      return
    }

    setImporting(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('format', 'csv')
      formData.append('skipDuplicates', skipDuplicates.toString())

      const response = await fetch('/api/prompts/bulk-import', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to import prompts')
      }

      toast({
        title: 'Import successful!',
        description: `Imported ${result.imported} prompts${result.skipped > 0 ? `, skipped ${result.skipped} duplicates` : ''}`,
      })

      // Invalidate queries to refresh the prompts list
      await queryClient.invalidateQueries({ queryKey: ['prompts'] })

      // Reset file input and close dialog
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      onOpenChange(false)
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
        body: JSON.stringify({ format }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to export prompts')
      }

      // Handle download
      if (format === 'csv') {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `prompts-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        }, 100)
      } else {
        const jsonData = await response.json()
        const jsonStr = JSON.stringify(jsonData, null, 2)
        const blob = new Blob([jsonStr], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `prompts-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        }, 100)
      }

      toast({
        title: 'Export successful!',
        description: `Exported ${promptCount} prompts as ${format.toUpperCase()}`,
      })

      onOpenChange(false)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import & Export</DialogTitle>
          <DialogDescription>
            Bulk import prompts from CSV or export your library for backup
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="mr-2 h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4 pt-4">
            <form onSubmit={handleImport} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">CSV File</Label>
                <Input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,text/csv"
                  required
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  CSV should include: name, prompt_text (required) and description, model, tags,
                  is_public (optional)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="skipDuplicates"
                  checked={skipDuplicates}
                  onChange={(e) => setSkipDuplicates(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-gray-300"
                />
                <Label htmlFor="skipDuplicates" className="cursor-pointer text-sm font-normal">
                  Skip duplicate prompts
                </Label>
              </div>

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
          </TabsContent>

          <TabsContent value="export" className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Export all {promptCount} prompts from your current team
            </p>

            <div className="grid gap-3">
              <Button variant="outline" onClick={() => handleExport('csv')} className="h-auto py-4">
                <div className="flex flex-col items-center gap-1">
                  <Download className="h-5 w-5" />
                  <span className="font-medium">Export as CSV</span>
                  <span className="text-xs text-muted-foreground">Excel/Sheets compatible</span>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleExport('json')}
                className="h-auto py-4"
              >
                <div className="flex flex-col items-center gap-1">
                  <Download className="h-5 w-5" />
                  <span className="font-medium">Export as JSON</span>
                  <span className="text-xs text-muted-foreground">Programmatic access</span>
                </div>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
