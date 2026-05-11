---
# [CUSTOMIZE] Replace values in this block for your project.
project: "[YOUR_PROJECT_NAME]"
stack: "[YOUR_FRAMEWORK] + [YOUR_RUNTIME]"
package_manager: "[YOUR_PACKAGE_MANAGER]"  # e.g. npm | yarn | cargo | go mod
test_runner: "[YOUR_TEST_RUNNER]"           # e.g. jest | vitest | pytest | go test
lint_command: "[YOUR_LINT_COMMAND]"         # e.g. eslint . | ruff check .
typecheck_command: "[YOUR_TYPECHECK_COMMAND]" # e.g. tsc --noEmit | n/a
build_command: "[YOUR_BUILD_COMMAND]"       # e.g. npm run build | go build ./...
state_file: "tasks/STATE.md"
receipts_dir: "tasks/receipts/"
---

# AGENTS.md — Universal Agent Operating Protocol
# Buildloop public template. Customize the frontmatter and governance sections for your repo.

> **Quick start:** Read this file, then run the Bootstrap Protocol (§6).

---

## 0. What this file is

This file governs how coding agents work safely in this repo.

Goals:
- work across tools and models
- stay readable for non-technical founders
- reduce silent drift and fake verification
- keep governance proportional to actual risk
- preserve rollback and auditability

**Always require human review before production deploy when touching:**
- authentication or authorization
- payments or financial logic
- PII, health, or regulated data
- infrastructure, secrets, or production config
- destructive migrations or privileged admin actions

---

## 1. Fast start

```text
Read AGENTS.md and execute the Bootstrap Protocol.
```

---

## 2. Operating model

The human owns goals and approvals.
The agent owns planning, implementation, and evidence.
Evidence outranks assertions.
Uncertainty must be labeled.
Riskier work requires stronger proof.
When in doubt, stop and escalate.

Three roles:
- **Builder**: implements approved work
- **Reviewer**: challenges proof, drift, and risk
- **Human**: approves starts, overrides, and deploys

Preferred mode:
- Dual-agent for risky work (auth, payments, migrations, infra)
- Single-agent for low-risk work, with mandatory self-challenge

---

## 3. Non-negotiables

The agent MUST:
- detect project state before making changes
- ask only the minimum blocking questions
- keep work inside approved phase scope
- tie important claims to verifiable proof
- name changed areas and how each was checked
- separate FACT vs INFERENCE vs JUDGMENT vs UNVERIFIED
- preserve rollback capability
- update `tasks/STATE.md` before ending a phase
- stop when authority conflicts or risk is unresolved

The agent MUST NOT:
- claim "all tests pass" without exact commands and raw outputs
- claim "secure" after a superficial review
- silently resolve same-level document conflicts
- restructure a mid-project repo without a justified blocking reason
- treat stale lessons as current truth
- skip verification steps to save tokens or time

---

## 4. Claim labels

Use these in every receipt and important decision:

| Label | Meaning |
|-------|---------|
| **FACT** | Directly supported by a file, command, test, diff, or observed output |
| **INFERENCE** | Reasoned conclusion from facts |
| **JUDGMENT** | Decision made because higher authority was silent |
| **UNVERIFIED** | Plausible but not yet proven |

---

## 5. Bootstrap Protocol

Run when first reading this repo.

### 5.1 Detect project state

Classify the repo before changing any files:

| State | Description |
|-------|-------------|
| **A** | New / empty — little code, no build config, no governance |
| **B** | Existing / unmanaged — app code exists, no agent governance |
| **C** | Existing / governed — this protocol or equivalent already exists |
| **D** | Existing / mixed — partial governance, stale or contradictory |

Required output:
```text
PROJECT STATE REPORT
Detected state: [A/B/C/D]
Confidence: [high/medium/low]
Signals:
- ...
Next step:
- ...
```

Do not modify files before reporting project state.

### 5.2 Onboarding questions (new projects)

Ask only what changes architecture, data shape, risk, or deployment.
Ask in groups. Wait for answers before the next group.

**Group 1 — Product identity**
1. What is the product and who is it for?
2. What is the first usable outcome?
3. What surfaces are needed now: web, mobile, backend/API, desktop?

**Group 2 — Data and access**
4. Do users need accounts? What kind?
5. Will the app store user data? What kind?
6. Are there public pages needing SEO or indexing?

**Group 3 — Existing materials**
7. Are there existing specs, wireframes, brand assets, or stack preferences?
8. Where should it deploy?
9. What is explicitly out of scope for v1?

**Group 4 — Constraints**
10. Any legal, security, or integration constraints?

### 5.3 Architecture checkpoint

Before scaffolding, output:
```text
ARCHITECTURE CHECKPOINT
Known facts:
- ...
Open ambiguities that affect architecture:
- ...
Candidate options:
- Option A: good when: / tradeoffs:
- Option B: good when: / tradeoffs:
Default recommendation:
- ...
- why:
- what would change my mind:
```

If architecture-impacting ambiguity remains, stop and ask for approval.

### 5.4 Existing project stabilization (States B and D)

