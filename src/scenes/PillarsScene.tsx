import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Background} from '../components/Background';
import {KineticText} from '../components/KineticText';
import {COLORS, FONTS} from '../branding/theme';

export type PillarIcon = 'monitor' | 'constrain' | 'audit';
export type Pillar = {title: string; desc: string; icon: PillarIcon};

/**
 * Line-style brand icons. Inline SVG (not emoji) so they render identically in
 * every environment — including the headless Chrome used to render videos.
 */
const PillarGlyph: React.FC<{icon: PillarIcon}> = ({icon}) => {
  const common = {
    width: 46,
    height: 46,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: COLORS.accentBright,
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  if (icon === 'monitor') {
    // eye — watch every state
    return (
      <svg {...common}>
        <path d="M1.5 12C4 6.5 8 4.5 12 4.5C16 4.5 20 6.5 22.5 12C20 17.5 16 19.5 12 19.5C8 19.5 4 17.5 1.5 12Z" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
    );
  }
  if (icon === 'constrain') {
    // shield + check — intercept before Ω
    return (
      <svg {...common}>
        <path d="M12 2.5L20 5.5V11C20 16 16.5 20 12 21.8C7.5 20 4 16 4 11V5.5Z" />
        <path d="M8.5 12L11 14.5L15.5 9.5" />
      </svg>
    );
  }
  // document + lines — provable audit record
  return (
    <svg {...common}>
      <path d="M7 3H14L18 7V21H7Z" />
      <path d="M14 3V7H18" />
      <line x1="9.5" y1="12" x2="15.5" y2="12" />
      <line x1="9.5" y1="15.5" x2="15.5" y2="15.5" />
      <line x1="9.5" y1="8.5" x2="12" y2="8.5" />
    </svg>
  );
};

const Card: React.FC<{pillar: Pillar; index: number}> = ({pillar, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - 30 - index * 12,
    fps,
    config: {damping: 200, mass: 0.8},
  });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const translateY = interpolate(enter, [0, 1], [50, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        width: 460,
        height: 460,
        padding: 44,
        borderRadius: 20,
        background: `linear-gradient(180deg, ${COLORS.panel2}, ${COLORS.panel})`,
        border: `1px solid ${COLORS.line2}`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: 16,
          background: COLORS.bg1,
          border: `1px solid ${COLORS.line2}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 36,
          boxShadow: `inset 0 0 30px ${COLORS.accentGlow}`,
        }}
      >
        <PillarGlyph icon={pillar.icon} />
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 18,
          letterSpacing: '0.16em',
          color: COLORS.accentBright,
          marginBottom: 14,
        }}
      >
        {`0${index + 1}`}
      </div>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 600,
          fontSize: 46,
          color: COLORS.ink,
          marginBottom: 18,
        }}
      >
        {pillar.title}
      </div>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 400,
          fontSize: 26,
          lineHeight: 1.4,
          color: COLORS.ink2,
        }}
      >
        {pillar.desc}
      </div>
    </div>
  );
};

/** Three pillars of runtime governance: Monitor / Constrain / Audit. */
export const PillarsScene: React.FC<{heading: string; pillars: Pillar[]}> = ({
  heading,
  pillars,
}) => {
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: 64,
        }}
      >
        <KineticText delay={6} fontSize={56} weight={600}>
          {heading}
        </KineticText>
        <div style={{display: 'flex', gap: 40}}>
          {pillars.map((p, i) => (
            <Card key={p.title} pillar={p} index={i} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
