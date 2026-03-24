# Security

This repository installs AI agent skills, which can influence how coding agents reason, read files, run commands, and make changes.

## Before Installing

- Read `scripts/bootstrap.*` and `scripts/install.*` before running remote one-line commands on sensitive machines.
- Prefer a local clone install when working with regulated, client, financial, health, government, or production systems.
- Review each installed `SKILL.md` before enabling broad autonomy in your agent.

## What The Installer Does

- Copies the two local wrapper skills from this repository.
- Downloads curated upstream skills from their original public GitHub repositories.
- Removes one known non-Codex frontmatter key from imported skills for compatibility.
- Does not ask for secrets, credentials, API keys, or production access.

## Reporting Issues

Open a GitHub issue with:

- The target agent: Codex, Claude Code, Cursor, or Antigravity.
- OS and shell.
- Install command used.
- Error output.
- Whether the skill appears after restarting the agent.
