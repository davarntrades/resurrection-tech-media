import React, {useId} from 'react';
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
import {progress, rise, svgId} from '../authority/motion';
import {PAPER, VERDICT_COLOR, type Verdict} from '../authority/paper';
import {
  PHASE,
  type Executed,
  type GlobalState,
  type LocalCheck,
  type SafetyStep,
} from './timeline';

const STATE_COLOR: Record<GlobalState, string> = {
  clear: VERDICT_COLOR.ALLOW,
  near: VERDICT_COLOR.ESCALATE,
  reach: VERDICT_COLOR.BLOCK,
};

const CHECKS: {key: LocalCheck; label: string}[] = [
  {key: 'tool', label: 'tool allowed'},
  {key: 'scope', label: 'in scope'},
  {key: 'limits', label: 'within limits'},
];

export const Mark: React.FC<{kind: 'ok' | 'warn' | 'fail'; size: number}> = ({
  kind,
  size,
}) => {
  const color =
    kind === 'ok'
      ? VERDICT_COLOR.ALLOW
      : kind === 'warn'
        ? VERDICT_COLOR.ESCALATE
        : VERDICT_COLOR.BLOCK;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
      <circle cx="12" cy="12" r="11" fill={color} />
      {kind === 'ok' ? (
        <path
          d="M7 12.5 L10.5 16 L17 8.5"
          fill="none"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      ) : kind === 'warn' ? (
        <>
          <line
            x1="12"
            y1="6.5"
            x2="12"
            y2="13.5"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17.2" r="1.6" fill="#fff" />
        </>
      ) : (
        <path
          d="M8 8 L16 16 M16 8 L8 16"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
};

const panelStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  background: '#faf9f7',
  border: '1px solid #ece9e4',
  borderRadius: 18,
  padding: '16px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  boxSizing: 'border-box',
};

const PanelHead: React.FC<{label: string; question: string}> = ({
  label,
  question,
}) => (
  <div>
    <div
      style={{
        fontFamily: FONTS.sans,
        fontWeight: 760,
        fontSize: 21,
        letterSpacing: 0.4,
        color: PAPER.ink,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
    <div style={{...body(16), marginTop: 4, whiteSpace: 'nowrap'}}>
      {question}
    </div>
  </div>
);

const Idle: React.FC = () => (
  <div
    style={{
      fontFamily: FONTS.mono,
      fontSize: 14,
      letterSpacing: 2,
      color: PAPER.ink3,
      marginTop: 8,
    }}
  >
    AWAITING PROPOSAL
  </div>
);

/** Local safety: is this one step admissible on its own? */
const LocalPanel: React.FC<{
  step: SafetyStep | null;
  p: number;
  fade: number;
}> = ({step, p, fade}) => (
  <div style={panelStyle}>
    <PanelHead
      label="Local safety"
      question="Is this step admissible on its own?"
    />
    {step ? (
      <div
        style={{
          opacity: fade,
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
        }}
      >
        <div
          style={{
            alignSelf: 'flex-start',
            fontFamily: FONTS.mono,
            fontSize: 17,
            color: PAPER.ink,
            background: '#fff',
            border: `1px solid ${PAPER.chipBorder}`,
            borderRadius: 10,
            padding: '7px 12px',
            ...rise(progress(p, 18, 10), 10),
          }}
        >
          {step.action}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
          {CHECKS.map((c, i) => {
            const shown = progress(p, PHASE.arrive + i * 3, 6);
            const failed = step.local.fail === c.key;
            return (
              <div
                key={c.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  opacity: shown,
                  fontFamily: FONTS.sans,
                  fontSize: 16,
                  color: failed ? VERDICT_COLOR.BLOCK : PAPER.ink2,
                  fontWeight: failed ? 700 : 400,
                }}
              >
                <Mark kind={failed ? 'fail' : 'ok'} size={16} />
                {c.label}
              </div>
            );
          })}
        </div>
        <Result
          kind={step.local.fail ? 'fail' : 'ok'}
          text={step.local.why}
          shown={progress(p, PHASE.local, 8)}
        />
      </div>
    ) : (
      <Idle />
    )}
  </div>
);

const Result: React.FC<{
  kind: 'ok' | 'warn' | 'fail';
  text: string;
  shown: number;
}> = ({kind, text, shown}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      opacity: shown,
      transform: `scale(${1.08 - 0.08 * shown})`,
      transformOrigin: 'left center',
      fontFamily: FONTS.sans,
      fontWeight: 700,
      fontSize: 18,
      color: PAPER.ink,
      whiteSpace: 'nowrap',
    }}
  >
    <Mark kind={kind} size={24} />
    {text}
  </div>
);

