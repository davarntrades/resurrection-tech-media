import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FONTS} from '../branding/theme';
import {useFontsReady} from '../branding/useFontsReady';
import {
  AgentCard,
  InfoCard,
  KernelCard,
  LabelPill,
} from '../components/authority/Cards';
import {MetroMap, type PillLaunch} from '../components/authority/MetroMap';
import {progress, rise} from '../components/authority/motion';
import {LANDSCAPE, PORTRAIT} from '../components/authority/layouts';
import {
  BOARD_COPY,
  DECISIONS,
  DURATION,
  LOOP_DECISIONS,
  PAPER,
  TIMING,
  type BoardFormat,
  type BoardMode,
  type Scenario,
  type Verdict,
} from '../components/authority/paper';

const PILL_FOR: Record<Verdict, PillLaunch['kind']> = {
  ALLOW: 'allow',
  ESCALATE: 'escalate',
  BLOCK: 'block',
};

// Every decision launches its pill; every escalation comes back signed.
const pillsFor = (decisions: typeof DECISIONS): PillLaunch[] => [
  ...decisions.map((d) => ({kind: PILL_FOR[d.verdict], frame: d.frame})),
  ...decisions
    .filter((d) => d.verdict === 'ESCALATE')
    .map((d) => ({kind: 'signed' as const, frame: d.frame + 40})),
];

const MAP_PILLS = pillsFor(DECISIONS);
// Loop: the previous cycle's pills too, so pills in flight at the seam carry over.
const LOOP_PILLS = pillsFor(LOOP_DECISIONS).flatMap((p) => [
  p,
  {...p, frame: p.frame - DURATION.loop},
]);

const TALLY: Record<Verdict, number> = {ALLOW: 0, ESCALATE: 0, BLOCK: 0};
DECISIONS.forEach((d) => TALLY[d.verdict]++);

/**
 * The authority board: five agents, one kernel that vetoes before execution.
 * One template, any Scenario, two masters each way:
 *   format — 'landscape' (16:9) or 'portrait' (9:16)
 *   mode   — 'map' (builds in, live tally, closes on the CTA, soundtrack) or
 *            'loop' (12s seamless always-on board, silent)
 */
