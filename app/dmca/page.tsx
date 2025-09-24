import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'DMCA Policy - Prompt Manage',
  description: 'Digital Millennium Copyright Act (DMCA) policy and procedures for Prompt Manage.',
}

export default function DmcaPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          Digital Millennium Copyright Act Notice
        </h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Prompt Manage is a platform for organizing, sharing, and managing AI prompts. This website
          qualifies as a &ldquo;Service Provider&rdquo; within the meaning of 17 U.S. Code § 512 of
          the Digital Millennium Copyright Act (&ldquo;DMCA&rdquo;). As a service provider, Prompt
          Manage is entitled to certain protections from claims of copyright infringement under the
          DMCA, commonly referred to as the &ldquo;safe harbor&rdquo; provisions. We respect the
          intellectual property of others and ask all users to do the same. Accordingly, we observe
          and comply with the DMCA, and have adopted the following Copyright Infringement Notice and
          Takedown Policy relating to claims of copyright infringement by our users.
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
          Copyright Infringement Notification
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          If you believe that content available on or through Prompt Manage, LLC (&ldquo;Prompt
          Manage&rdquo;) infringes one or more of your copyrights, please immediately notify Prompt
          Manage&rsquo;s Designated Copyright Agent by mail or email (&ldquo;Notification&rdquo;)
          providing the information described below, as set forth in the Digital Millennium
          Copyright Act of 1998 (&ldquo;DMCA&rdquo;). A copy of your Notification will be sent to
          the person responsible for the material addressed in the Notification.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Please be advised that you may be held liable for damages if you make material
          misrepresentations pursuant to federal law in a Notification. If you are not sure content
          located on, embedded on, or linked-to by the website infringes your copyright, you should
          consider first contacting an attorney.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          All Notifications should include the following:
        </p>
        <ul className="mb-6 list-decimal space-y-2 pl-6 text-gray-700 dark:text-gray-300">
          <li>
            A physical or electronic signature of a person authorized to act on behalf of the owner
            of an exclusive right that is allegedly infringed.
          </li>
          <li>
            Identification of the copyrighted work claimed to have been infringed, or, if multiple
            copyrighted works at a single online site are covered by a single notification, a
            representative list of such works at that site.
          </li>
          <li>
            Identification of the material that is claimed to be infringing or to be the subject of
            infringing activity and that is to be removed or access to which is to be disabled, and
            information reasonably sufficient to permit the service provider to locate the material.
          </li>
          <li>
            Information reasonably sufficient to permit the service provider to contact the
            complaining party, such as an address, telephone number, and, if available, an
            electronic mail address at which the complaining party may be contacted.
          </li>
          <li>
            A statement that the complaining party has a good faith belief that use of the material
            in the manner complained of is not authorized by the copyright owner, its agent, or the
            law.
          </li>
          <li>
            A statement that the information in the notification is accurate, and under penalty of
            perjury, that the complaining party is authorized to act on behalf of the owner of an
            exclusive right that is allegedly infringed.
          </li>
        </ul>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Please do not send other inquiries or information to our Designated Agent.
        </p>
        <h3 className="mb-2 mt-8 text-lg font-semibold text-gray-900 dark:text-white">
          Notifications should be sent to the following:
        </h3>
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          Address: Prompt Manage LLC, 125 Stoughton Street, Unit 2, Boston, MA 02125
          <br />
          Email:{' '}
          <a
            href="mailto:dmca@promptmanage.com"
            className="text-blue-600 underline dark:text-blue-400"
          >
            dmca@promptmanage.com
          </a>
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Only DMCA notices mailed to the address above or emailed to dmca@promptmanage.com will be
          accepted. All other inquiries or requests will be discarded. Upon receiving a DMCA
          notification or complaint related to copyright infringement, Prompt Manage may remove the
          content identified as being infringing, as long as we receive all of the required
          information for a DMCA request, and we are able to verify the validity of the request. In
          addition, Prompt Manage may terminate the account of the user that appears to be the
          infringer.
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
          Counter-Notification
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          If the recipient of a DMCA Takedown (&ldquo;Notice&rdquo;) believes that the Notice is
          erroneous or false, and/or that allegedly infringing material has been wrongly removed in
          accordance with the procedures outlined above, the recipient is permitted to submit a
          counter-notification pursuant to Section 512(g)(2)&(3) of the DMCA. A counter-notification
          is the proper method for the recipient to dispute the removal or disabling of material
          pursuant to a Notice. The information that a recipient provides in a counter-notification
          must be accurate and truthful, and the recipient will be liable for any misrepresentations
          which may cause any claims to be brought against Prompt Manage relating to the actions
          taken in response to the counter-notification. This counter-notification will be forwarded
          to the original party that submitted the DMCA claim. If we have not received notice
          (within 14 days) that the original claimant has filed an action seeking a court order to
          restrain the recipient from engaging in infringing activity relating to the material on
          Prompt Manage&rsquo;s system or network, we will re-instate the content.
        </p>

        {/* Related Policies */}
        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Related Policies
          </h3>
          <ul className="list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
            <li>
              <a href="/terms" className="text-blue-600 underline dark:text-blue-400">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/privacy" className="text-blue-600 underline dark:text-blue-400">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
