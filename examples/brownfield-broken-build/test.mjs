// Acme Widget App — test suite
// This test is INTENTIONALLY BROKEN to simulate a failing brownfield project.
// Running this file will exit with code 1.
//
// This is a FIXTURE for the enterprise-ai-dev brownfield diagnostic example.
// See README.md in this directory for context.

import assert from 'node:assert/strict';

// This assertion is deliberately wrong: 1 !== 2.
// The agent's Step 1B diagnostic will catch this failure and set:
//   health.tests: FAIL
//   stabilization_required: true
assert.strictEqual(1, 2, 'widget count should match — this test is intentionally broken');

console.log('PASS (this line is never reached)');
