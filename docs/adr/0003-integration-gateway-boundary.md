---
id: ADR-0003
title: Make Integration Gateway the Primary Component View
status: accepted
date: 2026-07-16
owners: [architecture]
decision_area: integration
tags: [integration, adapters, validation, idempotency, quarantine, canonical-model, eventing]
supersedes: []
superseded_by: null
related: [ADR-0001, ADR-0002]
---

# ADR-0003: Make Integration Gateway the Primary Component View

## Context

Partner integration is the core product proof point. External systems will vary widely in formats, quality, identifiers, and timing.

## Decision

Model Integration Gateway explicitly with adapters, validation, canonical mapping, idempotency, quarantine, and event publishing.

## Rationale

- Makes the main technical claim inspectable.
- Shows how invalid data is handled safely instead of silently corrupting inventory state.
- Creates a clear path for adding more partner adapters over time.

## Options Considered

| Option | Pros | Cons | Complexity | When Valid |
|---|---|---|---|---|
| Direct partner calls to Inventory API | Fewer moving parts | Pushes partner-specific logic into core domain | Low | Single trusted source only |
| Integration Gateway boundary | Clear adapter layer, validation, quarantine, traceability | More design and implementation work | Medium | Current Phase 1 |
| Full integration platform/iPaaS | Broad connector ecosystem | Cost and operational dependency | High | Enterprise rollout with many partners |

## Trade-offs

- More up-front design detail in the integration boundary.
- Requires clear canonical schemas before implementation.

## Consequences

- Positive: Cleaner domain model and safer ingestion.
- Negative: Integration Gateway becomes a critical path component.
- Mitigation: Add trace IDs, quarantine workflow, and explicit adapter contracts early.

## Revisit Triggers

- A partner requires real-time bidirectional synchronization.
- Canonical schema versioning becomes a recurring operational concern.

## References

- [Integration Gateway D2 Diagram](../../architecture/d2/component-integration-gateway.d2)
- [Structurizr Workspace](../../architecture/workspace.dsl)

