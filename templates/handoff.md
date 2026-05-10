---
type: handoff
session_end: "[ISO 8601 timestamp — e.g. 2026-01-15T14:30:00Z]"
files_changed:
  - "[path/to/file1]"
  - "[path/to/file2]"
pending_blockers:
  - "[Describe any blocker that must be resolved before next session]"
  # If none: remove list items and write: "none"
next_command: "Read AGENTS.md, tasks/STATE.md, and this handoff. Resume from [exact task or file]."
---

# Session Handoff Template

Fill this at the end of every session before closing.
The next agent session MUST read this file before touching any code.

Save to: `tasks/receipts/handoff-[YYYY-MM-DD]-[slug].md`

---

## Handoff Template

```text
SESSION HANDOFF: [Date] — [Short description of session]

## What Was Done

[2–5 bullet points. Be specific. Link to receipts.]
- Implemented [X] — receipt: tasks/receipts/phase-N-slug.md
- Fixed [Y] — commit: [SHA]
- Documented [Z] — file: [path]

## Files Changed

[List every file created, modified, or deleted this session]
- created: [path]
- modified: [path]
- deleted: [path]

## Commit(s) This Session

[List each commit with SHA and message]
- [SHA] [commit message]

## Current State

Branch: [name]
Working tree: clean / dirty (list dirty files if dirty)
Last verified commit: [SHA]
Latest receipt: [path]

tasks/STATE.md updated: yes / no
If no — what was not updated and why:

## Pending Blockers

[List anything that must be resolved before the next session can proceed]
- [ ] [Blocker 1 — who owns it]
- [ ] [Blocker 2]
If none: None. Next session can proceed immediately.

## Open Decisions Awaiting Human Input

[List any decisions the human must make before the agent can continue]
- [ ] [Decision + options]
If none: None.

## Known Risks Carried Forward

[Risks from this session that are not yet resolved]
- [Risk + severity + mitigation plan]
If none: None.

## What Was NOT Finished

[Be honest. If you ran out of context or time, say so.]
- [Task left incomplete — describe exact stopping point]
- [What file or function to continue from]
If none: Session completed all planned work.

## Next Session's First Action

[Exact, unambiguous instruction for the next agent]
1. Read AGENTS.md
2. Read tasks/STATE.md
3. Read this handoff
4. Run: git status, git branch --show-current, git log -1 --oneline
5. [Specific next task — e.g. "Begin US-003 slice contract" or "Fix lint errors in src/api/"]
```

---

## Handoff Quality Rules

- Never say "done" for work you didn't verify
- If you ran out of context mid-task, say so explicitly in "What Was NOT Finished"
- `next_command` in frontmatter must be actionable in ≤30 seconds
- The next agent must be able to resume without any chat history

---

*Source: buildloop/templates/handoff.md | Upstream: AGENTS_v3.3 §9, synthesis*
