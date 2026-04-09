import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ado-accent focus:ring-offset-2 focus:ring-offset-ado-bg disabled:opacity-50 disabled:cursor-not-allowed',
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-4 py-2 text-sm',
          variant === 'primary' &&
            'bg-ado-accent text-white hover:bg-ado-accentHover',
          variant === 'ghost' &&
            'text-ado-muted hover:text-ado-text hover:bg-ado-surface2',
          variant === 'danger' &&
            'bg-ado-bug text-white hover:opacity-90',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
