'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'terracotta-subtle';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    fullWidth = false, 
    disabled, 
    children, 
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-brand active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none';

    const sizeClasses = {
      sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-4 py-2.5 h-10 gap-2',
      lg: 'text-base px-6 py-3.5 h-12 gap-2.5 font-semibold',
    }[size];

    const variantClasses = {
      primary: 'bg-uttara-terracotta text-uttara-ivory hover:bg-uttara-terracotta-dark shadow-subtle hover:shadow-card',
      secondary: 'bg-uttara-ochre text-uttara-charcoal hover:bg-uttara-ochre-dark hover:text-white',
      outline: 'border border-uttara-cream-border text-uttara-charcoal bg-transparent hover:bg-uttara-cream',
      ghost: 'text-uttara-charcoal hover:bg-uttara-cream hover:text-uttara-terracotta',
      'terracotta-subtle': 'bg-uttara-terracotta-faint text-uttara-terracotta hover:bg-uttara-terracotta hover:text-white border border-uttara-terracotta/20',
    }[variant];

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
