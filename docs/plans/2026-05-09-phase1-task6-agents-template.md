# Phase 1 Task 6: AGENTS.template.md — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a generalized, stack-agnostic AGENTS.template.md (≤15K chars) from AGENTS_v3.3 that any project can adopt.

**Architecture:** Extract and condense sections §1-5, §7-8, §10, §20, §22, §27-28 from AGENTS_v3.3. Replace ALL project-specific references (Arkaan, Supabase, pnpm, Next.js, etc.) with `[YOUR_TOOL]`/`[CUSTOMIZE]` placeholders. The template must be a standalone governance file — not a reference doc.

**Tech Stack:** Markdown with YAML frontmatter

**Source:** `C:\Users\mshmi\OneDrive\Apps\enterprisegradesoftwireos\AGENTS_v3_3.md`
**Target:** `C:\Users\mshmi\OneDrive\Apps\buildloop\templates\AGENTS.template.md`

---

### Task 6.1: Create templates/ directory and stub file

**Files:**
- Create: `templates/AGENTS.template.md`

- [ ] **Step 1: Create directory and empty file**

```powershell
Set-Location "C:\Users\mshmi\OneDrive\Apps\buildloop"
New-Item -ItemType Directory -Path templates -Force
New-Item -ItemType File -Path templates\AGENTS.template.md
```

- [ ] **Step 2: Verify**

```powershell
Test-Path templates\AGENTS.template.md
```

Expected: `True`

---

### Task 6.2: Write the header and §0-§1 (Fast Start)

**Files:**
- Modify: `templates/AGENTS.template.md`

- [ ] **Step 1: Write header + sections 0 and 1**

Write this content to `templates/AGENTS.template.md`:

```markdown
# AGENTS.md — Agent Operating Protocol
<!-- Generated from buildloop template v2.0 -->
<!-- [CUSTOMIZE] markers indicate sections you must edit for your project -->

---

# 0. What this file is

This file tells coding agents how to work safely in this repo.

It is designed to:
- work across tools and models
- stay readable for non-technical founders
- reduce silent drift and fake verification
- keep governance proportional
- preserve rollback and auditability

This file improves reliability. It does not guarantee correctness.

Use human review before production deploy when the work touches:
- authentication or authorization
- payments
- PII, health, or regulated data
- infrastructure, secrets, or production config
- destructive migrations
- privileged admin actions

---

# 1. Fast start

Tell the agent:

` ``text
Read AGENTS.md and execute the Bootstrap Protocol.
` ``

Compatible aliases: `SKILL.md`, `CLAUDE.md`, `AGENT.md` — all defer to this file.
```

- [ ] **Step 2: Verify**

```powershell
Get-Content templates\AGENTS.template.md | Select-Object -First 5
```

Expected: First line is `# AGENTS.md — Agent Operating Protocol`

---

### Task 6.3: Write §2-§5 (Compatibility, Operating Model, Non-negotiables, Claim Labels)

**Files:**
- Modify: `templates/AGENTS.template.md` (append)

- [ ] **Step 1: Append sections 2-5**

Content from AGENTS_v3.3 §2-5, condensed. No project-specific references exist in these sections — they're already generic. Condense §2 slightly (remove packaging details, keep rules). Keep §3-5 nearly verbatim — they're universal.

- [ ] **Step 2: Char count check**

```powershell
(Get-Content templates\AGENTS.template.md -Raw).Length
```

Expected: ~2500 chars.

---

### Task 6.4: Write §6 (Bootstrap Protocol — condensed)

**Files:**
- Modify: `templates/AGENTS.template.md` (append)

- [ ] **Step 1: Append condensed Bootstrap Protocol**

Extract from AGENTS_v3.3 §6. Key changes:
- Keep §6.1 (State A-D detection) — universal
- Keep §6.2 (Onboarding questions) — generic examples only
- Keep §6.3 (Architecture checkpoint) — universal
- Keep §6.4 (Existing project stabilization) — replace `pnpm` with `[YOUR_PACKAGE_MANAGER]`
- Condense all report templates to essential fields
- Add `<!-- [CUSTOMIZE] -->` markers for health check commands

- [ ] **Step 2: Verify no project-specific references**

```powershell
Select-String -Path templates\AGENTS.template.md -Pattern "Arkaan|Supabase|pnpm|Next\.js" -CaseSensitive
```

Expected: No matches.

---

### Task 6.5: Write §7 (Governance), §8 (Authority Hierarchy)

**Files:**
- Modify: `templates/AGENTS.template.md` (append)

