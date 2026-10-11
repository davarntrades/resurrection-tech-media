/**
 * Geometry for the local + global safety flow, per master.
 *   landscape — proposer left, governance centre, execution boundary right
 *   portrait  — the same flow top to bottom, boundary as a horizontal wall
 *
 * Lines are drawn under the cards (see authority/MetroMap); the boundary wall
 * is drawn over the lines so allowed traffic visibly passes through its gate.
 */
import type {Line, Pt, Rect} from '../authority/layouts';

export type SafetyLayout = {
  width: number;
  height: number;
  title: {x: number; y: number; size: number; maxWidth: number};
  subtitle: {x: number; y: number; size: number};
  divider: {x: number; y: number; w: number};
  proposer: Rect;
  /** Landscape only. */
  rules?: Rect;
  kernel: Rect;
  evidence: Rect;
  tools: Rect;
  review: Rect;
  reviewInline: boolean;
  infoScale: number;
  /** The mediated execution boundary: a straight wall from a to b. */
  wall: {a: Pt; b: Pt};
  /** Where allowed traffic crosses the wall. */
  gate: Pt;
  /** Where blocked traffic stops against the wall. */
  blockAt: Pt;
  wallLabel: Pt;
  cta: Rect;
  loop: {cx: number; y: number};
  footer: {x: number; y: number};
  lines: Line[];
};

const C = {
  blue: '#86aef2',
  salmon: '#f09a90',
  grey: '#bdbab5',
  gold: '#efbe55',
  teal: '#86d3bd',
  red: '#ef7287',
  green: '#2fae5c',
};

export const SAFETY_LANDSCAPE: SafetyLayout = {
  width: 1920,
  height: 1080,
  title: {x: 52, y: 84, size: 86, maxWidth: 560},
  subtitle: {x: 54, y: 296, size: 22},
  divider: {x: 54, y: 350, w: 530},
  proposer: {x: 50, y: 392, w: 540, h: 470},
  rules: {x: 50, y: 890, w: 540, h: 110},
  kernel: {x: 650, y: 64, w: 820, h: 566},
  evidence: {x: 650, y: 676, w: 820, h: 268},
  tools: {x: 1600, y: 96, w: 300, h: 136},
  review: {x: 1560, y: 700, w: 330, h: 180},
  reviewInline: false,
  infoScale: 1,
  wall: {a: [1530, 70], b: [1530, 632]},
  gate: [1530, 170],
  blockAt: [1514, 430],
  wallLabel: [1530, 32],
  cta: {x: 650, y: 962, w: 820, h: 56},
  loop: {cx: 1060, y: 990},
  footer: {x: 72, y: 1036},
  lines: [
    {
      color: C.blue,
      points: [
        [585, 610],
        [616, 590],
        [622, 470],
        [660, 446],
      ],
      stations: [0.5],
      pill: 'propose',
      pillTravel: 24,
    },
    {
      color: C.salmon,
      points: [
        [585, 945],
        [616, 925],
        [624, 650],
        [640, 610],
        [670, 600],
      ],
      stations: [0.3, 0.7],
      docs: {start: 60, every: 90, travel: 80},
    },
    {
      color: C.grey,
      points: [
        [880, 620],
        [880, 690],
      ],
      pill: 'evidence',
      pillTravel: 20,
    },
    {
      color: C.green,
      points: [
        [1462, 170],
        [1530, 170],
        [1575, 152],
        [1612, 152],
      ],
      pill: 'allow',
      pillTravel: 30,
    },
    {
      color: C.red,
      points: [
        [1462, 430],
        [1514, 430],
      ],
      pill: 'block',
      pillTravel: 16,
    },
    {
      color: C.gold,
      points: [
        [1400, 622],
        [1410, 668],
        [1470, 690],
        [1520, 740],
        [1580, 762],
      ],
      stations: [0.55],
      pill: 'escalate',
      pillTravel: 40,
    },
    {
      color: C.teal,
      points: [
        [1580, 806],
        [1500, 784],
        [1440, 708],
        [1372, 676],
        [1360, 622],
      ],
      stations: [0.4],
      pill: 'signed',
      pillTravel: 40,
    },
  ],
};

export const SAFETY_PORTRAIT: SafetyLayout = {
  width: 1080,
  height: 1920,
  title: {x: 48, y: 70, size: 88, maxWidth: 980},
  subtitle: {x: 50, y: 290, size: 22},
  divider: {x: 50, y: 338, w: 980},
  proposer: {x: 48, y: 378, w: 984, h: 300},
  kernel: {x: 48, y: 740, w: 984, h: 520},
  evidence: {x: 48, y: 1512, w: 984, h: 264},
  review: {x: 48, y: 1352, w: 470, h: 128},
  tools: {x: 562, y: 1352, w: 470, h: 128},
  reviewInline: false,
  infoScale: 0.86,
  wall: {a: [64, 1306], b: [1016, 1306]},
  gate: [840, 1306],
  blockAt: [600, 1292],
  wallLabel: [300, 1306],
  cta: {x: 196, y: 1796, w: 688, h: 56},
  loop: {cx: 540, y: 1824},
  footer: {x: 30, y: 1878},
  lines: [
    {
      color: C.blue,
      points: [
        [540, 670],
        [540, 750],
      ],
      pill: 'propose',
      pillTravel: 24,
    },
    {
      color: C.blue,
      points: [
        [1028, 520],
        [1056, 560],
        [1056, 900],
        [1028, 940],
      ],
      stations: [0.5],
      docs: {start: 60, every: 90, travel: 80},
    },
    {
      color: C.grey,
      points: [
        [1028, 1180],
        [1058, 1214],
        [1058, 1484],
        [1028, 1530],
      ],
      stations: [0.5],
      pill: 'evidence',
      pillTravel: 30,
    },
    {
      color: C.green,
      points: [
        [840, 1250],
        [840, 1362],
      ],
      pill: 'allow',
      pillTravel: 26,
    },
    {
      color: C.red,
      points: [
        [600, 1250],
        [600, 1292],
      ],
      pill: 'block',
      pillTravel: 14,
    },
    {
      color: C.gold,
      points: [
        [52, 1170],
        [22, 1206],
        [22, 1350],
        [52, 1392],
      ],
      stations: [0.5],
      pill: 'escalate',
      pillTravel: 36,
    },
    {
      color: C.teal,
      points: [
        [52, 1430],
        [36, 1400],
        [36, 1240],
        [52, 1214],
      ],
      pill: 'signed',
      pillTravel: 36,
    },
  ],
};
