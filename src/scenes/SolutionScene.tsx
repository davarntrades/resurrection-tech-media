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
 * The solution. The governance boundary sweeps in, intercepts the drifting
 * trajectory, and corrects it down into the green safe set.
 */
export const SolutionScene: React.FC<{lines: [string, string]}> = ({lines}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  // 1. boundary sweeps in
  const boundary = interpolate(frame, [20, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // 2. safe set reveals
  const safe = interpolate(frame, [120, 180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // 3. the corrected trajectory settles into the safe set
  const progress = interpolate(frame, [110, durationInFrames - 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <Background glow={COLORS.accentGlow} />

      <AbsoluteFill
        style={{justifyContent: 'center', alignItems: 'center', paddingTop: 40}}
      >
        <ReachabilityDiagram
          progress={progress}
          boundary={boundary}
          safe={safe}
          corrected
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 96,
          gap: 16,
        }}
      >
        <KineticText delay={140} fontSize={50} color={COLORS.ink}>
          {lines[0]}
        </KineticText>
        <KineticText delay={200} fontSize={50} color={COLORS.ok}>
          {lines[1]}
        </KineticText>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
