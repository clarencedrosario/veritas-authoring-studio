import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveAITarget } from './aiTargetResolver';

test('selection scope returns only the exact highlighted range', () => {
  const result = resolveAITarget('selection', 'before selected after', 7, 15);
  assert.equal(result.isValid, true);
  assert.equal(result.targetText, 'selected');
  assert.equal(result.start, 7);
  assert.equal(result.end, 15);
});

test('paragraph scope resolves only the paragraph under the caret', () => {
  const text = 'First paragraph.\n\nSecond paragraph.';
  const result = resolveAITarget('paragraph', text, text.indexOf('Second') + 2, text.indexOf('Second') + 2);
  assert.equal(result.isValid, true);
  assert.equal(result.targetText, 'Second paragraph.');
});

test('paragraph scope rejects a caret in a blank-line separator', () => {
  const result = resolveAITarget('paragraph', 'First paragraph.\n\nSecond paragraph.', 17, 17);
  assert.equal(result.isValid, false);
});

test('section scope includes nested headings but stops at the next peer heading', () => {
  const text = '# First\nOpening.\n## Detail\nEvidence.\n# Second\nClosing.';
  const result = resolveAITarget('section', text, text.indexOf('Opening') + 2, text.indexOf('Opening') + 2);
  assert.equal(result.isValid, true);
  assert.equal(result.sectionTitle, 'First');
  assert.equal(result.targetText, 'Opening.\n## Detail\nEvidence.\n');
});

test('section scope rejects text before the first section heading', () => {
  const text = 'Introduction.\n# First\nSection body.';
  const result = resolveAITarget('section', text, 2, 2);
  assert.equal(result.isValid, false);
});

test('document scope resolves the whole document', () => {
  const text = 'Complete document.';
  const result = resolveAITarget('document', text, 4, 4);
  assert.equal(result.isValid, true);
  assert.equal(result.targetText, text);
  assert.equal(result.start, 0);
  assert.equal(result.end, text.length);
});
