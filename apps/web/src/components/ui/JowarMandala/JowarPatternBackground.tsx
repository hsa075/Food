import React from 'react';
import { JowarMandala } from './JowarMandala';

export interface JowarPatternBackgroundProps {
  opacity?: number;
  animated?: boolean;
  position?: 'hero' | 'top-right' | 'center' | 'subtle-corner';
  className?: string;
}

export const JowarPatternBackground: React.FC<JowarPatternBackgroundProps> = ({
  opacity = 0.08,
  animated = true,
  position = 'hero',
  className = '',
}) => {
  if (position === 'hero') {
    return (
      <div
        className={`absolute -right-32 -top-24 sm:-right-24 sm:-top-16 lg:-right-20 lg:-top-10 pointer-events-none z-0 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <JowarMandala
          size="hero"
          variant="terracotta"
          opacity={opacity}
          animated={animated ? 'spin' : false}
          strokeWidth={1.1}
          className="transform scale-110 lg:scale-125 transition-transform duration-1000"
        />
      </div>
    );
  }

  if (position === 'top-right') {
    return (
      <div
        className={`absolute -right-20 -top-20 pointer-events-none z-0 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <JowarMandala
          size="xl"
          variant="terracotta"
          opacity={opacity}
          animated={animated ? 'spin' : false}
        />
      </div>
    );
  }

  if (position === 'center') {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <JowarMandala
          size="hero"
          variant="ochre"
          opacity={opacity}
          animated={animated ? 'breathe' : false}
        />
      </div>
    );
  }

  return (
    <div
      className={`absolute -left-16 -bottom-16 pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <JowarMandala
        size="lg"
        variant="terracotta"
        opacity={opacity}
        animated={animated ? 'reverse' : false}
      />
    </div>
  );
};
