# PROJECT STATE

**Repo:** enterprise-ai-dev-skills
**Remote:** https://github.com/mithunyc/enterprise-ai-dev-skills
**Local:** C:\Users\mshmi\OneDrive\Apps\enterprise-ai-dev-skills
**Last Updated:** 2026-05-09T23:35:00Z

---

## Current Status

**Phase 0: COMPLETE** ✅
**Phase 1: NOT STARTED**
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

| # | File | Source |
|---|------|--------|
| 6 | templates/AGENTS.template.md | AGENTS_v3.3 (generalized, stack-agnostic, ≤15K chars) |
| 7a | templates/evidence-receipt.md | AGENTS_v3.3 §13 |
| 7b | templates/adversarial-review.md | AGENTS_v3.3 §14 |
| 7c | templates/diagnostic-baseline.md | Level 3 hardening |
| 8a | templates/phase-proposal.md | AGENTS_v3.3 §10 |
| 8b | templates/slice-contract.md | Synthesis |
| 8c | templates/PRD.md | Enterprise-AI-Dev.md |
| 8d | templates/handoff.md | Synthesis |
| 9 | templates/buildloop.yml.example | ULTIMATE ROADMAP v5 |
| 10 | schemas/*.schema.json (5 files) | Template frontmatter |
| 11a | reference/bootstrap-protocol.md | AGENTS_v3.3 §6 |
| 11b | reference/brownfield-adoption.md | ROADMAP brownfield matrix |
| 12a | playbooks/system-optimization.md | AGENT_SYSTEM_OPTIMIZATION_PROMPT.md |
| 12b | playbooks/skill-acquisition.md | EXTERNAL_SKILL_ACQUISITION_PROMPT.md |
| 13 | CONTRIBUTING.md | write-a-skill patterns |

**Phase 1 Gate:** Every template has valid YAML frontmatter. Every schema is valid JSON.

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
3. Read docs/BUILD_SPEC.md (Phase 1 section)
4. Run: git status, git branch --show-current, git log -1 --oneline
5. Verify Phase 0 files exist (5 skills, curated-skills.json, scripts/install.ps1)
6. Begin Phase 1 — Task 6 (AGENTS.template.md)
