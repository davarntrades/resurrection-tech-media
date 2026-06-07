import type {Pillar} from '../../scenes/PillarsScene';

/**
 * All copy + timing for the flagship explainer lives here as data. To spin up a
 * new video, copy this folder and edit this file — no component changes needed.
 */
export type ExplainerScript = {
  /** Per-scene duration in frames (at the composition's fps). */
  scenes: {
    title: number;
    drift: number;
    solution: number;
    pillars: number;
    outro: number;
  };
  title: {tagline: string};
  drift: {lines: [string, string]};
  solution: {lines: [string, string]};
  pillars: {heading: string; items: Pillar[]};
  outro: {brand: string; cta: string; url: string};
};

export const runtimeGovernanceScript: ExplainerScript = {
  scenes: {
    title: 120,
    drift: 600,
    solution: 480,
    pillars: 300,
    outro: 150,
  },
  title: {
    tagline: 'Runtime Governance for Autonomous Systems',
  },
  drift: {
    lines: [
      'Autonomous systems act faster than humans can review.',
      'When they drift, the damage is already done.',
    ],
  },
  solution: {
    lines: [
      'Resurrection Tech governs them in real time —',
      'keeping every system inside provable safety bounds.',
    ],
  },
  pillars: {
    heading: 'Three pillars of runtime governance',
    items: [
      {
        icon: 'monitor',
        title: 'Monitor',
        desc: 'Track every system state against its reachable set, live, at machine speed.',
      },
      {
        icon: 'constrain',
        title: 'Constrain',
        desc: 'Intercept unsafe trajectories before they cross into the danger region Ω.',
      },
      {
        icon: 'audit',
        title: 'Audit',
        desc: 'Produce a provable, replayable record of every decision and intervention.',
      },
    ],
  },
  outro: {
    brand: 'Resurrection Tech™',
    cta: 'Request a Runtime Audit',
    url: 'resurrection-tech.com',
  },
};

/** Total frames across all scenes — the composition length. */
export const totalDuration = (s: ExplainerScript): number =>
  s.scenes.title +
  s.scenes.drift +
  s.scenes.solution +
  s.scenes.pillars +
  s.scenes.outro;
