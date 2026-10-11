/**
 * Local + global safety flow: scenario shape and the step timeline.
 *
 * One autonomous proposer submits five steps. Each is checked on its own
 * (local safety) and as part of the whole path toward the forbidden set Ω
 * (global safety); the verdict decides whether it crosses the mediated
 * execution boundary, and every verdict leaves a decision-bound evidence row.
 */
import type {BoardMode, Verdict} from '../authority/paper';

export type LocalCheck = 'tool' | 'scope' | 'limits';
export type GlobalState = 'clear' | 'near' | 'reach';

export type SafetyStep = {
  /** Short name in the proposer's list. */
  label: string;
  /** The concrete call the kernel evaluates. */
  action: string;
  /** Local safety: which of the three local checks fails (none = passes). */
  local: {fail?: LocalCheck; why: string};
  /**
   * Global safety: where this step would move the path. Unit square; Ω is
   * centred at (0.76, 0.42), its near band reaches about 0.24 / 0.45 out.
   */
  global: {state: GlobalState; why: string; to: [number, number]};
  verdict: Verdict;
  /** Banner line under the verdict. */
  reason: string;
  /** Short binding hash shown on the evidence row. */
  hash: string;
};

export type SafetyScenario = {
  title: [string, string];
  subtitle: string;
  proposer: {kicker: string; name: string; job: string};
  rules: {title: string; sub: string};
  tools: {title: string; sub: string};
  review: {title: string; lines: [string, string]};
  /** What the forbidden set Ω means in this scenario. */
  omega: string;
  /** Where the path starts (unit square). */
  start: [number, number];
  /** Exactly five, in order. */
  steps: SafetyStep[];
  footer?: string;
};

/** Offsets (frames) from a step's proposal. */
export const PHASE = {
  arrive: 24, // proposal token reaches the kernel
  local: 30, // local checks resolved
  project: 30, // global projection starts drawing
  global: 40, // global result shown
  decide: 44, // verdict
  evidence: 20, // after the verdict: evidence row lands
  executed: 30, // after the verdict: ALLOW reaches the tools
  signed: 45, // after an ESCALATE verdict: the signature starts back
  signedTravel: 40,
} as const;

const SCHEDULE: Record<BoardMode, {first: number; gap: number}> = {
  map: {first: 100, gap: 54},
  loop: {first: 4, gap: 64},
};

export const stepStart = (mode: BoardMode, k: number) =>
  SCHEDULE[mode].first + SCHEDULE[mode].gap * k;
export const decideAt = (mode: BoardMode, k: number) =>
  stepStart(mode, k) + PHASE.decide;

/** Frame a step's effect lands on the path (null = never executes). */
export const executedAt = (
  mode: BoardMode,
  k: number,
  verdict: Verdict,
): number | null => {
  if (verdict === 'ALLOW') return decideAt(mode, k) + PHASE.executed;
  if (verdict === 'ESCALATE')
    return decideAt(mode, k) + PHASE.signed + PHASE.signedTravel;
  return null;
};

/** Map-mode CTA; loop-mode episode fade (the board resets for the next run). */
export const SAFETY_TIMING = {
  linesDraw: [40, 110] as const,
  ctaIn: 392,
  loopFade: [336, 356] as const,
};

export type Executed = {at: [number, number]; verdict: Verdict};

/** The path as executed by frame t: start plus every step whose effect has landed. */
export const executedPath = (
  scenario: SafetyScenario,
  mode: BoardMode,
  t: number,
): Executed[] => {
  const path: Executed[] = [];
  scenario.steps.forEach((s, k) => {
    const at = executedAt(mode, k, s.verdict);
    if (at !== null && t >= at)
      path.push({at: s.global.to, verdict: s.verdict});
  });
  return path;
};
