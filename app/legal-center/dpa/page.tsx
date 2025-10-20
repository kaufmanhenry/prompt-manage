'use client'

import { ArrowLeft, FileText } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function DPAPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <section className="border-b bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <Link href="/legal-center">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Legal Trust Center
              </Button>
            </Link>
            <div>
              <div className="mb-2 flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <Badge>Legal Document</Badge>
              </div>
              <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                Data Protection Addendum (DPA)
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Effective Date: January 1, 2025 | Last Updated: October 16, 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Document Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div id="dpa-content" className="prose prose-lg dark:prose-invert mx-auto max-w-4xl">
            {/* Preamble */}
            <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                Document Purpose
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                This Data Protection Addendum (&quot;DPA&quot;) supplements the Prompt Manage Terms
                of Service and provides formal commitments regarding data processing in compliance
                with GDPR, CCPA, and other applicable data protection laws. This DPA applies to
                customers who process personal data through Prompt Manage services.
              </p>
            </div>

            {/* Section 1: Definitions */}
            <h2 id="definitions">1. Definitions</h2>
            <p>
              For the purposes of this Data Protection Addendum, the following terms shall have the
              meanings set forth below:
            </p>
            <ul>
              <li>
                <strong>&quot;Controller&quot;</strong> means the natural or legal person, public
                authority, agency, or other body which, alone or jointly with others, determines the
                purposes and means of the processing of Personal Data. In the context of this DPA,
                the Customer is the Controller.
              </li>
              <li>
                <strong>&quot;Processor&quot;</strong> means a natural or legal person, public
                authority, agency, or other body which processes Personal Data on behalf of the
                Controller. In the context of this DPA, Prompt Manage LLC is the Processor.
              </li>
              <li>
                <strong>&quot;Personal Data&quot;</strong> means any information relating to an
                identified or identifiable natural person as defined in the GDPR (EU Regulation
                2016/679) and other applicable data protection laws.
              </li>
              <li>
                <strong>&quot;Processing&quot;</strong> means any operation or set of operations
                performed on Personal Data or on sets of Personal Data, whether or not by automated
                means, such as collection, recording, organization, structuring, storage, adaptation
                or alteration, retrieval, consultation, use, disclosure by transmission,
                dissemination or otherwise making available, alignment or combination, restriction,
                erasure, or destruction.
              </li>
              <li>
                <strong>&quot;Sub-processor&quot;</strong> means any third-party service provider
                engaged by Prompt Manage to process Personal Data on behalf of the Customer.
              </li>
              <li>
                <strong>&quot;Data Subject&quot;</strong> means an identified or identifiable
                natural person whose Personal Data is processed under this DPA.
              </li>
              <li>
                <strong>&quot;Services&quot;</strong> means the Prompt Manage platform and
                associated services as described in the Terms of Service.
              </li>
            </ul>

            {/* Section 2: Scope and Applicability */}
            <h2 id="scope">2. Scope and Applicability</h2>

            <h3>2.1 Application of this DPA</h3>
            <p>
              This DPA applies to all Processing of Personal Data by Prompt Manage on behalf of the
              Customer in the course of providing the Services. This includes:
            </p>
            <ul>
              <li>User account information (names, email addresses, authentication data)</li>
              <li>Prompt content and metadata that may contain Personal Data</li>
              <li>Usage analytics and activity logs</li>
              <li>Team member information and collaboration data</li>
            </ul>

            <h3>2.2 Roles and Responsibilities</h3>
            <p>
              The parties acknowledge and agree that with respect to the Processing of Personal
              Data:
            </p>
            <ul>
              <li>
                The Customer is the Controller and determines the purposes and means of Processing
                Personal Data.
              </li>
              <li>
                Prompt Manage is the Processor and processes Personal Data only on behalf of and in
                accordance with the Customer&apos;s documented instructions.
              </li>
              <li>
                Each party shall comply with its respective obligations under applicable data
                protection laws, including GDPR, CCPA, and other relevant legislation.
              </li>
            </ul>

            {/* Section 3: Data Processing and Sub-processing */}
            <h2 id="processing">3. Data Processing and Sub-processing</h2>

            <h3>3.1 Processing Instructions</h3>
            <p>
              Prompt Manage shall process Personal Data only on documented instructions from the
              Customer, except where required to do so by applicable law. The Customer&apos;s
              instructions are initially set out in this DPA and the Terms of Service, and may be
              amended, amplified, or replaced by the Customer from time to time through written
              notice.
            </p>

            <h3>3.2 Lawful Basis for Processing</h3>
            <p>
              The Customer warrants that it has established a lawful basis for Processing Personal
              Data under applicable data protection laws, and that its instructions to Prompt Manage
              comply with all applicable laws.
            </p>

            <h3>3.3 Sub-processors</h3>
            <p>
              The Customer grants Prompt Manage general authorization to engage Sub-processors to
              process Personal Data, subject to the following conditions:
            </p>
            <ul>
              <li>
                Prompt Manage shall maintain a current list of all Sub-processors at{' '}
                <Link href="/legal-center/subprocessors" className="text-blue-600 hover:underline">
                  promptmanage.com/legal-center/subprocessors
                </Link>
                .
              </li>
              <li>
                Prompt Manage shall notify the Customer at least 30 days in advance of any intended
                changes concerning the addition or replacement of Sub-processors.
              </li>
              <li>
                The Customer may object to the engagement of a new Sub-processor on reasonable
                grounds relating to data protection by notifying Prompt Manage within 30 days of
                receiving notice.
              </li>
              <li>
                Prompt Manage shall ensure that each Sub-processor is bound by data protection
                obligations no less protective than those set forth in this DPA.
              </li>
            </ul>

            <h3>3.4 Current Sub-processors</h3>
            <p>As of the Effective Date, Prompt Manage engages the following Sub-processors:</p>
            <ul>
              <li>
                <strong>Supabase Inc.</strong> (United States) — Database hosting and authentication
                services
              </li>
              <li>
                <strong>Vercel Inc.</strong> (United States) — Application hosting and content
                delivery
              </li>
              <li>
                <strong>OpenAI LLC</strong> (United States) — AI model API services (when Customer
                elects to use AI features)
              </li>
            </ul>

            {/* Section 4: Security Measures */}
            <h2 id="security">4. Security Measures</h2>

            <h3>4.1 Technical and Organizational Measures</h3>
            <p>
              Prompt Manage shall implement and maintain appropriate technical and organizational
              measures to ensure a level of security appropriate to the risk, including but not
              limited to:
            </p>

            <h4>Technical Measures:</h4>
            <ul>
              <li>
                <strong>Encryption:</strong> AES-256 encryption for data at rest; TLS 1.3 for data
                in transit
              </li>
              <li>
                <strong>Access Controls:</strong> Role-based access control (RBAC) and
                authentication via OAuth 2.0
              </li>
              <li>
                <strong>Network Security:</strong> Firewall protection, DDoS mitigation, and
                intrusion detection systems
              </li>
              <li>
                <strong>Vulnerability Management:</strong> Regular security assessments, penetration
                testing, and patch management
              </li>
            </ul>

            <h4>Organizational Measures:</h4>
            <ul>
              <li>
                <strong>Personnel Security:</strong> Background checks and confidentiality
                agreements for employees with access to Personal Data
              </li>
              <li>
                <strong>Security Awareness Training:</strong> Regular training for staff on data
                protection and security best practices
              </li>
              <li>
                <strong>Incident Response:</strong> Documented procedures for identifying,
                responding to, and recovering from security incidents
              </li>
              <li>
                <strong>Data Minimization:</strong> Collection and retention of only the minimum
                Personal Data necessary to provide the Services
              </li>
            </ul>

            <h3>4.2 Data Breach Notification</h3>
            <p>In the event of a Personal Data breach, Prompt Manage shall:</p>
            <ul>
              <li>
                Notify the Customer without undue delay and, where feasible, within 72 hours of
                becoming aware of the breach
              </li>
              <li>
                Provide the Customer with sufficient information to allow the Customer to meet any
                obligations to report or inform Data Subjects of the breach under applicable data
                protection laws
              </li>
              <li>
                Take reasonable measures to remediate the breach and prevent future occurrences
              </li>
              <li>Cooperate with the Customer in investigating and mitigating the breach</li>
            </ul>

            {/* Section 5: Data Subject Rights */}
            <h2 id="rights">5. Data Subject Rights</h2>

            <h3>5.1 Assistance with Data Subject Requests</h3>
            <p>
              Prompt Manage shall, to the extent legally permitted and taking into account the
              nature of the Processing, assist the Customer in fulfilling its obligations to respond
              to requests from Data Subjects exercising their rights under applicable data
              protection laws, including:
            </p>
            <ul>
              <li>Right of access to Personal Data</li>
              <li>Right to rectification of inaccurate Personal Data</li>
              <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
              <li>Right to restriction of Processing</li>
              <li>Right to data portability</li>
              <li>Right to object to Processing</li>
              <li>Rights related to automated decision-making and profiling</li>
            </ul>

            <h3>5.2 Customer Responsibilities</h3>
            <p>
              The Customer is responsible for responding to Data Subject requests directly. Prompt
              Manage will provide reasonable assistance as requested by the Customer, and the
              Customer shall reimburse Prompt Manage for any costs arising from such assistance if
              it requires significant additional effort.
            </p>

            {/* Section 6: International Data Transfers */}
            <h2 id="transfers">6. International Data Transfers</h2>

            <h3>6.1 Data Processing Locations</h3>
            <p>
              Prompt Manage processes Personal Data primarily in data centers located in the United
              States. EU customers may request data processing within the European Economic Area
              (EEA) subject to availability and additional fees (Enterprise plan only).
            </p>

            <h3>6.2 Transfer Mechanisms</h3>
            <p>
              Where Personal Data is transferred from the EEA to countries that have not been deemed
              to provide an adequate level of protection by the European Commission, Prompt Manage
              relies on the following mechanisms:
            </p>
            <ul>
              <li>
                Standard Contractual Clauses (SCCs) approved by the European Commission (available
                upon request for Enterprise customers)
              </li>
              <li>
                Supplementary measures to ensure the security and confidentiality of transferred
                data, including encryption and access controls
              </li>
            </ul>

            <h3>6.3 Data Residency Options</h3>
            <p>
              Enterprise customers may elect to store their data exclusively within the EEA by
              contacting{' '}
              <a href="mailto:legal@promptmanage.com" className="text-blue-600 hover:underline">
                legal@promptmanage.com
              </a>
              . Additional fees may apply.
            </p>

            {/* Section 7: Deletion and Return of Data */}
            <h2 id="deletion">7. Deletion and Return of Data</h2>

            <h3>7.1 Data Deletion Upon Termination</h3>
            <p>
              Upon termination or expiration of the Customer&apos;s subscription to the Services,
              Prompt Manage shall:
            </p>
            <ul>
              <li>
                Provide the Customer with the option to export all Personal Data within 30 days of
                termination
              </li>
              <li>
                Delete or anonymize all Personal Data in Prompt Manage&apos;s possession or control
                within 90 days of termination, except as required by applicable law
              </li>
              <li>
                Certify in writing to the Customer that such deletion has been completed upon
                request
              </li>
            </ul>

            <h3>7.2 Customer-Initiated Deletion</h3>
            <p>
              Customers may request deletion of their account and all associated Personal Data at
              any time by following the process outlined in the{' '}
              <Link href="/legal-center/data-erasure" className="text-blue-600 hover:underline">
                Data Erasure Policy
              </Link>
              . Prompt Manage will complete such deletion within 30 days of receiving a valid
              request.
            </p>

            <h3>7.3 Retention for Legal Compliance</h3>
            <p>
              Notwithstanding the above, Prompt Manage may retain Personal Data to the extent
              required by applicable law, including for tax, accounting, fraud prevention, or legal
              compliance purposes. Any such retained data will continue to be protected in
              accordance with this DPA.
            </p>

            {/* Section 8: Contact for Compliance Requests */}
            <h2 id="contact">8. Contact for Compliance Requests</h2>

            <h3>8.1 Data Protection Officer Contact</h3>
            <p>
              For all compliance-related requests, including Data Processing Agreements, Standard
              Contractual Clauses, data subject access requests, breach notifications, or questions
              about this DPA, please contact:
            </p>

            <div className="my-6 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
              <p className="mb-2 font-semibold">Legal & Compliance Team</p>
              <p className="mb-1">
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@promptmanage.com" className="text-blue-600 hover:underline">
                  legal@promptmanage.com
                </a>
              </p>
              <p className="mb-1">
                <strong>Company:</strong> Prompt Manage LLC
              </p>
              <p>
                <strong>Address:</strong> Boston, Massachusetts, United States
              </p>
            </div>

            <h3>8.2 Response Times</h3>
            <p>Prompt Manage commits to the following response times for compliance requests:</p>
            <ul>
              <li>
                <strong>Data breach notifications:</strong> Within 72 hours of discovery
              </li>
              <li>
                <strong>Data subject access requests:</strong> Within 30 days of receipt
              </li>
              <li>
                <strong>DPA or SCC requests:</strong> Within 10 business days of receipt
              </li>
              <li>
                <strong>General compliance inquiries:</strong> Within 5 business days of receipt
              </li>
            </ul>

            {/* Section 9: Amendments and Updates */}
            <h2 id="amendments">9. Amendments and Updates</h2>
            <p>
              Prompt Manage reserves the right to update this DPA from time to time to reflect
              changes in legal requirements, industry standards, or our data processing practices.
              Material changes will be communicated to Customers at least 30 days in advance via
              email to the account owner. Continued use of the Services after the effective date of
              such changes constitutes acceptance of the updated DPA.
            </p>

            {/* Section 10: Governing Law */}
            <h2 id="governing-law">10. Governing Law</h2>
            <p>
              This DPA shall be governed by and construed in accordance with the laws of the
              Commonwealth of Massachusetts, United States, without regard to its conflict of law
              provisions. To the extent this DPA conflicts with the Terms of Service, this DPA shall
              prevail with respect to data protection matters.
            </p>

            {/* Signature Block */}
            <div className="my-12 border-t pt-8">
              <p className="mb-6 text-sm italic text-gray-600 dark:text-gray-400">
                By using the Prompt Manage Services, the Customer acknowledges that it has read,
                understood, and agrees to be bound by this Data Protection Addendum.
              </p>
              <p className="font-semibold">Prompt Manage LLC</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Boston, Massachusetts</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Document Version 1.0 | Effective January 1, 2025
              </p>
            </div>

            {/* Footer Navigation */}
            <div className="mt-12 flex flex-wrap gap-3 border-t pt-8">
              <Link href="/legal-center">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Legal Trust Center
                </Button>
              </Link>
              <Link href="/privacy">
                <Button variant="outline">Privacy Policy</Button>
              </Link>
              <Link href="/terms">
                <Button variant="outline">Terms of Service</Button>
              </Link>
              <Link href="/security">
                <Button variant="outline">Security Overview</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
