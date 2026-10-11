import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {FONTS} from '../../branding/theme';
import type {Rect} from './layouts';
import {
  AGENT_COLORS,
  PAPER,
  VERDICT_COLOR,
  type Agent,
  type Verdict,
} from './paper';
import {KernelMark} from './KernelMark';
import {Robot} from './Robot';
import {progress, rise} from './motion';

export const place = (r: Rect): React.CSSProperties => ({
  position: 'absolute',
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h,
});

export const cardSurface: React.CSSProperties = {
  background: PAPER.card,
  borderRadius: 26,
  border: `1px solid ${PAPER.cardBorder}`,
  boxShadow: '0 1px 2px rgba(40,30,20,0.04), 0 16px 38px rgba(40,30,20,0.08)',
  boxSizing: 'border-box',
};

export const heading = (size: number): React.CSSProperties => ({
  fontFamily: FONTS.sans,
  fontWeight: 760,
  fontSize: size,
  color: PAPER.ink,
  textTransform: 'uppercase',
  letterSpacing: -0.3,
  lineHeight: 1.05,
  whiteSpace: 'nowrap',
});

/**
 * Largest heading size (≤ max) that keeps `text` inside `width`. Geist's bold
 * caps average ~0.68em; this is an estimate, so it errs on the small side.
 */
export const fitHeading = (text: string, width: number, max: number): number =>
  Math.min(max, width / (text.length * 0.68));

export const body = (size: number): React.CSSProperties => ({
  fontFamily: FONTS.sans,
  fontWeight: 400,
  fontSize: size,
  color: PAPER.ink2,
  letterSpacing: 0.2,
});

export const DocIcon: React.FC<{color: string; size?: number}> = ({
  color,
  size = 22,
}) => (
  <svg width={size * 0.82} height={size} viewBox="0 0 18 22">
    <rect
      x="1.1"
      y="1.1"
      width="15.8"
      height="19.8"
      rx="3"
      fill="none"
      stroke={color}
      strokeWidth="2"
    />
    <line x1="5" y1="7.5" x2="13" y2="7.5" stroke={color} strokeWidth="1.8" />
    <line x1="5" y1="11.5" x2="13" y2="11.5" stroke={color} strokeWidth="1.8" />
    <line
      x1="5"
      y1="15.5"
      x2="10.5"
      y2="15.5"
      stroke={color}
      strokeWidth="1.8"
    />
  </svg>
);

const PersonIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <circle
      cx="16"
      cy="10.5"
      r="6.5"
      fill="none"
      stroke="#d9364f"
      strokeWidth="2.6"
    />
    <path
      d="M4 30 C4 21 10 18 16 18 C22 18 28 21 28 30"
      fill="none"
      stroke="#d9364f"
      strokeWidth="2.6"
    />
  </svg>
);

