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
import {InfoCard, place} from '../components/authority/Cards';
import {MetroMap, type PillLaunch} from '../components/authority/MetroMap';
import {progress, rise} from '../components/authority/motion';
import {
  BOARD_COPY,
  DURATION,
  PAPER,
  VERDICT_COLOR,
  type BoardFormat,
  type BoardMode,
  type Verdict,
} from '../components/authority/paper';
import {Boundary} from '../components/safety/Boundary';
import {EvidenceCard} from '../components/safety/EvidenceCard';
import {GovernanceCard} from '../components/safety/GovernanceCard';
import {SAFETY_LANDSCAPE, SAFETY_PORTRAIT} from '../components/safety/layouts';
import {ProposerCard, type StepStatus} from '../components/safety/ProposerCard';
import {
  decideAt,
  executedAt,
  executedPath,
  PHASE,
  SAFETY_TIMING,
  stepStart,
  type SafetyScenario,
} from '../components/safety/timeline';

const PILL_FOR: Record<Verdict, PillLaunch['kind']> = {
  ALLOW: 'allow',
  ESCALATE: 'escalate',
  BLOCK: 'block',
};

/** Exponential-ish decay of a one-shot flash fired at `at`. */
const flashAt = (t: number, at: number, dur: number) =>
  t < at
    ? 0
    : interpolate(t - at, [0, dur], [1, 0], {extrapolateRight: 'clamp'});

/**
 * Local + global safety for one autonomous proposer.
 *
 * Five proposed steps run through Morrison Runtime Governance: each is checked
 * on its own (local) and as part of the whole path toward Ω (global). Only
 * ALLOW crosses the mediated execution boundary; ESCALATE goes to a human and
 * comes back signed; BLOCK stops at the wall. Every verdict lands a
 * decision-bound evidence row.
 *
 * Same masters as the authority boards: landscape/portrait × map/loop.
 */
