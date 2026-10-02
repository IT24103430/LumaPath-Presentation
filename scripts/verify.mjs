import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const story = JSON.parse(readFileSync(new URL('../src/story.json', import.meta.url), 'utf8'));
const source = readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.equal(story.length, 7, 'The presentation must contain seven chapters');
assert.equal(new Set(story.map((scene) => scene.id)).size, story.length, 'Chapter IDs must be unique');
for (const scene of story) {
  assert.match(scene.id, /^[a-z]+$/);
  assert.ok(scene.label && scene.title && scene.narration, `${scene.id} needs label, title, and narration`);
  assert.ok(source.includes(`chapter('${scene.id}'`), `Missing scene markup for ${scene.id}`);
}
assert.match(html, /name="viewport"/);
assert.match(source, /prefers-reduced-motion/);
assert.match(source, /aria-label="Presentation chapters"/);
console.log('Static presentation checks passed.');
