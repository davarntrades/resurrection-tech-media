import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONTS} from '../../branding/theme';
import {CLOSE} from '../../videos/runtime-governance-short/script';

/** Scene 8 lockup — brand, CTA and URL under the closing line. */
export const CloseLockup: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 30, fps, config: {damping: 200}});
  const o = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [26, 0]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 26,
        opacity: o,
        transform: `translateY(${y}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'baseline', lineHeight: 1}}>
        <span
          style={{
            fontFamily: FONTS.sans,
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 120,
            color: COLORS.ink,
          }}
        >
          ℛ
        </span>
        <span
          style={{
            fontFamily: FONTS.mono,
            fontWeight: 500,
            fontSize: 54,
            color: COLORS.accentBright,
          }}
        >
          (t)
        </span>
      </div>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 700,
          fontSize: 52,
          color: COLORS.ink,
        }}
      >
        {CLOSE.brand}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '16px 34px',
          borderRadius: 999,
          border: `1px solid ${COLORS.accent}`,
          background: COLORS.accentGlow,
          fontFamily: FONTS.mono,
          fontSize: 34,
          color: COLORS.ink,
          boxShadow: `0 0 44px ${COLORS.accentGlow}`,
        }}
      >
        {CLOSE.cta}
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 34,
          letterSpacing: '0.04em',
          color: COLORS.accentBright,
        }}
      >
        {CLOSE.url}
      </div>
    </div>
  );
};
