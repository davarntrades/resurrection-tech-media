import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS, FONTS} from '../../branding/theme';

/**
 * Persistent overlay chrome for the short: a top scrub/progress bar (constant
 * motion), the ℛ(t) brand mark, and a corner watermark — all kept inside the
 * platform-safe insets so feed UI never covers them.
 */
export const ShortChrome: React.FC<{safeTop?: number; safeBottom?: number}> = ({
  safeTop = 56,
  safeBottom = 64,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* top progress bar */}
      <div
        style={{
          position: 'absolute',
          top: safeTop,
          left: 56,
          right: 56,
          height: 8,
          borderRadius: 999,
          background: COLORS.panel2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            borderRadius: 999,
            background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentPurple})`,
            boxShadow: `0 0 18px ${COLORS.accentGlow}`,
          }}
        />
      </div>

      {/* brand mark, top-left under the bar */}
      <div
        style={{
          position: 'absolute',
          top: safeTop + 30,
          left: 56,
          display: 'flex',
          alignItems: 'baseline',
          lineHeight: 1,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.sans,
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 46,
            color: COLORS.ink,
          }}
        >
          ℛ
        </span>
        <span
          style={{
            fontFamily: FONTS.mono,
            fontWeight: 500,
            fontSize: 22,
            color: COLORS.accentBright,
          }}
        >
          (t)
        </span>
      </div>

      {/* watermark, bottom within safe inset */}
      <div
        style={{
          position: 'absolute',
          bottom: safeBottom,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONTS.mono,
          fontSize: 19,
          letterSpacing: '0.22em',
          color: COLORS.ink3,
        }}
      >
        RESURRECTION TECH™
      </div>
    </AbsoluteFill>
  );
};
