### Master Orchestrator Skill — Staff+ Adversarial Analysis

Date: 2026-05-10 Source: ChatGPT Recommendation — Master Orchestrator Skill Reviewed By: Adversarial Staff+ AI Systems Architect Verdict: CONDITIONAL GO — see §Final Verdict



PHASE 1 — Repo Truth Audit

Current Repo Shape (FACT)

enterprise-ai-dev-skills/          (remote: github.com/mithunyc/enterprise-ai-dev-skills)

├── .gitignore                     60B

├── CONTRIBUTING.md                6.7K

├── LICENSE                        1.1K

├── README.md                      6.3K   ← stale, pre-v2 content

├── SECURITY.md                    1.1K

├── curated-skills.json            6.3K   ← tiered, deduped

│

├── skills/                        ← 5 LOCAL skills (Phase 0 — DONE)

│   ├── awesome-design-md/

│   ├── caveman/

│   ├── enterprise-ai-dev/         ← 192 lines, 6.5K — THIS IS THE CURRENT ORCHESTRATOR

│   ├── grill-me/

│   └── karpathy-guidelines/

│

├── templates/                     ← 9 files (Phase 1 — DONE)

│   ├── AGENTS.template.md         15.3K

│   ├── PRD.md, evidence-receipt.md, adversarial-review.md,

│   │   diagnostic-baseline.md, phase-proposal.md,

│   │   slice-contract.md, handoff.md, buildloop.yml.example

│

├── schemas/                       ← 5 JSON Schema files (Phase 1 — DONE)

├── reference/                     ← 2 files (Phase 1 — DONE)

│   ├── bootstrap-protocol.md      6.2K

│   └── brownfield-adoption.md     5.3K

├── playbooks/                     ← 2 files (Phase 1 — DONE)

├── scripts/                       ← install.ps1 (8.3K), install.sh (4.2K), bootstrap.\*

├── docs/                          ← ROADMAP.md (6K), BUILD\_SPEC.md (to be written)

├── tasks/                         ← STATE.md (4.7K)

└── audits/                        ← 6 historical files including this recommendation

Existing Governance Files (FACT)

File	Location	Status

tasks/STATE.md	repo	✅ Live, Phase 1 complete

docs/ROADMAP.md	repo	✅ v5.0, canonical

CONTRIBUTING.md	repo root	✅ Built in Phase 1

templates/AGENTS.template.md	repo	✅ Generalized for downstream projects

No AGENTS.md at root	—	⚠️ Not yet built (Phase 2 — Task 16)

No CLAUDE.md	—	Not needed for this repo

No .buildloop.yml	—	Not yet (Phase 2 — after gate-runner)

Existing Skill Locations (FACT)

Skill	Path	Token Size	Purpose

enterprise-ai-dev	skills/enterprise-ai-dev/SKILL.md	\~6.5K chars	Already the master orchestrator — greenfield/brownfield/autonomous paths

awesome-design-md	skills/awesome-design-md/SKILL.md	small	UI design references

caveman	skills/caveman/SKILL.md	small	Token compression

grill-me	skills/grill-me/SKILL.md	small	Plan stress-test

karpathy-guidelines	skills/karpathy-guidelines/SKILL.md	small	Anti-overcomplication

⚠️ CRITICAL FINDING: Conflicts \& Duplicate Authority

enterprise-ai-dev already IS the orchestrator. It contains:



✅ Step 0 classification (greenfield/brownfield/autonomous)

✅ Step 1A/1B diagnostic

✅ Stabilization gate

✅ Brownfield adoption matrix

✅ Risk-scaled grill probes

✅ Deterministic gate format

✅ Decision screen format

✅ Skill routing table

✅ Quality gates

✅ Stop conditions

ChatGPT recommends creating enterprise-ai-dev-orchestrator as a NEW, SEPARATE skill. This creates:



Dual authority — Two skills both claim "I am the master orchestrator"

Trigger collision — Both trigger on "build", "refactor", "review", "brownfield"

Token doubling — Agent loads BOTH and gets conflicting lifecycle instructions

Governance split — Which skill's lifecycle wins when they differ?

This is the #1 fatal flaw in ChatGPT's recommendation.



Recommended Install Location

Do NOT create a new skill folder. Instead:



Evolve enterprise-ai-dev — it already holds the correct position

Add reference files to skills/enterprise-ai-dev/references/ — progressive disclosure

