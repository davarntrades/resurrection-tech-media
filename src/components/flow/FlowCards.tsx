import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {FONTS} from '../../branding/theme';
import {
  body,
  cardSurface,
  DocIcon,
  fitHeading,
  heading,
  place,
} from '../authority/Cards';
import {KernelMark} from '../authority/KernelMark';
import type {Rect} from '../authority/layouts';
import {progress, rise} from '../authority/motion';
import {PAPER, VERDICT_COLOR, type Verdict} from '../authority/paper';
import {Robot} from '../authority/Robot';
import {Mark} from '../safety/GovernanceCard';
import {BEAT, type FlowAction} from './timeline';

const PROPOSE_BLUE = '#2f6fe4';

const AccentBar: React.FC<{color: string}> = ({color}) => (
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
);

const Kicker: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      fontFamily: FONTS.mono,
      fontSize: 16,
      letterSpacing: 2,
      color: PAPER.ink2,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

/**
 * The autonomous AI proposer, drawn as a board agent card: robot, job, one
 * chip per candidate action (bar fills while it is proposed, then takes the
 * verdict colour) and a status row naming the current candidate.
 */
export const ProposerAgentCard: React.FC<{
  rect: Rect;
  appearAt: number;
  kicker: string;
  name: string;
  job: string;
  actions: FlowAction[];
  /** Frames since each action was proposed (negative = not yet). */
  since: number[];
}> = ({rect, appearAt, kicker, name, job, actions, since}) => {
  const frame = useCurrentFrame();
  let current = -1;
  since.forEach((s, k) => {
    if (s >= 0) current = k;
  });
  const cur = current >= 0 ? actions[current] : null;
  const curDecided = current >= 0 && since[current] >= BEAT.decide;
  const stamp = current >= 0 ? progress(since[current], BEAT.decide, 12) : 0;

  return (
    <div style={{...place(rect), ...rise(progress(frame, appearAt), 34)}}>
      <div
        style={{
          ...cardSurface,
          width: '100%',
          height: '100%',
          position: 'relative',
          padding: '26px 30px 22px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AccentBar color={PROPOSE_BLUE} />
        <div style={{position: 'absolute', right: 18, top: -14}}>
          <Robot color={PROPOSE_BLUE} size={112} phase={0.4} />
        </div>
        <Kicker>{kicker}</Kicker>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 18,
            marginTop: 12,
          }}
        >
          <div style={heading(39)}>{name}</div>
          <div style={body(21)}>{job}</div>
        </div>

        <div style={{display: 'flex', gap: 9, marginTop: 22}}>
          {actions.map((a, k) => {
            const s = since[k];
            const proposing = s >= 0 && s < BEAT.decide;
            const decided = s >= BEAT.decide;
            const fill = s < 0 ? 0 : Math.min(1, s / BEAT.arrive);
            const color = decided ? VERDICT_COLOR[a.verdict] : PROPOSE_BLUE;
            return (
              <div key={a.chip} style={{flex: 1, minWidth: 0}}>
                <div
                  style={{
                    height: 44,
                    borderRadius: 12,
                    background: proposing ? '#eef3fd' : PAPER.chip,
                    border: `1px solid ${proposing ? PROPOSE_BLUE : PAPER.chipBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONTS.sans,
                    fontWeight: 600,
                    fontSize: 17,
                    color: s < 0 ? PAPER.ink2 : PAPER.ink,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {a.chip}
                </div>
                <div
                  style={{
                    height: 4,
                    margin: '10px 8px 0',
                    borderRadius: 2,
                    background: PAPER.track,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${fill * 100}%`,
                      background: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{flex: 1, minHeight: 12}} />
        <div style={{height: 1, background: PAPER.rule, marginBottom: 16}} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: FONTS.sans,
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: 0.4,
            height: 26,
            whiteSpace: 'nowrap',
          }}
        >
          <DocIcon
            color={
              cur
                ? curDecided
                  ? VERDICT_COLOR[cur.verdict]
                  : PROPOSE_BLUE
                : PAPER.ink3
            }
            size={22}
          />
          {cur ? (
            curDecided ? (
              <span
                style={{
                  display: 'inline-flex',
                  gap: 8,
                  opacity: stamp,
                  transform: `scale(${1.2 - 0.2 * stamp})`,
                  transformOrigin: 'left center',
                }}
              >
                <span style={{color: VERDICT_COLOR[cur.verdict]}}>
                  {cur.verdict}
                </span>
                <span style={{color: PAPER.ink}}>·</span>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontWeight: 500,
                    fontSize: 18,
                    color: PAPER.ink,
                  }}
                >
                  {cur.action}
                </span>
              </span>
            ) : (
              <span style={{display: 'inline-flex', gap: 8}}>
                <span style={{color: PROPOSE_BLUE}}>CANDIDATE ACTION</span>
                <span style={{color: PAPER.ink}}>·</span>
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontWeight: 500,
                    fontSize: 18,
                    color: PAPER.ink,
                  }}
                >
                  {cur.action}
                </span>
              </span>
            )
          ) : (
            <span
              style={{
                color: PAPER.ink3,
                fontFamily: FONTS.mono,
                fontWeight: 500,
                letterSpacing: 2,
              }}
            >
              GENERATING{'.'.repeat(1 + (Math.floor(frame / 8) % 3))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const subCard: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  background: PAPER.chip,
  border: `1px solid ${PAPER.chipBorder}`,
  borderRadius: 16,
  padding: '16px 20px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: 6,
};

const Status: React.FC<{
  kind: 'ok' | 'warn' | 'fail' | null;
  text: string;
  shown: number;
}> = ({kind, text, shown}) => (
  <div
    style={{
      marginTop: 6,
      height: 28,
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      fontFamily: kind ? FONTS.sans : FONTS.mono,
      fontWeight: kind ? 700 : 500,
      fontSize: kind ? 18 : 14,
      letterSpacing: kind ? 0.2 : 2,
      color: kind ? PAPER.ink : PAPER.ink3,
      opacity: kind ? shown : 1,
      transform: kind ? `scale(${1.1 - 0.1 * shown})` : undefined,
      whiteSpace: 'nowrap',
    }}
  >
    {kind ? <Mark kind={kind} size={22} /> : null}
    {text}
  </div>
);

/**
 * Morrison Runtime Governance as the board's kernel card: mark, name, live
 * tally and a border that flashes each verdict — plus the two admissibility
 * checks, the three verdict tiles and the evidence line.
 */
export const AuthorityCard: React.FC<{
  rect: Rect;
  appearAt: number;
  title: string;
  sub: string;
  local: {title: string; question: string};
  global: {title: string; question: string};
  evidence: string;
  counts: Record<Verdict, number>;
  last: {verdict: Verdict; age: number} | null;
  /** The action under evaluation and frames since it was proposed. */
  action: FlowAction | null;
  p: number;
  /** Latest evidence record, if any. */
  record: {id: string; hash: string; age: number} | null;
}> = ({
  rect,
  appearAt,
  title,
  sub,
  local,
  global,
  evidence,
  counts,
  last,
  action,
  p,
  record,
}) => {
  const frame = useCurrentFrame();
  const flash = last
    ? interpolate(last.age, [0, 16], [1, 0], {extrapolateRight: 'clamp'})
    : 0;
  const settled = progress(frame, appearAt + 30, 30);
  const ring = last ? VERDICT_COLOR[last.verdict] : VERDICT_COLOR.ALLOW;
  const alpha = Math.round((0.25 * settled + 0.6 * flash) * 255)
    .toString(16)
    .padStart(2, '0');
  const arrived = action !== null && p >= BEAT.arrive;
  const localKind = action ? (action.local.ok ? 'ok' : 'fail') : null;
  const globalKind = action
    ? action.global.state === 'clear'
      ? 'ok'
      : action.global.state === 'near'
        ? 'warn'
        : 'fail'
    : null;

  return (
    <div style={{...place(rect), ...rise(progress(frame, appearAt))}}>
      <div
        style={{
          ...cardSurface,
          width: '100%',
          height: '100%',
          padding: '24px 30px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          border: `3px solid ${ring}${alpha}`,
          boxShadow: `0 16px 38px rgba(40,30,20,0.08), 0 0 ${36 * flash}px ${ring}55`,
        }}
      >
        {/* header — same as the board kernel */}
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <KernelMark size={108} />
          <div style={{minWidth: 0}}>
            <div style={heading(fitHeading(title, rect.w - 60 - 130, 44))}>
              {title}
            </div>
            <div style={{...body(22), marginTop: 6}}>{sub}</div>
            <div style={{display: 'flex', gap: 30, marginTop: 12}}>
              {(Object.keys(counts) as Verdict[]).map((v) => (
                <div
                  key={v}
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 17,
                    letterSpacing: 3,
                    color: VERDICT_COLOR[v],
                    transform: `scale(${last && last.verdict === v ? 1 + 0.12 * flash : 1})`,
                    transformOrigin: 'left center',
                  }}
                >
                  {v} {counts[v]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* local + global admissibility */}
        <div style={{display: 'flex', gap: 16}}>
          <div style={subCard}>
            <div style={heading(24)}>{local.title}</div>
            <div style={{...body(18), lineHeight: 1.3}}>{local.question}</div>
            {action && arrived ? (
              <Status
                kind={p >= BEAT.local ? localKind : null}
                text={p >= BEAT.local ? action.local.why : 'CHECKING…'}
                shown={progress(p, BEAT.local, 8)}
              />
            ) : (
              <Status kind={null} text="AWAITING PROPOSAL" shown={1} />
            )}
          </div>
          <div style={subCard}>
            <div style={heading(24)}>{global.title}</div>
            <div style={{...body(18), lineHeight: 1.3}}>{global.question}</div>
            {action && arrived ? (
              <Status
                kind={p >= BEAT.global ? globalKind : null}
                text={p >= BEAT.global ? action.global.why : 'CHECKING…'}
                shown={progress(p, BEAT.global, 8)}
              />
            ) : (
              <Status kind={null} text="AWAITING PROPOSAL" shown={1} />
            )}
          </div>
        </div>

        {/* verdict tiles */}
        <div style={{display: 'flex', gap: 14}}>
          {(['ALLOW', 'BLOCK', 'ESCALATE'] as Verdict[]).map((v) => {
            const lit = last && last.verdict === v ? 0.35 + 0.65 * flash : 0;
            const color = VERDICT_COLOR[v];
            return (
              <div key={v} style={{flex: 1}}>
                <div
                  style={{
                    height: 58,
                    borderRadius: 14,
                    background: lit
                      ? `${color}${Math.round(lit * 0.14 * 255)
                          .toString(16)
                          .padStart(2, '0')}`
                      : PAPER.chip,
                    border: `${lit ? 2 : 1}px solid ${lit ? color : PAPER.chipBorder}`,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONTS.sans,
                    fontWeight: 760,
                    fontSize: 24,
                    letterSpacing: 0.8,
                    color,
                    transform: `scale(${1 + 0.05 * (last && last.verdict === v ? flash : 0)})`,
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    height: 4,
                    margin: '10px 10px 0',
                    borderRadius: 2,
                    background: PAPER.track,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${(lit ? 1 : 0) * 100}%`,
                      background: color,
                      opacity: lit,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* evidence */}
        <div style={{height: 1, background: PAPER.rule}} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            height: 28,
            whiteSpace: 'nowrap',
          }}
        >
          <DocIcon color={record ? '#3a3a3a' : PAPER.ink3} size={22} />
          <span style={{...body(21), color: PAPER.ink}}>{evidence}</span>
          {record ? (
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 16,
                color: PAPER.ink2,
                ...rise(progress(record.age, 0, 10), 8),
              }}
            >
              · {record.id} · sha:{record.hash}…{' '}
              <span style={{color: VERDICT_COLOR.ALLOW}}>✓ signed</span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

/** The mediated execution boundary and the protected resources behind it. */
export const BoundaryCard: React.FC<{
  rect: Rect;
  appearAt: number;
  title: string;
  sub: string;
  resources: string[];
  /** Per resource: 0–1 flash when an authorised action reaches it. */
  hits: number[];
}> = ({rect, appearAt, title, sub, resources, hits}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{...place(rect), ...rise(progress(frame, appearAt))}}>
      <div
        style={{
          ...cardSurface,
          width: '100%',
          height: '100%',
          position: 'relative',
          padding: '24px 30px 22px 36px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AccentBar color={VERDICT_COLOR.ALLOW} />
        <div style={heading(fitHeading(title, rect.w - 70, 30))}>{title}</div>
        <div style={{...body(21), marginTop: 8}}>{sub}</div>
        <div style={{display: 'flex', gap: 12, marginTop: 'auto'}}>
          {resources.map((r, i) => {
            const h = hits[i] ?? 0;
            return (
              <div
                key={r}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 12,
                  background: h ? `rgba(31,157,74,${0.1 * h})` : PAPER.chip,
                  border: `${h > 0.05 ? 2 : 1}px solid ${h > 0.05 ? VERDICT_COLOR.ALLOW : PAPER.chipBorder}`,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  fontFamily: FONTS.sans,
                  fontWeight: 600,
                  fontSize: 18,
                  color: PAPER.ink,
                }}
              >
                <svg width="16" height="18" viewBox="0 0 16 18">
                  <rect
                    x="1.5"
                    y="7.5"
                    width="13"
                    height="9.5"
                    rx="2.2"
                    fill="none"
                    stroke={h > 0.05 ? VERDICT_COLOR.ALLOW : PAPER.ink2}
                    strokeWidth="1.8"
                  />
                  <path
                    d={
                      h > 0.05
                        ? 'M4.5 7.5 V5 a3.5 3.5 0 0 1 7 0'
                        : 'M4.5 7.5 V5 a3.5 3.5 0 0 1 7 0 V7.5'
                    }
                    fill="none"
                    stroke={h > 0.05 ? VERDICT_COLOR.ALLOW : PAPER.ink2}
                    strokeWidth="1.8"
                  />
                </svg>
                {r}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
