import { useState } from 'react';

export default function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      onClick={handleCopy}
      className={`ml-2 text-muted-foreground hover:text-primary transition ${className}`}
      aria-label="Copy to clipboard"
      type="button"
    >
      <svg className="inline w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="9" y="9" width="13" height="13" rx="2" className="stroke-current" />
        <rect x="3" y="3" width="13" height="13" rx="2" className="stroke-current" />
      </svg>
      {copied && (
        <span className="ml-2 text-xs text-green-600">Copied!</span>
      )}
    </button>
  );
} 