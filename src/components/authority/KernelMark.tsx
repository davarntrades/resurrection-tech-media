import React from 'react';
import {useCurrentFrame} from 'remotion';

const ORBIT = ['#22a050', '#e03a3a', '#f0a020', '#2f5fe0'];

/** The kernel's mark: a small black robot head with four agents in orbit. */
export const KernelMark: React.FC<{size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const rx = 46;
  const ry = 17;
  const tilt = -8;
  const dots = ORBIT.map((color, i) => {
    const a = frame * 0.035 + (i * Math.PI) / 2;
    return {
      color,
      x: Math.cos(a) * rx,
      y: Math.sin(a) * ry,
      front: Math.sin(a) > 0,
    };
  });
  const dot = (d: (typeof dots)[number]) => (
    <circle
      key={d.color}
      cx={d.x}
      cy={d.y}
      r={d.front ? 6 : 4.6}
      fill={d.color}
    />
  );

  return (
    <svg width={size} height={size * 0.72} viewBox="-55 -40 110 80">
      <g transform={`rotate(${tilt})`}>
        <ellipse
          rx={rx}
          ry={ry}
          fill="none"
          stroke="rgba(0,0,0,0.16)"
          strokeWidth="1.4"
        />
        {dots.filter((d) => !d.front).map(dot)}
      </g>
      {/* robot head */}
      <line x1="0" y1="-26" x2="0" y2="-17" stroke="#111" strokeWidth="3" />
      <circle cx="0" cy="-27" r="4" fill="#111" />
      <rect x="-17" y="-17" width="34" height="30" rx="9" fill="#111" />
      <rect x="-11" y="-10" width="22" height="13" rx="5" fill="#fff" />
      <circle cx="-5" cy="-3.5" r="2.6" fill="#111" />
      <circle cx="5" cy="-3.5" r="2.6" fill="#111" />
      <g transform={`rotate(${tilt})`}>
        {dots.filter((d) => d.front).map(dot)}
      </g>
    </svg>
  );
};
