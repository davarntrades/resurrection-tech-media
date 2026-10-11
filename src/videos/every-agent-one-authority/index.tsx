import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FONTS} from '../../branding/theme';
import {useFontsReady} from '../../branding/useFontsReady';
import {
  AgentCard,
  InfoCard,
  KernelCard,
  LabelPill,
} from '../../components/authority/Cards';
import {MetroMap, type PillLaunch} from '../../components/authority/MetroMap';
import {progress, rise} from '../../components/authority/motion';
import {LANDSCAPE, PORTRAIT} from './layouts';
import {
  AGENTS,
  COPY,
  DECISIONS,
  PAPER,
  TIMING,
  WORK_START,
  type Verdict,
} from './script';

const PILL_FOR: Record<Verdict, PillLaunch['kind']> = {
  ALLOW: 'allow',
  ESCALATE: 'escalate',
  BLOCK: 'block',
};

// Every decision launches its pill; every escalation comes back signed.
const PILLS: PillLaunch[] = [
  ...DECISIONS.map((d) => ({kind: PILL_FOR[d.verdict], frame: d.frame})),
  ...DECISIONS.filter((d) => d.verdict === 'ESCALATE').map((d) => ({
    kind: 'signed' as const,
    frame: d.frame + 40,
  })),
];

/**
 * "Every agent. One authority." — five agents, one kernel that vetoes before
 * execution. One component, two masters: `format="landscape"` (16:9) and
 * `format="portrait"` (9:16). Registered in Root.tsx.
 */
export const EveryAgentOneAuthority: React.FC<{
  format: 'landscape' | 'portrait';
}> = ({format}) => {
  useFontsReady();
  const frame = useCurrentFrame();
  const L = format === 'landscape' ? LANDSCAPE : PORTRAIT;

  const decided = DECISIONS.filter((d) => d.frame <= frame);
  const counts: Record<Verdict, number> = {ALLOW: 0, ESCALATE: 0, BLOCK: 0};
  decided.forEach((d) => counts[d.verdict]++);
  const lastD = decided[decided.length - 1];
  const last = lastD
    ? {verdict: lastD.verdict, age: frame - lastD.frame}
    : null;

  const cta = progress(frame, TIMING.ctaIn, 20);
  // the slowest of drifts: a 1.5% push across the whole piece
  const push = 1 + 0.015 * (frame / 450);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 40% 30%, ${PAPER.bg} 55%, ${PAPER.bgEdge} 100%)`,
        overflow: 'hidden',
      }}
    >
      <Audio src={staticFile('audio/every-agent-one-authority.m4a')} />
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
            top: L.title.y,
            fontFamily: FONTS.serif,
            fontWeight: 800,
            fontSize: L.title.size,
            lineHeight: 0.98,
            letterSpacing: -2,
            color: PAPER.ink,
          }}
        >
          {COPY.title.map((t, i) => (
            <div
              key={t}
              style={rise(progress(frame, TIMING.titleIn + i * 10, 20), 30)}
            >
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
            opacity: progress(frame, 20),
          }}
        >
          {COPY.subtitle}
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
          drawWindow={TIMING.linesDraw}
          pills={PILLS}
        />

        <InfoCard
          rect={L.shared}
          scale={L.infoScale}
          appearAt={30}
          title={COPY.shared.title}
          lines={[COPY.shared.sub]}
        />
        <InfoCard
          rect={L.rules}
          scale={L.infoScale}
          appearAt={35}
          title={COPY.rules.title}
          lines={[COPY.rules.sub]}
          icon="person"
        />
        <InfoCard
          rect={L.tools}
          scale={L.infoScale}
          appearAt={40}
          title={COPY.tools.title}
          lines={[COPY.tools.sub]}
        />

        <KernelCard
          rect={L.kernel}
          appearAt={44}
          title={COPY.kernel.title}
          sub={COPY.kernel.sub}
          counts={counts}
          last={last}
        />
        <LabelPill
          cx={L.label.cx}
          y={L.label.y}
          text={COPY.label}
          appearAt={70}
        />

        {AGENTS.map((agent, i) => (
          <AgentCard
            key={agent.name}
            rect={L.agents[i]}
            index={i}
            agent={agent}
            appearAt={52 + i * 6}
            workStart={WORK_START + i * 8}
          />
        ))}

        <InfoCard
          rect={L.review}
          scale={L.reviewScale}
          appearAt={format === 'landscape' ? 40 : 82}
          title={COPY.review.title}
          lines={
            L.reviewInline ? [COPY.review.lines.join(' · ')] : COPY.review.lines
          }
          accent="#e3a21a"
        />

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
          {COPY.loop.map((step, i) => {
            const lit = Math.floor(frame / 18) % COPY.loop.length === i;
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
          {COPY.cta}
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
          {COPY.footer}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
