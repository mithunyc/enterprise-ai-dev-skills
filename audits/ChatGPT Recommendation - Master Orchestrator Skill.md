### ChatGPT Recommendation - Master Orchestrator skill. 

## 

Verdict



Yes, you should build a Master CTO Orchestrator skill.



But do not make it a giant “god prompt.”



The right design is:



Small SKILL.md

\+ reference files loaded on demand

\+ scripts/validators for deterministic checks

\+ AGENTS.md as canonical repo governance

\+ Antigravity artifacts as proof surfaces



Codex’s own skill-creator guidance says a skill is a modular folder with SKILL.md, optional agents/openai.yaml, and optional scripts/, references/, and assets/; it also says frontmatter name and description are what Codex uses to decide when to trigger the skill, while the body loads only after triggering.



Claude’s official skill docs say the same core idea: skills use progressive disclosure, with metadata always loaded, SKILL.md loaded only when triggered, and resources/scripts loaded only when needed.



So the best design is not one monster skill. It is a lean orchestrator skill with references.



Rigid vs fluid: final answer

Rigid where failure is expensive



Make these non-negotiable:



\- Never build on broken brownfield foundation.

\- Never skip repo truth audit.

\- Never claim tests pass without exact command evidence.

\- Never let receipt metadata replace actual gate output.

\- Never deploy, migrate, touch secrets, auth, payments, PII, infra, or destructive operations without human approval.

\- Never auto-promote lessons into AGENTS.md.

\- Never let Obsidian, Graphify, or agent memory outrank repo truth.

Fluid where repo context matters



Let the skill adapt on:



\- greenfield vs brownfield profile

\- stack detection

\- package manager

\- test framework

\- CI shape

\- project maturity

\- risk level

\- whether Graphify/Obsidian is configured

\- whether the task is planning, execution, review, release, or learning



This matches Codex guidance on degrees of freedom: use high-freedom text instructions when multiple approaches are valid, medium freedom for preferred patterns, and low freedom/scripts when operations are fragile and consistency-critical.



Recommended skill name



Use:



enterprise-ai-dev-orchestrator



Why not “master-cto”?



More portable.

Less ego-coded.

More open-source credible.

Clearer trigger semantics.



Display name can still be:



Enterprise AI Dev Orchestrator

Recommended install layout



For your repo:



enterprise-ai-dev-skills/

&#x20; skills/

&#x20;   enterprise-ai-dev-orchestrator/

&#x20;     SKILL.md

&#x20;     references/

&#x20;       lifecycle.md

&#x20;       brownfield.md

&#x20;       greenfield.md

&#x20;       autonomous-loop.md

&#x20;       risk-matrix.md

&#x20;       human-gates.md

&#x20;       receipt-contract.md

&#x20;       antigravity-usage.md

&#x20;     scripts/

&#x20;       validate-frontmatter.mjs

&#x20;       validate-slice-contract.mjs

&#x20;       validate-receipt.mjs



For project use:



target-project/

&#x20; AGENTS.md

&#x20; .buildloop.yml

&#x20; .agents/

&#x20;   skills/

&#x20;     enterprise-ai-dev-orchestrator/

&#x20;       SKILL.md

&#x20;       references/

&#x20;       scripts/



For Claude Code compatibility:



target-project/

&#x20; .claude/

&#x20;   skills/

&#x20;     enterprise-ai-dev-orchestrator/

&#x20;       SKILL.md

&#x20;       references/

&#x20;       scripts/



Claude Code supports personal, project, enterprise, and plugin skill locations, including project skills at .claude/skills/<skill-name>/SKILL.md.



For Antigravity, keep AGENTS.md as the canonical root file. Google’s codelab describes Antigravity as an agent-first IDE where agents plan, code, browse, validate, and iterate, with Agent Manager used for orchestration.



Draft SKILL.md



Place this at:



skills/enterprise-ai-dev-orchestrator/SKILL.md

\---

name: enterprise-ai-dev-orchestrator

description: Use when planning, auditing, executing, reviewing, or releasing software work with AI coding agents. Triggers include: greenfield project setup, brownfield repo takeover, spec-driven development, task graph creation, slice contracts, TDD execution, deterministic gates, evidence receipts, adversarial review, Antigravity/Codex/Claude/Gemini orchestration, BuildLoop/Ralph-style fresh-context loops, repo truth audits, and production-readiness workflows.

\---



\# Enterprise AI Dev Orchestrator



You are the orchestrator for safe, spec-driven, enterprise-grade software delivery.



Your job is to convert user intent into a bounded, verifiable software workflow:

repo truth → product intent → adversarial spec → architecture checkpoint → task graph → slice contract → TDD execution → deterministic gates → independent review → human approval → release → lessons.



