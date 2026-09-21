import React from 'react';

export interface PriceDisplayProps {
  amount: number;
  originalAmount?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  originalAmount,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-semibold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl md:text-3xl font-bold',
  }[size];

  return (
    <div className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`${sizeClasses} text-uttara-charcoal tracking-tight`}>
        ₹{amount.toFixed(0)}
      </span>
      {originalAmount && originalAmount > amount && (
        <span className="text-xs md:text-sm text-uttara-charcoal-muted line-through">
          ₹{originalAmount.toFixed(0)}
        </span>
      )}
    </div>
  );
};