Run native lint/test/build. Produce `tasks/diagnostic-baseline.md`. Required:
```text
PROJECT AUDIT REPORT
Repo shape: / Framework/runtime: / Package manager:
Health: install / lint / typecheck / test / build
CI/runtime: workflow files / parity risks
Governance: current files / contradictions / stale / missing
Architecture: boundary violations / oversized modules / weak coverage
Git state: branch / clean / detached head
Risk register: critical / high / medium / low
```

If `stabilization_required: true` → BLOCK features until foundation is verified.

---

## 6. Governance rules

Required baseline:
- `AGENTS.md` at root
- `tasks/STATE.md`
- `tasks/receipts/`

Optional — only when each file names the exact risk it prevents.
Never create empty placeholders.
Never create duplicate authority for the same rule.

---

## 7. Authority hierarchy

1. **Product truth** — approved PRD, specs, acceptance criteria, explicit human decisions
2. **Product boundaries** — MVP boundary, non-goals, data contracts, migration constraints
3. **Enforcement rules** — security, architecture, deploy, verification gates
4. **Engineering standards** — naming, style, folder patterns, commit norms
5. **Agent judgment** — only when higher levels are silent; must be labeled JUDGMENT

Conflict handling:
1. Identify both files and exact conflict
2. Identify each file's authority level
3. Higher level wins
4. If same level conflicts, stop and escalate

---

## 8. Phase engine

All work happens in reviewable phases.

**Mandatory phase rules:**
- one primary objective per phase
- blast radius stated before coding
- rollback stated before coding
- human approval before coding
- no auto-proceed

**Phase proposal format:**
```text
PHASE PROPOSAL: Phase [N] — [name]
Objective:
Inputs required:
Expected file touches:
  create: / modify: / delete:
Blast radius:
Verification plan:
  exact commands: / targeted checks: / manual checks:
Rollback:
Confidence: high/medium/low — why
Human decision: approve / adjust / reject
```

**Story sizing rules:**
- touch no more than 10–15 files per story
- completable, testable, and verifiable in one session
- if > ~100 new lines of logic, consider splitting
- if changes span 3+ integration layers, keep each layer change small

**Vertical slice pattern (RIGHT):**
```text
Each phase cuts through ALL integration layers end-to-end.
Schema + domain + tests → API + UI + E2E
NOT: all schema → all API → all UI (horizontal anti-pattern)
```

**If context fills up mid-story:**
1. Stop at the nearest safe commit point
2. Commit completed work
3. Note stopping point in `tasks/STATE.md`
4. End session cleanly — next session picks up from STATE.md

---

## 9. State and continuity

**Required file:** `tasks/STATE.md`

Session start MUST read:
1. `AGENTS.md`
2. `tasks/STATE.md`
3. Latest receipt in `tasks/receipts/`
4. `docs/INDEX.md` if present
5. `tasks/LESSONS.md` if present

**Required session commands:**
```bash
# [CUSTOMIZE] Adapt these to your project's actual commands
[YOUR_PACKAGE_MANAGER] install    # verify deps
[YOUR_LINT_COMMAND]               # verify lint
[YOUR_TYPECHECK_COMMAND]          # verify types
git status
git branch --show-current
git log -1 --oneline
```

**Required session output:**
```text
SESSION RESUME REPORT
Project: / Current branch: / Working tree clean:
Last receipt: / Current phase: / Open risks:
Open human decisions: / Lessons loaded:
State/receipt consistency: / Recommended next action:
```

If `tasks/STATE.md` conflicts with the latest receipt or actual repo state:
- stop → produce STATE MISMATCH report → recommend likely truth → ask for approval

---

## 10. Evidence receipts

Every phase produces a receipt at: `tasks/receipts/phase-[N]-[slug].md`

**Sizing:**

| Tier | Use when |
|------|----------|
| SHORT | Low-risk, ≤5 files, no auth/payments/migrations |
| STANDARD | Default |
| FULL | Auth, payments, secrets, regulated data, migrations, deploys, infra |

When in doubt, go one level up.

**SHORT receipt:**
```text
EVIDENCE RECEIPT: PHASE [N] — [NAME] (SHORT)
KEY DECISION FOR HUMAN: [single most important thing]
Date: / Objective: / Status: COMPLETE/PARTIAL/HALTED/FAILED
Files changed: / Commands run: [command → exit code]
FACT: / INFERENCE: / JUDGMENT: / UNVERIFIED:
Known risks: / Rollback: / STATE.md updated: yes/no / Next phase:
```

**STANDARD receipt:**
```text
EVIDENCE RECEIPT: PHASE [N] — [NAME]
KEY DECISION FOR HUMAN: [single most important thing]
Date: / Objective: / Status: / Confidence: [high/medium/low] — why
Scope: planned: / actual: / out-of-scope changes:
Git state: branch: / clean: / detached head:
Commands run: [exact command → exit N → key output]
Touched-area coverage: [area] → [check] → [result]
FACT: / INFERENCE: / JUDGMENT: / UNVERIFIED:
Known risks: / Rollback: / STATE.md updated: / Next phase:
Human decision required:
```

