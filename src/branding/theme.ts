/**
 * Resurrection Tech™ — brand tokens.
 *
 * Single source of truth for every video. Colors mirror the live site
 * (`resurrection-tech-enterprise`, styles/design-system.css). Touch a value
 * here and every composition updates.
 */
import {GEIST_MONO_WOFF2, GEIST_SANS_WOFF2} from './fonts';

// Register the embedded Geist faces with plain CSS @font-face using base64 data
// URIs. Why not @remotion/fonts loadFont()? Its FontFace.load() gate registers a
// delayRender() that, when a Chrome tab is recycled mid-render, re-fires on the
// fresh page and can stall until the render-killing timeout. A CSS @font-face has
// no network fetch (data URI) and no mandatory delayRender, so it can't fail a
// render; `font-display: block` avoids any fallback-font flash. Determinism is
// handled by the bounded useFontsReady() gate (see ExplainerTemplate).
//
// The on-disk copies live in public/branding/fonts; regenerate fonts.ts with
// `node scripts/embed-fonts.mjs` after swapping them. Italic ℛ is synthesized
// from the upright face (Geist ships no italic axis), so only normal faces are
// declared.
if (
  typeof document !== 'undefined' &&
  !document.getElementById('rt-brand-fonts')
) {
  const style = document.createElement('style');
  style.id = 'rt-brand-fonts';
  style.textContent = `
@font-face{font-family:'Geist';font-style:normal;font-weight:100 900;font-display:block;src:url(${GEIST_SANS_WOFF2}) format('woff2');}
@font-face{font-family:'Geist Mono';font-style:normal;font-weight:100 900;font-display:block;src:url(${GEIST_MONO_WOFF2}) format('woff2');}
`;
  document.head.appendChild(style);
}

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
