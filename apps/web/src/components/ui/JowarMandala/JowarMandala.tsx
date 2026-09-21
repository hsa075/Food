import React from 'react';

export type MandalaSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero' | number;
export type MandalaVariant = 'terracotta' | 'ochre' | 'charcoal' | 'indigo' | 'green' | 'cream';
export type MandalaAnimation = boolean | 'spin' | 'breathe' | 'reverse';

export interface JowarMandalaProps extends React.SVGProps<SVGSVGElement> {
  size?: MandalaSize;
  variant?: MandalaVariant;
  opacity?: number;
  animated?: MandalaAnimation;
  strokeWidth?: number;
  className?: string;
}

export const JowarMandala: React.FC<JowarMandalaProps> = ({
  size = 'md',
  variant = 'terracotta',
  opacity = 1,
  animated = false,
  strokeWidth = 1.25,
  className = '',
  ...props
}) => {
  const pixelSize = typeof size === 'number'
    ? size
    : {
        sm: 24,
        md: 48,
        lg: 140,
        xl: 320,
        hero: 540,
      }[size];

  const colorMap: Record<MandalaVariant, { stroke: string; fill: string }> = {
    terracotta: { stroke: '#9E472A', fill: '#9E472A' },
    ochre: { stroke: '#D9822B', fill: '#D9822B' },
    charcoal: { stroke: '#1C1917', fill: '#1C1917' },
    indigo: { stroke: '#3D4A5A', fill: '#3D4A5A' },
    green: { stroke: '#4A6B53', fill: '#4A6B53' },
    cream: { stroke: '#EDE6DF', fill: '#EDE6DF' },
  };

  const { stroke, fill } = colorMap[variant] || colorMap.terracotta;

  let animationClass = '';
  if (animated === true || animated === 'spin') {
    animationClass = 'animate-jowar-spin origin-center';
  } else if (animated === 'reverse') {
    animationClass = 'animate-jowar-spin-reverse origin-center';
  } else if (animated === 'breathe') {
    animationClass = 'animate-jowar-breathe origin-center';
  }

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
      className={`select-none pointer-events-none transition-transform duration-700 ${animationClass} ${className}`}
      aria-hidden="true"
      {...props}
    >
      <g stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {/* Core Jowar Grain Hub (8 radial teardrop seeds) */}
        <circle cx="100" cy="100" r="4.5" fill={fill} fillOpacity="0.85" />
        
        {[...Array(8)].map((_, i) => (
          <g key={`seed-${i}`} transform={`rotate(${i * 45} 100 100)`}>
            {/* Sorghum grain seed silhouette */}
            <path
              d="M 100 86 C 97 92, 97 96, 100 98 C 103 96, 103 92, 100 86 Z"
              fill={fill}
              fillOpacity="0.45"
            />
          </g>
        ))}

        {/* Ring 1: Toasted Jolada Rotti Texture (Dotted concentric ring) */}
        <circle
          cx="100"
          cy="100"
          r="24"
          strokeDasharray="2 3.5"
          strokeOpacity="0.75"
        />

        {/* Ring 2: Deccan Folk Geometry (16 small diamond nodes & connecting ring) */}
        <circle cx="100" cy="100" r="40" strokeOpacity="0.4" />
        {[...Array(16)].map((_, i) => (
          <g key={`diamond-${i}`} transform={`rotate(${i * 22.5} 100 100)`}>
            <polygon
              points="100,38 102.5,40 100,42 97.5,40"
              fill={fill}
              fillOpacity="0.6"
            />
          </g>
        ))}

        {/* Ring 3: Radiating Jowar Grain Ears (16 elongated curved grain stalks) */}
        {[...Array(16)].map((_, i) => (
          <g key={`grain-ear-${i}`} transform={`rotate(${i * 22.5} 100 100)`}>
            {/* Grain stem */}
            <line x1="100" y1="46" x2="100" y2="70" strokeOpacity="0.8" />
            {/* Flanking jowar seedlets */}
            <ellipse cx="97" cy="56" rx="1.8" ry="3.2" transform="rotate(-25 97 56)" fill={fill} fillOpacity="0.5" />
            <ellipse cx="103" cy="56" rx="1.8" ry="3.2" transform="rotate(25 103 56)" fill={fill} fillOpacity="0.5" />
            <ellipse cx="97" cy="64" rx="1.8" ry="3.2" transform="rotate(-25 97 64)" fill={fill} fillOpacity="0.5" />
            <ellipse cx="103" cy="64" rx="1.8" ry="3.2" transform="rotate(25 103 64)" fill={fill} fillOpacity="0.5" />
          </g>
        ))}

        {/* Ring 4: Concentric boundary with alternating pips */}
        <circle cx="100" cy="100" r="76" strokeOpacity="0.6" />
        <circle cx="100" cy="100" r="80" strokeDasharray="1.5 5" strokeOpacity="0.7" />

        {/* Outer Ring: Ilkal-inspired stepped perimeter rays (24 geometric nodes) */}
        {[...Array(24)].map((_, i) => (
          <g key={`outer-pip-${i}`} transform={`rotate(${i * 15} 100 100)`}>
            <line x1="100" y1="83" x2="100" y2="92" strokeOpacity="0.85" />
            <circle cx="100" cy="94" r="1.5" fill={fill} fillOpacity="0.75" />
          </g>
        ))}
      </g>
    </svg>
  );
};