/** A plain titled card: shared context, rules, tools, review. */
export const InfoCard: React.FC<{
  rect: Rect;
  appearAt: number;
  title: string;
  lines: string[];
  icon?: 'person';
  accent?: string;
  scale?: number;
}> = ({rect, appearAt, title, lines, icon, accent, scale = 1}) => {
  const frame = useCurrentFrame();
  const s = scale;
  const textWidth =
    rect.w - (28 + (accent ? 34 : 28)) * s - (icon ? 46 * s : 0);
  return (
    <div style={{...place(rect), ...rise(progress(frame, appearAt))}}>
      <div
        style={{
          ...cardSurface,
          width: '100%',
          height: '100%',
          padding: `${22 * s}px ${28 * s}px ${22 * s}px ${(accent ? 34 : 28) * s}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {accent ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 16,
              bottom: 16,
              width: 6,
              borderRadius: 3,
              background: accent,
            }}
          />
        ) : null}
        <div style={{display: 'flex', gap: 12 * s, alignItems: 'flex-start'}}>
          {icon === 'person' ? <PersonIcon size={34 * s} /> : null}
          <div>
            <div style={heading(fitHeading(title, textWidth, 26 * s))}>
              {title}
            </div>
            {lines.map((l) => (
              <div
                key={l}
                style={{
                  ...body(21 * s),
                  marginTop: 10 * s,
                  whiteSpace: 'nowrap',
                }}
              >
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/** The authority: mark, name, and live verdict counters. Border flashes per decision. */
export const KernelCard: React.FC<{
  rect: Rect;
  appearAt: number;
  title: string;
  sub: string;
  counts: Record<Verdict, number>;
  last: {verdict: Verdict; age: number} | null;
}> = ({rect, appearAt, title, sub, counts, last}) => {
  const frame = useCurrentFrame();
  const flash = last
    ? interpolate(last.age, [0, 16], [1, 0], {extrapolateRight: 'clamp'})
    : 0;
  const settled = progress(frame, appearAt + 30, 30);
  const ring = last ? VERDICT_COLOR[last.verdict] : VERDICT_COLOR.ALLOW;

  return (
    <div style={{...place(rect), ...rise(progress(frame, appearAt))}}>
      <div
        style={{
          ...cardSurface,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '0 30px',
          border: `3px solid ${ring}${Math.round(
            (0.25 * settled + 0.6 * flash) * 255,
          )
            .toString(16)
            .padStart(2, '0')}`,
          boxShadow: `0 16px 38px rgba(40,30,20,0.08), 0 0 ${36 * flash}px ${ring}55`,
        }}
      >
        <KernelMark size={112} />
        <div>
          <div style={heading(47)}>{title}</div>
          <div style={{...body(23), marginTop: 8}}>{sub}</div>
          <div style={{display: 'flex', gap: 30, marginTop: 16}}>
            {(Object.keys(counts) as Verdict[]).map((v) => {
              const pop = last && last.verdict === v ? 1 + 0.12 * flash : 1;
              return (
                <div
                  key={v}
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 17,
                    letterSpacing: 3,
                    color: VERDICT_COLOR[v],
                    transform: `scale(${pop})`,
                    transformOrigin: 'left center',
                  }}
                >
                  {v} {counts[v]}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/** One agent: robot, job, three tools with progress, and its verdict. */
export const AgentCard: React.FC<{
  rect: Rect;
  index: number;
  agent: Agent;
  appearAt: number;
  workStart: number;
  /** Loop mode: verdict always shown, tools re-run on a staggered 12s cycle. */
  loop?: boolean;
}> = ({rect, index, agent, appearAt, workStart, loop = false}) => {
  const frame = useCurrentFrame();
  const s = Math.min(1, rect.w / 400);
  const color = AGENT_COLORS[index % AGENT_COLORS.length];
  const done = loop || frame >= agent.doneAt;
  const cycle = ((frame + index * 72) % 360) / 360;
  const reached = loop
    ? agent.reach * Math.min(1, cycle / 0.75)
    : interpolate(frame, [workStart, agent.doneAt], [0, agent.reach], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  const stamp = loop ? 1 : progress(frame, agent.doneAt, 14);
  const vColor = VERDICT_COLOR[agent.verdict];
  // a held / blocked agent's next tool pulses in the verdict colour
  const stuckPulse =
    done && agent.verdict !== 'ALLOW' && reached >= agent.reach
      ? 0.55 + 0.45 * Math.sin((frame * 2 * Math.PI) / 30)
      : 0;
  const nameSize = fitHeading(agent.name, rect.w - 60 * s - 124 * s, 39 * s);

  return (
    <div style={{...place(rect), ...rise(progress(frame, appearAt), 34)}}>
      <div
        style={{
          ...cardSurface,
          width: '100%',
          height: '100%',
          position: 'relative',
          padding: `${28 * s}px ${30 * s}px ${24 * s}px ${30 * s}px`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 18,
            bottom: 18,
            width: 6,
            borderRadius: 3,
            background: color,
          }}
        />
        <div style={{position: 'absolute', right: 12 * s, top: -14 * s}}>
          <Robot
            color={color}
            size={112 * s}
            phase={index * 1.3}
            face={agent.face}
          />
        </div>

        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 16 * s,
            letterSpacing: 2,
            color: PAPER.ink2,
          }}
        >
          {String(index + 1).padStart(2, '0')} / AGENT
        </div>
        <div
          style={{
            ...heading(nameSize),
            marginTop: 14 * s,
            height: 39 * s * 1.05,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          {agent.name}
        </div>
        <div style={{...body(21 * s), marginTop: 10 * s}}>{agent.job}</div>

        <div style={{display: 'flex', gap: 9 * s, marginTop: 22 * s}}>
          {agent.tools.map((tool, i) => {
            const fill = Math.max(0, Math.min(1, reached - i));
            const stuck = i === Math.floor(agent.reach) && stuckPulse > 0;
            return (
              <div key={tool} style={{flex: 1}}>
                <div
                  style={{
                    height: 44 * s,
                    borderRadius: 12 * s,
                    background: PAPER.chip,
                    border: `1px solid ${stuck ? vColor : PAPER.chipBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONTS.sans,
                    fontWeight: 600,
                    fontSize: 19 * s,
                    color: PAPER.ink,
                  }}
                >
                  {tool}
                </div>
                <div
                  style={{
                    height: 4,
                    margin: `${10 * s}px ${8 * s}px 0`,
                    borderRadius: 2,
                    background: PAPER.track,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${(stuck ? 1 : fill) * 100}%`,
                      background: stuck ? vColor : color,
                      opacity: stuck ? stuckPulse : 1,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{flex: 1, minHeight: 14 * s}} />
        <div
          style={{height: 1, background: PAPER.rule, marginBottom: 18 * s}}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10 * s,
            fontFamily: FONTS.sans,
            fontWeight: 700,
            fontSize: 20 * s,
            letterSpacing: 0.4,
            height: 26 * s,
          }}
        >
          <DocIcon color={done ? vColor : PAPER.ink3} size={22 * s} />
          {done ? (
            <span
              style={{
                display: 'inline-flex',
                gap: 8 * s,
                opacity: stamp,
                transform: `scale(${1.25 - 0.25 * stamp})`,
                transformOrigin: 'left center',
              }}
            >
              <span style={{color: vColor}}>{agent.verdict}</span>
              <span style={{color: PAPER.ink}}>
                · {agent.result.toUpperCase()}
              </span>
            </span>
          ) : (
            <span
              style={{
                color: PAPER.ink3,
                fontFamily: FONTS.mono,
                fontWeight: 500,
                letterSpacing: 2,
              }}
            >
              VERIFYING{'.'.repeat(1 + (Math.floor(frame / 8) % 3))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/** Small rounded label sitting on the lines under the kernel. */
export const LabelPill: React.FC<{
  cx: number;
  y: number;
  text: string;
  appearAt: number;
}> = ({cx, y, text, appearAt}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: cx,
        top: y,
        transform: 'translateX(-50%)',
        opacity: progress(frame, appearAt),
        background: 'rgba(236,233,228,0.92)',
        borderRadius: 12,
        padding: '8px 20px',
        fontFamily: FONTS.sans,
        fontWeight: 700,
        fontSize: 18,
        letterSpacing: 2,
        color: '#2a2a2a',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};
