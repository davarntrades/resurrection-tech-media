// Renders all four masters of an authority-board video into out/:
//   node scripts/render-board.mjs DrugDiscovery [extra remotion flags]
// → out/drug-discovery-16x9.mp4, -9x16, -loop-16x9, -loop-9x16
import {execFileSync} from 'node:child_process';

const [id, ...flags] = process.argv.slice(2);
if (!id) {
  console.error('usage: node scripts/render-board.mjs <BoardId> [flags]');
  process.exit(1);
}
const slug = id.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

for (const master of ['16x9', '9x16', 'Loop-16x9', 'Loop-9x16']) {
  // loops are silent masters — no audio track at all
  const muted = master.startsWith('Loop') ? ['--muted'] : [];
  execFileSync(
    'npx',
    [
      'remotion',
      'render',
      `${id}-${master}`,
      `out/${slug}-${master.toLowerCase()}.mp4`,
      ...muted,
      ...flags,
    ],
    {stdio: 'inherit', shell: process.platform === 'win32'},
  );
}
