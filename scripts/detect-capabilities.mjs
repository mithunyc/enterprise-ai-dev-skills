#!/usr/bin/env node

/**
 * detect-capabilities.mjs
 *
 * Read-only capability detection for Buildloop.
 * Detects what tools, governance files, and environment features are available
 * in a given repo directory. Outputs JSON to stdout.
 *
 * Design constraints (BUILD_SPEC Phase 5):
 *   - Zero external dependencies. Node built-ins only.
 *   - Export detect(options) for testability.
 *   - options.cwd defaults to process.cwd().
 *   - options.exec defaults to spawnSync — all binary detection goes through it.
 *   - Read-only. No installs. No network. No Docker pull. No vault scan.
 *   - No process.exit() inside detect(). CLI wrapper may set exit code at end.
 *   - --write flag writes .buildloop/capabilities.json (only write operation).
 *   - Cross-platform: Windows + macOS + Linux.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { platform } from 'node:os';

/**
 * Detect capabilities in a given directory.
 *
 * @param {object} [options]
 * @param {string} [options.cwd] - Directory to detect in. Defaults to process.cwd().
 * @param {Function} [options.exec] - Command executor. Defaults to spawnSync.
 *   Signature: exec(cmd, args, opts) → { status, stdout, stderr, error }
 * @returns {object} Capabilities JSON object matching capabilities.schema.json.
 */
export function detect(options = {}) {
  const cwd = resolve(options.cwd || process.cwd());
  const exec = options.exec || defaultExec;

  return {
    schema_version: '1.0.0',
    detected_at: new Date().toISOString(),
    environment: detectEnvironment(cwd, exec),
    git: detectGit(cwd, exec),
    docker: detectDocker(exec),
    graphify: detectGraphify(exec),
    obsidian: detectObsidian(cwd),
    buildloop: detectBuildloop(cwd),
    recommended_action: determineRecommendedAction(cwd),
  };
}

// ---------------------------------------------------------------------------
// Default exec wrapper around spawnSync
// ---------------------------------------------------------------------------

function defaultExec(cmd, args, opts) {
  return spawnSync(cmd, args, {
    encoding: 'utf8',
    timeout: 10_000,
    windowsHide: true,
    ...opts,
  });
}

// ---------------------------------------------------------------------------
// Environment detection
// ---------------------------------------------------------------------------

function detectEnvironment(cwd, exec) {
  return {
    node_version: process.version,
    package_manager: detectPackageManager(cwd),
    os: normalizeOS(platform()),
    shell: process.env.SHELL || process.env.ComSpec || 'unknown',
  };
}

function detectPackageManager(cwd) {
  // Check lock files first (most reliable signal)
  if (existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock'))) return 'bun';
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn';
  if (existsSync(join(cwd, 'package-lock.json'))) return 'npm';
  if (existsSync(join(cwd, 'package.json'))) return 'npm'; // package.json without lockfile → default npm

  // Non-JS ecosystems
  if (existsSync(join(cwd, 'Cargo.toml')) || existsSync(join(cwd, 'Cargo.lock'))) return 'cargo';
  if (existsSync(join(cwd, 'go.mod'))) return 'go';
  if (existsSync(join(cwd, 'requirements.txt')) || existsSync(join(cwd, 'setup.py')) || existsSync(join(cwd, 'pyproject.toml'))) return 'pip';
  if (existsSync(join(cwd, 'Makefile'))) return 'make';

  return 'none';
}

function normalizeOS(p) {
  if (p === 'win32') return 'windows';
  if (p === 'darwin') return 'darwin';
  if (p === 'linux') return 'linux';
  return 'unknown';
}

// ---------------------------------------------------------------------------
// Git detection
// ---------------------------------------------------------------------------

function detectGit(cwd, exec) {
  const gitCheck = exec('git', ['rev-parse', '--is-inside-work-tree'], { cwd });
  if (gitCheck.status !== 0) {
    return { available: false, branch: null, clean: null, has_remote: null };
  }

  const branchResult = exec('git', ['branch', '--show-current'], { cwd });
  const branch = branchResult.status === 0 ? (branchResult.stdout || '').trim() || null : null;

  const statusResult = exec('git', ['status', '--porcelain'], { cwd });
  const clean = statusResult.status === 0 ? (statusResult.stdout || '').trim() === '' : null;

  const remoteResult = exec('git', ['remote'], { cwd });
  const has_remote = remoteResult.status === 0 ? (remoteResult.stdout || '').trim() !== '' : null;

  return { available: true, branch, clean, has_remote };
}

// ---------------------------------------------------------------------------
// Docker detection (all via exec for testability)
// ---------------------------------------------------------------------------

function detectDocker(exec) {
  const result = exec('docker', ['--version'], {});
  if (result.status !== 0 || result.error) {
    return { available: false, version: null };
  }

  const stdout = (result.stdout || '').trim();
  // Parse "Docker version 24.0.0, build ..." → "24.0.0"
  const match = stdout.match(/Docker version\s+([\d.]+)/i);
  return {
    available: true,
    version: match ? match[1] : stdout || null,
  };
}

// ---------------------------------------------------------------------------
// Graphify detection (all via exec for testability)
// ---------------------------------------------------------------------------

function detectGraphify(exec) {
  const result = exec('graphify', ['--version'], {});
  return { available: result.status === 0 && !result.error };
}

// ---------------------------------------------------------------------------
// Obsidian detection (env var or manifest config — no vault scan)
// ---------------------------------------------------------------------------

function detectObsidian(cwd) {
  // Check env var first
  const envVault = process.env.BUILDLOOP_OBSIDIAN_VAULT;
  if (envVault) {
    return { configured: true, vault_path: envVault };
  }

  // Check orchestrator-manifest.json for external_memory.obsidian config
  const manifestPath = join(cwd, 'orchestrator-manifest.json');
  if (existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      const obsidianConfig = manifest?.external_memory?.obsidian;
      if (obsidianConfig?.vault_path) {
        return { configured: true, vault_path: obsidianConfig.vault_path };
      }
    } catch {
      // Malformed manifest — treat as not configured
    }
  }

  return { configured: false, vault_path: null };
}

