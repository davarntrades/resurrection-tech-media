import React from 'react';
import {interpolate} from 'remotion';
import {COLORS, FONTS} from '../branding/theme';

/**
 * The reachability diagram — the conceptual heart of the explainer.
 *
 *   • a system trajectory (the moving dot)
 *   • Ω, the reachable-danger region (red)
 *   • the SAFE SET (green)
 *   • the governance boundary that intercepts and corrects the trajectory
 *
 * It is data-driven via props so both the Drift and Solution scenes can reuse
 * the exact same geometry — only the phase changes.
 */

type Pt = {x: number; y: number};

// Geometry on a 1000×600 stage.
const START: Pt = {x: 120, y: 510};
const OMEGA: Pt = {x: 858, y: 150};
const SAFE: Pt = {x: 560, y: 430};

// Drift trajectory: start → accelerates up-right into Ω.
const DRIFT: [Pt, Pt, Pt, Pt] = [
  START,
  {x: 380, y: 505},
  {x: 640, y: 300},
  OMEGA,
];

// Corrected trajectory: same launch, then bends down into the safe set.
const CORRECT: [Pt, Pt, Pt, Pt] = [
  START,
  {x: 380, y: 505},
  {x: 470, y: 360},
  SAFE,
];

const cubicAt = (p: [Pt, Pt, Pt, Pt], t: number): Pt => {
  const mt = 1 - t;
  const a = mt * mt * mt;
  const b = 3 * mt * mt * t;
  const c = 3 * mt * t * t;
  const d = t * t * t;
  return {
    x: a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x,
    y: a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y,
  };
};

const pathD = (p: [Pt, Pt, Pt, Pt]) =>
  `M ${p[0].x} ${p[0].y} C ${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`;

export const ReachabilityDiagram: React.FC<{
  /** 0 → 1 progress of the system dot along the active trajectory. */
  progress: number;
  /** 0 → 1 reveal of the governance boundary sweep. */
  boundary?: number;
  /** 0 → 1 reveal of the green safe set. */
  safe?: number;
  /** When true, the dot follows the corrected path into the safe set. */
  corrected?: boolean;
  width?: number;
}> = ({progress, boundary = 0, safe = 0, corrected = false, width = 1100}) => {
  const t = Math.min(1, Math.max(0, progress));
  const activePath = corrected ? CORRECT : DRIFT;
  const dot = cubicAt(activePath, t);

  // The drawn portion of the trajectory follows the dot.
  const dash = 1400;

  return (
    <svg
      viewBox="0 0 1000 600"
      width={width}
      style={{overflow: 'visible'}}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="omegaFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.omega} stopOpacity={0.45} />
          <stop offset="70%" stopColor={COLORS.omega} stopOpacity={0.12} />
          <stop offset="100%" stopColor={COLORS.omega} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="safeFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.ok} stopOpacity={0.4} />
          <stop offset="75%" stopColor={COLORS.ok} stopOpacity={0.1} />
          <stop offset="100%" stopColor={COLORS.ok} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="boundaryStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={COLORS.accent} />
          <stop offset="100%" stopColor={COLORS.accentPurple} />
        </linearGradient>
      </defs>

      {/* axes */}
      <line
        x1={90}
        y1={540}
        x2={950}
        y2={540}
        stroke={COLORS.line2}
        strokeWidth={2}
      />
      <line
        x1={90}
        y1={540}
        x2={90}
        y2={70}
        stroke={COLORS.line2}
        strokeWidth={2}
      />
      <text
        x={950}
        y={566}
        fill={COLORS.ink3}
        fontFamily={FONTS.mono}
        fontSize={20}
        textAnchor="end"
      >
        state →
      </text>

      {/* Ω reachable-danger region */}
      <g>
        <ellipse
          cx={OMEGA.x}
          cy={OMEGA.y}
          rx={150}
          ry={120}
          fill="url(#omegaFill)"
        />
        <ellipse
          cx={OMEGA.x}
          cy={OMEGA.y}
          rx={120}
          ry={92}
          fill="none"
          stroke={COLORS.omega}
          strokeOpacity={0.6}
          strokeWidth={2}
          strokeDasharray="6 8"
        />
        <text
          x={OMEGA.x}
          y={OMEGA.y - 4}
          fill={COLORS.omega}
          fontFamily={FONTS.sans}
          fontStyle="italic"
          fontWeight={600}
          fontSize={56}
          textAnchor="middle"
        >
          Ω
        </text>
        <text
          x={OMEGA.x}
          y={OMEGA.y + 30}
          fill={COLORS.omega}
          fontFamily={FONTS.mono}
          fontSize={17}
          letterSpacing="0.12em"
          textAnchor="middle"
          opacity={0.85}
        >
          DANGER
        </text>
      </g>

      {/* SAFE SET */}
      <g opacity={safe} transform={`translate(${SAFE.x} ${SAFE.y})`}>
        <ellipse cx={0} cy={0} rx={150} ry={108} fill="url(#safeFill)" />
        <ellipse
          cx={0}
          cy={0}
          rx={118}
          ry={84}
          fill="none"
          stroke={COLORS.ok}
          strokeOpacity={0.7}
          strokeWidth={2}
        />
        <text
          x={0}
          y={6}
          fill={COLORS.ok}
          fontFamily={FONTS.mono}
          fontSize={20}
          fontWeight={600}
          letterSpacing="0.14em"
          textAnchor="middle"
        >
          SAFE SET
        </text>
      </g>

      {/* governance boundary — purple arc that sweeps in to intercept */}
      {boundary > 0 ? (
        <path
          d="M 700 70 C 560 200 520 360 470 540"
          fill="none"
          stroke="url(#boundaryStroke)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={interpolate(boundary, [0, 1], [dash, 0])}
          style={{filter: `drop-shadow(0 0 14px ${COLORS.accentGlow})`}}
        />
      ) : null}

      {/* trajectory trail (drawn up to the dot) */}
      <path
        d={pathD(activePath)}
        fill="none"
        stroke={corrected ? COLORS.ok : COLORS.accentBright}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={dash}
        strokeDashoffset={interpolate(t, [0, 1], [dash, dash - dash * 0.62])}
        opacity={0.9}
      />

      {/* system dot */}
      <g transform={`translate(${dot.x} ${dot.y})`}>
        <circle
          r={22}
          fill={corrected ? COLORS.okGlow : COLORS.accentGlow}
          opacity={0.6}
        />
        <circle
          r={10}
          fill={corrected ? COLORS.ok : COLORS.accentBright}
          stroke={COLORS.ink}
          strokeWidth={2}
        />
      </g>
    </svg>
  );
};
