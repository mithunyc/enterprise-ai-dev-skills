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

## Install

From a cloned copy of this repo:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1
```

Or on macOS/Linux:

```bash
bash scripts/install.sh
```

Restart Codex after installing skills.

## Design Philosophy

- Prefer fewer default skills over a huge prompt surface.
- Prefer upstream provenance over vendored copies.
- Prefer boring, proven engineering practices over framework theater.
- Prefer evidence: tests, builds, screenshots, logs, diffs, and reproducible commands.
- Treat autonomous agents as useful only after requirements and verification are clear.

## Suggested First Use

After installation, start a new Codex session and say:

```text
Use enterprise-ai-dev to plan and build this product end to end.
```

For an existing repo, first run:

```text
Use setup-matt-pocock-skills for this repo, then use enterprise-ai-dev.
```

## License

The original wrapper skills in this repository are MIT licensed. Upstream skills are installed from their original repositories and remain under their upstream licenses.
