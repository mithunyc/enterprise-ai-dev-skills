# Drift Control

> Buildloop public reference for detecting and correcting governance drift.

---

## When to Run

Run these checks at the end of each phase and on every session resume.

---

## Drift Check Categories

### Claim-Proof Binding

Important claims must map to proof. If proof is missing, mark UNVERIFIED.

Do not carry a claim forward as FACT unless it is directly supported by a file, command output, test result, or diff.

### Touched-Area Verification

For each changed route, module, schema, contract, service, or UI path, name the check that covers it.

If a changed area has no associated check, document the gap explicitly. Do not leave it implied.

### Planned-vs-Actual Scope

Compare the approved objective against the actual diff.

If unrelated work appears in the diff, label it as drift and recommend either a revert or an explicit approval from the human. Do not absorb out-of-scope changes silently.

### Governance Conflict Scan

Check for:

- Contradictory rules across governance files
- Duplicate authority for the same rule
- Obsolete files that still appear authoritative
- Stale lessons overriding current truth
- Vendor or nested instruction files that appear to weaken canonical policy

If a conflict is found, stop and escalate. Never silently resolve a same-level conflict by guessing.

### Environment Drift Scan

Check:

- Runtime version matches CI and local environment
- Package manager is consistent across environments
- Lockfile is committed and up to date
- CI commands match local commands
- Visible environment assumptions are documented

### Context Continuity Check

Confirm:

- Current approved phase
- Last receipt
- Open risks
- Open human decisions

If continuity is weak — state file disagrees with receipt, or receipt disagrees with actual repo state — stop and stabilize before continuing.

---

This exists because implementation drift, governance drift, and environment drift all create failures that ordinary test suites miss.

---

*Source: buildloop/reference/drift-control.md*
