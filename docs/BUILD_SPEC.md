# BUILD SPEC — Enterprise-AI-Dev-Skills Repository
## Agent-Executable Task Graph

**Repo:** `C:\Users\mshmi\OneDrive\Apps\enterprise-ai-dev-skills`
**Remote:** `https://github.com/mithunyc/enterprise-ai-dev-skills`
**Strategy:** Keep existing repo. Evolve, don't replace. Preserve git history.
**Phase 0:** ✅ COMPLETE — see `tasks/STATE.md` for evidence

---

## Session Start Protocol (MANDATORY)

Every new agent session MUST run this before touching any file:
```
1. Read tasks/STATE.md
2. Read docs/ROADMAP.md
3. git status
4. git branch --show-current
5. git log -1 --oneline
6. Verify current phase in STATE.md
7. Begin the NEXT incomplete task
```

---

## Source Material Paths

| Source | Path |
|--------|------|
| AGENTS_v3.3 | `C:\Users\mshmi\OneDrive\Apps\enterprisegradesoftwireos\AGENTS_v3_3.md` |
| System Optimization | `C:\Users\mshmi\OneDrive\Apps\enterprisegradesoftwireos\AGENT_SYSTEM_OPTIMIZATION_PROMPT.md` |
| Skill Acquisition | `C:\Users\mshmi\OneDrive\Apps\enterprisegradesoftwireos\EXTERNAL_SKILL_ACQUISITION_PROMPT.md` |
| write-a-skill | `C:\Users\mshmi\OneDrive\Apps\enterprisegradesoftwireos\write-a-skill\SKILL.md` |
| triage skill | `C:\Users\mshmi\OneDrive\Apps\enterprisegradesoftwireos\triage\SKILL.md` |

---

## Phase 0: Core Skeleton ✅ COMPLETE

All 5 tasks done. See `tasks/STATE.md` for evidence.

---

## Phase 1: Templates + Schemas

### Task 6: templates/AGENTS.template.md
```
SOURCE: AGENTS_v3.3 §1-5, §7-8, §10 (condensed), §20, §22, §27-28
ACTION: Extract and GENERALIZE — remove ALL Arkaan/Supabase/pnpm-specific references.
        Use [YOUR_TOOL], [YOUR_FRAMEWORK] placeholders.
        Add [CUSTOMIZE] markers where users should edit for their project.
TARGET: ≤15K chars.
VERIFY: File exists. wc -c ≤ 15360. No "Arkaan" or "Supabase" anywhere in file.
```

### Task 7: Core audit/receipt templates (3 files)
```
templates/evidence-receipt.md
  frontmatter: type, gate_results_ref, gate_status (PASS|FAIL|PARTIAL|NOT_RUN),
               confidence (HIGH|MEDIUM|LOW), status (GO|CONDITIONAL_GO|NO_GO)
  body: SHORT / STANDARD / FULL formats from AGENTS_v3.3 §13

templates/adversarial-review.md
  frontmatter: type, verdict (GO|CONDITIONAL_GO|NO_GO), critical_count, high_count
  body: Reviewer protocol from AGENTS_v3.3 §14

templates/diagnostic-baseline.md
  frontmatter: type, repo_state (B|C|D), health (build/tests/lint/typecheck/ci),
               stabilization_required (true|false)
  body: Brownfield audit checklist

VERIFY: All 3 have valid YAML between --- delimiters.
```

### Task 8: Planning templates (4 files)
```
templates/phase-proposal.md
  frontmatter: type, objective, blast_radius (LOW|MEDIUM|HIGH), rollback
  body: From AGENTS_v3.3 §10

templates/slice-contract.md
  frontmatter: type, story, allowed_files (list), blast_radius, rollback,
               depends_on (list), evidence_required (list)
  body: Vertical slice specification with examples

templates/PRD.md
  frontmatter: type, status (DRAFT|APPROVED), stories_count, acceptance_criteria_complete
  body: Product requirements template with sections

templates/handoff.md
  frontmatter: type, session_end, files_changed (list), pending_blockers (list),
               next_command
  body: Session handoff contract

VERIFY: All 4 have valid YAML frontmatter.
```

