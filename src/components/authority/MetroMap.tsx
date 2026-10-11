import React, {useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {getLength, getPointAtLength} from '@remotion/paths';
import {FONTS} from '../../branding/theme';
import type {Line, PillKind, Pt} from './layouts';
import {progress} from './motion';

/** Polyline → SVG path with rounded corners (radius capped per segment). */
const roundedPath = (pts: Pt[], radius: number): string => {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(cx - px, cy - py);
    const l2 = Math.hypot(nx - cx, ny - cy);
    const r = Math.min(radius, l1 / 2, l2 / 2);
    const ax = cx - ((cx - px) / l1) * r;
    const ay = cy - ((cy - py) / l1) * r;
    const bx = cx + ((nx - cx) / l2) * r;
    const by = cy + ((ny - cy) / l2) * r;
    d += ` L ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return `${d} L ${lx} ${ly}`;
};

const PILL: Record<PillKind, {label: string; color: string}> = {
  allow: {label: 'ALLOW', color: '#1f9d4a'},
  escalate: {label: 'ESCALATE', color: '#e3a21a'},
  block: {label: 'BLOCK', color: '#d93a49'},
  signed: {label: 'SIGNED', color: '#14937e'},
};

export type PillLaunch = {kind: PillKind; frame: number};

const DocGlyph: React.FC<{color: string}> = ({color}) => (
  <g>
    <rect
      x="-9"
      y="-11.5"
      width="18"
      height="23"
      rx="3.5"
      fill="#fff"
      stroke={color}
      strokeWidth="2.2"
    />
    <line x1="-4.5" y1="-4" x2="4.5" y2="-4" stroke={color} strokeWidth="1.8" />
    <line
      x1="-4.5"
      y1="0.5"
      x2="4.5"
      y2="0.5"
      stroke={color}
      strokeWidth="1.8"
    />
    <line x1="-4.5" y1="5" x2="2" y2="5" stroke={color} strokeWidth="1.8" />
  </g>
);

const PillGlyph: React.FC<{kind: PillKind}> = ({kind}) => {
  const {label, color} = PILL[kind];
  const w = label.length * 9.4 + 18;
  return (
    <g>
      <rect x={-w / 2} y="-12" width={w} height="24" rx="12" fill={color} />
      <text
        y="5"
        textAnchor="middle"
        fill="#fff"
        style={{
          fontFamily: FONTS.mono,
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        {label}
      </text>
    </g>
  );
};

const Route: React.FC<{
  line: Line;
  draw: number;
  pills: PillLaunch[];
  preroll: number;
}> = ({line, draw, pills, preroll}) => {
  const frame = useCurrentFrame();
  const d = useMemo(() => roundedPath(line.points, 46), [line.points]);
  const len = useMemo(() => getLength(d), [d]);

  const at = (t: number) =>
    getPointAtLength(d, Math.max(0, Math.min(1, t)) * len);
  // fade a traveller in and out at the ends of its run
  const edge = (t: number) => Math.min(1, t / 0.06, (1 - t) / 0.06);

  const travellers: React.ReactNode[] = [];
  if (line.docs) {
    const {every, travel} = line.docs;
    const start = line.docs.start - preroll;
    for (let k = 0; start + k * every <= frame; k++) {
      const t = (frame - start - k * every) / travel;
      if (t < 0 || t > 1) continue;
      const p = at(t);
      travellers.push(
        <g
          key={`d${k}`}
          transform={`translate(${p.x} ${p.y})`}
          opacity={edge(t)}
        >
          <DocGlyph color={line.color} />
        </g>,
      );
    }
  }
  pills.forEach((pill, k) => {
    const t = (frame - pill.frame) / 48;
    if (t < 0 || t > 1) return;
    const p = at(t);
    travellers.push(
      <g key={`p${k}`} transform={`translate(${p.x} ${p.y})`} opacity={edge(t)}>
        <PillGlyph kind={pill.kind} />
      </g>,
    );
  });

  return (
    <g>
      <g
        strokeDasharray={len}
        strokeDashoffset={len * (1 - draw)}
        fill="none"
        strokeLinecap="round"
      >
        <path d={d} stroke={line.color} strokeWidth={9} opacity={0.75} />
        <path d={d} stroke="#fbfaf8" strokeWidth={3.6} />
      </g>
      {(line.stations ?? []).map((s) => {
        if (s > draw) return null;
        const p = at(s);
        return (
          <circle
            key={s}
            cx={p.x}
            cy={p.y}
            r={6}
            fill="#fff"
            stroke={line.color}
            strokeWidth={2.4}
          />
        );
      })}
      {travellers}
    </g>
  );
};

/**
 * All routes, drawn on in sequence, with their traffic. Sits under the cards.
 * `preroll` starts the document traffic that many frames early, so a loop
 * master opens with the lines already busy.
 */
export const MetroMap: React.FC<{
  width: number;
  height: number;
  lines: Line[];
  drawWindow: readonly [number, number];
  pills: PillLaunch[];
  preroll?: number;
}> = ({width, height, lines, drawWindow, pills, preroll = 0}) => {
  const frame = useCurrentFrame();
  const [from, to] = drawWindow;
  const step = (to - from) / Math.max(1, lines.length);

  return (
    <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
      {lines.map((line, i) => (
        <Route
          key={i}
          line={line}
          draw={progress(frame, from + i * step * 0.5, (to - from) * 0.6)}
          pills={line.pill ? pills.filter((p) => p.kind === line.pill) : []}
          preroll={preroll}
        />
      ))}
    </svg>
  );
};
