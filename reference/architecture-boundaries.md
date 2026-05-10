# Architecture Boundaries

> Extracted and generalized from AGENTS_v3.3 §17, §17.2, §17.3. Stack-agnostic reference for the enterprise-ai-dev skill.

---

## Default Boundary Model

Structure code in four layers. Each layer has a defined responsibility. Crossing boundaries is a defect, not a shortcut.

### Core / Domain

- Business rules
- Pure logic where practical
- No imports from frameworks, UI libraries, or vendor SDKs

### Contracts

- Schemas and interfaces
- Request/response contracts
- Shared types where needed
- Zero runtime code — types and shapes only

### Adapters / Integrations

- Storage implementations
- Vendor SDKs
- Provider-specific glue
- Imports only from contracts

### App Surface

- Routes, controllers, handlers
- Screens and components
- Thin orchestration only — no business logic here

---

## Boundary Checks

Run these checks when reviewing any architecture change:

- Vendor imports in domain/core
- Business rules in handlers or controllers
- Framework leakage into shared logic
- Contract drift across app surfaces
- Oversized handlers or modules

---

## Thin Handler Rule

A handler is thin only if it mainly:

1. Parses and validates input
2. Delegates to service or domain logic
3. Maps output and errors

If business rules, branching complexity, or side-effect orchestration dominate the handler body, it is **not** thin. The label "thin handler" is not proof of good structure — only the content is.

---

## Deep Module Thinking

*(From "A Philosophy of Software Design" — John Ousterhout)*

A deep module has a small interface hiding a large implementation. Deep modules are more testable, more AI-navigable, and enable testing at the boundary rather than inside.

**When designing a module, prefer:**

- Fewer public methods hiding more internal complexity
- Interfaces that rarely change even when implementation evolves
- Modules testable through their public interface alone

**When reviewing architecture, ask:**

- Where does understanding one concept require bouncing between many small files?
- Where are modules so shallow that the interface is nearly as complex as the implementation?
- Where have pure functions been extracted just for testability, but the real bugs hide in how they are called?

**Apply deep module thinking especially to:**

- State machines (one `transition()` method hiding all valid/invalid paths)
- Aggregation or assembly functions (one `assemble()` method hiding per-section fetch/timeout/fallback)
- External provider adapters (one `execute()` method hiding provider routing, prompt construction, response parsing)
- Connector framework (one `run()` method hiding auth, retry, mapping, error handling)

This exists because shallow modules multiply the surfaces where bugs hide.

---

## Design-It-Twice for Critical Interfaces

Before implementing a critical interface, generate at least 2 radically different designs and compare them.

**When to apply:**

- Any interface that 3+ other modules will depend on
- Any interface that future phases may extend
- Any adapter that must support multiple providers
- Any contract shared between multiple surfaces

**Process:**

1. State the requirements and constraints
2. Sketch Design A (minimize: fewest methods, simplest params)
3. Sketch Design B (maximize: most flexible, handles future use cases)
4. Compare on: interface simplicity, implementation efficiency, depth, ease of correct use vs ease of misuse
5. Choose or synthesize
6. Document the decision and what was rejected

This exists because the first interface design is rarely the best. The cost of redesigning a widely-consumed interface exceeds the cost of thinking twice upfront.

---

*Source: AGENTS_v3.3 §17, §17.2, §17.3*
