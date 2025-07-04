import Link from 'next/link'
import { Metadata } from 'next'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Security & Privacy - Prompt Manage',
  description: 'Learn about Prompt Manage security standards, GDPR compliance, encryption, and privacy best practices. Your data is always protected.',
}

const securityFeatures = [
  {
    title: 'Experienced Security Team',
    description: 'Our team has over 20 years of combined experience in software, security, and cloud infrastructure. We proactively monitor, audit, and improve our systems.'
  },
  {
    title: 'Encrypted in Transit & at Rest',
    description: 'All data is encrypted using SSL/TLS in transit and AES-256 at rest. We utilize Cloudflare for additional security, DDoS protection, and secure edge delivery.'
  },
  {
    title: 'No Data Tracking',
    description: 'We do not track or profile users. No analytics, no ad tracking, and no third-party cookies. Your privacy is our default.'
  },
  {
    title: 'No Data Sharing (Paid/Enterprise)',
    description: 'No company, paid, or enterprise account data is ever shared with any third party, including OpenAI. Only free accounts may have limited data sharing for model improvement.'
  },
  {
    title: 'GDPR Compliant',
    description: 'Prompt Manage is fully GDPR compliant. We respect your privacy rights and provide tools for data access, export, and deletion.'
  },
  {
    title: 'Email & Account Security',
    description: 'All email communications are encrypted. We use passwordless magic links and OAuth for authentication. No passwords are stored.'
  },
  {
    title: 'Data Storage & Backups',
    description: 'Data is stored securely on Supabase and Vercel infrastructure, with automated encrypted backups and strict access controls.'
  },
  {
    title: 'Preventative Measures',
    description: 'We employ regular security reviews, penetration testing, vulnerability scanning, and 24/7 monitoring to prevent incidents before they occur.'
  },
  {
    title: 'Secure Vendors',
    description: 'We use trusted vendors: OpenAI (AI processing), Cloudflare (security), Vercel (hosting), Supabase (database), Stripe & PayPal (payments). All partners are vetted for security best practices.'
  },
  {
    title: 'SOC 2 (In Progress)',
    description: 'We are actively working toward SOC 2 Type II compliance. Our controls already meet or exceed industry standards.'
  },
]

const faqs = [
  {
    q: 'Who is behind Prompt Manage?',
    a: 'Prompt Manage is built by a team with over 20 years of combined experience in software engineering, security, and cloud infrastructure. Security and privacy are at the core of our company.'
  },
  {
    q: 'Is my data encrypted?',
    a: 'Yes. All data is encrypted in transit (SSL/TLS) and at rest (AES-256). We use Cloudflare for additional security.'
  },
  {
    q: 'Are you GDPR compliant?',
    a: 'Yes. Prompt Manage is fully GDPR compliant. You can request data access, export, or deletion at any time.'
  },
  {
    q: 'Do you track or profile users?',
    a: 'No. We do not track, profile, or sell user data. No analytics, no ad tracking, and no third-party cookies.'
  },
  {
    q: 'Do you share my data with third parties?',
    a: 'No company, paid, or enterprise account data is ever shared. Only free accounts may have limited data sharing with OpenAI for model improvement.'
  },
  {
    q: 'Is Prompt Manage SOC 2 compliant?',
    a: 'SOC 2 Type II is in progress. Our controls already meet or exceed industry standards.'
  },
  {
    q: 'Can I delete my data?',
    a: 'Yes. You can delete your prompts and account at any time. Contact support for full data deletion.'
  },
  {
    q: 'What vendors and partners do you use?',
    a: 'We use OpenAI (AI processing), Cloudflare (security), Vercel (hosting), Supabase (database), Stripe & PayPal (payments). All partners are vetted for security and compliance.'
  },
  {
    q: 'How do you handle security incidents?',
    a: 'We have a formal incident response plan. You will be notified promptly if your data is ever at risk.'
  },
  {
    q: 'How do you prevent security issues?',
    a: 'We conduct regular security reviews, penetration testing, vulnerability scanning, and 24/7 monitoring.'
  },
]

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your security & privacy are our top priorities
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Your data is fully encrypted, private by default, and never shared.
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
            Our team has over 20 years of combined experience in software, security, and cloud infrastructure. We employ top-of-the-line practices across email, data storage, security, safety, and preventative measures.
          </p>
          <Button asChild size="lg" className="mb-2">
            <a href="#faq">Learn more about our security</a>
          </Button>
        </div>

        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {securityFeatures.map((feature, i) => (
            <div
              key={feature.title}
              className={`rounded-lg border bg-white dark:bg-gray-800 p-6 shadow-sm flex flex-col justify-between ${feature.title.includes('SOC 2') ? 'border-yellow-400' : 'border-gray-200 dark:border-gray-700'}`}
            >
              <div>
                <h3 className={`font-semibold text-gray-900 dark:text-white mb-2 ${feature.title.includes('SOC 2') ? 'text-yellow-700 dark:text-yellow-300' : ''}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
              {feature.title.includes('SOC 2') && (
                <span className="mt-4 inline-block text-xs font-semibold text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded">In Progress</span>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={faq.q}>
                <AccordionTrigger className="text-left text-base font-medium text-gray-900 dark:text-white">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Call to Action */}
        <div className="rounded-lg bg-accent/40 dark:bg-accent/20 py-10 px-6 text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Launch with confidence</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">Prompt Manage is built for privacy, security, and compliance from day one.</p>
          <Button asChild size="lg">
            <Link href="/contact">Contact Security Team</Link>
          </Button>
        </div>

        {/* Related Policies */}
        <div className="mt-8 text-center">
          <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Related Policies & Resources</h4>
          <div className="flex flex-wrap justify-center gap-4 text-base">
            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition">Privacy Policy</Link>
            <span className="text-gray-400">|</span>
            <Link href="/terms" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition">Terms of Service</Link>
            <span className="text-gray-400">|</span>
            <Link href="/docs" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition">Documentation</Link>
          </div>
        </div>
      </div>
    </div>
  )
} 