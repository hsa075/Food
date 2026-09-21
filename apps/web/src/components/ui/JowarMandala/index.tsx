import React from 'react';
import { JowarMandala, JowarMandalaProps } from './JowarMandala';

export * from './JowarMandala';
export * from './JowarPatternBackground';
export * from './JowarDivider';
export * from './JowarLoadingMark';

export const JowarMandalaSmall: React.FC<Omit<JowarMandalaProps, 'size'>> = (props) => (
  <JowarMandala size="sm" {...props} />
);

export const JowarMandalaMedium: React.FC<Omit<JowarMandalaProps, 'size'>> = (props) => (
  <JowarMandala size="md" {...props} />
);

export const JowarMandalaLarge: React.FC<Omit<JowarMandalaProps, 'size'>> = (props) => (
  <JowarMandala size="lg" {...props} />
);
