import { AlertCircle, ArrowRight, CheckCircle2, Key, Mail, Shield } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Authentication Guide - Prompt Manage',
  description:
    'Complete guide to signing in to Prompt Manage. Learn about Google Sign-In and Email Magic Link authentication, troubleshooting, and account security.',
  keywords: [
    'prompt manage authentication',
    'sign in guide',
    'magic link',
    'email authentication',
    'google sign in',
    'password-free login',
    'account security',
  ],
}

export default function AuthenticationGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Authentication Guide
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about signing in to Prompt Manage securely and effortlessly.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: November 22, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {/* Overview */}
          <section>
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                  <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold">Password-Free Authentication</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Prompt Manage uses modern, password-free authentication for enhanced security and
                  convenience. No passwords to remember, no passwords to forget, and no passwords to
                  get stolen.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-border bg-background p-4">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      Benefits
                    </h3>
                    <ul className="list-disc space-y-1 pl-6 text-sm">
                      <li>No passwords to remember or manage</li>
                      <li>More secure than traditional passwords</li>
                      <li>Fast, one-click authentication</li>
                      <li>Protected by your email provider's security</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                      <Key className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      Two Methods Available
                    </h3>
                    <ul className="list-disc space-y-1 pl-6 text-sm">
                      <li>Google Sign-In (OAuth)</li>
                      <li>Email Magic Link (One-time codes)</li>
                      <li>Both methods are equally secure</li>
                      <li>You can use both with the same account</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Google Sign-In */}
          <section id="google-signin">
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/40">
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      className="text-green-600 dark:text-green-400"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      className="text-yellow-600 dark:text-yellow-400"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      className="text-red-600 dark:text-red-400"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Sign In with Google</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The fastest way to get started. Use your existing Google account for instant,
                  secure access.
                </p>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">How it works:</h3>
                  <ol className="list-decimal space-y-3 pl-6">
                    <li>
                      Click <strong className="text-foreground">"Sign in with Google"</strong> on
                      any page
                    </li>
                    <li>Select your Google account (or sign in to Google if you're not already)</li>
                    <li>
                      Authorize Prompt Manage to access your basic profile information (name, email,
                      profile picture)
                    </li>
                    <li>You'll be instantly redirected to your dashboard</li>
                    <li>
                      On your first sign-in, your account is created automatically - no forms to
                      fill out!
                    </li>
                  </ol>
                </div>

                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-200">
                    <CheckCircle2 className="h-4 w-4" />
                    What we access from your Google account:
                  </h4>
                  <ul className="list-disc space-y-1 pl-6 text-sm text-blue-900 dark:text-blue-200">
                    <li>
                      <strong>Email address:</strong> To identify your account
                    </li>
                    <li>
                      <strong>Display name:</strong> Shown on your profile
                    </li>
                    <li>
                      <strong>Profile picture:</strong> Used as your avatar (optional)
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-blue-900 dark:text-blue-200">
                    We <strong>never</strong> access your Gmail, Drive, Calendar, or any other
                    Google services.
                  </p>
                </div>

                <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                  <p className="text-sm text-emerald-900 dark:text-emerald-200">
                    <strong>Best for:</strong> Users who already use Google services and want the
                    fastest sign-in experience with one click.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Email Magic Link */}
          <section id="email-magic-link">
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/40">
                  <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold">Sign In with Email (Magic Link)</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Prefer not to use Google? Sign in with just your email address using secure
                  one-time verification codes.
                </p>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">How it works:</h3>
                  <ol className="list-decimal space-y-3 pl-6">
                    <li>
                      Click <strong className="text-foreground">"Sign in with Email"</strong> on any
                      page
                    </li>
                    <li>Enter your email address in the form</li>
                    <li>
                      Check your email inbox - you'll receive a 6-digit verification code within
                      seconds
                    </li>
                    <li>
                      Enter the verification code on the sign-in page (codes are valid for 60
                      minutes)
                    </li>
                    <li>You'll be instantly redirected to your dashboard</li>
                    <li>
                      On your first sign-in, your account is created automatically - no additional
                      setup required!
                    </li>
                  </ol>
                </div>

                <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-900 dark:text-purple-200">
                    <Shield className="h-4 w-4" />
                    How it's secure:
                  </h4>
                  <ul className="list-disc space-y-1 pl-6 text-sm text-purple-900 dark:text-purple-200">
                    <li>
                      <strong>One-time codes:</strong> Each code can only be used once
                    </li>
                    <li>
                      <strong>Time-limited:</strong> Codes expire after 60 minutes
                    </li>
                    <li>
                      <strong>No password storage:</strong> We never store passwords for email users
                    </li>
                    <li>
                      <strong>Email-protected:</strong> Only you can access your email inbox
                    </li>
                    <li>
                      <strong>Fresh code each time:</strong> Every sign-in generates a new,
                      unpredictable code
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
                  <h4 className="mb-2 text-sm font-semibold text-amber-900 dark:text-amber-200">
                    Common issues:
                  </h4>
                  <ul className="list-disc space-y-1 pl-6 text-sm text-amber-900 dark:text-amber-200">
                    <li>
                      <strong>Don't see the email?</strong> Check your spam/junk folder
                    </li>
                    <li>
                      <strong>Code expired?</strong> Simply request a new one by entering your email
                      again
                    </li>
                    <li>
                      <strong>Email delayed?</strong> Codes usually arrive within 5-10 seconds, but
                      can take up to 1-2 minutes during high traffic
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                  <p className="text-sm text-emerald-900 dark:text-emerald-200">
                    <strong>Best for:</strong> Users who prefer not to use third-party OAuth
                    providers or want a simple, email-only authentication method.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Comparison */}
          <section id="comparison">
            <div className="rounded-lg border border-border bg-card p-8">
              <h2 className="mb-6 text-2xl font-bold">Which Method Should I Choose?</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-semibold text-foreground">Feature</th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Google Sign-In
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-foreground">
                        Email Magic Link
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 font-medium">Speed</td>
                      <td className="px-4 py-3">
                        <CheckCircle2 className="inline h-4 w-4 text-emerald-600" /> One click
                      </td>
                      <td className="px-4 py-3">Requires checking email</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 font-medium">Security</td>
                      <td className="px-4 py-3">
                        <CheckCircle2 className="inline h-4 w-4 text-emerald-600" /> Very secure
                      </td>
                      <td className="px-4 py-3">
                        <CheckCircle2 className="inline h-4 w-4 text-emerald-600" /> Very secure
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 font-medium">Password required</td>
                      <td className="px-4 py-3">No (uses Google)</td>
                      <td className="px-4 py-3">No (passwordless)</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 font-medium">Third-party dependency</td>
                      <td className="px-4 py-3">Requires Google account</td>
                      <td className="px-4 py-3">
                        <CheckCircle2 className="inline h-4 w-4 text-emerald-600" /> No dependency
                      </td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 font-medium">Profile picture</td>
                      <td className="px-4 py-3">
                        <CheckCircle2 className="inline h-4 w-4 text-emerald-600" /> Auto-imported
                      </td>
                      <td className="px-4 py-3">Manual upload</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 font-medium">Works offline</td>
                      <td className="px-4 py-3">No (requires Google)</td>
                      <td className="px-4 py-3">No (requires email access)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Best for</td>
                      <td className="px-4 py-3">Google users, fastest sign-in</td>
                      <td className="px-4 py-3">Privacy-conscious users, email-only access</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong>Can I use both?</strong> Yes! You can link both sign-in methods to the
                  same account. Just sign in using a different method with the same email address,
                  and they'll be automatically linked.
                </p>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section id="troubleshooting">
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/40">
                  <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold">Troubleshooting</h2>
              </div>
              <div className="space-y-6 text-muted-foreground">
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Google Sign-In Issues</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-1 font-medium text-foreground">
                        "Popup blocked" or "Can't sign in"
                      </h4>
                      <ul className="list-disc space-y-1 pl-6 text-sm">
                        <li>Make sure popups are enabled for promptmanage.com</li>
                        <li>Try disabling browser extensions temporarily</li>
                        <li>Clear your browser cache and cookies</li>
                        <li>Try a different browser or incognito mode</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-1 font-medium text-foreground">
                        "Already signed in to Google but can't access Prompt Manage"
                      </h4>
                      <ul className="list-disc space-y-1 pl-6 text-sm">
                        <li>Sign out of Google completely and sign in again</li>
                        <li>Check if you're using the correct Google account</li>
                        <li>
                          Try revoking Prompt Manage's access in Google Account settings, then sign
                          in again
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">Email Magic Link Issues</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-1 font-medium text-foreground">
                        "Not receiving verification codes"
                      </h4>
                      <ul className="list-disc space-y-1 pl-6 text-sm">
                        <li>
                          <strong>Check spam/junk folder:</strong> Email providers sometimes filter
                          verification emails
                        </li>
                        <li>
                          <strong>Whitelist our domain:</strong> Add noreply@promptmanage.com to
                          your contacts
                        </li>
                        <li>
                          <strong>Wait a few minutes:</strong> Emails can be delayed during high
                          traffic
                        </li>
                        <li>
                          <strong>Check your email address:</strong> Make sure you typed it
                          correctly
                        </li>
                        <li>
                          <strong>Corporate/university email:</strong> Some organizations block
                          automated emails - try a personal email instead
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-1 font-medium text-foreground">
                        "Code expired or invalid"
                      </h4>
                      <ul className="list-disc space-y-1 pl-6 text-sm">
                        <li>Codes expire after 60 minutes - request a new one</li>
                        <li>
                          Each code can only be used once - get a fresh code if you made a mistake
                        </li>
                        <li>Make sure you're entering the most recent code from your email</li>
                        <li>Check for typos - codes are case-sensitive</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-1 font-medium text-foreground">
                        "Multiple verification emails"
                      </h4>
                      <ul className="list-disc space-y-1 pl-6 text-sm">
                        <li>
                          Each sign-in request generates a new code - only the latest code will work
                        </li>
                        <li>Previous codes are automatically invalidated</li>
                        <li>Always use the most recent email</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-foreground">General Account Issues</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-1 font-medium text-foreground">
                        "Account not found" or "Can't access my account"
                      </h4>
                      <ul className="list-disc space-y-1 pl-6 text-sm">
                        <li>
                          Make sure you're using the same email address you originally signed up
                          with
                        </li>
                        <li>
                          Try the other sign-in method (Google if you used Email, or vice versa)
                        </li>
                        <li>Check if you have multiple Google accounts and try each one</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-1 font-medium text-foreground">
                        "Want to delete my account"
                      </h4>
                      <ul className="list-disc space-y-1 pl-6 text-sm">
                        <li>Go to Settings → Account → Delete Account</li>
                        <li>This permanently deletes all your prompts and data</li>
                        <li>
                          See our{' '}
                          <Link
                            href="/docs/account-management"
                            className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                          >
                            Complete Account Management Guide
                          </Link>{' '}
                          for details
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security Best Practices */}
          <section id="security-tips">
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/40">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold">Security Best Practices</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>Keep your Prompt Manage account secure with these recommendations:</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-border bg-background p-4">
                    <h3 className="mb-2 font-semibold text-foreground">
                      For Google Sign-In Users:
                    </h3>
                    <ul className="list-disc space-y-1 pl-6 text-sm">
                      <li>Enable 2-factor authentication on your Google account</li>
                      <li>Use a strong, unique password for Google</li>
                      <li>Regularly review connected apps in Google Account settings</li>
                      <li>Keep your Google account recovery options up to date</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <h3 className="mb-2 font-semibold text-foreground">
                      For Email Magic Link Users:
                    </h3>
                    <ul className="list-disc space-y-1 pl-6 text-sm">
                      <li>Enable 2-factor authentication on your email provider</li>
                      <li>Use a strong, unique password for your email account</li>
                      <li>Don't share verification codes with anyone</li>
                      <li>Sign out of your email on shared/public devices</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <p className="text-sm text-red-900 dark:text-red-200">
                    <strong>Never share verification codes:</strong> Prompt Manage will never ask
                    you for your verification code via email, phone, or support chat. Anyone asking
                    for your code is attempting to hack your account.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Related Links */}
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Related Documentation</h2>
            <p className="mb-6 text-muted-foreground">
              Explore more guides to get the most out of Prompt Manage
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/docs">
                <Button variant="outline" size="lg">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  All Documentation
                </Button>
              </Link>
              <Link href="/docs/account-management">
                <Button variant="outline" size="lg">
                  Account Management Guide
                </Button>
              </Link>
              <Link href="/docs/getting-started">
                <Button size="lg">Getting Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
