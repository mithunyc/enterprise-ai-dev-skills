# Phase Engine

> Extracted and generalized from AGENTS_v3.3 §10, §10.2, §10.3. Stack-agnostic reference for the enterprise-ai-dev skill.

---

## Mandatory Phase Rules

All work happens in reviewable phases.

- One primary objective per phase
- Planned scope stated before coding
- Blast radius stated before coding
- Verification plan stated before coding
- Rollback path stated before coding
- Human approval before coding begins
- No auto-proceed between phases

Use small phases. If the objective has multiple independent deliverables, split it. If a phase would touch more than 15 files, propose splitting it. Large phases accumulate internal drift that is only caught at the boundary. For phases touching 10+ files, consider a mid-phase scope check against the approved plan.

---

## Suggested Phase Patterns

Match the phase sequence to the project type:

- **Simple web app:** truth-lock → skeleton → pages/routes → verify → deploy
- **App with auth/data:** truth-lock → skeleton → schema → contracts → services → UI → verify → deploy
- **API/backend:** truth-lock → skeleton → schema → contracts → routes → hardening → verify → deploy
- **Mobile:** truth-lock → skeleton → schema → contracts → services → screens → device integration → verify → deploy
- **Mid-project takeover:** stabilize → truth-lock-current-state → highest-risk-gap → verify → continue

---

## Phase Proposal Format

Use this template before starting any phase:

```text
PHASE PROPOSAL: Phase [N] — [name]

Objective:
- ...

Inputs required:
- ...

Expected file touches:
- create:
- modify:
- delete:

Blast radius:
- ...

Verification plan:
- exact commands:
- targeted checks for touched areas:
- manual checks if needed:

Rollback:
- exact git step or command:

Confidence:
- high / medium / low
- why:

Human decision:
- approve / adjust / reject
```

This exists because vague phases hide scope creep.

---

## Story Sizing and Context-Window Discipline

Each story or task must fit within a single context window. If a task is too large, the agent runs out of context before finishing and produces poor or incomplete code.

**Sizing rules:**

- A story should touch no more than 10–15 files
- A story should be completable, testable, and verifiable in one session
- If a story requires more than ~100 new lines of logic, consider splitting
- If a story requires changes across 3+ integration layers (schema + API + UI + tests), ensure each layer change is small
- The agent must estimate story size before starting and flag oversized stories

**Splitting pattern:**

```text
OVERSIZED: "Build entity CRUD with scoring and AI evaluation"
SPLIT INTO:
  Story A: "Entity CRUD (schema + API + basic page)"
  Story B: "Scorecard CRUD (schema + API + form)"
  Story C: "AI evaluation (adapter + API + result display)"
```

**Mid-story context overflow protocol:**

If the agent detects mid-story that context is filling up:

1. Stop at the nearest safe commit point
2. Commit completed work
3. Update progress notes with what remains
4. End the session cleanly
5. The next session picks up from those notes

This exists because context overflow produces the worst code: half-finished, half-tested, half-coherent.

---

## Vertical Slice Pattern (Tracer Bullets)

Each phase should cut through ALL integration layers end-to-end, not build one layer at a time.

```text
WRONG (horizontal):
  Phase 1: all schema migrations
  Phase 2: all API routes
  Phase 3: all UI pages
  Phase 4: all tests

RIGHT (vertical):
  Phase 1: schema + domain + tests for feature A
  Phase 2: API + UI + E2E for feature A
  Phase 3: schema + domain + tests for feature B
  Phase 4: API + UI + E2E for feature B
```

A completed vertical slice is demoable or verifiable on its own.

This exists because horizontal slices hide integration bugs until the end.

---

*Source: AGENTS_v3.3 §10, §10.2, §10.3*
