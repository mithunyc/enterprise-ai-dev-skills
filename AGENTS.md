# AGENTS.md - buildloop Governance

This repository builds and maintains `buildloop`: a small, public skill distribution for evidence-based AI software delivery. Treat this repo as the product and dogfood its own rules.

## Authority Order

1. Current repo truth: files, `git status`, latest commit, and command output.
2. Product plan and build contract: `docs/BUILD_SPEC.md` and `docs/ROADMAP.md`.
3. Current project state: `tasks/STATE.md`.
4. Templates and examples, including `templates/`, as contribution standards.
5. Prior notes, memory, or external summaries only when verified against this repo.

If authorities conflict, stop and report the conflict. Do not smooth it over.

## Bootstrap For Future Agents

Before conclusions or edits:

1. Read this `AGENTS.md`.
2. Run `git status --short`, `git branch --show-current`, and `git log -1 --oneline`.
3. Read `tasks/STATE.md`.
4. Read `docs/ROADMAP.md` and the current phase in `docs/BUILD_SPEC.md`.
5. Inspect the relevant files before editing them.
6. State assumptions, scope, plan, verification commands, and rollback.

## Scope Rules

- Preserve dirty work. Never revert unrelated changes or other people's edits.
- Keep edits inside the active task scope and allowed file list.
- Reuse existing repo patterns before adding new machinery.
- Do not start the next task or phase without an explicit instruction.
- If a requested change needs broader scope, stop and justify why.

## Public Surface Rules

- This is a public-facing repo. Keep docs, templates, examples, and scripts safe to publish.
- Do not publish internal audits, private scratch docs, secrets, customer data, or machine-local evidence unless intentionally product-facing.
- Keep generated artifacts out of the public tree unless they are part of the product contract.
- Use generalized examples. Do not leak private project names or implementation details.

## Quality Gates

Use the smallest relevant gate set for the touched area:

- Always for manifest/schema changes: `node scripts/validate-manifest.mjs`
- Always for upstream pin changes: `node scripts/audit-upstream.mjs`
- When `.buildloop.yml` is present: `node scripts/gate-runner.mjs`
- When touching installers: dry-run the relevant installer path, for example `powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1 -Target codex -Mode core -DryRun` or `bash scripts/install.sh --target codex --mode core --dry-run`.
- Before completion: `git diff --check` for touched files and a scoped `git diff`.

Do not claim success without command output or a clear reason the gate was not applicable.

## Contribution Standards

Use `templates/` as the source for public contribution artifacts:

- `templates/AGENTS.template.md` for downstream repo governance.
- `templates/evidence-receipt.md` for proof bundles.
- `templates/adversarial-review.md` for independent review.
- `templates/buildloop.yml.example` for deterministic gates.
- `templates/PRD.md`, `templates/phase-proposal.md`, `templates/slice-contract.md`, and `templates/handoff.md` for planning and execution flow.

Root `AGENTS.md` governs this repo. `templates/AGENTS.template.md` is a reusable product template for other repos; do not paste it here.

## Verification And Reporting

Final reports must include:

- Exact files changed.
- Commands run and outcomes.
- Evidence for key claims.
- Remaining risks and tradeoffs.
- Rollback path, usually `git restore -- <changed files>` before commit.
- Final verdict: `GO`, `CONDITIONAL_GO`, or `NO_GO`.

Truth over politeness. Evidence over assertion. If you cannot confirm something, say: "I cannot confirm this."
