import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Prompt Manage',
  description:
    'Comprehensive Privacy Policy for Prompt Manage. Learn how we collect, use, protect, and handle your personal information and data.',
  keywords:
    'privacy policy, data protection, Prompt Manage privacy, user data, GDPR, CCPA, personal information, data security',
  openGraph: {
    title: 'Privacy Policy — Prompt Manage',
    description: 'Learn how we collect, use, and protect your personal information.',
    type: 'website',
  },
}

export default function PrivacyPage() {
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
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">Privacy Policy</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            How we collect, use, and protect your information.
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
              This Privacy Policy describes how Prompt Manage, LLC (&quot;Prompt Manage&quot;,
              &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, discloses, and
              protects your information when you use our website, applications, API, and services
              (collectively, the &quot;Platform&quot; or &quot;Service&quot;).
            </p>
            <p className="mt-4 text-gray-900 dark:text-gray-100">
              By accessing or using the Platform, you agree to the collection and use of information
              in accordance with this Privacy Policy. If you do not agree with our policies and
              practices, do not use the Platform.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">1. Information We Collect</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-base font-medium">Personal Information You Provide</h3>
                <p className="mb-2 text-gray-900 dark:text-gray-100">
                  We collect information you provide directly to us when you:
                </p>
                <ul className="space-y-1 text-gray-900 dark:text-gray-100">
                  <li>• Create an account (name, email address, password)</li>
                  <li>• Subscribe to a paid plan (billing information handled by Stripe)</li>
                  <li>• Create, edit, or share prompts and content</li>
                  <li>• Contact us for support or feedback</li>
                  <li>• Participate in surveys or promotions</li>
                  <li>• Update your profile or account settings</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-base font-medium">Automatically Collected Information</h3>
                <p className="mb-2 text-gray-900 dark:text-gray-100">
                  When you use our Platform, we automatically collect:
                </p>
                <ul className="space-y-1 text-gray-900 dark:text-gray-100">
                  <li>• IP address and general location (city/country level)</li>
                  <li>• Device information (browser type, operating system, device type)</li>
                  <li>• Usage data (pages visited, features used, time spent, click patterns)</li>
                  <li>• Referral source (how you found our Platform)</li>
                  <li>• Cookies and similar tracking technologies</li>
                  <li>• API usage metrics and logs</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-base font-medium">User Content</h3>
                <p className="text-gray-900 dark:text-gray-100">
                  We store the prompts, descriptions, tags, and other content you create on the
                  Platform (&quot;User Content&quot;). You control whether this content is private
                  or public.
                </p>
              </div>

              <div>
                <h3 className="mb-3 text-base font-medium">Third-Party Information</h3>
                <p className="text-gray-900 dark:text-gray-100">
                  If you sign in using a third-party service (e.g., Google OAuth), we receive basic
                  profile information (name, email) from that service in accordance with your
                  privacy settings on that platform.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">2. How We Use Your Information</h2>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              We use the information we collect to:
            </p>
            <ul className="space-y-2 text-gray-900 dark:text-gray-100">
              <li>• Provide, maintain, and improve the Platform</li>
              <li>• Process your transactions and manage subscriptions</li>
              <li>• Send you technical notices, updates, security alerts, and support messages</li>
              <li>• Respond to your comments, questions, and customer service requests</li>
              <li>• Communicate about products, services, offers, and events</li>
              <li>• Monitor and analyze usage patterns, trends, and user behavior</li>
              <li>• Detect, prevent, and address technical issues, fraud, and abuse</li>
              <li>• Personalize your experience and provide relevant content</li>
              <li>• Enforce our Terms of Service and protect our rights and property</li>
              <li>• Comply with legal obligations and respond to legal requests</li>
              <li>• Facilitate account creation and authentication</li>
              <li>• Generate aggregate, anonymized statistics about Platform usage</li>
            </ul>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">3. Information Sharing and Disclosure</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                <strong>
                  We do not sell, rent, or trade your personal information to third parties for
                  their marketing purposes.
                </strong>
              </p>
              <p>We may share your information only in the following circumstances:</p>

              <div>
                <p className="mb-2">
                  <strong>Service Providers:</strong>
                </p>
                <p className="mb-2">
                  We share information with trusted third-party service providers who assist in
                  operating our Platform:
                </p>
                <ul className="space-y-1">
                  <li>• Vercel (hosting and infrastructure)</li>
                  <li>• Supabase (database and authentication)</li>
                  <li>• Stripe (payment processing)</li>
                  <li>• OpenAI, Anthropic (AI model APIs for prompt execution)</li>
                </ul>
                <p className="mt-2">
                  See our{' '}
                  <Link
                    href="/legal-center/subprocessors"
                    className="underline hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    Subprocessors page
                  </Link>{' '}
                  for a complete list.
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Legal Requirements:</strong>
                </p>
                <p>
                  We may disclose your information if required by law or in response to valid
                  requests by public authorities (e.g., court orders, subpoenas, government
                  agencies).
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Protection of Rights:</strong>
                </p>
                <p>
                  We may disclose information to protect and defend the rights, property, or safety
                  of Prompt Manage, our users, or the public, including enforcing our Terms of
                  Service.
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Business Transfers:</strong>
                </p>
                <p>
                  If we are involved in a merger, acquisition, or sale of assets, your information
                  may be transferred. We will provide notice before your information becomes subject
                  to a different privacy policy.
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>With Your Consent:</strong>
                </p>
                <p>
                  We may share information with third parties when you explicitly consent to such
                  sharing.
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Public Content:</strong>
                </p>
                <p>
                  If you make your prompts or profile public, that information is visible to other
                  users and may be indexed by search engines.
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Aggregated and Anonymized Data:</strong>
                </p>
                <p>
                  We may share aggregated, anonymized data that cannot reasonably be used to
                  identify you.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">4. Data Security</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                We implement appropriate technical and organizational security measures to protect
                your personal information against unauthorized access, alteration, disclosure, or
                destruction. These measures include:
              </p>
              <ul className="space-y-1">
                <li>• Encryption of data in transit (TLS/HTTPS) and at rest (AES-256)</li>
                <li>
                  • Secure authentication mechanisms (OAuth 2.0, password hashing with bcrypt)
                </li>
                <li>• Regular security audits and vulnerability assessments</li>
                <li>• Access controls and role-based permissions</li>
                <li>• Secure backup and disaster recovery procedures</li>
                <li>• Employee training on data protection and security</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the internet or electronic storage is 100%
                secure. While we strive to protect your information, we cannot guarantee absolute
                security. You are responsible for maintaining the confidentiality of your account
                credentials.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">5. Data Retention</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                We retain your personal information for as long as necessary to provide the Platform
                and fulfill the purposes outlined in this Privacy Policy, unless a longer retention
                period is required or permitted by law.
              </p>
              <p>
                <strong>Active Accounts:</strong> We retain your data while your account is active
                and for a reasonable period thereafter.
              </p>
              <p>
                <strong>Deleted Accounts:</strong> When you delete your account, we permanently
                delete your personal information and User Content within 30 days, except where we
                are required to retain certain information for legal, accounting, or security
                purposes.
              </p>
              <p>
                <strong>Backups:</strong> Deleted data may persist in backups for up to 90 days
                before permanent deletion.
              </p>
              <p>
                See our{' '}
                <Link
                  href="/legal-center/data-erasure"
                  className="underline hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Data Erasure Policy
                </Link>{' '}
                for details on requesting data deletion.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">6. Your Privacy Rights</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                Depending on your location, you may have the following rights regarding your
                personal information:
              </p>

              <div>
                <p className="mb-2">
                  <strong>Access and Portability:</strong>
                </p>
                <p>
                  Request a copy of the personal information we hold about you in a structured,
                  machine-readable format.
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Correction:</strong>
                </p>
                <p>Request correction of inaccurate or incomplete personal information.</p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Deletion:</strong>
                </p>
                <p>
                  Request deletion of your personal information, subject to certain legal
                  exceptions.
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Objection and Restriction:</strong>
                </p>
                <p>
                  Object to or request restriction of certain processing of your personal
                  information.
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Withdraw Consent:</strong>
                </p>
                <p>
                  Withdraw consent for processing where we rely on your consent as the legal basis.
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Opt-Out of Marketing:</strong>
                </p>
                <p>
                  Unsubscribe from marketing communications via the link in our emails or by
                  contacting us.
                </p>
              </div>

              <p className="mt-4">
                To exercise any of these rights, contact us at{' '}
                <a
                  href="mailto:legal@promptmanage.com"
                  className="underline hover:text-gray-600 dark:hover:text-gray-300"
                >
                  legal@promptmanage.com
                </a>
                . We will respond to your request within 30 days.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">7. Cookies and Tracking Technologies</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                We use cookies and similar tracking technologies to collect and store information
                about your use of the Platform.
              </p>

              <div>
                <p className="mb-2">
                  <strong>Essential Cookies:</strong>
                </p>
                <p>
                  Required for the Platform to function (authentication, security, session
                  management).
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Analytics Cookies:</strong>
                </p>
                <p>
                  Help us understand how users interact with the Platform to improve functionality
                  and user experience.
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Preference Cookies:</strong>
                </p>
                <p>Remember your settings and preferences (theme, language, display options).</p>
              </div>

              <p className="mt-4">
                You can control cookies through your browser settings. However, disabling certain
                cookies may limit your ability to use some features of the Platform.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">8. Third-Party Services and Links</h2>
            <p className="text-gray-900 dark:text-gray-100">
              The Platform may contain links to third-party websites, services, or applications. We
              are not responsible for the privacy practices of these third parties. We encourage you
              to review the privacy policies of any third-party services you access through our
              Platform.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">9. Children's Privacy</h2>
            <p className="text-gray-900 dark:text-gray-100">
              Our Platform is not directed to individuals under the age of 18. We do not knowingly
              collect personal information from children under 18. If we become aware that we have
              collected personal information from a child under 18, we will take steps to delete
              such information. If you believe we have collected information from a child under 18,
              please contact us at legal@promptmanage.com.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">10. International Data Transfers</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                Prompt Manage is based in the United States. Your information may be transferred to,
                stored, and processed in the United States and other countries where our service
                providers operate.
              </p>
              <p>
                If you are located in the European Economic Area (EEA), United Kingdom, or
                Switzerland, we comply with applicable data protection laws regarding international
                data transfers. We use standard contractual clauses and ensure our service providers
                maintain appropriate safeguards.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">11. GDPR Compliance (EU/UK Users)</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                If you are located in the European Economic Area or United Kingdom, you have
                additional rights under the General Data Protection Regulation (GDPR):
              </p>

              <div>
                <p className="mb-2">
                  <strong>Legal Basis for Processing:</strong>
                </p>
                <ul className="space-y-1">
                  <li>
                    • Contractual necessity (to provide the Platform and services you request)
                  </li>
                  <li>
                    • Legitimate interests (to improve our services, prevent fraud, ensure security)
                  </li>
                  <li>• Consent (for marketing communications, optional features)</li>
                  <li>• Legal obligations (to comply with applicable laws)</li>
                </ul>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Data Protection Officer:</strong>
                </p>
                <p>For GDPR-related inquiries, contact us at legal@promptmanage.com.</p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Right to Lodge a Complaint:</strong>
                </p>
                <p>
                  You have the right to lodge a complaint with your local supervisory authority if
                  you believe we have violated your privacy rights.
                </p>
              </div>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">
              12. CCPA Compliance (California Residents)
            </h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                If you are a California resident, the California Consumer Privacy Act (CCPA)
                provides you with additional rights:
              </p>

              <div>
                <p className="mb-2">
                  <strong>Right to Know:</strong>
                </p>
                <p>
                  Request disclosure of the categories and specific pieces of personal information
                  we have collected about you.
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Right to Delete:</strong>
                </p>
                <p>Request deletion of your personal information, subject to certain exceptions.</p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Right to Opt-Out:</strong>
                </p>
                <p>
                  We do not sell your personal information. If our practices change, we will update
                  this policy and provide you with an opt-out mechanism.
                </p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Non-Discrimination:</strong>
                </p>
                <p>We will not discriminate against you for exercising your CCPA rights.</p>
              </div>

              <p className="mt-4">
                To exercise your rights, contact us at legal@promptmanage.com. We may need to verify
                your identity before processing your request.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">13. Do Not Track</h2>
            <p className="text-gray-900 dark:text-gray-100">
              Some browsers have a &quot;Do Not Track&quot; feature that lets you tell websites that
              you do not want your online activities tracked. We do not currently respond to Do Not
              Track signals.
            </p>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">14. Changes to This Privacy Policy</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our
                practices, technology, legal requirements, or other factors. We will notify you of
                any material changes by:
              </p>
              <ul className="space-y-1">
                <li>• Posting the updated Privacy Policy on this page</li>
                <li>• Updating the &quot;Last Updated&quot; date at the top of this policy</li>
                <li>• Sending you an email notification (for significant changes)</li>
                <li>• Displaying a prominent notice on the Platform</li>
              </ul>
              <p className="mt-4">
                Your continued use of the Platform after we post changes constitutes your acceptance
                of the updated Privacy Policy. We encourage you to review this Privacy Policy
                periodically.
              </p>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">15. Related Pages</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/terms" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Terms of Service</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Terms governing your use of Prompt Manage
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
              <Link href="/legal-center/data-erasure" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Data Erasure Policy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  How to request deletion of your account and data
                </p>
              </Link>
              <Link href="/legal-center/subprocessors" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Subprocessors</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Third-party service providers we work with
                </p>
              </Link>
              <Link href="/accessibility" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Accessibility</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our commitment to WCAG 2.1 compliance
                </p>
              </Link>
            </div>
          </section>

          <section className="border-t pt-12">
            <h2 className="mb-4 text-2xl font-semibold">16. Contact Us</h2>
            <div>
              <p className="mb-4 text-gray-900 dark:text-gray-100">
                If you have any questions, concerns, or requests regarding this Privacy Policy or
                our privacy practices, please contact us:
              </p>
              <div>
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Prompt Manage LLC</p>
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                  125 Stoughton Street, Unit 2
                </p>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Boston, MA 02125</p>
                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Privacy Questions:</p>
                <a
                  href="mailto:legal@promptmanage.com"
                  className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
                >
                  legal@promptmanage.com
                </a>
              </div>
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
