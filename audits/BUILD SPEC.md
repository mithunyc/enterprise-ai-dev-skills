### BUILD SPEC — Enterprise-AI-Dev-Skills Repository

Agent-Executable Task Graph

Repo: C:\\Users\\mshmi\\OneDrive\\Apps\\enterprise-ai-dev-skills Remote: https://github.com/mithunyc/enterprise-ai-dev-skills Strategy: Keep existing repo. Evolve, don't replace. Preserve git history.



Pre-Build Checklist

Before starting, the agent MUST:



1\. cd C:\\Users\\mshmi\\OneDrive\\Apps\\enterprise-ai-dev-skills

2\. git status (verify clean)

3\. git branch --show-current (verify main)

4\. git pull origin main (sync with remote)

5\. Verify existing files: skills/enterprise-ai-dev/, skills/awesome-design-md/, scripts/\*, curated-skills.json

Source Material Locations

Source	Path

AGENTS\_v3.3	C:\\Users\\mshmi\\OneDrive\\Apps\\enterprisegradesoftwireos\\AGENTS\_v3\_3.md

Caveman skill	C:\\Users\\mshmi\\OneDrive\\Apps\\enterprisegradesoftwireos\\caveman\\SKILL.md

Grill-me skill	C:\\Users\\mshmi\\OneDrive\\Apps\\enterprisegradesoftwireos\\grill-me\\SKILL.md

Karpathy skill	C:\\Users\\mshmi\\OneDrive\\Apps\\enterprisegradesoftwireos\\karpathy-guidlines\\SKILL.md

Triage skill	C:\\Users\\mshmi\\OneDrive\\Apps\\enterprisegradesoftwireos\\triage\\SKILL.md

Write-a-skill	C:\\Users\\mshmi\\OneDrive\\Apps\\enterprisegradesoftwireos\\write-a-skill\\SKILL.md

System Optimization prompt	C:\\Users\\mshmi\\OneDrive\\Apps\\enterprisegradesoftwireos\\AGENT\_SYSTEM\_OPTIMIZATION\_PROMPT.md

Skill Acquisition prompt	C:\\Users\\mshmi\\OneDrive\\Apps\\enterprisegradesoftwireos\\EXTERNAL\_SKILL\_ACQUISITION\_PROMPT.md

ULTIMATE ROADMAP v5	This conversation's artifacts

Phase 0: Core Skeleton

Task 1: Create folder structure

