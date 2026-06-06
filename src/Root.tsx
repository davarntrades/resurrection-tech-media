import React from 'react';
import {Composition} from 'remotion';
import {VIDEO} from './branding/theme';
import {RuntimeGovernanceExplainer} from './videos/runtime-governance-explainer';
import {
  runtimeGovernanceScript,
  totalDuration,
} from './videos/runtime-governance-explainer/script';

/**
 * Registers every <Composition>. Add a new video by importing its wrapper and
 * dropping another <Composition> here.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RuntimeGovernanceExplainer"
        component={RuntimeGovernanceExplainer}
        durationInFrames={totalDuration(runtimeGovernanceScript)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
