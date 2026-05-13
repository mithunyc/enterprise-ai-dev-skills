#!/usr/bin/env node

/**
 * tests/capabilities.test.mjs
 *
 * Test harness for detect-capabilities.mjs.
 * Uses dependency injection (mock exec, mock cwd) so no test depends on
 * host Docker state, real binaries, or CI runner configuration.
 *
 * 8 eval scenarios from BUILD_SPEC Phase 5:
 *   1. greenfield-empty
 *   2. brownfield-broken-build
 *   3. governed-brownfield (synthetic fixture)
 *   4. not-code-repo (synthetic fixture)
 *   5. docker-not-installed (mocked)
 *   6. docker-installed (mocked)
 *   7. obsidian-missing
 *   8. monorepo-with-docs (synthetic fixture)
 *
 * Also validates templates/capabilities.example.json against
 * schemas/capabilities.schema.json.
 */

import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { detect } from '../scripts/detect-capabilities.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

function check(label, fn) {
  try {
    fn();
    console.log(`PASS ${label}`);
    passed++;
  } catch (error) {
    console.error(`FAIL ${label}`);
    console.error(`     ${error.message}`);
    failed++;
  }
}

/**
 * Create a mock exec function that returns controlled results.
 * commandMap: { 'git': { status, stdout, stderr }, 'docker': { ... }, ... }
 * Keys can be the binary name; the mock matches on the first argument (cmd).
 */
function createMockExec(commandMap = {}) {
  return (cmd, args, opts) => {
    const entry = commandMap[cmd];
    if (entry) {
      // If entry is a function, call it with args for more granular control
      if (typeof entry === 'function') {
        return entry(cmd, args, opts);
      }
      return {
        status: entry.status ?? 0,
        stdout: entry.stdout ?? '',
        stderr: entry.stderr ?? '',
        error: entry.error ?? null,
      };
    }
    // Default: command not found
    return { status: 1, stdout: '', stderr: `${cmd}: not found`, error: new Error(`${cmd}: not found`) };
  };
}

/**
 * Create a temporary fixture directory with given files.
 * Returns the absolute path. Caller is responsible for cleanup.
 */
function createFixture(name, files = {}) {
  const dir = join(ROOT, '.tmp-test-fixtures', name);
  mkdirSync(dir, { recursive: true });

  for (const [relPath, content] of Object.entries(files)) {
    const absPath = join(dir, relPath);
    mkdirSync(dirname(absPath), { recursive: true });
    writeFileSync(absPath, content, 'utf8');
  }

  return dir;
}

function cleanupFixtures() {
  const fixtureRoot = join(ROOT, '.tmp-test-fixtures');
  if (existsSync(fixtureRoot)) {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
}

// Standard mock that simulates git present, docker absent, graphify absent
function standardMockExec(gitOverrides = {}) {
  return createMockExec({
    git: (cmd, args) => {
      if (args.includes('--is-inside-work-tree')) {
        return { status: 0, stdout: 'true\n', stderr: '', error: null };
      }
      if (args.includes('--show-current')) {
        return { status: 0, stdout: gitOverrides.branch || 'main\n', stderr: '', error: null };
      }
      if (args.includes('--porcelain')) {
        return { status: 0, stdout: gitOverrides.dirty ? 'M file.txt\n' : '', stderr: '', error: null };
      }
      if (args[0] === 'remote') {
        return { status: 0, stdout: gitOverrides.remote || 'origin\n', stderr: '', error: null };
      }
      return { status: 0, stdout: '', stderr: '', error: null };
    },
    docker: { status: 1, stdout: '', stderr: 'docker: not found', error: new Error('not found') },
    graphify: { status: 1, stdout: '', stderr: 'graphify: not found', error: new Error('not found') },
  });
}

// ---------------------------------------------------------------------------
// Schema validation helper (lightweight, no external deps)
// ---------------------------------------------------------------------------

function validateAgainstSchema(obj, schema, path = '') {
  if (schema.const !== undefined) {
    assert.equal(obj, schema.const, `${path}: expected const ${schema.const}, got ${obj}`);
    return;
  }

  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const actualType = obj === null ? 'null' : Array.isArray(obj) ? 'array' : typeof obj;
    assert.ok(
      types.includes(actualType),
      `${path}: expected type ${types.join('|')}, got ${actualType}`,
    );
  }

  if (schema.enum) {
    assert.ok(schema.enum.includes(obj), `${path}: value ${obj} not in enum ${JSON.stringify(schema.enum)}`);
  }

  if (schema.type === 'object' || (Array.isArray(schema.type) && schema.type.includes('object'))) {
    if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
      if (schema.required) {
        for (const key of schema.required) {
          assert.ok(key in obj, `${path}: missing required key "${key}"`);
        }
      }
      if (schema.properties) {
        for (const [key, propSchema] of Object.entries(schema.properties)) {
          if (key in obj) {
            validateAgainstSchema(obj[key], propSchema, `${path}.${key}`);
          }
        }
      }
      if (schema.additionalProperties === false && schema.properties) {
        const allowed = new Set(Object.keys(schema.properties));
        for (const key of Object.keys(obj)) {
          assert.ok(allowed.has(key), `${path}: unexpected property "${key}"`);
        }
      }
    }
  }

  if (schema.type === 'array' && Array.isArray(obj) && schema.items) {
    for (let i = 0; i < obj.length; i++) {
      validateAgainstSchema(obj[i], schema.items, `${path}[${i}]`);
    }
  }
}

