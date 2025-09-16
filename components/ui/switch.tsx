import * as React from 'react'

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Switch({ checked, onCheckedChange, ...props }: SwitchProps) {
  return (
    <label className="inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        {...props}
      />
      <span
        className={`flex h-6 w-10 items-center rounded-full bg-gray-300 p-1 duration-300 ease-in-out ${checked ? 'bg-primary' : ''}`}
      >
        <span
          className={`h-4 w-4 transform rounded-full bg-white shadow-md duration-300 ease-in-out ${checked ? 'translate-x-4' : ''}`}
        ></span>
      </span>
    </label>
  )
}
