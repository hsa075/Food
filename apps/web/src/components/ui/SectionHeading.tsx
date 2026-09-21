import React from 'react';
import { JowarMandala } from './JowarMandala/JowarMandala';

export interface SectionHeadingProps {
  kannadaSubtitle?: string;
  englishTitle: string;
  description?: string;
  alignment?: 'left' | 'center';
  withMandalaAccent?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kannadaSubtitle,
  englishTitle,
  description,
  alignment = 'center',
  withMandalaAccent = false,
  className = '',
}) => {
  const alignClass = alignment === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col mb-8 md:mb-12 ${alignClass} ${className}`}>
      {withMandalaAccent && (
        <div className="mb-2">
          <JowarMandala size={28} variant="terracotta" opacity={0.75} strokeWidth={1.3} />
        </div>
      )}

      {kannadaSubtitle && (
        <span className="text-xs md:text-sm font-kannada font-semibold text-uttara-terracotta tracking-wider uppercase mb-1">
          {kannadaSubtitle}
        </span>
      )}

      <h2 className="text-2xl md:text-4xl font-display font-bold text-uttara-charcoal tracking-tight">
        {englishTitle}
      </h2>

      {description && (
        <p className="mt-2.5 text-sm md:text-base text-uttara-charcoal-muted max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
