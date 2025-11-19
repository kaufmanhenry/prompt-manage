import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Accessibility — Prompt Manage',
  description:
    'Our commitment to making Prompt Manage accessible to all users. WCAG 2.1 compliance and accessibility features.',
  keywords: [
    'accessibility',
    'ADA',
    'WCAG',
    'screen reader',
    'keyboard navigation',
    'inclusive design',
  ],
  openGraph: {
    title: 'Accessibility — Prompt Manage',
    description: 'Our commitment to accessible, inclusive design.',
    type: 'website',
  },
}

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">Accessibility</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Our commitment to making Prompt Manage accessible to all users.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-16">
          {/* Commitment */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Our Commitment</h2>
            <p className="text-gray-900 dark:text-gray-100">
              Prompt Manage is committed to ensuring digital accessibility for people with
              disabilities. We continually improve the user experience for everyone and apply
              relevant accessibility standards to ensure our platform is usable by all.
            </p>
          </section>

          {/* Standards */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Accessibility Standards</h2>
            <div className="space-y-4 text-gray-900 dark:text-gray-100">
              <p>
                We strive to conform to Level AA of the Web Content Accessibility Guidelines (WCAG)
                2.1. These guidelines explain how to make web content more accessible for people
                with disabilities.
              </p>
              <p>
                Conforming to these guidelines helps us ensure the platform is accessible to people
                who:
              </p>
              <ul className="space-y-1">
                <li>• Use screen readers</li>
                <li>• Navigate by keyboard only</li>
                <li>• Have low vision or color blindness</li>
                <li>• Have cognitive or learning disabilities</li>
                <li>• Are deaf or hard of hearing</li>
              </ul>
            </div>
          </section>

          {/* Features */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Accessibility Features</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-base font-medium">Semantic HTML</h3>
                <p className="text-gray-900 dark:text-gray-100">
                  Proper HTML structure with headings, landmarks, and ARIA labels for screen reader
                  compatibility.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Keyboard Navigation</h3>
                <p className="text-gray-900 dark:text-gray-100">
                  Full keyboard navigation support with visible focus indicators and logical tab
                  order.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Color Contrast</h3>
                <p className="text-gray-900 dark:text-gray-100">
                  High contrast color ratios exceeding WCAG AA standards (minimum 4.5:1 for normal
                  text, 3:1 for large text).
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Responsive Design</h3>
                <p className="text-gray-900 dark:text-gray-100">
                  Fully responsive layout that works across devices and supports text resizing up to
                  200%.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Alternative Text</h3>
                <p className="text-gray-900 dark:text-gray-100">
                  Descriptive alt text for all images and icons.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-medium">Clear Language</h3>
                <p className="text-gray-900 dark:text-gray-100">
                  Plain language and clear instructions throughout the platform.
                </p>
              </div>
            </div>
          </section>

          {/* Ongoing Efforts */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Ongoing Efforts</h2>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              We regularly review and test our platform for accessibility:
            </p>
            <ul className="space-y-1 text-gray-900 dark:text-gray-100">
              <li>• Automated accessibility testing integrated into our development workflow</li>
              <li>• Manual testing with screen readers and keyboard-only navigation</li>
              <li>• Regular audits by accessibility specialists</li>
              <li>• User feedback and testing with people with disabilities</li>
              <li>
                • Continuous education for our development team on accessibility best practices
              </li>
            </ul>
          </section>

          {/* Known Issues */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Known Issues</h2>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              While we strive for full accessibility, we are aware of the following issues we are
              actively working to resolve:
            </p>
            <ul className="space-y-1 text-gray-900 dark:text-gray-100">
              <li>• Some complex interactive components may require additional ARIA labels</li>
              <li>• Third-party integrations may not fully meet WCAG 2.1 AA standards</li>
            </ul>
          </section>

          {/* Feedback */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Feedback</h2>
            <p className="mb-4 text-gray-900 dark:text-gray-100">
              We welcome feedback on the accessibility of Prompt Manage. If you encounter any
              accessibility barriers, please contact us:
            </p>
            <div>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                Accessibility Concerns
              </p>
              <a
                href="mailto:accessibility@promptmanage.com"
                className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                accessibility@promptmanage.com
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              We aim to respond to accessibility feedback within 3 business days.
            </p>
          </section>

          {/* Third-Party Content */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Third-Party Content</h2>
            <p className="text-gray-900 dark:text-gray-100">
              Some content on our platform is provided by third parties. While we strive to ensure
              all content meets accessibility standards, we cannot guarantee the accessibility of
              third-party content.
            </p>
          </section>

          {/* Related Pages */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Related Pages</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/support" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Support Center</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Help articles and contact information
                </p>
              </Link>
              <Link href="/privacy" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Privacy Policy</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  How we protect your personal information
                </p>
              </Link>
              <Link href="/security" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Security Overview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Platform security and infrastructure
                </p>
              </Link>
              <Link href="/terms" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Terms of Service</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Platform usage terms and conditions
                </p>
              </Link>
              <Link href="/legal-center" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">Legal Trust Center</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All legal documentation and compliance
                </p>
              </Link>
              <Link href="/about" className="group">
                <h3 className="mb-1 font-medium group-hover:underline">About Us</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Our mission and values</p>
              </Link>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t pt-16">
            <h2 className="mb-6 text-2xl font-semibold">Contact</h2>
            <div>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">General Support</p>
              <a
                href="mailto:support@promptmanage.com"
                className="text-base underline hover:text-gray-600 dark:hover:text-gray-300"
              >
                support@promptmanage.com
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
