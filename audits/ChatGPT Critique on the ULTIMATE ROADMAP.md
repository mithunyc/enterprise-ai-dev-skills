### ChatGPT Critique on the 'ULTIMATE ROADMAP — Enterprise-AI-Dev Control Plane v4.0"



Verdict



It is good. More specifically: this is the strongest version so far because it finally does three things correctly:



Separates planning from execution.

Treats brownfield repos as dangerous until audited.

Moves control-plane state into machine-readable frontmatter instead of pure prose.



I would call it a CONDITIONAL GO, not “UNCONDITIONAL GO.” The architecture is sound, but the roadmap still has a few failure modes that should be fixed before build.



Source reviewed: uploaded “ULTIMATE ROADMAP — Enterprise-AI-Dev Control Plane v4.0.”



Scores

Dimension	Score	Reason

Architecture clarity	94/100	Strong lifecycle, clean planning/execution split, good greenfield/brownfield distinction.

Brownfield readiness	90/100	Mandatory diagnostic is correct. Needs a “minimal audit even for greenfield” and better stabilization thresholds.

Greenfield readiness	91/100	Strong, but skipping repo audit entirely is too aggressive.

Determinism	88/100	YAML frontmatter is excellent, but YAML is not enforcement unless schema-validated.

Token optimization	90/100	Skill tiers are strong. Need hard token budgets and “read-on-demand only” tests.

Supply-chain security	84/100	Pinned SHAs and audit-upstream.mjs are good. Need checksums/signing/SBOM later.

Nontechnical founder usability	89/100	Profiles and gates help. Needs a plain-English “decision screen” per gate.

Open-source readiness	86/100	Good structure. Needs stronger install safety and no one-line unsafe defaults.

Autonomous safety	82/100	Correctly defers headless orchestrator, Docker, L4 overnight to future. Needs stricter autonomous profile wording.

Overall	90/100 now → 94/100 with fixes	



I would not claim 96–98 yet. Those scores require measured proof after Phase 2.



What is excellent

1\. The Three Laws are mostly right



The roadmap’s three non-negotiables are strong: YAML frontmatter for control-plane state, mandatory brownfield diagnostics before feature work, and planning-heavy execution discipline.



Keep this.



One correction:



Markdown = human-readable record

YAML frontmatter = machine-readable metadata

Schema validation = actual enforcement



YAML alone is not determinism. YAML plus schema plus gate-runner is determinism.



2\. Brownfield posture is right



The roadmap says: broken build → stabilize first → block features. It also says existing AGENTS.md, CLAUDE.md, CI, task tracker, skills, and test framework should be respected rather than overwritten.



That is the right non-destructive brownfield adoption posture.



3\. Graphify is correctly positioned



Graphify is optional for large repos/dependency graphs and explicitly not bundled into MVP.



Correct. Keep it as an optional companion.



4\. Phase 5 “Future, not MVP” is disciplined



Deferring headless buildloop.mjs, Docker sandbox, L4 overnight mode, Obsidian integration, and Graphify bundling is the right call.



This is the strongest sign the roadmap is becoming real instead of bloated.



Must-fix issues before build

1\. Change “UNCONDITIONAL GO” to “CONDITIONAL GO”



Problem: “UNCONDITIONAL GO” creates false certainty. The falsification section itself admits the architecture can be wrong after Phase 2.



Fix:



Status: CONDITIONAL GO

Condition: Phase 2 must prove schema parsing, install modes, gate-runner, and CI dogfooding.



This is more enterprise credible.



2\. Greenfield should not skip repo truth audit entirely



The roadmap says greenfield skips Step 1 repo truth audit.



That is slightly wrong.



Even greenfield needs a minimal truth audit:



\- git status

\- branch

\- package manager

\- runtime version

\- existing files

\- whether repo is empty or partially scaffolded

\- whether any user files already exist



Better:



Step 1A: Minimal repo truth audit — all projects

Step 1B: Full diagnostic baseline — brownfield only



This preserves speed without losing safety.



3\. Gate-runner must not trust the receipt



The roadmap says gate-runner parses evidence-receipt YAML and status: GO + tests\_passed: true → PASS; anything else fails.



That is backwards.



The receipt should not decide gate success. The gate-runner should produce the evidence.



Correct model:



gate-runner runs commands

→ captures exit codes/stdout/stderr

→ writes gate-results.json

→ receipt references gate-results.json

→ reviewer checks receipt against gate-results.json



Otherwise an agent could write:



status: GO

tests\_passed: true



and accidentally or dishonestly pass metadata without real proof.



