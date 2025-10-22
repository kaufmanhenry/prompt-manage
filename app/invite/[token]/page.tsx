'use client'

import { useQuery } from '@tantml:parameter>
import { CheckCircle, Loader2, UserPlus, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useAcceptTeamInvitation } from '@/lib/hooks/use-teams'
import { createClient } from '@/utils/supabase/client'

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const token = params.token as string
  const [invitationData, setInvitationData] = useState<any>(null)
  const [loadingInvitation, setLoadingInvitation] = useState(true)

  const acceptInvitation = useAcceptTeamInvitation()

  // Check if user is authenticated
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const {
        data: { session },
      } = await createClient().auth.getSession()
      return session
    },
  })

  // Fetch invitation details
  useEffect(() => {
    async function fetchInvitation() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('team_invitations')
          .select('*, teams(name)')
          .eq('token', token)
          .eq('status', 'pending')
          .single()

        if (error) throw error

        // Check if invitation has expired
        if (new Date(data.expires_at) < new Date()) {
          throw new Error('Invitation has expired')
        }

        setInvitationData(data)
      } catch (error) {
        console.error('Error fetching invitation:', error)
        toast({
          title: 'Invalid Invitation',
          description:
            error instanceof Error ? error.message : 'This invitation is invalid or has expired',
          variant: 'destructive',
        })
      } finally {
        setLoadingInvitation(false)
      }
    }

    if (token) {
      fetchInvitation()
    }
  }, [token, toast])

  const handleAccept = async () => {
    if (!session) {
      // Store token and redirect to login
      sessionStorage.setItem('invitation_token', token)
      router.push(`/login?redirect=/invite/${token}`)
      return
    }

    try {
      await acceptInvitation.mutateAsync(token)

      toast({
        title: 'Invitation Accepted!',
        description: `You've successfully joined ${invitationData.teams.name}`,
      })

      // Redirect to team dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (error) {
      console.error('Error accepting invitation:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to accept invitation',
        variant: 'destructive',
      })
    }
  }

  if (sessionLoading || loadingInvitation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-accent/50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invitationData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-accent/50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-center">Invalid Invitation</CardTitle>
            <CardDescription className="text-center">
              This invitation link is invalid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (acceptInvitation.isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-accent/50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-center">Welcome to the Team!</CardTitle>
            <CardDescription className="text-center">
              You've successfully joined {invitationData.teams.name}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
            <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-center">You're Invited!</CardTitle>
          <CardDescription className="text-center">
            You've been invited to join <span className="font-semibold">{invitationData.teams.name}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{invitationData.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium capitalize">{invitationData.role}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Expires:</span>
              <span className="font-medium">
                {new Date(invitationData.expires_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {!session ? (
            <div className="space-y-2">
              <p className="text-center text-sm text-muted-foreground">
                You need to be signed in to accept this invitation
              </p>
              <Button onClick={() => router.push(`/login?redirect=/invite/${token}`)} className="w-full">
                Sign In to Accept
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAccept}
              disabled={acceptInvitation.isPending}
              className="w-full"
            >
              {acceptInvitation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                'Accept Invitation'
              )}
            </Button>
          )}

          <Button onClick={() => router.push('/')} variant="outline" className="w-full">
            Decline
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
