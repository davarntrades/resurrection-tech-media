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
import {EveryAgentOneAuthority} from './videos/every-agent-one-authority';
import {DrugDiscovery} from './videos/drug-discovery';
import {MaterialsDiscovery} from './videos/materials-discovery';
import {LocalGlobalSafety} from './videos/local-global-safety';
import {
  DURATION as BOARD_DURATION,
  FPS as BOARD_FPS,
  type BoardFormat,
  type BoardMode,
} from './components/authority/paper';

/** Board-style videos — each registers {16x9, 9x16} × {map, Loop}. */
const BOARDS = [
  {id: 'EveryAgentOneAuthority', component: EveryAgentOneAuthority},
  {id: 'DrugDiscovery', component: DrugDiscovery},
  {id: 'MaterialsDiscovery', component: MaterialsDiscovery},
  {id: 'LocalGlobalSafety', component: LocalGlobalSafety},
];
const BOARD_MASTERS: {
  suffix: string;
  format: BoardFormat;
  mode: BoardMode;
  width: number;
  height: number;
}[] = [
  {suffix: '16x9', format: 'landscape', mode: 'map', width: 1920, height: 1080},
  {suffix: '9x16', format: 'portrait', mode: 'map', width: 1080, height: 1920},
  {
    suffix: 'Loop-16x9',
    format: 'landscape',
    mode: 'loop',
    width: 1920,
    height: 1080,
  },
  {
    suffix: 'Loop-9x16',
    format: 'portrait',
    mode: 'loop',
    width: 1080,
    height: 1920,
  },
];

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

      {/* Authority boards — map (15s, CTA) and seamless loop (12s) masters */}
      {BOARDS.flatMap(({id, component}) =>
        BOARD_MASTERS.map((m) => (
          <Composition
            key={`${id}-${m.suffix}`}
            id={`${id}-${m.suffix}`}
            component={component}
            durationInFrames={BOARD_DURATION[m.mode]}
            fps={BOARD_FPS}
            width={m.width}
            height={m.height}
            defaultProps={{format: m.format, mode: m.mode}}
          />
        )),
      )}
    </>
  );
};
