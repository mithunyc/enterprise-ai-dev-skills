## ULTIMATE ROADMAP — Enterprise-AI-Dev Control Plane v4.0

Audit Trail: 3 adversarial rounds · 20+ probes · 3 contradiction fixes · 1 brownfield trace Status: UNCONDITIONAL GO — This supersedes all prior artifacts.



The Three Laws (Non-Negotiable)

Determinism: Every gate/receipt/handoff uses YAML frontmatter. Markdown=humans, YAML=control plane.

Foundation: Never build on a broken repo. Brownfield gets mandatory diagnostic BEFORE features.

Planning: 60% effort on Steps 0–8, 40% on Steps 9–16. Grill-me probes at every planning step.

The 17-Step Lifecycle (Adaptive)

Lifecycle Profiles

Profile	Steps Used	When

Solo Greenfield	0, 2, 3, 4, 7, 8, 9, 11, 14	New project, solo dev

Team Brownfield	All 17	Existing project, team

Autonomous Loop	0, 1, 9, 10, 11, 12 (repeat)	Ralph/BuildLoop overnight

PLANNING PHASE (Steps 0–8)

Step 0: INIT

Agent reads enterprise-ai-dev/SKILL.md → classifies GREENFIELD or BROWNFIELD → selects profile.



Step 1: REPO TRUTH AUDIT

Greenfield: Skip. Brownfield: Mandatory diagnostic.



Agent detects stack, runs native checks (lint/test/build), produces diagnostic\_baseline.md with YAML frontmatter:



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

If stabilization\_required: true → agent presents Stabilization Plan → BLOCKS feature work until human approves and foundation is verified.



Optional: graphify index . for dependency graph on large repos.



🔥 Self-Grill:



Q: Can we build on this? A: \[Only if all health PASS]

Q: Minimum stabilization? A: \[Pin deps, fix build, add 1 test, create .buildloop.yml]

Q: Restructure? A: \[DEFAULT NO. Overlay only.]

Step 2: PRODUCT INTENT / PRD

Agent gathers requirements using brainstorming skill. Produces PRD with YAML frontmatter:



yaml

\---

type: prd

status: DRAFT | APPROVED

stories\_count: N

acceptance\_criteria\_complete: true | false

\---

🔥 Self-Grill:



Q: Is every user story verifiable? A: \[Check each has testable acceptance criteria]

Q: What's missing? A: \[Auth? Error handling? Edge cases?]

Q: What's the MVP vs Phase 2? A: \[Draw the line explicitly]

Step 3: ADVERSARIAL SPEC

Agent applies grill-me pattern to the PRD. Generates 5–7 contrarian Q\&A pairs with recommended answers. Human approves/modifies/rejects each.



Format:



Q: PRD says "user auth" but doesn't specify method. Which?

RECOMMENDED: Email/password + Google OAuth. Magic link Phase 2.

HUMAN: \[APPROVE / MODIFY / REJECT]

Output: Hardened PRD with all ambiguities resolved.



Step 4: ARCHITECTURE CHECKPOINT

Agent verifies the chosen architecture fits the repo reality.



🔥 Self-Grill:



Q: Simplest version that works? A: \[Name it]

Q: Am I overengineering? A: \[Apply Karpathy: "Would a senior engineer say this is overcomplicated?"]

Q: What existing seams can we reuse? A: \[Graphify query or manual grep]

For brownfield: use Graphify path/query to check existing module boundaries.



Step 5: ADRs WHERE NEEDED

Record decisions that constrain future work. Especially critical for brownfield: "Why we chose NOT to restructure." Lightweight — only when a decision has alternatives worth documenting.



Step 6: TASK GRAPH / DAG

Decompose into stories with explicit dependencies. Each story must fit ONE agent context window.



🔥 Self-Grill:



Q: Can each story be completed in one session? A: \[If >15 files, split]

Q: Are dependencies correct? A: \[No story should block on a later story]

Graphify helps identify module dependencies for accurate ordering.



Step 7: SLICE CONTRACT

For each story, define boundaries via YAML frontmatter:



yaml

\---

type: slice\_contract

story: "Add user login"

allowed\_files: \["src/auth/\*\*", "tests/test\_auth.py"]

blast\_radius: LOW | MEDIUM | HIGH

rollback: "git revert HEAD"

depends\_on: \["story-1-db-schema"]

new\_tests\_required: ">= 1 per changed module"

\---

Graphify helps define allowed files and blast radius.



🔥 Self-Grill:



Q: Is this slice too big? A: \[>15 files = split]

Q: What could bleed outside the boundary? A: \[Shared utils, DB migrations]

Step 8: HUMAN APPROVAL (PLANNING GATE)

This is the checkpoint between planning and execution. Gate verifies:



