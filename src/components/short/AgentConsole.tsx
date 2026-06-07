import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONTS} from '../../branding/theme';
import {ConsoleCard} from './ConsoleCard';
import {AGENT_RECORD} from '../../videos/runtime-governance-short/script';

const Field: React.FC<{
  k: string;
  v: string;
  tag?: string;
  reveal: number;
}> = ({k, v, tag, reveal}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '18px 0',
      borderBottom: `1px solid ${COLORS.line}`,
      opacity: reveal,
      transform: `translateX(${interpolate(reveal, [0, 1], [-18, 0])}px)`,
    }}
  >
    <span
      style={{
        fontFamily: FONTS.mono,
        fontSize: 26,
        color: COLORS.ink3,
        width: 160,
      }}
    >
      {k}
    </span>
    <span
      style={{
        fontFamily: FONTS.mono,
        fontSize: 30,
        color: COLORS.ink,
        flex: 1,
      }}
    >
      {v}
    </span>
    {tag ? (
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: 20,
          letterSpacing: '0.1em',
          color: tag === 'PII' ? COLORS.omega : COLORS.ok,
          padding: '5px 14px',
          borderRadius: 8,
          border: `1px solid ${tag === 'PII' ? COLORS.omega : COLORS.ok}55`,
          background: `${tag === 'PII' ? COLORS.omega : COLORS.ok}14`,
        }}
      >
        {tag}
      </span>
    ) : null}
  </div>
);

/** Scene 2 — the agent reads a customer's account record. */
export const AgentConsole: React.FC = () => {
  const frame = useCurrentFrame();

  // typing the request endpoint
  const chars = Math.floor(
    interpolate(frame, [6, 34], [0, AGENT_RECORD.endpoint.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const typed = AGENT_RECORD.endpoint.slice(0, chars);
  const caret = Math.floor(frame / 8) % 2 === 0 ? '▋' : ' ';

  // scanning sweep over the record
  const sweep = interpolate(frame, [34, 78], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <ConsoleCard title="AGENT · autonomous" status="READING">
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 30,
          color: COLORS.accentBright,
          marginBottom: 24,
        }}
      >
        <span style={{color: COLORS.ink3}}>$ </span>
        {typed}
        <span style={{color: COLORS.ink}}>{caret}</span>
      </div>

      <div style={{position: 'relative'}}>
        {AGENT_RECORD.fields.map((f, i) => {
          const reveal = interpolate(frame, [30 + i * 8, 44 + i * 8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return <Field key={f.k} k={f.k} v={f.v} tag={f.tag} reveal={reveal} />;
        })}

        {/* scanning highlight */}
        <div
          style={{
            position: 'absolute',
            left: -10,
            right: -10,
            top: `${sweep * 100}%`,
            height: 64,
            transform: 'translateY(-32px)',
            background: `linear-gradient(180deg, transparent, ${COLORS.accentGlow}, transparent)`,
            opacity: sweep > 0 && sweep < 1 ? 0.9 : 0,
            borderRadius: 12,
          }}
        />
      </div>
    </ConsoleCard>
  );
};
