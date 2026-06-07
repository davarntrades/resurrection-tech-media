// Regenerates src/branding/fonts.ts by base64-embedding the woff2 files in
// public/branding/fonts/. Run after swapping the font files:
//   node scripts/embed-fonts.mjs
import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const b64 = (rel) =>
  readFileSync(join(root, rel)).toString('base64');

const sans = b64('public/branding/fonts/Geist-Variable.woff2');
const mono = b64('public/branding/fonts/GeistMono-Variable.woff2');

const out = `/**
 * Self-hosted Geist fonts, embedded as base64 woff2 data URIs.
 *
 * Generated from public/branding/fonts/*.woff2 (sourced from the \`geist\` npm
 * package) by scripts/embed-fonts.mjs — run that script if you swap the fonts.
 *
 * Why data URIs and not staticFile()? During a concurrent video render, many
 * Chrome tabs hit the static-file server for the same woff2 at once and a
 * request can stall, tripping the font delayRender() timeout. A data URI is
 * resolved in-process, so FontFace.load() never touches the network and renders
 * stay deterministic at any concurrency.
 */
export const GEIST_SANS_WOFF2 = "data:font/woff2;base64,${sans}";
export const GEIST_MONO_WOFF2 = "data:font/woff2;base64,${mono}";
`;

writeFileSync(join(root, 'src/branding/fonts.ts'), out);
console.log('Wrote src/branding/fonts.ts');