### Task 9: templates/buildloop.yml.example
```
adoption_mode, risk_level, commands (lint/typecheck/test/build), protected_paths
VERIFY: Valid YAML.
```

### Task 10: Frontmatter schemas (5 JSON files in schemas/)
```
diagnostic-baseline.schema.json  — validates diagnostic-baseline.md frontmatter
evidence-receipt.schema.json      — validates evidence-receipt.md frontmatter
slice-contract.schema.json        — validates slice-contract.md frontmatter
adversarial-review.schema.json    — validates adversarial-review.md frontmatter
buildloop.schema.json             — validates .buildloop.yml

Each schema: $schema, title, type:object, required:[], properties:{} with enum values.
VERIFY: All 5 are valid JSON (node -e "JSON.parse(require('fs').readFileSync('schemas/X.schema.json'))" for each).
```

### Task 11: reference/ core docs (2 files)
```
reference/bootstrap-protocol.md  — from AGENTS_v3.3 §6 (State A-D classification, generalized)
reference/brownfield-adoption.md — from ROADMAP.md brownfield matrix + failure modes table

VERIFY: Files exist. No Arkaan/Supabase references.
```

### Task 12: playbooks/ (2 files)
```
playbooks/system-optimization.md — clean version of AGENT_SYSTEM_OPTIMIZATION_PROMPT.md
playbooks/skill-acquisition.md   — clean version of EXTERNAL_SKILL_ACQUISITION_PROMPT.md

VERIFY: Files exist.
```

### Task 13: CONTRIBUTING.md (repo root)
```
SOURCE: enterprisegradesoftwireos/write-a-skill/SKILL.md
Include: skill structure, description rules (max 1024 chars), SKILL.md template,
         review checklist, how to test locally, PR process.
VERIFY: File exists. Contains SKILL.md template section.
```

**Phase 1 Gate:**
- [ ] All templates have valid YAML frontmatter
- [ ] All 5 schemas are valid JSON
- [ ] `git diff --stat` shows 13 new files
- [ ] Commit: `phase-1: templates and schemas`

---

## Phase 1.5: Orchestrator Hardening

**Objective:** Reconcile Opus + Gemini adversarial reviews and apply the smallest robust hardening patch to the master orchestrator skill before Phase 2.

**Decision:** Evolve `skills/enterprise-ai-dev/SKILL.md`. Do NOT create a separate orchestrator skill.

**Allowed files:**
- `skills/enterprise-ai-dev/SKILL.md` (UPDATE)
- `skills/enterprise-ai-dev/references/risk-matrix.md` (CREATE)
- `docs/BUILD_SPEC.md` (UPDATE — this section)
- `tasks/STATE.md` (UPDATE)

**Forbidden files:**
- `skills/enterprise-ai-dev-orchestrator/` (must NOT exist)
- `skills/enterprise-ai-dev/references/authority-order.md` (inlined instead)
- `skills/enterprise-ai-dev/references/lessons-protocol.md` (deferred)
- `skills/enterprise-ai-dev/references/antigravity-usage.md` (deferred)

**Changes to SKILL.md:**
1. `/orchestrator` explicit trigger in frontmatter description
2. Honest limitation disclaimer
3. Claim labels (FACT/INFERENCE/JUDGMENT/UNVERIFIED) inlined
4. Authority order (6 levels) inlined — project-local overrides global
5. Expanded Step 0: GREENFIELD, BROWNFIELD, GOVERNED, STALE_OR_MIXED, REVIEW_ONLY, RELEASE, AUTONOMOUS_LOOP
6. Self-review checklist (6 questions)
7. Output contract (planning + execution formats)
8. Max 3 fix attempts stop condition
9. Delegation rule — orchestrator routes, does not pretend to be every specialist

**Verification checks:**
```
1. git status --short
2. git branch --show-current
3. SKILL.md frontmatter has name + description with /orchestrator
4. SKILL.md ≤ 10,000 chars
5. Only one orchestrator skill under skills/
6. references/risk-matrix.md exists
7. No forbidden files created
8. No private project references (Arkaan, UnionForge, Supabase, PowerSync)
9. git diff --stat
```

**Rollback:** `git checkout HEAD -- skills/enterprise-ai-dev/ docs/BUILD_SPEC.md tasks/STATE.md`

