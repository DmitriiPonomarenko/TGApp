import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { useTelegram } from '@/hooks'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tg-button disabled:pointer-events-none disabled:opacity-50 min-h-[44px] min-w-[44px] active:opacity-90',
  {
    variants: {
      variant: {
        primary:
          'bg-tg-button text-tg-button-text hover:opacity-90',
        secondary:
          'bg-tg-bg-secondary text-tg-text border border-tg-hint/30',
        ghost: 'text-tg-text hover:bg-tg-bg-secondary',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-base',
        icon: 'p-2.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const { haptic } = useTelegram()
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      haptic.impact('light')
      onClick?.(e)
    }
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={asChild ? onClick : handleClick}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
