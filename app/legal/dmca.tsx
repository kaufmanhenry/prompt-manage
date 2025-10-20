export default function DmcaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Digital Millennium Copyright Act (DMCA) Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Prompt Manage respects intellectual property rights and complies with the Digital Millennium Copyright Act.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Last updated: October 20, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">

          {/* Official DMCA Information */}
          <section>
            <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
              <h2 className="mb-3 text-xl font-semibold text-blue-900 dark:text-blue-100">
                Official DMCA Information
              </h2>
              <p className="mb-4 text-blue-800 dark:text-blue-200">
                For comprehensive information about the Digital Millennium Copyright Act, please visit the official U.S. Copyright Office website:
              </p>
              <a
                href="https://www.copyright.gov/dmca/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Official DMCA Information (U.S. Copyright Office)
              </a>
            </div>
          </section>

          {/* Overview */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Overview</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Prompt Manage is a platform for organizing, sharing, and managing AI prompts. This website
                qualifies as a "Service Provider" within the meaning of 17 U.S. Code § 512 of
                the Digital Millennium Copyright Act ("DMCA"). As a service provider, Prompt Manage
                is entitled to certain protections from claims of copyright infringement under the
                DMCA, commonly referred to as the "safe harbor" provisions.
              </p>
              <p>
                We respect the intellectual property of others and ask all users to do the same. 
                Accordingly, we observe and comply with the DMCA, and have adopted the following 
                Copyright Infringement Notice and Takedown Policy relating to claims of copyright 
                infringement by our users.
              </p>
              <p>
                The DMCA provides a process for copyright owners to notify service providers of 
                alleged copyright infringement. It also provides a process for users to submit 
                counter-notifications if they believe their content was wrongly removed.
              </p>
            </div>
          </section>

          {/* DMCA Safe Harbor Provisions */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">DMCA Safe Harbor Provisions</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Under Section 512 of the DMCA, online service providers are protected from monetary 
                liability for copyright infringement if they meet certain conditions, including:
              </p>
              <ul className="ml-6 space-y-2 list-disc">
                <li>Designating an agent to receive copyright infringement notices</li>
                <li>Implementing a notice-and-takedown system</li>
                <li>Not having actual knowledge of infringing activity</li>
                <li>Acting expeditiously to remove infringing content when notified</li>
                <li>Not receiving financial benefit from infringing activity</li>
              </ul>
              <p>
                Prompt Manage has designated a DMCA agent and implements these procedures to maintain 
                safe harbor protection.
              </p>
            </div>
          </section>

          {/* Copyright Infringement Notification */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Copyright Infringement Notification</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                If you believe that content available on or through Prompt Manage infringes one or 
                more of your copyrights, please immediately notify Prompt Manage's Designated Copyright 
                Agent by mail or email ("Notification") providing the information described below, 
                as set forth in the Digital Millennium Copyright Act of 1998 ("DMCA").
              </p>
              <p>
                <strong className="text-red-600 dark:text-red-400">Important:</strong> Please be advised 
                that you may be held liable for damages if you make material misrepresentations pursuant 
                to federal law in a Notification. If you are not sure content located on, embedded on, 
                or linked-to by the website infringes your copyright, you should consider first contacting 
                an attorney.
              </p>
            </div>

            <div className="mt-6 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Required Information for DMCA Notifications
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                All Notifications must include the following information:
              </p>
              <ol className="space-y-3 list-decimal ml-6 text-gray-600 dark:text-gray-400">
                <li>
                  <strong>A physical or electronic signature</strong> of a person authorized to act on 
                  behalf of the owner of an exclusive right that is allegedly infringed.
                </li>
                <li>
                  <strong>Identification of the copyrighted work</strong> claimed to have been infringed, 
                  or, if multiple copyrighted works at a single online site are covered by a single 
                  notification, a representative list of such works at that site.
                </li>
                <li>
                  <strong>Identification of the material</strong> that is claimed to be infringing or 
                  to be the subject of infringing activity and that is to be removed or access to which 
                  is to be disabled, and information reasonably sufficient to permit the service provider 
                  to locate the material.
                </li>
                <li>
                  <strong>Contact information</strong> reasonably sufficient to permit the service provider 
                  to contact the complaining party, such as an address, telephone number, and, if available, 
                  an electronic mail address at which the complaining party may be contacted.
                </li>
                <li>
                  <strong>A statement</strong> that the complaining party has a good faith belief that use 
                  of the material in the manner complained of is not authorized by the copyright owner, 
                  its agent, or the law.
                </li>
                <li>
                  <strong>A statement</strong> that the information in the notification is accurate, and 
                  under penalty of perjury, that the complaining party is authorized to act on behalf of 
                  the owner of an exclusive right that is allegedly infringed.
                </li>
              </ol>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Designated Copyright Agent Contact Information</h2>
            <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                <strong>Important:</strong> Only DMCA notices sent to the designated agent below will be processed. 
                All other inquiries or requests will be discarded.
              </p>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <p>
                  <strong>Mailing Address:</strong><br />
                  Prompt Manage LLC<br />
                  125 Stoughton Street, Unit 2<br />
                  Boston, MA 02125<br />
                  United States
                </p>
                <p>
                  <strong>Email Address:</strong>{' '}
                  <a
                    href="mailto:dmca@promptmanage.com"
                    className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    dmca@promptmanage.com
                  </a>
                </p>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                Please include "DMCA Notice" in the subject line of your email for faster processing.
              </p>
            </div>
          </section>

          {/* Process Information */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">DMCA Process Information</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Upon receiving a valid DMCA notification, Prompt Manage will:
              </p>
              <ul className="ml-6 space-y-2 list-disc">
                <li>Review the notification for completeness and validity</li>
                <li>Remove or disable access to the allegedly infringing material</li>
                <li>Notify the user who posted the content about the removal</li>
                <li>Provide the user with a copy of the DMCA notice</li>
                <li>Inform the user about their right to submit a counter-notification</li>
              </ul>
              <p>
                Prompt Manage may also terminate the account of users who repeatedly infringe copyrights, 
                in accordance with our Terms of Service.
              </p>
            </div>
          </section>

          {/* Counter-Notification */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Counter-Notification Process</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                If you believe that your content was wrongly removed due to a DMCA notice, you may submit 
                a counter-notification pursuant to Section 512(g)(2)&(3) of the DMCA.
              </p>
              <p>
                <strong className="text-red-600 dark:text-red-400">Important:</strong> Submitting a 
                counter-notification is a serious legal action. You will be liable for any misrepresentations 
                which may cause claims to be brought against Prompt Manage.
              </p>
            </div>

            <div className="mt-6 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Required Information for Counter-Notifications
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Counter-notifications must include:
              </p>
              <ol className="space-y-3 list-decimal ml-6 text-gray-600 dark:text-gray-400">
                <li>
                  <strong>A physical or electronic signature</strong> of the user who posted the content
                </li>
                <li>
                  <strong>Identification of the material</strong> that has been removed or to which access 
                  has been disabled and the location at which the material appeared before it was removed
                </li>
                <li>
                  <strong>A statement</strong> under penalty of perjury that the user has a good faith 
                  belief that the material was removed or disabled as a result of mistake or misidentification
                </li>
                <li>
                  <strong>Contact information</strong> including name, address, and telephone number
                </li>
                <li>
                  <strong>Consent to jurisdiction</strong> of the Federal District Court for the judicial 
                  district in which the address is located, or if outside the United States, for any 
                  judicial district in which Prompt Manage may be found
                </li>
              </ol>
            </div>

            <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                After receiving a valid counter-notification, Prompt Manage will:
              </p>
              <ul className="ml-6 space-y-2 list-disc">
                <li>Forward the counter-notification to the original complainant</li>
                <li>Wait 10-14 business days for the complainant to file a court action</li>
                <li>Restore the content if no court action is filed within the waiting period</li>
              </ul>
              <p>
                <strong>Note:</strong> If the original complainant files a court action seeking to restrain 
                the user from engaging in infringing activity, the content will remain removed until the 
                court resolves the matter.
              </p>
            </div>
          </section>

          {/* Repeat Infringer Policy */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Repeat Infringer Policy</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Prompt Manage maintains a policy of terminating, in appropriate circumstances, users who 
                are repeat infringers. A repeat infringer is a user who has been the subject of more than 
                one valid DMCA notice.
              </p>
              <p>
                We may also terminate accounts of users who submit false DMCA notices or counter-notifications, 
                as such actions constitute abuse of the DMCA process.
              </p>
            </div>
          </section>

          {/* Additional Resources */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Additional Resources</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                For more information about copyright law and the DMCA, please consult:
              </p>
              <ul className="ml-6 space-y-2 list-disc">
                <li>
                  <a
                    href="https://www.copyright.gov/dmca/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    U.S. Copyright Office DMCA Information
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.copyright.gov/title17/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Title 17 of the U.S. Code (Copyright Law)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.copyright.gov/help/faq/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Copyright Office FAQ
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* Legal Disclaimer */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Legal Disclaimer</h2>
            <div className="rounded-lg bg-yellow-50 p-6 dark:bg-yellow-900/20">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>Disclaimer:</strong> This DMCA policy is provided for informational purposes only 
                and does not constitute legal advice. If you have questions about copyright law or the 
                DMCA process, please consult with a qualified attorney. Prompt Manage reserves the right 
                to modify this policy at any time without notice.
              </p>
            </div>
          </section>

          {/* Contact for Questions */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Questions About This Policy</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                If you have questions about this DMCA policy or need assistance with the DMCA process, 
                please contact us at:
              </p>
              <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
                <p>
                  <strong>Email:</strong>{' '}
                  <a
                    href="mailto:legal@promptmanage.com"
                    className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    legal@promptmanage.com
                  </a>
                </p>
                <p className="mt-2">
                  <strong>Note:</strong> This email is for policy questions only. DMCA notices must be 
                  sent to the designated agent address listed above.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}