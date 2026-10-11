import type {FlowScenario} from '../../components/flow/timeline';

/**
 * The reference architecture as a board video: one autonomous AI proposer,
 * Morrison Runtime Governance (local + global admissibility), the three
 * verdicts, decision-bound evidence and the mediated execution boundary.
 * The flow itself lives in src/templates/GovernanceFlow.tsx.
 */
export const SCENARIO: FlowScenario = {
  title: ['Every action.', 'One authority.'],
  subtitle: 'Independent pre-execution authority for AI.',
  proposer: {
    kicker: '01 / Autonomous AI proposer',
    name: 'Agent',
    job: 'Generates a candidate action',
  },
  kernel: {
    title: 'Morrison Runtime Governance',
    sub: 'Independent pre-execution authority',
  },
  local: {
    title: 'Local admissibility',
    question: 'Is this proposed action permitted?',
  },
  global: {
    title: 'Global admissibility',
    question: 'Is the resulting trajectory permitted?',
  },
  evidence: 'Decision-bound evidence recorded',
  boundary: {
    title: 'Mediated execution boundary',
    sub: 'Only authorised actions can reach the protected resource',
    resources: ['database', 'email', 'files'],
  },
  review: {
    title: 'You review + approve',
    lines: ['escalations only', 'signed'],
  },
  footnote:
    'Conceptual architecture, not a claim that every deployment path has already been verified as completely mediated.',
  actions: [
    {
      chip: 'read customers',
      action: 'db.read(customers)',
      local: {ok: true, why: 'permitted'},
      global: {state: 'clear', why: 'trajectory permitted'},
      verdict: 'ALLOW',
      resource: 0,
      hash: 'a41f9c',
    },
    {
      chip: 'drop prod table',
      action: 'db.drop(prod.orders)',
      local: {ok: false, why: 'not permitted · prod write'},
      global: {state: 'clear', why: 'trajectory permitted'},
      verdict: 'BLOCK',
      hash: 'e9b344',
    },
    {
      chip: 'attach to email',
      action: 'mail.attach(export.csv)',
      local: {ok: true, why: 'permitted'},
      global: {state: 'near', why: 'one step from Ω'},
      verdict: 'ESCALATE',
      resource: 1,
      hash: '3d07a2',
    },
    {
      chip: 'send external',
      action: 'mail.send(@external)',
      local: {ok: true, why: 'permitted'},
      global: {state: 'reach', why: 'reaches forbidden state Ω'},
      verdict: 'BLOCK',
      hash: 'b58e61',
    },
    {
      chip: 'write report',
      action: 'files.write(report.md)',
      local: {ok: true, why: 'permitted'},
      global: {state: 'clear', why: 'trajectory permitted'},
      verdict: 'ALLOW',
      resource: 2,
      hash: '7c2e10',
    },
  ],
};
