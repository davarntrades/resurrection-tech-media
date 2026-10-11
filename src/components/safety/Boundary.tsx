import React, {useId} from 'react';
import {useCurrentFrame} from 'remotion';
import {FONTS} from '../../branding/theme';
import type {Pt} from '../authority/layouts';
import {progress, svgId} from '../authority/motion';
import {VERDICT_COLOR} from '../authority/paper';

const GATE = 46; // gap in the wall where allowed traffic passes

/**
 * The mediated execution boundary: a hatched wall between governance and the
 * tools. ALLOW passes through the gate (its lamp flashes green); BLOCK stops
 * against the wall with a red ✕. Drawn over the metro lines, under the cards.
 */
export const Boundary: React.FC<{
  width: number;
  height: number;
  a: Pt;
  b: Pt;
  gate: Pt;
  blockAt: Pt;
  label: Pt;
  appearAt: number;
  gateFlash: number;
  blockFlash: number;
}> = ({
  width,
  height,
  a,
  b,
  gate,
  blockAt,
  label,
  appearAt,
  gateFlash,
  blockFlash,
}) => {
  const frame = useCurrentFrame();
  const id = svgId(useId());
  const vertical = a[0] === b[0];
  const draw = progress(frame, appearAt, 36);
  const len = vertical ? b[1] - a[1] : b[0] - a[0];
  // the wall as a rotated band: along = wall axis, across = thickness
  const angle = vertical ? 90 : 0;
  const gateAlong = vertical ? gate[1] - a[1] : gate[0] - a[0];
  const band = (from: number, to: number) => (
    <g key={from}>
      <rect
        x={from}
        y={-9}
        width={Math.max(0, to - from)}
        height={18}
        fill={`url(#${id}h)`}
      />
      <line
        x1={from}
        y1={-9}
        x2={to}
        y2={-9}
        stroke="#2a2a2a"
        strokeWidth={2.2}
      />
      <line
        x1={from}
        y1={9}
        x2={to}
        y2={9}
        stroke="#2a2a2a"
        strokeWidth={2.2}
      />
    </g>
  );
  const shown = len * draw;
  const g1 = gateAlong - GATE / 2;
  const g2 = gateAlong + GATE / 2;
  const lamp = gateFlash;
  const xMark = blockFlash;

  return (
    <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
      <defs>
        <pattern
          id={`${id}h`}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="8" height="8" fill="#f1efeb" />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="8"
            stroke="#2a2a2a"
            strokeWidth="2.4"
            opacity="0.32"
          />
        </pattern>
      </defs>
      <g transform={`translate(${a[0]} ${a[1]}) rotate(${angle})`}>
        {band(0, Math.min(shown, g1))}
        {shown > g2 ? band(g2, shown) : null}
        {/* gate posts + lamp */}
        {shown > g1 ? (
          <g>
            <rect
              x={g1 - 5}
              y={-14}
              width={7}
              height={28}
              rx={3}
              fill="#2a2a2a"
            />
            <rect
              x={g2 - 2}
              y={-14}
              width={7}
              height={28}
              rx={3}
              fill="#2a2a2a"
            />
            <circle
              cx={gateAlong}
              cy={-20}
              r={5}
              fill={lamp > 0.05 ? VERDICT_COLOR.ALLOW : '#cfcac2'}
              opacity={0.4 + 0.6 * lamp}
            />
            <circle
              cx={gateAlong}
              cy={-20}
              r={5 + 9 * lamp}
              fill="none"
              stroke={VERDICT_COLOR.ALLOW}
              strokeWidth={2}
              opacity={0.6 * lamp}
            />
          </g>
        ) : null}
      </g>

      {/* block stop */}
      <g transform={`translate(${blockAt[0]} ${blockAt[1]})`} opacity={xMark}>
        <circle
          r={15 + 4 * xMark}
          fill="#fff"
          stroke={VERDICT_COLOR.BLOCK}
          strokeWidth={3}
        />
        <path
          d="M-6 -6 L6 6 M6 -6 L-6 6"
          stroke={VERDICT_COLOR.BLOCK}
          strokeWidth={3.4}
          strokeLinecap="round"
        />
      </g>

      {/* label */}
      <g transform={`translate(${label[0]} ${label[1]})`} opacity={draw}>
        <rect x={-172} y={-17} width={344} height={34} rx={17} fill="#1d1d1d" />
        <text
          y={6}
          textAnchor="middle"
          fill="#fff"
          style={{
            fontFamily: FONTS.mono,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 2,
          }}
        >
          MEDIATED EXECUTION BOUNDARY
        </text>
      </g>
    </svg>
  );
};
