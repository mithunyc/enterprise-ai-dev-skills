### ULTIMATE ROADMAP v5.0 — Enterprise-AI-Dev Control Plane

Status: CONDITIONAL GO — becomes UNCONDITIONAL after Phase 2 dogfooding on: (1) this repo, (2) one greenfield fixture, (3) one brownfield fixture. Audit Trail: 3 adversarial rounds · 20+ probes · 1 cross-model critique · 11 amendments applied Supersedes: All prior artifacts (v1–v4, ChatGPT critique response).



The Three Laws

Determinism: Every gate/receipt/handoff uses YAML frontmatter validated by schemas. Markdown=humans, schema-validated YAML=control plane.

Foundation: Never build on a broken repo. ALL projects get a minimal audit. Brownfield gets full diagnostic BEFORE features.

Planning: 60% effort on Steps 0–8. Use risk-scaled grill-me probes (Low=1-2, Medium=3, High=5-7, never >7 unless human asks).

The 17-Step Lifecycle

Lifecycle Profiles

Profile	Steps	Prerequisite

Solo Greenfield	0, 1A, 2, 3, 4, 7, 8, 9, 11, 14	None

Team Brownfield	All 17	None

Autonomous Loop	9→10→11→12→receipt→commit→next slice	Steps 0–8 must be approved first

PLANNING PHASE (Steps 0–8)

Step 0: INIT — Classify GREENFIELD or BROWNFIELD. Select profile.



Step 1A: MINIMAL AUDIT (all projects) — git status, branch, package manager, runtime, file count, existing governance files. Output: project classification metadata.



Step 1B: FULL DIAGNOSTIC (brownfield only) — Run native lint/test/build. Check CI, CODEOWNERS. Produce diagnostic\_baseline.md:



yaml

\---

type: diagnostic\_baseline

repo\_state: B | C | D

health:

&#x20; build: PASS | FAIL | NOT\_CONFIGURED

&#x20; tests: PASS | FAIL | NONE

&#x20; ci: CONFIGURED | NONE

stabilization\_required: true | false

\---

If stabilization\_required: true → present Stabilization Plan → BLOCK feature work.



Optional: graphify index . for large repos.



Step 2: PRODUCT INTENT / PRD — Gather requirements. Produce PRD with frontmatter.



Step 3: ADVERSARIAL SPEC — Grill-me pattern on PRD. Risk-scaled probe count. Each probe has Q + recommended A. Human approves/modifies/rejects.



Step 4: ARCHITECTURE CHECKPOINT — Verify architecture fits repo reality. Graphify query for existing seams if available.



Step 5: ADRs WHERE NEEDED — Record decisions that constrain future work.



Step 6: TASK GRAPH / DAG — Stories with explicit dependencies. Each fits one context window.



Step 7: SLICE CONTRACT — Per-story boundaries:



yaml

\---

type: slice\_contract

story: "Add user login"

allowed\_files: \["src/auth/\*\*", "tests/test\_auth.py"]

blast\_radius: LOW | MEDIUM | HIGH

rollback: "git revert HEAD"

depends\_on: \["story-1-db-schema"]

evidence\_required:

&#x20; - typecheck

&#x20; - unit\_test

&#x20; - build

\---

Step 8: HUMAN APPROVAL (PLANNING GATE) — Gate verifies: PRD complete, architecture passed, slice contracts have allowlists, grill Q\&A approved, .buildloop.yml exists. Every gate ends with:



DECISION REQUIRED

Recommendation: PROCEED / FIX / HALT

Why: \[1-2 sentences]

Risk: LOW / MEDIUM / HIGH

What I need from you: approve / modify / reject

If approved, next action: \[explicit step]

EXECUTION PHASE (Steps 9–16)

Step 9: TDD EXECUTION — Red-green-refactor within slice boundaries. Brownfield first tests = characterization tests.



Step 10: SELF-REVIEW — Check scope, test coverage, compilation.



Step 11: DETERMINISTIC GATES — gate-runner reads .buildloop.yml, executes commands, writes gate-results.json:



json

{

&#x20; "run\_id": "2026-05-09T180000Z",

&#x20; "commands": \[

&#x20;   {"name": "lint", "command": "pnpm lint", "exit\_code": 0, "log": ".buildloop-runs/.../lint.log"},

&#x20;   {"name": "test", "command": "pnpm test", "exit\_code": 0, "log": ".buildloop-runs/.../test.log"}

&#x20; ],

&#x20; "overall": "PASS"

}

Agent writes receipt referencing gate-results.json:



yaml

\---

gate\_results\_ref: ".buildloop-runs/<run\_id>/gate-results.json"

gate\_status: PASS | FAIL | PARTIAL | NOT\_RUN

confidence: HIGH | MEDIUM | LOW

\---

Gate-runner produces evidence. Receipt summarizes it. Reviewer verifies against it.



Step 12: INDEPENDENT AI REVIEW — Reads receipt first, challenges claims vs gate-results.json.



Step 13: HUMAN APPROVAL — PROCEED / FIX / HALT / OVERRIDE.



Step 14: PR / PREVIEW DEPLOY



Step 15: RELEASE / ROLLBACK / OBSERVABILITY



Step 16: LESSONS — Repo: tasks/LESSONS.md. Obsidian vault (if configured). Graphify refresh (if used).



.buildloop.yml Contract

yaml

adoption\_mode: greenfield | brownfield | autonomous

risk\_level: low | medium | high

commands:

&#x20; lint: "pnpm lint"

