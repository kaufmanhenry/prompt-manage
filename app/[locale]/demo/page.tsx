import { ArrowLeft, Calendar, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function DemoContent() {
  return (
    <div className="container max-w-4xl py-12">
      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="space-y-8">
        {/* Success Message */}
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold">Demo Request Received!</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Our team will reach out within 24 hours to schedule your personalized demo.
          </p>
        </div>

        {/* What Happens Next */}
        <Card>
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
            <CardDescription>Here's what you can expect from our team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                1
              </div>
              <div>
                <h3 className="font-semibold">We'll reach out</h3>
                <p className="text-sm text-muted-foreground">
                  A team member will email you within 24 hours to schedule a convenient time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                2
              </div>
              <div>
                <h3 className="font-semibold">Personalized demo</h3>
                <p className="text-sm text-muted-foreground">
                  We'll show you how Pro features can help your specific use case - analytics, audit
                  logs, advanced collaboration, and more.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                3
              </div>
              <div>
                <h3 className="font-semibold">Answer your questions</h3>
                <p className="text-sm text-muted-foreground">
                  We'll discuss pricing, setup, migration, and any custom needs your team has.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                4
              </div>
              <div>
                <h3 className="font-semibold">Seamless upgrade</h3>
                <p className="text-sm text-muted-foreground">
                  If you're ready, we'll help you upgrade and invite your pending team members
                  immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Features Reminder */}
        <Card>
          <CardHeader>
            <CardTitle>Pro Plan Features</CardTitle>
            <CardDescription>What you'll unlock when you upgrade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">25 team members</div>
                  <div className="text-sm text-muted-foreground">Up from 5 seats on Team plan</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">1,000 prompt runs/month</div>
                  <div className="text-sm text-muted-foreground">10x more than Team plan</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Analytics dashboard</div>
                  <div className="text-sm text-muted-foreground">
                    Track usage, costs, and performance
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Audit logs</div>
                  <div className="text-sm text-muted-foreground">
                    Full compliance and security tracking
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Priority support</div>
                  <div className="text-sm text-muted-foreground">
                    Faster response times and dedicated help
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Advanced collaboration</div>
                  <div className="text-sm text-muted-foreground">
                    Approval workflows and permissions
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Options */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Calendar className="mb-2 inline h-5 w-5" /> Prefer to schedule directly?
            </CardTitle>
            <CardDescription>You can also reach us these ways</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <strong>Email:</strong>{' '}
              <a href="mailto:sales@promptmanage.com" className="text-primary hover:underline">
                sales@promptmanage.com
              </a>
            </div>
            <div>
              <strong>Alternative:</strong> Reply to the confirmation email we just sent you with
              your preferred times.
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="flex-1">
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/pricing">View Pricing Details</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading...</div>}>
      <DemoContent />
    </Suspense>
  )
}
