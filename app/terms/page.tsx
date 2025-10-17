import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — Prompt Manage',
  description:
    'Comprehensive Terms of Service for Prompt Manage, LLC. Legal terms governing platform use, payments, liability, and dispute resolution.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Link
            href="/legal-center"
            className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Legal Trust Center
          </Link>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Legal terms governing your use of Prompt Manage.
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Last updated: October 16, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-12">
          <section>
            <p className="text-gray-900 dark:text-gray-100">
              Welcome to Prompt Manage, LLC, a limited liability company registered in Boston,
              Massachusetts, USA (&quot;Prompt Manage&quot;, &quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;). These Terms of Service (&quot;Terms&quot;, &quot;Agreement&quot;)
              govern your access to and use of the Prompt Manage website, applications, API, and
              services (collectively, the &quot;Platform&quot; or &quot;Service&quot;).
            </p>
            <p className="mt-4 text-gray-900 dark:text-gray-100">
              By accessing, browsing, or using the Platform, you acknowledge that you have read,
              understood, and agree to be bound by these Terms, our Privacy Policy, and all
              applicable laws and regulations. If you do not agree with any part of these Terms, you
              must not use the Platform.
            </p>
            <p className="mt-4 text-gray-900 dark:text-gray-100">
              <strong>
                THESE TERMS CONTAIN AN ARBITRATION CLAUSE AND CLASS ACTION WAIVER. BY AGREEING TO
                THESE TERMS, YOU AGREE TO RESOLVE DISPUTES THROUGH BINDING INDIVIDUAL ARBITRATION.
              </strong>
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-gray-900 dark:text-gray-100">
              By creating an account, accessing, or using the Platform, you represent and warrant
              that: (a) you have read, understood, and agree to be bound by these Terms; (b) you
              have the legal capacity to enter into a binding agreement; (c) you will comply with
              all applicable laws; and (d) all registration information you submit is truthful and
              accurate. These Terms constitute a legally binding agreement between you and Prompt
              Manage, LLC.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">2. Eligibility and User Accounts</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                <strong>Age Requirement:</strong> You must be at least eighteen (18) years old to
                register for an account and use the Platform. By using the Platform, you represent
                and warrant that you meet this age requirement. We do not knowingly collect
                information from or direct any of our content specifically to children under 18.
              </p>
              <p>
                <strong>Account Registration:</strong> You must provide accurate, complete, and
                current information during registration and maintain the accuracy of such
                information. You may not use a false identity, impersonate another person or entity,
                or misrepresent your affiliation with any person or entity.
              </p>
              <p>
                <strong>Account Security:</strong> You are solely responsible for maintaining the
                confidentiality of your account credentials and for all activities that occur under
                your account. You agree to immediately notify us of any unauthorized use of your
                account or any other breach of security. Prompt Manage will not be liable for any
                loss or damage arising from your failure to maintain account security.
              </p>
              <p>
                <strong>One Account Per User:</strong> You may not create multiple accounts to
                circumvent restrictions or obtain additional free trial benefits. We reserve the
                right to terminate duplicate accounts without notice.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">
              3. Acceptable Use and Prohibited Conduct
            </h2>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              You agree to use the Platform only for lawful purposes and in accordance with these
              Terms. You are expressly prohibited from:
            </p>
            <ul className="space-y-2 text-gray-900 dark:text-gray-100">
              <li>• Engaging in fraudulent, illegal, or criminal activity of any kind</li>
              <li>
                • Violating any applicable local, state, national, or international law or
                regulation
              </li>
              <li>
                • Sending spam, unsolicited advertisements, promotional materials, or chain letters
              </li>
              <li>• Harassing, threatening, defaming, or abusing other users</li>
              <li>• Uploading or transmitting viruses, malware, or other malicious code</li>
              <li>
                • Attempting to gain unauthorized access to the Platform, other accounts, or
                computer systems
              </li>
              <li>
                • Interfering with, disrupting, or creating an undue burden on the Platform or
                networks
              </li>
              <li>
                • Infringing upon intellectual property rights, including copyrights, trademarks, or
                patents
              </li>
              <li>
                • Scraping, crawling, or using automated means to access the Platform without
                permission
              </li>
              <li>• Reverse engineering, decompiling, or disassembling any part of the Platform</li>
              <li>
                • Using the Platform to compete with Prompt Manage or develop competing products
              </li>
              <li>
                • Removing or modifying any copyright, trademark, or proprietary rights notices
              </li>
              <li>
                • Publishing or sharing content that is illegal, obscene, defamatory, or
                discriminatory
              </li>
              <li>
                • Collecting or harvesting personal information about other users without consent
              </li>
            </ul>
            <p className="mt-4 text-gray-900 dark:text-gray-100">
              Violation of these prohibitions may result in immediate termination of your account
              and legal action.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">
              4. Subscription Plans, Pricing, and Payment
            </h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                <strong>Subscription Tiers:</strong> Prompt Manage offers multiple subscription
                tiers (Free, Teams, Enterprise) with varying features and pricing. Current pricing
                is available on our Pricing page and is subject to change with notice.
              </p>
              <p>
                <strong>Billing:</strong> Paid subscriptions are billed in advance on a monthly or
                annual basis, depending on your selected plan. You authorize us to charge your
                payment method for all fees owed. You are responsible for providing accurate and
                current billing information.
              </p>
              <p>
                <strong>Automatic Renewal:</strong> Unless you cancel before the end of your current
                subscription period, your subscription will automatically renew for an additional
                period at the then-current rate. You will be charged within 24 hours prior to the
                start of the renewal period.
              </p>
              <p>
                <strong>Price Changes:</strong> We reserve the right to modify pricing for
                subscriptions at any time. Price changes will be communicated to you at least 30
                days in advance and will take effect upon your next renewal. Your continued use of
                the Service after a price change constitutes acceptance of the new pricing.
              </p>
              <p>
                <strong>Taxes:</strong> All fees are exclusive of applicable taxes, levies, or
                duties. You are responsible for payment of all such taxes, except for taxes based on
                Prompt Manage&apos;s net income.
              </p>
              <p>
                <strong>Failed Payments:</strong> If we are unable to process your payment, we may
                suspend your account until payment is received. We reserve the right to terminate
                accounts with consistently failed payments.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">5. Cancellation and Refunds</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                <strong>Cancellation:</strong> You may cancel your subscription at any time through
                your account settings or by contacting support. Cancellation will be effective at
                the end of your current billing period. You will retain access to paid features
                until that time.
              </p>
              <p>
                <strong>No Refunds:</strong> Except as required by law or as expressly stated in
                these Terms, all payments are non-refundable. We do not provide refunds or credits
                for partial months or years of service, unused features, or content you did not use.
              </p>
              <p>
                <strong>Free Trials:</strong> If you cancel during a free trial period, you will not
                be charged. Free trials are available only once per user and may not be combined
                with other offers.
              </p>
              <p>
                <strong>Downgrade:</strong> If you downgrade your subscription, the change will take
                effect at the start of your next billing cycle. You will retain access to premium
                features until that time.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">6. Intellectual Property Rights</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                <strong>Your Content:</strong> You retain all ownership rights to the prompts, text,
                data, and other content you create, upload, or submit to the Platform (&quot;User
                Content&quot;). You represent and warrant that you own or have the necessary
                licenses, rights, consents, and permissions to use and authorize us to use your User
                Content.
              </p>
              <p>
                <strong>License to User Content:</strong> By making User Content public or sharing
                it on the Platform, you grant Prompt Manage a worldwide, non-exclusive,
                royalty-free, sublicensable, and transferable license to use, reproduce, distribute,
                display, and perform your User Content in connection with operating and improving
                the Platform. This license ends when you delete your User Content or account, except
                where it has been shared with others who have not deleted it.
              </p>
              <p>
                <strong>Our Platform:</strong> The Platform, including its original content,
                features, functionality, source code, and all related intellectual property, is
                owned by Prompt Manage, LLC and is protected by United States and international
                copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p>
                <strong>Trademarks:</strong> &quot;Prompt Manage&quot; and our logos are trademarks
                of Prompt Manage, LLC. You may not use these marks without our prior written
                permission.
              </p>
              <p>
                <strong>Feedback:</strong> If you provide us with any feedback, suggestions, or
                ideas about the Platform, you grant us the right to use such feedback without
                compensation or attribution.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">7. Third-Party Services and Links</h2>
            <p className="text-gray-900 dark:text-gray-100">
              The Platform may contain links to third-party websites, services, or resources,
              including integrations with AI models (OpenAI, Anthropic, etc.), payment processors
              (Stripe), and other services. We do not control, endorse, or assume responsibility for
              any third-party sites, services, or content. You acknowledge and agree that we are not
              responsible or liable for any damage or loss caused by your use of any third-party
              services. Your use of third-party services is governed by their respective terms and
              privacy policies.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">8. API Terms and Usage</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                <strong>API Access:</strong> If you access our API, you agree to comply with our API
                documentation and usage guidelines. API access may be subject to rate limits and
                usage quotas based on your subscription tier.
              </p>
              <p>
                <strong>API Keys:</strong> You are responsible for maintaining the confidentiality
                of your API keys. Do not share your API keys publicly or with unauthorized third
                parties.
              </p>
              <p>
                <strong>API Restrictions:</strong> You may not use our API to: (a) replicate or
                compete with the Platform; (b) exceed rate limits or attempt to circumvent usage
                restrictions; (c) access data you are not authorized to access; or (d) resell or
                redistribute API access.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">9. Data Privacy and Security</h2>
            <p className="text-gray-900 dark:text-gray-100">
              Your use of the Platform is governed by our Privacy Policy, which is incorporated into
              these Terms by reference. By using the Platform, you consent to our collection, use,
              and disclosure of your information as described in our Privacy Policy. We implement
              reasonable security measures to protect your data, but cannot guarantee absolute
              security. For detailed information about our data practices, security measures, and
              compliance certifications, please see our Privacy Policy and Security Overview.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">10. Disclaimers of Warranties</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                <strong className="uppercase">
                  The Platform is provided &quot;as is&quot; and &quot;as available&quot; without
                  warranties of any kind, either express or implied.
                </strong>{' '}
                To the maximum extent permitted by law, Prompt Manage disclaims all warranties,
                including but not limited to:
              </p>
              <ul className="space-y-1">
                <li>
                  • Implied warranties of merchantability, fitness for a particular purpose, and
                  non-infringement
                </li>
                <li>• Warranties that the Platform will be uninterrupted, error-free, or secure</li>
                <li>
                  • Warranties regarding the accuracy, reliability, or completeness of content or
                  results
                </li>
                <li>
                  • Warranties that defects will be corrected or that the Platform is free of
                  viruses
                </li>
              </ul>
              <p className="mt-4">
                <strong>AI-Generated Content:</strong> Outputs from AI models integrated with our
                Platform are generated by third-party services and may contain inaccuracies, errors,
                or inappropriate content. We do not guarantee the accuracy, appropriateness, or
                legality of AI-generated content. You are solely responsible for reviewing and
                validating all AI outputs before use.
              </p>
              <p>
                <strong>No Professional Advice:</strong> The Platform does not provide legal,
                financial, medical, or other professional advice. Any content or suggestions are for
                informational purposes only. Consult appropriate professionals before making
                decisions.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">11. Limitation of Liability</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p className="uppercase">
                <strong>
                  To the maximum extent permitted by law, Prompt Manage, its officers, directors,
                  employees, agents, and affiliates shall not be liable for any indirect,
                  incidental, special, consequential, exemplary, or punitive damages, including but
                  not limited to damages for loss of profits, goodwill, use, data, or other
                  intangible losses, resulting from:
                </strong>
              </p>
              <ul className="space-y-1">
                <li>• Your use of or inability to use the Platform</li>
                <li>• Unauthorized access to or alteration of your transmissions or data</li>
                <li>• Statements or conduct of any third party on the Platform</li>
                <li>• Any errors, mistakes, or inaccuracies in content or AI outputs</li>
                <li>
                  • Personal injury or property damage resulting from your use of the Platform
                </li>
                <li>• Interruption or cessation of the Platform</li>
                <li>• Data loss or corruption</li>
                <li>• Costs of procurement of substitute services</li>
              </ul>
              <p className="mt-4 uppercase">
                <strong>
                  In no event shall our total liability to you for all damages, losses, and causes
                  of action exceed the amount you paid to us in the twelve (12) months prior to the
                  claim, or one hundred dollars ($100), whichever is greater.
                </strong>
              </p>
              <p className="mt-4">
                Some jurisdictions do not allow the exclusion or limitation of certain warranties or
                liabilities. In such jurisdictions, our liability will be limited to the maximum
                extent permitted by law.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">12. Indemnification</h2>
            <p className="text-gray-900 dark:text-gray-100">
              You agree to indemnify, defend, and hold harmless Prompt Manage, LLC, its officers,
              directors, employees, agents, licensors, and suppliers from and against any claims,
              liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including
              reasonable attorneys&apos; fees) arising out of or relating to: (a) your violation of
              these Terms; (b) your violation of any rights of another party, including intellectual
              property rights; (c) your User Content; (d) your use or misuse of the Platform; or (e)
              your violation of any applicable laws or regulations.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">13. Termination</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                <strong>Termination by You:</strong> You may terminate your account at any time by
                following the account deletion process in your account settings or by contacting us
                at legal@promptmanage.com.
              </p>
              <p>
                <strong>Termination by Us:</strong> We may terminate or suspend your account and
                access to the Platform immediately, without prior notice or liability, for any
                reason, including but not limited to: (a) breach of these Terms; (b) fraudulent,
                illegal, or abusive behavior; (c) request by law enforcement or government agencies;
                (d) extended periods of inactivity; (e) unexpected technical issues; or (f)
                nonpayment of fees.
              </p>
              <p>
                <strong>Effect of Termination:</strong> Upon termination, your right to use the
                Platform will immediately cease. All provisions of these Terms that by their nature
                should survive termination shall survive, including but not limited to intellectual
                property provisions, disclaimers, indemnification, and limitations of liability.
              </p>
              <p>
                <strong>Data Retention:</strong> Following termination, we may retain your User
                Content for a reasonable period to comply with legal obligations, resolve disputes,
                and enforce our agreements. See our Privacy Policy and Data Erasure Policy for
                details on data deletion.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">14. Dispute Resolution and Arbitration</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                <strong className="uppercase">
                  Please read this section carefully. It affects your legal rights.
                </strong>
              </p>
              <p>
                <strong>Informal Resolution:</strong> Before filing a claim, you agree to contact us
                at legal@promptmanage.com to attempt to resolve the dispute informally. We will
                attempt to resolve the dispute through good faith negotiations for a period of 60
                days.
              </p>
              <p>
                <strong>Binding Arbitration:</strong> If we cannot resolve a dispute through
                informal negotiations, you and Prompt Manage agree that any dispute, claim, or
                controversy arising out of or relating to these Terms or your use of the Platform
                will be settled by binding arbitration, rather than in court, except that you may
                assert claims in small claims court if your claims qualify.
              </p>
              <p>
                <strong>Arbitration Rules:</strong> The arbitration will be administered by the
                American Arbitration Association (AAA) under its Commercial Arbitration Rules and,
                where appropriate, the AAA&apos;s Consumer Arbitration Rules. The arbitrator&apos;s
                decision will be final and binding, and judgment on the award may be entered in any
                court having jurisdiction.
              </p>
              <p>
                <strong>Class Action Waiver:</strong> YOU AND PROMPT MANAGE AGREE THAT EACH MAY
                BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A
                PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
                Unless both you and Prompt Manage agree otherwise, the arbitrator may not
                consolidate more than one person&apos;s claims or preside over any form of
                representative or class proceeding.
              </p>
              <p>
                <strong>Exceptions:</strong> Either party may seek equitable relief in court for
                infringement or misuse of intellectual property rights.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">15. Governing Law and Jurisdiction</h2>
            <p className="text-gray-900 dark:text-gray-100">
              These Terms shall be governed by and construed in accordance with the laws of the
              Commonwealth of Massachusetts, United States, without regard to its conflict of law
              provisions. Any legal action or proceeding arising under these Terms will be brought
              exclusively in the federal or state courts located in Boston, Massachusetts, and you
              hereby irrevocably consent to personal jurisdiction and venue therein.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">16. Export Controls</h2>
            <p className="text-gray-900 dark:text-gray-100">
              You agree to comply with all applicable export and import control laws and
              regulations, including the Export Administration Regulations maintained by the U.S.
              Department of Commerce and trade sanctions maintained by the U.S. Treasury
              Department&apos;s Office of Foreign Assets Control. You represent that you are not
              located in, under the control of, or a national or resident of any country to which
              the United States has embargoed goods or services.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">17. Changes to Terms</h2>
            <p className="text-gray-900 dark:text-gray-100">
              We reserve the right to modify these Terms at any time. We will notify you of material
              changes by posting the updated Terms on this page and updating the &quot;Last
              Updated&quot; date. We may also provide notice via email or a notification on the
              Platform. Your continued use of the Platform after such modifications constitutes your
              acceptance of the updated Terms. If you do not agree to the modified Terms, you must
              stop using the Platform and may terminate your account.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">18. General Provisions</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                <strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy and
                any additional terms or policies referenced herein, constitute the entire agreement
                between you and Prompt Manage regarding the Platform and supersede all prior
                agreements and understandings.
              </p>
              <p>
                <strong>Severability:</strong> If any provision of these Terms is found to be
                unenforceable or invalid, that provision will be limited or eliminated to the
                minimum extent necessary, and the remaining provisions will remain in full force and
                effect.
              </p>
              <p>
                <strong>Waiver:</strong> No waiver of any term of these Terms shall be deemed a
                further or continuing waiver of such term or any other term. Our failure to assert
                any right or provision under these Terms shall not constitute a waiver of such right
                or provision.
              </p>
              <p>
                <strong>Assignment:</strong> You may not assign or transfer these Terms or your
                rights hereunder without our prior written consent. We may assign or transfer these
                Terms or our rights without restriction. Any attempted assignment in violation of
                this section is void.
              </p>
              <p>
                <strong>Force Majeure:</strong> We shall not be liable for any failure or delay in
                performance due to circumstances beyond our reasonable control, including but not
                limited to acts of God, war, terrorism, riots, embargoes, acts of civil or military
                authorities, fire, floods, accidents, pandemics, strikes, or shortages of
                transportation facilities, fuel, energy, labor, or materials.
              </p>
              <p>
                <strong>Notices:</strong> All notices to you may be provided via email to the
                address associated with your account or by posting to the Platform. Notices to us
                should be sent to legal@promptmanage.com.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">19. Related Pages</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/privacy" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Privacy Policy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  How we collect, use, and protect your information
                </p>
              </Link>
              <Link href="/security" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Security Overview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data encryption, infrastructure, and compliance
                </p>
              </Link>
              <Link href="/legal-center/dpa" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Data Protection Addendum</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  GDPR compliance and data processing agreements
                </p>
              </Link>
              <Link href="/dmca" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">DMCA Policy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Copyright infringement notification procedures
                </p>
              </Link>
              <Link href="/accessibility" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Accessibility</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our commitment to WCAG 2.1 compliance
                </p>
              </Link>
              <Link href="/support" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Support Center</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Help articles and contact information
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">20. Contact</h2>
            <div>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Prompt Manage LLC</p>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                125 Stoughton Street, Unit 2
              </p>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Boston, MA 02125</p>
              <a
                href="mailto:legal@promptmanage.com"
                className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                legal@promptmanage.com
              </a>
            </div>
            <div className="mt-8 text-sm">
              <Link
                href="/legal-center"
                className="underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                ← Back to Legal Trust Center
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
