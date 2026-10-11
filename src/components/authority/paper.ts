/**
 * The authority board: palette, scenario shape and decision schedules shared
 * by every board video (see src/templates/AuthorityBoard.tsx).
 *
 * A new board video is just a Scenario — copy, five agents and their verdicts —
 * in src/videos/<name>/script.ts.
 */

export const FPS = 30;

/** 'map' builds in and closes on the CTA; 'loop' is a seamless, always-on board. */
export type BoardMode = 'map' | 'loop';
export type BoardFormat = 'landscape' | 'portrait';

export const DURATION: Record<BoardMode, number> = {
  map: 15 * FPS, // 450 — matches the soundtrack
  loop: 12 * FPS, // 360 — every periodic motion divides this
};

/** Light "paper" palette (the dark brand palette is in theme.ts). */
export const PAPER = {
  bg: '#f4f2ef',
  bgEdge: '#ebe8e3',
  dot: 'rgba(60,50,40,0.07)',
  card: '#ffffff',
  cardBorder: 'rgba(30,25,20,0.05)',
  ink: '#111111',
  ink2: '#5d5d5d',
  ink3: '#8a8a8a',
  rule: '#dedad4',
  chip: '#f6f5f3',
  chipBorder: '#e7e4df',
  track: '#ecebe8',
  brand: '#c4532a', // subtitle orange
  cta: '#2353e6',
} as const;

export type Verdict = 'ALLOW' | 'ESCALATE' | 'BLOCK';

export const VERDICT_COLOR: Record<Verdict, string> = {
  ALLOW: '#1f9d4a',
  ESCALATE: '#e3a21a',
  BLOCK: '#d93a49',
};

/** Agent accent colours, in card order. */
export const AGENT_COLORS = [
  '#d4a017',
  '#2f6fe4',
  '#c43fb4',
  '#3fa535',
  '#d23a52',
] as const;

export type Agent = {
  name: string;
  job: string;
  tools: [string, string, string];
  verdict: Verdict;
  result: string;
  /** How far through the three tools the agent gets (0–3) before its verdict. */
  reach: number;
  /**
   * Map mode: frame the agent finishes its run and the verdict stamps in — keep
   * it on a DECISIONS frame with the same verdict so the kernel counter ticks
   * with it.
   */
  doneAt: number;
  /** Robot face: friendly eyes, or a red scanner bar. */
  face?: 'eyes' | 'visor';
};

export type Scenario = {
  title: [string, string];
  subtitle: string;
  shared: {title: string; sub: string};
  rules: {title: string; sub: string};
  tools: {title: string; sub: string};
  review: {title: string; lines: [string, string]};
  /** Exactly five, in card order. */
  agents: Agent[];
  footer?: string;
};

/** Copy that stays the same on every board. */
export const BOARD_COPY = {
  kernel: {
    title: 'Morrison Kernel',
    sub: 'independent veto · before execution',
  },
  label: 'Every proposal · One authority',
  loop: ['propose', 'verify', 'execute', 'record', 'evidence'],
  cta: 'Book a 48-hour audit  ·  resurrection-tech.com/assessment',
  footer: 'Morrison Runtime Governance  ·  Resurrection Tech',
  soundtrack: 'audio/every-agent-one-authority.m4a',
};

const CODE: Record<string, Verdict> = {A: 'ALLOW', E: 'ESCALATE', B: 'BLOCK'};

/**
 * Map mode: every decision the kernel makes, in order. The counters tick
 * through these (15 allow · 5 escalate · 2 block), the kernel border flashes
 * the verdict colour, and each one launches a pill along the matching line.
 */
export const DECISIONS: {frame: number; verdict: Verdict}[] =
  'AAEAAAEABAAEAAAEAABAEA'.split('').map((c, i) => ({
    frame: 105 + i * 15 + (((i * 7) % 5) - 2),
    verdict: CODE[c],
  }));

/** Loop mode: one 12s cycle of decisions; the counters hold at the full tally. */
export const LOOP_DECISIONS: {frame: number; verdict: Verdict}[] =
  'AAEAABAAEAAB'.split('').map((c, i) => ({
    frame: 10 + i * 30,
    verdict: CODE[c],
  }));

/** Map-mode build-in and the closing CTA swap. */
export const TIMING = {
  linesDraw: [40, 110] as const,
  workStart: 80,
  ctaIn: 372,
};
