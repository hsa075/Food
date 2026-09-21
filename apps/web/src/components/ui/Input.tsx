'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-uttara-charcoal tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-brand text-sm text-uttara-charcoal placeholder-uttara-charcoal-faint transition-all duration-150 focus:border-uttara-terracotta focus:ring-1 focus:ring-uttara-terracotta/20 disabled:bg-uttara-cream disabled:opacity-60 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-uttara-cream-border'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
        {helperText && !error && <span className="text-xs text-uttara-charcoal-muted">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, options, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-xs font-medium text-uttara-charcoal tracking-wide">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-brand text-sm text-uttara-charcoal transition-all duration-150 focus:border-uttara-terracotta focus:ring-1 focus:ring-uttara-terracotta/20 ${
            error ? 'border-red-500' : 'border-uttara-cream-border'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