&#x20;PRD complete (no TBDs)

&#x20;Architecture checkpoint passed

&#x20;Slice contract has explicit file allowlist

&#x20;Self-grill Q\&A approved

&#x20;No unresolved decision branches

&#x20;.buildloop.yml exists (brownfield) or will be created (greenfield)

EXECUTION IS BLOCKED until this gate passes.



EXECUTION PHASE (Steps 9–16)

Step 9: TDD EXECUTION

Build using red-green-refactor. For brownfield without tests: first tests are CHARACTERIZATION tests (document existing behavior), then feature tests.



Agent follows slice contract boundaries. Stays within allowed files.



Step 10: SELF-REVIEW

Agent reviews its own work against the slice contract:



Did I stay within allowed files?

Did I add tests for every changed module?

Does the code compile?

Are there any TODO/FIXME without tracking issues?

Step 11: DETERMINISTIC GATES

gate-runner reads .buildloop.yml and executes exactly what's configured:



yaml

\# .buildloop.yml — approved by human at Step 1 or Step 8

commands:

&#x20; lint: "pnpm lint"

&#x20; typecheck: "pnpm typecheck"

&#x20; test: "pnpm test"

&#x20; build: "pnpm build"

Gate-runner also parses evidence-receipt YAML frontmatter:



status: GO + tests\_passed: true → PASS

Anything else → FAIL

No magic detection. No guessing. Execute the contract.



Step 12: INDEPENDENT AI REVIEW

Second AI reads the receipt FIRST (not the code), then challenges claims vs proof using adversarial-review.md template. Produces: GO / CONDITIONAL GO / NO-GO.



Step 13: HUMAN APPROVAL

Human reviews receipt + review. Signals: PROCEED / FIX / HALT / OVERRIDE.



Step 14: PR / PREVIEW DEPLOY

Create PR. Deploy preview if applicable.



Step 15: RELEASE / ROLLBACK / OBSERVABILITY

Release with explicit rollback path. Monitor for regressions.



Step 16: LESSONS

Repo lessons → tasks/LESSONS.md

Durable decisions → Obsidian vault (if configured)

Topology changes → refresh Graphify index (if used)

Promote important patterns to progress.txt Codebase Patterns section

Part III: Brownfield Adoption Matrix

What Exists	What We Do	What We NEVER Do

AGENTS.md	Read it. Suggest improvements.	Overwrite it.

CLAUDE.md	Add skill routing if missing.	Replace it.

CI pipeline	Respect it. .buildloop.yml adapts.	Replace it.

Task tracker	Use existing (Issues/Jira/Linear).	Force prd.json.

Existing skills	Deduplicate. Skip overlap.	Install duplicates.

Test framework	Run existing tests.	Replace framework.

No governance	Offer to generate. Ask first.	Auto-create.

Broken build	Stabilize FIRST. Block features.	Build on broken foundation.

Part IV: Repo Structure to Build

enterprise-ai-dev-skills/

├── AGENTS.md                       ← Dogfoods repo governance

├── README.md

├── CONTRIBUTING.md

├── SECURITY.md

│

├── skills/                          ← 5 LOCAL skills

│   ├── enterprise-ai-dev/SKILL.md   ← Master orchestrator

│   ├── awesome-design-md/SKILL.md

│   ├── caveman/SKILL.md

│   ├── grill-me/SKILL.md

│   └── karpathy-guidelines/SKILL.md

│

├── templates/                       ← YAML-frontmatter enforced

│   ├── AGENTS.template.md           ← Generalized from AGENTS\_v3.3

│   ├── evidence-receipt.md          ← SHORT/STANDARD/FULL

│   ├── adversarial-review.md

│   ├── diagnostic-baseline.md       ← Brownfield audit

│   ├── phase-proposal.md

│   ├── slice-contract.md

│   ├── PRD.md

│   ├── buildloop.yml.example

│   └── handoff.md                   ← Session handoff contract

│

├── reference/                       ← Deep docs (read on demand)

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

│   ├── install.ps1                  ← Modes + conflict detection + pinning

│   ├── install.sh

│   ├── bootstrap.ps1

│   ├── bootstrap.sh

│   ├── gate-runner.mjs              ← Reads .buildloop.yml + YAML frontmatter

│   └── audit-upstream.mjs           ← Supply chain update checker

│

├── curated-skills.json              ← Tiered, pinned, SHA-verified

├── tests/install.test.mjs

└── .github/workflows/ci.yml

Skill Tiers (in curated-skills.json)

Tier	Skills	Token Overhead

MINIMAL (5)	enterprise-ai-dev, karpathy, brainstorming, tdd, diagnose	\~1.5K