export const SafetyFlow: React.FC<{
  scenario: SafetyScenario;
  format: BoardFormat;
  mode: BoardMode;
}> = ({scenario, format, mode}) => {
  useFontsReady();
  const frame = useCurrentFrame();
  const L = format === 'landscape' ? SAFETY_LANDSCAPE : SAFETY_PORTRAIT;
  const loop = mode === 'loop';
  const raw = loop ? frame % DURATION.loop : frame;
  // loop: until the first proposal, hold the previous run's (faded) end state
  // so the seam is invisible
  const t = loop && raw < stepStart(mode, 0) ? raw + DURATION.loop : raw;
  const at = (f: number) => (loop ? -1000 : f);
  // loop: the run fades out before the board resets for the next one
  const episode = loop
    ? 1 -
      progress(
        t,
        SAFETY_TIMING.loopFade[0],
        SAFETY_TIMING.loopFade[1] - SAFETY_TIMING.loopFade[0],
      )
    : 1;
  const {steps} = scenario;

  // ── where the run is ───────────────────────────────────────────────
  const starts = steps.map((_, k) => stepStart(mode, k));
  const decides = steps.map((_, k) => decideAt(mode, k));
  let active = -1;
  starts.forEach((s, k) => {
    if (t >= s) active = k;
  });
  const status: StepStatus[] = steps.map((_, k) =>
    t >= decides[k] ? 'decided' : t >= starts[k] ? 'proposed' : 'pending',
  );
  const step = active >= 0 ? steps[active] : null;
  const p = active >= 0 ? t - starts[active] : 0;
  const path = executedPath(scenario, mode, t);
  // the projection starts from the planned path: every earlier step not blocked
  const planned = steps
    .slice(0, Math.max(0, active))
    .filter((s) => s.verdict !== 'BLOCK');
  const origin = planned.length
    ? planned[planned.length - 1].global.to
    : scenario.start;
  const activeExec =
    active >= 0 ? executedAt(mode, active, steps[active].verdict) : null;
  const executed = activeExec !== null && t >= activeExec;

  const decided = steps.map((s, k) => ({
    verdict: s.verdict,
    frame: decides[k],
  }));
  const counts: Record<Verdict, number> = {ALLOW: 0, ESCALATE: 0, BLOCK: 0};
  decided.forEach((d) => {
    if (loop || t >= d.frame) counts[d.verdict]++;
  });
  const lastD = [...decided].reverse().find((d) => t >= d.frame);
  const last = lastD ? {verdict: lastD.verdict, age: t - lastD.frame} : null;

  // ── traffic ────────────────────────────────────────────────────────
  const pills: PillLaunch[] = [];
  steps.forEach((s, k) => {
    pills.push({kind: 'propose', frame: starts[k]});
    pills.push({kind: 'evidence', frame: decides[k]});
    pills.push({kind: PILL_FOR[s.verdict], frame: decides[k]});
    if (s.verdict === 'ESCALATE')
      pills.push({kind: 'signed', frame: decides[k] + PHASE.signed});
  });
  const allowPill = L.lines.find((l) => l.pill === 'allow')?.pillTravel ?? 30;
  const blockPill = L.lines.find((l) => l.pill === 'block')?.pillTravel ?? 16;
  const escPill = L.lines.find((l) => l.pill === 'escalate')?.pillTravel ?? 40;
  let gateFlash = 0;
  let blockFlash = 0;
  let toolsFlash = 0;
  let reviewFlash = 0;
  steps.forEach((s, k) => {
    const d = decides[k];
    if (s.verdict === 'ALLOW') {
      gateFlash = Math.max(gateFlash, flashAt(t, d + allowPill * 0.45, 22));
      toolsFlash = Math.max(toolsFlash, flashAt(t, d + allowPill, 22));
    }
    if (s.verdict === 'BLOCK') {
      // the ✕ holds against the wall until the next proposal
      const hit = d + blockPill;
      const until = k + 1 < steps.length ? starts[k + 1] + 10 : Infinity;
      if (t >= hit && t < until)
        blockFlash = Math.max(blockFlash, 0.75 + 0.25 * flashAt(t, hit, 14));
    }
    if (s.verdict === 'ESCALATE')
      reviewFlash = Math.max(reviewFlash, flashAt(t, d + escPill, 30));
  });
  blockFlash *= episode;

  const cta = loop ? 0 : progress(frame, SAFETY_TIMING.ctaIn, 20);
  const push = loop ? 1 : 1 + 0.015 * (frame / DURATION.map);
  const longest = Math.max(...scenario.title.map((x) => x.length));
  const titleSize = Math.min(L.title.size, L.title.maxWidth / (longest * 0.45));

  const glow = (r: typeof L.tools, color: string, v: number) => (
    <div
      style={{
        ...place(r),
        borderRadius: 26,
        boxShadow: `0 0 0 3px ${color}, 0 0 34px ${color}66`,
        opacity: v,
      }}
    />
  );

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
          {scenario.title.map((line, i) => (
            <div key={line} style={rise(progress(frame, at(i * 10), 20), 30)}>
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
            opacity: progress(frame, at(20)),
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
            width: L.divider.w * progress(frame, at(26), 26),
            background: PAPER.rule,
          }}
        />

        <MetroMap
          width={L.width}
          height={L.height}
          lines={L.lines}
          drawWindow={loop ? [-300, -200] : SAFETY_TIMING.linesDraw}
          pills={pills}
          preroll={loop ? 2 * DURATION.loop : 0}
        />
        <Boundary
          width={L.width}
          height={L.height}
          a={L.wall.a}
          b={L.wall.b}
          gate={L.gate}
          blockAt={L.blockAt}
          label={L.wallLabel}
          appearAt={at(50)}
          gateFlash={gateFlash}
          blockFlash={blockFlash}
        />

        <ProposerCard
          rect={L.proposer}
          appearAt={at(30)}
          kicker={scenario.proposer.kicker}
          name={scenario.proposer.name}
          job={scenario.proposer.job}
          steps={steps}
          status={status}
          episode={episode}
        />
        {L.rules ? (
          <InfoCard
            rect={L.rules}
            scale={L.infoScale}
            appearAt={at(36)}
            title={scenario.rules.title}
            lines={[scenario.rules.sub]}
            icon="person"
          />
        ) : null}

        <GovernanceCard
          rect={L.kernel}
          appearAt={at(40)}
          title="Morrison Runtime Governance"
          sub="separates proposal from execution authority"
          counts={counts}
          last={last}
          step={step}
          p={p}
          start={scenario.start}
          path={path}
          origin={origin}
          executed={executed}
          omega={scenario.omega}
          episode={episode}
          mapH={format === 'landscape' ? 170 : 124}
        />

        <EvidenceCard
          rect={L.evidence}
          appearAt={at(50)}
          steps={steps}
          landed={decides.map((d) =>
            t >= d + PHASE.evidence ? d + PHASE.evidence : null,
          )}
          t={t}
          episode={episode}
        />

        <InfoCard
          rect={L.tools}
          scale={L.infoScale}
          appearAt={at(46)}
          title={scenario.tools.title}
          lines={[scenario.tools.sub]}
        />
        {glow(L.tools, VERDICT_COLOR.ALLOW, toolsFlash)}
        <InfoCard
          rect={L.review}
          scale={L.infoScale}
          appearAt={at(56)}
          title={scenario.review.title}
          lines={
            L.reviewInline
              ? [scenario.review.lines.join(' · ')]
              : scenario.review.lines
          }
          accent="#e3a21a"
        />
        {glow(L.review, VERDICT_COLOR.ESCALATE, reviewFlash)}

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
        {loop ? null : (
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
