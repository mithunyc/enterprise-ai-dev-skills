---
name: enterprise-ai-dev
description: >
  End-to-end enterprise-grade AI software delivery workflow. The master
  orchestrator for spec-to-production development. Use when asked to build,
  fix, refactor, launch, review, harden, or operate software — especially when
  the request involves: enterprise-grade, production-ready, brownfield project,
  new project, PRD, architecture, TDD, QA, security, deployment, or release.
  Automatically selects GREENFIELD, BROWNFIELD, or AUTONOMOUS profile.
---

# Enterprise AI Dev — Spec-to-Production Control Plane

## Prime Directive

Ship the smallest production-grade vertical slice that proves product value, with tests, security review, and rollback thinking. Optimize for **verified outcomes**, not impressive activity.

---

## Step 0: Classify and Select Profile

Before anything else, classify the project:

| Signal | Classification |
|--------|---------------|
| Empty or near-empty directory | GREENFIELD |
| Existing files + git history | BROWNFIELD |
| Steps 0–8 already approved, looping on stories | AUTONOMOUS |

---

## GREENFIELD Path

Steps: `0 → 1A → 2 → 3 → 4 → 7 → 8 → 9 → 11 → 14`

**Rule:** Build first, govern after proof. Do NOT front-load ceremony.

1. **Step 1A — Minimal audit:** `git status`, branch, runtime, package manager, existing files.
2. **Step 2 — PRD:** Clarify outcome. Ask only questions that affect architecture, risk, or UX.
3. **Step 3 — Adversarial Spec:** Apply grill-me to the PRD. Risk-scaled probe count (see below).
4. **Step 4 — Architecture Checkpoint:** Simplest version that works. Karpathy check: "Would a senior engineer say this is overcomplicated?"
5. **Step 7 — Slice Contract:** Define `allowed_files`, `blast_radius`, `evidence_required`.
6. **Step 8 — Human Approval (Planning Gate):** Present DECISION REQUIRED block. Wait for approval.
7. **Steps 9–11 — Build, self-review, deterministic gates.**
8. **Step 14 — PR / Preview.**

---

## BROWNFIELD Path

Steps: `0 → 1A → 1B → [STABILIZE if needed] → 2 → full lifecycle`

**Rule:** Never build on a broken foundation. Diagnose before building.

### Step 1A — Minimal Audit (all brownfield)
- `git status`, branch, file count, package manager, runtime
- Check for: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, CI config, existing skills

### Step 1B — Full Diagnostic
Run the repo's native checks:
```
lint / typecheck / test / build
```
Produce `diagnostic_baseline.md` with frontmatter:
```yaml
---
type: diagnostic_baseline
repo_state: B | C | D
health:
  build: PASS | FAIL | NOT_CONFIGURED
  tests: PASS | FAIL | NONE
  lint: PASS | FAIL | NOT_CONFIGURED
  ci: CONFIGURED | NONE
stabilization_required: true | false
---
```

### Stabilization Gate
If `stabilization_required: true`:
- Present stabilization plan (minimum changes to unblock features)
- **BLOCK feature work until human approves and foundation is verified**
- If repo healthy → generate `.buildloop.yml` → proceed to Step 2

### Brownfield Non-Negotiables

| Existing | Do | Never |
|----------|-----|-------|
| AGENTS.md | Read. Suggest improvements. | Overwrite. |
| CLAUDE.md | Add skill routing only if missing. | Replace. |
| CI / Makefile | Respect it. .buildloop.yml adapts. | Replace. |
| Task tracker | Use existing (Issues/Jira). | Force prd.json. |
| Skills | Deduplicate. Skip overlap. | Install duplicates. |
| Test framework | Run existing. | Replace framework. |

---

## AUTONOMOUS Path

**Prerequisite:** Steps 0–8 must be **fully approved** before this path runs.

Loop: `9 (TDD) → 10 (self-review) → 11 (gates) → 12 (AI review) → receipt → commit → next approved slice`

Autonomous mode reads `.buildloop.yml` for commands and `protected_paths`. If stuck (3+ consecutive failures): emit STUCK signal, escalate to human.

---

## Risk-Scaled Grill-Me Probes

Apply when stress-testing PRD, architecture, or slice contract:

| Risk Level | Probe Count |
|-----------|-------------|
| Low (cosmetic / additive) | 1–2 probes |
| Medium (new feature, integration) | 3 probes |
| High (auth, schema, billing, external API) | 5–7 probes |

**Never exceed 7 probes unless human asks.** Each probe: Q + recommended A. Human approves/modifies/rejects.

---

## Gate Format (Required at Every Human Checkpoint)

```
DECISION REQUIRED
Recommendation: PROCEED / FIX / HALT
Why: [1–2 sentences, plain language]
Risk: LOW / MEDIUM / HIGH
What I need from you: approve / modify / reject
If approved, next action: [explicit next step]
```

---

## Deterministic Gates (Step 11)

Gate-runner reads `.buildloop.yml`:
```yaml
adoption_mode: greenfield | brownfield | autonomous
risk_level: low | medium | high
commands:
  lint: "[your lint command]"
  typecheck: "[your typecheck command]"
  test: "[your test command]"
  build: "[your build command]"
protected_paths:
  - ".env*"
  - "**/*.key"
  - ".github/workflows/**"
```

Gate-runner produces `gate-results.json`. Evidence receipt references it. Gate-runner is the independent witness — the agent does not self-grade.

---

## Skill Routing

| Need | Skill |
|------|-------|
| Plan stress-test | `grill-me` |
| Token compression | `caveman` |
| Anti-overcomplication | `karpathy-guidelines` |
| Requirements / PRD | `grill-with-docs`, `to-prd`, `brainstorming` |
| TDD | `tdd`, `writing-plans`, `executing-plans` |
| Debugging | `diagnose` |
| Architecture review | `improve-codebase-architecture`, `zoom-out` |
| Code review / release | `requesting-code-review`, `verification-before-completion`, `finishing-a-development-branch` |
| Security | `security-best-practices`, `security-threat-model` |
| UI design | `awesome-design-md` |
| Issue triage | `triage` |

---

## Quality Gates (Do Not Ship Without These)

- [ ] Acceptance criteria mapped to concrete verification
- [ ] Tests cover changed behavior + at least one failure path
- [ ] Security-sensitive flows: auth, authorization, validation considered
- [ ] Data changes: migration and rollback path verified
- [ ] No unrelated drive-by changes in the diff
- [ ] `gate-results.json` exists and shows PASS

---

## Stop Conditions

Pause and ask before:
- Deleting data, force-pushing, rotating production credentials
- Touching `protected_paths` from `.buildloop.yml`
- Making irreversible architecture choices when requirement is unclear
- Proceeding when tests cannot run and change is high-risk
- Taking any action at L4+ autonomy level without explicit opt-in
