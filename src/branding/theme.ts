/**
 * Resurrection Tech™ — brand tokens.
 *
 * Single source of truth for every video. Colors mirror the live site
 * (`resurrection-tech-enterprise`, styles/design-system.css). Touch a value
 * here and every composition updates.
 */
import {loadFont} from '@remotion/fonts';
import {GEIST_MONO_WOFF2, GEIST_SANS_WOFF2} from './fonts';

// Self-hosted Geist (variable woff2), embedded as base64 data URIs so the font
// is resolved in-process — no static-file fetch. This keeps renders fast,
// fully offline, and deterministic at any concurrency (a networked woff2 can
// stall a Chrome tab and trip the font delayRender() timeout). The on-disk
// copies live in public/branding/fonts; regenerate fonts.ts with
// `node scripts/embed-fonts.mjs` after swapping them.
// `format` must be explicit: @remotion/fonts derives it from the URL extension,
// which a data: URI doesn't have.
loadFont({
  family: 'Geist',
  url: GEIST_SANS_WOFF2,
  format: 'woff2',
  weight: '100 900',
});
loadFont({
  family: 'Geist Mono',
  url: GEIST_MONO_WOFF2,
  format: 'woff2',
  weight: '100 900',
});

/** Font families, ready to drop into a `fontFamily` style. */
export const FONTS = {
  sans: 'Geist, "Helvetica Neue", Arial, sans-serif',
  mono: 'Geist Mono, ui-monospace, "SF Mono", Menlo, monospace',
} as const;

/** Brand palette — deep graphite surfaces, silver-white ink, electric-blue accent. */
export const COLORS = {
  // Surfaces
  bg: '#08090b', // near-black base
  bg1: '#0b0d10', // page
  panel: '#0f1216', // cards
  panel2: '#14181d', // raised / hover
  panel3: '#1a1f25',

  // Lines
  line: 'rgba(255,255,255,0.07)',
  line2: 'rgba(255,255,255,0.12)',
  lineStrong: 'rgba(255,255,255,0.20)',

  // Text
  ink: '#f3f5f7', // primary silver-white
  ink2: '#aab2bd', // secondary
  ink3: '#6b7480', // tertiary / labels
  ink4: '#474e58', // faint

  // Accent — electric blue with a faint purple lean in glows
  accent: '#4c7dff',
  accentBright: '#6f97ff',
  accentDim: '#2f4fa6',
  accentPurple: '#6d5cff',
  accentGlow: 'rgba(76,125,255,0.45)',

  // Omega — forbidden / reachable-danger region
  omega: '#e5484d',
  omegaDim: '#5a1f22',
  omegaGlow: 'rgba(229,72,77,0.40)',

  // Safe / OK
  ok: '#3fb27f',
  okDim: '#163d2e',
  okGlow: 'rgba(63,178,127,0.35)',
} as const;

/** Canonical video config — 1920×1080 @ 30fps. */
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

export type BrandColor = keyof typeof COLORS;
