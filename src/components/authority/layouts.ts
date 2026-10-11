/**
 * Geometry for each master. Same board, two arrangements:
 *   landscape — 1920×1080, the reference still
 *   portrait  — 1080×1920, feed-native
 *
 * Lines are "metro" routes drawn underneath the cards; they only show in the
 * gaps, so their waypoints can run behind a card freely. Points run in the
 * direction traffic flows (proposals into the kernel, decisions out of it).
 */

export type Rect = {x: number; y: number; w: number; h: number};
export type Pt = [number, number];

/** Verdict pills, plus document tokens for proposals and evidence records. */
export type PillKind =
  | 'allow'
  | 'escalate'
  | 'block'
  | 'signed'
  | 'propose'
  | 'evidence';

export type Line = {
  color: string;
  points: Pt[];
  /** Station dots, as fractions along the route. */
  stations?: number[];
  /**
   * Ambient documents: first launch frame, gap between launches, travel time.
   * Keep `every` a divisor of 360 so the 12s loop masters repeat seamlessly.
   */
  docs?: {start: number; every: number; travel: number};
  /** Decision pills that ride this line (see DECISIONS in paper.ts). */
  pill?: PillKind;
  /** Frames a pill takes to ride the whole line (default 48). */
  pillTravel?: number;
};

export type Layout = {
  width: number;
  height: number;
  /** Headline; long titles shrink so the widest line stays within maxWidth. */
  title: {x: number; y: number; size: number; maxWidth: number};
  subtitle: {x: number; y: number; size: number};
  divider: {x: number; y: number; w: number};
  shared: Rect;
  rules: Rect;
  tools: Rect;
  review: Rect;
  reviewInline: boolean;
  /** Type scale for the small info cards / the review card. */
  infoScale: number;
  reviewScale: number;
  kernel: Rect;
  label: {cx: number; y: number};
  agents: Rect[];
  cta: Rect;
  loop: {cx: number; y: number};
  footer: {x: number; y: number};
  lines: Line[];
};

const C = {
  grey: '#bdbab5',
  gold: '#efbe55',
  teal: '#86d3bd',
  salmon: '#f09a90',
  blue: '#86aef2',
  lime: '#a9d973',
  red: '#ef7287',
  pink: '#ee8fd9',
  green: '#2fae5c',
};

export const LANDSCAPE: Layout = {
  width: 1920,
  height: 1080,
  title: {x: 52, y: 84, size: 86, maxWidth: 760},
  subtitle: {x: 54, y: 296, size: 22},
  divider: {x: 54, y: 350, w: 488},
  shared: {x: 50, y: 402, w: 507, h: 113},
  rules: {x: 50, y: 543, w: 507, h: 113},
  review: {x: 50, y: 718, w: 507, h: 148},
  reviewInline: false,
  infoScale: 1,
  reviewScale: 1,
  tools: {x: 1593, y: 73, w: 317, h: 119},
  kernel: {x: 898, y: 67, w: 646, h: 184},
  label: {cx: 1211, y: 278},
  agents: [
    {x: 648, y: 362, w: 400, h: 300},
    {x: 1072, y: 390, w: 400, h: 300},
    {x: 1497, y: 362, w: 400, h: 300},
    {x: 838, y: 737, w: 460, h: 285},
    {x: 1327, y: 737, w: 460, h: 285},
  ],
  cta: {x: 72, y: 900, w: 751, h: 66},
  loop: {cx: 447, y: 933},
  footer: {x: 72, y: 1036},
  lines: [
    // inputs → kernel
    {
      color: C.grey,
      points: [
        [540, 455],
        [640, 420],
        [760, 205],
        [835, 128],
        [920, 128],
      ],
      stations: [0.35, 0.62],
      docs: {start: 70, every: 60, travel: 95},
    },
    {
      color: C.salmon,
      points: [
        [540, 600],
        [650, 565],
        [880, 330],
        [1010, 240],
      ],
      stations: [0.5],
      docs: {start: 95, every: 72, travel: 90},
    },
    {
      color: C.teal,
      points: [
        [540, 828],
        [640, 852],
        [700, 812],
        [724, 600],
        [790, 380],
        [880, 300],
        [945, 240],
      ],
      stations: [0.18, 0.4, 0.75],
      pill: 'signed',
    },
    // kernel → review (escalations go to a human)
    {
      color: C.gold,
      points: [
        [905, 180],
        [860, 180],
        [780, 262],
        [640, 660],
        [540, 760],
      ],
      stations: [0.3, 0.7],
      pill: 'escalate',
      docs: {start: 120, every: 90, travel: 100},
    },
    // kernel → agents
    {
      color: C.gold,
      points: [
        [1040, 240],
        [1030, 300],
        [880, 318],
        [850, 380],
      ],
      stations: [0.55],
      docs: {start: 100, every: 60, travel: 60},
    },
    {
      color: C.blue,
      points: [
        [1130, 240],
        [1150, 315],
        [1235, 333],
        [1270, 405],
      ],
      stations: [0.5],
      docs: {start: 110, every: 60, travel: 60},
    },
    {
      color: C.lime,
      points: [
        [1310, 240],
        [1295, 330],
        [1100, 560],
        [1075, 700],
        [1068, 760],
      ],
      stations: [0.85],
      docs: {start: 125, every: 72, travel: 110},
    },
    {
      color: C.red,
      points: [
        [1400, 240],
        [1412, 330],
        [1445, 385],
        [1540, 640],
        [1550, 760],
      ],
      stations: [0.12, 0.8],
      pill: 'block',
    },
    {
      color: C.pink,
      points: [
        [1405, 240],
        [1410, 312],
        [1640, 322],
        [1700, 380],
      ],
      stations: [0.45, 0.75],
      docs: {start: 90, every: 60, travel: 70},
    },
    // kernel → tools (allowed actions execute)
    {
      color: C.green,
      points: [
        [1490, 240],
        [1530, 292],
        [1575, 272],
        [1612, 180],
      ],
      pill: 'allow',
    },
  ],
};