export const AuthorityBoard: React.FC<{
  scenario: Scenario;
  format: BoardFormat;
  mode: BoardMode;
}> = ({scenario, format, mode}) => {
  useFontsReady();
  const frame = useCurrentFrame();
  const L = format === 'landscape' ? LANDSCAPE : PORTRAIT;
  const loop = mode === 'loop';
  // build-in cue → frame; in a loop everything is already on the board
  const at = (f: number) => (loop ? -1000 : f);

  let counts = TALLY;
  let last: {verdict: Verdict; age: number} | null = null;
  if (loop) {
    const t = frame % DURATION.loop;
    const prev = [...LOOP_DECISIONS].reverse().find((d) => d.frame <= t);
    const d = prev ?? LOOP_DECISIONS[LOOP_DECISIONS.length - 1];
    last = {
      verdict: d.verdict,
      age: prev ? t - d.frame : t + DURATION.loop - d.frame,
    };
  } else {
    const decided = DECISIONS.filter((d) => d.frame <= frame);
    counts = {ALLOW: 0, ESCALATE: 0, BLOCK: 0};
    decided.forEach((d) => counts[d.verdict]++);
    const d = decided[decided.length - 1];
    last = d ? {verdict: d.verdict, age: frame - d.frame} : null;
  }

  const cta = loop ? 0 : progress(frame, TIMING.ctaIn, 20);
  // map only: the slowest of drifts, a 1.5% push across the piece
  const push = loop ? 1 : 1 + 0.015 * (frame / DURATION.map);
  // Playfair 800 averages ~0.45em per character; shrink long headlines to fit
  const longest = Math.max(...scenario.title.map((t) => t.length));
  const titleSize = Math.min(L.title.size, L.title.maxWidth / (longest * 0.45));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 40% 30%, ${PAPER.bg} 55%, ${PAPER.bgEdge} 100%)`,
        overflow: 'hidden',
      }}
    >
      {loop ? null : <Audio src={staticFile(BOARD_COPY.soundtrack)} />}
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
          {scenario.title.map((t, i) => (
            <div key={t} style={rise(progress(frame, at(i * 10), 20), 30)}>
              {t}
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
            opacity: progress(frame, at(20)),
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
            width: L.divider.w * progress(frame, at(26), 26),
            background: PAPER.rule,
          }}
        />

        <MetroMap
          width={L.width}
          height={L.height}
          lines={L.lines}
          drawWindow={loop ? [-300, -200] : TIMING.linesDraw}
          pills={loop ? LOOP_PILLS : MAP_PILLS}
          preroll={loop ? 2 * DURATION.loop : 0}
        />

        <InfoCard
          rect={L.shared}
          scale={L.infoScale}
          appearAt={at(30)}
          title={scenario.shared.title}
          lines={[scenario.shared.sub]}
        />
        <InfoCard
          rect={L.rules}
          scale={L.infoScale}
          appearAt={at(35)}
          title={scenario.rules.title}
          lines={[scenario.rules.sub]}
          icon="person"
        />
        <InfoCard
          rect={L.tools}
          scale={L.infoScale}
          appearAt={at(40)}
          title={scenario.tools.title}
          lines={[scenario.tools.sub]}
        />

        <KernelCard
          rect={L.kernel}
          appearAt={at(44)}
          title={BOARD_COPY.kernel.title}
          sub={BOARD_COPY.kernel.sub}
          counts={counts}
          last={last}
        />
        <LabelPill
          cx={L.label.cx}
          y={L.label.y}
          text={BOARD_COPY.label}
          appearAt={at(70)}
        />

        {scenario.agents.map((agent, i) => (
          <AgentCard
            key={agent.name}
            rect={L.agents[i]}
            index={i}
            agent={agent}
            appearAt={at(52 + i * 6)}
            workStart={TIMING.workStart + i * 8}
            loop={loop}
          />
        ))}

        <InfoCard
          rect={L.review}
          scale={L.reviewScale}
          appearAt={at(format === 'landscape' ? 40 : 82)}
          title={scenario.review.title}
          lines={
            L.reviewInline
              ? [scenario.review.lines.join(' · ')]
              : scenario.review.lines
          }
          accent="#e3a21a"
        />

        {/* the loop, swapped for the CTA at the close of a map master */}
        <div
          style={{
            position: 'absolute',
            left: L.loop.cx,
            top: L.loop.y,
            transform: 'translate(-50%, -50%)',
            opacity: progress(frame, at(88)) * (1 - cta),
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
          {BOARD_COPY.loop.map((step, i) => {
            const lit = Math.floor(frame / 18) % BOARD_COPY.loop.length === i;
            return (
              <React.Fragment key={step}>
                {i > 0 ? <span style={{color: PAPER.ink3}}>→</span> : null}
                <span
                  style={{
                    color: lit ? PAPER.cta : PAPER.ink,
                    fontWeight: lit ? 700 : 400,
                  }}
                >
                  {step}
                </span>
              </React.Fragment>
            );
          })}
        </div>
        {loop ? null : (
          <div
            style={{
              position: 'absolute',
              left: L.cta.x,
              top: L.cta.y,
              width: L.cta.w,
              height: L.cta.h,
              borderRadius: L.cta.h / 2,
              background: PAPER.cta,
              boxShadow: '0 14px 30px rgba(35,83,230,0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONTS.sans,
              fontWeight: 600,
              fontSize: format === 'landscape' ? 25 : 23,
              color: '#fff',
              whiteSpace: 'pre',
              ...rise(cta, 30),
            }}
          >
            {BOARD_COPY.cta}
          </div>
        )}

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
            opacity: progress(frame, at(80)),
            whiteSpace: 'pre',
          }}
        >
          {scenario.footer ?? BOARD_COPY.footer}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
