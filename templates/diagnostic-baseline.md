---
type: diagnostic-baseline
repo_state: B               # A | B | C | D (see §5.1 of AGENTS.md)
health:
  install: unknown          # ok | warn | fail | unknown
  tests: unknown            # ok | warn | fail | unknown | none
  lint: unknown             # ok | warn | fail | unknown
  typecheck: unknown        # ok | warn | fail | unknown | n/a
  ci: unknown               # ok | warn | fail | unknown | n/a
  build: unknown            # ok | warn | fail | unknown
stabilization_required: false
---

# Diagnostic Baseline Template

Use this for brownfield repos (State B or D) before any feature work.
Complete the audit first. If `stabilization_required: true`, block features until foundation is verified.

---

## Audit Checklist

Run these commands and record results. Do not skip steps.

### 1. Repo Shape

```bash
# [CUSTOMIZE] Replace with your package manager and runtime
ls -la                          # directory structure
cat package.json 2>/dev/null    # or Cargo.toml, go.mod, pyproject.toml
```

```text
PROJECT AUDIT REPORT

Repo shape:
Framework/runtime:
Package manager:
App surfaces:       # web / mobile / API / desktop / combination
Data stores:
```

### 2. Health Check

```bash
# [CUSTOMIZE] Replace with your actual commands
[YOUR_PACKAGE_MANAGER] install  # or equivalent
[YOUR_LINT_COMMAND]
[YOUR_TYPECHECK_COMMAND]
[YOUR_TEST_RUNNER]
[YOUR_BUILD_COMMAND]
```

```text
Health:
- install:   [ok / warn: <detail> / fail: <detail>]
- lint:      [ok / warn: N warnings / fail: N errors]
- typecheck: [ok / warn / fail / n/a]
- test:      [ok: N passed / warn: N skipped / fail: N failed / none]
- build:     [ok / warn / fail]
```

### 3. CI / Runtime Parity

```bash
cat .github/workflows/*.yml 2>/dev/null    # or .circleci/, Jenkinsfile, etc.
cat .nvmrc 2>/dev/null || cat .tool-versions 2>/dev/null
```

```text
CI/runtime:
- workflow files: [list or none]
- runtime/version files: [list or none]
- parity risks: [e.g. "CI uses Node 20, local uses Node 18"]
```

### 4. Governance Audit

```bash
ls -la AGENTS.md CLAUDE.md SKILL.md 2>/dev/null
ls -la tasks/ docs/ 2>/dev/null
```

```text
Governance:
- current authority files: [list]
- contradictions: [none / describe]
- stale files: [none / describe]
- missing critical controls: [none / list]
```

### 5. Architecture Spot Check

```text
Architecture:
- obvious boundary violations: [none / describe]
- oversized modules/handlers: [none / list with line count]
- critical paths with weak coverage: [none / list]
```

### 6. Git State

```bash
git status --short
git branch --show-current
git log -1 --oneline
```

```text
Git state:
- branch: [name]
- clean: yes / no (list dirty files if no)
- detached head: yes / no
```

### 7. Risk Register

```text
Risk register:
- critical: [list or none]
- high: [list or none]
- medium: [list or none]
- low: [list or none]
```

---

## Recommended Path

Select exactly one:

| Path | When to use |
|------|------------|
| **overlay only** | Codebase is stable; just add governance |
| **stabilize then continue** | Build/tests/lint fail; fix foundation first |
| **contain and carve** | One broken subsystem; isolate it before expanding |
| **restructure** | Current shape blocks safe delivery and local fix is insufficient |

**Default:** overlay only, or stabilize then continue.
Broad restructure requires explicit human approval.

---

## Stabilization Decision

```text
STABILIZATION DECISION

Recommended path: [overlay only / stabilize then continue / contain and carve / restructure]
Reason: [1–2 sentences]
Stabilization required: yes / no

If yes — blocking issues to fix before feature work:
1. [issue]
2. [issue]

Estimated effort: [hours/days]
```

---

*Source: enterprise-ai-dev-skills/templates/diagnostic-baseline.md | Upstream: AGENTS_v3.3 §6.4*
