import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Background} from '../components/Background';
import {KineticText} from '../components/KineticText';
import {ReachabilityDiagram} from '../components/ReachabilityDiagram';
import {COLORS} from '../branding/theme';

/**
 * The problem. An autonomous system's dot accelerates along its trajectory and
 * crosses into Ω. A red flash lands at the moment of breach.
 */
export const DriftScene: React.FC<{lines: [string, string]}> = ({lines}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  // Ease-in acceleration: slow start, fast finish — the system "drifts".
  const linear = interpolate(frame, [40, durationInFrames - 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const progress = linear * linear; // quadratic ease-in (acceleration)

  // Red flash fires as the dot enters Ω (~progress 0.9).
  const breachFrame = interpolate(0.9, [0, 1], [40, durationInFrames - 60]);
  const flash = interpolate(
    frame,
    [breachFrame - 2, breachFrame + 6, breachFrame + 40],
    [0, 0.55, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill>
      <Background glow={COLORS.omegaGlow} />

      <AbsoluteFill
        style={{justifyContent: 'center', alignItems: 'center', paddingTop: 40}}
      >
        <ReachabilityDiagram progress={progress} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 96,
          gap: 16,
        }}
      >
        <KineticText delay={20} fontSize={50} color={COLORS.ink}>
          {lines[0]}
        </KineticText>
        <KineticText delay={durationInFrames - 200} fontSize={50} color={COLORS.omega}>
          {lines[1]}
        </KineticText>
      </AbsoluteFill>

      {/* red breach flash */}
      <AbsoluteFill
        style={{backgroundColor: COLORS.omega, opacity: flash, mixBlendMode: 'screen'}}
      />
    </AbsoluteFill>
  );
};
