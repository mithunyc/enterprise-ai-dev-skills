---
type: evidence-receipt
# Tier: SHORT | STANDARD | FULL — delete unused tiers below
gate_results_ref: ".buildloop-runs/[RUN_ID]/gate-results.json"
gate_status: PASS           # PASS | FAIL | PARTIAL | NOT_RUN
confidence: HIGH            # HIGH | MEDIUM | LOW
status: GO                  # GO | CONDITIONAL_GO | NO_GO
---

# Evidence Receipt

Use this template after every phase. Match depth to risk:
- **SHORT** — low-risk, ≤5 files, no auth/payments/migrations
- **STANDARD** — default for most phases
- **FULL** — auth, payments, secrets, regulated data, migrations, deploys, infra

When in doubt, go one level up.

---

## SHORT Receipt

```text
EVIDENCE RECEIPT: PHASE [N] — [NAME] (SHORT)

KEY DECISION FOR HUMAN:
- [single most important thing to know or decide]
- If none: No blocking decisions.

Date:
Objective:
Status: COMPLETE / PARTIAL / HALTED / FAILED
Files changed: [list]
Commands run: [command → exit code]

FACT:
INFERENCE:
JUDGMENT:
UNVERIFIED:

Known risks:
Rollback:
STATE.md updated: yes / no
Next phase:
```

---

## STANDARD Receipt

```text
EVIDENCE RECEIPT: PHASE [N] — [NAME]

KEY DECISION FOR HUMAN:
- [single most important thing to know or decide]
- If none: No blocking decisions. Review at your discretion.

Date:
Objective:
Status: COMPLETE / PARTIAL / HALTED / FAILED
Confidence: [high/medium/low] — [why]

Scope:
- planned:
- actual:
- out-of-scope changes:

Git state at start:
- branch:
- clean:
- detached head:

Commands run:
- [exact command] → exit [N] → [key output]

Touched-area coverage:
- [area changed] → [check that covers it] → [result]
- [uncovered area] → [why] → [follow-up]

FACT:
INFERENCE:
JUDGMENT:
UNVERIFIED:

Known risks:
Rollback:
STATE.md updated: yes / no
Next phase:
Human decision required:
```

---

## FULL Receipt

Use the STANDARD receipt, then append these sections:

```text
Verification matrix:
- [claim] → [evidence type] → [proof] → [verified / partially verified / unverified]

Mutation-minded verification:
- [critical area] → what wrong implementation would still pass these checks? → [answer]

Security check:
- triggers active:
- checks performed:
- findings:
- depth: verified / partially verified / not deeply verified
- [If "not deeply verified" on auth/payments/PII/regulated data:]
  RECOMMEND HUMAN SECURITY REVIEW BEFORE PRODUCTION DEPLOY

Architecture check:
- vendor imports in core:
- business logic in handlers:
- oversized handlers/modules:

Environment check:
- CI-equivalent command:
- match quality: exact / approximate / none
- parity risks:
- env vars assumed:

Spec compliance:
- implemented:
- not implemented:
- drift found:
```

---

## Receipt Quality Rules

- Never say "all tests pass" without exact commands and raw outputs
- If zero tests ran, say so explicitly
- If a changed area lacks coverage, say so explicitly
- If verification is manual or environment-dependent, say so explicitly
- Partial work must be labeled PARTIAL
- If the chosen tier seems too light for actual risk, escalate it

## Long Project Hygiene

Every 5 phases (or when receipts become hard to navigate), produce a cumulative summary:

```text
CUMULATIVE SUMMARY — Phases [X] through [Y]

Total files created/modified:
Major domains or features implemented:
Major verification results:
Open risks carried forward:
Governance changes:
Stale items to resolve:
```

---

*Source: buildloop/templates/evidence-receipt.md*
