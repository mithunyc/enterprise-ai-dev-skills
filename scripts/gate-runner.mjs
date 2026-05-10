#!/usr/bin/env node

/**
 * gate-runner.mjs
 *
 * Reads .buildloop.yml from cwd, executes each command under `commands:`,
 * captures exit code / stdout / stderr per command, and writes:
 *   .buildloop-runs/<ISO_timestamp>/gate-results.json
 *   .buildloop-runs/<ISO_timestamp>/<name>.log
 *
 * Exits 0 if all gates pass, 1 if any fail.
 * Also checks `protected_paths` against git-tracked changes AND untracked
 * new files; any match is a violation that forces exit 1 even when commands pass.
 *
 * When invoked with --config, all execution (commands, output, git state)
 * re-roots to the directory containing the config file.
 *
 * Design constraints:
 *   - Zero external dependencies. Node built-ins only.
 *   - Narrow YAML parser supporting only the documented .buildloop.yml shape.
 *   - PowerShell / Windows compatible (shell:true spawn).
 *   - "n/a" command value → JUDGMENT: treated as no-op success (exit 0, empty output).
 *     This is documented in buildloop.yml.example as the canonical skip token.
 *
 * Usage:
 *   node scripts/gate-runner.mjs
 *   node scripts/gate-runner.mjs --config path/to/.buildloop.yml
 */

import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

// ---------------------------------------------------------------------------
// Minimal YAML parser — supports ONLY the .buildloop.yml contract shape.
//
// Supported constructs:
//   - Top-level scalar:  key: value          (with optional inline comment)
//   - Nested scalar:     [2-space indent] key: value
//   - List item:         [2-space indent] - value
//   - Full-line comments (#...)
//   - Blank lines
//   - No multi-line values, no anchors, no block scalars.
//
// Unsupported constructs not present in .buildloop.yml → not implemented.
// ---------------------------------------------------------------------------
function parseYAML(text) {
  const lines = text.split(/\r?\n/);
  const result = {};
  let currentKey = null;    // top-level key currently open
  let currentObj = null;    // nested object being populated (for `commands:`)
  let currentArr = null;    // array being populated (for `protected_paths:`)

  for (const rawLine of lines) {
    // Strip inline comments — but only after a space, to avoid stripping
    // URLs or shell commands that contain #.
    // Strategy: find first ' #' that is NOT inside a quoted string.
    const line = stripInlineComment(rawLine);

    if (line.trim() === '') continue; // blank line

    const indent = line.match(/^(\s*)/)[1].length;

    if (indent === 0) {
      // Top-level key (or key: value)
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue; // malformed — skip

      const key = line.slice(0, colonIdx).trim();
      const rawValue = line.slice(colonIdx + 1).trim();

      currentKey = key;
      currentObj = null;
      currentArr = null;

      if (rawValue === '' || rawValue === null) {
        // Value will come from indented block (object or array)
        result[key] = undefined; // placeholder; filled below
      } else {
        result[key] = unquote(rawValue);
      }
    } else if (indent >= 2) {
      const trimmed = line.trim();

      if (trimmed.startsWith('- ')) {
        // List item under currentKey
        if (result[currentKey] === undefined || !Array.isArray(result[currentKey])) {
          result[currentKey] = [];
          currentArr = result[currentKey];
          currentObj = null;
        }
        currentArr.push(unquote(trimmed.slice(2).trim()));
      } else {
        // Nested key: value under currentKey
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx === -1) continue;

        const nestedKey = trimmed.slice(0, colonIdx).trim();
        const nestedVal = trimmed.slice(colonIdx + 1).trim();

        if (result[currentKey] === undefined || Array.isArray(result[currentKey])) {
          result[currentKey] = {};
          currentObj = result[currentKey];
          currentArr = null;
        }
        currentObj[nestedKey] = unquote(nestedVal);
      }
    }
  }

  return result;
}

/**
 * Strip inline comments: remove ` # ...` suffix unless it appears inside
 * a double-quoted or single-quoted string.
 * Handles the common case; does not need to be a full YAML-compliant lexer.
 */
function stripInlineComment(line) {
  // If the line is purely a comment, return empty.
  if (line.trimStart().startsWith('#')) return '';

  // Walk the line and find the first unquoted ' #'
  let inDouble = false;
  let inSingle = false;
  for (let i = 0; i < line.length - 1; i++) {
    const ch = line[i];
    if (ch === '"' && !inSingle) { inDouble = !inDouble; continue; }
    if (ch === "'" && !inDouble) { inSingle = !inSingle; continue; }
    if (!inDouble && !inSingle && ch === ' ' && line[i + 1] === '#') {
      return line.slice(0, i);
    }
  }
  return line;
}

