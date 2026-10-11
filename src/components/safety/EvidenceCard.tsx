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
import type {SafetyStep} from './timeline';

const COLS = '84px 132px 1fr 62px 62px 176px';

const sym = {
  ok: {t: '✓', c: VERDICT_COLOR.ALLOW},
  warn: {t: '!', c: VERDICT_COLOR.ESCALATE},
  fail: {t: '✗', c: VERDICT_COLOR.BLOCK},
};

/**
 * Decision-bound evidence: one signed row per verdict, bound to the action,
 * both check results and a binding hash. Rows land as each decision is made.
 */
export const EvidenceCard: React.FC<{
  rect: Rect;
  appearAt: number;
  steps: SafetyStep[];
  /** Frame (local time) each row landed, or null if not yet. */
  landed: (number | null)[];
  t: number;
  episode: number;
}> = ({rect, appearAt, steps, landed, t, episode}) => {
  const frame = useCurrentFrame();
  const title = 'Decision-bound evidence';
  return (
    <div style={{...place(rect), ...rise(progress(frame, appearAt))}}>
      <div
        style={{
          ...cardSurface,
          width: '100%',
          height: '100%',
          padding: '20px 30px 18px 34px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 16,
            bottom: 16,
            width: 6,
            borderRadius: 3,
            background: '#3a3a3a',
          }}
        />
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
          <div style={heading(fitHeading(title, rect.w * 0.5, 26))}>
            {title}
          </div>
          <div style={{...body(17), whiteSpace: 'nowrap'}}>
            signed · bound to action, rules and path
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: COLS,
            marginTop: 14,
            paddingBottom: 6,
            borderBottom: `1px solid ${PAPER.rule}`,
            fontFamily: FONTS.mono,
            fontSize: 12,
            letterSpacing: 2,
            color: PAPER.ink3,
          }}
        >
          <span>ID</span>
          <span>VERDICT</span>
          <span>ACTION</span>
          <span>LOCAL</span>
          <span>GLOBAL</span>
          <span>BINDING</span>
        </div>
        {steps.map((s, k) => {
          const at = landed[k];
          const p = at === null ? 0 : progress(t, at, 12);
          if (p === 0) return <div key={s.label} style={{height: 29}} />;
          const L = s.local.fail ? sym.fail : sym.ok;
          const G =
            s.global.state === 'clear'
              ? sym.ok
              : s.global.state === 'near'
                ? sym.warn
                : sym.fail;
          return (
            <div
              key={s.label}
              style={{
                display: 'grid',
                gridTemplateColumns: COLS,
                alignItems: 'center',
                height: 29,
                fontFamily: FONTS.mono,
                fontSize: 15,
                color: PAPER.ink,
                opacity: p * episode,
                transform: `translateY(${(1 - p) * 10}px)`,
              }}
            >
              <span style={{color: PAPER.ink3}}>
                ev-{String(141 + k).padStart(4, '0')}
              </span>
              <span
                style={{
                  fontFamily: FONTS.sans,
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: 0.6,
                  color: VERDICT_COLOR[s.verdict],
                }}
              >
                {s.verdict}
              </span>
              <span style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
                {s.action}
              </span>
              <span style={{color: L.c, fontWeight: 700}}>{L.t}</span>
              <span style={{color: G.c, fontWeight: 700}}>{G.t}</span>
              <span style={{color: PAPER.ink2, whiteSpace: 'nowrap'}}>
                sha:{s.hash}…{' '}
                <span style={{color: VERDICT_COLOR.ALLOW}}>✓</span> signed
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