export const PORTRAIT: Layout = {
  width: 1080,
  height: 1920,
  title: {x: 48, y: 86, size: 88, maxWidth: 980},
  subtitle: {x: 50, y: 312, size: 22},
  divider: {x: 50, y: 364, w: 980},
  shared: {x: 16, y: 410, w: 330, h: 120},
  rules: {x: 374, y: 396, w: 332, h: 120},
  tools: {x: 734, y: 410, w: 330, h: 120},
  review: {x: 48, y: 1668, w: 984, h: 112},
  reviewInline: true,
  infoScale: 0.82,
  reviewScale: 0.95,
  kernel: {x: 214, y: 604, w: 652, h: 196},
  label: {cx: 540, y: 826},
  agents: [
    {x: 6, y: 904, w: 344, h: 316},
    {x: 368, y: 950, w: 344, h: 316},
    {x: 730, y: 904, w: 344, h: 316},
    {x: 54, y: 1310, w: 460, h: 300},
    {x: 566, y: 1310, w: 460, h: 300},
  ],
  cta: {x: 196, y: 1776, w: 688, h: 66},
  loop: {cx: 540, y: 1814},
  footer: {x: 30, y: 1876},
  lines: [
    {
      color: C.grey,
      points: [
        [175, 515],
        [175, 610],
        [190, 650],
        [240, 680],
      ],
      stations: [0.4],
      docs: {start: 70, every: 60, travel: 70},
    },
    {
      color: C.salmon,
      points: [
        [540, 505],
        [540, 620],
      ],
      stations: [0.5],
      docs: {start: 90, every: 60, travel: 45},
    },
    {
      color: C.teal,
      points: [
        [1015, 1680],
        [1050, 1520],
        [1050, 960],
        [1010, 830],
        [850, 760],
      ],
      stations: [0.1, 0.45, 0.8],
      pill: 'signed',
    },
    {
      color: C.green,
      points: [
        [850, 660],
        [930, 650],
        [960, 590],
        [965, 515],
      ],
      pill: 'allow',
    },
    {
      color: C.gold,
      points: [
        [230, 760],
        [110, 800],
        [40, 900],
        [22, 1300],
        [60, 1680],
      ],
      stations: [0.2, 0.62, 0.9],
      pill: 'escalate',
      docs: {start: 120, every: 90, travel: 120},
    },
    {
      color: C.gold,
      points: [
        [310, 790],
        [305, 862],
        [180, 880],
        [170, 920],
      ],
      stations: [0.5],
      docs: {start: 100, every: 60, travel: 55},
    },
    {
      color: C.blue,
      points: [
        [500, 790],
        [505, 870],
        [540, 905],
        [545, 965],
      ],
      stations: [0.45],
      docs: {start: 110, every: 60, travel: 55},
    },
    {
      color: C.pink,
      points: [
        [760, 790],
        [775, 862],
        [900, 880],
        [905, 920],
      ],
      stations: [0.5],
      docs: {start: 90, every: 60, travel: 55},
    },
    {
      color: C.lime,
      points: [
        [610, 790],
        [625, 1150],
        [330, 1250],
        [300, 1325],
      ],
      stations: [0.72],
      docs: {start: 125, every: 72, travel: 100},
    },
    {
      color: C.red,
      points: [
        [690, 790],
        [760, 1000],
        [800, 1250],
        [800, 1325],
      ],
      stations: [0.15, 0.82],
      pill: 'block',
    },
  ],
};
