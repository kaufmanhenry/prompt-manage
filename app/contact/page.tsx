'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'contact' }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setIsSubmitted(true)
      setFormData({ name: '', email: '', company: '', message: '' })
    } catch (err) {
      console.error('Contact submit error:', err)
      alert('There was an error sending your message. Please email support@promptmanage.com directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Message sent
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We&rsquo;ll get back to you within 24 hours.
          </p>
          <Link href="/">
            <Button variant="outline">Back to home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-3">
            Contact us
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get in touch for enterprise inquiries, partnerships, or support.
          </p>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="border-gray-300 dark:border-gray-600"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company
              </label>
              <Input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="border-gray-300 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="border-gray-300 dark:border-gray-600"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send message'}
            </Button>
          </form>

          {/* Contact Info */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4" />
              <a 
                href="mailto:support@promptmanage.com" 
                className="hover:text-gray-900 dark:hover:text-white"
              >
                support@promptmanage.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 