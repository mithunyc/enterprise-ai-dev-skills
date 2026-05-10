# Skill Acquisition Playbook

Source: buildloop | Based on the External Skill Acquisition Protocol

**Purpose:** Identify gaps in the agent system and fill them with targeted external skills.
**Use when:** The system optimization playbook finds ❌ gaps that require multi-step workflow skills.
**NOT a buffet:** Fill specific gaps with minimum skills. Do not install wholesale.

Execute all phases sequentially. Pause at gates.

---

## Phase 1: Internal Audit (Silent)

Before looking at ANY external skill, map what you already have:

```
1. Read AGENTS.md — note every engineering function covered
2. Read all installed skills
3. Read all rules files
4. Read CI config — note what's already automated
5. Scan package.json / project config for stack identity
```

Build the Internal Coverage Matrix:

| Engineering Function | Covered By | Coverage Level |
|---------------------|-----------|---------------|
| Architecture enforcement | ? | FULL / PARTIAL / NONE |
| Testing (unit) | ? | ? |
| Testing (integration) | ? | ? |
| Testing (e2e) | ? | ? |
| TDD workflow | ? | ? |
| Systematic debugging | ? | ? |
| Git conventions | ? | ? |
| Database migrations | ? | ? |
| Auth / AuthZ | ? | ? |
| API design / contracts | ? | ? |
| CI/CD pipeline | ? | ? |
| Deployment verification | ? | ? |
| Rollback / recovery | ? | ? |
| Dependency management | ? | ? |
| Documentation accuracy | ? | ? |
| UI/UX review | ? | ? |
| Accessibility | ? | ? |
| Feature brainstorming | ? | ? |
| Code review standards | ? | ? |
| Incident response | ? | ? |

Mark ONLY NONE or PARTIAL as gaps. FULL cells are off-limits for external skills.

---

## Phase 2: External Research

For each external repo, fetch the README and skill index. Extract:
- Skill name
- Function (1 sentence)
- Whether it overlaps with any internal coverage from Phase 1

**Recommended source repos:**
```
1. https://github.com/obra/superpowers
   Focus: brainstorming, tdd, systematic-debugging, writing-plans

2. https://github.com/Jeffallan/claude-skills
   Focus: ONLY critical-reasoning, code-reviewer, security-reviewer, debugging
   SKIP: language/framework-specific skills (context bloat)

3. https://github.com/anthropics/skills (official)
   Focus: frontend-design, webapp-testing, skill-creator
```

For each external skill found, classify:

```
SKILL: [name] from [repo]
FUNCTION: [what it does]
INTERNAL OVERLAP: NONE / PARTIAL / FULL
  If PARTIAL/FULL, name the internal skill that covers it: ___
GAP IT FILLS: [which Phase 1 gap, or NONE]
INTEGRATION RISK: LOW / MEDIUM / HIGH
  If MEDIUM/HIGH, explain the conflict: ___
VERDICT: ACQUIRE / ADAPT / SKIP
  ACQUIRE = install as-is, fills a gap cleanly
  ADAPT = valuable concept but needs modification to fit this project's patterns
  SKIP = overlaps, bloats, or conflicts
```

---

## Phase 3: Gap-to-Skill Matching [GATE]

| Gap (from Phase 1) | Best External Skill | Repo | Verdict | Justification |
|--------------------|-------------------|------|---------|---------------|
| [gap] | [skill] | [repo] | ACQUIRE/ADAPT/SKIP | [reason] |

**Rules:**
- Maximum 5 external skills acquired per session
- Every ACQUIRE must fill a NONE gap from Phase 1
- Every ADAPT must have a specific modification plan
- No skill that overlaps >30% with an existing internal skill
- No skill that introduces a parallel governance or task system
- No language/framework-specific skills for technologies not in this project

**[GATE: AWAIT APPROVAL]** — Output Phase 1 matrix + Phase 3 table. Wait for "proceed."

---

## Phase 4: Adaptation Protocol

For each ACQUIRE or ADAPT skill:

**4A: Stack Adaptation**
- Replace generic examples with this project's actual stack
- Replace test runner references with project's actual test runner
- Replace package manager commands with project's actual package manager
- Remove sections referencing technologies not in this project

**4B: Governance Compatibility**
- Skill must reference (not duplicate) existing AGENTS.md sections
- Skill must not introduce its own task tracking (use existing governance)
- Skill must not create parallel planning directories
- Skill output format must match existing skill patterns

**4C: Naming and Location**
- Follow existing naming convention in the repo
- SKILL.md frontmatter must match existing skill format (name, description)

**4D: AGENTS.md Update**
- Add to skill registry (maintain alphabetical or categorical order)
- Update skill count in references
- Add any new anti-patterns the skill introduces

**4E: Context Budget Check**
```
Existing skills metadata: [N skills × ~100 tokens] = ___
New skills metadata: [N new × ~100 tokens] = ___
Total metadata overhead per session: ___
```
If total metadata exceeds 2,000 tokens → the system is over-skilled. Remove the lowest-value acquisition.

---

## Phase 5: Execute

For each approved acquisition:

1. Fetch the skill source (SKILL.md + reference files)
2. Adapt per Phase 4 rules (stack, governance, naming)
3. Create at the correct location
4. Update AGENTS.md skill registry
5. Verify no conflicts: run build/lint

**Commit:**
```
feat: acquire [skill-name] skill from [repo] — fills [gap] gap
```

---

## Phase 6: Verification

### 6A: Run build and lint (must pass)

### 6B: Coverage proof
Re-output Phase 1 matrix. Every NONE gap should now show the acquired skill.

### 6C: Simulation test
Pick a realistic complex task. Trace which skills fire and in what order.
Confirm no step has zero coverage and no step triggers two conflicting skills.

### 6D: Final report
```
SKILL ACQUISITION REPORT
========================
Internal skills before:  N
External skills added:   N
Total skills after:      N
Gaps filled:             N (list each)
Gaps remaining:          N (list with justification)
Context overhead added:  ~N tokens per session
Conflicts detected:      N (should be 0)

COVERAGE SCORE: X/20 engineering functions
SYSTEM HEALTH: [one sentence assessment]
```

---

## Anti-Patterns

1. **Don't install skill packs wholesale.** Each skill costs ~100 tokens per session.
2. **Don't install skills that compete with existing governance.**
3. **Don't install framework-specific skills for frameworks you don't use.**
4. **Don't install skills without adapting them to your stack.**
5. **Don't exceed 20 total skills.** Beyond 20, routing confusion dominates.
6. **Don't use a skill when 3 lines in AGENTS.md would do.** Skills are for workflows. Rules are for constraints.

---

*Source: buildloop/playbooks/skill-acquisition.md*
