'use client'

import { useState } from 'react'

interface PricingToggleProps {
  onToggle: (isAnnual: boolean) => void
}

export function PricingToggle({ onToggle }: PricingToggleProps) {
  const [isAnnual, setIsAnnual] = useState(false)

  const handleToggle = (value: boolean) => {
    setIsAnnual(value)
    onToggle(value)
  }

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <span className={`text-sm ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
        Monthly
      </span>
      <button
        onClick={() => handleToggle(!isAnnual)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isAnnual ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isAnnual ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
        Annual
      </span>
      {isAnnual && (
        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
          Save 17%
        </span>
      )}
    </div>
  )
} 