// ---------------------------------------------------------------------------
// Test: schema and example validation
// ---------------------------------------------------------------------------

check('schemas/capabilities.schema.json is valid JSON', () => {
  const raw = readFileSync(join(ROOT, 'schemas', 'capabilities.schema.json'), 'utf8');
  const schema = JSON.parse(raw);
  assert.equal(schema.$schema, 'http://json-schema.org/draft-07/schema#');
  assert.equal(schema.title, 'BuildloopCapabilities');
  assert.equal(schema.additionalProperties, false);
});

check('templates/capabilities.example.json validates against schema', () => {
  const schema = JSON.parse(readFileSync(join(ROOT, 'schemas', 'capabilities.schema.json'), 'utf8'));
  const example = JSON.parse(readFileSync(join(ROOT, 'templates', 'capabilities.example.json'), 'utf8'));
  validateAgainstSchema(example, schema, 'example');
});

// ---------------------------------------------------------------------------
// Scenario 1: greenfield-empty
// ---------------------------------------------------------------------------

check('scenario 1: greenfield-empty', () => {
  const dir = createFixture('greenfield-empty', {
    '.git/HEAD': 'ref: refs/heads/main\n',
  });

  const result = detect({
    cwd: dir,
    exec: standardMockExec(),
  });

  assert.equal(result.schema_version, '1.0.0');
  assert.equal(result.environment.package_manager, 'none');
  assert.equal(result.git.available, true);
  assert.equal(result.buildloop.yml_present, false);
  assert.equal(result.buildloop.manifest_present, false);
  assert.equal(result.docker.available, false);
  assert.equal(result.graphify.available, false);
  assert.equal(result.obsidian.configured, false);
});

// ---------------------------------------------------------------------------
// Scenario 2: brownfield-broken-build
// ---------------------------------------------------------------------------

check('scenario 2: brownfield-broken-build', () => {
  const dir = createFixture('brownfield-broken-build', {
    '.git/HEAD': 'ref: refs/heads/main\n',
    'package.json': '{ "name": "broken-app" }',
    'package-lock.json': '{}',
    'AGENTS.md': '# AGENTS.md\n',
  });

  const result = detect({
    cwd: dir,
    exec: standardMockExec(),
  });

  assert.equal(result.environment.package_manager, 'npm');
  assert.equal(result.git.available, true);
  // Should detect AGENTS.md → no governance gap
  assert.equal(result.buildloop.yml_present, false);
  assert.equal(result.buildloop.manifest_present, false);
});

// ---------------------------------------------------------------------------
// Scenario 3: governed-brownfield (synthetic fixture)
// ---------------------------------------------------------------------------

