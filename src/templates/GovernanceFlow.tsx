import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {FONTS} from '../branding/theme';
import {useFontsReady} from '../branding/useFontsReady';
import {InfoCard, LabelPill, body, place} from '../components/authority/Cards';
import type {Line, Pt, Rect} from '../components/authority/layouts';
import {MetroMap, type PillLaunch} from '../components/authority/MetroMap';
import {progress, rise} from '../components/authority/motion';
import {
  BOARD_COPY,
  DURATION,
  PAPER,
  VERDICT_COLOR,
  type Verdict,
} from '../components/authority/paper';
import {
  AuthorityCard,
  BoundaryCard,
  ProposerAgentCard,
} from '../components/flow/FlowCards';
import {
  authorisedAt,
  BEAT,
  decideAt,
  FLOW_TIMING,
  proposeAt,
  type FlowScenario,
} from '../components/flow/timeline';

/** Portrait (9:16) geometry — the reference diagram, top to bottom. */
const L = {
  width: 1080,
  height: 1920,
  title: {x: 48, y: 80, size: 88, maxWidth: 980},
  subtitle: {x: 50, y: 292, size: 22},
  divider: {x: 50, y: 340, w: 980},
  proposer: {x: 48, y: 378, w: 984, h: 250} as Rect,
  label: {cx: 540, y: 648},
  kernel: {x: 48, y: 706, w: 984, h: 450} as Rect,
  review: {x: 592, y: 1214, w: 440, h: 124} as Rect,
  blockStop: [176, 1270] as Pt,
  boundary: {x: 48, y: 1384, w: 984, h: 200} as Rect,
  footnote: {x: 52, y: 1612, w: 976},
  cta: {x: 196, y: 1748, w: 688, h: 56} as Rect,
  loop: {cx: 540, y: 1776},
  footer: {x: 30, y: 1872},
  lines: [
    // proposer → governance
    {
      color: '#86aef2',
      points: [
        [300, 600],
        [300, 720],
      ],
      pill: 'propose',
      pillTravel: 24,
    },
    {
      color: '#bdbab5',
      points: [
        [780, 600],
        [780, 720],
      ],
      docs: {start: 70, every: 60, travel: 40},
    },
    {
      color: '#f09a90',
      points: [
        [1028, 480],
        [1056, 520],
        [1056, 690],
        [1028, 740],
      ],
      stations: [0.5],
      docs: {start: 90, every: 90, travel: 70},
    },
    {
      color: '#efbe55',
      points: [
        [52, 500],
        [24, 540],
        [24, 690],
        [52, 740],
      ],
      stations: [0.5],
      docs: {start: 110, every: 72, travel: 70},
    },
    // governance → boundary / stop / reviewer
    {
      color: '#2fae5c',
      points: [
        [400, 1142],
        [400, 1220],
        [380, 1270],
        [380, 1396],
      ],
      stations: [0.4],
      pill: 'allow',
      pillTravel: 40,
    },
    {
      color: '#ef7287',
      points: [
        [176, 1142],
        [176, 1270],
      ],
      pill: 'block',
      pillTravel: 20,
    },
    {
      color: '#efbe55',
      points: [
        [760, 1142],
        [760, 1228],
      ],
      pill: 'escalate',
      pillTravel: 26,
    },
    {
      color: '#86d3bd',
      points: [
        [960, 1228],
        [960, 1142],
      ],
      pill: 'signed',
      pillTravel: 26,
    },
  ] as Line[],
};

const PILL_FOR: Record<Verdict, PillLaunch['kind']> = {
  ALLOW: 'allow',
  ESCALATE: 'escalate',
  BLOCK: 'block',
};

const flashAt = (t: number, at: number, dur: number) =>
  t < at
    ? 0
    : interpolate(t - at, [0, dur], [1, 0], {extrapolateRight: 'clamp'});

/**
 * The reference architecture, told with the board's pieces: an autonomous AI
 * proposer → Morrison Runtime Governance (local + global admissibility →
 * ALLOW / BLOCK / ESCALATE, decision-bound evidence recorded) → mediated
 * execution boundary → protected resources. 15s, closes on the CTA.
 */
