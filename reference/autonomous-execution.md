# Autonomous Execution Contract

> Extracted and generalized from AGENTS_v3.3 §31, §31.2, §31.5, §31.6. Stack-agnostic reference for the enterprise-ai-dev skill.

---

## Authority Levels

This section governs how agents operate when running with minimal or no human supervision (e.g., autonomous loop, agent mode).

| Level | Agent MAY do without asking | Agent MUST stop and ask |
|---|---|---|
| 1: Read-only | Read any file, run any read-only command, produce analysis | Nothing — always safe |
| 2: Test/lint | Run tests, lint, typecheck, build | If tests fail: diagnose, but do not change test expectations without approval |
| 3: Implement story | Create/modify files within approved story scope, run targeted tests | If scope expands beyond approved story, if architecture decision is ambiguous, if security-sensitive code is touched |
| 4: Schema/migration | Write migration files, update seed data | Always get approval before applying destructive migrations. Always verify rollback path exists. |
| 5: Deploy/infra | Push to staging, trigger preview deploy | Never deploy to production without explicit human approval. Never modify secrets. Never change auth rules. |

**Default autonomous level: 3** (implement approved stories).
Levels 4–5 require explicit human opt-in per phase.

---

## Correctness-First Execution Principles

These principles apply to ALL autonomous execution, regardless of tool or model.

### Accuracy Over Speed

- Verify before claiming
- Run the check before asserting the result
- Read the file before describing its contents
- Never assume a test passes — run it and report the output

### No Optimistic Assertions

```text
WRONG: "All tests should pass since I followed the pattern."
RIGHT: "Running [YOUR_TEST_COMMAND]... Exit code 0. 47 tests passed, 0 failed. Output: [actual output]"

WRONG: "This migration is safe because it only adds columns."
RIGHT: "Running [YOUR_MIGRATION_COMMAND]... Exit code 0. All 23 migrations applied. Seed succeeded."

WRONG: "The API should return 403 for this surface."
RIGHT: "Sending request to restricted endpoint... HTTP 403. Body: {error: 'unauthorized'}."
```

### Evidence Chain for Every Claim

Every factual claim in a receipt must trace to one of:

- A command output (exact command + exit code + key output lines)
- A file content (path + line numbers)
- A test result (test name + pass/fail)
- A diff (before/after)

Claims without evidence chains are UNVERIFIED. Label them explicitly.

### Self-Correction Over Self-Justification

When something fails:

- Do not explain why it should have worked
- Do not blame external factors
- Diagnose the actual error from actual output
- Fix the actual problem
- Verify the fix with actual evidence

### Truth Over Completion

- It is better to report "3 of 5 stories complete, 2 blocked by [reason]" than to force all 5 and produce broken code
- It is better to say "I cannot verify this claim" than to mark it FACT
- It is better to stop mid-story at a clean point than to finish with untested code
- A partial receipt with honest evidence is worth more than a complete receipt with fabricated claims

---

## Autonomous Loop Safety Guardrails

> **Artifact definitions:**
> `prd.json` — a machine-readable PRD with user stories, acceptance criteria, and pass/fail status per story.
> `progress.txt` — a persistent log of iteration results with a Codebase Patterns section for reusable learnings that future iterations must read first.

When running in an autonomous loop (iterative agent execution where each iteration is a fresh context):

- If 3 consecutive iterations fail to mark any story as `passes: true`, stop and escalate
- If a story has been attempted 2+ times without passing, flag it as blocked in `progress.txt` and move to the next story
- If `progress.txt` grows beyond 500 lines, produce a cumulative summary and archive older entries
- If the agent detects that `prd.json` has been externally modified since the last iteration, re-read it before continuing
- Never modify `prd.json` story definitions (title, acceptance criteria) — only modify `passes` status
- Never delete `progress.txt` entries — only append

### Loop Termination Conditions

The loop terminates when:

- All stories have `passes: true` → output `<promise>COMPLETE</promise>`
- Max iterations reached → output `<promise>MAX_ITERATIONS</promise>` with summary of remaining stories
- 3 consecutive failures → output `<promise>STUCK</promise>` with diagnosis
- Human sends `HALT` → stop immediately, commit current state

### Between-Iteration State Verification

Each new iteration must:

1. Verify git state (clean working tree, correct branch)
2. Read `progress.txt` Codebase Patterns section FIRST
3. Run `[YOUR_TYPECHECK_COMMAND]` to confirm codebase is healthy
4. Check `prd.json` for current story status
5. Only then pick the next story

If any step fails, the iteration should diagnose and fix (if safe) or escalate.

---

## Error Recovery Patterns

| Error Type | Agent Response |
|---|---|
| Test failure after implementation | Read error output. Diagnose root cause. Fix. Re-run. If fix unclear after 2 attempts, mark UNVERIFIED. |
| Type error after changes | Run full typecheck. Fix all errors. Never suppress with `any` or `@ts-ignore`. |
| Migration failure | Check SQL syntax. Check for dependency ordering. Fix. Re-run `[YOUR_MIGRATION_COMMAND]`. |
| Build failure | Read full error. Fix. Do not comment out code to make build pass. |
| Dependency conflict | Pin versions. Update lockfile. Verify no breaking changes. |
| Access control policy denies access | Verify policy matches the user context. Do not disable access controls to work around. |
| External provider timeout | Verify adapter implements timeout. Verify degraded mode returns graceful result. |
| Context window filling | Stop at clean commit point. Update `progress.txt`. End session. |

### The Agent Must Never

- Suppress errors with `catch {}` (empty catch)
- Disable linting rules to pass
- Add `// @ts-ignore` or `// eslint-disable` without documenting why in the receipt
- Skip tests to save time
- Commit code that does not compile

---

*Source: AGENTS_v3.3 §31, §31.2, §31.5, §31.6*
