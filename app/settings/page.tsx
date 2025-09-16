'use client'

import type { User as AuthUser } from '@supabase/supabase-js'
import { Globe, Mail, MapPin, Save, Settings, Trash2, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)

  // Profile form state
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [location, setLocation] = useState('')

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [themePreference, setThemePreference] = useState('system')
  const { theme, setTheme } = useTheme()

  const loadUserData = useCallback(async () => {
    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/auth/login'
        return
      }
      setUser(user)

      // Get user profile
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
      }

      if (profile) {
        setDisplayName(profile.display_name || '')
        setBio(profile.bio || '')
        setWebsite(profile.website || '')
        setLocation(profile.location || '')
        setEmailNotifications(profile.email_notifications ?? true)
        setDarkMode(profile.dark_mode ?? false)
        setThemePreference(profile.theme_preference || 'system')

        // Apply theme preference
        if (profile.theme_preference && profile.theme_preference !== 'system') {
          setTheme(profile.theme_preference)
        }
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            display_name:
              user.user_metadata?.display_name ||
              user.email?.split('@')[0] ||
              'User',
            email_notifications: true,
            dark_mode: false,
            theme_preference: 'system',
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating profile:', createError)
        } else if (newProfile) {
          setDisplayName(newProfile.display_name || '')
          setEmailNotifications(newProfile.email_notifications ?? true)
          setDarkMode(newProfile.dark_mode ?? false)
          setThemePreference(newProfile.theme_preference || 'system')
        }
      }
    } catch {
      console.error('Error loading user data:')
    } finally {
      setLoading(false)
    }
  }, [setTheme])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])

  useEffect(() => {
    if (theme) {
      setDarkMode(theme === 'dark')
      setThemePreference(theme)
    }
  }, [theme])

  const handleSaveProfile = async () => {
    if (!user) return

    setSaving(true)
    try {
      const supabase = createClient()
      const payload = {
        id: user.id,
        display_name: displayName,
        bio: bio,
        website: website,
        location: location,
        email_notifications: emailNotifications,
        dark_mode: darkMode,
        theme_preference: themePreference,
      }
      console.log('Saving profile with payload:', payload)
      const { error } = await supabase.from('user_profiles').upsert(payload)

      if (error) {
        console.error('Error saving profile:', error)
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Profile updated successfully!',
        })
        await loadUserData() // Reload to get updated data
      }
    } catch (err) {
      console.error('Exception saving profile:', err)
      toast({
        title: 'Error',
        description: 'An error occurred while saving your profile.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (
      !user ||
      !confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.rpc('delete_user')

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Account Deleted',
          description: 'Your account has been deleted successfully.',
        })
        window.location.href = '/auth/login'
      }
    } catch {
      toast({
        title: 'Error',
        description: 'An error occurred while deleting your account.',
        variant: 'destructive',
      })
    }
  }

  const handleThemeChange = (checked: boolean) => {
    setDarkMode(checked)
    const newTheme = checked ? 'dark' : 'light'
    setThemePreference(newTheme)
    setTheme(newTheme)
  }

  const handleEmailNotificationsChange = (checked: boolean) => {
    setEmailNotifications(checked)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Skeleton className="mb-8 h-8 w-1/4" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h1 className="text-xl font-medium tracking-tight text-gray-900 dark:text-white">
            Account Settings
          </h1>
        </div>

        <div className="space-y-4">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-input">
                  <User className="size-4 text-muted-foreground" />
                </div>
                <span className="text-base font-medium">
                  Profile Information
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your display name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={user.email || ''}
                      disabled
                      className="bg-gray-50 pl-10 dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="pl-10"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full md:w-auto"
              >
                <Save className="size-4" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-input">
                  <Settings className="size-4 text-muted-foreground" />
                </div>
                <span className="text-base font-medium">Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your account
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={handleEmailNotificationsChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme for the interface
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={handleThemeChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-input">
                  <Trash2 className="size-4 text-muted-foreground" />
                </div>
                <span className="text-base font-medium">Danger Zone</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Delete Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
