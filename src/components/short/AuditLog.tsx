import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONTS} from '../../branding/theme';
import {ConsoleCard} from './ConsoleCard';
import {AUDIT_ENTRIES} from '../../videos/runtime-governance-short/script';

const COLOR_MAP = {
  ink: COLORS.ink,
  ink2: COLORS.ink2,
  accentBright: COLORS.accentBright,
  omega: COLORS.omega,
  ok: COLORS.ok,
} as const;

/** Scene 7 — the signed, provable audit record streams in line by line. */
export const AuditLog: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <ConsoleCard
      title="AUDIT · immutable"
      status="SIGNED ✓"
      statusColor={COLORS.ok}
      accent={COLORS.ok}
    >
      <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
        {AUDIT_ENTRIES.map((e, i) => {
          const at = 8 + i * 12;
          const reveal = interpolate(frame, [at, at + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={e.k}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 18,
                padding: '12px 0',
                borderBottom: `1px solid ${COLORS.line}`,
                opacity: reveal,
                transform: `translateY(${interpolate(reveal, [0, 1], [12, 0])}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 24,
                  color: COLORS.ok,
                  width: 28,
                }}
              >
                ✓
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 26,
                  color: COLORS.ink3,
                  width: 200,
                }}
              >
                {e.k}
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 28,
                  color: COLOR_MAP[e.c],
                  flex: 1,
                }}
              >
                {e.v}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 22,
          fontFamily: FONTS.mono,
          fontSize: 24,
          color: COLORS.ok,
          opacity: interpolate(frame, [80, 96], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        → written to immutable, replayable log
      </div>
    </ConsoleCard>
  );
};
