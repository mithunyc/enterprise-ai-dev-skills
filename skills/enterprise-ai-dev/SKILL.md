---
name: enterprise-ai-dev
description: End-to-end enterprise-grade AI software delivery workflow for nontechnical founders, product owners, and teams using Codex to build production software. Use when asked to build, fix, refactor, launch, review, harden, or operate software with AI agents, especially when the request mentions enterprise-grade, production-ready, robust, secure, scalable, full-stack, end-to-end, autonomous agent development, PRD, tickets, tests, deployment, QA, security, or release readiness.
---

# Enterprise AI Dev

Use this skill as the operating workflow for serious software work. Be adversarial, evidence-led, and user-friendly. The user may be nontechnical, so translate decisions into business and product consequences without hiding engineering risks.

## Prime Directive

Ship the smallest production-grade slice that proves the product value, with tests, security review, observability, and rollback thinking. Do not optimize for impressive activity. Optimize for verified outcomes.

## Source Of Truth

Before implementation, establish or update these artifacts when they are missing or stale:

- `PRD.md`: goal, users, must-haves, non-goals, acceptance criteria.
- `CONTEXT.md`: domain terms, business rules, integration boundaries, user language.
- `docs/adr/`: architecture decisions that would be expensive to reverse.
- Issue list or task plan: independently testable vertical slices.

If the repository already has equivalent files, use its existing names and conventions.

## Workflow

1. Clarify the outcome.
   - Ask only the questions that materially affect architecture, risk, cost, or UX.
   - Prefer assumptions with explicit confidence when the answer can be safely inferred.
   - State non-goals early to prevent scope creep.

2. Stress-test the request.
   - Challenge the user framing: is this feature, workflow, or product actually the narrowest useful slice?
   - Identify failure modes: wrong user, wrong data model, wrong integration, hidden compliance, weak auth, operational cost, lock-in, bad UX, hard rollback.
   - Give a plain-language recommendation with tradeoffs.

3. Plan vertical slices.
   - Break work into small slices that each produce observable user value.
   - Each slice must include implementation, tests, docs if relevant, and verification.
   - Avoid platform migrations, large rewrites, and speculative abstractions unless they directly reduce current risk.

4. Implement with guardrails.
   - Read the existing codebase first and follow local patterns.
   - Keep edits scoped to the slice.
   - Write or update tests before or alongside behavior changes.
   - Prefer boring, widely adopted dependencies over novel frameworks.
   - Do not invent secrets, fake production credentials, or silent fallback behavior.

5. Verify with evidence.
   - Run the repository's relevant tests, type checks, lint, build, and migrations where applicable.
   - For frontend work, test real flows in a browser and inspect responsive states.
   - For APIs, verify success, failure, auth, validation, and idempotency paths.
   - Never claim completion without saying what was verified and what was not.

6. Review adversarially.
   - Review the diff for security, data loss, race conditions, privacy, permissions, error handling, observability, and rollback.
   - Check docs and user-facing text for drift.
   - Revisit the PRD acceptance criteria and mark each as pass, fail, or not tested.

7. Prepare release.
   - Summarize user impact, changed files, tests run, residual risk, deploy steps, rollback plan, and follow-up work.
   - Prefer a pull request or reviewed merge over direct production changes.
   - For high-risk changes, recommend feature flags, canaries, monitoring, and a manual rollback path.

## Quality Gates

Do not recommend shipping until these are true or explicitly waived:

- Acceptance criteria are mapped to concrete verification.
- Tests cover the changed behavior and at least one important failure path.
- Security-sensitive flows have auth, authorization, validation, and audit/logging considered.
- Data model changes include migration and rollback thinking.
- User-visible UI has been visually checked at desktop and mobile sizes.
- Operational paths include errors, retries, observability, and cost limits where relevant.
- No unrelated drive-by changes are mixed into the diff.

## Skill Routing

Use specialist skills when available:

- Requirements and alignment: `grill-with-docs`, `to-prd`, `brainstorming`, `writing-plans`.
- Implementation discipline: `tdd`, `test-driven-development`, `executing-plans`.
- Debugging: `diagnose`, `systematic-debugging`.
- Architecture cleanup: `improve-codebase-architecture`, `zoom-out`.
- Review and release: `requesting-code-review`, `verification-before-completion`, `finishing-a-development-branch`.
- Security: `security-review`, `security-best-practices`, `security-threat-model`.
- UI quality: `frontend-ui-ux`, `visual-verdict`, `awesome-design-md` references, or a project `DESIGN.md`.

If a specialist skill is heavy, experimental, unavailable, or mismatched to the environment, follow the equivalent workflow manually instead of forcing the tool.

## Contrarian Defaults

- Prefer fewer installed skills over a huge prompt surface.
- Prefer one accountable agent flow over many parallel agents until the plan is decomposed cleanly.
- Prefer evidence over vibes: logs, tests, screenshots, diffs, traces, and reproducible commands.
- Prefer boring stacks: TypeScript, Python, Go, Postgres, Redis, standard cloud primitives, and managed auth unless the repo dictates otherwise.
- Prefer buying commodity infrastructure and building only the product-specific differentiator.
- Treat autonomous execution as a privilege earned by clear plans and strong verification.

## Nontechnical User Communication

Use short decision briefs:

```text
Recommendation: <what to do>
Why it matters: <user/business impact>
Tradeoff: <cost/risk/complexity>
Verification: <how we will know it works>
```

Avoid unexplained jargon. When jargon is necessary, define it in one sentence and keep moving.

## Stop Conditions

Pause and ask before:

- Deleting data, rewriting history, force-pushing, rotating production credentials, or changing billing-critical logic.
- Installing large workflow frameworks or persistent agent runtimes.
- Making irreversible architecture choices when the business requirement is still unclear.
- Proceeding when tests cannot run and the change is high-risk.
