# Security Policy

This repository installs AI agent skills that influence how coding agents reason, read files, run commands, and make changes. Please read this before installing on any sensitive machine.

---

## Supply Chain Security

### Commit Pinning

Upstream skills in [`curated-skills.json`](curated-skills.json) are pinned to full 40-character SHA commit hashes — not branch names or tags. This means you always get the exact code that was reviewed, not whatever happens to be at `HEAD` of an upstream repo.

```json
{
  "repo": "mattpocock/skills",
  "commit": "9f2e0bd0ea776eb6372eb81fa8a4a47814a8404a",
  "verified_date": "2026-05-11"
}
```

To audit whether upstream repos have moved since the last pin:

```bash
node scripts/audit-upstream.mjs
```

This script reports `UP_TO_DATE`, `BEHIND`, or `UNKNOWN` for each upstream. It never auto-updates. Pin bumps require a human decision.

### Protected Paths

The gate runner enforces a `protected_paths` list from your `.buildloop.yml`. Any AI agent action that touches a protected path (secrets, CI workflows, infra configs, migration files) is blocked and reported before it executes.

```yaml
protected_paths:
  - ".env*"
  - "**/*.key"
  - "**/*.pem"
  - ".github/workflows/**"
```

You control this list. Add your project's sensitive paths before enabling autonomous execution.

---

## Before Installing

- Read `scripts/install.ps1` (Windows) or `scripts/install.sh` (macOS/Linux) before running any remote one-line command on a sensitive machine.
- Prefer a **local clone install** when working on regulated, financial, health, government, or production systems.
- Review each installed `SKILL.md` before enabling broad agent autonomy.

---

## What the Installer Does

- Copies the local wrapper skills from this repository.
- Downloads curated upstream skills from their original public GitHub repositories at pinned commits.
- When run as a one-line remote installer, downloads the Buildloop payload to a temporary directory so local and upstream skills can both be installed.
- Removes one non-standard frontmatter key from imported skills for agent compatibility.
- Does **not** request secrets, credentials, API keys, or production access.
- Does **not** modify any file outside the agent's skills directory.

---

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.** Public issues disclose the problem to attackers before a fix is available.

### Option 1 — GitHub Private Vulnerability Reporting (preferred)

Use GitHub's built-in private reporting:

1. Go to the [Security tab](https://github.com/mithunyc/buildloop/security) of this repository.
2. Click **"Report a vulnerability"**.
3. Fill in the details privately. Only maintainers can see this report.

### Option 2 — Email

If GitHub private reporting is unavailable or you prefer email, contact:

```
security@mithunyc.dev
```

Include:
- A description of the vulnerability and its potential impact.
- Steps to reproduce (if applicable).
- Any suggested fix or mitigation.

You will receive a response within **5 business days**. If you do not hear back, re-send with `[SECURITY]` in the subject line.

---

## Reporting a Non-Security Bug

For installer failures, agent compatibility issues, or unexpected behavior — open a standard [GitHub issue](https://github.com/mithunyc/buildloop/issues) with:

- Target agent: Codex, Claude Code, Cursor, or Antigravity.
- OS and shell.
- Install command used.
- Full error output.
- Whether the skill appears after restarting the agent.

---

## Security Review of Skills

This is a public skill distribution. **No skill in this repo** should be granted production database access, secrets, or infrastructure permissions by default. Skills are reasoning guides, not privileged processes.

If you choose to run an agent with access to production systems, apply the principle of least privilege: give the agent only the permissions it needs for the specific task, revoke them when done, and audit the `gate-results.json` log before merging any changes.