Add validation scripts to scripts/ (repo-level, not skill-level) — reusable across skills

Risks

Risk	Severity	Description

Dual authority	FATAL	New orchestrator + existing orchestrator = conflicting instructions

Name change confusion	HIGH	Renaming enterprise-ai-dev → enterprise-ai-dev-orchestrator breaks all install scripts, curated-skills.json, tier references

Token bloat	MEDIUM	ChatGPT's draft SKILL.md is \~3K chars LARGER than current one

7 reference files	MEDIUM	ChatGPT proposes 7 reference files; current repo already has overlapping content in reference/ and templates/

3 validation scripts inside skill	LOW	Should be at scripts/ level, not inside skill folder

PHASE 2 — Design Review

Classification of Every ChatGPT-Proposed Rule

The SKILL.md Body (Lines 249–800)

Rule / Section	ChatGPT Line	Classification	Rationale

"You are the orchestrator for safe, spec-driven..."	253	DELETE	Identity framing. Already covered by frontmatter description.

Lifecycle chain (repo truth → ... → lessons)	259	HOT ✅	Keep in SKILL.md. Already exists in current file.

"This skill improves reliability, does not guarantee correctness"	263	HOT ✅	Honest limitations. Add to current SKILL.md.

Operating Principle	271-281	HOT ✅	Already equivalent to "Prime Directive" in current file.

Claim Labels (FACT/INFERENCE/JUDGMENT/UNVERIFIED)	285-300	HOT ✅	Already in AGENTS.template.md but good to have in SKILL.md too — 4 lines.

Authority Order (7 levels)	303-326	WARM	Too detailed for SKILL.md. Move to reference. Current file doesn't have this — ADD to reference.

Step 0 — Classify	329-354	HOT ✅	Already in current SKILL.md. ChatGPT adds GOVERNED, STALE\_OR\_MIXED, REVIEW\_ONLY, RELEASE. ACCEPT: these are valuable additions.

Step 1 — Repo Truth Audit	357-396	HOT ✅	Already in current SKILL.md as 1A/1B.

Step 2 — PRD	399-426	HOT ✅	Already in current SKILL.md.

Step 3 — Adversarial Spec	429-456	HOT ✅	Already in current SKILL.md (risk-scaled probes).

Step 4 — Architecture Checkpoint	459-482	HOT ✅	Already in current SKILL.md.

Step 5 — Task Graph	485-512	HOT ✅	Already in current SKILL.md.

Step 6 — Slice Contract	515-548	HOT ✅	Already in current SKILL.md.

Step 7 — TDD Where It Matters	551-586	WARM	Move to reference. TDD details belong in the tdd skill, not here. Orchestrator should say "use TDD" not define TDD.

Step 8 — Self-Review	589-612	HOT ✅	6-question checklist. Compact. Add to current SKILL.md.

Step 9 — Deterministic Gates	615-643	HOT ✅	Already in current SKILL.md.

Step 10 — Independent AI Review	645-684	WARM	Move to reference. This is a reviewer protocol, not orchestrator behavior.

Step 11 — Human Approval	687-718	HOT ✅	Already in current SKILL.md as stop conditions. ChatGPT's list is more explicit. MERGE.

Step 12 — Antigravity Usage	721-745	DELETE from SKILL.md / WARM as reference	Platform-specific. Should NOT be in a portable SKILL.md. Move to reference/antigravity.md if needed.

Step 13 — Lessons / Self-Learning	749-772	WARM	Promotion ladder is valuable but too detailed for SKILL.md. Move to reference.

Stop Conditions	775-802	HOT ✅	Already in current SKILL.md. ChatGPT adds 2 good ones ("about to guess architecture", "user intent conflicts with safety").

Output Contract (planning/execution)	805-852	HOT ✅	New and valuable. Current SKILL.md has no output contract. Add this — 15 lines.

The Reference Files

Proposed Reference	Classification	Rationale

references/lifecycle.md	WARM — EXISTS as docs/ROADMAP.md	Duplicate authority. ROADMAP.md IS the lifecycle document.

references/brownfield.md	WARM — EXISTS as reference/brownfield-adoption.md	Already built in Phase 1.

references/greenfield.md	DELETE	Greenfield is 8 lines in SKILL.md. Doesn't need a reference file.

references/autonomous-loop.md	WARM	3 lines in SKILL.md today. Could be a small reference for Phase 3. Already planned as reference/autonomous-execution.md.

