import React from 'react';
import { JowarMandala } from './JowarMandala';

export interface JowarDividerProps {
  className?: string;
  variant?: 'terracotta' | 'ochre' | 'cream' | 'charcoal';
  kannadaWord?: string;
}

export const JowarDivider: React.FC<JowarDividerProps> = ({
  className = '',
  variant = 'terracotta',
  kannadaWord,
}) => {
  return (
    <div className={`flex items-center justify-center gap-4 py-8 md:py-12 select-none ${className}`}>
      {/* Left fine rule */}
      <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent via-uttara-cream-border to-uttara-terracotta/30" />

      {/* Central Jowar Motif */}
      <div className="flex items-center gap-2.5">
        <JowarMandala
          size={22}
          variant={variant}
          opacity={0.7}
          strokeWidth={1.4}
        />
        {kannadaWord && (
          <span className="text-[11px] font-kannada font-medium text-uttara-terracotta tracking-wider">
            {kannadaWord}
          </span>
        )}
      </div>

      {/* Right fine rule */}
      <div className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent via-uttara-cream-border to-uttara-terracotta/30" />
    </div>
  );
};
