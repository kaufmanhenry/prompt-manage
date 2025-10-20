import { ArrowLeft, User, Settings, Eye, Trash2, Download, Shield, HelpCircle } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Account Management Guide — Prompt Manage',
  description:
    'Complete guide to managing your Prompt Manage account: creating accounts, viewing profiles, editing settings, managing data, and account deletion.',
  keywords: [
    'account management',
    'profile settings',
    'account deletion',
    'data management',
    'privacy settings',
    'prompt manage guide',
  ],
  openGraph: {
    title: 'Account Management Guide — Prompt Manage',
    description: 'Complete guide to managing your Prompt Manage account and data.',
    type: 'website',
  },
}

export default function AccountManagement() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Link href="/docs" className="mb-8 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documentation
          </Link>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Account Management Guide
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about managing your Prompt Manage account, including creating accounts, viewing profiles, editing settings, and managing your data.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-12">
          {/* Quick Navigation */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="#creating-account" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">Creating an Account</span>
            </Link>
            <Link href="#viewing-profile" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">Viewing Your Profile</span>
            </Link>
            <Link href="#editing-profile" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <Settings className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">Editing Your Profile</span>
            </Link>
            <Link href="#account-deletion" className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <Trash2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-gray-900 dark:text-white">Account Deletion</span>
            </Link>
          </div>

          {/* Creating an Account */}
          <section id="creating-account" className="scroll-mt-8">
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                  <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Creating an Account</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Step 1: Access the Sign-Up Page</h3>
                  <ol className="list-decimal space-y-2 pl-6">
                    <li>Navigate to <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">Prompt Manage</Link></li>
                    <li>Click the <strong>"Sign Up"</strong> button in the top-right corner</li>
                    <li>Or visit the sign-up page directly at <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">/auth/signup</code></li>
                  </ol>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Step 2: Choose Your Sign-Up Method</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Option A: Email Sign-Up (Recommended)</h4>
                      <ol className="list-decimal space-y-1 pl-6 text-sm">
                        <li>Enter your email address</li>
                        <li>Click <strong>"Send Verification Code"</strong></li>
                        <li>Check your email for a 6-digit verification code</li>
                        <li>Enter the code when prompted</li>
                        <li>Complete your profile setup</li>
                      </ol>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Option B: Google Sign-In</h4>
                      <ol className="list-decimal space-y-1 pl-6 text-sm">
                        <li>Click <strong>"Continue with Google"</strong></li>
                        <li>Select your Google account</li>
                        <li>Grant necessary permissions</li>
                        <li>Complete your profile setup</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                  <p className="text-sm text-emerald-900 dark:text-emerald-200">
                    <strong>Note:</strong> We use secure authentication methods to protect your account. Your email is verified before account creation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Viewing Your Profile */}
          <section id="viewing-profile" className="scroll-mt-8">
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                  <Eye className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Viewing Your Profile</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Accessing Your Profile</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Method 1: Through Navigation</h4>
                      <ol className="list-decimal space-y-1 pl-6 text-sm">
                        <li>Sign in to your account</li>
                        <li>Click your profile picture/avatar in the top-right corner</li>
                        <li>Select <strong>"View Profile"</strong> from the dropdown menu</li>
                        <li>Or navigate directly to <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">/profile</code></li>
                      </ol>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Method 2: Direct URL</h4>
                      <p className="text-sm">Visit <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">https://promptmanage.com/profile</code> while signed in</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">What You'll See on Your Profile</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Profile Information</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Display Name:</strong> How your name appears to others</li>
                        <li>• <strong>Bio:</strong> Your personal or professional description</li>
                        <li>• <strong>Website:</strong> Your personal or professional website</li>
                        <li>• <strong>Join Date:</strong> When you created your account</li>
                        <li>• <strong>Location:</strong> Your general location (if set)</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Activity Overview</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Total Prompts:</strong> Number of prompts you've created</li>
                        <li>• <strong>Public Prompts:</strong> Number of prompts visible to others</li>
                        <li>• <strong>Private Prompts:</strong> Number of prompts only you can see</li>
                        <li>• <strong>Last Active:</strong> When you were last active on the platform</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Editing Your Profile */}
          <section id="editing-profile" className="scroll-mt-8">
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                  <Settings className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Editing Your Profile</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Accessing Profile Settings</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Method 1: Through Profile Page</h4>
                      <ol className="list-decimal space-y-1 pl-6 text-sm">
                        <li>Go to your profile page (<code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">/profile</code>)</li>
                        <li>Click the <strong>"Edit Profile"</strong> button</li>
                        <li>Make your changes</li>
                        <li>Click <strong>"Save Changes"</strong></li>
                      </ol>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Method 2: Through Settings</h4>
                      <ol className="list-decimal space-y-1 pl-6 text-sm">
                        <li>Go to <strong>Settings</strong> (<code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">/settings</code>)</li>
                        <li>Click on <strong>"Profile"</strong> in the sidebar</li>
                        <li>Edit your information</li>
                        <li>Click <strong>"Save Changes"</strong></li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">What You Can Edit</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Personal Information</h4>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <strong>Display Name:</strong> How your name appears to other users
                          <ul className="ml-4 mt-1 space-y-1 text-xs text-gray-500">
                            <li>• Can be changed at any time</li>
                            <li>• Must be between 2-50 characters</li>
                            <li>• Cannot contain special characters or profanity</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Bio:</strong> Brief description about yourself
                          <ul className="ml-4 mt-1 space-y-1 text-xs text-gray-500">
                            <li>• Maximum 500 characters</li>
                            <li>• Supports basic formatting (line breaks)</li>
                            <li>• Can include links to your work</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Website:</strong> Your personal or professional website
                          <ul className="ml-4 mt-1 space-y-1 text-xs text-gray-500">
                            <li>• Must be a valid URL</li>
                            <li>• Will be displayed as a clickable link</li>
                            <li>• Optional field</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Viewing Public Prompts */}
          <section id="viewing-public-prompts" className="scroll-mt-8">
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                  <Eye className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Viewing Public Prompts</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Accessing the Public Directory</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Method 1: Through Navigation</h4>
                      <ol className="list-decimal space-y-1 pl-6 text-sm">
                        <li>Sign in to your account</li>
                        <li>Click <strong>"Explore"</strong> in the top navigation</li>
                        <li>Or navigate directly to <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">/p</code></li>
                      </ol>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Method 2: Direct URL</h4>
                      <p className="text-sm">Visit <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">https://promptmanage.com/p</code> while signed in</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Browsing Public Prompts</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Featured Prompts</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Trending:</strong> Most popular prompts this week</li>
                        <li>• <strong>Recently Added:</strong> Latest prompts from the community</li>
                        <li>• <strong>Editor's Choice:</strong> Curated high-quality prompts</li>
                        <li>• <strong>Popular Categories:</strong> Most active prompt categories</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Search and Filter Options</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Search Bar:</strong> Search by prompt name, description, or tags</li>
                        <li>• <strong>Category Filter:</strong> Filter by prompt type</li>
                        <li>• <strong>Model Filter:</strong> Filter by AI model (GPT-4, Claude, etc.)</li>
                        <li>• <strong>Tag Filter:</strong> Filter by specific tags</li>
                        <li>• <strong>Sort Options:</strong> Sort by date, popularity, or relevance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Account Deletion */}
          <section id="account-deletion" className="scroll-mt-8">
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/40">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Deletion</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <h3 className="mb-2 font-semibold text-red-900 dark:text-red-200">⚠️ Critical Warning</h3>
                  <p className="text-sm text-red-800 dark:text-red-300">
                    <strong>Account deletion is permanent and irreversible.</strong> Please read this section carefully before proceeding.
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">What Happens When You Delete Your Account</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-red-200 p-4 dark:border-red-800">
                      <h4 className="mb-2 font-semibold text-red-900 dark:text-red-200">Data That Will Be Permanently Lost</h4>
                      <ul className="space-y-1 text-sm text-red-800 dark:text-red-300">
                        <li>• <strong>All your prompts</strong> and their versions</li>
                        <li>• <strong>Account settings</strong> and preferences</li>
                        <li>• <strong>Usage history</strong> and statistics</li>
                        <li>• <strong>Profile information</strong> and bio</li>
                        <li>• <strong>Public prompts</strong> will be removed from the public directory</li>
                        <li>• <strong>Subscriptions</strong> and billing information</li>
                        <li>• <strong>All associated data</strong> stored on our servers</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">How to Delete Your Account</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Method 1: Through Settings (Recommended)</h4>
                      <ol className="list-decimal space-y-1 pl-6 text-sm">
                        <li>Sign in to your account</li>
                        <li>Go to <strong>Settings</strong> → <strong>Account</strong></li>
                        <li>Scroll to the <strong>"Delete Account"</strong> section</li>
                        <li>Click <strong>"Delete Account"</strong></li>
                        <li><strong>Read the warning dialog carefully</strong></li>
                        <li>Confirm you understand the consequences</li>
                        <li>Click <strong>"Yes, Delete My Account"</strong></li>
                        <li>Enter your password if prompted</li>
                        <li>Confirm deletion one final time</li>
                      </ol>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Method 2: Contact Support</h4>
                      <ol className="list-decimal space-y-1 pl-6 text-sm">
                        <li>Email <strong>support@promptmanage.com</strong></li>
                        <li>Include your account email address</li>
                        <li>Request account deletion</li>
                        <li>Provide verification of account ownership</li>
                        <li>Wait for confirmation (within 48 hours)</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                  <h3 className="mb-2 font-semibold text-yellow-900 dark:text-yellow-200">💡 Before Deleting Your Account</h3>
                  <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
                    <li>• <strong>Always export your data</strong> before deletion</li>
                    <li>• <strong>Save important prompts</strong> to external files</li>
                    <li>• <strong>Download any public prompts</strong> you want to keep</li>
                    <li>• <strong>Cancel subscriptions</strong> if applicable</li>
                    <li>• <strong>Consider alternatives</strong> like making prompts private</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section id="data-management" className="scroll-mt-8">
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                  <Download className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Management</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Exporting Your Data</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Request Data Export</h4>
                      <ol className="list-decimal space-y-1 pl-6 text-sm">
                        <li>Go to <strong>Settings</strong> → <strong>Legal & Privacy</strong></li>
                        <li>Scroll to <strong>"Your Data Rights"</strong> section</li>
                        <li>Click <strong>"Request Export"</strong></li>
                        <li>You'll receive an email with download instructions</li>
                        <li>Download your data within 30 days</li>
                      </ol>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">What's Included in Export</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• All your prompts in JSON format</li>
                        <li>• Account information</li>
                        <li>• Usage statistics</li>
                        <li>• Settings and preferences</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section id="privacy-security" className="scroll-mt-8">
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                  <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy & Security</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Your Privacy Rights</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Data Rights</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Right to Access:</strong> View all data we have about you</li>
                        <li>• <strong>Right to Rectification:</strong> Correct inaccurate information</li>
                        <li>• <strong>Right to Erasure:</strong> Request data deletion</li>
                        <li>• <strong>Right to Portability:</strong> Export your data</li>
                        <li>• <strong>Right to Object:</strong> Opt out of certain data processing</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Security Best Practices</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Use strong passwords</strong> (if applicable)</li>
                        <li>• <strong>Don't share verification codes</strong></li>
                        <li>• <strong>Sign out from shared devices</strong></li>
                        <li>• <strong>Report suspicious activity</strong> immediately</li>
                        <li>• <strong>Be careful with public prompts</strong> - they're visible to everyone</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Getting Help */}
          <section id="getting-help" className="scroll-mt-8">
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/40">
                  <HelpCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Getting Help</h2>
              </div>
              <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Contact Support</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Email:</strong> support@promptmanage.com</li>
                      <li>• <strong>Response Time:</strong> Within 24 hours</li>
                      <li>• <strong>Include:</strong> Your email address and detailed description</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Legal Inquiries</h3>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>Email:</strong> legal@promptmanage.com</li>
                      <li>• <strong>Response Time:</strong> Within 30 days</li>
                      <li>• <strong>For:</strong> Data deletion requests, privacy concerns, legal matters</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