references/risk-matrix.md	WARM — NEW, ACCEPT	ChatGPT's Low/Medium/High risk matrix with controls is genuinely useful and doesn't exist yet.

references/human-gates.md	DELETE	Redundant with the stop conditions in SKILL.md and human-approval list.

references/receipt-contract.md	WARM — EXISTS as templates/evidence-receipt.md	Duplicate. The template IS the contract.

references/antigravity-usage.md	WARM — ACCEPT for later	Platform-specific. Not MVP. Good for Phase 3/4 as optional reference.

The Scripts

Proposed Script	Classification	Rationale

scripts/validate-frontmatter.mjs	COLD ✅	Already planned for Phase 2 (inside gate-runner or standalone).

scripts/validate-slice-contract.mjs	DELETE	Over-engineering. Frontmatter validation covers this. A separate slice-contract validator is premature.

scripts/validate-receipt.mjs	DELETE	Same. Frontmatter schema validation is sufficient.

Summary: Keep / Change / Remove

Action	Items

KEEP (already exists)	Steps 0–6, 8–9, 11 in SKILL.md, brownfield matrix, risk-scaled probes, gate format, stop conditions

ADD to existing SKILL.md	Claim labels (4 lines), expanded Step 0 classifications, self-review 6-question checklist, output contract (planning + execution), "does not guarantee correctness" disclaimer

ADD as new reference	reference/risk-matrix.md (Low/Medium/High controls), authority order (7-level hierarchy)

MOVE from SKILL.md to reference	TDD specifics (→ tdd skill), AI review protocol, lessons promotion ladder

CHANGE	Merge ChatGPT's human-approval list into existing stop conditions

REMOVE	New skill folder (use existing), greenfield.md reference, human-gates.md, receipt-contract.md (template exists), validate-slice-contract.mjs, validate-receipt.mjs

DEFER	antigravity-usage.md (Phase 4), Codex openai.yaml (experimental)

What Must NOT Be Global

Item	Why

AGENTS.md content	Project-specific governance

.buildloop.yml	Project-specific commands

Task state (STATE.md)	Project-specific

CI configuration	Project-specific

Slice contracts	Generated per-story

Receipts	Generated per-phase

What Must Be Project-Local

Everything above. The orchestrator skill only provides the protocol — the project provides the facts.



PHASE 3 — Implementation Plan

Proposed Minimal File Tree

NO new skill folder. Evolve existing.



skills/enterprise-ai-dev/

&#x20; SKILL.md                         ← UPDATE (add 5 sections, \~30 lines net)

&#x20; references/                      ← NEW directory

&#x20;   risk-matrix.md                 ← NEW — Low/Medium/High controls

&#x20;   authority-order.md             ← NEW — 7-level authority hierarchy

&#x20;   lessons-protocol.md            ← NEW — promotion ladder

reference/                         ← EXISTING repo-level directory

&#x20; (no changes — brownfield-adoption.md and bootstrap-protocol.md already exist)

scripts/                           ← EXISTING

&#x20; (no changes now — gate-runner.mjs comes in Phase 2 per BUILD\_SPEC)

That's it. 4 files touched. 3 new, 1 updated.



What I Am NOT Building

Omitted	Why

skills/enterprise-ai-dev-orchestrator/	Duplicate authority with existing skill

references/lifecycle.md	Already docs/ROADMAP.md

references/brownfield.md	Already reference/brownfield-adoption.md

references/greenfield.md	8 lines in SKILL.md — no reference needed

references/receipt-contract.md	Already templates/evidence-receipt.md

references/human-gates.md	Merged into stop conditions

references/antigravity-usage.md	Deferred to Phase 4

scripts/validate-slice-contract.mjs	Schema validation covers this

scripts/validate-receipt.mjs	Schema validation covers this

agents/openai.yaml	Experimental, not proven

PHASE 4 — Implementation Detail

Files to Create/Modify

\#	Action	File	Blast Radius

1	UPDATE	skills/enterprise-ai-dev/SKILL.md	LOW — additive only, \~30 lines net

2	CREATE	skills/enterprise-ai-dev/references/risk-matrix.md	NONE — new file

3	CREATE	skills/enterprise-ai-dev/references/authority-order.md	NONE — new file

4	CREATE	skills/enterprise-ai-dev/references/lessons-protocol.md	NONE — new file

Rollback

bash

git revert HEAD    # single commit revert

What Changes in SKILL.md (Surgical Additions)

