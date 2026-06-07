import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS, FONTS} from '../../branding/theme';

const Node: React.FC<{
  label: string;
  sub: string;
  color: string;
  struck?: boolean;
}> = ({label, sub, color, struck}) => (
  <div
    style={{
      width: 620,
      padding: '24px 30px',
      borderRadius: 20,
      background: `linear-gradient(180deg, ${COLORS.panel2}, ${COLORS.panel})`,
      border: `1px solid ${color}66`,
      boxShadow: `0 20px 60px rgba(0,0,0,0.45)`,
      position: 'relative',
    }}
  >
    <div
      style={{
        fontFamily: FONTS.mono,
        fontSize: 24,
        letterSpacing: '0.12em',
        color: COLORS.ink3,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: FONTS.mono,
        fontSize: 38,
        fontWeight: 600,
        color: struck ? COLORS.ink3 : COLORS.ink,
        textDecoration: struck ? 'line-through' : 'none',
        marginTop: 6,
      }}
    >
      {sub}
    </div>
  </div>
);

const Shield: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2.5L20 5.5V11C20 16 16.5 20 12 21.8C7.5 20 4 16 4 11V5.5Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
      fill={`${color}22`}
    />
    <path
      d="M8.5 12L11 14.5L15.5 9.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Scenes 5 & 6 — the agent action flows toward execution; the Runtime
 * Governance layer intercepts it. `phase` switches between evaluating
 * (intervene) and the BLOCK verdict.
 */
export const GovernanceFlow: React.FC<{phase: 'intervene' | 'block'}> = ({
  phase,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const slide = spring({frame, fps, config: {damping: 200, mass: 0.7}});
  const barX = interpolate(slide, [0, 1], [-900, 0]);

  const blocked = phase === 'block';
  const stamp = blocked
    ? spring({frame: frame - 4, fps, config: {damping: 9, mass: 0.6, stiffness: 180}})
    : 0;
  const stampScale = interpolate(stamp, [0, 1], [1.7, 1]);
  const evalSweep = interpolate(frame, [16, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        position: 'relative',
      }}
    >
      <Node label="AGENT ACTION" sub="transfer.execute()" color={COLORS.omega} />

      {/* connector */}
      <div
        style={{
          width: 4,
          height: 40,
          background: blocked ? COLORS.omega : COLORS.line2,
        }}
      />

      {/* governance intercept bar */}
      <div
        style={{
          width: 720,
          transform: `translateX(${barX}px)`,
          padding: '22px 30px',
          borderRadius: 20,
          background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentPurple})`,
          boxShadow: `0 0 50px ${COLORS.accentGlow}`,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Shield size={48} color={COLORS.ink} />
        <div style={{lineHeight: 1.1}}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: COLORS.ink,
            }}
          >
            RUNTIME GOVERNANCE
          </div>
          <div style={{fontFamily: FONTS.mono, fontSize: 24, color: '#eef'}}>
            {blocked ? 'policy RT-014 · violated' : 'evaluating · policy RT-014'}
          </div>
        </div>
        {!blocked ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${evalSweep * 100}%`,
              width: 80,
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
            }}
          />
        ) : null}
      </div>

      {/* connector */}
      <div
        style={{
          width: 4,
          height: 40,
          background: blocked ? COLORS.omega : COLORS.line2,
        }}
      />

      <Node
        label="EXECUTION"
        sub={blocked ? 'transfer.execute()' : 'pending…'}
        color={blocked ? COLORS.omega : COLORS.line2}
        struck={blocked}
      />

      {/* BLOCK stamp */}
      {blocked ? (
        <div
          style={{
            position: 'absolute',
            bottom: 6,
            transform: `rotate(-9deg) scale(${stampScale})`,
            opacity: interpolate(stamp, [0, 0.4], [0, 1], {
              extrapolateRight: 'clamp',
            }),
            padding: '14px 44px',
            border: `7px solid ${COLORS.omega}`,
            borderRadius: 18,
            background: 'rgba(229,72,77,0.14)',
            color: COLORS.omega,
            fontFamily: FONTS.sans,
            fontWeight: 800,
            fontSize: 104,
            letterSpacing: '0.04em',
            boxShadow: `0 0 60px ${COLORS.omegaGlow}`,
          }}
        >
          BLOCKED
        </div>
      ) : null}
    </div>
  );
};
