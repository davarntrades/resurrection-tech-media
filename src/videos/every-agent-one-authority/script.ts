/**
 * "Every agent. One authority." — copy, data and timeline.
 *
 * Everything you'd edit to make a sibling video lives here: the words, the
 * agents, the verdict palette and the decision schedule. Geometry lives in
 * layouts.ts (one per aspect ratio).
 */

export const FPS = 30;
export const DURATION = 15 * FPS; // 450 frames — matches the soundtrack

/** Light "paper" palette used by this video (the dark brand palette is in theme.ts). */
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

export const COPY = {
  title: ['Every agent.', 'One authority.'],
  subtitle: 'A governed operating system for AI agents.',
  shared: {title: 'Shared context', sub: 'policies · tenants · Ω'},
  rules: {title: 'You set the rules', sub: 'forbidden states / approvals'},
  tools: {title: 'Connected tools', sub: 'APIs · shell · payments'},
  review: {
    title: 'You review + approve',
    lines: ['escalations only', 'signed · expiring · bound to the action'],
  },
  kernel: {
    title: 'Morrison Kernel',
    sub: 'independent veto · before execution',
  },
  label: 'Every proposal · One authority',
  loop: ['propose', 'verify', 'execute', 'record', 'evidence'],
  cta: 'Book a 48-hour audit  ·  resurrection-tech.com/assessment',
  footer: 'Morrison Runtime Governance  ·  Resurrection Tech',
};

export type Agent = {
  name: string;
  job: string;
  color: string;
  tools: [string, string, string];
  verdict: Verdict;
  result: string;
  /** How far through the three tools the agent gets (0–3) before its verdict. */
  reach: number;
  /**
   * Frame the agent finishes its run and the verdict stamps in — keep it on a
   * DECISIONS frame with the same verdict so the kernel counter ticks with it.
   */
  doneAt: number;
  /** Robot face: friendly eyes, or a red scanner bar for the infra agent. */
  face?: 'eyes' | 'visor';
};

export const AGENTS: Agent[] = [
  {
    name: 'Research',
    job: 'Gather evidence',
    color: '#d4a017',
    tools: ['search', 'read', 'brief'],
    verdict: 'ALLOW',
    result: 'Cited brief',
    reach: 3,
    doneAt: 241,
  },
  {
    name: 'Code',
    job: 'Build and test',
    color: '#2f6fe4',
    tools: ['scope', 'code', 'tests'],
    verdict: 'ALLOW',
    result: 'Tested PR',
    reach: 3,
    doneAt: 299,
  },
  {
    name: 'Finance',
    job: 'Move the money',
    color: '#c43fb4',
    tools: ['invoice', 'match', 'transfer'],
    verdict: 'ESCALATE',
    result: 'Held',
    reach: 2,
    doneAt: 195,
  },
  {
    name: 'Support',
    job: 'Answer customers',
    color: '#3fa535',
    tools: ['ticket', 'draft', 'reply'],
    verdict: 'ALLOW',
    result: 'Reply drafted',
    reach: 3,
    doneAt: 345,
  },
  {
    name: 'Ops',
    job: 'Keep the infra running',
    color: '#d23a52',
    tools: ['plan', 'diff', 'deploy'],
    verdict: 'BLOCK',
    result: 'Prod delete',
    reach: 1.4,
    doneAt: 224,
    face: 'visor',
  },
];

/** Agents start working once the board has built in. */
export const WORK_START = 80;

/**
 * Every decision the kernel makes, in order. The counters on the kernel card
 * tick through these (15 allow · 5 escalate · 2 block), its border flashes the
 * verdict colour, and each one launches a pill along the matching line.
 */
const PATTERN = 'AAEAAAEABAAEAAAEAABAEA';
const CODE: Record<string, Verdict> = {A: 'ALLOW', E: 'ESCALATE', B: 'BLOCK'};

export const DECISIONS: {frame: number; verdict: Verdict}[] = PATTERN.split(
  '',
).map((c, i) => ({
  frame: 105 + i * 15 + (((i * 7) % 5) - 2),
  verdict: CODE[c],
}));

/** Board build-in and the closing CTA swap. */
export const TIMING = {
  titleIn: 0,
  linesDraw: [40, 110] as const,
  ctaIn: 372,
};
