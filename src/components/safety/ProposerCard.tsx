import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONTS} from '../../branding/theme';
import {
  body,
  cardSurface,
  fitHeading,
  heading,
  place,
} from '../authority/Cards';
import type {Rect} from '../authority/layouts';
import {progress, rise} from '../authority/motion';
import {PAPER, VERDICT_COLOR} from '../authority/paper';
import {Robot} from '../authority/Robot';
import type {SafetyStep} from './timeline';

export type StepStatus = 'pending' | 'proposed' | 'decided';

const PROPOSE_BLUE = '#2f6fe4';

/**
 * The autonomous proposer: plans and proposes, holds no execution rights.
 * Lists its five steps; each shows proposed → verdict as the kernel decides.
 * Wide rects (portrait) lay the header and list side by side.
 */
export const ProposerCard: React.FC<{
  rect: Rect;
  appearAt: number;
  kicker: string;
  name: string;
  job: string;
  steps: SafetyStep[];
  status: StepStatus[];
  /** Loop mode: fades the run's statuses out before the next run. */
  episode: number;
}> = ({rect, appearAt, kicker, name, job, steps, status, episode}) => {
  const frame = useCurrentFrame();
  const wide = rect.w > 700;
  const headerW = wide ? 440 : rect.w - 60;

  const header = (
    <div style={{position: 'relative', width: headerW}}>
      <div style={{position: 'absolute', right: wide ? 0 : -6, top: -16}}>
        <Robot color={PROPOSE_BLUE} size={112} phase={0.4} />
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 16,
          letterSpacing: 2,
          color: PAPER.ink2,
          textTransform: 'uppercase',
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          ...heading(fitHeading(name, headerW - 130, 39)),
          marginTop: 14,
        }}
      >
        {name}
      </div>
      <div
        style={{
          ...body(20),
          marginTop: 10,
          width: wide ? headerW : headerW - 120,
        }}
      >
        {job}
      </div>
    </div>
  );

  const list = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: wide ? 8 : 9,
        flex: 1,
      }}
    >
      {steps.map((step, k) => {
        const st = status[k];
        const color =
          st === 'decided' ? VERDICT_COLOR[step.verdict] : PROPOSE_BLUE;
        const tag =
          st === 'pending'
            ? '···'
            : st === 'proposed'
              ? 'PROPOSED'
              : step.verdict === 'BLOCK'
                ? `BLOCK · ${step.local.fail ? 'LOCAL' : 'GLOBAL'}`
                : step.verdict;
        const active = st === 'proposed';
        return (
          <div
            key={step.label}
            style={{
              height: wide ? 40 : 44,
              borderRadius: 12,
              background: active ? '#eef3fd' : PAPER.chip,
              border: `${active ? 2 : 1}px solid ${active ? PROPOSE_BLUE : PAPER.chipBorder}`,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              gap: 14,
              fontFamily: FONTS.sans,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 14,
                color: PAPER.ink3,
                letterSpacing: 1,
              }}
            >
              {String(k + 1).padStart(2, '0')}
            </span>
            <span
              style={{
                fontSize: 19,
                fontWeight: 600,
                color: st === 'pending' ? PAPER.ink2 : PAPER.ink,
                flex: 1,
                whiteSpace: 'nowrap',
              }}
            >
              {step.label}
            </span>
            <span
              style={{
                fontFamily: st === 'decided' ? FONTS.sans : FONTS.mono,
                fontSize: st === 'decided' ? 16 : 13,
                fontWeight: 700,
                letterSpacing: st === 'decided' ? 0.6 : 2,
                color: st === 'pending' ? PAPER.ink3 : color,
                opacity: st === 'pending' ? 1 : episode,
                whiteSpace: 'nowrap',
              }}
            >
              {tag}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{...place(rect), ...rise(progress(frame, appearAt), 34)}}>
      <div
        style={{
          ...cardSurface,
          width: '100%',
          height: '100%',
          position: 'relative',
          padding: wide ? '26px 30px' : '28px 30px 26px',
          display: 'flex',
          flexDirection: wide ? 'row' : 'column',
          gap: wide ? 34 : 22,
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
            background: PROPOSE_BLUE,
          }}
        />
        {header}
        {list}
      </div>
    </div>
  );
};