ACTION: Create these directories (don't touch existing files):

&#x20; templates/

&#x20; schemas/

&#x20; reference/

&#x20; playbooks/

&#x20; tests/

&#x20; examples/

VERIFY: All directories exist.

Task 2: Copy 3 new local skills

ACTION: Copy these skills into skills/:

&#x20; - FROM enterprisegradesoftwireos/caveman/SKILL.md → skills/caveman/SKILL.md

&#x20; - FROM enterprisegradesoftwireos/grill-me/SKILL.md → skills/grill-me/SKILL.md  

&#x20; - FROM enterprisegradesoftwireos/karpathy-guidlines/SKILL.md → skills/karpathy-guidelines/SKILL.md

&#x20;   (NOTE: fix typo in source folder name "guidlines" → "guidelines" in destination)

VERIFY: ls skills/ shows 5 directories: awesome-design-md, caveman, enterprise-ai-dev, grill-me, karpathy-guidelines

Task 3: Rewrite enterprise-ai-dev/SKILL.md

ACTION: Rewrite skills/enterprise-ai-dev/SKILL.md to include:

&#x20; - Updated description with greenfield/brownfield/autonomous triggers

&#x20; - GREENFIELD PATH: Step 0 → 1A → 2 → 3 → 4 → 7 → 8 → 9 → 11 → 14

&#x20;   "Build first, govern after proof. Progressive governance adoption."

&#x20; - BROWNFIELD PATH: Step 0 → 1A → 1B → Stabilization gate → 2 → full lifecycle

&#x20;   "Diagnose → stabilize → build. Never build on broken foundation."

&#x20; - AUTONOMOUS PATH: "Prerequisite: Steps 0-8 approved. Loop: 9→10→11→12→commit."

&#x20; - Decision screen format at every gate

&#x20; - Risk-scaled grill limits (1-2/3/5-7)

&#x20; - Reference to templates/, reference/, .buildloop.yml

SOURCE: Synthesize from AGENTS\_v3.3 §6, §10, §12.3, §31 + ULTIMATE ROADMAP v5

TARGET: ≤150 lines. This is a SKILL, not a governance document.

VERIFY: SKILL.md has frontmatter with name + description. Contains greenfield and brownfield sections.

Task 4: Rebuild curated-skills.json

ACTION: Rewrite curated-skills.json with:

&#x20; - Tier definitions: minimal, core, full, contributor

&#x20; - REMOVE duplicates: test-driven-development, systematic-debugging, security-review, frontend-ui-ux, visual-verdict

&#x20; - PIN upstream repos to specific commit SHAs (fetch current HEAD for each):

&#x20;   - mattpocock/skills

&#x20;   - obra/superpowers  

&#x20;   - openai/codex-universal

&#x20; - Add verified\_date field per upstream

VERIFY: JSON is valid. No duplicate skill names across tiers.

Task 5: Update install scripts

ACTION: Update scripts/install.ps1 and scripts/install.sh:

&#x20; - Add --mode parameter: minimal | core | full | contributor (default: core)

&#x20; - Add conflict detection: check for existing AGENTS.md, CLAUDE.md, skills before installing

&#x20; - Clone upstream repos at PINNED commits from curated-skills.json

&#x20; - Report: installed / skipped / conflicted

&#x20; - Include new local skills (caveman, grill-me, karpathy-guidelines)

&#x20; - Never overwrite existing files without --force flag

VERIFY: Running install.ps1 -Target antigravity -Mode core completes without error.

Phase 0 Gate: git add -A \&\& git status shows expected new files. All 5 skill directories present. Install script runs.



Phase 1: Templates + Schemas

Task 6: AGENTS.template.md

ACTION: Create templates/AGENTS.template.md

SOURCE: AGENTS\_v3.3 — extract and GENERALIZE:

&#x20; - §1-5: Operating model, non-negotiables, claim labels, state/continuity, git discipline

&#x20; - §7-8: Authority hierarchy, governance rules (condensed)

&#x20; - §10: Phase execution (condensed — point to reference/phase-engine.md)

&#x20; - §20: Anti-rubber-stamp rule

&#x20; - §22: Escalation

&#x20; - §27-28: Limitations, glossary

&#x20; REMOVE all Arkaan/Supabase/pnpm-specific references. Make stack-agnostic.

TARGET: ≤15K chars. Include \[CUSTOMIZE] markers where users should edit.

VERIFY: File exists, ≤15K chars, no Arkaan/Supabase references.

Task 7: Core templates (3 files)

ACTION: Create with YAML frontmatter:

templates/evidence-receipt.md:

&#x20; Frontmatter: type, gate\_results\_ref, gate\_status (PASS|FAIL|PARTIAL|NOT\_RUN), confidence, status (GO|CONDITIONAL\_GO|NO\_GO)

&#x20; Body: SHORT/STANDARD/FULL formats from AGENTS\_v3.3 §13

templates/adversarial-review.md:

&#x20; Frontmatter: type, verdict (GO|CONDITIONAL\_GO|NO\_GO), critical\_count, high\_count

&#x20; Body: Template from AGENTS\_v3.3 §14

templates/diagnostic-baseline.md:

&#x20; Frontmatter: type, repo\_state, health (build/tests/lint/typecheck/ci), stabilization\_required

&#x20; Body: Brownfield audit checklist

VERIFY: All 3 files have valid YAML frontmatter between --- delimiters.

Task 8: Planning templates (4 files)

ACTION: Create with YAML frontmatter:

templates/phase-proposal.md:

&#x20; Frontmatter: type, objective, blast\_radius, rollback

&#x20; Body: From AGENTS\_v3.3 §10

templates/slice-contract.md:

&#x20; Frontmatter: type, story, allowed\_files, blast\_radius, rollback, depends\_on, evidence\_required

&#x20; Body: Vertical slice specification

templates/PRD.md:

&#x20; Frontmatter: type, status (DRAFT|APPROVED), stories\_count

&#x20; Body: Product requirements template

templates/handoff.md:

&#x20; Frontmatter: type, session\_end, files\_changed, pending\_blockers, next\_command

&#x20; Body: Session handoff contract

VERIFY: All 4 files have valid YAML frontmatter.

Task 9: buildloop.yml.example

ACTION: Create templates/buildloop.yml.example with:

&#x20; adoption\_mode, risk\_level, commands (lint/typecheck/test/build), protected\_paths

VERIFY: Valid YAML.

Task 10: Frontmatter schemas (5 files)

ACTION: Create JSON Schema files in schemas/:

&#x20; diagnostic-baseline.schema.json

&#x20; evidence-receipt.schema.json

&#x20; slice-contract.schema.json

&#x20; adversarial-review.schema.json

&#x20; buildloop.schema.json

Each schema validates the YAML frontmatter of its corresponding template.

VERIFY: All 5 are valid JSON. Each has required fields matching template frontmatter.

Task 11: Core reference docs (2 files)

ACTION: Create from AGENTS\_v3.3 (generalized):

&#x20; reference/bootstrap-protocol.md — from §6 (State A-D classification)

&#x20; reference/brownfield-adoption.md — from ULTIMATE ROADMAP brownfield matrix

VERIFY: Files exist, no Arkaan-specific references.

Task 12: Playbooks (2 files)

ACTION: Create clean versions:

&#x20; playbooks/system-optimization.md — from AGENT\_SYSTEM\_OPTIMIZATION\_PROMPT.md

&#x20; playbooks/skill-acquisition.md — from EXTERNAL\_SKILL\_ACQUISITION\_PROMPT.md

VERIFY: Files exist.

Task 13: CONTRIBUTING.md

ACTION: Create CONTRIBUTING.md using write-a-skill patterns:

&#x20; - Skill structure requirements

&#x20; - Description rules (max 1024 chars, triggers)

&#x20; - SKILL.md template

&#x20; - Review checklist

&#x20; - How to test locally

SOURCE: enterprisegradesoftwireos/write-a-skill/SKILL.md

VERIFY: File exists at repo root.

Phase 1 Gate: All template files have valid YAML frontmatter. All schema files are valid JSON. git diff --stat shows expected new files.



Phase 2: Gate Scripts + Dogfooding

Task 14: gate-runner.mjs

ACTION: Create scripts/gate-runner.mjs:

&#x20; - Reads .buildloop.yml from project root

&#x20; - Executes each command in commands: section

&#x20; - Captures exit code, stdout, stderr per command

&#x20; - Writes gate-results.json to .buildloop-runs/<timestamp>/

&#x20; - Saves command logs to .buildloop-runs/<timestamp>/<name>.log

&#x20; - Exits 0 if all commands pass, 1 if any fail

&#x20; - Validates protected\_paths are not in git diff (if provided)

VERIFY: node scripts/gate-runner.mjs runs without error in a project with .buildloop.yml.

Task 15: audit-upstream.mjs

ACTION: Create scripts/audit-upstream.mjs:

&#x20; - Reads curated-skills.json

&#x20; - For each upstream repo: git ls-remote to get current HEAD

&#x20; - Compares against pinned commit SHA

&#x20; - Reports: up-to-date / behind by N commits / unknown

&#x20; - Does NOT auto-update — outputs changelog for human review

VERIFY: node scripts/audit-upstream.mjs runs and reports status for each upstream.

Task 16: Repo's own AGENTS.md

ACTION: Create AGENTS.md at repo root (dogfooding):

&#x20; - Governs THIS repo only

&#x20; - References templates/ for contribution standards

&#x20; - Defines the repo's own quality gates

&#x20; - Points to tasks/STATE.md for project state

VERIFY: File exists at repo root. Does not conflict with AGENTS.template.md.

Task 17: CI workflow

ACTION: Create .github/workflows/ci.yml:

&#x20; - Trigger: push to main, pull\_request

&#x20; - Jobs:

&#x20;   1. Validate all template YAML frontmatter parses

&#x20;   2. Validate all schema files are valid JSON

&#x20;   3. Lint scripts with eslint or similar

&#x20;   4. Run tests/install.test.mjs

&#x20; 

VERIFY: YAML is valid GitHub Actions syntax.

Task 18: Install tests

ACTION: Create tests/install.test.mjs:

&#x20; - Tests that curated-skills.json is valid JSON

&#x20; - Tests that all local skills have SKILL.md with valid frontmatter

&#x20; - Tests that all template files have valid YAML frontmatter

&#x20; - Tests that all schema files are valid JSON

VERIFY: node tests/install.test.mjs passes.

Phase 2 Gate: CI green. gate-runner produces gate-results.json. Tests pass.



Phase 3: Reference Docs

Tasks 19-24: Create from AGENTS\_v3.3 (generalized)

reference/phase-engine.md           ← §10, §10.2, §10.3

reference/autonomous-execution.md   ← §31, §31.2, §31.5

reference/security-triggers.md      ← §16

reference/architecture-boundaries.md ← §17, §17.2, §17.3

reference/quality-gates.md          ← §32 (stack-agnostic)

reference/drift-control.md          ← §15

ALL: Remove Arkaan/Supabase/pnpm-specific references. Make stack-agnostic.

VERIFY: All 6 files exist. No stack-specific references.

Phase 4: Open-Source Polish

Task 25: README rewrite

ACTION: Rewrite README.md:

&#x20; - Position as "Spec-to-Production Control Plane for AI-Assisted Development"

&#x20; - Quick install (one-liner)

&#x20; - Install modes (minimal/core/full)

&#x20; - What's included (skills, templates, schemas, scripts)

&#x20; - 17-step lifecycle overview

&#x20; - Greenfield vs brownfield quick start

&#x20; - Links to reference docs

VERIFY: README has install commands, skill tier table, lifecycle diagram.

Task 26: SECURITY.md update

ACTION: Update SECURITY.md:

&#x20; - Supply chain pinning policy

&#x20; - How to verify upstream skill integrity

&#x20; - Protected paths concept

&#x20; - How to report vulnerabilities

VERIFY: File mentions commit pinning and protected\_paths.

Tasks 27-28: Fixture examples

examples/greenfield-empty/README.md — Minimal project demonstrating greenfield workflow

examples/brownfield-broken-build/   — Includes: broken test, missing build, stale AGENTS.md

VERIFY: Both directories exist with README files.

Task 29: Final release

ACTION: 

&#x20; - git add -A

&#x20; - Review full diff

&#x20; - Commit: "v2.0: Spec-to-Production Control Plane"

&#x20; - Push to main

&#x20; - Create GitHub release with changelog

VERIFY: GitHub repo shows updated structure.

Execution Rules for the Building Agent

One phase per session. Commit at end of each phase.

Read source material BEFORE writing. Don't generate from memory.

Generalize. Remove ALL Arkaan/Supabase/pnpm-specific patterns from AGENTS\_v3.3 derivatives. Use \[YOUR\_TOOL] or \[YOUR\_FRAMEWORK] placeholders.

Verify after every task. Run the verify command. Don't claim done without proof.

Don't restructure existing files without cause. skills/enterprise-ai-dev/ and skills/awesome-design-md/ already exist — update, don't recreate.

Commit messages: phase-N: task-M description format.

If stuck: Commit what works, update STATE.md, escalate.

