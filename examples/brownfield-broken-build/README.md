# Example: Brownfield Broken Build

> ⚠️ **This is a deliberately broken fixture.** It simulates a real-world brownfield repo with a failing test, no build config, and stale governance. Use it to practice the `enterprise-ai-dev` brownfield diagnostic workflow.
>
> Do not use any file in this directory as real governance for a production project.

---

## What This Fixture Represents

This is "Acme Widget App" — a fictional existing project someone hands you. It has:

- A **broken test** that fails on every run
- A `package.json` with a test script but no build or lint config
- **No `.buildloop.yml`** — the gate runner cannot run
- A **stale `AGENTS.md`** from 2024 that references tools and workflows that no longer exist
- An npm **lockfile** proving this is a real dependency-managed project, not a toy

---

## How to Use This Fixture

1. Open your agent inside this directory (or point it here).
2. Say:

```text
Use enterprise-ai-dev as my master CTO orchestrator for this repo.
```

3. The agent will classify this as **BROWNFIELD** (existing files + git history present).
4. Watch it execute the full diagnostic workflow.

---

## What the Agent Should Do (Expected Diagnostic Behavior)

### Step 0 — Classify: BROWNFIELD

Signals the agent reads:
- `package.json` present → JS ecosystem
- `package-lock.json` present → npm
- `AGENTS.md` present but stale (2024, references outdated tools)
- No `.buildloop.yml` → gate infrastructure missing

**Classification: BROWNFIELD.**

### Step 1A — Minimal Audit

```
git status        → (run from this directory)
package manager   → npm (package-lock.json detected)
runtime           → Node.js
governance files  → AGENTS.md (stale, 2024)
CI config         → NONE
buildloop config  → NONE
```

### Step 1B — Full Diagnostic

The agent runs the project's native test command:

```bash
npm test
# or: node test.mjs
```

Expected output:

```
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
1 !== 2

node:assert:126
  throw new AssertionError(msg);
  ^
```

The agent captures this and produces `diagnostic_baseline.md`:

```yaml
---
type: diagnostic_baseline
repo_state: C
health:
  build: NOT_CONFIGURED
  tests: FAIL
  lint: NOT_CONFIGURED
  ci: NONE
stabilization_required: true
---
```

### Stabilization Gate

Because `stabilization_required: true`, the agent **blocks feature work** and presents a stabilization plan:

```
DECISION REQUIRED
Recommendation: FIX
Why: Tests are failing. No build or lint config. Gate runner cannot run without .buildloop.yml.
     Features must not be added until the foundation is verified.
Risk: HIGH
What I need from you: approve the stabilization plan / modify / reject
If approved, next action: Fix the broken test, add .buildloop.yml, then re-run diagnostic.
```

---

## Files In This Fixture

| File | Purpose |
|------|---------|
| `package.json` | Declares the `test` script. No build, no lint. |
| `package-lock.json` | Empty lockfile proving this is a real npm project. |
| `test.mjs` | Broken test — `assert.strictEqual(1, 2)` always fails. |
| `AGENTS.md` | Stale governance file from 2024. Deliberately outdated. |

---

## After the Diagnostic

Once the agent presents its stabilization plan, you can:

1. **Fix the broken test** (`assert.strictEqual(1, 2)` → `assert.strictEqual(1, 1)`)
2. **Add `.buildloop.yml`** using `templates/buildloop.yml.example` from the root of this repo
3. **Re-run Step 1B** to confirm health is restored
4. **Proceed to Step 2 (PRD)** for feature work

This is exactly what the `enterprise-ai-dev` brownfield path requires before any feature work begins.

---

## See Also

- [`reference/brownfield-adoption.md`](../../reference/brownfield-adoption.md)
- [`reference/brownfield-diagnostic-labs.md`](../../reference/brownfield-diagnostic-labs.md)
- [`templates/diagnostic-baseline.md`](../../templates/diagnostic-baseline.md)
- [`examples/greenfield-empty/`](../greenfield-empty/README.md)
