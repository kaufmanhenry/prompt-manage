import React from 'react';
import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Legal & Compliance</h1>
      <p className="text-gray-700 dark:text-gray-200 text-base mb-6">
        Prompt Manage is committed to transparency, security, and compliance. Below you will find links to our key legal and policy documents. For legal inquiries, contact <a href="mailto:legal@promptmanage.com" className="underline">legal@promptmanage.com</a>.
      </p>
      <ul className="list-disc ml-6 text-lg text-blue-700 dark:text-blue-300 space-y-2">
        <li><Link href="/about" className="underline">About</Link></li>
        <li><Link href="/terms" className="underline">Terms of Service</Link></li>
        <li><Link href="/privacy" className="underline">Privacy Policy</Link></li>
      </ul>
      <p className="text-gray-500 text-xs mt-8">Prompt Manage, Boston, MA (Suffolk County) &copy; {new Date().getFullYear()}</p>
    </div>
  );
} 