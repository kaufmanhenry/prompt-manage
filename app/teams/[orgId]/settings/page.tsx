'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

const generalSchema = z.object({ name: z.string().min(1).max(120), slug: z.string().min(3).max(64) })
const inviteSchema = z.object({ email: z.string().email(), role: z.enum(['OWNER','ADMIN','EDITOR','VIEWER']).default('EDITOR') })

export default function TeamSettingsPage() {
  const params = useParams<{ orgId: string }>()
  const orgId = params.orgId
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [org, setOrg] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'OWNER'|'ADMIN'|'EDITOR'|'VIEWER'>('EDITOR')

  async function refreshAll() {
    setLoading(true)
    try {
      const [orgRes, memRes, invRes] = await Promise.all([
        fetch(`/api/organizations/${orgId}`),
        fetch(`/api/organizations/${orgId}/members`),
        fetch(`/api/organizations/${orgId}/invite`),
      ])
      if (!orgRes.ok) throw new Error('Failed to load team')
      const org = await orgRes.json()
      const members = (await memRes.json()) ?? []
      const invites = invRes.ok ? await invRes.json() : []
      setOrg(org)
      setMembers(members)
      setInvites(invites)
      setName(org.name)
      setSlug(org.slug)
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to load team', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orgId) void refreshAll()
  }, [orgId])

  const updateGeneral = async () => {
    const parsed = generalSchema.safeParse({ name, slug })
    if (!parsed.success) return toast({ title: 'Invalid', description: parsed.error.issues[0]?.message, variant: 'destructive' })
    const res = await fetch(`/api/organizations/${orgId}`, {
      method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(parsed.data),
    })
    if (!res.ok) return toast({ title: 'Error', description: (await res.json()).error || 'Failed to save', variant: 'destructive' })
    toast({ title: 'Saved', description: 'Team updated' })
    void refreshAll()
  }

  const sendInvite = async () => {
    const parsed = inviteSchema.safeParse({ email: inviteEmail, role: inviteRole })
    if (!parsed.success) return toast({ title: 'Invalid', description: parsed.error.issues[0]?.message, variant: 'destructive' })
    const res = await fetch(`/api/organizations/${orgId}/invite`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(parsed.data) })
    if (!res.ok) return toast({ title: 'Error', description: (await res.json()).error || 'Failed to invite', variant: 'destructive' })
    toast({ title: 'Invite sent', description: inviteEmail })
    setInviteEmail('')
    void refreshAll()
  }

  const deleteTeam = async () => {
    if (!confirm('This will delete the team. Continue?')) return
    const res = await fetch(`/api/organizations/${orgId}`, { method: 'DELETE' })
    if (!res.ok) return toast({ title: 'Error', description: (await res.json()).error || 'Failed to delete', variant: 'destructive' })
    toast({ title: 'Team deleted' })
    window.location.href = '/dashboard'
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="invites">Invitations</TabsTrigger>
              <TabsTrigger value="danger">Danger Zone</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
              </div>
              <div className="flex justify-end">
                <Button onClick={updateGeneral}>Save</Button>
              </div>
            </TabsContent>
            <TabsContent value="members" className="space-y-4">
              {members.length === 0 ? (
                <div className="text-sm text-muted-foreground">No members yet.</div>
              ) : (
                <div className="space-y-2">
                  {members.map((m) => (
                    <div key={m.user_id} className="flex items-center justify-between border rounded-md px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-accent/50 grid place-items-center">
                          {(m.profile?.display_name || m.user_id)?.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{m.profile?.display_name || m.user_id}</div>
                          <div className="text-xs text-muted-foreground">{m.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          className="border rounded-md px-2 text-sm"
                          value={m.role}
                          onChange={async (e) => {
                            setBusy(m.user_id)
                            const role = e.target.value
                            const res = await fetch(`/api/organizations/${orgId}/members/${m.user_id}`, {
                              method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ role }),
                            })
                            if (!res.ok) {
                              toast({ title: 'Error', description: (await res.json()).error || 'Failed to update role', variant: 'destructive' })
                            }
                            setBusy(null)
                            void refreshAll()
                          }}
                          disabled={busy === m.user_id}
                        >
                          <option value="OWNER">OWNER</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="EDITOR">EDITOR</option>
                          <option value="VIEWER">VIEWER</option>
                        </select>
                        <Button
                          variant="outline"
                          onClick={async () => {
                            if (!confirm('Remove this member?')) return
                            setBusy(m.user_id)
                            const res = await fetch(`/api/organizations/${orgId}/members/${m.user_id}`, { method: 'DELETE' })
                            if (!res.ok) toast({ title: 'Error', description: (await res.json()).error || 'Failed to remove', variant: 'destructive' })
                            setBusy(null)
                            void refreshAll()
                          }}
                          disabled={busy === m.user_id}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="invites" className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="email@example.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                <select className="border rounded-md px-2" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as any)}>
                  <option value="EDITOR">EDITOR</option>
                  <option value="VIEWER">VIEWER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="OWNER">OWNER</option>
                </select>
                <Button onClick={sendInvite}>Send Invite</Button>
              </div>
              <div className="space-y-2">
                {invites.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No invitations</div>
                ) : (
                  invites.map((inv: any) => (
                    <div key={inv.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                      <div className="text-sm">{inv.email} · {inv.role} · {inv.status}</div>
                      <div className="flex items-center gap-2">
                        {inv.status === 'pending' && (
                          <Button
                            variant="outline"
                            onClick={async () => {
                              const res = await fetch(`/api/organizations/${orgId}/invite/${inv.id}`, { method: 'DELETE' })
                              if (!res.ok) toast({ title: 'Error', description: (await res.json()).error || 'Failed to revoke', variant: 'destructive' })
                              void refreshAll()
                            }}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="danger" className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="text-sm mb-2">Delete this team</div>
                <Button variant="destructive" onClick={deleteTeam}>Delete Team</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


