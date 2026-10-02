import { readFileSync, writeFileSync } from 'node:fs';

const story = JSON.parse(readFileSync(new URL('../src/story.json', import.meta.url), 'utf8'));
const output = `# LumaPath AI — presentation script\n\nThis script follows the seven scroll chapters. The on-screen presentation is an interactive, illustrative prototype.\n\n${story.map((scene) => `## ${scene.number} — ${scene.label}\n\n**On screen:** ${scene.title}\n\n**Voiceover:** ${scene.narration}`).join('\n\n')}\n`;
const path = new URL('../PRESENTATION_SCRIPT.md', import.meta.url);
if (process.argv.includes('--check')) {
  let current = '';
  try { current = readFileSync(path, 'utf8'); } catch { /* A missing export is a check failure. */ }
  if (current !== output) {
    console.error('PRESENTATION_SCRIPT.md is out of date. Run npm run script:export.');
    process.exitCode = 1;
  } else console.log('Presentation script is current.');
} else {
  writeFileSync(path, output);
  console.log('Exported PRESENTATION_SCRIPT.md.');
}
