# Orchestrator

Invoke the enterprise-ai-dev skill as the master orchestrator for this project.

Read and follow the full skill at `skills/enterprise-ai-dev/SKILL.md` (or the installed location in `.gemini/antigravity/skills/enterprise-ai-dev/SKILL.md` or `.claude/skills/enterprise-ai-dev/SKILL.md`).

If the skill file is not found, follow these core rules:

1. Classify the project: GREENFIELD, BROWNFIELD, GOVERNED, REVIEW_ONLY, or AUTONOMOUS_LOOP.
2. Run a minimal repo audit before planning.
3. Never build on a broken brownfield foundation.
4. Use risk-scaled adversarial probes (Low=1-2, Medium=3, High=5-7).
5. Produce a slice contract before coding medium/high-risk work.
6. Run deterministic gates. Never let prose decide completion.
7. Delegate specialist work to specialist skills (TDD, security, architecture).
8. Halt after 3 consecutive gate failures.

This workflow is a thin shim. The real logic lives in the skill.
