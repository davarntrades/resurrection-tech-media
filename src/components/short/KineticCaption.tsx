import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONTS} from '../../branding/theme';
import type {CaptionToken} from '../../videos/runtime-governance-short/script';

const COLOR_MAP: Record<NonNullable<CaptionToken['c']>, string> = {
  accent: COLORS.accent,
  accentBright: COLORS.accentBright,
  omega: COLORS.omega,
  ok: COLORS.ok,
  ink: COLORS.ink,
  ink2: COLORS.ink2,
};

/**
 * Word-by-word kinetic caption built for muted autoplay: large, high-contrast,
 * each word pops up on its own beat with the most-recent word lifted. Emphasis
 * words carry a brand color. Sized to fill a vertical/square frame.
 */
export const KineticCaption: React.FC<{
  tokens: CaptionToken[];
  /** Frame the reveal starts on. */
  startAt?: number;
  /** Frames between each word. */
  stagger?: number;
  fontSize?: number;
}> = ({tokens, startAt = 6, stagger = 4, fontSize = 92}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'baseline',
        gap: `${fontSize * 0.12}px ${fontSize * 0.28}px`,
        padding: '0 64px',
        textAlign: 'center',
      }}
    >
      {tokens.map((tok, i) => {
        const delay = startAt + i * stagger;
        const enter = spring({
          frame: frame - delay,
          fps,
          config: {damping: 200, mass: 0.5},
        });
        const opacity = interpolate(enter, [0, 1], [0, 1]);
        const translateY = interpolate(enter, [0, 1], [38, 0]);
        const scale = interpolate(enter, [0, 1], [0.8, 1]);
        const color = tok.c ? COLOR_MAP[tok.c] : COLORS.ink;
        const emphasized = Boolean(tok.c);

        return (
          <span
            key={`${tok.t}-${i}`}
            style={{
              display: 'inline-block',
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              fontFamily: FONTS.sans,
              fontWeight: emphasized ? 800 : 700,
              fontSize,
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              color,
              textShadow: emphasized
                ? `0 0 38px ${color}66`
                : '0 6px 28px rgba(0,0,0,0.6)',
            }}
          >
            {tok.t}
          </span>
        );
      })}
    </div>
  );
};