- [ ] **Step 1: Append sections 7-8**

From AGENTS_v3.3 §7-8, nearly verbatim — already generic. Add `<!-- [CUSTOMIZE] -->` marker after the required baseline list.

- [ ] **Step 2: Char count**

```powershell
(Get-Content templates\AGENTS.template.md -Raw).Length
```

Expected: ~6000-7000 chars.

---

### Task 6.6: Write §9-§10 (State, Phase Engine — condensed)

**Files:**
- Modify: `templates/AGENTS.template.md` (append)

- [ ] **Step 1: Append sections 9-10**

From AGENTS_v3.3: Include §9 (state/continuity), §10 (phase engine core), §10.2 (story sizing), §10.3 (vertical slices). Remove Arkaan-specific examples in §10.3. Add `<!-- [CUSTOMIZE] -->` for project-specific layers.

- [ ] **Step 2: Char count**

```powershell
(Get-Content templates\AGENTS.template.md -Raw).Length
```

Expected: ~9000-10000 chars.

---

### Task 6.7: Write §11-§13 (Git, Execution Modes, Receipt — condensed)

**Files:**
- Modify: `templates/AGENTS.template.md` (append)

- [ ] **Step 1: Append sections 11-13**

From AGENTS_v3.3: §11 (git discipline), §12.1-12.2 (dual/single agent — skip §12.3 Ralph loop to save chars), §13 (receipt sizing rules — SHORT template only, reference `templates/evidence-receipt.md` for STANDARD/FULL).

- [ ] **Step 2: Char count**

```powershell
(Get-Content templates\AGENTS.template.md -Raw).Length
```

Expected: ~12000-13000 chars.

---

### Task 6.8: Write §14-§17 (Human Decisions, Escalation, Limitations, Glossary) + Final Verify

**Files:**
- Modify: `templates/AGENTS.template.md` (append)

- [ ] **Step 1: Append final sections**

From AGENTS_v3.3: §20 → renumber as §14, §22 → §15, §27 → §16, §28 → §17. Condense glossary to essential terms only. Add `<!-- [CUSTOMIZE] Add project-specific terms -->` at end.

- [ ] **Step 2: Final character count**

```powershell
(Get-Content templates\AGENTS.template.md -Raw).Length
```

Expected: ≤ 15360 chars. If over, trim glossary or condense §6.

- [ ] **Step 3: Verify no project-specific references**

```powershell
Select-String -Path templates\AGENTS.template.md -Pattern "Arkaan|Supabase|pnpm|Next\.js|Postgres|PowerSync" -CaseSensitive
```

Expected: No matches.

- [ ] **Step 4: Verify [CUSTOMIZE] markers present**

```powershell
Select-String -Path templates\AGENTS.template.md -Pattern "\[CUSTOMIZE\]"
```

Expected: At least 3 matches.

- [ ] **Step 5: Commit**

```powershell
Set-Location "C:\Users\mshmi\OneDrive\Apps\buildloop"
git add templates/AGENTS.template.md
git commit -m "phase-1: task-6 AGENTS.template.md — generalized agent protocol template"
```

---

## Verification Summary

| Check | Command | Expected |
|-------|---------|----------|
| File exists | `Test-Path templates/AGENTS.template.md` | `True` |
| Char count ≤ 15360 | `(Get-Content ... -Raw).Length` | ≤ 15360 |
| No Arkaan/Supabase | `Select-String -Pattern "Arkaan\|Supabase"` | No matches |
| Has [CUSTOMIZE] markers | `Select-String -Pattern "\[CUSTOMIZE\]"` | ≥ 3 matches |
| 17 numbered sections | Manual: headers use `#` hierarchy | Sections 0-17 |

---

## Remaining Phase 1 Tasks (separate plans)

After Task 6 is committed, the following tasks remain for Phase 1:

| Task | Files | Description |
|------|-------|-------------|
| 7 | 3 templates | evidence-receipt.md, adversarial-review.md, diagnostic-baseline.md |
| 8 | 4 templates | phase-proposal.md, slice-contract.md, PRD.md, handoff.md |
| 9 | 1 template | buildloop.yml.example |
| 10 | 5 schemas | JSON Schema files for template frontmatter validation |
| 11 | 2 reference docs | bootstrap-protocol.md, brownfield-adoption.md |
| 12 | 2 playbooks | system-optimization.md, skill-acquisition.md |
| 13 | 1 file | CONTRIBUTING.md |

Plans for Tasks 7-13 will be written after Task 6 is verified and committed.
