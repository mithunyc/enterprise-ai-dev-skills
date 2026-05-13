# Obsidian Bridge — Advisory Integration

> Buildloop public reference for Obsidian vault integration. Advisory only.

---

## Classification

**Status: ADVISORY ONLY**

Obsidian vault content is a supplementary knowledge source. It is never treated as authoritative truth. Repo truth — files, `git status`, latest commit, command output — always outranks vault truth.

Vault lessons are **candidates only**. They are never auto-promoted into governance, tests, or code. A human must review and explicitly approve any vault-derived insight before it enters the repo.

---

## Detection

Buildloop detects Obsidian configuration through two sources, checked in order:

1. **Environment variable:** `BUILDLOOP_OBSIDIAN_VAULT` — absolute path to the vault root.
2. **Manifest configuration:** `external_memory.obsidian` in a local `orchestrator-manifest.json` file. When configured, the manifest requires both `vault_path` and `project_folder` so reads can stay scoped to one project capsule instead of the entire vault.

If neither source is present, Obsidian is reported as `configured: false` and no vault interaction occurs. This is the expected default for most repos.

### Schema Enforcement

The `orchestrator-manifest.schema.json` enforces `advisory_only: const: true` on the `external_memory.obsidian` object (schema lines 405–408). A manifest that sets `advisory_only` to `false` will fail schema validation. This constraint is structural and cannot be bypassed by configuration alone.

---

## Reading Rules

### Explicit Path Only

Vault reads are restricted to explicitly configured project capsule or index files. The orchestrator MUST specify the exact file path within the vault to read.

**Full vault scans are forbidden.** The orchestrator never enumerates vault contents, never walks directory trees, and never reads files outside the configured project folder path.

### Character Budget

Each vault read is capped at **4000 characters**. If the content of a requested file exceeds this limit, the read MUST be truncated and a warning MUST be appended to the output indicating that content was cut.

Example truncation warning:

```
[TRUNCATED] Vault file exceeded 4000 character budget. 2341 characters omitted.
```

### No Write Operations

In Phase 7, Buildloop MUST NOT write to Obsidian. No note creation, no note modification, no metadata updates, no link insertion. The integration is strictly read-only.

### No Auto-Scan

Buildloop never automatically scans the vault for relevant content. All reads require an explicit path derived from manifest configuration or operator instruction.

### No Auto-Promote

Lessons, patterns, or insights retrieved from Obsidian are labeled as ADVISORY candidates. They are never automatically applied to:

- Governance files (AGENTS.md, STATE.md, overrides)
- Quality gates or test suites
- Code or configuration
- Lessons-learned / immune system files

Promotion requires explicit human review and approval.

---

## Failure Modes

### Stale Notes

Vault notes may not reflect the current repo state. A note written during Sprint 3 may reference architecture that was restructured in Sprint 7. The orchestrator must treat vault content as potentially stale and cross-reference against current repo truth before surfacing it.

**Mitigation:** Always verify vault-derived claims against `git log`, current file contents, and test results. Label unverified claims as `UNVERIFIED — vault source`.

### Overread

Reading too much vault content wastes context budget and dilutes the signal-to-noise ratio. Full-vault ingestion would consume thousands of tokens with marginal value.

**Mitigation:** 4000 character budget per read. Explicit path only. No directory walks. No recursive reads.

### Private Data Leakage

Obsidian vaults often contain personal notes, private project details, meeting transcripts, credentials, and other sensitive content. Vault content must never appear in:

- Public commits or PRs
- CI logs or artifacts
- Shared receipts or reports
- Any file tracked by git in a public repo

**Mitigation:** Vault content is consumed in-session only. It is never persisted to disk in the repo tree. Any vault-derived insight that enters the repo must be generalized and stripped of private details before commit.

### Authority Confusion

The most dangerous failure mode. If vault notes contradict repo governance files, the orchestrator might follow vault instructions over repo truth.

**Mitigation:** The authority chain is fixed:

1. Current repo truth (files, git state, command output)
2. Governance files (AGENTS.md, manifests, schemas)
3. Task state (STATE.md, receipts)
4. Vault content (ADVISORY only — never overrides items 1–3)

If vault content conflicts with any higher-authority source, the vault content is discarded and the conflict is reported to the human operator.

---

## What This Document Does NOT Cover

- Runtime bridge code (forbidden in Phase 7)
- Vault write operations (not implemented)
- Vault indexing or search (not implemented)
- Obsidian plugin development (out of scope)

---

*Source: buildloop/reference/obsidian-bridge.md*
