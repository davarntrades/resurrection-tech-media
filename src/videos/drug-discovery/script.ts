import type {Scenario} from '../../components/authority/paper';

/**
 * "Every discovery agent. One authority." — drug discovery.
 *
 * Five agents across the pipeline. Desk work flows; booking the wet lab waits
 * for a scientist's signature; compound IP never leaves for a partner unredacted.
 */
export const SCENARIO: Scenario = {
  title: ['Every discovery agent.', 'One authority.'],
  subtitle: 'Governed AI for drug discovery.',
  shared: {title: 'Shared context', sub: 'targets · assays · Ω'},
  rules: {title: 'You set the rules', sub: 'IP stays in / lab sign-off'},
  tools: {title: 'Connected systems', sub: 'ELN · LIMS · CRO portal'},
  review: {
    title: 'You review + approve',
    lines: [
      'wet-lab and spend decisions only',
      'scientist-signed · bound to the run',
    ],
  },
  agents: [
    {
      name: 'Targets',
      job: 'Find the target',
      tools: ['search', 'read', 'cite'],
      verdict: 'ALLOW',
      result: 'Target brief',
      reach: 3,
      doneAt: 241,
    },
    {
      name: 'Design',
      job: 'Propose molecules',
      tools: ['generate', 'score', 'rank'],
      verdict: 'ALLOW',
      result: 'Shortlist',
      reach: 3,
      doneAt: 299,
    },
    {
      name: 'Assay',
      job: 'Book the wet lab',
      tools: ['plan', 'book', 'run'],
      verdict: 'ESCALATE',
      result: 'Sign-off',
      reach: 2,
      doneAt: 195,
    },
    {
      name: 'Analysis',
      job: 'Read the results',
      tools: ['ingest', 'fit', 'report'],
      verdict: 'ALLOW',
      result: 'Assay report',
      reach: 3,
      doneAt: 345,
    },
    {
      name: 'Partners',
      job: 'Share with CROs',
      tools: ['request', 'bundle', 'send'],
      verdict: 'BLOCK',
      result: 'IP egress',
      reach: 2,
      doneAt: 224,
      face: 'visor',
    },
  ],
};