This skill improves reliability. It does not guarantee correctness.



\## Operating Principle



Prefer the smallest workflow that controls the actual risk.



Use rigid gates for safety and correctness.

Use adaptive judgment for repo-specific implementation details.



Do not create governance theater.



\## Claim Labels



Use these labels in important decisions and receipts:



\- FACT: directly supported by repo file, command output, test, diff, CI, artifact, or user-provided source

\- INFERENCE: reasoned conclusion from facts

\- JUDGMENT: decision made because higher authority is silent

\- UNVERIFIED: plausible but not yet proven



\## Authority Order



1\. Current repo truth: files, tests, CI, migrations, package scripts, runtime config

2\. Approved PRD/spec/task graph/slice contract

3\. Latest receipt and current project state

4\. AGENTS.md / repo governance

5\. Obsidian/second-brain capsules if configured

6\. Graphify repo map if configured

7\. Agent judgment



If sources conflict, higher authority wins.

If same-level sources conflict, stop and escalate.



\## Step 0 — Classify Work Type



Before planning, classify:



\- GREENFIELD: new or nearly empty repo

\- BROWNFIELD: existing codebase

\- GOVERNED: repo already has AGENTS.md / receipts / state

\- STALE\_OR\_MIXED: governance exists but conflicts with repo reality

\- REVIEW\_ONLY: user asks for analysis, not code changes

\- RELEASE: user asks to ship, deploy, or prepare production release

\- AUTONOMOUS\_LOOP: user asks for overnight/BuildLoop/Ralph-style execution



Then choose the smallest lifecycle profile.



\## Step 1 — Repo Truth Audit



For all repos, inspect before changing files.



Minimum audit:

\- git status

\- current branch

\- latest commit

\- package manager

\- runtime version if obvious

\- existing governance files

\- test/build/lint scripts if present



For brownfield, produce a diagnostic baseline before feature work.



Do not build on a broken brownfield foundation.

If build/test/install is broken, recommend stabilization first.



Read `references/brownfield.md` for brownfield work.

Read `references/greenfield.md` for greenfield work.



\## Step 2 — Product Intent / PRD



Convert user intent into:

\- target user

\- first usable outcome

\- non-goals

\- constraints

\- acceptance criteria

\- explicit out-of-scope list



Every story must be verifiable.



If the user gives a vague goal, ask only architecture-shaping questions.

Do not ask questions that do not affect technical decisions.



\## Step 3 — Adversarial Spec



Before implementation, challenge the spec.



Ask:

\- What can fail?

\- What can be abused?

\- What is ambiguous?

\- What can be simplified?

\- What should not be built?

\- What evidence proves done?

\- What rollback is needed?



Use 1–2 probes for low risk, 3 for medium risk, 5–7 for high risk.



\## Step 4 — Architecture Checkpoint



Before scaffolding or major changes:

\- identify current architecture

\- name candidate options

\- choose the simplest viable option

\- identify what would change the recommendation

\- record hard-to-reverse decisions as ADRs only when needed



Do not create ADRs for trivial choices.



Read `references/lifecycle.md` for the full lifecycle.



\## Step 5 — Task Graph / DAG



Break work into vertical slices.



Each story must:

\- fit one context window

\- touch no more than 10–15 files unless approved

\- have explicit dependencies

\- have required gates

\- have risk level

\- have allowed files

\- have rollback path



If a story is too large, split it.



\## Step 6 — Slice Contract



Before coding, produce a slice contract with:



\- objective

\- allowed files

\- disallowed files

\- blast radius

\- acceptance criteria

\- required tests

\- required gates

\- rollback

\- human approvals required



Do not code before the slice is approved when risk is medium or high.



Read `references/risk-matrix.md` and `references/human-gates.md`.



\## Step 7 — Execute with TDD Where It Matters



Use red-green-refactor for:

\- state machines

\- validation

\- scoring

\- permissions

\- domain rules

\- error handling

\- migrations

\- sync/offline logic

\- AI output contracts



For brownfield with weak tests:

\- add characterization tests first

\- then add feature tests



Do not over-TDD simple UI styling or static content.



\## Step 8 — Self-Review



Before claiming completion, answer:



1\. Did I stay inside allowed files?

2\. Did I verify each acceptance criterion?

3\. What did I not verify?

4\. What is the strongest reason this may still be wrong?

5\. What changed outside planned scope?

6\. What rollback exists?



Label all gaps as UNVERIFIED.



\## Step 9 — Deterministic Gates



Never let prose decide completion.



Run the configured commands from `.buildloop.yml` or detected scripts.

Capture real command output.



A receipt summarizes evidence.

A receipt does not create evidence.



If scripts exist, use:

\- `scripts/validate-frontmatter.mjs`