10x fix, low complexity



Add this artifact:



.agent-runs/<run\_id>/gate-results.json



Example:



{

&#x20; "run\_id": "2026-05-09T180000Z",

&#x20; "commands": \[

&#x20;   {

&#x20;     "name": "typecheck",

&#x20;     "command": "pnpm typecheck",

&#x20;     "exit\_code": 0,

&#x20;     "log": ".agent-runs/.../typecheck.log"

&#x20;   }

&#x20; ],

&#x20; "overall": "PASS"

}



Then receipt frontmatter should say:



gate\_results: ".agent-runs/2026-05-09T180000Z/gate-results.json"

status: PASS



This is the highest-value correction.



4\. Self-grill at every planning step can become theater



The roadmap uses grill-me probes at every planning step.



Good instinct, but unlimited self-grill becomes token bloat.



Set a hard rule:



Low-risk slice: 1–2 probes

Medium-risk slice: 3 probes

High-risk slice: 5–7 probes

Never exceed 7 unless human asks



This keeps rigor without turning every task into ceremony.



5\. The autonomous loop profile is underspecified



The roadmap says autonomous loop uses steps 0, 1, 9, 10, 11, 12 repeat.



That is unsafe unless planning artifacts already exist.



Autonomous mode must require:



\- approved PRD

\- approved task graph

\- approved slice contracts

\- .buildloop.yml

\- allowed\_files

\- max iterations

\- max runtime

\- no production secrets

\- no deploy



Better autonomous profile:



Autonomous Loop:

Prerequisite: Steps 0–8 already approved.

Loop: 9 → 10 → 11 → 12 → receipt → commit → next approved slice.



Do not let autonomous mode skip planning.



6\. Falsification conditions need measurement definitions



The roadmap’s falsification conditions are exactly the right idea, but some are not yet measurable.



Rewrite them as measurable tests:



Current condition	Better version

Agents ignore AGENTS.md >10%	In 20 benchmark tasks, >2 violate a hot rule.

Brownfield adoption >30 min	Baseline diagnostic generation >30 min on a medium repo, excluding stabilization work.

Governance overhead >20% context	Hot files loaded at startup exceed 20% of model context budget or >12k chars.

gate-runner fails >20% setups	Gate-runner cannot execute configured commands on >2 of 10 sample repos due to tool bugs, not project failures.

Self-grill skipped/no value	In 20 planning runs, <80% produce at least one acceptance-criteria or scope improvement.



This turns falsification into a real eval suite.



10x recommendations without adding complexity

1\. Add schema/ directory now



You have YAML frontmatter contracts. Add schemas immediately.



schemas/

&#x20; diagnostic-baseline.schema.json

&#x20; prd.schema.json

&#x20; slice-contract.schema.json

&#x20; evidence-receipt.schema.json

&#x20; adversarial-review.schema.json

&#x20; buildloop.schema.json



Then add:



scripts/validate-frontmatter.mjs



This is low-complexity and high-leverage.



2\. Add gate-results.json as the proof anchor



This is the most important architectural correction.



Commands produce gate-results.json.

Receipts summarize it.

Reviewers verify against it.

Humans approve based on it.



This prevents proof theater.



3\. Add one “decision screen” for nontechnical users



Every planning gate should end with:



DECISION REQUIRED



Recommendation:

\- PROCEED / FIX / HALT



Why:

\- ...



Risk:

\- LOW / MEDIUM / HIGH



What I need from you:

\- approve / modify / reject



If approved, next action:

\- ...



This is simple and makes the system founder-safe.



4\. Add adoption-mode to .buildloop.yml



Example:



adoption\_mode: greenfield | brownfield | autonomous

risk\_level: low | medium | high

commands:

&#x20; lint: "pnpm lint"

&#x20; test: "pnpm test"

protected\_paths:

&#x20; - ".env\*"

&#x20; - "supabase/migrations/\*\*"

&#x20; - ".github/workflows/\*\*"



This lets the runner and agents know which safety rules apply.



5\. Add “protected paths” before autonomous mode



Do this now, even if autonomous execution is future.



protected\_paths:

&#x20; - ".env\*"

&#x20; - "\*\*/\*.key"

&#x20; - "\*\*/\*.pem"

&#x20; - "infra/\*\*"

&#x20; - "terraform/\*\*"

&#x20; - ".github/workflows/\*\*"

&#x20; - "supabase/migrations/\*\*"



Low complexity, major safety gain.



6\. Add one brownfield fixture repo for dogfooding



Your plan says one brownfield trace happened, but the repo needs a repeatable test.



