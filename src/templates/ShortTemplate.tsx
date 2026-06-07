import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Background} from '../components/Background';
import {COLORS, FONTS} from '../branding/theme';
import {useFontsReady} from '../branding/useFontsReady';
import {KineticCaption} from '../components/short/KineticCaption';
import {ShortChrome} from '../components/short/ShortChrome';
import {AgentConsole} from '../components/short/AgentConsole';
import {TransferCard} from '../components/short/TransferCard';
import {ReachabilityInset} from '../components/short/ReachabilityInset';
import {GovernanceFlow} from '../components/short/GovernanceFlow';
import {AuditLog} from '../components/short/AuditLog';
import {CloseLockup} from '../components/short/CloseLockup';
import {
  SHORT_SCENES,
  VOICEOVER,
  type ShortScene,
  type ShortSceneId,
} from '../videos/runtime-governance-short/script';

const GLOW: Record<ShortSceneId, string> = {
  hook: COLORS.omegaGlow,
  reads: COLORS.accentGlow,
  prepares: COLORS.omegaGlow,
  reachable: COLORS.omegaGlow,
  intervene: COLORS.accentGlow,
  block: COLORS.omegaGlow,
  audit: COLORS.okGlow,
  close: COLORS.accentGlow,
};

const Visual: React.FC<{id: ShortSceneId}> = ({id}) => {
  switch (id) {
    case 'reads':
      return <AgentConsole />;
    case 'prepares':
      return <TransferCard />;
    case 'reachable':
      return <ReachabilityInset />;
    case 'intervene':
      return <GovernanceFlow phase="intervene" />;
    case 'block':
      return <GovernanceFlow phase="block" />;
    case 'audit':
      return <AuditLog />;
    default:
      return null;
  }
};

/** One scene: background mood, a hero visual, a kinetic caption, fast entrance. */
const Scene: React.FC<{scene: ShortScene; scale: number; biasY: number}> = ({
  scene,
  scale,
  biasY,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const entrance = spring({frame, fps, config: {damping: 200, mass: 0.5}});
  const eOpacity = interpolate(entrance, [0, 1], [0, 1]);
  const eY = interpolate(entrance, [0, 1], [40, 0]);

  const isHook = scene.id === 'hook';
  const isClose = scene.id === 'close';
  const captionSize = isHook ? 108 : isClose ? 96 : 84;

  // impact flash on the BLOCK beat
  const flash =
    scene.id === 'block'
      ? interpolate(frame, [2, 9, 34], [0, 0.5, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  return (
    <AbsoluteFill>
      <Background glow={GLOW[scene.id]} />

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            transform: `translateY(${biasY}px) scale(${scale})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isHook || isClose ? 40 : 64,
            width: 1080,
          }}
        >
          {isHook ? (
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 30,
                letterSpacing: '0.28em',
                color: COLORS.omega,
                opacity: eOpacity,
              }}
            >
              ⚠ REACTIVE SECURITY
            </div>
          ) : null}

          {!isHook && !isClose ? (
            <div
              style={{
                opacity: eOpacity,
                transform: `translateY(${eY}px)`,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Visual id={scene.id} />
            </div>
          ) : null}

          <KineticCaption
            tokens={scene.caption}
            startAt={isHook ? 2 : 8}
            stagger={isHook ? 3 : 4}
            fontSize={captionSize}
          />

          {isClose ? <CloseLockup /> : null}
        </div>
      </AbsoluteFill>

      {flash > 0 ? (
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.omega,
            opacity: flash,
            mixBlendMode: 'screen',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * Feed-native vertical/square short. Fast cuts (one Series.Sequence per scene),
 * constant motion, kinetic captions throughout, an optional voiceover slot, and
 * platform-safe chrome. `compact` tightens the layout for the 1:1 master.
 */
export const ShortTemplate: React.FC<{compact?: boolean}> = ({
  compact = false,
}) => {
  useFontsReady();

  const scale = compact ? 0.82 : 1;
  const biasY = compact ? 0 : -40;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Series>
        {SHORT_SCENES.map((scene) => (
          <Series.Sequence key={scene.id} durationInFrames={scene.frames}>
            <Scene scene={scene} scale={scale} biasY={biasY} />
          </Series.Sequence>
        ))}
      </Series>

      <ShortChrome />

      {VOICEOVER ? <Audio src={staticFile(VOICEOVER)} /> : null}
    </AbsoluteFill>
  );
};
