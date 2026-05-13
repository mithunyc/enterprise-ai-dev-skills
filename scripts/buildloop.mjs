#!/usr/bin/env node

/**
 * buildloop.mjs
 *
 * Supervised/read-only headless CLI for Buildloop.
 * Thin router over existing scripts — no autonomous commands.
 *
 * Design constraints (BUILD_SPEC Phase 6):
 *   - Zero external dependencies. Node built-ins only.
 *   - gate-runner.mjs and validate-manifest.mjs invoked via spawnSync (they call process.exit).
 *   - detect-capabilities.mjs imported directly (exports function, no process.exit).
 *   - No process.exit() in command handlers — use process.exitCode.
 *   - Unknown command and no command exit 2 (invalid arguments).
 *   - Every spawnSync call checks result.error before reading result.status.
 *   - capabilities and doctor wrap detect() in try/catch.
 *   - review resolves gate-results.json deterministically (see cmdReview).
 *   - No writes except explicit `capabilities --write`. No network. No autonomous commands.
 *
 * Commands:
 *   buildloop capabilities  -- detect repo capabilities, print JSON
 *   buildloop doctor        -- human-readable health report
 *   buildloop manifest      -- validate curated-skills manifest
 *   buildloop gates         -- run quality gates (.buildloop.yml)
 *   buildloop review        -- review latest gate-results.json
 *   buildloop help          -- print usage
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { detect } from './detect-capabilities.mjs';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));

// Paths to scripts that call process.exit() — MUST be invoked via spawnSync.
const GATE_RUNNER = join(__dirname, 'gate-runner.mjs');
const VALIDATE_MANIFEST = join(__dirname, 'validate-manifest.mjs');

const TIMESTAMP_RE = /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}/;

// ---------------------------------------------------------------------------
// Argument helpers
// ---------------------------------------------------------------------------

/**
 * Extract the value of a named flag from args array.
 * extractFlag(['--cwd', '/some/path', '--write'], '--cwd') → '/some/path'
 * Returns null if the flag is absent or has no value.
 */
function extractFlag(args, flag) {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return null;
  return args[idx + 1];
}

function hasFlag(args, flag) {
  return args.includes(flag);
}

// ---------------------------------------------------------------------------
// Command: capabilities
// ---------------------------------------------------------------------------

