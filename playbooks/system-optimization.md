# Agent System Optimization Playbook

**Purpose:** Produce a pruned, gap-filled, drift-free agent skill system.
**Use when:** Skills are overlapping, AGENTS.md is bloated, gates are failing, or the system feels stale.
**Produces:** Pruned skills, optimized AGENTS.md, gap analysis, verification proof.

Execute all 6 phases in sequence. Pause only at gates marked **[GATE]**.

---

## Phase 1: Establish Repo Truth (Silent)

Scan the project. Hold results in memory. Do NOT output yet.

```
1. Read AGENTS.md (or CLAUDE.md) — count lines, note structure
2. Read package.json / Cargo.toml / pyproject.toml / go.mod — identify stack
3. Identify all agent instruction files:
   AGENTS.md, CLAUDE.md, .cursorrules*, SKILL.md
   .agent/skills/*/SKILL.md, .antigravity/skills/*.md (or equivalent)
4. Read: git log --oneline -20 — note conventions
5. Read CI config (.github/workflows/, .circleci/, etc.) — note pipeline stages
```

Classify:
```
STACK:           [language(s), framework(s), runtime(s)]
TEST RUNNER:     [unit / integration / e2e tools]
CI SYSTEM:       [tool, number of workflows]
PACKAGE MANAGER: [tool, monorepo?]
MATURITY:        [greenfield | early | growing | mature]
PEER FILES:      [list every agent instruction file found]
SKILLS COUNT:    [N agent-native]
```

---

## Phase 2: Functional Coverage Map [GATE]

### 2A: Skill Inventory

| # | Skill Name | Location | Function (1 sentence) | Unique? |
|---|-----------|----------|----------------------|---------|
| 1 | ... | ... | ... | Yes / Overlaps with #N |

### 2B: Functional Coverage Matrix

Mark each cell: ✅ covered | ⚠️ partially covered | ❌ gap

| Engineering Function | Skill/Rule Covering It | Status |
|---------------------|----------------------|--------|
| Architecture enforcement | ? | ? |
| Code quality / linting | ? | ? |
| Testing (unit / integration / e2e) | ? | ? |
| Git conventions | ? | ? |
| Database migrations | ? | ? |
| Auth / AuthZ enforcement | ? | ? |
| API design / contracts | ? | ? |
| Error handling | ? | ? |
| Performance budgets | ? | ? |
| CI/CD pipeline | ? | ? |
| Deployment verification | ? | ? |
| Secrets management | ? | ? |
| Documentation accuracy | ? | ? |
| Sprint / task governance | ? | ? |
| Rollback / recovery | ? | ? |
| Incident response | ? | ? |

### 2C: Overlap Detection

For each pair of overlapping skills:
```
OVERLAP: [Skill A] vs [Skill B]
- What A covers that B doesn't:
- What B covers that A doesn't:
- What both cover identically:
- VERDICT: MERGE into [winner] / KEEP BOTH / DELETE [loser]
- JUSTIFICATION:
```

**Critical:** Same domain ≠ redundant. Only merge skills that do the same FUNCTION.

### 2D: AGENTS.md Content Audit

| Section | Lines | Classification | Action |
|---------|-------|---------------|--------|
| ... | N-M | CONSTITUTIONAL | KEEP |
| ... | N-M | WORKFLOW | MOVE to [skill] |
| ... | N-M | PEER DUPLICATE | REPLACE with reference |
| ... | N-M | STALE | UPDATE or DELETE |

Constitutional content (stays in AGENTS.md): identity block, session startup checklist, authority hierarchy, build commands, architecture overview, key conventions, forbidden patterns, protected zones, skill registry, anti-patterns, project gotchas.

**[GATE: AWAIT APPROVAL]** — Output Phases 2A–2D. Wait for "proceed" before executing changes.

---

## Phase 3: Gap Analysis

For every ❌ in Phase 2B:

```
GAP: [Engineering Function]
RISK: What goes wrong without this? (concrete scenario)
SEVERITY: CRITICAL / HIGH / MEDIUM / LOW
RECOMMENDATION:
  Option A: Add to AGENTS.md (<5 lines) — simple rule
  Option B: Create new skill — multi-step workflow
  Option C: Acceptable gap — explain why
EFFORT: XS / S / M / L
```

Rank by SEVERITY × EFFORT (highest severity, lowest effort first).

---

## Phase 4: Execution Plan [GATE]

### 4A: Deletions
```
DELETE: [skill name] at [path]
REASON: Redundant with [champion]. Unique content merged.
REPLACED BY: [champion skill name]
```
Safety: Never delete without naming the replacement.

### 4B: Merges
```
MERGE INTO: [champion skill]
FROM: [challenger skill]
CONTENT TO ADD: [exact lines]
CONTENT ALREADY COVERED: [redundant lines]
```

### 4C: New Skills
```
CREATE: [skill name]
FUNCTION: [one sentence]
TRIGGERS: [when agent should invoke this]
```

### 4D: AGENTS.md Updates
```
SECTION: [name]
ACTION: KEEP / MOVE / ADD / UPDATE / REPLACE-WITH-REFERENCE / DELETE
DETAIL: [what changes and why]
```

**[GATE: AWAIT APPROVAL]** — Output full Phase 4 plan. Wait for "proceed."

---

## Phase 5: Execute

After approval:
1. Create new skill files (4C)
2. Merge content into champion skills (4B)
3. Update AGENTS.md (4D)
4. Delete redundant skills LAST — only after merges confirmed (4A)

Commit each change separately:
```
chore: merge [challenger] into [champion] skill
chore: create [new-skill] for [function]
chore: optimize AGENTS.md — remove redundancy, add references
chore: delete redundant [skill] (merged into [champion])
```

---

## Phase 6: Verification Proof

```bash
[YOUR_LINT_COMMAND]   # must pass
[YOUR_BUILD_COMMAND]  # must pass
```

Re-output Phase 2B matrix. Every ❌ should now be ✅ or "Accepted gap with justification."

Final report:
```
OPTIMIZATION REPORT
===================
Skills before:     N
Skills after:      N (deleted M, created K)
AGENTS.md lines:   N → N (delta)
Overlaps removed:  N
Gaps filled:       N
Gaps accepted:     N (with justification)
SYSTEM HEALTH: [one sentence assessment]
```

---

## Constraints

1. Repo truth wins — if AGENTS.md says one thing and repo does another, update AGENTS.md
2. Function not domain — same domain ≠ redundant; same function = redundant
3. AGENTS.md is the constitution, not the encyclopedia
4. Every deletion has a replacement
5. Size budget: AGENTS.md ≤ 12K chars (falsification condition #3)
6. Verify after every change — don't ship a smaller system that's also broken

---

*Source: buildloop/playbooks/system-optimization.md*
