---
name: orchestrator
description: Start Buildloop's enterprise-ai-dev CTO orchestrator for the current repository.
disable-model-invocation: true
---

# Buildloop Orchestrator

Use enterprise-ai-dev as my master CTO orchestrator for this repo.

Follow the installed `enterprise-ai-dev` skill as the source of truth. If that skill is not available, say that Buildloop is not installed for this Claude Code profile and ask the user to rerun the Buildloop installer.

If the user supplied extra command text, treat it as the task request:

`$ARGUMENTS`
