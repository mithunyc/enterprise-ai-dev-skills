# Bootstrap Protocol Reference

Source: AGENTS_v3.3 §6 (generalized)

This document explains how to start safely on any repo — new or existing.

---

## Step 1: Detect Project State

**Before modifying any file**, classify the repo:

| State | Description | Next action |
|-------|-------------|------------|
| **A — New / empty** | Little or no app code; no meaningful build config; no governance | Begin onboarding questions |
| **B — Existing / unmanaged** | App code exists; no agent governance (no AGENTS.md, no STATE.md) | Full diagnostic first |
| **C — Existing / governed** | This protocol or equivalent already exists and is current | Read STATE.md + latest receipt; resume |
| **D — Existing / mixed** | Partial governance exists; receipts or state are stale, missing, contradictory | Stabilize before continuing |

**Detection signals:**

```bash
ls -la AGENTS.md CLAUDE.md SKILL.md 2>/dev/null   # governance files
ls -la tasks/ 2>/dev/null                           # STATE.md, receipts/
git log -1 --oneline                                # last commit
git status --short                                  # dirty state
```

**Required output before any file change:**
```text
PROJECT STATE REPORT
Detected state: [A / B / C / D]
Confidence: [high / medium / low]
Signals:
- [file present / absent]
- [governance quality]
- [git state]
Next step:
- [exact next action]
```

---

## Step 2: Onboarding Questions (State A — New Projects)

Ask only what changes architecture, data shape, risk, or deployment.
Ask in grouped batches. Wait for answers before the next group.
Do not ask questions that don't change a technical decision.

**Group 1 — Product identity**
1. What is the product and who is it for?
2. What is the first usable outcome?
3. What surfaces are needed now: web, mobile, backend/API, desktop, or combination?

**Group 2 — Data and access**
4. Do users need accounts? What kind?
5. Will the app store user data? What kind?
6. Are there public pages needing SEO or indexing?

**Group 3 — Existing materials**
7. Are there existing specs, wireframes, brand assets, or stack preferences?
   If documents exist, read them before asking more.
8. Where should it deploy? If unsure, recommend.
9. What is explicitly out of scope for v1?

**Group 4 — Constraints**
10. Any legal, security, or integration constraints?

---

## Step 3: Architecture Checkpoint (Before Any Scaffolding)

Output this before creating any project structure:

```text
ARCHITECTURE CHECKPOINT

Known facts:
- [each known fact with source]

Open ambiguities that affect architecture:
- [each ambiguity that changes system shape]

Candidate options:
- Option A: [name]
  - good when: [condition]
  - tradeoffs: [what you give up]
- Option B: [name]
  - good when: [condition]
  - tradeoffs: [what you give up]

Default recommendation:
- [option]
- why: [reason]
- what would change my mind: [condition]
```

If architecture-impacting ambiguity remains, **stop and ask for approval before scaffolding.**
"Web app" is too vague to safely choose SPA vs SSR, local-first vs server-first, or simple auth vs enterprise auth.

---

## Step 4: Existing Project Stabilization (States B and D)

Run native build/test/lint. Produce `tasks/diagnostic-baseline.md` using the template.

**Required audit report:**

```text
PROJECT AUDIT REPORT

Repo shape: [structure description]
Framework/runtime: [name and version]
Package manager: [tool]
App surfaces: [web / mobile / API / desktop / combination]
Data stores: [list]

Health:
- install:   [ok / warn / fail]
- lint:      [ok / warn / fail]
- typecheck: [ok / warn / fail / n/a]
- test:      [ok / warn / fail / none]
- build:     [ok / warn / fail]

CI/runtime:
- workflow files: [list or none]
- runtime/version files: [list or none]
- parity risks: [e.g. CI uses Node 20, local uses Node 18]

Governance:
- current authority files: [list]
- contradictions: [none / describe]
- stale files: [none / describe]
- missing critical controls: [none / list]

Architecture:
- obvious boundary violations: [none / describe]
- oversized modules/handlers: [none / list with line count]
- critical paths with weak coverage: [none / list]

Git state:
- branch: [name]
- clean: [yes / no — list dirty files if no]
- detached head: [yes / no]

Risk register:
- critical: [list or none]
- high: [list or none]
- medium: [list or none]
- low: [list or none]
```

**Recommended paths:**

| Path | When to use |
|------|------------|
| **Overlay only** | Codebase is stable; just add governance |
| **Stabilize then continue** | Build/tests/lint fail; fix foundation first |
| **Contain and carve** | One broken subsystem; isolate it before expanding |
| **Restructure** | Current shape blocks safe delivery; local fix is insufficient |

**Default:** overlay only, or stabilize then continue.
Broad restructure is allowed **only** if the current shape blocks safe delivery and a local fix is insufficient. Requires explicit human approval.

---

## Step 5: Session Resume Protocol (State C — Governed Projects)

Read in this order:
1. `AGENTS.md` — protocol rules
2. `tasks/STATE.md` — current project state
3. Latest receipt in `tasks/receipts/` — last verified work
4. `docs/INDEX.md` if present
5. `tasks/LESSONS.md` if present

Run:
```bash
git status
git branch --show-current
git log -1 --oneline
```

Output:
```text
SESSION RESUME REPORT

Project:
Current branch:
Working tree clean:
Last receipt:
Current phase in STATE.md:
Open risks:
Open human decisions:
Lessons loaded:
State/receipt consistency: [CONSISTENT / MISMATCH — describe]
Recommended next action:
```

**If STATE.md conflicts with the latest receipt or actual repo state:**
- Stop
- Produce a STATE MISMATCH report
- Recommend the likely truth
- Ask for approval before any repair

---

## Session Start Commands (Every Session)

```bash
git status
git branch --show-current
git log -1 --oneline
```

These three commands must run every session. Do not skip them.
If detached HEAD → stop and ask.
If dirty state → ask: stash / branch / commit / halt.

---

*Source: buildloop/reference/bootstrap-protocol.md | Upstream: AGENTS_v3.3 §6*