// ---------------------------------------------------------------------------
// Buildloop governance detection (file-system only)
// ---------------------------------------------------------------------------

function detectBuildloop(cwd) {
  const yml_present = existsSync(join(cwd, '.buildloop.yml'));
  const manifest_present = existsSync(join(cwd, 'orchestrator-manifest.json'));

  // Detect CI workflow files
  const ci_workflows = [];
  const workflowDir = join(cwd, '.github', 'workflows');
  if (existsSync(workflowDir)) {
    try {
      const files = readdirSync(workflowDir);
      for (const f of files) {
        if (f.endsWith('.yml') || f.endsWith('.yaml')) {
          ci_workflows.push(`.github/workflows/${f}`);
        }
      }
    } catch {
      // Permission or FS error — leave empty
    }
  }

  // Gate-runner available if scripts/gate-runner.mjs exists
  const gate_runner_available = existsSync(join(cwd, 'scripts', 'gate-runner.mjs'));

  return { yml_present, manifest_present, ci_workflows, gate_runner_available };
}

// ---------------------------------------------------------------------------
// Recommended action (simple heuristic based on detected state)
// ---------------------------------------------------------------------------

function determineRecommendedAction(cwd) {
  const hasYml = existsSync(join(cwd, '.buildloop.yml'));
  const hasManifest = existsSync(join(cwd, 'orchestrator-manifest.json'));
  const hasAgents = existsSync(join(cwd, 'AGENTS.md'));
  const hasPackage = existsSync(join(cwd, 'package.json'));
  const hasGit = existsSync(join(cwd, '.git'));

  if (!hasGit) return 'Initialize a git repository with git init.';
  if (!hasPackage && !existsSync(join(cwd, 'Cargo.toml')) && !existsSync(join(cwd, 'go.mod'))) {
    return 'No project detected. Create a project or initialize a package manager.';
  }
  if (!hasYml) return 'Create a .buildloop.yml to configure quality gates.';
  if (!hasManifest && hasAgents) return 'Consider generating an orchestrator-manifest.json for governed brownfield mode.';
  return 'Run buildloop gates to validate your quality pipeline.';
}

// ---------------------------------------------------------------------------
// CLI wrapper
// ---------------------------------------------------------------------------

function cli() {
  const args = process.argv.slice(2);
  const writeFlag = args.includes('--write');

  // Support --cwd flag for CLI usage
  let cwd = process.cwd();
  const cwdIdx = args.indexOf('--cwd');
  if (cwdIdx !== -1 && args[cwdIdx + 1]) {
    cwd = resolve(args[cwdIdx + 1]);
  }

  let result;
  try {
    result = detect({ cwd });
  } catch (err) {
    console.error(`detect-capabilities: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  const json = JSON.stringify(result, null, 2);

  if (writeFlag) {
    const outDir = join(cwd, '.buildloop');
    mkdirSync(outDir, { recursive: true });
    const outPath = join(outDir, 'capabilities.json');
    writeFileSync(outPath, json + '\n', 'utf8');
    console.log(`Wrote ${outPath}`);
  } else {
    console.log(json);
  }
}

// Run CLI when executed directly (not imported)
const isMain = process.argv[1] && (
  resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'))
  || process.argv[1] === new URL(import.meta.url).pathname
);
if (isMain) {
  cli();
}
