#!/usr/bin/env node

/**
 * validate-manifest.mjs
 *
 * Validates orchestrator-manifest.schema.json is valid JSON Schema (draft-07),
 * and that templates/orchestrator-manifest.example.json validates against it.
 *
 * Zero external dependencies. Uses only Node built-ins.
 * Does NOT scan target repos. Does NOT infer governance.
 *
 * Usage: node scripts/validate-manifest.mjs
 * Exit 0 = all checks pass. Exit 1 = failure.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert/strict';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SCHEMA_PATH = resolve(ROOT, 'schemas/orchestrator-manifest.schema.json');
const EXAMPLE_PATH = resolve(ROOT, 'templates/orchestrator-manifest.example.json');

let failures = 0;

function check(label, fn) {
  try {
    fn();
    console.log(`  ✅ ${label}`);
  } catch (err) {
    console.error(`  ❌ ${label}: ${err.message}`);
    failures++;
  }
}

// --- Test 1: Schema is valid JSON ---
console.log('\n📋 Schema validation:');

let schema;
check('schemas/orchestrator-manifest.schema.json is valid JSON', () => {
  const raw = readFileSync(SCHEMA_PATH, 'utf8');
  schema = JSON.parse(raw);
});

check('Schema has $schema field (draft-07)', () => {
  assert.ok(schema.$schema, 'Missing $schema');
  assert.ok(schema.$schema.includes('draft-07'), `Expected draft-07, got: ${schema.$schema}`);
});

check('Schema has title', () => {
  assert.equal(schema.title, 'OrchestratorManifest');
});

check('Schema type is object', () => {
  assert.equal(schema.type, 'object');
});

check('Schema has required fields', () => {
  const expected = [
    'schema_version', 'generated_at', 'generated_by',
    'repo_profile', 'governance', 'execution',
    'quality_gates', 'health', 'token_policy', 'decision'
  ];
  for (const field of expected) {
    assert.ok(schema.required.includes(field), `Missing required field: ${field}`);
  }
});

check('Schema disallows additional properties at root', () => {
  assert.equal(schema.additionalProperties, false);
});

// --- Test 2: Example is valid JSON ---
console.log('\n📋 Example validation:');

let example;
check('templates/orchestrator-manifest.example.json is valid JSON', () => {
  const raw = readFileSync(EXAMPLE_PATH, 'utf8');
  example = JSON.parse(raw);
});

check('Example has schema_version 1.0.0', () => {
  assert.equal(example.schema_version, '1.0.0');
});

check('Example has all required top-level fields', () => {
  for (const field of schema.required) {
    assert.ok(field in example, `Missing required field in example: ${field}`);
  }
});

// --- Test 3: Structural validation of example against schema ---
console.log('\n📋 Structural checks (example vs schema):');

check('repo_profile.repo_type is a valid enum value', () => {
  const valid = schema.properties.repo_profile.properties.repo_type.enum;
  assert.ok(valid.includes(example.repo_profile.repo_type),
    `Invalid repo_type: ${example.repo_profile.repo_type}`);
});

check('repo_profile.confidence is a valid enum value', () => {
  const valid = schema.properties.repo_profile.properties.confidence.enum;
  assert.ok(valid.includes(example.repo_profile.confidence),
    `Invalid confidence: ${example.repo_profile.confidence}`);
});

check('health fields use valid enum values', () => {
  const healthProps = schema.properties.health.properties;
  for (const [key, schemaDef] of Object.entries(healthProps)) {
    if (schemaDef.enum && key in example.health) {
      assert.ok(schemaDef.enum.includes(example.health[key]),
        `Invalid health.${key}: ${example.health[key]}, expected one of: ${schemaDef.enum.join(', ')}`);
    }
  }
});

check('decision.recommended_path is a valid enum value', () => {
  const valid = schema.properties.decision.properties.recommended_path.enum;
  assert.ok(valid.includes(example.decision.recommended_path),
    `Invalid recommended_path: ${example.decision.recommended_path}`);
});

check('token_policy.load_policy is a valid enum value', () => {
  const valid = schema.properties.token_policy.properties.load_policy.enum;
  assert.ok(valid.includes(example.token_policy.load_policy),
    `Invalid load_policy: ${example.token_policy.load_policy}`);
});

check('governance.authority_chain is non-empty array', () => {
  assert.ok(Array.isArray(example.governance.authority_chain));
  assert.ok(example.governance.authority_chain.length > 0, 'Authority chain is empty');
});

check('Each authority_chain entry has required fields', () => {
  for (const entry of example.governance.authority_chain) {
    assert.ok('path' in entry, 'Missing path in authority_chain entry');
    assert.ok('role' in entry, 'Missing role in authority_chain entry');
  }
});

check('active_overrides have freshness metadata', () => {
  for (const override of example.governance.active_overrides) {
    assert.ok('freshness' in override, 'Missing freshness in override');
    assert.ok('last_verified' in override.freshness, 'Missing last_verified in freshness');
  }
});

check('lessons.auto_commit is false', () => {
  if (example.governance.lessons) {
    assert.equal(example.governance.lessons.auto_commit, false,
      'lessons.auto_commit must be false — lessons are never auto-committed');
  }
});

check('external_memory.obsidian.advisory_only is true', () => {
  if (example.external_memory?.obsidian) {
    assert.equal(example.external_memory.obsidian.advisory_only, true,
      'Obsidian must be advisory_only');
  }
});

// --- Test 4: No private project names ---
console.log('\n📋 Privacy check:');

check('No private project names in schema', () => {
  const raw = readFileSync(SCHEMA_PATH, 'utf8');
  const banned = ['Arkaan', 'UnionForge', 'PowerSync', 'Supabase', 'SPRINT-ZERO', 'GodMode'];
  for (const word of banned) {
    assert.ok(!raw.includes(word), `Schema contains banned word: ${word}`);
  }
});

check('No private project names in example', () => {
  const raw = readFileSync(EXAMPLE_PATH, 'utf8');
  const banned = ['Arkaan', 'UnionForge', 'PowerSync', 'Supabase', 'SPRINT-ZERO', 'GodMode'];
  for (const word of banned) {
    assert.ok(!raw.includes(word), `Example contains banned word: ${word}`);
  }
});

// --- Summary ---
console.log(`\n${'='.repeat(50)}`);
if (failures === 0) {
  console.log('✅ All manifest validation checks passed.');
  process.exit(0);
} else {
  console.error(`❌ ${failures} check(s) failed.`);
  process.exit(1);
}
