import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../../branding/theme';

// Static film-grain tile (SVG turbulence as a data URI). Animating its position
// per frame gives a living, premium texture without re-running the filter.
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Persistent, continuous backdrop for the short: a slow dual-color glow drift
 * over a deep graphite base and a faint grid. Rendered once at the template
 * level so the whole piece feels like one living scene rather than cut slides.
 */
export const AmbientBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const ax = 50 + Math.sin(frame / 140) * 16;
  const ay = 32 + Math.cos(frame / 170) * 12;
  const px = 60 + Math.cos(frame / 120) * 18;
  const py = 70 + Math.sin(frame / 150) * 14;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(130% 100% at 30% 8%, ${COLORS.bg1}, ${COLORS.bg})`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(38% 30% at ${ax}% ${ay}%, ${COLORS.accentGlow}, transparent 70%)`,
          opacity: 0.55,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 32% at ${px}% ${py}%, rgba(109,92,255,0.30), transparent 72%)`,
          opacity: 0.5,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${COLORS.line} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.line} 1px, transparent 1px)`,
          backgroundSize: '90px 90px',
          maskImage:
            'radial-gradient(120% 90% at 50% 40%, black 50%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(120% 90% at 50% 40%, black 50%, transparent 100%)',
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};

/** Per-scene mood tint that fades with the scene envelope. */
export const MoodWash: React.FC<{color: string; opacity: number}> = ({
  color,
  opacity,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(60% 44% at 50% 42%, ${color}, transparent 70%)`,
      opacity: opacity * 0.7,
    }}
  />
);

/** Cinematic edge darkening, above content. */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      boxShadow: 'inset 0 0 420px 130px rgba(0,0,0,0.72)',
    }}
  />
);

/** Animated film grain, above content for texture. */
export const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const x = (frame * 7) % 180;
  const y = (frame * 11) % 180;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundImage: GRAIN_URI,
        backgroundSize: '180px 180px',
        backgroundPosition: `${x}px ${y}px`,
        opacity: 0.05,
        mixBlendMode: 'overlay',
      }}
    />
  );
};
