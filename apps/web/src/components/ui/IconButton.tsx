'use client';

import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline' | 'ghost';
  ariaLabel: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className = '', size = 'md', variant = 'ghost', ariaLabel, children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-8 p-1.5',
      md: 'w-10 h-10 p-2',
      lg: 'w-12 h-12 p-2.5',
    }[size];

    const variantClasses = {
      primary: 'bg-uttara-terracotta text-white hover:bg-uttara-terracotta-dark',
      outline: 'border border-uttara-cream-border text-uttara-charcoal bg-uttara-ivory hover:bg-uttara-cream',
      ghost: 'text-uttara-charcoal hover:bg-uttara-cream',
    }[variant];

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        className={`inline-flex items-center justify-center rounded-brand transition-all duration-150 active:scale-95 disabled:opacity-50 ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
