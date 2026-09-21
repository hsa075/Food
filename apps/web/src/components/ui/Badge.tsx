import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'terracotta' | 'ochre' | 'green' | 'charcoal' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'terracotta',
  size = 'md',
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold tracking-wider uppercase',
    md: 'text-xs px-2.5 py-1 font-medium',
  }[size];

  const variantClasses = {
    terracotta: 'bg-uttara-terracotta-faint text-uttara-terracotta border border-uttara-terracotta/20',
    ochre: 'bg-uttara-ochre-faint text-uttara-ochre-dark border border-uttara-ochre/20',
    green: 'bg-uttara-green-faint text-uttara-green border border-uttara-green/20',
    charcoal: 'bg-uttara-charcoal text-uttara-ivory',
    outline: 'border border-uttara-cream-border text-uttara-charcoal bg-transparent',
    subtle: 'bg-uttara-cream text-uttara-charcoal-muted',
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
