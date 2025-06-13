import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-700 dark:text-gray-200 text-base">
        <b>Effective Date:</b> {new Date().getFullYear()}<br/>
        <b>Jurisdiction:</b> Boston, MA (Suffolk County)
      </p>
      <p className="text-gray-700 dark:text-gray-200 text-base">
        These Terms of Service ("Terms") constitute a legally binding agreement between you ("User") and Prompt Manage ("Company", "we", "us", or "our"). By accessing or using our website and services, you agree to be bound by these Terms. If you do not agree, do not use our services.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Services</h2>
      <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
        <li>You must be at least 18 years old to use our services.</li>
        <li>You agree to use our services only for lawful purposes and in accordance with these Terms.</li>
        <li>We reserve the right to suspend or terminate your access at our sole discretion.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Intellectual Property</h2>
      <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
        <li>All content, trademarks, and intellectual property on this site are owned by Prompt Manage or its licensors.</li>
        <li>You may not copy, modify, distribute, or create derivative works without our express written consent.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Disclaimers</h2>
      <p className="text-gray-700 dark:text-gray-200">Our services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. We do not guarantee the accuracy, completeness, or reliability of any content or data.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Limitation of Liability</h2>
      <p className="text-gray-700 dark:text-gray-200">To the fullest extent permitted by law, Prompt Manage and its affiliates, officers, employees, and agents shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">5. Indemnification</h2>
      <p className="text-gray-700 dark:text-gray-200">You agree to indemnify, defend, and hold harmless Prompt Manage and its affiliates from any claims, damages, liabilities, and expenses arising from your use of the services or violation of these Terms.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">6. Governing Law & Jurisdiction</h2>
      <p className="text-gray-700 dark:text-gray-200">These Terms are governed by the laws of the Commonwealth of Massachusetts, United States. Any disputes shall be resolved exclusively in the state or federal courts located in Suffolk County, Boston, MA.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to Terms</h2>
      <p className="text-gray-700 dark:text-gray-200">We reserve the right to update these Terms at any time. Continued use of our services constitutes acceptance of the revised Terms.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact</h2>
      <p className="text-gray-700 dark:text-gray-200">For legal inquiries, contact us at <a href="mailto:legal@promptmanage.com" className="underline">legal@promptmanage.com</a>.</p>
    </div>
  );
} 