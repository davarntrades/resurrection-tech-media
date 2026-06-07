import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONTS} from '../../branding/theme';

/**
 * Enterprise "console" card chrome shared by the agent, transfer and audit
 * scenes: a titled header with a live status pill over a dark panel body.
 */
export const ConsoleCard: React.FC<{
  title: string;
  status?: string;
  statusColor?: string;
  accent?: string;
  width?: number;
  children: React.ReactNode;
}> = ({
  title,
  status,
  statusColor = COLORS.accentBright,
  accent = COLORS.accent,
  width = 940,
  children,
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + 0.4 * Math.sin(frame / 5);

  return (
    <div
      style={{
        width,
        borderRadius: 28,
        background: `linear-gradient(180deg, ${COLORS.panel2}, ${COLORS.panel})`,
        border: `1px solid ${COLORS.line2}`,
        boxShadow: '0 40px 120px rgba(0,0,0,0.55)',
        overflow: 'hidden',
      }}
    >
      {/* header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '26px 34px',
          borderBottom: `1px solid ${COLORS.line}`,
          background: COLORS.bg1,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: 999,
            background: accent,
            opacity: pulse,
            boxShadow: `0 0 ${18 * pulse}px ${accent}`,
          }}
        />
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: '0.14em',
            color: COLORS.ink,
          }}
        >
          {title}
        </span>
        <span style={{flex: 1}} />
        {status ? (
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 24,
              letterSpacing: '0.12em',
              color: statusColor,
              padding: '8px 18px',
              borderRadius: 999,
              border: `1px solid ${statusColor}55`,
              background: `${statusColor}14`,
              opacity: interpolate(pulse, [0.2, 1], [0.7, 1]),
            }}
          >
            {status}
          </span>
        ) : null}
      </div>

      {/* body */}
      <div style={{padding: '30px 34px'}}>{children}</div>
    </div>
  );
};