/** Global safety: the path so far, this step's projection, and the forbidden set Ω. */
const PathMap: React.FC<{
  width: number;
  height: number;
  start: [number, number];
  path: Executed[];
  origin: [number, number];
  step: SafetyStep | null;
  p: number;
  decided: boolean;
  executed: boolean;
  omega: string;
  fade: number;
}> = ({
  width: W,
  height: H,
  start,
  path,
  origin,
  step,
  p,
  decided,
  executed,
  omega,
  fade,
}) => {
  const frame = useCurrentFrame();
  const id = svgId(useId());
  const X = (u: number) => 10 + u * (W - 20);
  const Y = (v: number) => 8 + v * (H - 16);
  // Ω and its near band, kept inside the map (unit square: Ω centre 0.76, 0.42)
  const om = {
    cx: X(0.76),
    cy: Y(0.42),
    rx: (W - 20) * 0.12,
    ry: (H - 16) * 0.26,
  };
  const pts = [start, ...path.map((e) => e.at)];

  // this step's projection: draws on, then becomes path (ALLOW) or fades (BLOCK)
  let proj: React.ReactNode = null;
  if (step && !executed) {
    const draw = progress(p, PHASE.project, 10);
    const blocked = decided && step.verdict === 'BLOCK';
    const color = STATE_COLOR[step.global.state];
    const [ox, oy] = [X(origin[0]), Y(origin[1])];
    const [tx, ty] = [X(step.global.to[0]), Y(step.global.to[1])];
    const ex = ox + (tx - ox) * draw;
    const ey = oy + (ty - oy) * draw;
    proj = (
      <g opacity={(blocked ? 0.45 : 1) * fade}>
        <line
          x1={ox}
          y1={oy}
          x2={ex}
          y2={ey}
          stroke={color}
          strokeWidth={2.6}
          strokeDasharray="6 5"
        />
        {draw >= 1 ? (
          step.global.state === 'reach' ? (
            <path
              d={`M${tx - 7} ${ty - 7} L${tx + 7} ${ty + 7} M${tx + 7} ${ty - 7} L${tx - 7} ${ty + 7}`}
              stroke={color}
              strokeWidth={3.2}
              strokeLinecap="round"
            />
          ) : (
            <circle
              cx={tx}
              cy={ty}
              r={6}
              fill="#fff"
              stroke={color}
              strokeWidth={2.6}
            />
          )
        ) : null}
      </g>
    );
  }
  const pulse = 0.5 + 0.5 * Math.sin((frame * 2 * Math.PI) / 30);
  const cur = pts[pts.length - 1];

  return (
    <svg width={W} height={H} style={{display: 'block'}}>
      <defs>
        <pattern
          id={`${id}h`}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="7"
            stroke={VERDICT_COLOR.BLOCK}
            strokeWidth="1.6"
            opacity="0.45"
          />
        </pattern>
        <pattern
          id={`${id}g`}
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" fill="rgba(60,50,40,0.12)" />
        </pattern>
      </defs>
      <rect width={W} height={H} rx={10} fill="#fff" stroke="#ece9e4" />
      <rect width={W} height={H} rx={10} fill={`url(#${id}g)`} />
      {/* near band, then Ω */}
      <ellipse
        cx={om.cx}
        cy={om.cy}
        rx={om.rx * 2}
        ry={om.ry * 1.75}
        fill="rgba(227,162,26,0.07)"
        stroke={VERDICT_COLOR.ESCALATE}
        strokeWidth={1.4}
        strokeDasharray="5 5"
      />
      <ellipse
        cx={om.cx}
        cy={om.cy}
        rx={om.rx}
        ry={om.ry}
        fill="rgba(217,58,73,0.08)"
      />
      <ellipse
        cx={om.cx}
        cy={om.cy}
        rx={om.rx}
        ry={om.ry}
        fill={`url(#${id}h)`}
        stroke={VERDICT_COLOR.BLOCK}
        strokeWidth={1.8}
      />
      <text
        x={om.cx}
        y={om.cy + 8}
        textAnchor="middle"
        fill={VERDICT_COLOR.BLOCK}
        style={{fontFamily: FONTS.serif, fontWeight: 800, fontSize: 24}}
      >
        Ω
      </text>
      <text
        x={12}
        y={20}
        fill={PAPER.ink3}
        style={{fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 0.5}}
      >
        Ω = {omega}
      </text>

      {/* executed path */}
      <g opacity={fade}>
        <polyline
          points={pts.map(([u, v]) => `${X(u)},${Y(v)}`).join(' ')}
          fill="none"
          stroke="#222"
          strokeWidth={2.6}
          strokeLinejoin="round"
        />
        {proj}
        {pts.map(([u, v], i) => (
          <circle
            key={i}
            cx={X(u)}
            cy={Y(v)}
            r={i === 0 ? 4.5 : 5.5}
            fill={
              i === 0
                ? '#9a9a9a'
                : VERDICT_COLOR[path[i - 1].verdict as Verdict]
            }
            stroke="#fff"
            strokeWidth={1.6}
          />
        ))}
        <circle
          cx={X(cur[0])}
          cy={Y(cur[1])}
          r={9 + 3 * pulse}
          fill="none"
          stroke="#222"
          strokeWidth={1.2}
          opacity={0.5 - 0.3 * pulse}
        />
      </g>
    </svg>
  );
};

