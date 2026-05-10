# Example: Greenfield Empty Project

This example walks through the complete `enterprise-ai-dev` **GREENFIELD path** on a brand-new, empty project.

> **What is this?** A worked narrative showing every lifecycle step the agent executes before and during feature development. Follow this exactly — skipping steps defeats the governance model.

---

## Prerequisites

1. Install `enterprise-ai-dev` skills: see the [main README](../../README.md).
2. Create an empty project directory with a git repo initialized:

```bash
mkdir my-new-app
cd my-new-app
git init
```

3. Start a fresh agent session inside this directory.

---

## Step 0 — Classify

Open your agent and say:

```text
Use enterprise-ai-dev as my master CTO orchestrator for this repo.
```

The agent reads the directory. It sees:
- Empty directory (no existing files)
- `git init` but no commits
- No `AGENTS.md`, no CI config, no lockfile

**Classification: GREENFIELD.** The agent selects the greenfield profile automatically.

---

## Step 1A — Minimal Audit

The agent runs a minimal audit even for greenfield projects:

```
git status        → nothing committed
file count        → 0 (empty)
package manager   → NOT_DETECTED (no lockfile)
runtime           → NOT_DETECTED (no config files)
governance files  → NONE
```

No blockers. The agent proceeds to planning.

---

## Step 2 — PRD

The agent asks you clarifying questions — only questions that affect architecture, risk, or UX. Example exchange:

```
Agent: What is the core user action this product enables?
You:   Users upload a CSV and see a chart of their data.

Agent: Does this need user authentication?
You:   No, it's a public tool.

Agent: What runtime do you prefer?
You:   Node.js with a simple HTML frontend.
```

The agent produces a PRD artifact (`prd.md`) with frontmatter:

```yaml
---
type: prd
status: DRAFT
stories_count: 3
acceptance_criteria_complete: false
---
```

---

## Step 3 — Adversarial Spec

The agent applies risk-scaled probes to stress-test the PRD. For a LOW-risk greenfield project: 1–2 probes.

```
Probe 1: What happens when the CSV has malformed rows?
Recommended A: Parse row by row, skip malformed rows, show a count of skipped rows to the user.

Probe 2: What is the maximum file size you expect?
Recommended A: Cap at 5MB client-side before upload. Add a clear error message.
```

You approve, modify, or reject each probe answer. No code is written until you approve.

---

## Step 4 — Architecture Checkpoint

The agent proposes the simplest architecture that satisfies the approved PRD:

```
Single HTML file + vanilla JS (no framework)
CSV parsed client-side with a 5MB size guard
Chart rendered with Chart.js CDN
No backend required
```

**Karpathy check:** Would a senior engineer say this is overcomplicated? No — it's the minimum viable architecture. Approved.

---

## Step 7 — Slice Contract

The agent produces a slice contract for the first story:

```yaml
---
type: slice-contract
story: "User uploads a CSV and sees a bar chart"
allowed_files:
  - index.html
blast_radius: LOW
rollback: "git restore -- index.html"
depends_on: []
evidence_required:
  - Manual browser test showing chart renders
  - CSV parse handles malformed rows without crashing
---
```

---

## Step 8 — Human Approval Gate

```
DECISION REQUIRED
Recommendation: PROCEED
Why: Architecture is minimal, slice is scoped to one file, rollback is trivial.
Risk: LOW
What I need from you: approve / modify / reject
If approved, next action: TDD execution for the CSV upload story
```

**You type:** `approve`

---

## Step 9 — TDD Execution

The agent writes the test first (red), then the implementation (green), then refactors.

For a vanilla JS project, this might be a simple test harness in `test.mjs`:

```js
import assert from 'node:assert/strict';
import { parseCSV } from './csv-parser.mjs';

const result = parseCSV('name,value\nAlice,10\nBob,malformed\nCarol,30');
assert.equal(result.rows.length, 2);      // malformed row skipped
assert.equal(result.skipped, 1);
console.log('PASS csv parser skips malformed rows');
```

Red: test fails. Agent writes `csv-parser.mjs`. Green: test passes.

---

## Step 11 — Gate Runner

The agent generates your `.buildloop.yml` at this step. **This file does not pre-exist.** It is created during execution:

```yaml
# .buildloop.yml — generated during Step 7/8 for this project
adoption_mode: greenfield
risk_level: low
commands:
  test: "node test.mjs"
protected_paths:
  - ".env*"
  - "**/*.key"
```

The gate runner executes:

```bash
node scripts/gate-runner.mjs
```

Produces `gate-results.json`:

```json
{
  "run_id": "2026-05-10T09:00:00.000Z",
  "adoption_mode": "greenfield",
  "commands": [
    { "name": "test", "command": "node test.mjs", "exit_code": 0 }
  ],
  "protected_paths_violated": [],
  "overall": "PASS"
}
```

---

## Step 12 — AI Review

An independent AI reviewer (or second agent session) reads `gate-results.json` and the slice contract. It challenges: did the agent stay within `allowed_files`? Did the evidence match the claims?

```
Verdict: GO
Why: gate-results.json shows PASS. Only index.html and csv-parser.mjs were changed.
     Evidence matches the slice contract acceptance criteria.
```

---

## Step 14 — PR / Preview

Agent opens a PR (or you merge manually). The evidence receipt references `gate-results.json`. No receipt = no merge.

---

## What You Learned

| Governance Artifact | Created At Step |
|--------------------|----------------|
| `prd.md` | Step 2 |
| Adversarial probe log | Step 3 |
| `slice-contract.md` | Step 7 |
| `.buildloop.yml` | Step 8/11 |
| `gate-results.json` | Step 11 |
| Evidence receipt | Step 12 |

---

## Next Steps

- Repeat Steps 7–14 for each additional story.
- When planning the next feature, go back to Step 2.
- Use `templates/` in this repository for all governance artifacts.
- See [`examples/brownfield-broken-build/`](../brownfield-broken-build/README.md) for the brownfield diagnostic workflow.
