/**
 * Governance flow: the reference architecture as a board-style video.
 *
 *   Autonomous AI proposer → Morrison Runtime Governance (local + global
 *   admissibility → ALLOW / BLOCK / ESCALATE, decision-bound evidence) →
 *   mediated execution boundary → protected resource.
 *
 * The proposer submits candidate actions one after another; this file holds
 * the scenario shape and when each beat of each action happens.
 */
import type {Verdict} from '../authority/paper';
import type {GlobalState} from '../safety/timeline';

export type FlowAction = {
  /** Short label on the proposer's chip. */
  chip: string;
  /** The concrete call the kernel evaluates. */
  action: string;
  local: {ok: boolean; why: string};
  global: {state: GlobalState; why: string};
  verdict: Verdict;
  /** Index into boundary.resources this action reaches if it executes. */
  resource?: number;
  hash: string;
};

export type FlowScenario = {
  title: [string, string];
  subtitle: string;
  proposer: {kicker: string; name: string; job: string};
  kernel: {title: string; sub: string};
  local: {title: string; question: string};
  global: {title: string; question: string};
  evidence: string;
  boundary: {title: string; sub: string; resources: string[]};
  review: {title: string; lines: [string, string]};
  footnote: string;
  actions: FlowAction[];
  footer?: string;
};

/** Offsets (frames) from an action's proposal. */
export const BEAT = {
  arrive: 24, // proposal token reaches the kernel
  local: 26, // local admissibility resolved
  global: 32, // global admissibility resolved
  decide: 38, // verdict
  evidence: 8, // after the verdict: evidence recorded
  toBoundary: 40, // ALLOW pill travel to the boundary
  toBlock: 20, // BLOCK pill travel to its stop
  toReview: 26, // ESCALATE pill travel to the reviewer
  signedDelay: 40, // after the verdict: the signature starts back
  signedTravel: 26,
} as const;

export const FLOW_TIMING = {
  first: 104,
  gap: 52,
  linesDraw: [40, 110] as const,
  ctaIn: 386,
};

export const proposeAt = (k: number) => FLOW_TIMING.first + FLOW_TIMING.gap * k;
export const decideAt = (k: number) => proposeAt(k) + BEAT.decide;

/** Frame the action is authorised to cross the boundary (null = never). */
export const authorisedAt = (a: FlowAction, k: number): number | null => {
  if (a.verdict === 'ALLOW') return decideAt(k);
  if (a.verdict === 'ESCALATE')
    return decideAt(k) + BEAT.signedDelay + BEAT.signedTravel;
  return null;
};
