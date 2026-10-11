import type {SafetyScenario} from '../../components/safety/timeline';

/**
 * "Safe alone. Safe together." — local + global safety, one proposer.
 *
 * Step 3 fails on its own (local); step 5 passes on its own but would take
 * the path into Ω (global). Step 4 is close enough to Ω to need a human.
 * The flow itself lives in src/templates/SafetyFlow.tsx.
 */
export const SCENARIO: SafetyScenario = {
  title: ['Safe alone.', 'Safe together.'],
  subtitle: 'Local + global safety, before execution.',
  proposer: {
    kicker: 'Autonomous proposer',
    name: 'Ops agent',
    job: 'Proposes steps · cannot execute',
  },
  rules: {title: 'You set the rules', sub: 'forbidden states Ω · approvals'},
  tools: {title: 'Connected tools', sub: 'database · email · files'},
  review: {
    title: 'You review + approve',
    lines: ['escalations only', 'signed · bound to the action'],
  },
  omega: 'data leaves tenant',
  start: [0.04, 0.88],
  steps: [
    {
      label: 'query customers',
      action: 'db.read(customers)',
      local: {why: 'read-only · in scope'},
      global: {state: 'clear', why: 'path stays clear', to: [0.18, 0.8]},
      verdict: 'ALLOW',
      reason: 'both checks pass',
      hash: 'a41f9c',
    },
    {
      label: 'export to CSV',
      action: 'files.write(export.csv)',
      local: {why: 'workspace write'},
      global: {state: 'clear', why: 'path stays clear', to: [0.33, 0.72]},
      verdict: 'ALLOW',
      reason: 'both checks pass',
      hash: '7c2e10',
    },
    {
      label: 'drop prod table',
      action: 'db.drop(prod.orders)',
      local: {fail: 'scope', why: 'prod write · out of scope'},
      global: {state: 'clear', why: 'path stays clear', to: [0.24, 0.45]},
      verdict: 'BLOCK',
      reason: 'local check fails',
      hash: 'e9b344',
    },
    {
      label: 'attach to email',
      action: 'mail.attach(export.csv)',
      local: {why: 'draft only · in scope'},
      global: {state: 'near', why: 'one step from Ω', to: [0.58, 0.55]},
      verdict: 'ESCALATE',
      reason: 'one step from Ω · a human signs',
      hash: '3d07a2',
    },
    {
      label: 'send external',
      action: 'mail.send(@external)',
      local: {why: 'sending is permitted'},
      global: {state: 'reach', why: 'path reaches Ω', to: [0.74, 0.44]},
      verdict: 'BLOCK',
      reason: 'global check fails · path reaches Ω',
      hash: 'b58e61',
    },
  ],
};
