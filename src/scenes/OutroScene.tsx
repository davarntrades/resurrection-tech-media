import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background} from '../components/Background';
import {KineticText} from '../components/KineticText';
import {Logo} from '../branding/Logo';
import {COLORS, FONTS} from '../branding/theme';

/** Closing card: the mark, the brand, a CTA and the URL. */
export const OutroScene: React.FC<{
  brand: string;
  cta: string;
  url: string;
}> = ({brand, cta, url}) => {
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: 36,
        }}
      >
        <Logo size={200} delay={4} />
        <KineticText delay={24} fontSize={64} weight={600}>
          {brand}
        </KineticText>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
            marginTop: 12,
          }}
        >
          <KineticText delay={40} fontSize={30} font="mono" color={COLORS.ink2}>
            {cta}
          </KineticText>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 30px',
              borderRadius: 999,
              border: `1px solid ${COLORS.accent}`,
              background: COLORS.accentGlow,
              fontFamily: FONTS.mono,
              fontSize: 28,
              color: COLORS.ink,
              boxShadow: `0 0 40px ${COLORS.accentGlow}`,
            }}
          >
            {url}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