export const GovernanceFlow: React.FC<{scenario: FlowScenario}> = ({
  scenario,
}) => {
  useFontsReady();
  const frame = useCurrentFrame();
  const t = frame;
  const {actions} = scenario;

  const since = actions.map((_, k) => t - proposeAt(k));
  let current = -1;
  since.forEach((s, k) => {
    if (s >= 0) current = k;
  });
  const action = current >= 0 ? actions[current] : null;
  const p = current >= 0 ? since[current] : 0;

  const counts: Record<Verdict, number> = {ALLOW: 0, ESCALATE: 0, BLOCK: 0};
  let last: {verdict: Verdict; age: number} | null = null;
  let record: {id: string; hash: string; age: number} | null = null;
  actions.forEach((a, k) => {
    const d = decideAt(k);
    if (t >= d) {
      counts[a.verdict]++;
      last = {verdict: a.verdict, age: t - d};
    }
    if (t >= d + BEAT.evidence)
      record = {
        id: `ev-${String(141 + k).padStart(4, '0')}`,
        hash: a.hash,
        age: t - d - BEAT.evidence,
      };
  });

  // traffic: proposals in, verdicts out; authorised actions ride to the boundary
  const pills: PillLaunch[] = [];
  const hits = scenario.boundary.resources.map(() => 0);
  let blockMark = 0;
  let reviewFlash = 0;
  actions.forEach((a, k) => {
    const d = decideAt(k);
    pills.push({kind: 'propose', frame: proposeAt(k)});
    if (a.verdict !== 'ALLOW')
      pills.push({kind: PILL_FOR[a.verdict], frame: d});
    if (a.verdict === 'ESCALATE') {
      pills.push({kind: 'signed', frame: d + BEAT.signedDelay});
      reviewFlash = Math.max(reviewFlash, flashAt(t, d + BEAT.toReview, 30));
    }
    const auth = authorisedAt(a, k);
    if (auth !== null) {
      pills.push({kind: 'allow', frame: auth});
      if (a.resource !== undefined)
        hits[a.resource] = Math.max(
          hits[a.resource],
          t >= auth + BEAT.toBoundary
            ? 0.35 + 0.65 * flashAt(t, auth + BEAT.toBoundary, 24)
            : 0,
        );
    }
    if (a.verdict === 'BLOCK') {
      const hit = d + BEAT.toBlock;
      const until = k + 1 < actions.length ? proposeAt(k + 1) + 10 : Infinity;
      if (t >= hit && t < until)
        blockMark = Math.max(blockMark, 0.75 + 0.25 * flashAt(t, hit, 14));
    }
  });

  const cta = progress(frame, FLOW_TIMING.ctaIn, 20);
  const push = 1 + 0.015 * (frame / DURATION.map);
  const longest = Math.max(...scenario.title.map((x) => x.length));
  const titleSize = Math.min(L.title.size, L.title.maxWidth / (longest * 0.45));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 40% 30%, ${PAPER.bg} 55%, ${PAPER.bgEdge} 100%)`,
        overflow: 'hidden',
      }}
    >
      <Audio src={staticFile(BOARD_COPY.soundtrack)} />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${PAPER.dot} 1.4px, transparent 1.6px)`,
          backgroundSize: '26px 26px',
        }}
      />
      <AbsoluteFill
        style={{transform: `scale(${push})`, transformOrigin: '50% 40%'}}
      >
        {/* headline */}
        <div
          style={{
            position: 'absolute',
            left: L.title.x,
            top: L.title.y + (L.title.size - titleSize),
            fontFamily: FONTS.serif,
            fontWeight: 800,
            fontSize: titleSize,
            lineHeight: 0.98,
            letterSpacing: -2,
            color: PAPER.ink,
            whiteSpace: 'nowrap',
          }}
        >
          {scenario.title.map((line, i) => (
            <div key={line} style={rise(progress(frame, i * 10, 20), 30)}>
              {line}
            </div>
          ))}
        </div>
        <div
          style={{
            position: 'absolute',
            left: L.subtitle.x,
            top: L.subtitle.y,
            fontFamily: FONTS.sans,
            fontWeight: 700,
            fontSize: L.subtitle.size,
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            color: PAPER.brand,
            opacity: progress(frame, 20),
            whiteSpace: 'nowrap',
          }}
        >
          {scenario.subtitle}
        </div>
        <div
          style={{
            position: 'absolute',
            left: L.divider.x,
            top: L.divider.y,
            height: 1.5,
            width: L.divider.w * progress(frame, 26, 26),
            background: PAPER.rule,
          }}
        />

        <MetroMap
          width={L.width}
          height={L.height}
          lines={L.lines}
          drawWindow={FLOW_TIMING.linesDraw}
          pills={pills}
        />
        {/* a blocked action stops here — it never reaches the boundary */}
        <svg
          width={L.width}
          height={L.height}
          style={{position: 'absolute', inset: 0}}
        >
          <g
            transform={`translate(${L.blockStop[0]} ${L.blockStop[1]})`}
            opacity={blockMark}
          >
            <circle
              r={15 + 4 * blockMark}
              fill="#fff"
              stroke={VERDICT_COLOR.BLOCK}
              strokeWidth={3}
            />
            <path
              d="M-6 -6 L6 6 M6 -6 L-6 6"
              stroke={VERDICT_COLOR.BLOCK}
              strokeWidth={3.4}
              strokeLinecap="round"
            />
          </g>
        </svg>

        <ProposerAgentCard
          rect={L.proposer}
          appearAt={30}
          kicker={scenario.proposer.kicker}
          name={scenario.proposer.name}
          job={scenario.proposer.job}
          actions={actions}
          since={since}
        />
        <LabelPill
          cx={L.label.cx}
          y={L.label.y}
          text={BOARD_COPY.label}
          appearAt={60}
        />

        <AuthorityCard
          rect={L.kernel}
          appearAt={40}
          title={scenario.kernel.title}
          sub={scenario.kernel.sub}
          local={scenario.local}
          global={scenario.global}
          evidence={scenario.evidence}
          counts={counts}
          last={last}
          action={action}
          p={p}
          record={record}
        />

        <InfoCard
          rect={L.review}
          scale={0.9}
          appearAt={56}
          title={scenario.review.title}
          lines={[scenario.review.lines.join(' · ')]}
          accent="#e3a21a"
        />
        <div
          style={{
            ...place(L.review),
            borderRadius: 26,
            boxShadow: `0 0 0 3px ${VERDICT_COLOR.ESCALATE}, 0 0 34px ${VERDICT_COLOR.ESCALATE}66`,
            opacity: reviewFlash,
          }}
        />

        <BoundaryCard
          rect={L.boundary}
          appearAt={64}
          title={scenario.boundary.title}
          sub={scenario.boundary.sub}
          resources={scenario.boundary.resources}
          hits={hits}
        />

        <div
          style={{
            position: 'absolute',
            left: L.footnote.x,
            top: L.footnote.y,
            width: L.footnote.w,
            ...body(19),
            color: PAPER.ink3,
            lineHeight: 1.4,
            opacity: progress(frame, 80),
          }}
        >
          {scenario.footnote}
        </div>

        {/* the loop, swapped for the CTA at the close */}
        <div
          style={{
            position: 'absolute',
            left: L.loop.cx,
            top: L.loop.y,
            transform: 'translate(-50%, -50%)',
            opacity: progress(frame, 88) * (1 - cta),
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            whiteSpace: 'nowrap',
            fontFamily: FONTS.mono,
            fontSize: 22,
            color: PAPER.ink,
          }}
        >
          <span
            style={{
              fontSize: 14,
              letterSpacing: 2.5,
              color: PAPER.ink3,
              marginRight: 14,
            }}
          >
            THE LOOP
          </span>
          {BOARD_COPY.loop.map((s, i) => {
            const lit = Math.floor(frame / 18) % BOARD_COPY.loop.length === i;
            return (
              <React.Fragment key={s}>
                {i > 0 ? <span style={{color: PAPER.ink3}}>→</span> : null}
                <span
                  style={{
                    color: lit ? PAPER.cta : PAPER.ink,
                    fontWeight: lit ? 700 : 400,
                  }}
                >
                  {s}
                </span>
              </React.Fragment>
            );
          })}
        </div>
        <div
          style={{
            ...place(L.cta),
            borderRadius: L.cta.h / 2,
            background: PAPER.cta,
            boxShadow: '0 14px 30px rgba(35,83,230,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONTS.sans,
            fontWeight: 600,
            fontSize: 23,
            color: '#fff',
            whiteSpace: 'pre',
            ...rise(cta, 30),
          }}
        >
          {BOARD_COPY.cta}
        </div>

        <div
          style={{
            position: 'absolute',
            left: L.footer.x,
            top: L.footer.y,
            fontFamily: FONTS.mono,
            fontSize: 15,
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            color: '#6d6d6d',
            opacity: progress(frame, 80),
            whiteSpace: 'pre',
          }}
        >
          {scenario.footer ?? BOARD_COPY.footer}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
