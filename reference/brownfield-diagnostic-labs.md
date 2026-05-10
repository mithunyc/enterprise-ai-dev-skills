# Brownfield Diagnostic Labs

Source: Phase 1.6 — Bootstrap Compiler
Upstream: reference/bootstrap-protocol.md, reference/brownfield-adoption.md

This document defines the 10-lab diagnostic sequence that produces an `orchestrator-manifest.json`. Each lab is a discrete, idempotent scan. No lab modifies any repo file. The manifest is the only output.

---

## When to Run These Labs

Run the full sequence when:
- Entering a brownfield repo for the first time
- The existing manifest is missing, stale, or suspect
- After a major repo restructure

Do NOT run on every session. Load the existing manifest instead.

---

## Lab 0 — Safety Preflight

**Purpose:** Confirm the repo is in a safe state before scanning.

**Steps:**
1. `git status --short` — must be clean or understood
2. `git branch --show-current` — must not be detached HEAD
3. `git log -1 --oneline` — record the current HEAD SHA
4. Confirm: no files will be modified during labs 0–8

**Output fields:** none (gate only — abort if dirty state is not accepted by human)

**Abort conditions:**
- Detached HEAD → stop, ask human
- Dirty tree → ask: stash / branch / commit / continue with risk

---

## Lab 1 — Repo Shape

**Purpose:** Classify the repo's technical profile.

**Steps:**
1. Check for package files: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `Makefile`, `pom.xml`
2. Detect package manager: npm, pnpm, yarn, bun, pip, cargo, go, make, etc.
3. Detect runtime: node, deno, bun, python, go, rust, dotnet, etc.
4. Detect monorepo signals: `workspaces` in package.json, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`, `turbo.json`
5. List app surfaces: web (has public/ or pages/), mobile (has android/ or ios/ or capacitor.config), api (has routes/ or controllers/), desktop (has electron/), cli (has bin/), library (has lib/ and no app entry)
6. Detect code vs docs: if no package file, no source directories, and directory is primarily markdown → candidate for `not_code_repo`
7. **Critical:** If `code_paths` is non-empty, do NOT classify as `not_code_repo` regardless of docs volume

**Output fields:** `repo_profile.*`

---

## Lab 2 — Governance Shape

**Purpose:** Map the repo's authority hierarchy and governance files.

**Steps:**
1. Scan for governance files (check all, record which exist):
   - `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `CURSORRULES.md`, `.cursorrules`
   - `MISSION_CONTROL.md` (at root and in governance subdirs)
   - Execution pack directories: `.antigravity/`, `.agents/`, `.agent/`, `.claude/`
   - Task trackers: `tasks/STATE.md`, `tasks/`, `TODO.md`
   - `.buildloop.yml`
2. For each governance file found, determine:
   - **Path:** relative from repo root
   - **Role:** read the file header/first 50 lines to classify (supreme_authority, engineering_standards, execution_control, gate_definitions, task_tracking, agent_protocol, pointer_only)
   - **Status:** active, stale (no commits touching it in >90 days), archived, missing
   - **Evidence type:** EXTRACTED if the file declares its own role, INFERRED if determined from content
3. Build the authority chain: order by declared hierarchy if present, otherwise by conventional precedence (MISSION_CONTROL > AGENTS.md > CLAUDE.md)
4. Check for pointer files: if a file says "this is NOT canonical, see X" → follow the pointer, add the real file to the chain

**Output fields:** `governance.authority_chain`

---

## Lab 3 — State and Evidence

**Purpose:** Locate the repo's state tracking and evidence systems.

**Steps:**
1. **State tracking:** Check these paths in order:
   - `tasks/STATE.md`
   - `.antigravity/execution-pack/02_SINGLE_TASK_LEDGER.md` (or similar numbered ledger)
   - Any `STATE.md` in governance directories
   - `tasks.json`, `prd.json`
2. Determine the format: `state_md`, `task_ledger`, `json`, `yaml`, `other`
3. **Evidence system:** Check:
   - `tasks/receipts/` (receipts_dir)
   - `docs/bundles/` or similar (bundle_readmes)
   - `CHANGELOG.md` (changelog)
4. **Lessons / immune system:** Check:
   - `tasks/LESSONS.md`, `lessons.md`, `LESSONS.md`
   - `.antigravity/execution-pack/lessons.md`
   - "Learned Rules" section in AGENTS.md
5. If lessons file exists, set `lessons.auto_commit: false` — always

**Output fields:** `governance.state_tracking`, `governance.evidence_system`, `governance.lessons`

---

## Lab 4 — Quality Gates

**Purpose:** Catalog all verification commands, CI workflows, and special gates.

**Steps:**
1. **Package scripts:** Read `scripts` from `package.json` (or Makefile targets). Record commands for: lint, typecheck, test, build, verify, check, validate
2. **CI workflows:** List files in `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/`, `bitbucket-pipelines.yml`
3. **Gate scripts:** Check for mechanical enforcement: `scripts/verify-*.sh`, `scripts/verify-*.mjs`, pre-commit hooks in `.husky/` or `.git/hooks/`
4. **Special gates:** Scan governance files for references to:
   - Elimination greps (patterns that must return 0 results)
   - Schema parity checks
   - Brand compliance scripts
   - Manual verification gates
5. **Protected paths:** Collect from `.buildloop.yml` if present, CI config, and governance files

**Output fields:** `quality_gates.*`

---

## Lab 5 — Health Checks

**Purpose:** Run the repo's native commands and record results.

**Rules:**
- Run ONLY commands discovered in Lab 4 as canonical (from package.json or CI)
- Do NOT invent commands not in the repo
- Do NOT run destructive commands (deploy, migrate, push)
- If a command is not configured, record as `n/a` or `unknown`

