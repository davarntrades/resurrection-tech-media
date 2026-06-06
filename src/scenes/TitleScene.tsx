import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Background} from '../components/Background';
import {KineticText} from '../components/KineticText';
import {Logo} from '../branding/Logo';
import {COLORS} from '../branding/theme';

/** Opening scene: the ℛ(t) mark draws in above a mono tagline. */
export const TitleScene: React.FC<{tagline: string}> = ({tagline}) => {
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: 44,
        }}
      >
        <Logo size={240} delay={6} />
        <KineticText
          delay={30}
          font="mono"
          fontSize={34}
          weight={500}
          color={COLORS.ink2}
        >
          {tagline}
        </KineticText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
