'use client'

import type { User as AuthUser } from '@supabase/supabase-js'
import { FileText, Shield, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

import { SettingsSidebar } from '@/components/SettingsSidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'

export default function LegalSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          window.location.href = '/'
          return
        }
        setUser(user)
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }

    void loadUser()
  }, [])

  const handleRequestDeletion = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call to legal team
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Deletion Request Submitted',
        description: 'Your data deletion request has been sent to our legal team. You will receive a response within 30 days.',
      })

      setShowDeleteDialog(false)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to submit deletion request. Please try again or contact legal@promptmanage.com directly.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="flex h-screen">
        <SettingsSidebar session={null} />
        <div className="flex-1 overflow-y-auto bg-accent/50 p-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <Skeleton className="mb-8 h-8 w-1/4" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <SettingsSidebar
        session={{
          user,
          access_token: '',
          refresh_token: '',
          expires_in: 0,
          expires_at: 0,
          token_type: 'bearer',
        }}
      />
      <div className="flex-1 overflow-y-auto bg-accent/50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4">
            <h1 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
              Legal & Privacy
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your privacy settings and review our legal documents
            </p>
          </div>

          <div className="space-y-4">
            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-input">
                    <Shield className="size-4 text-muted-foreground" />
                  </div>
                  <span className="text-base font-medium">Privacy Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Data Processing</h4>
                      <p className="text-sm text-muted-foreground">
                        We process your data in accordance with our Privacy Policy
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Analytics</h4>
                      <p className="text-sm text-muted-foreground">
                        Help us improve by sharing anonymous usage data
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-input">
                    <FileText className="size-4 text-muted-foreground" />
                  </div>
                  <span className="text-base font-medium">Legal Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Terms of Service</h4>
                      <p className="text-sm text-muted-foreground">
                        Our terms and conditions for using Prompt Manage
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/terms" target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Privacy Policy</h4>
                      <p className="text-sm text-muted-foreground">
                        How we collect, use, and protect your information
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/privacy" target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Cookie Policy</h4>
                      <p className="text-sm text-muted-foreground">
                        Information about cookies and tracking technologies
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/privacy#cookies" target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Data Processing Agreement</h4>
                      <p className="text-sm text-muted-foreground">
                        GDPR-compliant data processing terms
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/legal-center/dpa" target="_blank" rel="noopener noreferrer">
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-input">
                    <Users className="size-4 text-muted-foreground" />
                  </div>
                  <span className="text-base font-medium">Your Data Rights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Export Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Download a copy of all your data
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Request Export
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Data Portability</h4>
                      <p className="text-sm text-muted-foreground">
                        Transfer your data to another service
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Right to be Forgotten</h4>
                      <p className="text-sm text-muted-foreground">
                        Request deletion of your personal data
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
                      Request Deletion
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    If you have questions about our legal policies or need to exercise your data rights, please contact us:
                  </p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <strong>Email:</strong> legal@promptmanage.com
                    </p>
                    <p className="text-sm">
                      <strong>Response Time:</strong> Within 30 days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Data Deletion Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Data Deletion</DialogTitle>
            <DialogDescription>
              You are about to request the permanent deletion of all your personal data from Prompt Manage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <h4 className="font-semibold text-red-800 dark:text-red-200">⚠️ Important Warning</h4>
              <ul className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-300">
                <li>• This action will permanently delete ALL your personal data</li>
                <li>• All your prompts, settings, and account history will be lost</li>
                <li>• This action cannot be undone</li>
                <li>• You will lose access to all paid features and subscriptions</li>
                <li>• Public prompts you've shared will be removed from the public directory</li>
              </ul>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">ℹ️ What happens next?</h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li>• Your request will be reviewed by our legal team</li>
                <li>• You'll receive a response within 30 days</li>
                <li>• We may contact you to verify your identity</li>
                <li>• Data deletion will occur after verification</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRequestDeletion}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Request...' : 'Yes, Request Deletion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