**Steps:**
1. `install` — run the package install command (npm install, pip install, etc.)
2. `lint` — run the lint command from package.json scripts
3. `typecheck` — run the typecheck command (if configured)
4. `test` — run the test command; count test results
5. `build` — run the build command
6. `ci` — check CI status from latest commit (if visible)
7. Record `last_verified` timestamp

**Output fields:** `health.*`

---

## Lab 6 — Immune System

**Purpose:** Analyze the lessons file for mechanical gates.

**Steps:**
1. If `governance.lessons.path` exists from Lab 3:
   - Read the lessons file
   - Count the number of lessons
   - Check if any lesson includes a mechanical gate (a command that can be run to verify the lesson is not violated)
   - Record gate commands found
2. If no lessons file exists:
   - Set `governance.lessons: null`
   - Note in `decision.unresolved_questions`: "No immune system detected. Consider creating a lessons file after the first corrective action."
3. Create `gate_candidates_path` location (do not create the file — just set the path in the manifest)
4. **Critical:** Never auto-populate lessons. The staging path exists for the agent to write CANDIDATES during future execution. Human approves promotion.

**Output fields:** `governance.lessons` (refinement), `quality_gates.special_gates` (if mechanical gates found in lessons)

---

## Lab 7 — Override Freshness

**Purpose:** Verify that active overrides (sprint zero, feature freeze, stabilization) are current.

**Steps:**
1. For each file found in Lab 2 that appears to be an override:
   - Check the file's last Git commit date: `git log -1 --format="%cI" -- <path>`
   - Check the file's mtime as fallback
   - If the file declares a `last_verified` or `last_checked` date, extract it
2. Apply freshness rules:
   - If `max_age_days` is defined in the override file, use it
   - Default `max_age_days`: 30
   - If age > max_age_days → `status: "stale_risk"`
   - If age <= max_age_days → `status: "active"`
3. Check if the override blocks feature work:
   - Look for keywords: "block", "freeze", "stabilization", "no feature work", "override"
   - Set `blocks_feature_work` accordingly
4. If status is `stale_risk`:
   - Add to `decision.unresolved_questions`: "Override at <path> is stale (last verified <date>). Should it be refreshed or expired?"

**Output fields:** `governance.active_overrides`

---

## Lab 8 — External Memory Bridge

**Purpose:** Detect Obsidian vaults or other external knowledge sources.

**Steps:**
1. Check common Obsidian project folder patterns:
   - Look for references to Obsidian paths in governance files (grep for "obsidian", "vault", "20_Projects")
   - Check if a `.obsidian/` directory exists in known locations
2. If an Obsidian vault is detected:
   - Record `vault_path` (absolute)
   - Record `project_folder` (relative within vault)
   - Set `advisory_only: true` — always
3. Check for Graphify references in governance files
4. If Graphify is detected:
   - Record endpoint if found
   - Set `advisory_only: true` — always
5. **Critical:** Do NOT ingest vault contents. Do NOT add vault files to `token_policy.startup_files`. External memory is demand-loaded via `grep_search` or `view_file` when the agent needs architectural context.

**Output fields:** `external_memory.*`

---

## Lab 9 — Manifest Compilation

**Purpose:** Assemble all lab outputs into a valid `orchestrator-manifest.json`.

**Steps:**
1. Merge all output fields from Labs 1–8
2. Set `token_policy`:
   - `max_startup_files`: min(5, count of authority chain files + 1 for state)
   - `max_startup_chars`: 12000 (falsification condition #3)
   - `load_policy`: `manifest_plus_active_task` (default for governed), `manifest_only` (for greenfield)
   - `startup_files`: manifest path + state file + lessons file (if exists) + top authority file
3. Compute `decision`:
   - `recommended_path`: choose from overlay_only, stabilize_then_continue, contain_and_carve, restructure, halt
   - `feature_work_blocked`: true if any health check failed OR any active override blocks feature work
   - `unresolved_questions`: collect from all labs
4. Validate the manifest against `schemas/orchestrator-manifest.schema.json`
5. If validation fails → fix the manifest, do not proceed
6. Write `orchestrator-manifest.json` to repo root (or governance directory)
7. Present the manifest summary to human for approval

**Output:** `orchestrator-manifest.json` (single file)

---

## After the Labs

Once the manifest exists and is approved:

1. **Future sessions load the manifest first** — not the raw governance files
2. The manifest's `token_policy.startup_files` controls what else gets loaded
3. The manifest is refreshed only when:
   - The human requests a re-scan
   - A major repo restructure occurs
   - The manifest's `health.last_verified` is older than 7 days and a health re-check is warranted
4. Lessons are never auto-committed. Failures create candidates at `governance.lessons.gate_candidates_path` for human review.

---

## Quick Reference: Lab → Output Field Mapping

| Lab | Output Fields |
|-----|--------------|
| Lab 0 | (gate only — no manifest fields) |
| Lab 1 | `repo_profile.*` |
| Lab 2 | `governance.authority_chain` |
| Lab 3 | `governance.state_tracking`, `governance.evidence_system`, `governance.lessons` |
| Lab 4 | `quality_gates.*` |
| Lab 5 | `health.*` |
| Lab 6 | `governance.lessons` (refinement), `quality_gates.special_gates` (additions) |
| Lab 7 | `governance.active_overrides` |
| Lab 8 | `external_memory.*` |
| Lab 9 | `token_policy.*`, `decision.*`, full manifest assembly |

---

*Source: buildloop/reference/brownfield-diagnostic-labs.md | Upstream: Phase 1.6 Bootstrap Compiler*
