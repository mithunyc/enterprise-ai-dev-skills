# ULTIMATE ROADMAP v5.0 — Enterprise-AI-Dev Control Plane

**Status:** CONDITIONAL GO — becomes UNCONDITIONAL after Phase 2 dogfooding on:
1. This repo itself
2. One greenfield fixture project
3. One brownfield fixture project

**Audit Trail:** 3 adversarial rounds · 20+ probes · 1 cross-model (ChatGPT) critique · 11 amendments applied
**Last Updated:** 2026-05-09
**Build Spec:** See `docs/BUILD_SPEC.md`

---

## The Three Laws

1. **Determinism:** Every gate/receipt/handoff uses YAML frontmatter validated by schemas. Markdown=humans, schema-validated YAML=control plane.
2. **Foundation:** Never build on a broken repo. ALL projects get a minimal audit (Step 1A). Brownfield gets full diagnostic (Step 1B) BEFORE features.
3. **Planning:** 60% effort on Steps 0–8. Use risk-scaled grill-me probes: Low=1-2, Medium=3, High=5-7, never >7 unless human asks.

---

## Lifecycle Profiles

| Profile | Steps Used | Prerequisite |
|---------|-----------|-------------|
| Solo Greenfield | 0, 1A, 2, 3, 4, 7, 8, 9, 11, 14 | None |
| Team Brownfield | All 17 | None |
| Autonomous Loop | 9→10→11→12→receipt→commit→next slice | Steps 0–8 fully approved first |

---

## Planning Phase (Steps 0–8)

**Step 0: INIT** — Classify GREENFIELD or BROWNFIELD. Select profile.

**Step 1A: MINIMAL AUDIT (all projects)** — git status, branch, package manager, runtime, file count, existing governance files.

**Step 1B: FULL DIAGNOSTIC (brownfield only)** — Run native lint/test/build. Produce `diagnostic_baseline.md` with YAML frontmatter. If `stabilization_required: true` → BLOCK features until foundation is verified.

**Step 2: PRODUCT INTENT / PRD** — Gather requirements. Produce PRD with frontmatter.

**Step 3: ADVERSARIAL SPEC** — grill-me pattern on PRD. Risk-scaled probes. Q + recommended A. Human approves each.

**Step 4: ARCHITECTURE CHECKPOINT** — Verify architecture fits repo reality. Karpathy check. Graphify optional for large repos.

**Step 5: ADRs WHERE NEEDED** — Record decisions that constrain future work.

**Step 6: TASK GRAPH / DAG** — Stories with explicit dependencies. Each fits one context window.

**Step 7: SLICE CONTRACT** — Per-story boundaries with `allowed_files`, `blast_radius`, `depends_on`, `evidence_required`.

**Step 8: HUMAN APPROVAL (PLANNING GATE)** — Verify: PRD complete, architecture passed, slice contracts have allowlists, grill Q&A approved, `.buildloop.yml` exists.

Every gate ends with:
```
DECISION REQUIRED
Recommendation: PROCEED / FIX / HALT
Why: [1–2 sentences]
Risk: LOW / MEDIUM / HIGH
What I need from you: approve / modify / reject
If approved, next action: [explicit step]
```

---

## Execution Phase (Steps 9–16)

**Step 9: TDD EXECUTION** — Red-green-refactor within slice boundaries. Brownfield without tests: characterization tests first.

**Step 10: SELF-REVIEW** — Check scope, test coverage, compilation. No out-of-bounds file changes.

**Step 11: DETERMINISTIC GATES** — gate-runner reads `.buildloop.yml`, executes commands, writes `gate-results.json`. Agent writes receipt referencing that file. Gate-runner is the independent witness.

Receipt frontmatter:
```yaml
---
gate_results_ref: ".buildloop-runs/<run_id>/gate-results.json"
gate_status: PASS | FAIL | PARTIAL | NOT_RUN
confidence: HIGH | MEDIUM | LOW
status: GO | CONDITIONAL_GO | NO_GO
---
```

**Step 12: INDEPENDENT AI REVIEW** — Reads receipt first, challenges claims vs `gate-results.json`. Produces GO / CONDITIONAL_GO / NO_GO.

**Step 13: HUMAN APPROVAL** — PROCEED / FIX / HALT / OVERRIDE.

**Step 14: PR / PREVIEW DEPLOY**

**Step 15: RELEASE / ROLLBACK / OBSERVABILITY**

**Step 16: LESSONS** — `tasks/LESSONS.md`. Obsidian vault if configured. Graphify refresh if used.

---

## .buildloop.yml Contract

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
  - "**/*.pem"
  - ".github/workflows/**"
  - "supabase/migrations/**"
  - "infra/**"
  - "terraform/**"
```

---

## Brownfield Adoption Matrix

| What Exists | Do | Never Do |
|-------------|-----|----------|
| AGENTS.md | Read. Suggest improvements. | Overwrite. |
| CLAUDE.md | Add skill routing if missing. | Replace. |
| CI / Makefile | Respect it. .buildloop.yml adapts. | Replace. |
| Task tracker | Use existing (Issues/Jira/Linear). | Force prd.json. |
| Skills | Deduplicate. Skip overlap. | Install duplicates. |
| Test framework | Run existing. | Replace framework. |
| No governance | Offer to generate. Ask first. | Auto-create. |
| Broken build | Stabilize FIRST. Block features. | Build on broken foundation. |

---

## Skill Tiers

| Tier | Count | Description |
|------|-------|-------------|
| MINIMAL | 5 | enterprise-ai-dev, karpathy-guidelines, brainstorming, tdd, diagnose |
| CORE | 12 | + writing-plans, executing-plans, grill-with-docs, verification-before-completion, security-best-practices, awesome-design-md, caveman |
| FULL | 19 | + grill-me, triage, improve-codebase-architecture, zoom-out, finishing-a-development-branch, requesting-code-review, security-threat-model, setup-matt-pocock-skills |
| CONTRIBUTOR | +2 | write-a-skill, setup-matt-pocock-skills (not auto-installed) |

---

## Falsification Conditions

| # | Condition | Measurement |
|---|-----------|------------|
| 1 | Agents ignore AGENTS.md | In 20 benchmark tasks, >2 violate a hot rule |
| 2 | Brownfield diagnostic >30 min | Baseline generation >30 min on medium repo, excluding stabilization work |
| 3 | Governance overhead >20% context | Hot files at startup exceed 12K chars |
| 4 | Gate-runner fails >20% setups | Cannot execute on >2 of 10 sample repos due to tool bugs |
| 5 | Self-grill produces no value | In 20 planning runs, <80% improve scope or acceptance criteria |
