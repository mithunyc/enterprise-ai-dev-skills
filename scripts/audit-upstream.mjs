#!/usr/bin/env node

/**
 * audit-upstream.mjs
 *
 * Reads curated-skills.json and compares each upstream repo's pinned commit
 * to the current remote HEAD. This script is read-only: it never updates
 * curated-skills.json and never writes replacement SHAs.
 *
 * Usage: node scripts/audit-upstream.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const MANIFEST_PATH = resolve(ROOT, 'curated-skills.json');

function readManifest() {
  const raw = readFileSync(MANIFEST_PATH, 'utf8');
  return JSON.parse(raw);
}

function isFullSha(value) {
  return /^[0-9a-f]{40}$/i.test(value);
}

function readRemoteHead(repo) {
  const remoteUrl = `https://github.com/${repo}.git`;

  try {
    const stdout = execFileSync(
      'git',
      ['ls-remote', remoteUrl, 'HEAD'],
      {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      }
    );

    const lines = stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length !== 1) {
      return {
        remoteUrl,
        remoteHead: null,
        error: `ambiguous ls-remote output (${lines.length} lines)`
      };
    }

    const parts = lines[0].split(/\s+/);
    const [sha, ref] = parts;

    if (parts.length < 2 || ref !== 'HEAD' || !isFullSha(sha)) {
      return {
        remoteUrl,
        remoteHead: null,
        error: 'ambiguous ls-remote output'
      };
    }

    return {
      remoteUrl,
      remoteHead: sha,
      error: null
    };
  } catch (error) {
    const stderr = typeof error.stderr === 'string' ? error.stderr.trim() : '';
    const message = stderr || error.message || 'git ls-remote failed';
    return {
      remoteUrl,
      remoteHead: null,
      error: message
    };
  }
}

function evaluateStatus(pinnedCommit, remoteHead, remoteError) {
  if (!isFullSha(pinnedCommit)) {
    return 'UNKNOWN';
  }

  if (remoteError || !remoteHead) {
    return 'UNKNOWN';
  }

  if (pinnedCommit === remoteHead) {
    return 'UP_TO_DATE';
  }

  return 'BEHIND';
}

function main() {
  const manifest = readManifest();
  const upstreamSkills = Array.isArray(manifest.upstreamSkills) ? manifest.upstreamSkills : [];

  console.log('Upstream audit');
  console.log(`Manifest: ${MANIFEST_PATH}`);
  console.log('Policy: read-only audit; manual bumps only');
  console.log('');

  if (upstreamSkills.length === 0) {
    console.log('No upstreamSkills entries found.');
    return;
  }

  const counts = {
    UP_TO_DATE: 0,
    BEHIND: 0,
    UNKNOWN: 0
  };

  for (const entry of upstreamSkills) {
    const repo = entry?.repo ?? '(missing repo)';
    const pinnedCommit = typeof entry?.commit === 'string' ? entry.commit : '';
    const remote = readRemoteHead(repo);
    const status = evaluateStatus(pinnedCommit, remote.remoteHead, remote.error);

    counts[status] += 1;

    console.log(`repo: ${repo}`);
    console.log(`status: ${status}`);
    console.log(`pinned: ${pinnedCommit || '(missing)'}`);
    console.log(`remote_head: ${remote.remoteHead ?? '(unknown)'}`);

    // Extra explanation beyond the spec is labeled so operators can distinguish
    // audit facts from script-side interpretation.
    if (!isFullSha(pinnedCommit)) {
      console.log('note: JUDGMENT - commit is not a pinned full SHA, so status is UNKNOWN');
    } else if (remote.error) {
      console.log(`note: FACT - remote HEAD could not be resolved: ${remote.error}`);
    }

    console.log('');
  }

  console.log('Summary');
  console.log(`UP_TO_DATE: ${counts.UP_TO_DATE}`);
  console.log(`BEHIND: ${counts.BEHIND}`);
  console.log(`UNKNOWN: ${counts.UNKNOWN}`);
}

try {
  main();
} catch (error) {
  console.error(`Fatal: ${error.message}`);
  process.exit(1);
}