Add after Prime Directive — "This skill improves reliability. It does not guarantee correctness." (1 line)

Add to Step 0 table — GOVERNED, STALE\_OR\_MIXED, REVIEW\_ONLY, RELEASE rows (4 rows)

Add new section — "## Self-Review Checklist" (6 questions, 8 lines)

Add new section — "## Output Contract" (planning + execution formats, 15 lines)

Add to Stop Conditions — "About to guess architecture", "User intent conflicts with safety" (2 lines)

Add 1 line to Claim Labels reference — Read references/authority-order.md for full hierarchy.

What Does NOT Change

Frontmatter (name, description) — unchanged

Greenfield path — unchanged

Brownfield path — unchanged

Autonomous path — unchanged

Gate format — unchanged

Skill routing — unchanged

Quality gates — unchanged

PHASE 5 — Verification Plan

Checks to Run

\#	Check	Command / Method	Pass Criteria

1	SKILL.md has valid frontmatter	Parse YAML between --- delimiters	name + description present

2	SKILL.md size	wc -c or byte count	≤ 10K chars (currently 6.5K, adding \~2K)

3	No duplicate authority	grep -r "orchestrator" skills/	Only 1 skill with "orchestrator" in description

4	References are discoverable	SKILL.md contains Read references/	All 3 reference files mentioned

5	No platform-specific content	grep -i "antigravity|codex|claude" SKILL.md	0 hits in body (allowed in skill routing table)

6	Reference files exist	ls skills/enterprise-ai-dev/references/	3 files present

7	No Arkaan/Supabase leak	grep -ri "arkaan|supabase" skills/enterprise-ai-dev/	0 matches

Evidence Receipt Format

yaml

\---

type: evidence\_receipt

gate\_status: PASS | FAIL | PARTIAL

files\_changed:

&#x20; - skills/enterprise-ai-dev/SKILL.md (UPDATED)

&#x20; - skills/enterprise-ai-dev/references/risk-matrix.md (CREATED)

&#x20; - skills/enterprise-ai-dev/references/authority-order.md (CREATED)

&#x20; - skills/enterprise-ai-dev/references/lessons-protocol.md (CREATED)

verified:

&#x20; - frontmatter parses

&#x20; - size ≤ 10K chars

&#x20; - no duplicate authority

&#x20; - references discoverable

&#x20; - no platform-specific content in body

&#x20; - no Arkaan/Supabase references

unverified:

&#x20; - actual agent behavior when invoked (requires dogfooding)

&#x20; - token overhead in production context windows

rollback: "git revert HEAD"

\---

PHASE 6 — Dogfooding Plan

Test Scenarios

\#	Scenario	Trigger Phrase	Expected Behavior	Pass Criteria	Falsification

1	Greenfield	"I want to build a new SaaS dashboard"	Classify GREENFIELD → 1A audit → PRD → grill probes → slice contract → gate → build	Agent follows greenfield path, does NOT front-load ceremony, produces slice contract before coding	Agent skips repo audit OR produces >7 grill probes OR codes before approval

2	Brownfield	"Help me add a feature to this existing repo" (open in a repo with tests + CI)	Classify BROWNFIELD → 1A + 1B audit → diagnostic baseline → stabilization check → then PRD	Agent runs existing lint/test/build, produces diagnostic baseline, blocks features if broken	Agent ignores existing tests OR overwrites AGENTS.md OR skips stabilization

3	Active project (Arkaan)	"Review the Arkaan codebase and suggest improvements"	Classify REVIEW\_ONLY → 1A audit → analysis → no code changes	Agent inspects without modifying files, produces summary with claim labels	Agent modifies files OR creates governance files without asking

4	Review-only	"Is this PR safe to merge?" (with a diff visible)	Agent reviews diff against slice contract if one exists, checks for security/scope/test gaps	Produces GO / CONDITIONAL\_GO / NO\_GO with evidence references	Agent says "looks good" without checking tests/scope/security

Falsification Criteria (What Would Kill This Skill)

\#	Signal	Threshold

1	Agent creates new governance files without asking	1 occurrence = fail

2	Agent loads all 3 references for a trivial task	Token overhead > 20% of context

3	Agent ignores existing AGENTS.md in a brownfield project	1 occurrence = fail

4	Agent triggers on every message (too broad description)	Triggers on simple "fix this typo" = over-triggering

5	SKILL.md > 10K chars after evolution	Bloat signal

Adversarial Review — Fatal Flaws Found

