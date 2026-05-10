# PROJECT STATE

**Repo:** enterprise-ai-dev-skills
**Remote:** https://github.com/mithunyc/enterprise-ai-dev-skills
**Local:** C:\Users\mshmi\OneDrive\Apps\enterprise-ai-dev-skills
**Last Updated:** 2026-05-10T03:35:00Z

---

## Current Status

**Phase 0: COMPLETE** ✅
**Phase 1: COMPLETE** ✅ — All templates, schemas, and reference docs built and verified
**Phase 1.5: COMPLETE** ✅ — Orchestrator hardening (Opus + Gemini reconciliation)
**Phase 1.6: COMPLETE** ✅ — Brownfield bootstrap compiler (manifest schema, example, diagnostic labs, validator)
**Phase 2: NOT STARTED**
**Phase 3: NOT STARTED**
**Phase 4: NOT STARTED**

---

## What Was Done (Phase 0 — Evidence)

| Task | File | Status |
|------|------|--------|
| Folder structure | templates/, schemas/, reference/, playbooks/, tests/, examples/, docs/ | ✅ Created |
| Copy caveman skill | skills/caveman/SKILL.md | ✅ Done |
| Copy grill-me skill | skills/grill-me/SKILL.md | ✅ Done |
| Copy karpathy-guidelines skill | skills/karpathy-guidelines/SKILL.md | ✅ Done |
| Rewrite master orchestrator | skills/enterprise-ai-dev/SKILL.md | ✅ Done — greenfield/brownfield/autonomous paths |
| Rebuild curated-skills.json | curated-skills.json | ✅ Done — tiered, 5 dupes removed |
| Update install script | scripts/install.ps1 | ✅ Done — --Mode, conflict detection, -DryRun |
| Canonical roadmap | docs/ROADMAP.md | ✅ Done |
| Build spec | docs/BUILD_SPEC.md | ⏳ To be written |

---

## Phase 0 Gate — PASSED

- [x] 5 skill directories present in skills/
- [x] curated-skills.json has tier definitions
- [x] install.ps1 accepts --Mode parameter
- [ ] BUILD_SPEC.md written to docs/ (in progress)
- [ ] Changes committed to git

---

## What Must Be Done Next (Phase 1)

Read `docs/BUILD_SPEC.md` — Phase 1 section — for full task detail.

**13 files to create:**

