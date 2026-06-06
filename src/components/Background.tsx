import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../branding/theme';

/**
 * The signature dark backdrop used by every scene: a faint technical grid, a
 * slow drifting accent glow, and a vignette to keep focus centre-stage.
 */
export const Background: React.FC<{
  glow?: string;
}> = ({glow = COLORS.accentGlow}) => {
  const frame = useCurrentFrame();

  // Lissajous-style slow drift for the glow (deterministic — no randomness).
  const gx = 50 + Math.sin(frame / 90) * 22;
  const gy = 42 + Math.cos(frame / 120) * 18;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* base page wash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 120% at 30% 20%, ${COLORS.bg1}, ${COLORS.bg})`,
        }}
      />

      {/* drifting accent glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 40% at ${gx}% ${gy}%, ${glow}, transparent 70%)`,
          opacity: 0.7,
        }}
      />

      {/* technical grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${COLORS.line} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.line} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(120% 120% at 50% 45%, black 55%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(120% 120% at 50% 45%, black 55%, transparent 100%)',
          opacity: 0.6,
        }}
      />

      {/* vignette */}
      <AbsoluteFill
        style={{
          boxShadow: 'inset 0 0 320px 80px rgba(0,0,0,0.65)',
        }}
      />
    </AbsoluteFill>
  );
};