function cmdCapabilities(args, cwd) {
  const writeFlag = hasFlag(args, '--write');

  let result;
  try {
    result = detect({ cwd });
  } catch (err) {
    console.error(`buildloop capabilities: detection failed: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  const json = JSON.stringify(result, null, 2);

  if (writeFlag) {
    // Passthrough --write behaviour: write to .buildloop/capabilities.json.
    // We re-invoke detect-capabilities.mjs via spawnSync so the write logic
    // (mkdirSync etc.) stays in one place and avoids duplicating FS writes here.
    const cwdArgs = ['--cwd', cwd, '--write'];
    const r = spawnSync(process.execPath, [join(__dirname, 'detect-capabilities.mjs'), ...cwdArgs], {
      stdio: 'inherit',
      encoding: 'utf8',
    });
    if (r.error) {
      console.error(`buildloop capabilities --write: spawn failed: ${r.error.message}`);
      process.exitCode = 1;
      return;
    }
    process.exitCode = r.status ?? 1;
  } else {
    console.log(json);
  }
}

// ---------------------------------------------------------------------------
// Command: doctor
// ---------------------------------------------------------------------------

function cmdDoctor(args, cwd) {
  const jsonFlag = hasFlag(args, '--json');

  let result;
  try {
    result = detect({ cwd });
  } catch (err) {
    console.error(`buildloop doctor: detection failed: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  if (jsonFlag) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const bool = (v) => (v ? '✅' : '❌');
  const nullable = (v) => (v === null || v === undefined ? 'unknown' : String(v));
  const e = result.environment;
  const g = result.git;
  const d = result.docker;
  const bl = result.buildloop;
  const ob = result.obsidian;
  const gr = result.graphify;

  const lines = [
    'buildloop doctor — repo health check',
    '',
    'Environment',
    `  Node:     ${e.node_version}  ✅`,
    `  OS:       ${e.os}`,
    `  Shell:    ${e.shell}`,
    `  Package:  ${e.package_manager}`,
    '',
    'Git',
    `  Available:  ${bool(g.available)}`,
    `  Branch:     ${nullable(g.branch)}`,
    `  Clean:      ${g.clean === null ? 'unknown' : bool(g.clean)}`,
    `  Remote:     ${g.has_remote === null ? 'unknown' : bool(g.has_remote)}`,
    '',
    'Docker',
    `  Available:  ${bool(d.available)}`,
    ...(d.available ? [`  Version:    ${nullable(d.version)}`] : []),
    '',
    'Governance',
    `  .buildloop.yml:     ${bool(bl.yml_present)}`,
    `  Manifest:           ${bool(bl.manifest_present)}`,
    `  Gate runner:        ${bool(bl.gate_runner_available)}`,
    `  CI workflows:       ${bl.ci_workflows.length ? bl.ci_workflows.join(', ') : 'none'}`,
    '',
    `Obsidian:   ${ob.configured ? `configured (${nullable(ob.vault_path)})` : 'not configured'}`,
    `Graphify:   ${gr.available ? 'available' : 'not available'}`,
    '',
    `Recommendation: ${result.recommended_action}`,
  ];

  console.log(lines.join('\n'));
}

// ---------------------------------------------------------------------------
// Command: manifest
// ---------------------------------------------------------------------------

function cmdManifest(cwd) {
  const r = spawnSync(process.execPath, [VALIDATE_MANIFEST], {
    stdio: 'inherit',
    cwd,
    encoding: 'utf8',
  });

  if (r.error) {
    console.error(`buildloop manifest: spawn failed: ${r.error.message}`);
    process.exitCode = 1;
    return;
  }

  process.exitCode = r.status ?? 1;
}

// ---------------------------------------------------------------------------
// Command: gates
// ---------------------------------------------------------------------------

function cmdGates(args, cwd) {
  const configValue = extractFlag(args, '--config');
  const childArgs = [GATE_RUNNER];
  if (configValue) {
    childArgs.push('--config', configValue);
  }

  const r = spawnSync(process.execPath, childArgs, {
    stdio: 'inherit',
    cwd,
    encoding: 'utf8',
  });

  if (r.error) {
    console.error(`buildloop gates: spawn failed: ${r.error.message}`);
    process.exitCode = 1;
    return;
  }

  process.exitCode = r.status ?? 1;
}

// ---------------------------------------------------------------------------
// Command: review
// ---------------------------------------------------------------------------

/**
 * Deterministic gate-results.json resolution (from phase6-plan.md §4.2 review):
 *
 * 1. --results <path>: resolve relative to cwd unless absolute; must exist.
 * 2. <cwd>/gate-results.json: direct file in cwd.
 * 3. <cwd>/.buildloop-runs/ timestamp dirs (YYYY-MM-DDTHH-MM-SS...):
 *    sorted lexicographically descending → first dir containing gate-results.json.
 * 4. Fallback: all subdirs sorted by mtimeMs descending → first containing gate-results.json.
 * 5. No file found → print clear message, exit 1.
 *
 * Never recurses outside <cwd>. Never follows paths from untrusted JSON.
 */
function resolveResultsPath(args, cwd) {
  // 1. --results flag
  const explicit = extractFlag(args, '--results');
  if (explicit) {
    const p = isAbsolute(explicit) ? explicit : resolve(cwd, explicit);
    if (!existsSync(p)) {
      console.error(`buildloop review: --results path not found: ${p}`);
      return null;
    }
    return p;
  }

  // 2. <cwd>/gate-results.json
  const direct = join(cwd, 'gate-results.json');
  if (existsSync(direct)) return direct;

  // 3 & 4. .buildloop-runs/ subdirectories
  const runsDir = join(cwd, '.buildloop-runs');
  if (!existsSync(runsDir)) return null;

  let entries;
  try {
    entries = readdirSync(runsDir);
  } catch {
    return null;
  }

  // Split into timestamp-named and other dirs
  const tsDirs = [];
  const otherDirs = [];

  for (const entry of entries) {
    const absEntry = join(runsDir, entry);
    try {
      if (!statSync(absEntry).isDirectory()) continue;
    } catch {
      continue;
    }
    if (TIMESTAMP_RE.test(entry)) {
      tsDirs.push(entry);
    } else {
      otherDirs.push(absEntry);
    }
  }

  // 3. Sort timestamp dirs lexicographically descending
  tsDirs.sort((a, b) => b.localeCompare(a));
  for (const dir of tsDirs) {
    const candidate = join(runsDir, dir, 'gate-results.json');
    if (existsSync(candidate)) return candidate;
  }

  // 4. Fallback: sort other dirs by mtime descending
  otherDirs.sort((a, b) => {
    try {
      return statSync(b).mtimeMs - statSync(a).mtimeMs;
    } catch {
      return 0;
    }
  });
  for (const dir of otherDirs) {
    const candidate = join(dir, 'gate-results.json');
    if (existsSync(candidate)) return candidate;
  }

  return null;
}

function cmdReview(args, cwd) {
  const resultsPath = resolveResultsPath(args, cwd);

  if (!resultsPath) {
    console.error('buildloop review: no gate-results.json found.');
    console.error('  Run `buildloop gates` first to generate results.');
    process.exitCode = 1;
    return;
  }

  let gateResults;
  try {
    gateResults = JSON.parse(readFileSync(resultsPath, 'utf8'));
  } catch (err) {
    console.error(`buildloop review: failed to parse ${resultsPath}: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  const overall = gateResults.overall ?? 'UNKNOWN';
  const commands = Array.isArray(gateResults.commands) ? gateResults.commands : [];
  const violations = Array.isArray(gateResults.protected_paths_violated)
    ? gateResults.protected_paths_violated
    : [];

  console.log(`buildloop review — gate results`);
  console.log(`  file:    ${resultsPath}`);
  console.log(`  run_id:  ${gateResults.run_id ?? 'unknown'}`);
  console.log(`  overall: ${overall}`);
  console.log('');

  for (const cmd of commands) {
    const status = cmd.exit_code === 0 ? 'PASS' : 'FAIL';
    console.log(`  ${status}  ${cmd.name}: ${cmd.command}`);
  }

  if (violations.length > 0) {
    console.log('');
    console.log('  Protected path violations:');
    for (const v of violations) console.log(`    ${v}`);
  }

  process.exitCode = overall === 'PASS' ? 0 : 1;
}

// ---------------------------------------------------------------------------
// Command: help
// ---------------------------------------------------------------------------

function cmdHelp() {
  console.log([
    'buildloop — supervised/read-only headless CLI',
    '',
    'Usage:',
    '  node scripts/buildloop.mjs <command> [flags]',
    '',
    'Commands:',
    '  capabilities   Detect repo capabilities, print JSON',
    '                 Flags: --cwd <path>  --write',
    '  doctor         Human-readable health report',
    '                 Flags: --cwd <path>  --json',
    '  manifest       Validate curated-skills manifest (delegates to validate-manifest.mjs)',
    '                 Flags: --cwd <path>',
    '  gates          Run quality gates from .buildloop.yml (delegates to gate-runner.mjs)',
    '                 Flags: --cwd <path>  --config <path>',
    '  review         Review latest gate-results.json',
    '                 Flags: --cwd <path>  --results <path>',
    '  help           Print this message',
    '',
    'Exit codes:',
    '  0  Success / PASS',
    '  1  Failure / FAIL / error',
    '  2  Invalid arguments (unknown or missing command)',
    '',
    'No autonomous commands. No deploy. No auto-fix. Supervised-only.',
  ].join('\n'));
}

// ---------------------------------------------------------------------------
// Unknown / missing command
// ---------------------------------------------------------------------------

function cmdUnknown(command) {
  if (command) {
    console.error(`buildloop: unknown command: ${command}`);
  } else {
    console.error('buildloop: no command given');
  }
  console.error('');
  cmdHelp();
  process.exitCode = 2;
}

// ---------------------------------------------------------------------------
// CLI entry
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Resolve --cwd early; commands that don't use it ignore it.
  const cwd = resolve(extractFlag(args, '--cwd') || process.cwd());

  switch (command) {
    case 'capabilities': return cmdCapabilities(args, cwd);
    case 'doctor':       return cmdDoctor(args, cwd);
    case 'manifest':     return cmdManifest(cwd);
    case 'gates':        return cmdGates(args, cwd);
    case 'review':       return cmdReview(args, cwd);
    case 'help':
    case '--help':
    case '-h':           return cmdHelp();
    default:             return cmdUnknown(command);
  }
}

// ---------------------------------------------------------------------------
// isMain guard — exact pattern from detect-capabilities.mjs (Windows-safe)
// ---------------------------------------------------------------------------

const isMain = process.argv[1] && (
  resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
  || process.argv[1] === new URL(import.meta.url).pathname
);
if (isMain) { main(); }