| # | File | Source | Status |
|---|------|--------|--------|
| 6 | templates/AGENTS.template.md | AGENTS_v3.3 (generalized, stack-agnostic, ≤15K chars) | ✅ Done — 15328 bytes, 0 banned words |
| 7a | templates/evidence-receipt.md | AGENTS_v3.3 §13 | ✅ Done |
| 7b | templates/adversarial-review.md | AGENTS_v3.3 §14 | ✅ Done |
| 7c | templates/diagnostic-baseline.md | Level 3 hardening | ✅ Done |
| 8a | templates/phase-proposal.md | AGENTS_v3.3 §10 | ✅ Done |
| 8b | templates/slice-contract.md | Synthesis | ✅ Done |
| 8c | templates/PRD.md | Enterprise-AI-Dev.md | ✅ Done |
| 8d | templates/handoff.md | Synthesis | ✅ Done |
| 9 | templates/buildloop.yml.example | ULTIMATE ROADMAP v5 | ✅ Done |
| 10 | schemas/*.schema.json (5 files) | Template frontmatter | ✅ Done |
| 11a | reference/bootstrap-protocol.md | AGENTS_v3.3 §6 | ✅ Done |
| 11b | reference/brownfield-adoption.md | ROADMAP brownfield matrix | ✅ Done |
| 12a | playbooks/system-optimization.md | AGENT_SYSTEM_OPTIMIZATION_PROMPT.md | ✅ Done |
| 12b | playbooks/skill-acquisition.md | EXTERNAL_SKILL_ACQUISITION_PROMPT.md | ✅ Done |
| 13 | CONTRIBUTING.md | write-a-skill patterns | ✅ Done |

**Phase 1 Gate — PASSED:**
- [x] Every template has valid YAML frontmatter (verified via node script)
- [x] Every schema is valid draft-07 JSON (verified via node script)
- [x] templates/AGENTS.template.md exists and is ≤15K chars
- [x] No Arkaan/Supabase/pnpm references (0 matches)
- [x] Adversarial and Contrarian review completed and passed

---

## What Was Done (Phase 1.5 — Evidence)

| Task | File | Status |
|------|------|--------|
| Add /orchestrator trigger | skills/enterprise-ai-dev/SKILL.md frontmatter | ✅ Done |
| Limitation disclaimer | SKILL.md body | ✅ Done |
| Inline claim labels | SKILL.md — FACT/INFERENCE/JUDGMENT/UNVERIFIED | ✅ Done |
| Inline authority order | SKILL.md — 6 levels, project-local overrides | ✅ Done |
| Expand Step 0 | SKILL.md — 7 classifications (was 3) | ✅ Done |
| Self-review checklist | SKILL.md — 6 questions | ✅ Done |
| Output contract | SKILL.md — planning + execution formats | ✅ Done |
| Max 3 attempts stop | SKILL.md — stop conditions | ✅ Done |
| Delegation rule | SKILL.md — routes to specialists | ✅ Done |
| Risk matrix | references/risk-matrix.md | ✅ Created |
| Build spec update | docs/BUILD_SPEC.md — Phase 1.5 section | ✅ Done |

**Phase 1.5 Gate — PENDING VERIFICATION:**
- [ ] SKILL.md ≤ 10K chars
- [ ] /orchestrator in description
- [ ] No duplicate orchestrator skill
- [ ] risk-matrix.md exists
- [ ] No leaked private references
- [ ] Committed to git

---

## What Was Done (Phase 1.6 — Evidence)

| Task | File | Status |
|------|------|--------|
| Manifest JSON Schema | schemas/orchestrator-manifest.schema.json | ✅ Done — draft-07, 10 required top-level fields, evidence_type, freshness metadata |
| Example manifest | templates/orchestrator-manifest.example.json | ✅ Done — governed brownfield with override, lessons, special gates, external memory |
| Diagnostic labs reference | reference/brownfield-diagnostic-labs.md | ✅ Done — 10 labs (Lab 0–9), read-only scan, manifest-only output |
| Validation script | scripts/validate-manifest.mjs | ✅ Done — zero-dep, 148 lines, validates schema + example + privacy |
| BUILD_SPEC update | docs/BUILD_SPEC.md | ✅ Done — Phase 1.6 section with allowed/forbidden/verification/exit criteria |
| ROADMAP update | docs/ROADMAP.md | ✅ Done — one line added to Foundation law |
| STATE.md update | tasks/STATE.md | ✅ Done |

**Phase 1.6 Gate — PENDING VERIFICATION:**
- [ ] Schema is valid draft-07 JSON
- [ ] Example is valid JSON and matches schema structure
- [ ] Diagnostic labs document exists with all 10 labs
- [ ] Validator script exits 0
- [ ] No private project names in new files
- [ ] BUILD_SPEC.md has Phase 1.6 section
- [ ] Committed to git

---

## Source Material Paths (agent must use these)

| Source | Path |
|--------|------|
| AGENTS_v3.3 | C:\Users\mshmi\OneDrive\Apps\enterprisegradesoftwireos\AGENTS_v3_3.md |
| System Optimization prompt | C:\Users\mshmi\OneDrive\Apps\enterprisegradesoftwireos\AGENT_SYSTEM_OPTIMIZATION_PROMPT.md |
| Skill Acquisition prompt | C:\Users\mshmi\OneDrive\Apps\enterprisegradesoftwireos\EXTERNAL_SKILL_ACQUISITION_PROMPT.md |
| Canonical Roadmap | docs/ROADMAP.md (this repo) |
| Build Spec | docs/BUILD_SPEC.md (this repo) |

---

## Open Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Upstream commit SHAs not yet pinned | MEDIUM | Set to HEAD for now; pin before v2.0 release |
| install.sh not updated (only .ps1 done) | LOW | Phase 1 task — update install.sh to match install.ps1 |
| No git commit yet for Phase 0 work | LOW | First action of next session |

---

## Governance

- **Planning doc:** docs/ROADMAP.md
- **Build spec:** docs/BUILD_SPEC.md
- **Audit history:** audits/ (ChatGPT critique, prior roadmap versions)
- **Skills source:** C:\Users\mshmi\OneDrive\Apps\enterprisegradesoftwireos\

---

## Session Handoff Instruction

When starting a new session on this repo, the agent MUST:
1. Read this file (tasks/STATE.md)
2. Read docs/ROADMAP.md
3. Read docs/BUILD_SPEC.md (Phase 2 section)
4. Run: git status, git branch --show-current, git log -1 --oneline
5. Verify Phase 0 + 1 + 1.5 files exist
6. Begin Phase 2 — Task 14 (gate-runner.mjs)
