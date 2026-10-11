import type {Scenario} from '../../components/authority/paper';

/**
 * "Every materials agent. One authority." — materials discovery.
 *
 * Screening and simulation flow; a robot-lab synthesis run waits for a
 * signature; a compute burst past the budget cap is stopped before it starts.
 */
export const SCENARIO: Scenario = {
  title: ['Every materials agent.', 'One authority.'],
  subtitle: 'Governed AI for materials discovery.',
  shared: {title: 'Shared context', sub: 'structures · datasets · Ω'},
  rules: {title: 'You set the rules', sub: 'budget caps / lab sign-off'},
  tools: {title: 'Connected systems', sub: 'HPC · robot lab · ELN'},
  review: {
    title: 'You review + approve',
    lines: ['lab runs and spend only', 'signed · expiring · bound to the run'],
  },
  agents: [
    {
      name: 'Screen',
      job: 'Search the space',
      tools: ['query', 'filter', 'rank'],
      verdict: 'ALLOW',
      result: 'Shortlist',
      reach: 3,
      doneAt: 241,
    },
    {
      name: 'Simulate',
      job: 'Predict properties',
      tools: ['model', 'relax', 'score'],
      verdict: 'ALLOW',
      result: 'Stable phases',
      reach: 3,
      doneAt: 299,
    },
    {
      name: 'Synthesis',
      job: 'Run the robot lab',
      tools: ['recipe', 'mix', 'anneal'],
      verdict: 'ESCALATE',
      result: 'Sign-off',
      reach: 2,
      doneAt: 195,
    },
    {
      name: 'Measure',
      job: 'Characterize samples',
      tools: ['XRD', 'SEM', 'fit'],
      verdict: 'ALLOW',
      result: 'Phase confirmed',
      reach: 3,
      doneAt: 345,
    },
    {
      name: 'Compute',
      job: 'Scale the jobs',
      tools: ['queue', 'burst', 'spend'],
      verdict: 'BLOCK',
      result: 'Over budget',
      reach: 1.4,
      doneAt: 224,
      face: 'visor',
    },
  ],
};