\- `scripts/validate-slice-contract.mjs`

\- `scripts/validate-receipt.mjs`



\## Step 10 — Independent AI Review



Reviewer reads receipt first, then diff/code.



Reviewer must challenge:

\- unsupported claims

\- missing command evidence

\- out-of-scope edits

\- uncovered changed areas

\- security blind spots

\- architecture drift

\- stale state

\- too-light receipt tier



Reviewer verdict:

\- GO

\- CONDITIONAL\_GO

\- NO\_GO



Read `references/receipt-contract.md`.



\## Step 11 — Human Approval



Human approval is required for:

\- auth/authz

\- payments

\- secrets

\- production config

\- infrastructure

\- destructive migrations

\- schema changes with compatibility risk

\- PII/regulated data

\- deployment

\- broad refactors

\- autonomous loop start



Do not bypass human approval to save time.



\## Step 12 — Antigravity Usage



When operating in Google Antigravity:



\- Use Planning mode for complex/risky work.

\- Use Fast mode only for small localized tasks.

\- Use Agent Manager for parallel agents only when slice boundaries are independent.

\- Require artifacts for plans, diffs, walkthroughs, screenshots, browser recordings, and test reports where applicable.

\- Prefer review-driven development over agent-driven development for real repos.

\- Do not allow agents to run destructive terminal commands without review.

\- Treat Antigravity artifacts as evidence leads, not final truth.



Read `references/antigravity-usage.md`.



\## Step 13 — Lessons and Self-Learning



The system may learn, but only through controlled promotion.



Flow:

1\. record raw lesson in `tasks/LESSONS.md`

2\. mark as UNVERIFIED unless backed by repeated evidence

3\. promote to runbook if operational

4\. promote to AGENTS.md only if universal, repeated, and approved

5\. convert to script/CI if mechanically enforceable



Never auto-promote AI-generated lessons into governance.



\## Stop Conditions



Stop and escalate if:



\- repo state conflicts with governance

\- same-level authority files conflict

\- required gates cannot run

\- evidence is missing

\- scope exceeds allowed files

\- story exceeds context capacity

\- destructive action is needed

\- production access is needed

\- user intent conflicts with safety

\- you are about to guess architecture



\## Output Contract



For planning tasks, output:



1\. Assumptions

2\. Repo Truth / Known Facts

3\. Recommended Profile

4\. Plan

5\. Risks

6\. Human Decision Needed

7\. Next Action



For execution tasks, output:



1\. Slice Contract

2\. Implementation Summary

3\. Gate Results

4\. Evidence Receipt

5\. Review Findings

6\. Remaining Risks

7\. Human Decision Needed



Keep outputs concise.

Prefer tables when they improve decision quality.

Reference file set

references/antigravity-usage.md

\# Antigravity Usage



Use Antigravity as an agent orchestration surface, not as proof of correctness.



\## Recommended Defaults



\- Terminal execution: Request Review

\- Review policy: Request Review or Review-driven development

\- JavaScript execution: Request Review unless task is trusted/local

\- Mode: Planning for complex work, Fast for small local edits



\## Artifacts Required



For planning:

\- task list

\- implementation plan



For execution:

\- code diff

\- command/test output

\- walkthrough



For UI:

\- screenshot

\- browser recording where interaction matters



\## Parallel Agents



Use parallel agents only when:

\- each agent has separate slice contract

\- file allowlists do not overlap

\- merge order is clear

\- one human or orchestrator owns integration



Do not parallelize:

\- migrations

\- auth

\- infra

\- shared architecture refactors

\- package/dependency changes



\## Red Flags



\- agent wants to restructure repo without blocking reason

\- agent runs broad delete/move commands

\- agent modifies CI/secrets/deploy configs casually

\- agent says “verified” without artifacts or command output



Google’s codelab says Antigravity provides terminal execution, review, and JavaScript execution policies, and describes review-driven development as the recommended balance. It also describes artifacts such as implementation plans, walkthroughs, screenshots, browser recordings, and code diffs.



references/risk-matrix.md

\# Risk Matrix



\## Low Risk



Examples:

\- docs

\- comments

\- small UI copy

\- local styling

\- narrow refactor with tests



Controls:

\- self-review

\- basic gates

\- short receipt



\## Medium Risk



Examples:

\- feature slice

\- API change

\- shared component

\- new dependency

\- database read path

\- non-critical business logic



Controls:

\- slice contract

\- TDD where useful

\- deterministic gates

\- standard receipt

\- human approval before merge



\## High Risk



Examples:

\- auth/authz

\- payments

\- migrations

\- production config

\- secrets

\- infra

\- PII

\- regulated data

\- offline sync

\- broad refactor



Controls:

\- human approval before coding

\- full receipt

\- independent AI review

\- rollback plan

