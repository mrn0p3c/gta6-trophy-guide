// Leonida Legend — hand-in program for the gta6-trophy-guide-01 entry.
// The guide itself is the static site in app/ (open app/index.html in a
// browser; it needs no build step and no network). This program is only
// the courier: it copies app/ and screenshots/ into the output folder
// and asks the vendored make.fun library to write dossier.json there —
// the bundle of screenshots, load sizes and source the judge reads.
// vendor/makefun-frontend.ts stays untouched on purpose, because the
// scorer rebuilds the dossier with its own copy and compares bytes.
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Preview the guide itself with: node serve.ts  (http://localhost:8080)

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy one directory of the entry into the output folder, if it exists.
function copyIntoOutput(name) {
  const from = join(repoRoot, name);
  if (!existsSync(from)) return;
  cpSync(from, join(outputDir, name), { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
copyIntoOutput('app');
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
copyIntoOutput('screenshots');

// The caps below are the scorer's own limits, passed through unchanged:
// the dossier text is capped at 160 KiB, screenshots at 4 files of at
// most 256 KiB each, and app/ at 993 entries and 48 MiB in total.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log('Leonida Legend handed in: app/, screenshots/ and dossier.json written to ' + outputDir);
