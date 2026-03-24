# Enterprise AI Dev Skills

Curated Codex skills for end-to-end AI-assisted software development with enterprise-grade planning, implementation, verification, security, UI quality, and release discipline.

This repo is intentionally small. It includes two original wrapper skills and a manifest for proven upstream specialist skills. The installer fetches specialist skills from their original repositories so users get clean provenance and easier updates.

## Who This Is For

- Nontechnical founders who want AI agents to build software without losing control.
- Product owners who need PRDs, scope control, and release readiness.
- Developers who want stricter testing, debugging, review, and security workflows.
- Teams that want AI coding agents to follow evidence-based software delivery instead of open-ended "vibe coding."

## Included Original Skills

- `enterprise-ai-dev`: top-level operating workflow for serious software work.
- `awesome-design-md`: lightweight wrapper for using curated `DESIGN.md` references without loading a giant catalog into every session.

## Curated Upstream Skills

The installer can add the following specialist skills globally:

- Requirements and alignment: `grill-with-docs`, `to-prd`, `brainstorming`, `writing-plans`
- Implementation discipline: `tdd`, `test-driven-development`, `executing-plans`
- Debugging: `diagnose`, `systematic-debugging`
- Architecture cleanup: `improve-codebase-architecture`, `zoom-out`
- Review and release: `requesting-code-review`, `verification-before-completion`, `finishing-a-development-branch`
- Security: `security-review`, `security-best-practices`, `security-threat-model`
- UI quality: `frontend-ui-ux`, `visual-verdict`, `awesome-design-md`

## Install From A Terminal

### OpenAI Codex

```powershell
powershell -ExecutionPolicy Bypass -Command "$p=Join-Path $env:TEMP 'enterprise-ai-dev-bootstrap.ps1'; Invoke-WebRequest 'https://raw.githubusercontent.com/mithunyc/enterprise-ai-dev-skills/main/scripts/bootstrap.ps1' -OutFile $p; & $p -Target codex"
```

```bash
curl -fsSL https://raw.githubusercontent.com/mithunyc/enterprise-ai-dev-skills/main/scripts/bootstrap.sh | bash -s -- --target codex
```

### Claude Code

```powershell
powershell -ExecutionPolicy Bypass -Command "$p=Join-Path $env:TEMP 'enterprise-ai-dev-bootstrap.ps1'; Invoke-WebRequest 'https://raw.githubusercontent.com/mithunyc/enterprise-ai-dev-skills/main/scripts/bootstrap.ps1' -OutFile $p; & $p -Target claude"
```

```bash
curl -fsSL https://raw.githubusercontent.com/mithunyc/enterprise-ai-dev-skills/main/scripts/bootstrap.sh | bash -s -- --target claude
```

### Cursor And Google Antigravity

Cursor and Google Antigravity skill discovery is less standardized than Codex and Claude Code. The installer supports the common directories below, but verify inside the target agent after installing.

```powershell
powershell -ExecutionPolicy Bypass -Command "$p=Join-Path $env:TEMP 'enterprise-ai-dev-bootstrap.ps1'; Invoke-WebRequest 'https://raw.githubusercontent.com/mithunyc/enterprise-ai-dev-skills/main/scripts/bootstrap.ps1' -OutFile $p; & $p -Target cursor"
```

```powershell
powershell -ExecutionPolicy Bypass -Command "$p=Join-Path $env:TEMP 'enterprise-ai-dev-bootstrap.ps1'; Invoke-WebRequest 'https://raw.githubusercontent.com/mithunyc/enterprise-ai-dev-skills/main/scripts/bootstrap.ps1' -OutFile $p; & $p -Target antigravity"
```

### Install Everywhere

This writes skills to Codex, Claude Code, Cursor, and Antigravity skill directories. Use this only if you actually use multiple agents.

```powershell
powershell -ExecutionPolicy Bypass -Command "$p=Join-Path $env:TEMP 'enterprise-ai-dev-bootstrap.ps1'; Invoke-WebRequest 'https://raw.githubusercontent.com/mithunyc/enterprise-ai-dev-skills/main/scripts/bootstrap.ps1' -OutFile $p; & $p -Target all"
```

```bash
curl -fsSL https://raw.githubusercontent.com/mithunyc/enterprise-ai-dev-skills/main/scripts/bootstrap.sh | bash -s -- --target all
```

Restart your AI coding agent after installing skills.

## Install Targets

| Target | Install directory | Confidence |
| --- | --- | --- |
| `codex` | `$CODEX_HOME/skills` or `~/.codex/skills` | Proven |
| `claude` | `~/.claude/skills` | Proven |
| `cursor` | `~/.cursor/skills` | Experimental |
| `antigravity` | `~/.gemini/antigravity/skills` | Experimental |

## Verify Installation

Ask your agent:

```text
List installed skills related to enterprise-ai-dev and explain when you would use them.
```

Then try:

```text
Use enterprise-ai-dev to plan a small production-ready feature.
```

If the agent does not see the skill, restart the app. If it still does not see it, install only to the project-local skills directory supported by that agent.

## Design Philosophy

- Prefer fewer default skills over a huge prompt surface.
- Prefer upstream provenance over vendored copies.
- Prefer boring, proven engineering practices over framework theater.
- Prefer evidence: tests, builds, screenshots, logs, diffs, and reproducible commands.
- Treat autonomous agents as useful only after requirements and verification are clear.
- Treat remote one-line installers as code execution. Read the scripts first if you are installing on a sensitive machine.

## Suggested First Use

After installation, start a new Codex session and say:

```text
Use enterprise-ai-dev to plan and build this product end to end.
```

For an existing repo, first run:

```text
Use setup-matt-pocock-skills for this repo, then use enterprise-ai-dev.
```

## Local Clone Install

If you prefer to inspect before installing:

```bash
git clone https://github.com/mithunyc/enterprise-ai-dev-skills.git
cd enterprise-ai-dev-skills
bash scripts/install.sh --target codex
```

On Windows:

```powershell
git clone https://github.com/mithunyc/enterprise-ai-dev-skills.git
cd enterprise-ai-dev-skills
powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1 -Target codex
```

## License

The original wrapper skills in this repository are MIT licensed. Upstream skills are installed from their original repositories and remain under their upstream licenses.