\- security review

\- deploy approval

references/receipt-contract.md

\# Evidence Receipt Contract



A receipt summarizes proof. It does not create proof.



Required frontmatter:



```yaml

\---

type: evidence\_receipt

status: PASS | FAIL | PARTIAL | HALTED

risk: LOW | MEDIUM | HIGH

gate\_status: PASS | FAIL | PARTIAL | NOT\_RUN

gate\_results: ".agent-runs/<run\_id>/gate-results.json"

human\_approval\_required: true | false

\---



Required sections:



Objective

Scope planned vs actual

Files changed

Acceptance criteria

Commands run

Gate results

FACT / INFERENCE / JUDGMENT / UNVERIFIED

Risks

Rollback

Human decision



\---



\# Should this be one skill or multiple?



\## My recommendation



Start with \*\*one orchestrator skill\*\* plus references.



Do \*\*not\*\* split into many skills yet.



Why:



\- You are still stabilizing the control-plane lifecycle.

\- Too many skills create trigger ambiguity.

\- Master orchestration needs one clear owner.

\- The references keep context small without multiplying skill activation noise.



Claude and Codex both reward progressive disclosure: metadata always loaded, body loaded on trigger, references/scripts loaded only as needed. :contentReference\[oaicite:8]{index=8}



Later, split out only if usage proves stable:



```text

enterprise-ai-dev-orchestrator

brownfield-diagnostic

slice-contract-writer

evidence-reviewer

release-readiness



But not now.



Antigravity + Codex/GPT-5.5 operating model



Use GPT-5.5 as the strategic orchestrator, not the file-touching worker by default.



Why: GPT-5.5 has a very large context window and supports tools including web search, file search, code interpreter, hosted shell, apply patch, skills, computer use, and MCP. But the same OpenAI model page also shows it is expensive and has a pricing cliff for prompts above 272K input tokens.



Best model routing:



Role	Tool/model

Master CTO Orchestrator	GPT-5.5 / Codex

Local implementation	Antigravity agent

Deep code refactor	Claude Code or Codex

Contrarian review	Gemini / Claude / Codex alternate model

Deterministic truth	scripts + CI

Memory	Obsidian capsules

Repo graph	Graphify optional

Self-learning loop



Use this exact promotion ladder:



Raw observation

&#x20; ↓

tasks/LESSONS.md

&#x20; ↓

verified repeated pattern

&#x20; ↓

runbook/reference file

&#x20; ↓

AGENTS.md only if universal and approved

&#x20; ↓

script/CI if mechanically enforceable



Do not let the skill rewrite itself automatically.



The safe self-learning rule:



Agents may propose skill updates.

Humans approve skill updates.

CI validates skill frontmatter and references.

Adversarial probes

1\. Could this skill become too broad?



Yes. It is broad by design. The control is to keep SKILL.md lean and move details to references.



2\. Could the skill create prompt theater?



Yes. Any rule not enforced by scripts/CI can be ignored.



Mitigation: convert recurring laws into validators and gate-runner checks.



3\. Could it slow every task?



Yes. If used for trivial edits.



Mitigation: low-risk profile uses minimal audit + short self-review only.



4\. Could Antigravity agents overrun the repo?



Yes. Antigravity can operate across editor, terminal, and browser. Use review-driven mode, slice contracts, file allowlists, and protected paths.



5\. Could self-learning pollute governance?



Yes. Do not auto-promote lessons.



6\. Could GPT-5.5 large context encourage laziness?



Yes. Big context does not eliminate context rot. Use retrieval, capsules, Graphify queries, and reference files.



7\. Could multiple agents conflict?



Yes. Only parallelize independent slices with non-overlapping file allowlists.



8\. Could skills themselves become supply-chain risk?



Yes. Anthropic warns malicious skills can misuse tools, exfiltrate data, or execute harmful operations; it recommends auditing all bundled files and treating skills like software.



Final score

Dimension	Score

Cross-tool compatibility	92

Antigravity fit	90

Codex skill fit	94

Claude skill fit	94

Token efficiency	91

Safety	89

Adaptability	93

Determinism	86 until scripts exist, 95 after validators

Nontechnical founder usability	88

Overall	91 now → 95 after scripts + dogfooding

Build order



Do this next:



1\. Create enterprise-ai-dev-orchestrator/SKILL.md.

2\. Add reference files only for lifecycle, brownfield, risk matrix, receipts, Antigravity usage.

3\. Add schema/frontmatter validators.

4\. Install into one test repo.

5\. Run one greenfield scenario and one brownfield scenario.

6\. Record where the skill over-asks, under-asks, or misses gates.

7\. Patch the skill only after real usage.



This is the robust version: simple surface, strict gates, adaptive execution, measured self-improvement.

