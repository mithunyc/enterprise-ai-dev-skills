---
type: adversarial-review
verdict: GO                 # GO | CONDITIONAL_GO | NO_GO
critical_count: 0
high_count: 0
---

# Adversarial Review Template

Required for dual-agent mode.
Strongly recommended before risky merges in any mode.

The reviewer must verify the **receipt**, not just the code. Challenge missing proof. Challenge out-of-scope edits. State what could not be independently verified.

---

## Review Template

```text
ADVERSARIAL REVIEW: PHASE [N] — [NAME]

Inputs reviewed:
- spec files: [list]
- authority files: [list]
- receipt: [path]
- changed files / diff: [git diff --stat output or summary]

Independent checks run:
- [exact command]
  - expected: [what should happen]
  - actual: [what happened]
  - outcome: PASS / FAIL / PARTIAL

Findings:
1. [finding title]
   - severity: critical / high / medium / low
   - category: spec drift / weak proof / architecture violation /
               security gap / env gap / governance conflict / missing requirement
   - evidence: [exact quote, line, or command output]
   - required fix: [specific action]

2. [next finding]
   - severity:
   - category:
   - evidence:
   - required fix:

Receipt integrity:
- claim without proof: [quote claim, state what proof is missing]
- proof that does not match claim: [quote both]
- changed area not covered: [area → why uncovered]
- command not actually run or not shown: [command]
- stale state detected: [describe]
- receipt tier too light for actual risk: yes / no — [why]

Summary counts:
- critical: [N]
- high: [N]
- medium: [N]
- low: [N]

Verdict: GO / CONDITIONAL GO / NO-GO

Why:
- [1–3 sentences explaining the verdict]

If CONDITIONAL GO — required before merge:
- [ ] [specific fix 1]
- [ ] [specific fix 2]
```

---

## Reviewer Rules

1. **Read the receipt first** — not the diff. The receipt is the agent's claims. Verify the claims against evidence.
2. **Run independent checks** — do not trust the agent's command output without re-running key checks.
3. **Challenge weak proof** — "passed tests" is not proof unless exact commands and outputs are shown.
4. **Flag out-of-scope edits** — any files changed that were not in the approved blast radius.
5. **Escalate uncertain tier** — if the receipt is SHORT but the phase touched auth or migrations, say so.
6. **State what you could not verify** — it is honest to say "I cannot independently verify X."

## Severity Definitions

| Severity | Meaning |
|----------|---------|
| **critical** | Blocks merge. Data loss, security exposure, or spec breach. |
| **high** | Must fix before merge. Functional gap or missing required proof. |
| **medium** | Should fix soon. Code quality, coverage gap, or documentation drift. |
| **low** | Nice to have. Style, minor cleanup, or informational note. |

## Category Definitions

| Category | Meaning |
|----------|---------|
| `spec drift` | Implementation deviates from the approved PRD or acceptance criteria |
| `weak proof` | A claim is made without sufficient evidence |
| `architecture violation` | Boundary rule broken (e.g., business logic in handler) |
| `security gap` | A security trigger was activated but not properly checked |
| `env gap` | Local behavior does not match CI or production environment |
| `governance conflict` | Two authority files contradict each other |
| `missing requirement` | An accepted requirement was not implemented |

---

*Source: buildloop/templates/adversarial-review.md | Upstream: AGENTS_v3.3 §14*
