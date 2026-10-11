import React, {useId} from 'react';
import {useCurrentFrame} from 'remotion';
import {svgId} from './motion';

/**
 * Halftone agent mascot: a friendly robot printed in dots of the agent's
 * colour. Bobs gently and blinks; `face="visor"` swaps the eyes for a red
 * scanner bar (the infra agent).
 */
export const Robot: React.FC<{
  color: string;
  size: number;
  phase?: number;
  face?: 'eyes' | 'visor';
}> = ({color, size, phase = 0, face = 'eyes'}) => {
  const frame = useCurrentFrame();
  const id = svgId(useId());
  const bob = Math.sin(frame / 18 + phase) * 2.2;
  const cycle = (frame + Math.round(phase * 37)) % 96;
  const blink = cycle > 90 ? 0.15 : 1;
  const scan = 30 + 40 * (0.5 + 0.5 * Math.sin(frame / 9 + phase));

  return (
    <svg
      width={size}
      height={size * 1.1}
      viewBox="0 0 100 110"
      style={{overflow: 'visible'}}
    >
      <defs>
        <pattern
          id={`${id}c`}
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0.3" y="0.3" width="2.45" height="2.45" fill={color} />
        </pattern>
        <pattern
          id={`${id}d`}
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0.25" y="0.25" width="2.6" height="2.6" fill="#141414" />
        </pattern>
        <pattern
          id={`${id}s`}
          width="3"
          height="3"
          patternUnits="userSpaceOnUse"
          patternTransform="translate(1.5 1.5)"
        >
          <rect
            x="0.6"
            y="0.6"
            width="1.6"
            height="1.6"
            fill="#141414"
            opacity="0.6"
          />
        </pattern>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}m`}>
          <rect width="100" height="110" fill={`url(#${id}g)`} />
        </mask>
      </defs>

      <ellipse cx="50" cy="106" rx="30" ry="4" fill="rgba(0,0,0,0.07)" />

      <g transform={`translate(0 ${bob})`}>
        {/* antenna */}
        <line
          x1="50"
          y1="5"
          x2="50"
          y2="15"
          stroke="#141414"
          strokeWidth="2.4"
        />
        <circle cx="50" cy="4.5" r="3.4" fill={`url(#${id}c)`} />

        {/* body */}
        <path
          d="M19 104 C19 77 31 65 50 65 C69 65 81 77 81 104 Z"
          fill={`url(#${id}c)`}
        />
        <path
          d="M19 104 C19 77 31 65 50 65 C69 65 81 77 81 104 Z"
          fill={`url(#${id}s)`}
          mask={`url(#${id}m)`}
        />
        <rect
          x="58"
          y="80"
          width="11"
          height="11"
          rx="1.5"
          fill="none"
          stroke="#141414"
          strokeWidth="1.6"
        />
        <path
          d="M60.5 85.5 L63 88 L67 83"
          fill="none"
          stroke="#141414"
          strokeWidth="1.6"
        />

        {/* neck */}
        <rect x="42" y="57" width="16" height="9" fill={`url(#${id}c)`} />

        {/* head */}
        <rect
          x="11"
          y="28"
          width="9"
          height="17"
          rx="3"
          fill={`url(#${id}c)`}
        />
        <rect
          x="80"
          y="28"
          width="9"
          height="17"
          rx="3"
          fill={`url(#${id}c)`}
        />
        <rect
          x="17"
          y="14"
          width="66"
          height="45"
          rx="17"
          fill={`url(#${id}c)`}
        />
        <rect
          x="25"
          y="22"
          width="50"
          height="30"
          rx="13"
          fill={`url(#${id}d)`}
        />

        {face === 'eyes' ? (
          <>
            <ellipse cx="39" cy="35" rx="5.6" ry={5.6 * blink} fill={color} />
            <ellipse cx="61" cy="35" rx="5.6" ry={5.6 * blink} fill={color} />
            <path
              d="M42 44 Q50 50 58 44"
              fill="none"
              stroke={color}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <rect
              x="29"
              y="32"
              width="42"
              height="6"
              rx="3"
              fill={color}
              opacity="0.35"
            />
            <rect
              x={scan - 8}
              y="32"
              width="16"
              height="6"
              rx="3"
              fill={color}
            />
          </>
        )}
      </g>
    </svg>
  );
};
