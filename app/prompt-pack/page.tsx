'use client';
import { CheckCircle, Download, FileText, MessageSquare, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export default function PromptPackPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'prompt-pack' }),
      });
      if (!res.ok) throw new Error('Failed to send');
      setIsSubmitted(true);
    } catch (err) {
      console.error('Lead submit error:', err);
      alert(
        'There was an error. Please email support@promptmanage.com and we will send the pack manually.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const promptPreviews = [
    {
      title: 'Social Media Post Generator',
      description: 'Create engaging social media posts that drive engagement and clicks',
      category: 'Marketing',
      icon: TrendingUp,
      preview:
        'Create a compelling social media post for [platform] about [topic] that will engage our audience of [target audience]. The post should be [tone] and include a clear call-to-action.',
    },
    {
      title: 'Customer Support Response',
      description: 'Generate professional, empathetic responses to customer inquiries',
      category: 'Support',
      icon: MessageSquare,
      preview:
        'Write a professional and empathetic response to a customer who is [emotion] about [issue]. The response should acknowledge their concern, provide a clear solution, and maintain our brand voice.',
    },
    {
      title: 'Product Description Writer',
      description: 'Create compelling product descriptions that convert browsers to buyers',
      category: 'Sales',
      icon: FileText,
      preview:
        'Write a compelling product description for [product name] that highlights its key features: [features]. Target audience is [audience]. Focus on benefits and include persuasive language.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              <Download className="w-4 h-4 mr-2" />
              Free Download
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Get 20 Ready-to-Use
            <br />
            <span className="text-green-600 dark:text-green-400">AI Prompts</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Download our curated collection of proven prompts for marketing, support, and product
            teams. Start using AI more effectively today.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Lead Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            {!isSubmitted ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Download Your Free Prompt Pack
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Get instant access to 20 proven prompts that teams are using to scale their AI
                  operations.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-lg py-3 bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      'Downloading...'
                    ) : (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        Download Free Prompt Pack
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  <p>✓ No credit card required</p>
                  <p>✓ Instant download</p>
                  <p>✓ Unsubscribe anytime</p>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Download Complete!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Check your email for the download link. You&rsquo;ll also receive tips on how to
                  use these prompts effectively.
                </p>
                <Link href="/auth/signup">
                  <Button className="text-lg py-3">Start Free Trial</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Prompt Previews */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              What&rsquo;s Inside the Pack
            </h2>

            {promptPreviews.map((prompt, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 flex-shrink-0">
                    <prompt.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {prompt.title}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        {prompt.category}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{prompt.description}</p>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                        {prompt.preview}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 bg-white dark:bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Why Teams Love These Prompts
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Proven Results
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                These prompts have been tested and refined by hundreds of teams across different
                industries.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Save Time
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stop starting from scratch. Use these templates and customize them for your specific
                needs.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Better Outputs
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get higher quality AI responses with prompts that are optimized for specific use
                cases.
              </p>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            What&rsquo;s Included in Your Free Pack
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Marketing (5 prompts)
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Social media posts</li>
                <li>• Email subject lines</li>
                <li>• Ad copy</li>
                <li>• Blog outlines</li>
                <li>• Product descriptions</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Support (5 prompts)
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Customer responses</li>
                <li>• FAQ generation</li>
                <li>• Troubleshooting guides</li>
                <li>• Apology templates</li>
                <li>• Escalation scripts</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Product (5 prompts)
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• User stories</li>
                <li>• Feature descriptions</li>
                <li>• Release notes</li>
                <li>• Bug reports</li>
                <li>• Documentation</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                General (5 prompts)
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Meeting agendas</li>
                <li>• Project plans</li>
                <li>• Code comments</li>
                <li>• Data analysis</li>
                <li>• Research summaries</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to scale your AI operations?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Join thousands of teams using Prompt Manage to organize, test, and optimize their AI
            prompts
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-4">
                Get Started Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                See Pricing
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
