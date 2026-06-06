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

export type Pillar = {title: string; desc: string; glyph: string};

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
          fontSize: 44,
          marginBottom: 36,
          boxShadow: `inset 0 0 30px ${COLORS.accentGlow}`,
        }}
      >
        {pillar.glyph}
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
