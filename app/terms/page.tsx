import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Prompt Manage',
  description: 'Terms of Service for Prompt Manage, LLC, a company based in Boston, MA. Users must be 18 or older. Fraudulent, illegal activity, or spamming will result in a ban.'
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Terms of Service for Prompt Manage, LLC</h1>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          <strong>Last Updated: June 24, 2025</strong>
        </p>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Welcome to Prompt Manage, LLC, a company registered in Boston, Massachusetts, USA (&quot;Prompt Manage&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Prompt Manage website, applications, and services (collectively, the &quot;Platform&quot;).
          </p>
          
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree with any part of these Terms, you may not access or use the Platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            By creating an account, accessing, or using the Prompt Manage Platform, you represent and warrant that you have read, understood, and agree to be bound by these Terms, as well as any future modifications. These Terms constitute a legally binding agreement between you and Prompt Manage.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">2. Eligibility and User Accounts</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            <strong>Age Restriction:</strong> You must be at least eighteen (18) years old to register for an account and use the Prompt Manage Platform. By using the Platform, you represent and warrant that you are 18 years of age or older.
          </p>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            <strong>Account Information:</strong> When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Platform.
          </p>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            <strong>Account Security:</strong> You are responsible for safeguarding the password that you use to access the Platform and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">3. Acceptable Use and Prohibited Conduct</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            You agree to use the Prompt Manage Platform only for lawful purposes and in accordance with these Terms. You are prohibited from engaging in any of the following activities:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
            <li><strong>Fraudulent or Illegal Activity:</strong> Any activity that is fraudulent, illegal, or promotes illegal activities.</li>
            <li><strong>Spamming:</strong> Sending unsolicited or unauthorized advertisements, promotional materials, &quot;junk mail,&quot; &quot;spam,&quot; &quot;chain letters,&quot; &quot;pyramid schemes,&quot; or any other form of solicitation.</li>
            <li><strong>Harmful Conduct:</strong> Engaging in any activity that is harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another&apos;s privacy, hateful, or racially, ethnically, or otherwise objectionable.</li>
            <li><strong>Intellectual Property Infringement:</strong> Uploading, posting, or transmitting any content that infringes upon the intellectual property rights of others.</li>
            <li><strong>Malicious Software:</strong> Introducing any viruses, Trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful.</li>
            <li><strong>System Interference:</strong> Attempting to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Platform, the server on which the Platform is stored, or any server, computer, or database connected to the Platform.</li>
            <li><strong>Scraping/Data Mining:</strong> Using any robot, spider, or other automatic device, process, or means to access the Platform for any purpose, including monitoring or copying any of the material on the Platform.</li>
            <li><strong>Misrepresentation:</strong> Impersonating or attempting to impersonate Prompt Manage, a Prompt Manage employee, another user, or any other person or entity.</li>
          </ul>

          {/* AI Processing and Account Types Section */}
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">AI Processing and Account Types</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Prompt Manage uses OpenAI&apos;s services to process user-submitted content (&quot;Input&quot;). If you use a <strong>free account</strong>, you agree that some Input may be designated for sharing with OpenAI and used to improve OpenAI&apos;s models and services. OpenAI will act as an <strong>independent data controller</strong> for such Designated Content.
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
            <li>Confidential or proprietary data,</li>
            <li>Protected Health Information (HIPAA),</li>
            <li>Personal data of children under 13,</li>
            <li>Any content you do not have the legal right to submit.</li>
          </ul>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            If you upgrade to a <strong>paid account</strong>, your Input will not be shared with OpenAI for model training or improvement purposes. Enhanced data privacy and confidentiality protections apply to paid accounts.
          </p>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Prompt Manage is intended for users aged <strong>18 and older</strong> only.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">4. Content on the Platform</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            <strong>User-Generated Content:</strong> You retain all rights in, and are solely responsible for, the Prompts and other content you create, submit, post, display, or otherwise make available on the Platform (&quot;User Content&quot;). By making User Content available on or through the Platform, you grant to Prompt Manage a worldwide, non-exclusive, royalty-free, transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the User Content in connection with the Platform and Prompt Manage&apos;s (and its successors&apos; and affiliates&apos;) business, including without limitation for promoting and redistributing part or all of the Platform (and derivative works thereof) in any media formats and through any media channels.
          </p>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            <strong>Our Content:</strong> All other content available on the Platform, including text, graphics, images, software, trademarks, service marks, and logos, is owned by or licensed to Prompt Manage and is protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, distribute, or create derivative works from our content without our express written permission.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">5. Termination</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms or if we, in our sole discretion, deem your activity harmful to the Platform or its users. Upon termination, your right to use the Platform will immediately cease. If you wish to terminate your account, you may simply discontinue using the Platform or contact support.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">6. Disclaimer of Warranties</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            The Platform is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. Prompt Manage makes no representations or warranties of any kind, express or implied, as to the operation of the Platform or the information, content, materials, or products included on the Platform. You expressly agree that your use of the Platform is at your sole risk.
          </p>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            To the full extent permissible by applicable law, Prompt Manage disclaims all warranties, express or implied, including, but not limited to, implied warranties of merchantability and fitness for a particular purpose. Prompt Manage does not warrant that the Platform, its servers, or e-mail sent from Prompt Manage are free of viruses or other harmful components.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">7. Limitation of Liability</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            In no event shall Prompt Manage, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Platform; (ii) any conduct or content of any third party on the Platform; (iii) any content obtained from the Platform; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">8. Indemnification</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            You agree to defend, indemnify, and hold harmless Prompt Manage, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating to your violation of these Terms or your use of the Platform, including, but not limited to, your User Content, any use of the Platform&apos;s content, services, and products other than as expressly authorized in these Terms, or your use of any information obtained from the Platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">9. Privacy Policy</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Your use of Prompt Manage is also subject to our Privacy Policy, which describes how we collect, use, and disclose your personal information. Please review our Privacy Policy carefully.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">10. Links to Other Websites</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Our Platform may contain links to third-party websites or services that are not owned or controlled by Prompt Manage. Prompt Manage has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that Prompt Manage shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods, or services available on or through any such websites or services. We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">11. Governing Law and Jurisdiction</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            These Terms shall be governed and construed in accordance with the laws of the Commonwealth of Massachusetts, United States, without regard to its conflict of law provisions. You agree to submit to the personal and exclusive jurisdiction of the state and federal courts located in Boston, Massachusetts, for the resolution of any disputes arising out of or relating to these Terms or the Platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">12. Changes to These Terms</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Platform after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">13. Severability</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">14. Entire Agreement</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            These Terms and our Privacy Policy constitute the entire agreement between you and Prompt Manage regarding our Platform, and supersede and replace any prior agreements, oral or otherwise, regarding the Platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">15. Contact Us</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            If you have any questions about these Terms, please contact us:
          </p>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            By email: <a href="mailto:support@promptmanage.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@promptmanage.com</a>
          </p>
          <hr className="my-8" />
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Related Policies</h3>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li><a href="/privacy" className="text-blue-600 dark:text-blue-400 underline">Privacy Policy</a></li>
              <li><a href="/dmca" className="text-blue-600 dark:text-blue-400 underline">DMCA Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 