**Phase 1.5 Gate:**
- [ ] SKILL.md ≤ 10K chars
- [ ] /orchestrator in description
- [ ] No duplicate orchestrator skill
- [ ] risk-matrix.md exists
- [ ] No leaked private references
- [ ] Commit: `phase-1.5: orchestrator hardening`

---

## Phase 1.6: Brownfield Bootstrap Compiler

**Objective:** Compile repo governance into a machine-readable `orchestrator-manifest.json` before brownfield execution. Replace ad-hoc LLM inference over large governance files with a deterministic, schema-validated manifest contract.

**Decision:** The manifest is a compact map — pointers to repo-local truth paths. It does not copy governance content.

**Allowed files:**
- `schemas/orchestrator-manifest.schema.json` (CREATE)
- `templates/orchestrator-manifest.example.json` (CREATE)
- `reference/brownfield-diagnostic-labs.md` (CREATE)
- `scripts/validate-manifest.mjs` (CREATE — optional, zero-dep validator)
- `docs/BUILD_SPEC.md` (UPDATE — this section)
- `docs/ROADMAP.md` (UPDATE — one line)
- `tasks/STATE.md` (UPDATE)

**Forbidden files:**
- New orchestrator skill (must NOT exist)
- `skills/enterprise-ai-dev/SKILL.md` (no rewrite — pointer only if needed)
- Autonomous BuildLoop implementation
- Obsidian integration code
- Graphify integration code
- Install script modifications
- Project-specific rules (no private repo names)

**Core design rules:**
1. Manifest fields point to repo-local truth paths; they do not copy docs
2. Repo-local governance outranks global fallback rules
3. Every inferrable field carries `evidence_type: extracted | inferred`
4. Active overrides require freshness metadata with `last_verified` and `verification_method`
5. Lessons are never auto-committed — failures create candidates for human approval
6. External memory (Obsidian, Graphify) is advisory-only and demand-loaded
7. Token policy caps session startup to prevent context saturation
8. `not_code_repo` classification requires `code_paths` to be empty (prevents monorepo false positives)

**Verification checks:**
```
1. git status --short
2. git branch --show-current
3. Verify only allowed files changed
4. node -e "JSON.parse(require('fs').readFileSync('schemas/orchestrator-manifest.schema.json'))"
5. node -e "JSON.parse(require('fs').readFileSync('templates/orchestrator-manifest.example.json'))"
6. node scripts/validate-manifest.mjs (if validator exists)
7. reference/brownfield-diagnostic-labs.md exists
8. This section exists in BUILD_SPEC.md
9. grep -rn "Arkaan\|UnionForge\|PowerSync\|Supabase\|SPRINT-ZERO\|GodMode" schemas/ templates/ reference/brownfield-diagnostic-labs.md
   → must return 0 results (private names banned from generic artifacts)
10. git diff --stat
```

**Dogfood tests (Phase 2 integration):**
- `tests/install.test.mjs` should validate the new schema and example (add when Phase 2 begins)
- Manifest example should validate against the schema

**Exit criteria:**
- [ ] Schema is valid draft-07 JSON
- [ ] Example is valid JSON and matches schema structure
- [ ] Diagnostic labs document exists with all 10 labs
- [ ] Validator script exists and exits 0
- [ ] No private project names in any new file
- [ ] BUILD_SPEC.md has this section
- [ ] STATE.md updated
- [ ] Commit: `phase-1.6: brownfield bootstrap compiler`

**Rollback:** `git checkout HEAD -- schemas/orchestrator-manifest.schema.json templates/orchestrator-manifest.example.json reference/brownfield-diagnostic-labs.md scripts/validate-manifest.mjs docs/BUILD_SPEC.md docs/ROADMAP.md tasks/STATE.md`

---

## Phase 2: Gate Scripts + Dogfooding

