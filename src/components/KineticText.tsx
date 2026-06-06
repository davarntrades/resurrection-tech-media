import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONTS} from '../branding/theme';

/**
 * Brand text that springs up and fades in. The workhorse for every line of
 * copy in a scene — pass a `delay` to stagger lines.
 */
export const KineticText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  fontSize?: number;
  color?: string;
  font?: 'sans' | 'mono';
  weight?: number;
  letterSpacing?: string;
  maxWidth?: number;
  align?: React.CSSProperties['textAlign'];
  uppercase?: boolean;
  opacityOverride?: number;
}> = ({
  children,
  delay = 0,
  fontSize = 56,
  color = COLORS.ink,
  font = 'sans',
  weight = 600,
  letterSpacing = '-0.01em',
  maxWidth = 1400,
  align = 'center',
  uppercase = false,
  opacityOverride,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, mass: 0.7},
  });

  const opacity = opacityOverride ?? interpolate(enter, [0, 1], [0, 1]);
  const translateY = interpolate(enter, [0, 1], [28, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        maxWidth,
        textAlign: align,
        fontFamily: font === 'mono' ? FONTS.mono : FONTS.sans,
        fontSize,
        fontWeight: weight,
        letterSpacing: font === 'mono' ? '0.02em' : letterSpacing,
        color,
        lineHeight: 1.18,
        textTransform: uppercase ? 'uppercase' : 'none',
      }}
    >
      {children}
    </div>
  );
};