check('scenario 3: governed-brownfield', () => {
  const dir = createFixture('governed-brownfield', {
    '.git/HEAD': 'ref: refs/heads/develop\n',
    'package.json': '{ "name": "governed-app" }',
    'AGENTS.md': '# AGENTS.md\n## Rules\n',
    '.buildloop.yml': 'adoption_mode: brownfield\nrisk_level: medium\ncommands:\n  test: "npm test"\n',
    'orchestrator-manifest.json': '{ "schema_version": "1.0.0" }',
    'scripts/gate-runner.mjs': '// gate-runner stub\n',
    '.github/workflows/ci.yml': '# CI stub\n',
  });

  const result = detect({
    cwd: dir,
    exec: standardMockExec({ branch: 'develop\n' }),
  });

  assert.equal(result.git.branch, 'develop');
  assert.equal(result.buildloop.yml_present, true);
  assert.equal(result.buildloop.manifest_present, true);
  assert.equal(result.buildloop.gate_runner_available, true);
  assert.ok(result.buildloop.ci_workflows.length > 0);
  assert.ok(result.buildloop.ci_workflows.includes('.github/workflows/ci.yml'));
});

// ---------------------------------------------------------------------------
// Scenario 4: not-code-repo (synthetic fixture)
// ---------------------------------------------------------------------------

check('scenario 4: not-code-repo', () => {
  const dir = createFixture('not-code-repo', {
    'README.md': '# Just a README\n',
  });

  // No .git directory — git check fails
  const noGitExec = createMockExec({
    git: { status: 128, stdout: '', stderr: 'fatal: not a git repository', error: null },
    docker: { status: 1, stdout: '', stderr: 'not found', error: new Error('not found') },
    graphify: { status: 1, stdout: '', stderr: 'not found', error: new Error('not found') },
  });

  const result = detect({
    cwd: dir,
    exec: noGitExec,
  });

  assert.equal(result.environment.package_manager, 'none');
  assert.equal(result.git.available, false);
  assert.equal(result.git.branch, null);
  assert.equal(result.buildloop.yml_present, false);
});

// ---------------------------------------------------------------------------
// Scenario 5: docker-not-installed (mocked)
// ---------------------------------------------------------------------------

check('scenario 5: docker-not-installed', () => {
  const dir = createFixture('docker-missing', {
    '.git/HEAD': 'ref: refs/heads/main\n',
    'package.json': '{ "name": "app" }',
  });

  const noDockerExec = createMockExec({
    git: (cmd, args) => {
      if (args.includes('--is-inside-work-tree')) return { status: 0, stdout: 'true\n', stderr: '', error: null };
      if (args.includes('--show-current')) return { status: 0, stdout: 'main\n', stderr: '', error: null };
      if (args.includes('--porcelain')) return { status: 0, stdout: '', stderr: '', error: null };
      if (args[0] === 'remote') return { status: 0, stdout: 'origin\n', stderr: '', error: null };
      return { status: 0, stdout: '', stderr: '', error: null };
    },
    docker: { status: 1, stdout: '', stderr: 'docker: command not found', error: new Error('ENOENT') },
    graphify: { status: 1, stdout: '', stderr: 'not found', error: new Error('not found') },
  });

  const result = detect({ cwd: dir, exec: noDockerExec });

  assert.equal(result.docker.available, false);
  assert.equal(result.docker.version, null);
  // Should NOT crash — graceful degradation
  assert.equal(result.schema_version, '1.0.0');
});

// ---------------------------------------------------------------------------
// Scenario 6: docker-installed (mocked)
// ---------------------------------------------------------------------------

check('scenario 6: docker-installed', () => {
  const dir = createFixture('docker-present', {
    '.git/HEAD': 'ref: refs/heads/main\n',
    'package.json': '{ "name": "app" }',
  });

  const withDockerExec = createMockExec({
    git: (cmd, args) => {
      if (args.includes('--is-inside-work-tree')) return { status: 0, stdout: 'true\n', stderr: '', error: null };
      if (args.includes('--show-current')) return { status: 0, stdout: 'main\n', stderr: '', error: null };
      if (args.includes('--porcelain')) return { status: 0, stdout: '', stderr: '', error: null };
      if (args[0] === 'remote') return { status: 0, stdout: 'origin\n', stderr: '', error: null };
      return { status: 0, stdout: '', stderr: '', error: null };
    },
    docker: { status: 0, stdout: 'Docker version 24.0.7, build abcdef0', stderr: '', error: null },
    graphify: { status: 1, stdout: '', stderr: 'not found', error: new Error('not found') },
  });

  const result = detect({ cwd: dir, exec: withDockerExec });

  assert.equal(result.docker.available, true);
  assert.equal(result.docker.version, '24.0.7');
});