Flaw 1: DUPLICATE AUTHORITY (FATAL)

ChatGPT proposes a new skill (enterprise-ai-dev-orchestrator) that does exactly what enterprise-ai-dev already does. Two orchestrators = governance conflict. Fix: Don't create a new skill. Evolve existing.



Flaw 2: PROMPT THEATER

ChatGPT's rules like "use rigid gates for safety" are pure prose. An agent can ignore every word. Fix: The only enforceable rules are (a) .buildloop.yml commands executed by gate-runner.mjs, (b) YAML schema validation, (c) CI checks. Everything else is advisory.



Flaw 3: REFERENCE FILE INFLATION

7 proposed reference files. 4 of them duplicate existing content (ROADMAP.md, brownfield-adoption.md, evidence-receipt.md, greenfield section in SKILL.md). Fix: Only 3 genuinely new references needed (risk-matrix, authority-order, lessons-protocol).



Flaw 4: ANTIGRAVITY-SPECIFIC CONTENT IN GLOBAL SKILL

A portable skill should NOT contain Antigravity-specific instructions. Different IDEs have different agent models. Fix: Defer antigravity-usage.md to Phase 4. Keep SKILL.md platform-agnostic.



Flaw 5: OVER-VALIDATED SCRIPTS

3 separate validation scripts (validate-frontmatter.mjs, validate-slice-contract.mjs, validate-receipt.mjs) when one frontmatter validator + JSON schema is sufficient. Fix: One validate-frontmatter.mjs (already planned in Phase 2). Schemas enforce structure. No extra scripts.



Flaw 6: TOKEN BLOAT RISK

ChatGPT's draft SKILL.md is \~9K chars. Current is 6.5K. Adding references means total loadable content could reach 20K+. Fix: Keep SKILL.md ≤ 10K. References only load on demand (progressive disclosure). Agent should NOT read all 3 references for every task.



What Antigravity May Over-Execute

Antigravity has terminal, browser, and file access. If the orchestrator says "run diagnostic" in autonomous mode, Antigravity WILL run every command without pausing.

Mitigation: .buildloop.yml protected\_paths + human approval gates in SKILL.md stop conditions.

How to Prevent Token Bloat

References are on-demand only — SKILL.md says "Read references/X.md for Y" but does NOT inline content

SKILL.md stays ≤ 10K chars

Caveman mode available for compression

Low-risk tasks skip references entirely

How to Keep It Helpful But Not Intrusive

User-invoked (/orchestrator or trigger phrase) — NOT auto-triggered on every message

Low-risk path uses only Step 0 + Step 1A + self-review — minimal ceremony

High-risk path adds full ceremony — grill probes, slice contracts, independent review

REVIEW\_ONLY mode produces analysis without touching files

Final Verdict

CONDITIONAL GO

Must Change Before Install (4 items)

\#	Change	Why

1	Do NOT create a new skill folder — evolve enterprise-ai-dev	Prevents duplicate authority

2	Add references inside the existing skill — skills/enterprise-ai-dev/references/	Progressive disclosure

3	Keep SKILL.md ≤ 10K chars after additions	Token discipline

4	No platform-specific content in SKILL.md body	Portability

Should Change After Dogfooding

\#	Change	When

1	Add antigravity-usage.md reference if Antigravity users need it	Phase 4

2	Add openai.yaml if Codex supports it and there's proven value	Phase 4

3	Split into sub-skills (brownfield-diagnostic, evidence-reviewer) if usage proves stable	Never until v3.0

Do NOT Build Yet

Item	Why

validate-slice-contract.mjs	Schema validation is sufficient

validate-receipt.mjs	Schema validation is sufficient

references/greenfield.md	8 lines in SKILL.md is enough

references/human-gates.md	Merged into stop conditions

Autonomous overnight mode	Not MVP. Document as future integration point only.

Obsidian/Graphify integration	Optional. Not in skill.

Exact Next Action

Update skills/enterprise-ai-dev/SKILL.md — add 5 sections (\~30 lines)

Create skills/enterprise-ai-dev/references/risk-matrix.md

Create skills/enterprise-ai-dev/references/authority-order.md

Create skills/enterprise-ai-dev/references/lessons-protocol.md

Verify (7 checks from Phase 5)

Commit: orchestrator-evolution: add references, expanded classification, output contract

Update tasks/STATE.md

Awaiting approval to proceed to Phase 4 implementation.

