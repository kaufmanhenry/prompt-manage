'use client'

import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

const models = [
  'gpt-4',
  'gpt-3.5-turbo',
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-3-haiku',
  'gemini-pro',
  'mistral-large',
  'mistral-medium',
  'mistral-small',
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Account Preferences
  const [email, setEmail] = useState('user@email.com')
  const [password, setPassword] = useState('')
  const [twoFactor, setTwoFactor] = useState(false)

  // Prompt Management Defaults
  const [defaultModel, setDefaultModel] = useState(models[0])
  const [defaultFormat, setDefaultFormat] = useState('inline')
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true)

  // Notifications
  const [notifPromptUpdates, setNotifPromptUpdates] = useState(true)
  const [notifWeekly, setNotifWeekly] = useState(false)
  const [notifProduct, setNotifProduct] = useState(true)

  // Interface Customization
  const [fontSize, setFontSize] = useState('medium')
  const [collapseSidebar, setCollapseSidebar] = useState(false)
  const [showTooltips, setShowTooltips] = useState(true)

  // Data & Privacy
  const [exporting, setExporting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  // Integrations
  const [googleDrive, setGoogleDrive] = useState(false)
  const [notion, setNotion] = useState(false)
  const [webhook, setWebhook] = useState(false)

  // Dummy usage stats
  const usageStats = {
    prompts: 42,
    tags: 12,
    lastExport: '2024-06-12',
  }

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Account Preferences */}
      <section className="space-y-4 border-b pb-8">
        <h2 className="text-xl font-semibold mb-2">Account Preferences</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Email</label>
            <input
              className="border rounded px-3 py-2 w-64"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled
            />
            <Button size="sm" disabled>Change (coming soon)</Button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Password</label>
            <input
              className="border rounded px-3 py-2 w-64"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled
            />
            <Button size="sm" disabled>Change (coming soon)</Button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Two-Factor Authentication</label>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} disabled />
            <span className="text-xs text-muted-foreground">Coming soon</span>
          </div>
        </div>
      </section>

      {/* Prompt Management Defaults */}
      <section className="space-y-4 border-b pb-8">
        <h2 className="text-xl font-semibold mb-2">Prompt Management Defaults</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Default AI Model</label>
            <select
              className="border rounded px-3 py-2 w-64"
              value={defaultModel}
              onChange={e => setDefaultModel(e.target.value)}
            >
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Default Formatting</label>
            <select
              className="border rounded px-3 py-2 w-64"
              value={defaultFormat}
              onChange={e => setDefaultFormat(e.target.value)}
            >
              <option value="inline">Inline</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Auto-save Drafts</label>
            <Switch checked={autoSaveDrafts} onCheckedChange={setAutoSaveDrafts} />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-4 border-b pb-8">
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Prompt Updates</label>
            <Switch checked={notifPromptUpdates} onCheckedChange={setNotifPromptUpdates} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Weekly Summary</label>
            <Switch checked={notifWeekly} onCheckedChange={setNotifWeekly} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Product Updates</label>
            <Switch checked={notifProduct} onCheckedChange={setNotifProduct} />
          </div>
        </div>
      </section>

      {/* Interface Customization */}
      <section className="space-y-4 border-b pb-8">
        <h2 className="text-xl font-semibold mb-2">Interface Customization</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Font Size</label>
            <select
              className="border rounded px-3 py-2 w-64"
              value={fontSize}
              onChange={e => setFontSize(e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Collapse Sidebar</label>
            <Switch checked={collapseSidebar} onCheckedChange={setCollapseSidebar} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Show Tooltips</label>
            <Switch checked={showTooltips} onCheckedChange={setShowTooltips} />
          </div>
        </div>
      </section>

      {/* Data & Privacy */}
      <section className="space-y-4 border-b pb-8">
        <h2 className="text-xl font-semibold mb-2">Data & Privacy</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Export Prompts</label>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setExporting(true)} disabled={exporting}>Export as .json</Button>
              <Button size="sm" onClick={() => setExporting(true)} disabled={exporting}>Export as .txt</Button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Delete Account</label>
            {!deleteConfirm ? (
              <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm(true)}>
                Delete Account
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                <Button variant="destructive" size="sm" disabled>Confirm Delete (coming soon)</Button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Usage Stats</label>
            <div className="text-xs text-muted-foreground">
              <div>Prompts: {usageStats.prompts}</div>
              <div>Tags: {usageStats.tags}</div>
              <div>Last Export: {usageStats.lastExport}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold mb-2">Integrations</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Google Drive</label>
            <Switch checked={googleDrive} onCheckedChange={setGoogleDrive} disabled />
            <span className="text-xs text-muted-foreground">Coming soon</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Notion</label>
            <Switch checked={notion} onCheckedChange={setNotion} disabled />
            <span className="text-xs text-muted-foreground">Coming soon</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="font-medium">Webhook</label>
            <Switch checked={webhook} onCheckedChange={setWebhook} disabled />
            <span className="text-xs text-muted-foreground">Coming soon</span>
          </div>
        </div>
      </section>
    </div>
  )
} 