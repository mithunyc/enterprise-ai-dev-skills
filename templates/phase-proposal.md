---
type: phase-proposal
objective: "[Brief objective — one sentence]"
blast_radius: MEDIUM        # LOW | MEDIUM | HIGH
rollback: "git revert HEAD  # or: git reset --hard <SHA>"
---

# Phase Proposal Template

Use this before starting any phase of work. The human must approve before coding begins.
No auto-proceed. No coding without approval.

---

## Proposal Template

```text
PHASE PROPOSAL: Phase [N] — [name]

Objective:
- [Primary deliverable — one clear sentence]
- [Why this matters now]

Inputs required:
- [Approved PRD / spec / design doc]
- [Existing codebase state]
- [Any prerequisite phases or data]

Expected file touches:
- create: [list files to create]
- modify: [list files to modify]
- delete: [list files to delete, if any]

Blast radius:
- [LOW: ≤5 files, isolated module, no data or auth changes]
- [MEDIUM: 6–15 files, 1–2 integration layers]
- [HIGH: 15+ files, data migrations, auth, payments, deploys, or infra]

Verification plan:
- exact commands: [list each command that will be run]
- targeted checks for touched areas: [what covers each changed area]
- manual checks if needed: [browser, device, or integration checks]

Rollback:
- [exact git command or step to undo this phase]
- [e.g. git revert HEAD~1 or git reset --hard <SHA>]

Confidence:
- high / medium / low
- why: [reason for confidence level]

Human decision:
- approve / adjust / reject
```

---

## Sizing Rules

| Size | Files | Rule |
|------|-------|------|
| Small | ≤5 | Single module, one integration layer |
| Medium | 6–15 | Multiple modules, ≤2 integration layers |
| Large | 16+ | **Propose splitting before approval** |

If the phase would touch more than 15 files, split it.
Large phases accumulate internal drift that is only caught at the boundary.

## Suggested Phase Patterns

```text
Simple web app:     truth-lock → skeleton → pages/routes → verify → deploy
App with auth/data: truth-lock → skeleton → schema → contracts → services → UI → verify → deploy
API/backend:        truth-lock → skeleton → schema → contracts → routes → hardening → verify → deploy
Mobile:             truth-lock → skeleton → schema → contracts → services → screens → device integration → verify → deploy
Mid-project:        stabilize → truth-lock-current-state → highest-risk-gap → verify → continue
```

## Decision Gate

Every proposal ends with a decision gate:

```text
DECISION REQUIRED
Recommendation: PROCEED / FIX / HALT
Why: [1–2 sentences]
Risk: LOW / MEDIUM / HIGH
What I need from you: approve / modify / reject
If approved, next action: [explicit step]
```

---

*Source: buildloop/templates/phase-proposal.md*
