'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 20,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8 px-2 text-xs gap-2',
    md: 'h-10 px-3 text-sm gap-3',
    lg: 'h-12 px-4 text-base gap-4',
  }[size];

  const btnSize = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-between bg-white border border-uttara-cream-border rounded-brand shadow-subtle ${sizeClasses}`}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={quantity <= min}
        className={`${btnSize} flex items-center justify-center rounded-sm text-uttara-charcoal hover:bg-uttara-cream active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none`}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="font-semibold text-uttara-charcoal min-w-[20px] text-center select-none">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        disabled={quantity >= max}
        className={`${btnSize} flex items-center justify-center rounded-sm text-uttara-terracotta hover:bg-uttara-terracotta-faint active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none`}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
