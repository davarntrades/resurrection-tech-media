import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONTS} from '../../branding/theme';
import type {CaptionToken} from '../../videos/runtime-governance-short/script';

const SOLID: Record<NonNullable<CaptionToken['c']>, string> = {
  accent: COLORS.accent,
  accentBright: COLORS.accentBright,
  omega: COLORS.omega,
  ok: COLORS.ok,
  ink: COLORS.ink,
  ink2: COLORS.ink2,
};

// Gradient pairs for emphasized words — premium, dimensional fill.
const GRAD: Partial<Record<NonNullable<CaptionToken['c']>, [string, string]>> = {
  accent: [COLORS.accent, COLORS.accentBright],
  accentBright: [COLORS.accentBright, '#a9c2ff'],
  omega: [COLORS.omega, '#ff8589'],
  ok: [COLORS.ok, '#74d6a8'],
};

/**
 * Word-by-word kinetic caption for muted autoplay: large, high-contrast, each
 * word rises with a soft overshoot and blur-in. Emphasis words get a gradient
 * fill and glow. Sized to fill a vertical/square frame.
 */
export const KineticCaption: React.FC<{
  tokens: CaptionToken[];
  startAt?: number;
  stagger?: number;
  fontSize?: number;
}> = ({tokens, startAt = 8, stagger = 5, fontSize = 84}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: `${fontSize * 0.1}px ${fontSize * 0.26}px`,
        padding: '0 60px',
        textAlign: 'center',
      }}
    >
      {tokens.map((tok, i) => {
        const delay = startAt + i * stagger;
        const enter = spring({
          frame: frame - delay,
          fps,
          config: {damping: 16, mass: 0.7, stiffness: 130},
        });
        const clamped = Math.min(1, Math.max(0, enter));
        const opacity = interpolate(clamped, [0, 0.4], [0, 1], {
          extrapolateRight: 'clamp',
        });
        const translateY = interpolate(enter, [0, 1], [42, 0]);
        const blur = interpolate(clamped, [0, 1], [10, 0]);

        const grad = tok.c ? GRAD[tok.c] : undefined;
        const emphasized = Boolean(grad);
        const solid = tok.c ? SOLID[tok.c] : COLORS.ink;

        const gradientStyle: React.CSSProperties = grad
          ? {
              backgroundImage: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              filter: `drop-shadow(0 0 26px ${grad[0]}66)`,
            }
          : {
              color: solid,
              textShadow: '0 6px 26px rgba(0,0,0,0.65)',
            };

        return (
          <span
            key={`${tok.t}-${i}`}
            style={{
              display: 'inline-block',
              opacity,
              transform: `translateY(${translateY}px)`,
              filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
              fontFamily: FONTS.sans,
              fontWeight: emphasized ? 800 : 700,
              fontSize,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              ...gradientStyle,
            }}
          >
            {tok.t}
          </span>
        );
      })}
    </div>
  );
};
