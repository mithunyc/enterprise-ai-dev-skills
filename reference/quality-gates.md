# Quality Gates

> Buildloop public reference for evidence-based quality gates.

Replace `[YOUR_X_COMMAND]` placeholders with the actual commands for your project (e.g., `npm run lint`, `cargo test`, `make build`).

---

## Code Quality Gates

Before any code is considered production-ready:

```text
[ ] [YOUR_LINT_COMMAND]      — zero warnings, zero errors
[ ] [YOUR_TYPECHECK_COMMAND] — zero errors
[ ] [YOUR_TEST_COMMAND]      — all tests pass, zero skipped without documented reason
[ ] [YOUR_BUILD_COMMAND]     — succeeds without warnings
[ ] No TODO/FIXME/HACK comments without a linked tracking issue
[ ] No debug logging statements in production code paths
[ ] No hardcoded secrets, API keys, or credentials
[ ] No untyped or weakly-typed code without documented justification
```

---

## Architecture Gates

```text
[ ] Core/domain package has zero imports from framework or vendor libraries
[ ] Contracts/types package has zero runtime code
[ ] Integrations package imports only from contracts
[ ] API handlers are thin (parse → delegate → respond)
[ ] Business logic lives in domain services or use cases, not in handlers or UI components
[ ] State machines cover all valid AND invalid transitions, with tests
[ ] Every external output or AI-generated result links to its source evidence
```

---

## Security Gates

```text
[ ] Your authentication middleware runs first on all protected routes
[ ] Your authorization guard is called with the correct permission key on all mutations
[ ] Access control is enabled on all data tables in all schemas
[ ] Unauthenticated requests return 401 on every protected route
[ ] Surface-restricted actions return 403 when called from an unauthorized surface
[ ] Privileged service keys are used only for their designated, documented purpose
[ ] Credentials and secrets are stored in your secrets manager, not in code or config files
[ ] No secrets in client-side code or git history
```

---

## Resilience Gates

```text
[ ] App works when an external AI provider is unavailable
[ ] App works when an external integration is down
[ ] App works when a data source returns empty results
[ ] Individual UI sections or modules fail independently (others still render)
[ ] Stale data is labeled with a timestamp, never silently hidden
[ ] Feature flags disable features gracefully (empty state, not an error)
```

---

## Using These Gates

- Run the relevant subset for each phase — not all gates apply to every change.
- A gate that is not applicable must be explicitly documented as such, not silently skipped.
- FULL receipts for risky phases must reference which gates were run and what the outcomes were.
- If a gate cannot be run (environment limitation, external dependency), mark it UNVERIFIED and document why.

---

*Source: buildloop/reference/quality-gates.md*