CORE (12)	+ writing-plans, executing-plans, grill-with-docs, verification-before-completion, security-best-practices, awesome-design-md, caveman	\~3.6K

FULL (19)	+ grill-me, triage, improve-codebase-architecture, zoom-out, finishing-a-dev-branch, requesting-code-review, security-threat-model	\~5.7K

CONTRIBUTOR	+ write-a-skill, setup-matt-pocock-skills	N/A

Part V: Build Plan (For the Repo Itself)

Phase 0: Core Skeleton

\#	Task	Source	DoD

1	Create folder structure	New	skills/, templates/, reference/, playbooks/, scripts/ exist

2	Copy 3 new local skills	enterprisegradesoftwireos	caveman, grill-me, karpathy-guidelines in skills/

3	Rewrite enterprise-ai-dev SKILL.md	Synthesis	Greenfield/brownfield paths, grill-me integration, lifecycle reference

4	Build curated-skills.json	Current + fix	Tiered, 5 dupes removed, upstream commits pinned

5	Update install.ps1/install.sh	Current scripts	--mode minimal|core|full + conflict detection

Phase Gate: Install script creates expected files for each mode.



Phase 1: Templates + Frontmatter Contracts

\#	Task	Source	DoD

6	AGENTS.template.md	AGENTS\_v3.3 (generalized)	≤15K chars, stack-agnostic

7	evidence-receipt.md (SHORT/STANDARD/FULL)	AGENTS\_v3.3 §13	YAML frontmatter with status/confidence fields

8	adversarial-review.md	AGENTS\_v3.3 §14	GO/CONDITIONAL\_GO/NO\_GO in frontmatter

9	diagnostic-baseline.md	Level 3 hardening	Health matrix in frontmatter

10	slice-contract.md	Synthesis	allowed\_files, blast\_radius in frontmatter

11	PRD.md, phase-proposal.md, handoff.md	Synthesis	All with YAML frontmatter

12	buildloop.yml.example	Level 3 hardening	Language-agnostic command config

Phase Gate: Every template has valid YAML frontmatter. A script can parse all frontmatters without error.



Phase 2: Gate Scripts + Enforcers

\#	Task	DoD

13	gate-runner.mjs	Reads .buildloop.yml, runs configured commands, parses receipt YAML

14	audit-upstream.mjs	Compares pinned SHAs to upstream HEAD, outputs changelog

15	Repo's own AGENTS.md	Dogfoods governance for THIS repo

16	.github/workflows/ci.yml	Validates templates parse, scripts lint, tests pass

17	tests/install.test.mjs	Verifies install creates expected files per mode

Phase Gate: CI green. gate-runner passes on repo itself.



Phase 3: Reference Docs

\#	Task	Source

18	phase-engine.md	AGENTS\_v3.3 §10 (generalized)

19	autonomous-execution.md	AGENTS\_v3.3 §31 (generalized)

20	bootstrap-protocol.md	AGENTS\_v3.3 §6

21	quality-gates.md	AGENTS\_v3.3 §32 (stack-agnostic)

22	security-triggers.md, architecture-boundaries.md, drift-control.md	AGENTS\_v3.3 §15-17

23	brownfield-adoption.md	This roadmap

24	playbooks (system-optimization, skill-acquisition)	Meta-prompts

Phase Gate: All reference docs present and cross-linked.



Phase 4: Open-Source Polish

\#	Task

25	README rewrite (positioning, install guide, architecture diagram)

26	CONTRIBUTING.md (using write-a-skill patterns)

27	SECURITY.md (supply chain warnings, pinning policy)

28	Example: greenfield walkthrough

29	Example: brownfield adoption

Phase 5: Future (NOT MVP)

Task	Status

buildloop.mjs headless orchestrator	DOCUMENTED, not built

Docker sandbox policy	DOCUMENTED, not built

L4+ autonomous overnight mode	DOCUMENTED, not built

Obsidian vault integration	DOCUMENTED, not built

Graphify bundling	NEVER — optional companion only

Part VI: Scorecard

Dimension	Start	After Build	Target

Architecture clarity	72	96	98

Brownfield readiness	55	94	98

Greenfield readiness	80	95	98

Supply chain security	40	88	95

Token optimization	70	92	95

Determinism	30	93	98

Dogfooding integrity	20	90	95

Planning quality	50	95	98

Overall: 72/100 → 93/100



Part VII: Falsification Conditions

If ANY of these are true after Phase 2, the architecture is WRONG:



Agents ignore AGENTS.md > 10% of the time

Brownfield adoption takes > 30 min

Governance overhead exceeds 20% of context window

gate-runner fails on > 20% of project setups

Self-grill Q\&A is skipped or produces no value

### Track these. Measure them. Kill what doesn't work.