### Task 14: scripts/gate-runner.mjs
```
Reads .buildloop.yml from cwd
Executes each command in commands:
Captures exit code, stdout, stderr per command
Writes .buildloop-runs/<ISO_timestamp>/gate-results.json
Saves per-command logs to .buildloop-runs/<timestamp>/<name>.log
Exits 0 if all pass, 1 if any fail
Checks protected_paths not in `git diff --name-only` output

gate-results.json format:
{
  "run_id": "<ISO timestamp>",
  "adoption_mode": "...",
  "commands": [
    { "name": "lint", "command": "...", "exit_code": 0, "log": "..." }
  ],
  "protected_paths_violated": [],
  "overall": "PASS"
}

VERIFY: node scripts/gate-runner.mjs (with a test .buildloop.yml in /tmp or examples/).
```

### Task 15: scripts/audit-upstream.mjs
```
Reads curated-skills.json
For each upstream.repo: git ls-remote https://github.com/<repo>.git HEAD
Compares current HEAD to pinned commit
Reports: UP_TO_DATE / BEHIND / UNKNOWN
Does NOT auto-update — human must bump manually

VERIFY: node scripts/audit-upstream.mjs outputs status for each repo.
```

### Task 16: AGENTS.md (repo root — dogfooding)
```
This repo uses its own governance. Keep it short (≤8K chars).
Must reference:
  - tasks/STATE.md for project state
  - docs/ROADMAP.md for the plan
  - templates/ for contribution standards
  - The repo's own quality gates

VERIFY: File exists at root. Does not conflict with AGENTS.template.md.
```

### Task 17: .github/workflows/ci.yml
```
Trigger: push to main, pull_request
Jobs:
  validate-templates: parse all template YAML frontmatter (use js-yaml)
  validate-schemas: JSON.parse all files in schemas/
  lint-scripts: eslint scripts/*.mjs (or node --check)
  test: node tests/install.test.mjs

VERIFY: Valid GitHub Actions YAML syntax.
```

### Task 18: tests/install.test.mjs
```
Tests (using Node assert):
1. curated-skills.json is valid JSON
2. All local skills have SKILL.md with name + description frontmatter
3. All template files have valid YAML frontmatter with required fields
4. All schema files are valid JSON

VERIFY: node tests/install.test.mjs exits 0.
```

**Phase 2 Gate:**
- [ ] gate-runner.mjs produces gate-results.json
- [ ] audit-upstream.mjs reports status for all upstreams
- [ ] AGENTS.md at root
- [ ] CI workflow is valid YAML
- [ ] tests/install.test.mjs exits 0
- [ ] Commit: `phase-2: gate scripts and dogfooding`

---

## Phase 3: Reference Docs (6 files from AGENTS_v3.3)

All must be generalized — remove ALL Arkaan/Supabase/pnpm-specific references.

| # | File | Source Section |
|---|------|---------------|
| 19 | reference/phase-engine.md | §10, §10.2, §10.3 |
| 20 | reference/autonomous-execution.md | §31, §31.2, §31.5, §31.6 |
| 21 | reference/security-triggers.md | §16 |
| 22 | reference/architecture-boundaries.md | §17, §17.2, §17.3 |
| 23 | reference/quality-gates.md | §32 (stack-agnostic) |
| 24 | reference/drift-control.md | §15 |

**Phase 3 Gate:**
- [ ] All 6 files exist
- [ ] No "Arkaan", "Supabase", "pnpm" references in any file
- [ ] Commit: `phase-3: reference docs`

---

## Phase 4: Open-Source Polish

| # | Task | Verify |
|---|------|--------|
| 25 | README.md rewrite | Has install command, tier table, lifecycle summary |
| 26 | SECURITY.md update | Mentions commit pinning, protected_paths |
| 27 | examples/greenfield-empty/README.md | Demonstrates greenfield workflow |
| 28 | examples/brownfield-broken-build/ | Has broken test, no build config, stale AGENTS.md |
| 29 | Final release commit + GitHub release | Tag v2.0.0 |

---

## Execution Rules

1. **One phase per session.** Commit at end of each phase.
2. **Read source material BEFORE writing.** Don't generate from memory.
3. **Generalize.** Replace Arkaan/Supabase/pnpm with `[YOUR_TOOL]` placeholders.
4. **Verify after every task.** Run the verify command. No claiming done without proof.
5. **Update tasks/STATE.md** at end of every session.
6. **Commit message format:** `phase-N: task-M short description`
7. **If stuck:** Commit what works, update STATE.md, escalate.