// ---------------------------------------------------------------------------
// Scenario 7: obsidian-missing
// ---------------------------------------------------------------------------

check('scenario 7: obsidian-missing', () => {
  // Save and clear env var if it exists
  const savedVault = process.env.BUILDLOOP_OBSIDIAN_VAULT;
  delete process.env.BUILDLOOP_OBSIDIAN_VAULT;

  try {
    const dir = createFixture('obsidian-missing', {
      '.git/HEAD': 'ref: refs/heads/main\n',
      'package.json': '{ "name": "app" }',
    });

    const result = detect({
      cwd: dir,
      exec: standardMockExec(),
    });

    assert.equal(result.obsidian.configured, false);
    assert.equal(result.obsidian.vault_path, null);
    // Should NOT crash — graceful degradation
    assert.equal(result.schema_version, '1.0.0');
  } finally {
    // Restore env var
    if (savedVault !== undefined) {
      process.env.BUILDLOOP_OBSIDIAN_VAULT = savedVault;
    }
  }
});

// ---------------------------------------------------------------------------
// Scenario 8: monorepo-with-docs (synthetic fixture)
// ---------------------------------------------------------------------------

check('scenario 8: monorepo-with-docs', () => {
  const dir = createFixture('monorepo', {
    '.git/HEAD': 'ref: refs/heads/main\n',
    'package.json': '{ "name": "monorepo-root", "workspaces": ["packages/*"] }',
    'packages/core/package.json': '{ "name": "@monorepo/core" }',
    'packages/ui/package.json': '{ "name": "@monorepo/ui" }',
    'docs/README.md': '# Documentation\n',
    'docs/api.md': '# API Reference\n',
    '.buildloop.yml': 'adoption_mode: brownfield\nrisk_level: low\n',
    'AGENTS.md': '# AGENTS.md\n',
  });

  const result = detect({
    cwd: dir,
    exec: standardMockExec(),
  });

  // Should detect as a code repo (has package.json), not false-positive as not-code
  assert.equal(result.environment.package_manager, 'npm');
  assert.equal(result.git.available, true);
  assert.equal(result.buildloop.yml_present, true);
  assert.equal(result.schema_version, '1.0.0');
});

// ---------------------------------------------------------------------------
// Validate detect() output shape against schema
// ---------------------------------------------------------------------------

check('detect() output validates against schema', () => {
  const schema = JSON.parse(readFileSync(join(ROOT, 'schemas', 'capabilities.schema.json'), 'utf8'));
  const dir = createFixture('schema-validation', {
    '.git/HEAD': 'ref: refs/heads/main\n',
    'package.json': '{ "name": "test-app" }',
  });

  const result = detect({
    cwd: dir,
    exec: standardMockExec(),
  });

  validateAgainstSchema(result, schema, 'detect-output');
});

// ---------------------------------------------------------------------------
// Regression: P1 — .buildloop/ must be gitignored
// ---------------------------------------------------------------------------

check('regression P1: .buildloop/ is in .gitignore', () => {
  const gitignore = readFileSync(join(ROOT, '.gitignore'), 'utf8');
  assert.ok(
    gitignore.includes('.buildloop/'),
    '.gitignore must include .buildloop/ to prevent machine-local data leaks from --write',
  );
});

// ---------------------------------------------------------------------------
// Regression: P2 — shell field must be a string, never null
// ---------------------------------------------------------------------------

check('regression P2: shell field is always a string', () => {
  const savedShell = process.env.SHELL;
  const savedComSpec = process.env.ComSpec;
  delete process.env.SHELL;
  delete process.env.ComSpec;

  try {
    const dir = createFixture('shell-missing', {
      '.git/HEAD': 'ref: refs/heads/main\n',
    });

    const result = detect({
      cwd: dir,
      exec: standardMockExec(),
    });

    assert.equal(typeof result.environment.shell, 'string', 'shell must be a string, not null');
    assert.equal(result.environment.shell, 'unknown');
  } finally {
    if (savedShell !== undefined) process.env.SHELL = savedShell;
    if (savedComSpec !== undefined) process.env.ComSpec = savedComSpec;
  }
});

// ---------------------------------------------------------------------------
// Cleanup and report
// ---------------------------------------------------------------------------

cleanupFixtures();

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exitCode = 1;
}
