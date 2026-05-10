# Risk Matrix — Fallback Controls

> **Override:** A project's local `AGENTS.md` or `.buildloop.yml` can override
> any level in this matrix. These are global fallback defaults.

---

## Low Risk

**Examples:** docs, comments, small UI copy, local styling, narrow refactor with tests.

**Required controls:**
- Self-review
- Basic gates (lint, build)
- Short receipt (objective + files changed + gate status)
- 1–2 grill-me probes if planning

---

## Medium Risk

**Examples:** feature slice, API change, shared component, new dependency, database read path, non-critical business logic.

**Required controls:**
- Slice contract with `allowed_files` and `blast_radius`
- TDD where behavior is non-obvious
- Deterministic gates (lint + typecheck + test + build)
- Standard receipt with evidence
- Human approval before merge
- 3 grill-me probes if planning

---

## High Risk

**Examples:** auth/authz, payments, migrations, production config, secrets, infrastructure, PII, regulated data, offline sync, broad refactor.

**Required controls:**
- Human approval **before coding**
- Full receipt with FACT/INFERENCE/JUDGMENT labels
- Independent AI review
- Rollback plan documented
- Security review
- Deploy approval
- 5–7 grill-me probes if planning

---

## Human Approval Triggers

Never proceed without explicit human approval for:
- Production deploy
- Secret rotation or creation
- Database migration (destructive or schema-altering)
- Auth/authorization changes
- Payment logic
- Infrastructure or CI pipeline changes
- PII or regulated data handling
- Broad cross-cutting refactors
- Autonomous loop start
