import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONTS} from '../../branding/theme';
import {ConsoleCard} from './ConsoleCard';
import {TRANSFER} from '../../videos/runtime-governance-short/script';

/** Scene 3 — the agent assembles and arms a wire transfer. */
export const TransferCard: React.FC = () => {
  const frame = useCurrentFrame();

  const amount = Math.round(
    interpolate(frame, [8, 46], [0, TRANSFER.amount], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  const amountText = `$${amount.toLocaleString('en-US')}`;

  const arm = interpolate(frame, [46, 84], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <ConsoleCard
      title="ACTION · transfer"
      status="ARMING"
      statusColor={COLORS.omega}
      accent={COLORS.omega}
    >
      <div style={{fontFamily: FONTS.mono, fontSize: 26, color: COLORS.ink3}}>
        amount
      </div>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 800,
          fontSize: 116,
          letterSpacing: '-0.03em',
          color: COLORS.ink,
          lineHeight: 1.05,
          marginBottom: 18,
        }}
      >
        {amountText}
        <span style={{fontSize: 40, color: COLORS.ink3}}>.00</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontFamily: FONTS.mono,
          fontSize: 30,
          color: COLORS.ink2,
          marginBottom: 26,
        }}
      >
        <span style={{color: COLORS.ink3}}>to</span>
        <span style={{color: COLORS.ink}}>{TRANSFER.to}</span>
        {TRANSFER.flags.map((fl) => (
          <span
            key={fl}
            style={{
              fontSize: 21,
              letterSpacing: '0.1em',
              color: COLORS.omega,
              padding: '5px 14px',
              borderRadius: 8,
              border: `1px solid ${COLORS.omega}55`,
              background: `${COLORS.omega}14`,
            }}
          >
            {fl}
          </span>
        ))}
      </div>

      {/* arming bar */}
      <div
        style={{
          height: 14,
          borderRadius: 999,
          background: COLORS.panel,
          border: `1px solid ${COLORS.line2}`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${arm * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${COLORS.omegaDim}, ${COLORS.omega})`,
            boxShadow: `0 0 18px ${COLORS.omegaGlow}`,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: FONTS.mono,
          fontSize: 24,
          color: COLORS.omega,
          textAlign: 'right',
          opacity: arm,
        }}
      >
        ready to execute →
      </div>
    </ConsoleCard>
  );
};