**FULL receipt adds:**
```text
Verification matrix: [claim] → [evidence type] → [proof] → [verified/partial/unverified]
Mutation-minded verification: [critical area] → what wrong impl would still pass? → [answer]
Security check: triggers active / checks performed / findings / depth
Architecture check: vendor imports in core / business logic in handlers / oversized modules
Environment check: CI-equivalent command / match quality / parity risks / env vars assumed
Spec compliance: implemented / not implemented / drift found
```

**Receipt quality rules:**
- Never say "all tests pass" without exact commands and outputs
- If zero tests ran, say so explicitly
- If a changed area lacks coverage, say so explicitly
- Partial work must be labeled PARTIAL

---

## 11. Adversarial review

Required for dual-agent mode. Strongly recommended before risky merges.

```text
ADVERSARIAL REVIEW: PHASE [N] — [NAME]
Inputs reviewed: spec files / authority files / receipt / diff
Independent checks run:
- [command] → expected: / actual: / outcome:
Findings:
1. [finding]
   severity: critical/high/medium/low
   category: spec drift/weak proof/architecture violation/security gap/env gap/governance conflict/missing requirement
   evidence: / required fix:
Receipt integrity:
- claim without proof: / proof that does not match claim:
- changed area not covered: / command not actually run:
Summary counts: critical: / high: / medium: / low:
Verdict: GO / CONDITIONAL GO / NO-GO
Why: ...
```

---

## 12. Git discipline

Before a phase:
```bash
git status --short
git branch --show-current
git log -1 --oneline
```

Rules:
- do not start from detached HEAD
- if dirty state exists, ask: stash / branch / commit / halt
- stay inside approved scope during a phase
- if scope expands materially, stop and re-propose

**Commit format:**
```text
[type]: phase [N] - [purpose]
```

---

## 13. Architecture boundaries

Default boundary model:

| Layer | Contains |
|-------|----------|
| **Core/domain** | Business rules, pure logic |
| **Contracts** | Schemas, interfaces, request/response contracts |
| **Adapters** | Storage implementations, vendor SDKs, provider glue |
| **App surface** | Routes, handlers, screens, thin orchestration only |

**Boundary checks:**
- vendor imports in domain/core → violation
- business logic in handlers → violation
- framework leakage into shared logic → violation

**Thin handler rule:** A handler is thin only if it mainly parses/validates input, delegates to service/domain logic, and maps output and errors. If business rules dominate, it is not thin.

---

## 14. Security triggers

Security review is trigger-based, not optional.

| Touch area | Required checks |
|-----------|----------------|
| Auth / authorization | Server-side enforcement, default-deny, token/session handling |
| Data stores / migrations | Parameterization, least privilege, rollback safety |
| User input / rendering | Validation, encoding/sanitization, upload handling |
| External integrations | Secret handling, retries/timeouts, webhook authenticity |
| Payments / PII / regulated data | Data minimization, audit logging, **recommend human review** |

Allowed security conclusions:
- `verified with evidence`
- `partially verified`
- `not deeply verified`

If "not deeply verified" on auth, payments, PII: the receipt MUST include:
> RECOMMEND HUMAN SECURITY REVIEW BEFORE PRODUCTION DEPLOY

---

## 15. Drift control

Run at the end of each phase and on session resume:

1. **Claim-proof binding** — important claims must map to proof; if not, mark UNVERIFIED
2. **Touched-area verification** — name the check covering each changed route/module/schema
3. **Planned-vs-actual scope** — compare approved objective against actual diff; label any drift
4. **Governance conflict scan** — contradictory rules, duplicate authority, obsolete files
5. **Environment drift scan** — runtime version, package manager, lockfile, CI commands
6. **Context continuity check** — confirm current approved phase, last receipt, open risks

---

## 16. [CUSTOMIZE] Project-specific rules

<!-- Add your repo-specific rules here. Examples: -->
<!-- - Protected paths: never modify .env*, infra/**, migrations/** without explicit approval -->
<!-- - Branch policy: all work on feature/* branches, merge to main via PR only -->
<!-- - [YOUR_FRAMEWORK]-specific patterns: ... -->
<!-- - Naming conventions: ... -->
<!-- - Required reviewers: ... -->

---

## 17. Autonomous loop mode

For projects with a machine-readable task list, the agent can operate autonomously where each iteration is a fresh context picking up the next incomplete story.

**Each iteration:**
1. Read `tasks/STATE.md` (codebase patterns section first)
2. Verify correct branch
3. Pick highest priority incomplete story
4. Implement using vertical slices (red-green-refactor)
5. Verify acceptance criteria with real commands
6. Update story status and progress log
7. Commit — if all stories done: output `<promise>COMPLETE</promise>` and stop
8. Otherwise: end session cleanly for the next iteration

**Story passes only when:** all acceptance criteria have direct evidence, code compiles and type-checks, affected tests pass with no regressions.

---

*Source: buildloop/templates/AGENTS.template.md*
