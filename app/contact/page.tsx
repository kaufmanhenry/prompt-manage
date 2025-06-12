export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="mb-4">
        Have questions, feedback, or need support? Reach out to us!
      </p>
      <ul className="mb-4">
        <li>Email: <a href="mailto:support@promptmanage.com" className="text-primary underline">support@promptmanage.com</a></li>
        <li>Twitter/X: <a href="https://x.com/promptmanage" target="_blank" rel="noopener noreferrer" className="text-primary underline">@promptmanage</a></li>
      </ul>
      <p>
        We usually respond within 1-2 business days.
      </p>
    </div>
  )
} 