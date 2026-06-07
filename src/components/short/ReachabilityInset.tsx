import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONTS} from '../../branding/theme';

/**
 * Scene 4 — supporting geometry. The agent's current state projects a cone of
 * reachable futures; that cone touches Ω (a loss event), which ignites red.
 * Deliberately compact: evidence under the story, not the hero.
 */
export const ReachabilityInset: React.FC = () => {
  const frame = useCurrentFrame();

  const project = interpolate(frame, [6, 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ignite = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dash = 900;

  return (
    <svg
      viewBox="0 0 940 520"
      width={940}
      style={{overflow: 'visible'}}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="insetOmega" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.omega} stopOpacity={0.5} />
          <stop offset="70%" stopColor={COLORS.omega} stopOpacity={0.12} />
          <stop offset="100%" stopColor={COLORS.omega} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="cone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.accentBright} stopOpacity={0.05} />
          <stop offset="100%" stopColor={COLORS.omega} stopOpacity={0.28} />
        </linearGradient>
      </defs>

      {/* axes */}
      <line x1={70} y1={460} x2={900} y2={460} stroke={COLORS.line2} strokeWidth={2} />
      <line x1={70} y1={460} x2={70} y2={60} stroke={COLORS.line2} strokeWidth={2} />
      <text x={84} y={92} fill={COLORS.ink3} fontFamily={FONTS.mono} fontSize={22}>
        risk
      </text>
      <text x={900} y={500} fill={COLORS.ink3} fontFamily={FONTS.mono} fontSize={22} textAnchor="end">
        time →
      </text>

      {/* Ω region */}
      <g opacity={0.35 + 0.65 * ignite}>
        <ellipse cx={800} cy={150} rx={150} ry={120} fill="url(#insetOmega)" />
        <ellipse
          cx={800}
          cy={150}
          rx={108}
          ry={84}
          fill="none"
          stroke={COLORS.omega}
          strokeOpacity={0.7}
          strokeWidth={2}
          strokeDasharray="6 8"
        />
        <text x={800} y={150} fill={COLORS.omega} fontFamily={FONTS.sans} fontStyle="italic" fontWeight={700} fontSize={66} textAnchor="middle" dominantBaseline="central">
          Ω
        </text>
      </g>
      <text
        x={800}
        y={250}
        fill={COLORS.omega}
        fontFamily={FONTS.mono}
        fontSize={22}
        letterSpacing="0.1em"
        textAnchor="middle"
        opacity={ignite}
      >
        loss event
      </text>

      {/* predicted reachable cone */}
      <path
        d="M 250 400 L 800 230 L 800 70 L 250 360 Z"
        fill="url(#cone)"
        opacity={project}
      />
      <path
        d="M 250 380 C 480 360 650 280 800 150"
        fill="none"
        stroke={COLORS.omega}
        strokeWidth={4}
        strokeDasharray="10 12"
        strokeDashoffset={interpolate(project, [0, 1], [dash, 0])}
        opacity={0.9}
        strokeLinecap="round"
      />

      {/* solid past trajectory + current state dot */}
      <path
        d="M 70 450 C 150 440 210 420 250 380"
        fill="none"
        stroke={COLORS.accentBright}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <g transform="translate(250 380)">
        <circle r={22} fill={COLORS.accentGlow} opacity={0.6} />
        <circle r={11} fill={COLORS.accentBright} stroke={COLORS.ink} strokeWidth={2} />
      </g>
      <text x={250} y={440} fill={COLORS.ink3} fontFamily={FONTS.mono} fontSize={22} textAnchor="middle">
        now
      </text>

      {/* PROJECTED tag */}
      <text
        x={520}
        y={300}
        fill={COLORS.omega}
        fontFamily={FONTS.mono}
        fontSize={24}
        letterSpacing="0.14em"
        textAnchor="middle"
        opacity={project}
        transform="rotate(-14 520 300)"
      >
        PROJECTED · REACHABLE
      </text>
    </svg>
  );
};
