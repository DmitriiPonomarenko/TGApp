import * as React from 'react'
import * as Label from '@radix-ui/react-label'
import { cn } from '@/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const inputId = id ?? React.useId()
    return (
      <div className="grid w-full gap-1.5">
        {label && (
          <Label.Root
            htmlFor={inputId}
            className="text-sm font-medium text-tg-text"
          >
            {label}
          </Label.Root>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'flex h-12 w-full rounded-xl border border-tg-bg-secondary bg-tg-bg-secondary px-4 text-base text-tg-text placeholder:text-tg-hint focus:border-tg-button focus:outline-none focus:ring-2 focus:ring-tg-button/20 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
