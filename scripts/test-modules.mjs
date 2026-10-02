import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const story = JSON.parse(readFileSync(new URL('../src/story.json', import.meta.url), 'utf8'));
const expected = ['opening', 'overload', 'intelligence', 'action', 'replanning', 'readiness', 'closing'];
assert.deepEqual(story.map((scene) => scene.id), expected);
assert.ok(story.every((scene, index) => scene.number === String(index + 1).padStart(2, '0')));
assert.ok(story.every((scene) => scene.narration.split(/\s+/).length >= 15));
console.log('Story structure tests passed.');
