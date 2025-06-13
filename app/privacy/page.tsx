import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-700 dark:text-gray-200 text-base">
        <b>Effective Date:</b> {new Date().getFullYear()}<br/>
        <b>Jurisdiction:</b> Boston, MA (Suffolk County)
      </p>
      <p className="text-gray-700 dark:text-gray-200 text-base">
        This Privacy Policy describes how Prompt Manage ("Company", "we", "us", or "our") collects, uses, discloses, and protects your information when you use our website and services. By accessing or using our services, you agree to the terms of this Privacy Policy.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
        <li>Personal Information: Name, email address, and other identifiers you provide.</li>
        <li>Usage Data: Information about how you use our services, including IP address, device information, and browser type.</li>
        <li>Cookies & Tracking: We use cookies and similar technologies to track your activity and preferences.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Use of Information</h2>
      <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
        <li>To provide, maintain, and improve our services.</li>
        <li>To communicate with you about updates, security, and support.</li>
        <li>To comply with legal obligations and enforce our terms.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Disclosure of Information</h2>
      <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
        <li>We may share your information with service providers, legal authorities, or in connection with a business transfer.</li>
        <li>We do not sell your personal information to third parties.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
      <p className="text-gray-700 dark:text-gray-200">We implement robust technical and organizational measures to protect your data from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
      <ul className="list-disc ml-6 text-gray-700 dark:text-gray-200">
        <li>You have the right to access, correct, or delete your personal information.</li>
        <li>You may opt out of certain communications at any time.</li>
        <li>To exercise your rights, contact us at <a href="mailto:legal@promptmanage.com" className="underline">legal@promptmanage.com</a>.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes to This Policy</h2>
      <p className="text-gray-700 dark:text-gray-200">We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with an updated effective date.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact</h2>
      <p className="text-gray-700 dark:text-gray-200">For questions or concerns regarding this Privacy Policy, please contact us at <a href="mailto:legal@promptmanage.com" className="underline">legal@promptmanage.com</a>.<br/>This policy is governed by the laws of the Commonwealth of Massachusetts, United States, and any disputes shall be resolved in the courts of Suffolk County, Boston, MA.</p>
    </div>
  );
} 