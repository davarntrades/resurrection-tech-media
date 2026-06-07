import React from 'react';
import {Composition} from 'remotion';
import {VIDEO} from './branding/theme';
import {RuntimeGovernanceExplainer} from './videos/runtime-governance-explainer';
import {
  runtimeGovernanceScript,
  totalDuration,
} from './videos/runtime-governance-explainer/script';
import {RuntimeGovernanceShort} from './videos/runtime-governance-short';
import {
  SHORT_SCENES,
  totalShortDuration,
} from './videos/runtime-governance-short/script';

/**
 * Registers every <Composition>. Add a new video by importing its wrapper and
 * dropping another <Composition> here.
 */
export const RemotionRoot: React.FC = () => {
  const shortFrames = totalShortDuration(SHORT_SCENES);

  return (
    <>
      {/* 16:9 long-form explainer */}
      <Composition
        id="RuntimeGovernanceExplainer"
        component={RuntimeGovernanceExplainer}
        durationInFrames={totalDuration(runtimeGovernanceScript)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      {/* Feed-native shorts — vertical (TikTok / Reels / Shorts) and square (LinkedIn / IG) */}
      <Composition
        id="RuntimeGovernanceShort-9x16"
        component={RuntimeGovernanceShort}
        durationInFrames={shortFrames}
        fps={VIDEO.fps}
        width={1080}
        height={1920}
        defaultProps={{compact: false}}
      />
      <Composition
        id="RuntimeGovernanceShort-1x1"
        component={RuntimeGovernanceShort}
        durationInFrames={shortFrames}
        fps={VIDEO.fps}
        width={1080}
        height={1080}
        defaultProps={{compact: true}}
      />
    </>
  );
};
