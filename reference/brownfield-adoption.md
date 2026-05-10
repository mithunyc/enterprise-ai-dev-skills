# Brownfield Adoption Reference

Source: docs/ROADMAP.md (this repo), AGENTS_v3.3 §6.4

This document governs how to safely adopt the buildloop control plane
on an existing project without breaking what already works.

---

## Core Rule

> **Never build on a broken foundation.**
> All projects get a minimal audit (bootstrap protocol Step 1A).
> Brownfield projects get a full diagnostic (Step 1B) BEFORE any feature work.

---

## Brownfield Adoption Matrix

| What Exists | Do | Never Do |
|-------------|-----|----------|
| AGENTS.md | Read it. Suggest improvements. | Overwrite it. |
| CLAUDE.md | Add skill routing if missing. | Replace it. |
| CI / Makefile | Respect it. `.buildloop.yml` adapts to it. | Replace CI. |
| Task tracker | Use existing (GitHub Issues / Jira / Linear). | Force a new prd.json. |
| Skills | Deduplicate. Skip if overlapping. | Install duplicates. |
| Test framework | Run existing tests. Extend them. | Replace the test framework. |
| No governance | Offer to generate. Ask first. | Auto-create without asking. |
| Broken build | Stabilize FIRST. Block features. | Build features on broken foundation. |

---

## Stabilization Decision Tree

```text
1. Can native build succeed?   No → fix before any feature work
2. Does native test pass?      No → characterization tests first, then fix
3. Does lint pass?             No → fix or explicitly accept warnings
4. Is there an AGENTS.md?     No → offer to create; ask before creating
5. Is there a tasks/STATE.md? No → create with current known state
```

---

## Failure Modes to Avoid

| Anti-pattern | What goes wrong |
|-------------|----------------|
| Installing governance on top of broken build | Governance is ignored because tests always fail — agents can't distinguish governance failures from pre-existing ones |
| Overwriting existing AGENTS.md | Destroys project-specific rules that the team already agreed on |
| Adding skills without deduplication | Context window bloat; agent routing confusion between overlapping skills |
| Importing `.buildloop.yml` commands that don't match CI | Gate-runner "passes" locally but CI fails — false confidence |
| Forcing `prd.json` / `tasks.json` on projects using Jira/Linear | Dual task-tracker drift; stories done in one system, unknown to the other |
| Auto-creating governance files | Generates empty placeholders that look authoritative but contain no real rules |
| Building features before diagnostics | Hidden technical debt surfaces at the worst time — during a feature sprint |

---

## Overlay-Only Path (safest for healthy brownfield)

When the existing codebase is stable (build passes, tests pass, lint passes):

1. Run bootstrap protocol — classify as State B or C
2. Create `tasks/STATE.md` if not present
3. Create `tasks/receipts/` directory if not present
4. Create `.buildloop.yml` — adapt commands to existing CI commands
5. Optionally create `AGENTS.md` (ask first if one doesn't exist)
6. Do NOT restructure folders or rename files
7. Do NOT add new dependencies
8. First gate: run `.buildloop.yml` commands and confirm all pass

---

## Stabilize-Then-Continue Path (broken brownfield)

When build, tests, or lint fail:

1. Run bootstrap protocol — classify as State B or D
2. Produce `tasks/diagnostic-baseline.md` with `stabilization_required: true`
3. Fix the broken foundation:
   - Failing build → fix compilation errors, missing deps
   - Failing tests → fix, characterize, or explicitly skip with documented reason
   - Failing lint → fix errors; accept warnings with documented rationale
4. Re-run gates: all must pass
5. Only then: proceed to feature work
6. Update `tasks/STATE.md` — set `stabilization_required: false`

---

## Context Window Budget Rules (Brownfield)

| Item | Limit | Reason |
|------|-------|--------|
| AGENTS.md at startup | ≤12K chars | Falsification condition #3 |
| Skills installed | ≤20 skills | Beyond 20, routing confusion dominates |
| New skills added | ≤5 per session | More = integration risk |
| CONTRIBUTING.md audit | Required before installing | Never install without checking overlap |

---

## `.buildloop.yml` Adaptation for Brownfield

The `.buildloop.yml` must mirror the existing CI, not replace it:

```yaml
# DO: mirror what CI already does
commands:
  lint: "npm run lint"        # same command as .github/workflows/ci.yml
  typecheck: "npm run typecheck"
  test: "npm test"
  build: "npm run build"

# DON'T: invent commands that aren't in CI
# commands:
#   lint: "eslint ."          # different from "npm run lint" — parity gap
```

If the project uses a Makefile, use `make` targets:
```yaml
commands:
  lint: "make lint"
  test: "make test"
  build: "make build"
```

---

## Governance Conflict Resolution

If you find conflicting instructions across `AGENTS.md`, `CLAUDE.md`, and `.cursorrules`:

1. Identify both files and the exact conflict
2. Identify each file's authority level (see AGENTS.md §7 — Authority Hierarchy)
3. Higher level wins
4. If same level: **stop and escalate** — do not silently resolve

Never silently pick one instruction over another at the same authority level.

---

*Source: buildloop/reference/brownfield-adoption.md | Upstream: docs/ROADMAP.md, AGENTS_v3.3 §6.4*
