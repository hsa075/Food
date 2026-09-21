import React from 'react';
import { JowarMandala } from './JowarMandala';

export interface JowarLoadingMarkProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export const JowarLoadingMark: React.FC<JowarLoadingMarkProps> = ({
  size = 'md',
  message,
  className = '',
}) => {
  const pixelSize = {
    sm: 32,
    md: 52,
    lg: 76,
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Soft pulsing glow behind */}
        <div className="absolute w-12 h-12 bg-uttara-ochre/15 rounded-full filter blur-md animate-pulse" />

        {/* Rotating Jowar Mandala */}
        <JowarMandala
          size={pixelSize}
          variant="terracotta"
          animated="spin"
          strokeWidth={1.3}
          opacity={0.85}
        />
      </div>

      {message && (
        <p className="mt-4 text-xs font-medium text-uttara-charcoal-muted tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
