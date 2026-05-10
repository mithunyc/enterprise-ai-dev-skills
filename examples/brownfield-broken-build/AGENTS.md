---
# Acme Widget App — Governance
# Last updated: 2024-03-15
#
# WARNING: This AGENTS.md is DELIBERATELY STALE.
# It references tools and workflows that no longer exist in this repo.
# This is a FIXTURE for practicing the enterprise-ai-dev brownfield diagnostic.
# Do not use this as a governance template for a real project.
---

# AGENTS — Acme Widget App

## Outdated Authority Order

1. This file
2. The old wiki (wiki.acme-internal.example.com — no longer accessible)
3. The legacy `SPRINT_LOG.md` (deleted in 2023)

## Project Context (2024, stale)

This repo uses Gulp 3 for builds (Gulp 3 reached end-of-life in 2020).
The test suite uses Mocha v6 (we migrated to node:assert but forgot to update this file).
CI is configured in CircleCI (we moved to GitHub Actions in late 2023 but left this note here).

## Old Install Instructions

```bash
npm install -g gulp@3
gulp build
gulp test
```

(Note: none of these commands work anymore. The gulpfile was deleted.)

## Previous Agent Rules (Outdated)

- Always run `gulp lint` before committing (gulpfile deleted, this does nothing)
- Use `npm run deploy:staging` to deploy (staging environment decomissioned)
- See `docs/architecture-v1.md` for system design (file deleted)

## What This Means For the Diagnostic

When `enterprise-ai-dev` reads this file during Step 1A, it should flag:
- AGENTS.md present but references deleted files, defunct commands, and inaccessible URLs
- Classification: STALE_OR_MIXED governance
- Recommended action: Regenerate governance after stabilization