/**
 * Remove surrounding single or double quotes from a YAML scalar value.
 * For double-quoted strings, also unescape backslash sequences:
 *   \" → "   \\ → \
 * This matches YAML 1.1/1.2 double-quote escape behaviour for the
 * sequences present in .buildloop.yml command values.
 */
function unquote(val) {
  if (!val) return val;
  if (val.startsWith('"') && val.endsWith('"')) {
    const inner = val.slice(1, -1);
    // Unescape backslash sequences found in double-quoted YAML strings
    return inner.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }
  if (val.startsWith("'") && val.endsWith("'")) {
    // Single-quoted YAML: only '' is an escape (for a literal single quote).
    // Not needed for .buildloop.yml command values, but handle for correctness.
    return val.slice(1, -1).replace(/''/g, "'");
  }
  return val;
}

// ---------------------------------------------------------------------------
// Protected-path glob matcher
//
// Converts a .buildloop.yml protected_path pattern to a RegExp.
// Supported patterns found in the example:
//   .env*            → matches .env, .env.local, .env.production, etc.
//   **/*.key         → matches any .key file at any depth
//   **/*.pem         → same
//   **/*.p12         → same
//   .github/workflows/**  → matches everything inside that directory
//
// Conversion rules (minimal, deterministic):
//   **  → .*   (matches any path segment separator or chars)
//   *   → [^/]*  (matches within a single segment)
//   .   → \.  (literal dot)
//   other chars → escaped
// ---------------------------------------------------------------------------
function globToRegExp(pattern) {
  let src = '';
  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === '*' && pattern[i + 1] === '*') {
      // **  → match anything (including slashes)
      src += '.*';
      i += 2;
      // Skip a trailing slash after ** (e.g. "**/" becomes ".*")
      if (pattern[i] === '/') i++;
    } else if (ch === '*') {
      src += '[^/]*';
      i++;
    } else if (ch === '.') {
      src += '\\.';
      i++;
    } else if ('/+?^${}()|[]\\'.includes(ch)) {
      src += '\\' + ch;
      i++;
    } else {
      src += ch;
      i++;
    }
  }
  // Anchor: pattern must match the full path or a path segment thereof.
  // We match from the start of the relative path reported by `git diff`.
  return new RegExp('^' + src + '$');
}

/**
 * Returns list of all changed or new file paths in the working tree.
 *
 * Combines three git queries to avoid relying on HEAD (which fails in 0-commit repos):
 *   1. `git diff --cached --name-only`      — staged files (tracked changes + new additions)
 *   2. `git diff --name-only`               — unstaged changes to tracked files
 *   3. `git ls-files --others --exclude-standard` — untracked files
 *
 * JUDGMENT: The BUILD_SPEC says `git diff --name-only` but that only shows
 * unstaged changes to tracked files. Neither `git diff --name-only` nor
 * `git diff HEAD --name-only` safely catch everything in all repo states.
 * A developer who creates a protected file without running `git add`, or
 * stages it in a brand new repo, would bypass the check if we followed the
 * spec literally or relied on HEAD.
 *
 * By unioning all three sets we catch all workspace modifications.
 * This deviates from the literal spec wording but satisfies the spec intent.
 */
function getChangedAndUntrackedFiles(cwd) {
  const files = new Set();

  const runGit = (args) => {
    const res = spawnSync('git', args, { cwd, encoding: 'utf8', shell: false });
    if (!res.error && res.status === 0) {
      for (const f of res.stdout.trim().split('\n')) {
        if (f) files.add(f);
      }
    }
  };

  // 1. Staged files (modifications + new additions)
  runGit(['diff', '--cached', '--name-only']);

  // 2. Unstaged modifications to tracked files
  runGit(['diff', '--name-only']);

  // 3. Untracked files (respecting .gitignore)
  runGit(['ls-files', '--others', '--exclude-standard']);

  return [...files];
}

/** Check protected_paths against git diff. Returns array of violated paths. */
function checkProtectedPaths(protectedPatterns, changedFiles) {
  if (!Array.isArray(protectedPatterns) || protectedPatterns.length === 0) return [];
  const regexps = protectedPatterns.map(globToRegExp);
  const violated = [];
  for (const file of changedFiles) {
    for (const re of regexps) {
      if (re.test(file)) {
        violated.push(file);
        break;
      }
    }
  }
  return violated;
}

// ---------------------------------------------------------------------------
// Command execution
// ---------------------------------------------------------------------------

/**
 * JUDGMENT: "n/a" is the canonical skip token (documented in buildloop.yml.example).
 * A command set to "n/a" is treated as a no-op with exit code 0 and empty output.
 * This is logged explicitly in the gate-results so the record is auditable.
 */
const NA_TOKEN = 'n/a';

/**
 * Run a single shell command. Returns { exit_code, stdout, stderr }.
 * Uses shell:true for cross-platform compatibility (PowerShell on Windows,
 * /bin/sh on Unix). The shell is inherited from the OS environment.
 */
