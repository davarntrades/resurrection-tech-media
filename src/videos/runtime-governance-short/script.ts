/**
 * Feed-native vertical short — "Safety enforced before execution".
 *
 * A fast-cut, scenario-led explainer for muted autoplay (LinkedIn / TikTok /
 * Shorts / Reels). All copy, timing, kinetic-caption tokens and the agent
 * scenario live here as data, so a new short = copy this folder + edit text.
 *
 * The narration (`vo`) is the script for a real voiceover dropped into
 * public/audio (see `voiceover` below); the on-screen kinetic captions mirror
 * it so the piece reads fully with the sound off.
 */

/** A caption word with an optional brand color for emphasis. */
export type CaptionToken = {
  t: string;
  c?: 'accent' | 'accentBright' | 'omega' | 'ok' | 'ink' | 'ink2';
};

export type ShortSceneId =
  | 'hook'
  | 'reads'
  | 'prepares'
  | 'reachable'
  | 'intervene'
  | 'block'
  | 'audit'
  | 'close';

export type ShortScene = {
  id: ShortSceneId;
  /** Scene length in frames (30fps). */
  frames: number;
  /** Kinetic caption, revealed word-by-word. */
  caption: CaptionToken[];
  /** Narration line for the voiceover track + captions reference. */
  vo: string;
};

const w = (
  t: string,
  c?: CaptionToken['c'],
): CaptionToken => ({t, c});

export const SHORT_SCENES: ShortScene[] = [
  {
    id: 'hook',
    frames: 66,
    vo: 'Most AI safety tools react after the damage is done.',
    caption: [
      w('Most'),
      w('AI'),
      w('safety'),
      w('tools'),
      w('react'),
      w('AFTER', 'omega'),
      w('the'),
      w('damage'),
      w('is'),
      w('done.', 'omega'),
    ],
  },
  {
    id: 'reads',
    frames: 96,
    vo: "An autonomous agent reads a customer's account.",
    caption: [
      w('An'),
      w('AI'),
      w('agent'),
      w('reads'),
      w('a'),
      w("customer's", 'accentBright'),
      w('account.', 'accentBright'),
    ],
  },
  {
    id: 'prepares',
    frames: 96,
    vo: 'It prepares a fifty-thousand-dollar wire transfer.',
    caption: [
      w('It'),
      w('prepares'),
      w('a'),
      w('$50,000', 'accentBright'),
      w('wire'),
      w('transfer.'),
    ],
  },
  {
    id: 'reachable',
    frames: 84,
    vo: 'In milliseconds, a dangerous outcome becomes reachable.',
    caption: [
      w('A'),
      w('dangerous'),
      w('outcome'),
      w('becomes'),
      w('reachable.', 'omega'),
    ],
  },
  {
    id: 'intervene',
    frames: 78,
    vo: 'Runtime Governance evaluates the action before it executes.',
    caption: [
      w('Runtime', 'accent'),
      w('Governance', 'accent'),
      w('checks'),
      w('it'),
      w('—'),
      w('before'),
      w('it'),
      w('runs.'),
    ],
  },
  {
    id: 'block',
    frames: 60,
    vo: 'Blocked. The transfer never happens.',
    caption: [
      w('BLOCKED.', 'omega'),
      w('The'),
      w('transfer'),
      w('never'),
      w('happens.'),
    ],
  },
  {
    id: 'audit',
    frames: 108,
    vo: 'Every decision — logged, signed, and provable.',
    caption: [
      w('Every'),
      w('decision:'),
      w('logged,'),
      w('signed,'),
      w('provable.', 'ok'),
    ],
  },
  {
    id: 'close',
    frames: 102,
    vo: 'Safety, enforced before execution. Resurrection Tech.',
    caption: [
      w('Safety,'),
      w('enforced'),
      w('before', 'ok'),
      w('execution.', 'ok'),
    ],
  },
];

export const totalShortDuration = (scenes: ShortScene[]): number =>
  scenes.reduce((sum, s) => sum + s.frames, 0);

/* ------------------------------------------------------------------ *
 * Concrete scenario data — the "real outcome" the story is built on.  *
 * ------------------------------------------------------------------ */

export const AGENT_RECORD: {
  endpoint: string;
  fields: {k: string; v: string; tag?: string}[];
} = {
  endpoint: 'GET /v2/customers/4471',
  fields: [
    {k: 'name', v: '•••••• ••••••', tag: 'PII'},
    {k: 'account', v: 'ACCT ••••3391'},
    {k: 'balance', v: '$84,200.00'},
    {k: 'status', v: 'verified', tag: 'OK'},
  ],
};

export const TRANSFER = {
  amount: 50000,
  amountLabel: '$50,000.00',
  to: 'ACCT ••••8820',
  flags: ['EXTERNAL', 'FIRST-SEEN PAYEE'],
} as const;

export const AUDIT_ENTRIES = [
  {k: 'action', v: 'transfer.execute', c: 'ink' as const},
  {k: 'policy', v: 'RT-014 external-transfer-guard', c: 'accentBright' as const},
  {k: 'reachable', v: 'Ω  loss_event=exfiltration', c: 'omega' as const},
  {k: 'decision', v: 'BLOCK · pre-execution', c: 'omega' as const},
  {k: 'latency', v: '4.2ms', c: 'ink2' as const},
  {k: 'signature', v: '0x9af3…21e7  ✓', c: 'ok' as const},
] as const;

export const CLOSE = {
  brand: 'Resurrection Tech™',
  cta: 'Request a Runtime Audit',
  url: 'resurrection-tech.com',
} as const;

/**
 * Path to the voiceover MP3 inside public/. Set to a real file (e.g.
 * 'audio/runtime-governance-short-vo.mp3') and the short plays it; left null,
 * the short renders silent with captions only. The full VO script is the `vo`
 * lines above, in order.
 */
export const VOICEOVER: string | null = null;
