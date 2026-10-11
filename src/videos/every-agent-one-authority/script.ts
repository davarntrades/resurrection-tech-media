import type {Scenario} from '../../components/authority/paper';

/**
 * "Every agent. One authority." — the general-purpose board.
 *
 * Copy one of these scenario files to make a sibling video; the board itself
 * (layout, motion, kernel, timings) lives in src/templates/AuthorityBoard.tsx.
 */
export const SCENARIO: Scenario = {
  title: ['Every agent.', 'One authority.'],
  subtitle: 'A governed operating system for AI agents.',
  shared: {title: 'Shared context', sub: 'policies · tenants · Ω'},
  rules: {title: 'You set the rules', sub: 'forbidden states / approvals'},
  tools: {title: 'Connected tools', sub: 'APIs · shell · payments'},
  review: {
    title: 'You review + approve',
    lines: ['escalations only', 'signed · expiring · bound to the action'],
  },
  agents: [
    {
      name: 'Research',
      job: 'Gather evidence',
      tools: ['search', 'read', 'brief'],
      verdict: 'ALLOW',
      result: 'Cited brief',
      reach: 3,
      doneAt: 241,
    },
    {
      name: 'Code',
      job: 'Build and test',
      tools: ['scope', 'code', 'tests'],
      verdict: 'ALLOW',
      result: 'Tested PR',
      reach: 3,
      doneAt: 299,
    },
    {
      name: 'Finance',
      job: 'Move the money',
      tools: ['invoice', 'match', 'transfer'],
      verdict: 'ESCALATE',
      result: 'Held',
      reach: 2,
      doneAt: 195,
    },
    {
      name: 'Support',
      job: 'Answer customers',
      tools: ['ticket', 'draft', 'reply'],
      verdict: 'ALLOW',
      result: 'Reply drafted',
      reach: 3,
      doneAt: 345,
    },
    {
      name: 'Ops',
      job: 'Keep the infra running',
      tools: ['plan', 'diff', 'deploy'],
      verdict: 'BLOCK',
      result: 'Prod delete',
      reach: 1.4,
      doneAt: 224,
      face: 'visor',
    },
  ],
};