function runCommand(command, cwd) {
  if (command.trim().toLowerCase() === NA_TOKEN) {
    return { exit_code: 0, stdout: '[skipped: n/a]', stderr: '' };
  }

  const result = spawnSync(command, {
    cwd,
    encoding: 'utf8',
    shell: true,
    maxBuffer: 10 * 1024 * 1024, // 10 MB
    timeout: 5 * 60 * 1000,       // 5-minute safety timeout per command
  });

  return {
    exit_code: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  // --- Resolve config path and effective working directory ---
  //
  // Default: config is .buildloop.yml in process.cwd(), cwd is process.cwd().
  // With --config: config is the given path, cwd re-roots to dirname(configPath).
  //
  // JUDGMENT: The config file lives at the repo root it governs. When --config
  // points elsewhere, all execution (commands, .buildloop-runs output, git state)
  // must happen relative to that repo root, not relative to wherever the user
  // happened to invoke the script from.
  const configFlagIdx = process.argv.indexOf('--config');
  let configPath;
  let cwd;

  if (configFlagIdx !== -1 && process.argv[configFlagIdx + 1]) {
    configPath = resolve(process.argv[configFlagIdx + 1]);
    cwd = dirname(configPath);
  } else {
    cwd = process.cwd();
    configPath = join(cwd, '.buildloop.yml');
  }

  if (!existsSync(configPath)) {
    console.error(`❌ gate-runner: config not found: ${configPath}`);
    process.exit(1);
  }

  // --- Parse .buildloop.yml ---
  let config;
  try {
    const raw = readFileSync(configPath, 'utf8');
    config = parseYAML(raw);
  } catch (err) {
    console.error(`❌ gate-runner: failed to parse ${configPath}: ${err.message}`);
    process.exit(1);
  }

  const adoptionMode = config.adoption_mode ?? 'unknown';
  const commands = config.commands ?? {};
  const protectedPatterns = config.protected_paths ?? [];

  // Validate required commands keys are present (warn, don't fail)
  for (const required of ['lint', 'typecheck', 'test', 'build']) {
    if (!(required in commands)) {
      console.warn(`⚠️  gate-runner: command '${required}' not found in config — skipping`);
    }
  }

  // --- Create run directory ---
  const runId = new Date().toISOString().replace(/[:.]/g, '-');
  const runDir = join(cwd, '.buildloop-runs', runId);
  mkdirSync(runDir, { recursive: true });

  console.log(`\n🔁 gate-runner — run ${runId}`);
  console.log(`   config: ${configPath}`);
  console.log(`   runDir: ${runDir}\n`);

  // --- Check protected paths ---
  const changedFiles = getChangedAndUntrackedFiles(cwd);
  const protectedViolations = checkProtectedPaths(protectedPatterns, changedFiles);

  if (protectedViolations.length > 0) {
    console.error('🚨 Protected path violations:');
    for (const v of protectedViolations) console.error(`   ${v}`);
  }

  // --- Execute commands ---
  const commandResults = [];
  let anyFailed = false;

  for (const name of ['lint', 'typecheck', 'test', 'build']) {
    if (!(name in commands)) continue;

    const command = commands[name];
    console.log(`▶  ${name}: ${command}`);

    const { exit_code, stdout, stderr } = runCommand(command, cwd);
    const passed = exit_code === 0;
    if (!passed) anyFailed = true;

    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${status} (exit ${exit_code})`);
    if (stderr && !passed) {
      // Surface stderr on failure only — keeps output readable
      console.error(`   stderr: ${stderr.slice(0, 300)}`);
    }

    // Write per-command log
    const logContent = [
      `=== gate-runner: ${name} ===`,
      `command: ${command}`,
      `exit_code: ${exit_code}`,
      '',
      '--- stdout ---',
      stdout,
      '',
      '--- stderr ---',
      stderr,
    ].join('\n');
    writeFileSync(join(runDir, `${name}.log`), logContent, 'utf8');

    commandResults.push({
      name,
      command,
      exit_code,
      log: `${name}.log`,
    });
  }

  // --- Determine overall result ---
  const overall = (!anyFailed && protectedViolations.length === 0) ? 'PASS' : 'FAIL';

  // --- Write gate-results.json ---
  const gateResults = {
    run_id: runId,
    adoption_mode: adoptionMode,
    commands: commandResults,
    protected_paths_violated: protectedViolations,
    overall,
  };

  const resultsPath = join(runDir, 'gate-results.json');
  writeFileSync(resultsPath, JSON.stringify(gateResults, null, 2), 'utf8');

  console.log(`\n📄 gate-results.json → ${resultsPath}`);
  console.log(`   overall: ${overall}\n`);

  process.exit(overall === 'PASS' ? 0 : 1);
}

main();