const GlobalPanel: React.FC<{
  step: SafetyStep | null;
  p: number;
  mapH: number;
  mapW: number;
  start: [number, number];
  path: Executed[];
  origin: [number, number];
  decided: boolean;
  executed: boolean;
  omega: string;
  fade: number;
}> = (props) => {
  const {step, p, fade} = props;
  return (
    <div style={panelStyle}>
      <PanelHead
        label="Global safety"
        question="Where does the whole path lead?"
      />
      <PathMap {...props} width={props.mapW} height={props.mapH} />
      {step ? (
        <div style={{opacity: fade}}>
          <Result
            kind={
              step.global.state === 'clear'
                ? 'ok'
                : step.global.state === 'near'
                  ? 'warn'
                  : 'fail'
            }
            text={step.global.why}
            shown={progress(p, PHASE.global, 8)}
          />
        </div>
      ) : (
        <Idle />
      )}
    </div>
  );
};

/**
 * Morrison Runtime Governance: header + live tally, the two checks side by
 * side, and the verdict banner. Border flashes the colour of each verdict.
 */
export const GovernanceCard: React.FC<{
  rect: Rect;
  appearAt: number;
  title: string;
  sub: string;
  counts: Record<Verdict, number>;
  last: {verdict: Verdict; age: number} | null;
  step: SafetyStep | null;
  /** Frames since the active step was proposed. */
  p: number;
  start: [number, number];
  path: Executed[];
  origin: [number, number];
  executed: boolean;
  omega: string;
  /** Loop mode: run fade before the reset. */
  episode: number;
  mapH: number;
}> = ({
  rect,
  appearAt,
  title,
  sub,
  counts,
  last,
  step,
  p,
  start,
  path,
  origin,
  executed,
  omega,
  episode,
  mapH,
}) => {
  const frame = useCurrentFrame();
  const flash = last
    ? interpolate(last.age, [0, 16], [1, 0], {extrapolateRight: 'clamp'})
    : 0;
  const settled = progress(frame, appearAt + 30, 30);
  const ring = last ? VERDICT_COLOR[last.verdict] : VERDICT_COLOR.ALLOW;
  const decided = step !== null && p >= PHASE.decide;
  const stamp = progress(p, PHASE.decide, 12);
  const mapW = (rect.w - 60 - 18) / 2 - 38;
  const alpha = Math.round((0.25 * settled + 0.6 * flash) * 255)
    .toString(16)
    .padStart(2, '0');

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
        {/* header */}
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          <KernelMark size={100} />
          <div style={{minWidth: 0}}>
            <div style={heading(fitHeading(title, rect.w - 60 - 120, 40))}>
              {title}
            </div>
            <div style={{...body(20), marginTop: 6}}>{sub}</div>
            <div style={{display: 'flex', gap: 28, marginTop: 10}}>
              {(Object.keys(counts) as Verdict[]).map((v) => (
                <div
                  key={v}
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 16,
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

        {/* the two checks */}
        <div style={{display: 'flex', gap: 18, flex: 1, minHeight: 0}}>
          <LocalPanel step={step} p={p} fade={episode} />
          <GlobalPanel
            step={step}
            p={p}
            mapW={mapW}
            mapH={mapH}
            start={start}
            path={path}
            origin={origin}
            decided={decided}
            executed={executed}
            omega={omega}
            fade={episode}
          />
        </div>

        {/* verdict banner */}
        <div
          style={{
            height: 34,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: FONTS.sans,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 0.4,
            opacity: episode,
          }}
        >
          {step && decided ? (
            <>
              <DocIcon color={VERDICT_COLOR[step.verdict]} size={24} />
              <span
                style={{
                  display: 'inline-flex',
                  gap: 10,
                  opacity: stamp,
                  transform: `scale(${1.2 - 0.2 * stamp})`,
                  transformOrigin: 'left center',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{color: VERDICT_COLOR[step.verdict]}}>
                  {step.verdict}
                </span>
                <span style={{color: PAPER.ink}}>
                  · {step.reason.toUpperCase()}
                </span>
              </span>
            </>
          ) : (
            <>
              <DocIcon color={PAPER.ink3} size={24} />
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontWeight: 500,
                  fontSize: 17,
                  letterSpacing: 2,
                  color: PAPER.ink3,
                }}
              >
                {step ? `EVALUATING ${step.action}` : 'AWAITING PROPOSAL'}
                {'.'.repeat(1 + (Math.floor(frame / 8) % 3))}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