Create:



examples/brownfield-broken-build/



It should include:



\- broken test

\- missing build command

\- stale AGENTS.md

\- existing CI

\- simple feature request



Then prove:



diagnostic\_baseline.md catches it

feature work is blocked

stabilization plan is produced



This makes brownfield readiness real.



7\. Add one greenfield fixture repo



Create:



examples/greenfield-empty/



Prove:



minimal repo audit works

PRD template works

slice contract works

gate-runner handles no configured tests gracefully



This prevents overfitting to mature repos.



8\. Rename tests\_passed to gate\_status



tests\_passed: true is too narrow.



Use:



gate\_status: PASS | FAIL | PARTIAL | NOT\_RUN



Because some slices may have lint/build/typecheck/security gates, not just tests.



9\. Add evidence\_required to slice contract



Example:



evidence\_required:

&#x20; - typecheck

&#x20; - unit\_test

&#x20; - build

&#x20; - screenshot\_if\_ui

&#x20; - migration\_dry\_run\_if\_schema



This makes acceptance criteria enforceable.



10\. Keep local skills at 5



The roadmap’s choice of 5 local skills is good: enterprise-ai-dev, awesome-design-md, caveman, grill-me, and karpathy-guidelines.



Do not expand local skills until the skeleton works.



Specific scrutiny by section

Three Laws



Score: 9/10



Excellent, with one edit:



Determinism: Every gate/receipt/handoff uses YAML frontmatter validated by schemas. Markdown=humans, schema-validated YAML=control plane.

Lifecycle Profiles



Score: 8/10



Good adaptive idea. Needs greenfield minimal audit and autonomous prerequisites.



Steps 0–8 Planning



Score: 9/10



Very strong. The 60/40 planning/execution split is correct for agentic reliability.



Risk: too much self-grill.



Fix: risk-scaled grill count.



Steps 9–16 Execution



Score: 8.5/10



Strong, but gate-runner/receipt relationship must be fixed.



Brownfield Adoption Matrix



Score: 9.5/10



Excellent. This is one of the best parts.



The rules “read AGENTS.md, don’t overwrite,” “respect CI,” “use existing task tracker,” and “stabilize broken build first” are exactly right.



Repo Structure



Score: 9/10



Strong and simple.



Add:



schemas/

examples/



Maybe:



fixtures/



for test-only project samples.



Skill Tiers



Score: 8.5/10



Good. But token overhead estimates should be measured, not declared.



Add script:



scripts/measure-skill-tokens.mjs

Build Plan



Score: 9/10



Very good sequencing. Phase 0–2 is exactly where the proof lives.



Future / Not MVP



Score: 10/10



Excellent discipline. Do not move those into MVP.



Falsification Conditions



Score: 8/10



Excellent concept. Needs measurement definitions and sample size.



Revised roadmap status



I would change this:



Status: UNCONDITIONAL GO — This supersedes all prior artifacts.



to:



Status: CONDITIONAL GO.

This supersedes prior artifacts for MVP planning.

It becomes UNCONDITIONAL GO only if Phase 2 passes dogfooding on:

1\. this repo,

2\. one greenfield fixture,

3\. one brownfield fixture.



That is bulletproof and honest.



Final recommended minimal edits



Add these five changes and the roadmap is strong enough to build:



1\. Add schema validation for all YAML frontmatter.

2\. Add gate-results.json as source of proof.

3\. Change greenfield Step 1 from “skip” to “minimal audit.”

4\. Clarify autonomous mode requires approved Steps 0–8 first.

5\. Turn falsification conditions into measurable evals.



Optional but high value:



6\. Add schemas/ directory.

7\. Add examples/greenfield-empty and examples/brownfield-broken-build.

8\. Add protected\_paths to buildloop.yml.example.

9\. Add risk-scaled self-grill limits.

10\. Add nontechnical decision screen to every gate.

Final score after these edits

Dimension	Current	After edits

Architecture clarity	94	96

Brownfield readiness	90	95

Greenfield readiness	91	95

Supply-chain security	84	89

Token optimization	90	93

Determinism	88	96

Dogfooding integrity	88	94

Planning quality	94	96

Overall	90	94

Bottom line



Yes, it is good.



It is not overcomplicated. It is finally scoped correctly.



The only dangerous part is the confidence wording. The architecture should earn “unconditional” status through Phase 2 dogfooding, not declare it upfront.



Build it, but build the deterministic pieces first:



schemas → templates → gate-runner → fixture tests → CI → then docs polish



That is the cleanest path to a simple, robust, open-source-worthy system.

