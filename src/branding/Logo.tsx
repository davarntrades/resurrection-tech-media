import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONTS} from './theme';

/**
 * The ℛ(t) mark — an italic script-R (the "reachable state at time t") paired
 * with a mono "(t)". It springs up, fades in, and an accent underline draws
 * itself left-to-right.
 */
export const Logo: React.FC<{
  size?: number;
  delay?: number;
  color?: string;
}> = ({size = 220, delay = 0, color = COLORS.ink}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, mass: 0.8},
  });

  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const translateY = interpolate(enter, [0, 1], [40, 0]);
  const scale = interpolate(enter, [0, 1], [0.92, 1]);

  // The underline draws in slightly after the mark settles.
  const underline = spring({
    frame: frame - delay - 10,
    fps,
    config: {damping: 200},
  });
  const underlineWidth = interpolate(underline, [0, 1], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          lineHeight: 1,
          color,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.sans,
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: size,
            letterSpacing: '-0.02em',
          }}
        >
          ℛ
        </span>
        <span
          style={{
            fontFamily: FONTS.mono,
            fontWeight: 500,
            fontSize: size * 0.42,
            color: COLORS.accentBright,
            marginLeft: size * 0.02,
          }}
        >
          (t)
        </span>
      </div>
      <div
        style={{
          marginTop: size * 0.08,
          width: `${underlineWidth}%`,
          height: Math.max(2, size * 0.018),
          borderRadius: 999,
          background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentPurple})`,
          boxShadow: `0 0 24px ${COLORS.accentGlow}`,
        }}
      />
    </div>
  );
};
