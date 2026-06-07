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
import {COLORS, FONTS} from '../branding/theme';
import {useFontsReady} from '../branding/useFontsReady';
import {
  AmbientBackground,
  FilmGrain,
  MoodWash,
  Vignette,
} from '../components/short/Ambience';
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

/**
 * One 4s beat. Content cross-dissolves in/out over a continuous background and
 * rides a slow camera push, so the piece reads as one living scene. Internal
 * component motion is timed to fill the full window — no dead air.
 */
const Scene: React.FC<{scene: ShortScene; scale: number; biasY: number}> = ({
  scene,
  scale,
  biasY,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // cross-dissolve envelope
  const enter = spring({frame, fps, config: {damping: 200, mass: 0.6}});
  const outStart = durationInFrames - 16;
  const out = interpolate(frame, [outStart, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(enter, 1 - out);

  // slow cinematic push-in + gentle settle/exit drift
  const push = interpolate(frame, [0, durationInFrames], [1, 1.035]);
  const enterScale = interpolate(enter, [0, 1], [0.955, 1]);
  const yEnter = interpolate(enter, [0, 1], [40, 0]);
  const yExit = interpolate(out, [0, 1], [0, -26]);

  const isHook = scene.id === 'hook';
  const isClose = scene.id === 'close';
  const captionSize = isHook ? 108 : isClose ? 96 : 84;

  const flash =
    scene.id === 'block'
      ? interpolate(frame, [28, 35, 64], [0, 0.5, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  return (
    <AbsoluteFill style={{opacity}}>
      <MoodWash color={GLOW[scene.id]} opacity={opacity} />

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            transform: `translateY(${biasY + yEnter + yExit}px) scale(${push * enterScale * scale})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: isHook || isClose ? 44 : 66,
            width: 1080,
          }}
        >
          {isHook ? (
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 30,
                letterSpacing: '0.3em',
                color: COLORS.omega,
                padding: '10px 22px',
                borderRadius: 999,
                border: `1px solid ${COLORS.omega}55`,
                background: `${COLORS.omega}12`,
              }}
            >
              ⚠ REACTIVE SECURITY
            </div>
          ) : null}

          {!isHook && !isClose ? (
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Visual id={scene.id} />
            </div>
          ) : null}

          <KineticCaption
            tokens={scene.caption}
            startAt={isHook ? 4 : 10}
            stagger={isHook ? 4 : 5}
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
 * Feed-native vertical/square short. A continuous living backdrop with film
 * grain and vignette; eight 4s beats that cross-dissolve with a camera push;
 * kinetic captions throughout; an optional voiceover slot; platform-safe
 * chrome. `compact` tightens the layout for the 1:1 master.
 */
export const ShortTemplate: React.FC<{compact?: boolean}> = ({
  compact = false,
}) => {
  useFontsReady();

  const scale = compact ? 0.82 : 1;
  const biasY = compact ? 0 : -40;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AmbientBackground />

      <Series>
        {SHORT_SCENES.map((scene) => (
          <Series.Sequence key={scene.id} durationInFrames={scene.frames}>
            <Scene scene={scene} scale={scale} biasY={biasY} />
          </Series.Sequence>
        ))}
      </Series>

      <FilmGrain />
      <Vignette />
      <ShortChrome />

      {VOICEOVER ? <Audio src={staticFile(VOICEOVER)} /> : null}
    </AbsoluteFill>
  );
};
