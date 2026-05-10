# Buildloop

[![CI](https://github.com/mithunyc/buildloop/actions/workflows/ci.yml/badge.svg)](https://github.com/mithunyc/buildloop/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-v2.0.0-green.svg)](https://github.com/mithunyc/buildloop/releases/tag/v2.0.0)

**Spec-to-production control plane for AI-assisted software delivery.**

Curated skills, templates, schemas, and gate scripts that give AI coding agents (Codex, Claude Code, Cursor, Antigravity) enterprise-grade planning, verification, security, and release discipline — on any stack.

---

## Who This Is For

- **Nontechnical founders** who want AI agents to build software without losing control.
- **Product owners** who need PRDs, scope control, and release readiness.
- **Developers** who want stricter testing, debugging, review, and security workflows.
- **Teams** who want AI agents to follow evidence-based delivery instead of open-ended vibe coding.

---

## Install In One Command

Restart your AI coding agent after installing.

### macOS / Linux

**OpenAI Codex**
```bash
curl -fsSL https://raw.githubusercontent.com/mithunyc/buildloop/main/scripts/install.sh | bash -s -- --target codex
```

**Claude Code**
```bash
curl -fsSL https://raw.githubusercontent.com/mithunyc/buildloop/main/scripts/install.sh | bash -s -- --target claude
```

**Cursor**
```bash
curl -fsSL https://raw.githubusercontent.com/mithunyc/buildloop/main/scripts/install.sh | bash -s -- --target cursor
```

**Google Antigravity**
```bash
curl -fsSL https://raw.githubusercontent.com/mithunyc/buildloop/main/scripts/install.sh | bash -s -- --target antigravity
```

**All agents at once**
```bash
curl -fsSL https://raw.githubusercontent.com/mithunyc/buildloop/main/scripts/install.sh | bash -s -- --target all
```

---

### Windows (PowerShell)

**OpenAI Codex**
```powershell
powershell -ExecutionPolicy Bypass -Command "$p=Join-Path $env:TEMP 'install.ps1'; Invoke-WebRequest 'https://raw.githubusercontent.com/mithunyc/buildloop/main/scripts/install.ps1' -OutFile $p; & $p -Target codex"
```

**Claude Code**
```powershell
powershell -ExecutionPolicy Bypass -Command "$p=Join-Path $env:TEMP 'install.ps1'; Invoke-WebRequest 'https://raw.githubusercontent.com/mithunyc/buildloop/main/scripts/install.ps1' -OutFile $p; & $p -Target claude"
```

**Cursor**
```powershell
powershell -ExecutionPolicy Bypass -Command "$p=Join-Path $env:TEMP 'install.ps1'; Invoke-WebRequest 'https://raw.githubusercontent.com/mithunyc/buildloop/main/scripts/install.ps1' -OutFile $p; & $p -Target cursor"
```

**Google Antigravity**
```powershell
powershell -ExecutionPolicy Bypass -Command "$p=Join-Path $env:TEMP 'install.ps1'; Invoke-WebRequest 'https://raw.githubusercontent.com/mithunyc/buildloop/main/scripts/install.ps1' -OutFile $p; & $p -Target antigravity"
```

**All agents at once**
```powershell
powershell -ExecutionPolicy Bypass -Command "$p=Join-Path $env:TEMP 'install.ps1'; Invoke-WebRequest 'https://raw.githubusercontent.com/mithunyc/buildloop/main/scripts/install.ps1' -OutFile $p; & $p -Target all"
```

---

## Install Targets

| Target | Install Directory | Confidence |
|--------|-------------------|------------|
| `codex` | `$CODEX_HOME/skills` or `~/.codex/skills` | Proven |
| `claude` | `~/.claude/skills` | Proven |
| `cursor` | `~/.cursor/skills` | Experimental |
| `antigravity` | `~/.gemini/antigravity/skills` | Experimental |

> **Security note:** These are remote one-line installers. Read `scripts/install.*` before running on sensitive machines. See [SECURITY.md](SECURITY.md).

---

## Prefer Inspecting First?

```bash
git clone https://github.com/mithunyc/buildloop.git
cd buildloop
bash scripts/install.sh --target codex          # macOS / Linux
```

```powershell
git clone https://github.com/mithunyc/buildloop.git
cd buildloop
powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1 -Target codex   # Windows
```

---

## Skill Tiers

Choose the tier that matches your project complexity. The installer prompts you to select a tier.

| Tier | Skills | Best For |
|------|--------|----------|
| **MINIMAL** | `enterprise-ai-dev`, `karpathy-guidelines`, `brainstorming`, `tdd`, `diagnose` — **5 skills** | Solo developers, small context windows, simple projects |
| **CORE** | Everything in MINIMAL + `awesome-design-md`, `caveman`, `writing-plans`, `executing-plans`, `grill-with-docs`, `verification-before-completion`, `security-best-practices` — **12 skills** | Default. Covers 80% of projects. |
| **FULL** | Everything in CORE + `grill-me`, `triage`, `improve-codebase-architecture`, `zoom-out`, `finishing-a-development-branch`, `requesting-code-review`, `security-threat-model`, `setup-matt-pocock-skills` — **20 skills** | Teams, complex projects, full audit trail |
| **CONTRIBUTOR** | `write-a-skill` — for skill authors | Writing or publishing new skills |

Tier counts are derived from [`curated-skills.json`](curated-skills.json) and validated by CI.

---

## Verify Your Installation

Start a fresh agent session and use this exact prompt:

```text
Use enterprise-ai-dev as my master CTO orchestrator for this repo.
```

If the agent does not see the skill, restart the app. If it still does not respond correctly, install to the project-local skills directory for that agent.

---

## The Lifecycle (What the Agent Does)

Two phases. Every project uses both.

### Planning Phase — Steps 0–8
Produces PRD, architecture decision, slice contracts, and human approval before any code is written.

| Step | What Happens |
|------|-------------|
| **0 — Classify** | Detects GREENFIELD, BROWNFIELD, GOVERNED, REVIEW\_ONLY, or AUTONOMOUS profile |
| **1A — Minimal Audit** | `git status`, branch, runtime, package manager, existing governance files |
| **1B — Full Diagnostic** | Brownfield only. Runs lint / test / build. Produces `diagnostic_baseline.md`. Blocks features if broken. |
| **2 — PRD** | Gathers requirements. Asks only questions that affect architecture, risk, or UX. |
| **3 — Adversarial Spec** | Stress-tests the PRD. Risk-scaled probes: Low=1–2, Medium=3, High=5–7. |
| **4 — Architecture Checkpoint** | Simplest version that works. Karpathy check: not overcomplicated? |
| **7 — Slice Contract** | Defines `allowed_files`, `blast_radius`, `evidence_required` per story. |
| **8 — Human Approval** | DECISION REQUIRED gate. No execution without approval. |

### Execution Phase — Steps 9–16
Deterministic gates with an independent witness. No self-grading.

| Step | What Happens |
|------|-------------|
| **9 — TDD** | Red-green-refactor inside slice boundaries. Characterization tests first for brownfield. |
| **11 — Gate Runner** | Reads `.buildloop.yml`, executes commands, writes `gate-results.json`. |
| **12 — AI Review** | Independent reviewer reads `gate-results.json`. Produces GO / CONDITIONAL\_GO / NO\_GO. |
| **14 — PR / Preview** | Evidence receipt references `gate-results.json`. No receipt = no merge. |

---

## What's in the Repo

```
skills/             Local skills installed directly (enterprise-ai-dev, awesome-design-md, …)
templates/          Reusable governance artifacts (PRD, slice contracts, receipts, AGENTS template)
schemas/            JSON schemas validating all frontmatter and YAML contracts
reference/          Deep-reference docs for the lifecycle (phase engine, security triggers, …)
playbooks/          System optimization and skill acquisition playbooks
scripts/            gate-runner.mjs, validate-manifest.mjs, audit-upstream.mjs, installers
examples/           Working greenfield and brownfield fixture walkthroughs
tests/              install.test.mjs — validates the whole distribution on every CI run
docs/               ROADMAP.md, BUILD_SPEC.md
curated-skills.json Upstream skill registry with pinned commit SHAs
```

---

## What's New in v2.0.0

- **`enterprise-ai-dev` orchestrator** — greenfield, brownfield, governed, and autonomous profiles; claim labels (FACT / INFERENCE / JUDGMENT / UNVERIFIED); delegation rules.
- **Templates** — PRD, slice contracts, evidence receipts, adversarial review, diagnostic baseline, handoff, AGENTS.md template.
- **Schemas** — JSON Schema draft-07 validation for all frontmatter contracts.
- **Gate runner** — reads `.buildloop.yml`, executes quality gates, writes `gate-results.json` as independent witness.
- **Brownfield bootstrap compiler** — `orchestrator-manifest.json` schema for machine-readable repo governance.
- **Supply chain pinning** — upstream skills pinned to full SHA commits in `curated-skills.json`.
- **CI** — validates templates, schemas, and scripts on every push.
- **Reference docs** — phase engine, security triggers, architecture boundaries, quality gates, drift control, autonomous execution.
- **Examples** — greenfield walkthrough and brownfield diagnostic fixture.

---

## Design Philosophy

- Prefer fewer default skills over a huge prompt surface.
- Prefer upstream provenance over vendored copies.
- Prefer boring, proven engineering practices over framework theater.
- Prefer evidence: tests, builds, diffs, logs, reproducible commands.
- Treat autonomous agents as useful only after requirements and verification are clear.
- Read remote installer scripts before running on sensitive machines.

---

## License

Original skills in this repository are MIT licensed. Upstream skills are installed from their source repositories under their upstream licenses.
