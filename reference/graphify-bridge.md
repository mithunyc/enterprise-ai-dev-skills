# Graphify Bridge — Advisory Integration

> Buildloop public reference for Graphify graph analysis integration. Advisory only.

---

## Classification

**Status: ADVISORY ONLY**

Graphify graph output is a supplementary analysis tool. Graph edges represent **inferences about code relationships, not verified facts**. They cannot replace tests, quality gates, or manual review.

Graph output is ephemeral. It should not be committed to the repository.

---

## Detection

Buildloop detects Graphify availability by checking command availability:

- `graphify --version` — exit code 0 indicates Graphify is installed.

If Graphify is not found, the capability is reported as `available: false` and no graph interaction occurs. This is the expected default.

### Schema Enforcement

The `orchestrator-manifest.schema.json` enforces `advisory_only: const: true` on the `external_memory.graphify` object (schema lines 427–430). A manifest that sets `advisory_only` to `false` will fail schema validation. This constraint is structural and cannot be bypassed by configuration alone.

---

## Execution Rules

### User-Initiated Only

Buildloop never runs Graphify automatically. The user must run Graphify manually to generate or update graph output. Buildloop may read existing graph output if present, but it never triggers indexing, re-indexing, or graph generation.

**Auto-indexing is forbidden.** Buildloop never calls `graphify index`, `graphify scan`, or any command that modifies graph state.

### Ephemeral Output

Graph output files (typically in `.graphify/` or similar directories) are working artifacts. They:

- Should not be committed to git
- Should not appear in PRs or CI artifacts
- Should be treated as machine-local cache

Buildloop's own `.gitignore` includes `.graphify/` so generated graph output is not accidentally committed from this repository. Downstream repos should make the same choice before storing Graphify output in their working tree.

### Stale Check

Graph output can become stale as the codebase evolves. Before consuming graph data, the orchestrator should compare:

- **Graph output mtime** — filesystem last-modified time of the graph output file
- **Latest git commit timestamp** — `git log -1 --format=%ct`

If the graph output is older than the latest commit, the data is flagged as potentially stale and a warning is surfaced:

```
[STALE GRAPH] Graph output last modified 2026-05-10T14:00:00Z.
Latest commit: 2026-05-12T09:30:00Z. Graph may not reflect current code.
```

### Character Budget

Each graph query or summary consumed by the orchestrator is capped at **2000 characters**. If graph output exceeds this limit, the read MUST be truncated and a warning MUST be appended.

Example truncation warning:

```
[TRUNCATED] Graph output exceeded 2000 character budget. 1523 characters omitted.
```

---

## Failure Modes

### Stale Graph

The most common failure. Graph output reflects a past state of the codebase. Dependencies added, removed, or restructured after the last Graphify run will not appear in the graph.

**Mitigation:** Stale check (mtime vs git commit timestamp). Always label graph-derived claims as `INFERENCE — graph source, last indexed [timestamp]`. Never treat stale graph data as current truth.

### False Dependency Inference

Graphify infers relationships from code structure (imports, function calls, file proximity). These inferences can be wrong:

- A file may import a module it never actually calls
- Transitive dependencies may be over-counted
- Dynamic imports or runtime bindings are invisible to static analysis
- Circular dependency detection may produce false positives

**Mitigation:** Graph edges are labeled INFERENCE, not FACT. The orchestrator must cross-reference graph claims against actual test results, runtime behavior, and manual review. A graph edge alone is never sufficient to justify an architectural decision.

### Private Data Leakage

Graph output may encode private file paths, internal module names, proprietary architecture patterns, or sensitive dependency information. Graph data must never appear in:

- Public commits or PRs
- CI logs or artifacts
- Shared receipts or reports
- Any file tracked by git in a public repo

**Mitigation:** Graph data is consumed in-session only. Any graph-derived insight that enters the repo must be generalized and stripped of private details before commit.

### Over-Trusting Graph Edges

The most dangerous failure mode. If the orchestrator treats graph inferences as verified facts, it may:

- Skip tests because the graph says modules are independent
- Approve changes because the graph shows no downstream impact
- Miss breaking changes because the graph is stale

**Mitigation:** Graph output is ADVISORY. It supplements but never replaces:

1. Test suite results
2. Quality gate output
3. Manual code review
4. CI pipeline results

If graph data conflicts with test results or gate output, the graph data is discarded.

---

## What This Document Does NOT Cover

- Runtime bridge code (forbidden in Phase 7)
- Auto-indexing or graph generation (forbidden)
- Graphify installation or configuration (user responsibility)
- Graph query API design (not implemented)

---

*Source: buildloop/reference/graphify-bridge.md*
