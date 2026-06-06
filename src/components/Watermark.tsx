import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, FONTS} from '../branding/theme';

/**
 * Persistent corner mark. Rendered once at the template level so it sits on top
 * of every scene.
 */
export const Watermark: React.FC<{
  label?: string;
}> = ({label = 'RESURRECTION TECH™'}) => {
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          bottom: 44,
          right: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: FONTS.mono,
          fontSize: 20,
          letterSpacing: '0.18em',
          color: COLORS.ink3,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 999,
            background: COLORS.accent,
            boxShadow: `0 0 12px ${COLORS.accentGlow}`,
          }}
        />
        {label}
      </div>
    </AbsoluteFill>
  );
};
