import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {Watermark} from '../components/Watermark';
import {TitleScene} from '../scenes/TitleScene';
import {DriftScene} from '../scenes/DriftScene';
import {SolutionScene} from '../scenes/SolutionScene';
import {PillarsScene} from '../scenes/PillarsScene';
import {OutroScene} from '../scenes/OutroScene';
import {COLORS} from '../branding/theme';
import {useFontsReady} from '../branding/useFontsReady';
import type {ExplainerScript} from '../videos/runtime-governance-explainer/script';

/**
 * The reusable explainer template. It composes the five scenes in sequence with
 * <Series> and overlays a persistent watermark. All copy + timing comes from a
 * data-driven `script`, so a new video is just a new script object.
 */
export const ExplainerTemplate: React.FC<{script: ExplainerScript}> = ({
  script,
}) => {
  useFontsReady();

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Series>
        <Series.Sequence durationInFrames={script.scenes.title}>
          <TitleScene tagline={script.title.tagline} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={script.scenes.drift}>
          <DriftScene lines={script.drift.lines} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={script.scenes.solution}>
          <SolutionScene lines={script.solution.lines} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={script.scenes.pillars}>
          <PillarsScene
            heading={script.pillars.heading}
            pillars={script.pillars.items}
          />
        </Series.Sequence>
        <Series.Sequence durationInFrames={script.scenes.outro}>
          <OutroScene
            brand={script.outro.brand}
            cta={script.outro.cta}
            url={script.outro.url}
          />
        </Series.Sequence>
      </Series>

      <Watermark />
    </AbsoluteFill>
  );
};