&#x20; typecheck: "pnpm typecheck"

&#x20; test: "pnpm test"

&#x20; build: "pnpm build"

protected\_paths:

&#x20; - ".env\*"

&#x20; - "\*\*/\*.key"

&#x20; - "\*\*/\*.pem"

&#x20; - ".github/workflows/\*\*"

&#x20; - "supabase/migrations/\*\*"

&#x20; - "infra/\*\*"

&#x20; - "terraform/\*\*"

Brownfield Adoption Matrix

What Exists	Do	Never Do

AGENTS.md	Read. Suggest improvements.	Overwrite.

CLAUDE.md	Add skill routing if missing.	Replace.

CI	Respect. .buildloop.yml adapts.	Replace.

Task tracker	Use existing.	Force prd.json.

Skills	Deduplicate. Skip overlap.	Install duplicates.

Tests	Run existing.	Replace framework.

No governance	Offer to generate. Ask first.	Auto-create.

Broken build	Stabilize FIRST. Block features.	Build on broken foundation.

Repo Structure

enterprise-ai-dev-skills/

├── AGENTS.md                        ← Dogfoods repo governance

├── README.md

├── CONTRIBUTING.md

├── SECURITY.md

├── LICENSE

│

├── skills/                           ← 5 LOCAL skills

│   ├── enterprise-ai-dev/SKILL.md    ← Master orchestrator

│   ├── awesome-design-md/SKILL.md

│   ├── caveman/SKILL.md

│   ├── grill-me/SKILL.md

│   └── karpathy-guidelines/SKILL.md

│

├── templates/                        ← YAML-frontmatter enforced

│   ├── AGENTS.template.md

│   ├── evidence-receipt.md

│   ├── adversarial-review.md

│   ├── diagnostic-baseline.md

│   ├── phase-proposal.md

│   ├── slice-contract.md

│   ├── PRD.md

│   ├── handoff.md

│   └── buildloop.yml.example

│

├── schemas/                          ← Frontmatter validation

│   ├── diagnostic-baseline.schema.json

│   ├── evidence-receipt.schema.json

│   ├── slice-contract.schema.json

│   ├── adversarial-review.schema.json

│   └── buildloop.schema.json

│

├── reference/                        ← Deep docs (read on demand)

│   ├── phase-engine.md

│   ├── autonomous-execution.md

│   ├── bootstrap-protocol.md

│   ├── security-triggers.md

│   ├── architecture-boundaries.md

│   ├── quality-gates.md

│   ├── drift-control.md

│   └── brownfield-adoption.md

│

├── playbooks/

│   ├── system-optimization.md

│   └── skill-acquisition.md

│

├── scripts/

│   ├── install.ps1

│   ├── install.sh

│   ├── bootstrap.ps1

│   ├── bootstrap.sh

│   ├── gate-runner.mjs

│   └── audit-upstream.mjs

│

├── curated-skills.json

├── tests/install.test.mjs

│

├── examples/                         ← Phase 4

│   ├── greenfield-empty/

│   └── brownfield-broken-build/

│

└── .github/workflows/ci.yml

Skill Tiers

Tier	Count	Skills

MINIMAL	5	enterprise-ai-dev, karpathy, brainstorming, tdd, diagnose

CORE	12	+ writing-plans, executing-plans, grill-with-docs, verification-before-completion, security-best-practices, awesome-design-md, caveman

FULL	19	+ grill-me, triage, improve-codebase-architecture, zoom-out, finishing-a-dev-branch, requesting-code-review, security-threat-model

CONTRIBUTOR	+2	write-a-skill, setup-matt-pocock-skills

Build Phases

Phase 0: Core Skeleton (5 tasks)

Create folder structure

Copy 3 new local skills (caveman, grill-me, karpathy-guidelines)

Rewrite enterprise-ai-dev/SKILL.md with lifecycle + greenfield/brownfield paths

Build curated-skills.json (tiered, deduped, pinned)

Update install scripts (modes + conflict detection)

Phase 1: Templates + Schemas (8 tasks)

AGENTS.template.md

evidence-receipt.md, adversarial-review.md, diagnostic-baseline.md

phase-proposal.md, slice-contract.md, PRD.md, handoff.md

buildloop.yml.example

Frontmatter schemas (5 files)

reference/bootstrap-protocol.md, brownfield-adoption.md

playbooks/ (2 files)

CONTRIBUTING.md (uses write-a-skill patterns)

Phase 2: Gate Scripts + Dogfooding (5 tasks)

gate-runner.mjs (reads .buildloop.yml, writes gate-results.json)

audit-upstream.mjs

Repo's own AGENTS.md

.github/workflows/ci.yml

tests/install.test.mjs

Phase 3: Reference Docs (6 tasks)

19-24. phase-engine, autonomous-execution, security-triggers, architecture-boundaries, quality-gates, drift-control



Phase 4: Open-Source Polish (5 tasks)

README rewrite

SECURITY.md update

Example: greenfield-empty

Example: brownfield-broken-build

Final release

Falsification Conditions (Measurable)

\#	Condition	Measurement

1	Agents ignore AGENTS.md	In 20 benchmark tasks, >2 violate a hot rule

2	Brownfield diagnostic >30 min	Baseline generation >30 min on medium repo, excluding stabilization

3	Governance overhead >20% context	Hot files at startup exceed 12K chars

4	Gate-runner fails >20% setups	Cannot execute on >2 of 10 sample repos due to tool bugs

5	Self-grill produces no value	In 20 planning runs, <80% improve scope or acceptance criteria

