---
type: prd
status: DRAFT               # DRAFT | APPROVED
stories_count: 0
acceptance_criteria_complete: false
---

# Product Requirements Document (PRD) Template

Complete this before any slice contracts or implementation.
The PRD must be APPROVED before coding starts. DRAFT status blocks coding.

---

## PRD Template

```text
PRD: [Product / Feature Name]
Version: [1.0]
Status: DRAFT / APPROVED
Approved by: [human name or "pending"]
Approved on: [date or "pending"]

---

## 1. Problem Statement

[1–3 sentences. What problem does this solve? Who has the problem?]

## 2. Target Users

[Who are the primary users? Non-technical description is fine.]

## 3. Desired Outcome

[What does success look like for the user? Describe the end state, not the solution.]

## 4. MVP Boundary

In scope for this release:
- [Feature 1]
- [Feature 2]

Explicitly out of scope:
- [Feature A — deferred to v2]
- [Feature B — intentionally excluded]

## 5. User Stories

### US-001: [Story title]
Priority: [1=highest]
As a [user type], I want to [action], so that [benefit].

Acceptance criteria:
- [ ] [Measurable criterion — verifiable by command or observation]
- [ ] [Another criterion]
- [ ] [Edge case or negative path]

### US-002: [Story title]
Priority: [2]
As a [user type], I want to [action], so that [benefit].

Acceptance criteria:
- [ ] [Criterion]

## 6. Non-Functional Requirements

Performance:
- [e.g. page loads under 2s on 3G]

Security:
- [e.g. all endpoints require authentication]
- [e.g. PII fields must not appear in logs]

Accessibility:
- [e.g. WCAG 2.1 AA for web surfaces]

## 7. Architecture Notes

[Any known constraints, existing patterns to follow, or decisions already made.
Keep brief — detailed ADRs go in docs/adr/]

## 8. Data Contract Notes

[Key data shapes, schemas, or API contracts. Link to separate doc if large.]

## 9. Open Questions

| # | Question | Owner | Resolved |
|---|----------|-------|---------|
| 1 | [question] | [human/agent] | no |

## 10. Approval

Human review required before coding:
- [ ] Problem statement is accurate
- [ ] MVP boundary is agreed
- [ ] All user stories have measurable acceptance criteria
- [ ] Out-of-scope items are explicit
- [ ] Open questions resolved or deferred

Status: DRAFT → APPROVED (human must change this)
```

---

## PRD Quality Checklist

Before marking APPROVED, verify:
- [ ] Every user story has at least 2 measurable acceptance criteria
- [ ] Out-of-scope items are explicitly listed (prevents scope creep)
- [ ] No acceptance criterion requires human judgment to evaluate ("looks good" is not a criterion)
- [ ] Security requirements are explicit if the feature touches auth, data, or payments
- [ ] `stories_count` in frontmatter matches actual story count
- [ ] `acceptance_criteria_complete: true` in frontmatter

---

*Source: buildloop/templates/PRD.md | Upstream: enterprise-ai-dev skill, AGENTS_v3.3 §2*
