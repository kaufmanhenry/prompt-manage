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
      <span className={`flex h-6 w-10 items-center rounded-full p-1 transition-[background-color] duration-normal ease-standard ${checked ? 'bg-primary' : 'bg-input'}`}>
        <span className={`h-4 w-4 transform rounded-full bg-background shadow-sm transition-transform duration-normal ease-standard ${checked ? 'translate-x-4' : ''}`}></span>
      </span>
    </label>
  )
}
